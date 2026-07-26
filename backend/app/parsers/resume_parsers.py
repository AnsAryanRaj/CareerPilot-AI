from pydantic import BaseModel, Field
from typing import List

class ResumeMetricsModel(BaseModel):
    impact: int = Field(description="Impact score from 0 to 100 assessing metrics, accomplishments and action verbs")
    structure: int = Field(description="Structure score from 0 to 100 assessing layout, spacing and section design")
    brevity: int = Field(description="Brevity score from 0 to 100 assessing conciseness and line usage")
    grammar: int = Field(description="Grammar score from 0 to 100 assessing syntax and spelling accuracy")

class ResumeFeedbackModel(BaseModel):
    strengths: List[str] = Field(description="List of 2-3 key resume strengths")
    improvements: List[str] = Field(description="List of 2-3 action-oriented improvements")
    keywordMatchPercentage: int = Field(description="Percentage matching target roles (0-100)")
    missingKeywords: List[str] = Field(description="List of critical industry terms or tech keywords missing")
    grammarSuggestions: List[str] = Field(description="List of specific grammar, spelling, or phrasing corrections")
    technicalSkillSuggestions: List[str] = Field(description="List of technical skills to add or highlight based on target role")
    projectSuggestions: List[str] = Field(description="List of specific project ideas or project enhancement recommendations to boost resume credibility")

class ResumeAnalysisOutputModel(BaseModel):
    overallScore: int = Field(description="Weighted overall score out of 100")
    atsScore: int = Field(description="ATS compatibility score from 0 to 100 assessing parser readability, keyword match, and structural standards")
    metrics: ResumeMetricsModel
    feedback: ResumeFeedbackModel
