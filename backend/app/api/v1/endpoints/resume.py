import io
import PyPDF2
import logging
from fastapi import APIRouter, Depends, UploadFile, File, status
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.api.deps import get_current_user
from app.core.exceptions import ValidationException, ResourceNotFoundException
from app.services import firebase_service, gemini_service

logger = logging.getLogger("app")
router = APIRouter()

# Schemas
class ResumeMetrics(BaseModel):
    impact: int
    structure: int
    brevity: int
    grammar: int

class ResumeFeedback(BaseModel):
    strengths: List[str]
    improvements: List[str]
    keywordMatchPercentage: int
    missingKeywords: List[str]
    grammarSuggestions: List[str]
    technicalSkillSuggestions: List[str]
    projectSuggestions: List[str]

class ResumeAnalysisResponse(BaseModel):
    resumeId: str
    fileName: str
    overallScore: int
    atsScore: int
    metrics: ResumeMetrics
    feedback: ResumeFeedback
    analyzedAt: str

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """Upload a resume document (PDF / DOC / DOCX), validate file type and size, and return success."""
    filename = file.filename or "resume.pdf"
    
    # 1. Validate file extension
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ["pdf", "doc", "docx"]:
        raise ValidationException("Unsupported file type. Only PDF, DOC, and DOCX documents are supported.")
        
    # 2. Validate file size (max 5MB)
    content = await file.read()
    file_size = len(content)
    if file_size > 5 * 1024 * 1024:
        raise ValidationException("File size exceeds the 5 MB maximum limit.")
        
    return {
        "success": True,
        "message": "Resume uploaded and validated successfully.",
        "filename": filename,
        "sizeBytes": file_size
    }

@router.get("/history", response_model=List[ResumeAnalysisResponse])
async def get_resume_history(current_user: dict = Depends(get_current_user)):
    """List history logs of past resume submissions."""
    uid = current_user.get("uid")
    return firebase_service.get_user_resumes(uid)

@router.get("/{resumeId}/report", response_class=PlainTextResponse)
async def download_resume_report(resumeId: str, current_user: dict = Depends(get_current_user)):
    """Generate and download a comprehensive markdown-based AI resume analysis report."""
    resume = firebase_service.get_resume_analysis(resumeId)
    if not resume:
        raise ResourceNotFoundException("Resume audit record not found.")

    # Prevent users from accessing other users' records
    if resume.get("userId") != current_user.get("uid"):
        raise ValidationException("Permission denied. You cannot access this evaluation report.")

    metrics = resume.get("metrics", {})
    feedback = resume.get("feedback", {})
    
    strengths_md = "\n".join(f"- {s}" for s in feedback.get("strengths", []))
    improvements_md = "\n".join(f"- {i}" for i in feedback.get("improvements", []))
    grammar_md = "\n".join(f"- {g}" for g in feedback.get("grammarSuggestions", []))
    tech_md = "\n".join(f"- {t}" for t in feedback.get("technicalSkillSuggestions", []))
    projects_md = "\n".join(f"- {p}" for p in feedback.get("projectSuggestions", []))
    keywords_md = ", ".join(feedback.get("missingKeywords", [])) or "None"

    report_content = f"""# CAREERPILOT AI - RESUME EVALUATION AUDIT REPORT

---

## Executive Summary
- **Filename:** {resume.get('fileName')}
- **Date Audited:** {resume.get('analyzedAt')}
- **Overall Readiness Rating:** {resume.get('overallScore')}/100
- **ATS Compatibility Score:** {resume.get('atsScore')}/100
- **Keyword Match Rate:** {feedback.get('keywordMatchPercentage')}%

### Score Breakdown
- **Accomplishments & Metrics Impact:** {metrics.get('impact')}/100
- **Layout Formatting & Structure:** {metrics.get('structure')}/100
- **Brevity & Conciseness:** {metrics.get('brevity')}/100
- **Grammar & Phrasing Accuracy:** {metrics.get('grammar')}/100

---

## Key Findings & Strengths
{strengths_md or "- No specific strengths documented."}

---

## Critical Action Items & Improvements
{improvements_md or "- No specific improvements documented."}

---

## Suggestions for Revision

### Grammar & Phrasing Refinements
{grammar_md or "- No specific grammar revisions required."}

### Technical Skills to Add
{tech_md or "- Resume covers core technical skills for target role."}

### Project Enhancements
{projects_md or "- No additional project enhancements recommended."}

---

## Keyword Optimization Matrix
- **Missing Industry Keywords:** {keywords_md}

---
*Report generated automatically by CareerPilot AI placement preparation suite.*
"""

    headers = {
        "Content-Disposition": f"attachment; filename=CareerPilot_Resume_Report_{resumeId}.md"
    }
    return PlainTextResponse(content=report_content, headers=headers)
