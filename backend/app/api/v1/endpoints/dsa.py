import re
import logging
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from app.api.deps import get_current_user
from app.core.exceptions import ValidationException
from app.services import firebase_service

logger = logging.getLogger("app")
router = APIRouter()

# Static list of standard placement DSA problems categorized by topic
STANDARD_DSA_TOPICS = [
    {
        "topic": "Arrays & Hashing",
        "problems": [
            {"problemId": "two-sum", "title": "Two Sum", "difficulty": "Easy"},
            {"problemId": "valid-anagram", "title": "Valid Anagram", "difficulty": "Easy"},
            {"problemId": "group-anagrams", "title": "Group Anagrams", "difficulty": "Medium"},
            {"problemId": "top-k-frequent", "title": "Top K Frequent Elements", "difficulty": "Medium"}
        ]
    },
    {
        "topic": "Two Pointers",
        "problems": [
            {"problemId": "valid-palindrome", "title": "Valid Palindrome", "difficulty": "Easy"},
            {"problemId": "two-sum-ii", "title": "Two Sum II", "difficulty": "Medium"},
            {"problemId": "container-with-most-water", "title": "Container With Most Water", "difficulty": "Medium"}
        ]
    },
    {
        "topic": "Sliding Window",
        "problems": [
            {"problemId": "best-time-to-buy-sell-stock", "title": "Best Time to Buy & Sell Stock", "difficulty": "Easy"},
            {"problemId": "longest-substring-without-repeating-characters", "title": "Longest Substring Without Repeating", "difficulty": "Medium"}
        ]
    },
    {
        "topic": "Stack",
        "problems": [
            {"problemId": "valid-parentheses", "title": "Valid Parentheses", "difficulty": "Easy"},
            {"problemId": "min-stack", "title": "Min Stack", "difficulty": "Medium"}
        ]
    }
]

# Schemas
class ProblemStatus(BaseModel):
    problemId: str
    title: str
    difficulty: str
    status: str  # UNSTARTED, ATTEMPTED, SOLVED
    notes: Optional[str] = None

class TopicProgress(BaseModel):
    topic: str
    solved: int
    total: int
    problems: List[ProblemStatus]

class UpdateProgressRequest(BaseModel):
    problemId: str
    status: str
    code: Optional[str] = None
    language: Optional[str] = None
    notes: Optional[str] = None
    timeSpent: Optional[int] = None

class UpdateProgressResponse(BaseModel):
    success: bool
    problemId: str
    status: str

class AddCustomProblemRequest(BaseModel):
    title: str
    topic: str
    difficulty: str  # Easy, Medium, Hard
    status: str = "UNSTARTED"

@router.get("/topics", response_model=List[TopicProgress])
async def get_dsa_topics(current_user: dict = Depends(get_current_user)):
    """Retrieve structured DSA topic maps with dynamically merged custom student problems."""
    uid = current_user.get("uid")
    
    # 1. Fetch user progress documents
    user_progress = firebase_service.get_user_dsa_progress(uid)
    progress_map = {p["problemId"]: p for p in user_progress}
    
    # 2. Prepare grouping index mapping
    topic_map = {}
    for group in STANDARD_DSA_TOPICS:
        topic_map[group["topic"]] = {
            "problems": [p.copy() for p in group["problems"]],
            "custom": []
        }
        
    standard_ids = {p["problemId"] for tg in STANDARD_DSA_TOPICS for p in tg["problems"]}
    
    # Filter and group custom problems added by candidate
    for p_id, prog in progress_map.items():
        if p_id not in standard_ids:
            t_name = prog.get("topic") or "Custom Topics"
            if t_name not in topic_map:
                topic_map[t_name] = {"problems": [], "custom": []}
            topic_map[t_name]["custom"].append({
                "problemId": p_id,
                "title": prog.get("title", p_id.replace("-", " ").title()),
                "difficulty": prog.get("difficulty", "Medium"),
                "status": prog.get("status", "UNSTARTED"),
                "notes": prog.get("notes")
            })
            
    # 3. Assemble response categories list
    results = []
    for topic_name, data in topic_map.items():
        problems_list = []
        solved_count = 0
        
        # Load standard items
        for prob in data["problems"]:
            p_id = prob["problemId"]
            prog = progress_map.get(p_id)
            
            status_val = "UNSTARTED"
            notes_val = None
            if prog:
                status_val = prog.get("status", "UNSTARTED")
                notes_val = prog.get("notes")
                
            if status_val == "SOLVED":
                solved_count += 1
                
            problems_list.append({
                "problemId": p_id,
                "title": prob["title"],
                "difficulty": prob["difficulty"],
                "status": status_val,
                "notes": notes_val
            })
            
        # Append custom ones
        for c_prob in data["custom"]:
            if c_prob["status"] == "SOLVED":
                solved_count += 1
            problems_list.append(ProblemStatus(**c_prob))
            
        results.append({
            "topic": topic_name,
            "solved": solved_count,
            "total": len(problems_list),
            "problems": problems_list
        })
        
    return results

@router.post("/add", response_model=UpdateProgressResponse)
async def add_custom_problem(data: AddCustomProblemRequest, current_user: dict = Depends(get_current_user)):
    """Allow students to register custom external coding challenges into their topic matrices."""
    uid = current_user.get("uid")
    if not data.title.strip() or not data.topic.strip():
        raise ValidationException("Problem title and topic category name cannot be blank.")
        
    # Generate unique slug ID from title
    problem_id = re.sub(r'[^a-zA-Z0-9-]', '', data.title.lower().replace(" ", "-"))
    
    # Save custom problem metadata alongside solving status
    firebase_service.add_custom_dsa_problem(
        user_id=uid,
        problem_id=problem_id,
        title=data.title.strip(),
        topic=data.topic.strip(),
        difficulty=data.difficulty,
        status=data.status
    )
    
    return {
        "success": True,
        "problemId": problem_id,
        "status": data.status
    }

@router.post("/update", response_model=UpdateProgressResponse)
async def update_dsa_progress(data: UpdateProgressRequest, current_user: dict = Depends(get_current_user)):
    """Update active solving status, custom notes, or timings for a specific problem."""
    uid = current_user.get("uid")
    
    firebase_service.update_user_dsa_progress(
        user_id=uid,
        problem_id=data.problemId,
        status=data.status,
        code=data.code,
        language=data.language,
        notes=data.notes,
        time_spent=data.timeSpent
    )
    
    return {
        "success": True,
        "problemId": data.problemId,
        "status": data.status
    }
