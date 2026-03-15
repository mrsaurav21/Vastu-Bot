import uuid
from datetime import datetime
from typing import List, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from config.db import projects_collection

# --- CRITICAL LINE: This must be named exactly 'router' ---
router = APIRouter()

# --- Data Models ---
class SaveProjectRequest(BaseModel):
    user_email: str
    walls: List[Any]
    project_name: str

# --- Routes ---

@router.post("/save")
async def save_project(request: SaveProjectRequest):
    """
    Manually saves a design when the user clicks 'Save Design' in the Editor.
    """
    try:
        project_id = str(uuid.uuid4())
        
        project_data = {
            "project_id": project_id,
            "project_name": request.project_name,
            "user_email": request.user_email,
            "timestamp": datetime.utcnow(),
            "wall_count": len(request.walls),
            "walls": request.walls
        }
        
        projects_collection.insert_one(project_data)
        
        return {
            "status": "success", 
            "message": "Saved successfully", 
            "project_id": project_id
        }
    except Exception as e:
        print(f"Error saving project: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save the project."
        )

@router.get("/{user_email}")
async def get_user_projects(user_email: str):
    """
    Retrieves all saved designs for a specific user to display on their Profile.
    """
    try:
        cursor = projects_collection.find({"user_email": user_email}).sort("timestamp", -1)
        
        projects = []
        for document in cursor:
            document["_id"] = str(document["_id"])
            projects.append(document)

        return {
            "status": "success",
            "count": len(projects),
            "projects": projects
        }

    except Exception as e:
        print(f"Error fetching projects: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve projects."
        )

@router.delete("/{project_id}")
async def delete_project(project_id: str, user_email: str):
    """
    Deletes a specific project from the database.
    Requires user_email as a query parameter for security verification.
    """
    try:
        result = projects_collection.delete_one({
            "project_id": project_id, 
            "user_email": user_email
        })
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Project not found or unauthorized to delete."
            )
            
        return {
            "status": "success", 
            "message": "Project deleted successfully."
        }
    except Exception as e:
        print(f"Error deleting project: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the project."
        )