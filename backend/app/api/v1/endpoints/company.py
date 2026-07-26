import logging
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.services import firebase_service, gemini_service

logger = logging.getLogger("app")
router = APIRouter()

# Schemas
class FocusTopic(BaseModel):
    topic: str
    importance: str
    userStatus: str

class ChecklistItem(BaseModel):
    taskId: str
    description: str
    done: bool

class CompanyInsights(BaseModel):
    recruitmentProcess: str
    hrQuestions: List[str] = []
    technicalQuestions: List[str] = []
    dsaTopics: List[str] = []
    interviewTips: List[str] = []

class CompanyPrepDetail(BaseModel):
    prepId: str
    companyName: str
    role: str
    readinessPercentage: int
    focusTopics: List[FocusTopic]
    checklist: List[ChecklistItem]
    companyInsights: CompanyInsights
    updatedAt: str

class GeneratePrepRequest(BaseModel):
    companyName: str
    role: str

@router.get("/prep", response_model=List[CompanyPrepDetail])
async def list_company_prep(current_user: dict = Depends(get_current_user)):
    """Retrieve dashboards of current company preparation settings."""
    uid = current_user.get("uid")
    preps = firebase_service.get_user_company_preps(uid)
    return preps

@router.post("/generate", response_model=CompanyPrepDetail)
async def generate_company_prep(data: GeneratePrepRequest, current_user: dict = Depends(get_current_user)):
    """Trigger Gemini to research and assemble preparation outlines for a target company and save them."""
    uid = current_user.get("uid")
    
    # 1. Ask Gemini to research and synthesize target recruiting specifications
    prep_data = gemini_service.generate_company_prep_guide(
        company_name=data.companyName,
        role=data.role
    )
    
    # 2. Save outcomes in database
    saved_prep = firebase_service.save_user_company_prep(
        user_id=uid,
        company_name=data.companyName,
        role=data.role,
        prep_data=prep_data
    )
    
    return saved_prep
