from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from config.db import users_collection
from services.auth_service import verify_google_token

router = APIRouter()

class AuthRequest(BaseModel):
    token: str

@router.post("/google")
async def google_login(auth_data: AuthRequest):
    """
    Endpoint: Verifies user identity via Google and syncs profile with MongoDB.
    """
    # 1. Verify token via Service
    user_info = verify_google_token(auth_data.token)
    
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google token."
        )

    # 2. Extract specific user fields
    email = user_info.get("email")
    name = user_info.get("name")
    picture = user_info.get("picture")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account must have an associated email."
        )

    # 3. Construct user document
    user_profile = {
        "email": email,
        "name": name,
        "picture": picture,
        "role": "user"
    }

    try:
        # 4. Upsert User in MongoDB Atlas
        users_collection.update_one(
            {"email": email},
            {"$set": user_profile},
            upsert=True
        )

        return {
            "status": "success",
            "message": "User authenticated successfully",
            "user": user_profile
        }

    except Exception as e:
        print(f"Database error during auth: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save user profile to database."
        )