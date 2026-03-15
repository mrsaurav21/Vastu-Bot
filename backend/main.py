import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, converter

app = FastAPI(
    title="Interior Design AI API",
    description="Backend for 2D to 3D Blueprint conversion and User Management",
    version="1.0.0"
)

# --- CORS Configuration ---
# Essential for allowing your React frontend (Vite) to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register Routers ---

# Google Authentication Routes (Login, Profile)
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# AI Image Processing Routes (2D to 3D conversion)
app.include_router(converter.router, prefix="/ai", tags=["AI Conversion"])

# --- Health Check ---

@app.get("/")
async def health_check():
    """
    Service health check to verify backend status.
    """
    return {
        "status": "online",
        "message": "AI Interior Designer Backend is active."
    }

# --- Server Entry Point ---

if __name__ == "__main__":
    # Running with uvicorn
    # 'main:app' refers to this file (main.py) and the FastAPI instance (app)
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)