import logging
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from app.api.deps import get_current_user
from app.core.exceptions import ResourceNotFoundException
from app.services import firebase_service, gemini_service

logger = logging.getLogger("app")
router = APIRouter()

# Schemas
class RoadmapTask(BaseModel):
    taskId: str
    description: str
    completed: bool

class RoadmapWeek(BaseModel):
    weekNumber: int
    title: str
    topics: List[str]
    resources: List[str]
    tasks: List[RoadmapTask]
    completed: bool

class RoadmapResponse(BaseModel):
    roadmapId: str
    targetRole: str
    targetCompany: str = ""
    durationWeeks: int
    currentWeek: int
    weeks: List[RoadmapWeek]

class GenerateRoadmapRequest(BaseModel):
    targetRole: str
    targetCompany: str = ""
    durationWeeks: int
    currentSkills: List[str]

class ToggleTaskRequest(BaseModel):
    completed: bool

@router.get("/active", response_model=Optional[RoadmapResponse])
async def get_active_roadmap(current_user: dict = Depends(get_current_user)):
    """Retrieve the student's active weekly study roadmap, if generated."""
    uid = current_user.get("uid")
    roadmap = firebase_service.get_user_roadmap(uid)
    return roadmap

@router.post("/generate", response_model=RoadmapResponse)
async def generate_roadmap(data: GenerateRoadmapRequest, current_user: dict = Depends(get_current_user)):
    """Generate a personalized week-by-week learning roadmap using Gemini API and save it."""
    uid = current_user.get("uid")
    
    # 1. Generate roadmap structure using Gemini API
    roadmap_data = gemini_service.generate_personalized_roadmap(
        target_role=data.targetRole,
        duration_weeks=data.durationWeeks,
        current_skills=data.currentSkills,
        target_company=data.targetCompany
    )
    
    # 2. Save generated roadmap in database
    saved_roadmap = firebase_service.save_user_roadmap(
        user_id=uid,
        target_role=data.targetRole,
        duration_weeks=data.durationWeeks,
        roadmap_data=roadmap_data
    )
    
    return saved_roadmap

@router.patch("/{roadmapId}/tasks/{taskId}", response_model=RoadmapResponse)
async def toggle_roadmap_task(roadmapId: str, taskId: str, data: ToggleTaskRequest, current_user: dict = Depends(get_current_user)):
    """Toggle completed status of a specific milestone subtask in the study plan."""
    updated_roadmap = firebase_service.toggle_roadmap_task_status(
        roadmap_id=roadmapId,
        task_id=taskId,
        completed=data.completed
    )
    return updated_roadmap
