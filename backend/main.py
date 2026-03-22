from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove, new_session
from PIL import Image
import io
import logging

import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="BGKILL API", version="1.0.0")

# Allow CORS for the frontend (Vercel or local)
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    os.environ.get("FRONTEND_URL", "*")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if os.environ.get("FRONTEND_URL") is None else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pre-load model on startup for faster first request
# u2net = general purpose best quality
# u2net_human_seg = optimized for people/portraits
try:
    session_general = new_session("u2net")
    session_portrait = new_session("u2net_human_seg")
except Exception as e:
    logger.error(f"Failed to load models: {e}")
    session_general = None
    session_portrait = None

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_TYPES = {"image/png", "image/jpeg", "image/webp", "image/jpg"}

@app.get("/health")
async def health():
    return {"status": "ok", "models": ["u2net", "u2net_human_seg"]}

@app.post("/remove-background")
async def remove_background(
    file: UploadFile = File(...),
    mode: str = "auto"  # "auto" | "portrait" | "general"
):
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"Unsupported format: {file.content_type}")
    
    # Read file
    contents = await file.read()
    
    # Validate file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large. Max 50MB.")
    
    try:
        # Open with Pillow to validate and get metadata
        input_image = Image.open(io.BytesIO(contents))
        original_width, original_height = input_image.size
        original_mode = input_image.mode
        
        logger.info(
            f"Processing: {file.filename} | "
            f"{original_width}x{original_height} | "
            f"Mode: {original_mode} | Size: {len(contents)/1024:.1f}KB"
        )
        
        # Convert to RGBA if needed for processing
        if original_mode not in ("RGB", "RGBA"):
            input_image = input_image.convert("RGBA")
        
        # Convert back to bytes for rembg
        img_byte_arr = io.BytesIO()
        input_image.save(img_byte_arr, format="PNG")
        img_byte_arr = img_byte_arr.getvalue()
        
        # Select model based on mode
        # portrait mode is better for humans, general for objects/products
        session = session_portrait if mode == "portrait" else session_general
        
        # Run background removal
        # rembg preserves full resolution — no quality loss
        output_bytes = remove(
            img_byte_arr,
            session=session,
            alpha_matting=True,           # Better edge quality
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10,
            post_process_mask=True,        # Cleaner mask edges
        )
        
        # Verify output dimensions match input
        output_image = Image.open(io.BytesIO(output_bytes))
        logger.info(
            f"Output: {output_image.size} | "
            f"Mode: {output_image.mode} | "
            f"Size: {len(output_bytes)/1024:.1f}KB"
        )
        
        # Return as PNG (lossless, preserves transparency)
        return Response(
            content=output_bytes,
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=bgkill_output.png",
                "X-Original-Width": str(original_width),
                "X-Original-Height": str(original_height),
                "X-Output-Width": str(output_image.width),
                "X-Output-Height": str(output_image.height),
            }
        )
        
    except Exception as e:
        logger.error(f"Processing failed: {str(e)}")
        raise HTTPException(500, f"Processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
