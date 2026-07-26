from pydantic import BaseModel, Field
from typing import List

class CodeReviewModel(BaseModel):
    timeComplexity: str = Field(description="Big-O time complexity notation, e.g. O(N log N)")
    spaceComplexity: str = Field(description="Big-O space complexity notation, e.g. O(1)")
    review: str = Field(description="Constructive code review summary evaluating logic correctness")
    refactoringTips: List[str] = Field(description="List of 1-3 specific refactoring or clean code suggestions")

class CodeSubmissionEvaluationModel(BaseModel):
    status: str = Field(description="Evaluation status: PASSED or FAILED")
    evaluation: CodeReviewModel
