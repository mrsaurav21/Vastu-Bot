import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all your modular route files
from routes import auth, converter, projects

app = FastAPI(
    title="Vastu-Bot AI API",
    description="Backend for 2D to 3D Blueprint conversion and User Management",
    version="1.0.0"
)

# --- CORS Configuration ---
# Essential for allowing your React frontend (Vite) to communicate with this API.
# Added 127.0.0.1 to ensure it never gets blocked during local testing.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register Routers ---

# Google Authentication Routes (Login, Profile)
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# AI Image Processing Routes (2D to 3D conversion)
app.include_router(converter.router, prefix="/ai", tags=["AI Conversion"])

# User Projects Routes (Retrieving saved designs)
app.include_router(projects.router, prefix="/projects", tags=["User Projects"])

# --- Health Check ---

@app.get("/")
async def health_check():
    """
    Service health check to verify backend status.
    """
    return {
        "status": "online",
        "message": "Vastu-Bot Backend is active and listening."
    }

# --- Server Entry Point ---

if __name__ == "__main__":
    # Running with uvicorn
    # 'main:app' refers to this file (main.py) and the FastAPI instance (app)
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)