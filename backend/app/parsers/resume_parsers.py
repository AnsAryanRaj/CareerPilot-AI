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

class CompleteResumeAnalysisModel(BaseModel):
    overallScore: int = Field(description="Overall resume grade from 0 to 100")
    atsScore: int = Field(description="ATS match score from 0 to 100")
    grammarScore: int = Field(description="Grammar and spelling score from 0 to 100")
    technicalScore: int = Field(description="Technical expertise match score from 0 to 100")
    communicationScore: int = Field(description="Written presentation quality score from 0 to 100")
    resumeSummary: str = Field(description="A brief professional summary of the candidate's profile")
    strengths: List[str] = Field(description="Key strengths identified in the resume")
    weaknesses: List[str] = Field(description="Key areas for improvement/weaknesses found")
    missingSkills: List[str] = Field(description="Core technical or soft skills missing for target roles")
    recommendedProjects: List[str] = Field(description="Specific project ideas or improvements to showcase skills")
    recommendedCertifications: List[str] = Field(description="Recommended industry certifications or coursework")
    careerSuggestions: List[str] = Field(description="Recommended target roles, titles, or next career moves")
    interviewQuestions: List[str] = Field(description="Potential interview questions based on candidate profile")

class AdvancedScoresModel(BaseModel):
    contentScore: int = Field(description="Score from 0 to 100 for content depth and relevancy")
    formattingScore: int = Field(description="Score from 0 to 100 for layout formatting and style consistency")
    projectsScore: int = Field(description="Score from 0 to 100 for project implementation and detail depth")
    achievementsScore: int = Field(description="Score from 0 to 100 for quantitative achievements and metrics")
    leadershipScore: int = Field(description="Score from 0 to 100 for team leading, ownership, and initiatives")
    skillsScore: int = Field(description="Score from 0 to 100 for target tech stack and competency match")
    keywordOptimizationScore: int = Field(description="Score from 0 to 100 for keyword coverage")
    professionalSummaryScore: int = Field(description="Score from 0 to 100 for executive summary pitch quality")
    experienceScore: int = Field(description="Score from 0 to 100 for professional work history detail quality")
    educationScore: int = Field(description="Score from 0 to 100 for academic background formatting and relevance")

class HiringVerdictModel(BaseModel):
    verdict: str = Field(description="One of: Strong Hire, Hire, Borderline, Weak")
    hiringConfidence: int = Field(description="Confidence percentage (0 to 100)")
    atsPassProbability: int = Field(description="ATS pass probability percentage (0 to 100)")
    recruiterOpinion: str = Field(description="A short, punchy 1-2 sentence recruiter opinion")
    recommendedCompanyType: str = Field(description="One of: Product Company, Startup, Service Company, MNC")

class ExecutiveSummaryDetailsModel(BaseModel):
    resumeStrength: str = Field(description="The single biggest strength of the candidate's resume")
    biggestWeakness: str = Field(description="The single biggest weakness or area needing revision")
    recruiterImpression: str = Field(description="An overview of how a hiring manager perceives this resume")
    overallRecommendation: str = Field(description="Top recommendation/actionable guidance for immediate improvement")

class UpgradeResumeAnalysisModel(BaseModel):
    overallScore: int = Field(description="Overall resume grade from 0 to 100")
    atsScore: int = Field(description="ATS match score from 0 to 100")
    grammarScore: int = Field(description="Grammar and spelling score from 0 to 100")
    technicalScore: int = Field(description="Technical expertise match score from 0 to 100")
    communicationScore: int = Field(description="Written presentation quality score from 0 to 100")
    
    resumeReadiness: int = Field(description="Resume Readiness percentage (0 to 100) based on all factors")
    hiringVerdict: HiringVerdictModel
    advancedScores: AdvancedScoresModel
    detectedKeywords: List[str] = Field(description="List of relevant tech keywords detected in the resume")
    missingKeywords: List[str] = Field(description="List of critical industry terms or keywords missing from the resume")
    keywordCoveragePercentage: int = Field(description="Keyword coverage percentage from 0 to 100")
    executiveSummary: ExecutiveSummaryDetailsModel
    
    resumeSummary: str = Field(description="A brief professional summary of the candidate's profile")
    strengths: List[str] = Field(description="Key strengths identified in the resume")
    weaknesses: List[str] = Field(description="Key areas for improvement/weaknesses found")
    recommendedProjects: List[str] = Field(description="Specific project ideas or improvements to showcase skills")
    recommendedCertifications: List[str] = Field(description="Recommended industry certifications or coursework")
    careerSuggestions: List[str] = Field(description="Recommended target roles, titles, or next career moves")
    interviewQuestions: List[str] = Field(description="Potential interview questions based on candidate profile")
