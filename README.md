# BG KILL - Background Remover

A powerful background remover built with Next.js and FastAPI using `rembg`.

## 🚀 Deployment Guide

### 1. Backend (Render)
The backend is a Python FastAPI service. We've included a `Dockerfile` for consistent deployment.

1.  Create a new **Web Service** on [Render](https://render.com).
2.  Connect your GitHub repository.
3.  Set the following:
    -   **Name**: `bgkill-api`
    -   **Root Directory**: `backend` (or use the provided `render.yaml` by connecting the whole repo)
    -   **Runtime**: `Docker`
4.  Add **Environment Variables**:
    -   `PORT`: `8000`
    -   `FRONTEND_URL`: `https://your-vercel-app.vercel.app` (optional, for tighter CORS)
5.  Render will build and deploy the Docker container automatically.

---

### 2. Frontend (Vercel)
The frontend is built with Next.js 14.

1.  Connect your repository to [Vercel](https://vercel.com).
2.  Set the **Root Directory** to `bgkill`.
3.  Add **Environment Variables**:
    -   `NEXT_PUBLIC_API_URL`: `https://bgkill-api.onrender.com` (use your actual Render URL here).
4.  Vercel will build and deploy your application.

---

## 🛠 Features

-   **Neubrutalist UI**: Bold design using Tailwind and Framer Motion.
-   **Batch Processing**: Remove backgrounds from multiple images at once.
-   **High Resolution**: Uses `u2net` models for professional-grade results.
-   **Zip Export**: Download all processed images as a single zip file.

## 🛠 Local Development

### Backend:
1.  Navigate to `/backend`.
2.  Install requirements: `pip install -r requirements.txt`.
3.  Start the app: `python main.py`.

### Frontend:
1.  Navigate to `/bgkill`.
2.  Install dependencies: `pnpm install`.
3.  Start development server: `pnpm dev`.

---

MIT License. Created by [RecallHQ](https://recall01.vercel.app).
