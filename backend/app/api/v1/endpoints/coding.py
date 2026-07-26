from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from typing import List, Optional, Dict
from app.api.deps import get_current_user
from app.services import gemini_service

router = APIRouter()

# Curated Coding Playground problems mapping
PROBLEMS_DB = [
    {
        "problemId": "two-sum",
        "title": "Two Sum",
        "difficulty": "Easy",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n### Example\n```python\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n```",
        "starterCode": {
            "python": "def twoSum(nums, target):\n    # Write your python code here\n    pass",
            "javascript": "function twoSum(nums, target) {\n    // Write your javascript code here\n    return [];\n}",
            "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};"
        }
    },
    {
        "problemId": "valid-anagram",
        "title": "Valid Anagram",
        "difficulty": "Easy",
        "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.\n\n### Example\n```python\nInput: s = \"anagram\", t = \"nagaram\"\nOutput: true\n```",
        "starterCode": {
            "python": "def isAnagram(s, t):\n    # Write your python code here\n    pass",
            "javascript": "function isAnagram(s, t) {\n    // Write your javascript code here\n    return false;\n}",
            "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        return false;\n    }\n};"
        }
    },
    {
        "problemId": "valid-parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.\n\n### Example\n```python\nInput: s = \"()[]{}\"\nOutput: true\n```",
        "starterCode": {
            "python": "def isValid(s):\n    # Write your python code here\n    pass",
            "javascript": "function isValid(s) {\n    // Write your javascript code here\n    return false;\n}",
            "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};"
        }
    }
]

# Schemas
class CodingProblem(BaseModel):
    problemId: str
    title: str
    difficulty: str
    description: str
    starterCode: Dict[str, str]

class HintRequest(BaseModel):
    code: str
    language: str

class HintResponse(BaseModel):
    hint: str

class RunRequest(BaseModel):
    code: str
    language: str

class RunResponse(BaseModel):
    success: bool
    stdout: str
    stderr: str

class SubmitRequest(BaseModel):
    code: str
    language: str

class SubmitEvaluation(BaseModel):
    timeComplexity: str
    spaceComplexity: str
    review: str
    refactoringTips: List[str]

class SubmitResponse(BaseModel):
    status: str  # PASSED, FAILED
    evaluation: SubmitEvaluation

@router.get("/problems", response_model=List[CodingProblem])
async def list_problems(current_user: dict = Depends(get_current_user)):
    """Retrieve curated DSA coding challenges."""
    return PROBLEMS_DB

@router.post("/{problemId}/hint", response_model=HintResponse)
async def get_hint(problemId: str, data: HintRequest, current_user: dict = Depends(get_current_user)):
    """Get a progressive tip from Gemini based on user's current attempt."""
    hint_data = gemini_service.generate_coding_hint(
        problem_id=problemId,
        code=data.code,
        language=data.language
    )
    return hint_data

@router.post("/{problemId}/run", response_model=RunResponse)
async def run_code(problemId: str, data: RunRequest, current_user: dict = Depends(get_current_user)):
    """Simulate compiling and running student code against basic test assertions."""
    run_data = gemini_service.simulate_code_execution(
        code=data.code,
        language=data.language,
        problem_id=problemId
    )
    return run_data

@router.post("/{problemId}/submit", response_model=SubmitResponse)
async def submit_solution(problemId: str, data: SubmitRequest, current_user: dict = Depends(get_current_user)):
    """Evaluate submitted code logic, Big-O complexity analysis, and improvement suggestions."""
    evaluation = gemini_service.evaluate_code_submission(
        problem_id=problemId,
        code=data.code,
        language=data.language
    )
    return evaluation
