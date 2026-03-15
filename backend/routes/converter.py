import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from services.ai_logic import detect_walls_from_image
from config.db import projects_collection

router = APIRouter()

class BlueprintRequest(BaseModel):
    image: str
    user_email: str = "guest" # Optional: track which user uploaded it

@router.post("/convert")
async def convert_blueprint(request: BlueprintRequest):
    """
    Processes a 2D blueprint image into 3D wall coordinates and saves to the database.
    """
    if not request.image:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No image data provided"
        )
    
    try:
        # 1. AI Processing Service
        walls = detect_walls_from_image(request.image)
        
        # 2. Prepare Data for Database
        project_id = str(uuid.uuid4())
        project_data = {
            "project_id": project_id,
            "user_email": request.user_email,
            "timestamp": datetime.utcnow(),
            "wall_count": len(walls),
            "walls": walls,
            "status": "success" if walls else "empty"
        }

        # 3. Save to MongoDB Atlas (Persistent History)
        projects_collection.insert_one(project_data)

        # 4. Success Response
        if not walls:
            return {
                "status": "empty",
                "message": "AI could not detect clear structural walls. Ensure high contrast.",
                "walls": []
            }
            
        return {
            "status": "success",
            "project_id": project_id,
            "wall_count": len(walls),
            "walls": walls
        }

    except Exception as e:
        # Detailed error logging for debugging
        print(f"Server-side error in converter service: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="An error occurred during image-to-coordinate conversion."
        )