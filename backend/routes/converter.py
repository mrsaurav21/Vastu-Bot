from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from services.ai_logic import detect_walls_from_image

# Removed the database and uuid imports since we aren't saving here anymore!

router = APIRouter()

class BlueprintRequest(BaseModel):
    image: str
    user_email: str = "guest" 

@router.post("/convert")
async def convert_blueprint(request: BlueprintRequest):
    """
    Processes a 2D blueprint image into 3D wall coordinates.
    DOES NOT SAVE TO DATABASE.
    """
    if not request.image:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No image data provided"
        )
    
    try:
        # 1. AI Processing Service
        walls = detect_walls_from_image(request.image)
        
        # 2. Response
        if not walls:
            return {
                "status": "empty",
                "message": "AI could not detect clear structural walls. Ensure high contrast.",
                "walls": []
            }
            
        return {
            "status": "success",
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