import logging
from fastapi import APIRouter, Depends, UploadFile, File, status
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.api.deps import get_current_user
from app.core.exceptions import ValidationException, ResourceNotFoundException, AIException, DatabaseException
from app.services import firebase_service, gemini_service
from app.services.resume_parser import parse_resume_bytes

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
    """Upload a resume document (PDF / DOCX / TXT), parse it, run Gemini analysis, and persist to Firestore."""
    filename = file.filename or "resume.pdf"
    uid = current_user.get("uid")
    
    logger.info("Resume Uploaded: filename=%s, userId=%s", filename, uid)
    
    # 1. Validate file extension
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ["pdf", "docx", "txt", "text"]:
        logger.error("Unsupported file uploaded: %s", filename)
        raise ValidationException("Unsupported file type. Only PDF, DOCX, and TXT files are supported.")
        
    # 2. Validate file size (max 5MB)
    content = await file.read()
    file_size = len(content)
    if file_size > 5 * 1024 * 1024:
        logger.error("File size exceeds 5MB limit: %d bytes", file_size)
        raise ValidationException("File size exceeds the 5 MB maximum limit.")
        
    # 3. Parse resume content
    logger.info("Resume Parsing started: %s", filename)
    try:
        extracted_text = parse_resume_bytes(content, filename)
        logger.info("Resume Parsed: character_count=%d", len(extracted_text))
    except ValidationException as ve:
        raise ve
    except Exception as e:
        logger.exception("Failed to parse resume content: %s", str(e))
        raise ValidationException(f"Failed to parse resume: {str(e)}")

    # 4. Analyze using Gemini
    logger.info("Gemini Started: analyzing resume for userId=%s", uid)
    try:
        analysis_result = gemini_service.analyze_resume(extracted_text)
        logger.info("Gemini Finished successfully")
    except AIException as ae:
        raise ae
    except Exception as e:
        logger.exception("Gemini analysis failed: %s", str(e))
        raise AIException(f"AI Analysis failed or timed out: {str(e)}")

    # 5. Save report in Firestore (under resume_history)
    logger.info("Firestore Saving started: userId=%s", uid)
    try:
        saved_doc = firebase_service.save_resume_analysis(
            user_id=uid,
            file_name=filename,
            raw_text=extracted_text,
            analysis_result=analysis_result
        )
        logger.info("Firestore Saved: resumeId=%s", saved_doc.get("resumeId"))
    except Exception as e:
        logger.exception("Firestore save failed: %s", str(e))
        raise DatabaseException(f"Failed to save resume audit in Firestore: {str(e)}")

    return {
        "success": True,
        "resumeId": saved_doc.get("resumeId"),
        "analysis": saved_doc.get("analysis")
    }

@router.get("/history")
async def get_resume_history(current_user: dict = Depends(get_current_user)):
    """List history logs of past resume submissions."""
    uid = current_user.get("uid")
    raw_history = firebase_service.get_user_resumes(uid)
    
    # Map the new schema to the response format if needed
    mapped_history = []
    for item in raw_history:
        # Check if it uses the new schema
        if "analysis" in item:
            analysis = item["analysis"]
            scores = item.get("scores", {})
            mapped_history.append({
                "resumeId": item.get("resumeId"),
                "fileName": item.get("fileName"),
                "overallScore": scores.get("overallScore", 0),
                "atsScore": scores.get("atsScore", 0),
                "metrics": {
                    "impact": scores.get("technicalScore", 0),
                    "structure": scores.get("communicationScore", 0),
                    "brevity": scores.get("overallScore", 0),
                    "grammar": scores.get("grammarScore", 0)
                },
                "feedback": {
                    "strengths": analysis.get("strengths", []),
                    "improvements": analysis.get("weaknesses", []),
                    "keywordMatchPercentage": scores.get("atsScore", 0),
                    "missingKeywords": analysis.get("missingSkills", []),
                    "grammarSuggestions": [],
                    "technicalSkillSuggestions": analysis.get("recommendedProjects", []),
                    "projectSuggestions": analysis.get("recommendedCertifications", [])
                },
                "analyzedAt": item.get("uploadedAt")
            })
        else:
            mapped_history.append(item)
            
    return mapped_history

@router.get("/{resumeId}/report", response_class=PlainTextResponse)
async def download_resume_report(resumeId: str, current_user: dict = Depends(get_current_user)):
    """Generate and download a comprehensive markdown-based AI resume analysis report."""
    resume = firebase_service.get_resume_analysis(resumeId)
    if not resume:
        raise ResourceNotFoundException("Resume audit record not found.")

    # Prevent users from accessing other users' records
    if resume.get("userId") != current_user.get("uid"):
        raise ValidationException("Permission denied. You cannot access this evaluation report.")

    if "analysis" in resume:
        ans_data = resume["analysis"]
        scores = resume.get("scores", {})
        
        strengths_md = "\n".join([f"- {s}" for s in ans_data.get("strengths", [])])
        weaknesses_md = "\n".join([f"- {w}" for w in ans_data.get("weaknesses", [])])
        missing_md = "\n".join([f"- {k}" for k in ans_data.get("missingSkills", [])])
        projects_md = "\n".join([f"- {p}" for p in ans_data.get("recommendedProjects", [])])
        certs_md = "\n".join([f"- {c}" for c in ans_data.get("recommendedCertifications", [])])
        career_md = "\n".join([f"- {cs}" for cs in ans_data.get("careerSuggestions", [])])
        questions_md = "\n".join([f"- {q}" for q in ans_data.get("interviewQuestions", [])])
        
        report_content = f"""# CareerPilot AI - Resume Placement Audit Report

## Resume Document: {resume.get("fileName")}
## Date Audited: {resume.get("uploadedAt", "N/A")}

---

## Evaluation Scorecard
- **Overall Placement Grade:** {scores.get("overallScore", 0)} / 100
- **ATS Compatibility Score:** {scores.get("atsScore", 0)} / 100
- **Grammar & Phrasing Rating:** {scores.get("grammarScore", 0)} / 100
- **Technical Competency Rating:** {scores.get("technicalScore", 0)} / 100
- **Communication & Layout Rating:** {scores.get("communicationScore", 0)} / 100

---

## Professional Summary
{ans_data.get("resumeSummary", "No summary available.")}

---

## Key Findings & Strengths
{strengths_md or "- No specific strengths documented."}

---

## Critical Action Items & Weaknesses
{weaknesses_md or "- No specific weaknesses documented."}

---

## Suggestions for Revision

### Missing Industry Keywords
{missing_md or "- Resume covers core technical skills for target role."}

### Recommended Projects
{projects_md or "- No additional project enhancements recommended."}

### Recommended Certifications
{certs_md or "- No certifications recommended."}

### Career & Next Steps Suggestions
{career_md or "- No career suggestions listed."}

---

## Practice Interview Questions
{questions_md or "- No interview questions generated."}

---
*Report generated automatically by CareerPilot AI placement preparation suite.*
"""
    else:
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

@router.delete("/{resumeId}")
async def delete_resume(resumeId: str, current_user: dict = Depends(get_current_user)):
    """Deletes a resume analysis record from Firestore/history."""
    resume = firebase_service.get_resume_analysis(resumeId)
    if not resume:
        raise ResourceNotFoundException("Resume audit record not found.")
        
    if resume.get("userId") != current_user.get("uid"):
        raise ValidationException("Permission denied. You cannot delete this record.")
        
    firebase_service.delete_resume_analysis(resumeId)
    return {"success": True, "message": "Resume record deleted successfully"}
