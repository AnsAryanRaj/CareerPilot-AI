import logging
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from app.api.deps import get_current_user
from app.core.exceptions import ValidationException, ResourceNotFoundException
from app.services import firebase_service, gemini_service

logger = logging.getLogger("app")
router = APIRouter()

# Max turns count for a mock interview session
MAX_INTERVIEW_TURNS = 5

# Schemas
class StartInterviewRequest(BaseModel):
    role: str
    company: str
    interviewType: str = "TECHNICAL"  # HR, TECHNICAL, DSA

class StartInterviewResponse(BaseModel):
    sessionId: str
    firstQuestion: str

class AnswerRequest(BaseModel):
    answer: str

class AnswerResponse(BaseModel):
    nextQuestion: Optional[str] = None
    isCompleted: bool

class StarFrameworkScore(BaseModel):
    Situation: int
    Task: int
    Action: int
    Result: int

class InterviewEvaluation(BaseModel):
    overallScore: int
    overallFeedback: str
    starFrameworkScore: StarFrameworkScore

@router.get("/history", response_model=List[dict])
async def get_interview_history(current_user: dict = Depends(get_current_user)):
    """Retrieve history of past mock interviews for the student."""
    uid = current_user.get("uid")
    return firebase_service.get_user_interviews(uid)

@router.post("/start", response_model=StartInterviewResponse)
async def start_interview(data: StartInterviewRequest, current_user: dict = Depends(get_current_user)):
    """Initialize a conversational interview session with a role/company target and generate the first question."""
    uid = current_user.get("uid")
    
    # 1. Ask Gemini to generate the opening question
    try:
        first_question = gemini_service.generate_next_interview_question(
            role=data.role,
            company=data.company,
            history=[],
            interview_type=data.interviewType
        )
    except Exception as e:
        logger.error("Failed to generate initial question: %s", str(e))
        if data.interviewType == "HR":
            first_question = f"Welcome! Could you introduce yourself and tell me why you'd like to work as a {data.role} at {data.company}?"
        elif data.interviewType == "DSA":
            first_question = "Welcome! Let's start with a coding challenge. Can you explain how you would design an algorithm to find the longest palindromic substring in a given string?"
        else:
            first_question = f"Welcome! Could you introduce yourself and tell me why you'd like to work as a {data.role} at {data.company}?"
        
    # 2. Save new session in database
    session = firebase_service.create_interview_session(
        user_id=uid,
        role=data.role,
        company=data.company,
        first_question=first_question,
        interview_type=data.interviewType
    )
    
    return {
        "sessionId": session["sessionId"],
        "firstQuestion": first_question
    }

@router.post("/{sessionId}/answer", response_model=AnswerResponse)
async def submit_answer(sessionId: str, data: AnswerRequest, current_user: dict = Depends(get_current_user)):
    """Submit response to current question, yielding next step or signaling completion."""
    session = firebase_service.get_interview_session(sessionId)
    if not session:
        raise ResourceNotFoundException("The requested mock interview session could not be found.")
        
    if session.get("status") == "COMPLETED":
        raise ValidationException("This interview session has already been completed.")
        
    current_turn = session.get("currentTurn", 0)
    current_q = session.get("currentQuestion", "")
    history = session.get("history", [])
    
    # Check if we have reached the limit
    if current_turn >= MAX_INTERVIEW_TURNS - 1:
        # Save final turn and mark as completed
        firebase_service.add_interview_turn(
            session_id=sessionId,
            question=current_q,
            answer=data.answer,
            next_question=None,
            is_completed=True
        )
        return {
            "nextQuestion": None,
            "isCompleted": True
        }
    
    # Simulate adding the turn to get next question
    temp_history = history + [{"question": current_q, "answer": data.answer}]
    try:
        next_q = gemini_service.generate_next_interview_question(
            role=session.get("role"),
            company=session.get("company"),
            history=temp_history,
            interview_type=session.get("interviewType", "TECHNICAL")
        )
    except Exception as e:
        logger.error("Failed to generate next question: %s", str(e))
        next_q = "Can you expand further on your contributions to that project?"
        
    # Save the turn details
    firebase_service.add_interview_turn(
        session_id=sessionId,
        question=current_q,
        answer=data.answer,
        next_question=next_q,
        is_completed=False
    )
    
    return {
        "nextQuestion": next_q,
        "isCompleted": False
    }

@router.post("/{sessionId}/evaluate", response_model=InterviewEvaluation)
async def evaluate_interview(sessionId: str, current_user: dict = Depends(get_current_user)):
    """Evaluate interview transcript to output scoring and structural improvements."""
    session = firebase_service.get_interview_session(sessionId)
    if not session:
        raise ResourceNotFoundException("The requested mock interview session could not be found.")
        
    history = session.get("history", [])
    if not history:
        raise ValidationException("Cannot evaluate an empty interview session.")
        
    # Trigger AI transcript evaluation
    evaluation = gemini_service.evaluate_interview_transcript(
        role=session.get("role"),
        company=session.get("company"),
        history=history
    )
    
    # Save results
    firebase_service.save_interview_evaluation(sessionId, evaluation)
    
    return evaluation
