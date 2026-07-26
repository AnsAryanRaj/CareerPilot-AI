from pydantic import BaseModel, Field
from typing import List

class RoadmapTaskModel(BaseModel):
    taskId: str = Field(description="Unique short task identifier, e.g. task_w1_1")
    description: str = Field(description="Actionable learning objective task description")
    completed: bool = Field(default=False, description="Initial completion state of the task")

class RoadmapWeekModel(BaseModel):
    weekNumber: int = Field(description="The timeline week index number, e.g. 1")
    title: str = Field(description="Focus theme or title of the learning week")
    topics: List[str] = Field(description="List of specific subtopics covered in this week")
    resources: List[str] = Field(description="List of specific resource links, docs, or materials to read")
    tasks: List[RoadmapTaskModel] = Field(description="List of checkable milestone tasks for the week")
    completed: bool = Field(default=False, description="Initial weekly progress state")

class StudyRoadmapOutputModel(BaseModel):
    roadmapId: str = Field(description="Generated unique roadmap ID identifier")
    targetRole: str = Field(description="The role for which the study plan is generated")
    targetCompany: str = Field(default="", description="The dream company candidate is preparing for")
    durationWeeks: int = Field(description="Duration in weeks of the learning schedule")
    currentWeek: int = Field(default=1, description="Active week marker")
    weeks: List[RoadmapWeekModel] = Field(description="Array of learning weeks forming the roadmap")
