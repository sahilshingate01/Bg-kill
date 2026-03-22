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

import asyncio
# Semaphore to limit concurrent processing. Essential for 512MB RAM environments.
# This prevents multiple large removals from crashing the container.
processing_semaphore = asyncio.Semaphore(1)

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
    
    # Use semaphore to queue request—only one removal at a time to save RAM
    async with processing_semaphore:
        try:
            from anyio import to_thread
            
            # Open with Pillow for check/resize metadata
            input_image = Image.open(io.BytesIO(contents))
            original_width, original_height = input_image.size
            
            # Robustness: Downscale massive images slightly if they would risk OOM
            # 2500px is safe for 512MB + rembg
            max_dim = 2500
            if max(original_width, original_height) > max_dim:
                logger.info(f"Downscaling from {original_width}x{original_height} for RAM safety")
                input_image.thumbnail((max_dim, max_dim), Image.LANCZOS)
                # Re-encode to bytes for rembg
                temp_bytes = io.BytesIO()
                input_image.save(temp_bytes, format="PNG")
                contents = temp_bytes.getvalue()
                # Update current dimensions
                current_width, current_height = input_image.size
            else:
                current_width, current_height = original_width, original_height

            logger.info(
                f"Processing: {file.filename} | "
                f"{original_width}x{original_height} (scaled to {current_width}x{current_height}) | "
                f"Size: {len(contents)/1024:.1f}KB"
            )
            
            # Select model based on mode
            session = session_portrait if mode == "portrait" else session_general
            
            # Run background removal in a thread with MAX QUALITY settings
            output_bytes = await to_thread.run_sync(
                lambda: remove(
                    contents,
                    session=session,
                    alpha_matting=True,
                    alpha_matting_foreground_threshold=240,
                    alpha_matting_background_threshold=10,
                    alpha_matting_erode_size=10,
                    post_process_mask=True
                )
            )
            
            logger.info(f"Output Size: {len(output_bytes)/1024:.1f}KB")
            
            return Response(
                content=output_bytes,
                media_type="image/png",
                headers={
                    "Content-Disposition": f"attachment; filename=bgkill_output.png",
                    "X-Original-Width": str(original_width),
                    "X-Original-Height": str(original_height),
                    "X-Output-Width": str(original_width),
                    "X-Output-Height": str(original_height),
                }
            )
            
        except Exception as e:
            logger.error(f"Processing failed: {str(e)}")
            raise HTTPException(500, f"Processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
