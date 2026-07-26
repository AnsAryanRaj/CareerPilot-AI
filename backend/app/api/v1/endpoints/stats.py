import logging
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.services import firebase_service

logger = logging.getLogger("app")
router = APIRouter()

# Schemas
class DateScore(BaseModel):
    date: str
    score: int

class ChallengeProgress(BaseModel):
    solved: int
    total: int

class DashboardStats(BaseModel):
    readinessScore: int
    history: List[DateScore]
    challengeProgress: Dict[str, ChallengeProgress]
    categoryMetrics: Dict[str, int]

@router.get("/overview", response_model=DashboardStats)
async def get_overview_stats(current_user: dict = Depends(get_current_user)):
    """Retrieve combined progress telemetry dynamically for dashboard Chart.js visuals."""
    uid = current_user.get("uid")
    
    # 1. Fetch user data
    resumes = firebase_service.get_user_resumes(uid)
    interviews = firebase_service.get_user_interviews(uid)
    dsa_progress = firebase_service.get_user_dsa_progress(uid)
    
    # 2. Compute Resume Score
    resume_score = 0
    if resumes:
        # Latest resume score
        resume_score = resumes[0].get("overallScore", 0)
        
    # 3. Compute Mock Interview Score & STAR scores
    interview_score = 0
    behavioral_score = 0
    completed_interviews = [i for i in interviews if i.get("status") == "COMPLETED" and "evaluation" in i]
    if completed_interviews:
        total_eval_score = sum(i["evaluation"].get("overallScore", 0) for i in completed_interviews)
        interview_score = int(total_eval_score / len(completed_interviews))
        
        # Calculate behavioral coherence from STAR framework Situation/Result scores
        total_star_coherence = 0
        for i in completed_interviews:
            star = i["evaluation"].get("starFrameworkScore", {})
            # Average of STAR parameters
            total_star_coherence += sum(star.values()) / len(star) if star else 0
        behavioral_score = int(total_star_coherence / len(completed_interviews))

    # 4. Compute DSA Solve Rate
    # Static problems count in dsa.py is 11
    dsa_solved = sum(1 for p in dsa_progress if p.get("status") == "SOLVED")
    dsa_total = 11
    dsa_rate = int((dsa_solved / dsa_total) * 100) if dsa_total > 0 else 0
    
    # 5. Compute overall readiness score (average of metrics)
    metrics_list = []
    if resume_score > 0:
        metrics_list.append(resume_score)
    if interview_score > 0:
        metrics_list.append(interview_score)
    if dsa_rate > 0:
        metrics_list.append(dsa_rate)
        
    readiness_score = int(sum(metrics_list) / len(metrics_list)) if metrics_list else 0
    if readiness_score == 0:
        # Provide base default onboarding score if they have just logged in
        readiness_score = 30
        
    # Standard history progress timeline representation
    history = [
        {"date": "Day 1", "score": 30}
    ]
    if len(metrics_list) > 0:
        history.append({"date": "Current Status", "score": readiness_score})
        
    return {
        "readinessScore": readiness_score,
        "history": history,
        "challengeProgress": {
            "dsa": {"solved": dsa_solved, "total": dsa_total},
            "interview": {"solved": len(completed_interviews), "total": len(interviews)}
        },
        "categoryMetrics": {
            "Resume Score": resume_score if resume_score > 0 else 50,
            "Mock Interview": interview_score if interview_score > 0 else 50,
            "DSA Solve Rate": dsa_rate,
            "Behavioral Coherence": behavioral_score if behavioral_score > 0 else 50
        }
    }
