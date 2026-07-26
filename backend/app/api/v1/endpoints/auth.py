from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.api.deps import get_current_user
from app.services import firebase_service

router = APIRouter()

# Pydantic Schemas
class UserOnboardSchema(BaseModel):
    targetRole: str
    targetCompanies: List[str]
    experienceLevel: str

class UserResponseSchema(BaseModel):
    uid: str
    email: Optional[EmailStr] = None
    fullName: Optional[str] = None
    avatarUrl: Optional[str] = None
    targetRole: Optional[str] = None
    targetCompanies: List[str] = []
    experienceLevel: Optional[str] = None
    onboarded: bool = False
    dsaStreak: int = 0
    lastSolveDate: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

@router.get("/me", response_model=UserResponseSchema)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Retrieve details of the currently authenticated user session.
    Registers a new profile in Firestore if one does not exist for the UID.
    """
    uid = current_user.get("uid")
    email = current_user.get("email")
    name = current_user.get("name")
    picture = current_user.get("picture")
    
    # Sync Firebase Auth data with Firestore user profile
    profile = firebase_service.create_or_update_user_profile(
        uid=uid,
        email=email,
        name=name,
        picture=picture
    )
    return profile

@router.post("/onboard", response_model=UserResponseSchema)
async def onboard_user(data: UserOnboardSchema, current_user: dict = Depends(get_current_user)):
    """Set preferences and onboarding fields for the authenticated student."""
    uid = current_user.get("uid")
    profile = firebase_service.onboard_user_profile(
        uid=uid,
        target_role=data.targetRole,
        target_companies=data.targetCompanies,
        experience_level=data.experienceLevel
    )
    return profile
