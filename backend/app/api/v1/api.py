from fastapi import APIRouter
from app.api.v1.endpoints import auth, resume, mock, coding, dsa, company, roadmap, stats

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(resume.router, prefix="/resumes", tags=["Resume Analyzer"])
api_router.include_router(mock.router, prefix="/interviews", tags=["Mock Interview"])
api_router.include_router(coding.router, prefix="/coding", tags=["Coding Practice"])
api_router.include_router(dsa.router, prefix="/dsa", tags=["DSA Tracker"])
api_router.include_router(company.router, prefix="/company", tags=["Company Prep"])
api_router.include_router(roadmap.router, prefix="/roadmap", tags=["AI Roadmap"])
api_router.include_router(stats.router, prefix="/stats", tags=["Analytics"])
