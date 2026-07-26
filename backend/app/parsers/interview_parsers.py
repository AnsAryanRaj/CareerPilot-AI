from pydantic import BaseModel, Field

class StarFrameworkScoreModel(BaseModel):
    Situation: int = Field(description="Score from 0 to 100 assessing the context set by the candidate")
    Task: int = Field(description="Score from 0 to 100 assessing the clarity of objectives or constraints")
    Action: int = Field(description="Score from 0 to 100 assessing description of actual actions executed")
    Result: int = Field(description="Score from 0 to 100 assessing metrics, outcomes, and resolutions highlighted")

class InterviewEvaluationOutputModel(BaseModel):
    overallScore: int = Field(description="Weighted overall score out of 100 representing readiness")
    overallFeedback: str = Field(description="Detailed narrative feedback highlighting performance gaps and strengths")
    starFrameworkScore: StarFrameworkScoreModel
