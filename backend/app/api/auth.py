from fastapi import APIRouter, Depends
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
    """
    Test endpoint to verify authentication.
    """
    return {
        "user_id": current_user.get("uid"),
        "email": current_user.get("email"),
        "name": current_user.get("name") or current_user.get("email"),
        "message": "You are securely verified by Firebase!"
    }
