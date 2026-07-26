import logging
import json
from pydantic import BaseModel, Field
from typing import List
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.exceptions import AIException
from app.prompts.resume_prompts import RESUME_ANALYSIS_SYSTEM_INSTRUCTION, RESUME_ANALYSIS_USER_TEMPLATE
from app.parsers.resume_parsers import ResumeAnalysisOutputModel
from app.prompts.interview_prompts import INTERVIEW_QUESTION_SYSTEM_INSTRUCTION, INTERVIEW_EVALUATION_SYSTEM_INSTRUCTION
from app.parsers.interview_parsers import InterviewEvaluationOutputModel
from app.prompts.roadmap_prompts import ROADMAP_GENERATOR_SYSTEM_INSTRUCTION, ROADMAP_GENERATOR_USER_TEMPLATE
from app.parsers.roadmap_parsers import StudyRoadmapOutputModel
from app.prompts.coding_prompts import CODING_HINT_SYSTEM_INSTRUCTION, CODING_REVIEW_SYSTEM_INSTRUCTION
from app.parsers.coding_parsers import CodeSubmissionEvaluationModel

logger = logging.getLogger("app")

# Initialize client lazily to avoid exceptions during import if key is missing
_client = None

def get_gemini_client():
    """Lazily initialize and return the Google GenAI Client."""
    global _client
    if _client is not None:
        return _client
    
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is not set. Gemini API service will run in MOCK mode.")
        return None
    
    try:
        # Initializing the google-genai Client
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
        return _client
    except Exception as e:
        logger.error("Failed to initialize Google GenAI Client: %s", str(e))
        return None

def analyze_resume_text(resume_text: str, target_role: str, experience_level: str) -> dict:
    """Invokes Gemini to analyze resume text against a target role and experience level.
    Returns structured results matching ResumeAnalysisOutputModel.
    """
    client = get_gemini_client()
    
    # User prompt compilation
    user_prompt = RESUME_ANALYSIS_USER_TEMPLATE.format(
        target_role=target_role,
        experience_level=experience_level,
        resume_text=resume_text
    )
    
    if client is None:
        # Mock mode fallback
        logger.info("Running Resume Analysis in Mock Mode...")
        # Synthesize realistic mock data based on input keywords
        score = 75
        keywords_present = []
        for kw in ["React", "Python", "FastAPI", "SQL", "Cloud", "Git"]:
            if kw.lower() in resume_text.lower():
                keywords_present.append(kw)
                score += 3
        score = min(score, 98)
        
        missing = [k for k in ["GraphQL", "Docker", "CI/CD", "TypeScript", "Kubernetes"] if k.lower() not in resume_text.lower()]
        
        return {
            "overallScore": score,
            "atsScore": max(50, score - 8),
            "metrics": {
                "impact": max(60, score - 5),
                "structure": max(65, score - 2),
                "brevity": max(70, score - 1),
                "grammar": 95
            },
            "feedback": {
                "strengths": [
                    f"Highlights core technical skills: {', '.join(keywords_present[:3]) if keywords_present else 'General programming'}.",
                    "Education and project sections are formatted and placed cleanly."
                ],
                "improvements": [
                    "Integrate metric achievements and numerical results in your experience bullets.",
                    "Remove redundant descriptions in older project items to improve readability."
                ],
                "keywordMatchPercentage": int(len(keywords_present) / (len(keywords_present) + len(missing)) * 100) if (keywords_present or missing) else 50,
                "missingKeywords": missing[:4],
                "grammarSuggestions": [
                    "Change 'responsible for writing APIs' to 'Engineered high-throughput REST APIs' for stronger impact.",
                    "Ensure consistent past-tense verb usage across previous work experience bullet points."
                ],
                "technicalSkillSuggestions": [
                    f"Consider adding {missing[0]} and {missing[1]} to your Skills matrix to match target {target_role} expectations." if len(missing) >= 2 else "Highlight cloud deployment skills."
                ],
                "projectSuggestions": [
                    f"Develop a portfolio project showcasing {missing[0] if missing else 'FastAPI'} integration to demonstrate full-stack developer preparedness."
                ]
            }
        }
        
    try:
        # Enforce structured output from Gemini using Pydantic model
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=RESUME_ANALYSIS_SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=ResumeAnalysisOutputModel,
                temperature=0.2
            )
        )
        
        # Parse the JSON response
        result_json = response.text
        return json.loads(result_json)
    except Exception as e:
        logger.error("Gemini API resume analysis failed: %s", str(e))
        raise AIException(f"Failed to analyze resume with AI: {str(e)}")

def generate_next_interview_question(role: str, company: str, history: list, interview_type: str = "TECHNICAL") -> str:
    """Generate the next interview question using Gemini, based on session history."""
    client = get_gemini_client()
    
    # Compile dialogue history
    formatted_history = ""
    for turn in history:
        formatted_history += f"Interviewer: {turn.get('question')}\nCandidate: {turn.get('answer')}\n"
    
    user_prompt = f"Please generate the next question for a candidate interviewing for a {role} position at {company}.\n"
    if formatted_history:
        user_prompt += f"Here is the dialogue history:\n{formatted_history}\nInterviewer: "
    else:
        user_prompt += "This is the start of the interview. Generate the opening question.\nInterviewer: "

    if client is None:
        logger.info("Running Mock Interview generation in dev mock fallback...")
        if not history:
            if interview_type == "HR":
                return f"Welcome! To start off, can you tell me why you're interested in joining {company} in the {role} role?"
            elif interview_type == "DSA":
                return "Welcome! Let's start with a coding challenge. Can you explain how you would design an algorithm to find the longest palindromic substring in a given string?"
            else:
                return f"Welcome! To start off, can you tell me why you're interested in the {role} position at {company}?"
        elif len(history) == 1:
            if interview_type == "HR":
                return "Tell me about a time when you had a conflict with a team member and how you resolved it."
            elif interview_type == "DSA":
                return "That's a solid approach. What is the time complexity of that solution, and can we optimize it to O(N^2) or O(N) using dynamic programming or Manacher's algorithm?"
            else:
                return "That's great context. Can you describe a challenging technical project you worked on and what your specific role was?"
        elif len(history) == 2:
            if interview_type == "HR":
                return "Describe a situation where you had to make a decision without all the information you needed. What was the outcome?"
            elif interview_type == "DSA":
                return "Interesting. How would you handle duplicate characters in the input string, and what edge cases should we consider?"
            else:
                return "How did you manage technical conflicts or differences of opinion within your project team?"
        elif len(history) == 3:
            if interview_type == "HR":
                return "Where do you see yourself in five years, and how does this role align with your career goals?"
            elif interview_type == "DSA":
                return "Great. Let's discuss space complexity. How much extra space does your optimized approach use, and can it be done in O(1) space?"
            else:
                return "Interesting. How did you ensure your solution was performant and scaled appropriately?"
        else:
            return "Thank you. Finally, do you have any questions for me about the team structure or engineering culture?"

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=INTERVIEW_QUESTION_SYSTEM_INSTRUCTION.format(role=role, company=company, interview_type=interview_type),
                temperature=0.7,
                max_output_tokens=150
            )
        )
        return response.text.strip()
    except Exception as e:
        logger.error("Failed to generate next interview question: %s", str(e))
        raise AIException(f"Failed to generate question with AI: {str(e)}")


def evaluate_interview_transcript(role: str, company: str, history: list) -> dict:
    """Invokes Gemini to evaluate the full mock interview session history transcript."""
    client = get_gemini_client()
    
    formatted_transcript = ""
    for turn in history:
        formatted_transcript += f"Interviewer: {turn.get('question')}\nCandidate: {turn.get('answer')}\n"
        
    user_prompt = f"Target Role: {role}\nTarget Company: {company}\n\nInterview Transcript:\n{formatted_transcript}"
    
    if client is None:
        logger.info("Running Mock Interview evaluation in dev mock fallback...")
        word_count = sum(len(turn.get("answer", "").split()) for turn in history)
        avg_words = word_count / len(history) if history else 0
        
        situation_score = min(92, max(55, int(avg_words * 0.7) + 30))
        task_score = min(92, max(60, int(avg_words * 0.75) + 25))
        action_score = min(94, max(50, int(avg_words * 0.8) + 20))
        result_score = min(90, max(45, int(avg_words * 0.65) + 15))
        
        overall = int((situation_score + task_score + action_score + result_score) / 4)
        
        return {
            "overallScore": overall,
            "overallFeedback": f"You demonstrated good comprehension of the {role} parameters for {company}. Your responses average {int(avg_words)} words. To improve, describe technical milestones and metrics more clearly under the results category using STAR.",
            "starFrameworkScore": {
                "Situation": situation_score,
                "Task": task_score,
                "Action": action_score,
                "Result": result_score
            }
        }
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=INTERVIEW_EVALUATION_SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=InterviewEvaluationOutputModel,
                temperature=0.2
            )
        )
        return json.loads(response.text)
    except Exception as e:
        raise AIException(f"Failed to evaluate interview session with AI: {str(e)}")

def generate_personalized_roadmap(target_role: str, duration_weeks: int, current_skills: list, target_company: str = "") -> dict:
    """Generates a structured week-by-week learning roadmap using Gemini API."""
    client = get_gemini_client()
    import uuid
    
    user_prompt = ROADMAP_GENERATOR_USER_TEMPLATE.format(
        target_role=target_role,
        target_company=target_company or "general tech firms",
        duration_weeks=duration_weeks,
        current_skills=", ".join(current_skills) if current_skills else "None"
    )
    
    if client is None:
        logger.info("Running Roadmap generation in dev mock fallback...")
        weeks = []
        for w in range(1, min(duration_weeks + 1, 10)):
            weeks.append({
                "weekNumber": w,
                "title": f"Phase {w}: {target_role} prep for {target_company or 'Tech Companies'}",
                "topics": [f"Concept {w}.1", f"Concept {w}.2"],
                "resources": [f"Documentation Link for week {w}", f"Reference video for week {w}"],
                "tasks": [
                    {"taskId": f"task_w{w}_1", "description": f"Build a practical exercise project for Phase {w}", "completed": False},
                    {"taskId": f"task_w{w}_2", "description": f"Complete code analysis exercises on topics", "completed": False}
                ],
                "completed": False
            })
            
        return {
            "roadmapId": f"roadmap_{uuid.uuid4().hex[:8]}",
            "targetRole": target_role,
            "targetCompany": target_company,
            "durationWeeks": duration_weeks,
            "currentWeek": 1,
            "weeks": weeks
        }
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=ROADMAP_GENERATOR_SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=StudyRoadmapOutputModel,
                temperature=0.3
            )
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error("Failed to generate personalized study roadmap: %s", str(e))
        raise AIException(f"Failed to generate study roadmap with AI: {str(e)}")

class FocusTopicModel(BaseModel):
    topic: str
    importance: str
    userStatus: str

class ChecklistItemModel(BaseModel):
    taskId: str
    description: str
    done: bool

class CompanyInsightsModel(BaseModel):
    recruitmentProcess: str
    hrQuestions: List[str] = Field(description="HR and behavioral questions typical for this company")
    technicalQuestions: List[str] = Field(description="Technical and engineering questions typical for this company")
    dsaTopics: List[str] = Field(description="Common DSA topics heavily tested by this company")
    interviewTips: List[str] = Field(description="Proven tactical interview tips for this company")

class CompanyPrepOutputModel(BaseModel):
    companyName: str
    role: str
    readinessPercentage: int
    focusTopics: List[FocusTopicModel]
    checklist: List[ChecklistItemModel]
    companyInsights: CompanyInsightsModel

def generate_company_prep_guide(company_name: str, role: str) -> dict:
    """Generates a company preparation guide using Gemini API."""
    client = get_gemini_client()
    
    user_prompt = f"Target Company: {company_name}\nTarget Role: {role}"
    
    if client is None:
        logger.info("Running Company Prep generation in dev mock fallback...")
        
        # Customize mock response details based on the target company name
        c_lower = company_name.lower()
        if "google" in c_lower:
            rec = "Initial phone screening followed by 3 DSA coding loops and 1 Googleyness & Leadership (behavioral) round."
            hr = [
                "Tell me about a time you had a technical disagreement with a coworker.",
                "Why Google? How does your career alignment fit with our open-source ecosystem?"
            ]
            tech = [
                "How would you design a distributed web crawler like Googlebot?",
                "Explain the engineering trade-offs of storing sparse datasets in Bigtable."
            ]
            dsa = ["Graphs (DFS/BFS)", "Dijkstra & A* algorithms", "Tries & String matching", "Dynamic Programming"]
            tips = [
                "Always explain your thought process out loud before writing any code.",
                "Talk about time and space complexity (Big O) upfront.",
                "Keep code highly modular and handle edge cases (null inputs, empty values) gracefully."
            ]
        elif "amazon" in c_lower:
            rec = "Online assessment (OA), followed by 1 technical screen, and a 4-loop virtual onsite focusing heavily on Leadership Principles."
            hr = [
                "Tell me about a time you had to make a decision without all the data. Which Leadership Principle did you use?",
                "Describe a situation where you had to disagree and commit."
            ]
            tech = [
                "Design the backend database schemas and services for Amazon Prime Video.",
                "How would you handle eventual consistency across distributed inventory microservices?"
            ]
            dsa = ["Hash Maps", "Heaps (Priority Queue)", "Sliding Window", "LRU Cache design"]
            tips = [
                "Frame all behavioral answers strictly around the 16 Leadership Principles.",
                "Use the STAR method (Situation, Task, Action, Result) for all stories.",
                "Be ready to simplify complex technical systems to their core MVP value."
            ]
        elif "microsoft" in c_lower:
            rec = "1 Technical phone screen followed by 4 onsite interviews evaluating coding, system design, and cultural alignment."
            hr = [
                "Describe a project you worked on where you demonstrated a Growth Mindset.",
                "How do you handle ambiguous requirements at the start of a feature cycle?"
            ]
            tech = [
                "Design a collaborative editing system like Microsoft Loop or Word Online.",
                "How do you optimize thread contention in memory-mapped data queues?"
            ]
            dsa = ["Binary Search Tree operations", "Linked Lists (Reversal/Cycles)", "DFS & Backtracking", "Matrix manipulation"]
            tips = [
                "Microsoft values a collaborative problem-solving style; treat the interviewer as a teammate.",
                "Emphasize code robustness, unit tests, and defensive programming concepts.",
                "Explain how you design features with accessibility and security in mind."
            ]
        elif "tcs" in c_lower or "infosys" in c_lower:
            rec = "Aptitude screening (Cognitive/Coding OA) followed by 1 Technical round and 1 Managerial/HR conversation."
            hr = [
                "Are you comfortable relocating to different project office locations?",
                "Why do you want to start your professional journey with our organization?"
            ]
            tech = [
                "What is the difference between abstract classes and interfaces in Java/OOP?",
                "Explain the ACID properties in database management systems."
            ]
            dsa = ["Basic String operations", "Array sorting and searching algorithms", "Stack & Queue basics"]
            tips = [
                "Ensure your foundation in core CS fundamentals (OOP, DBMS, OS, Networks) is solid.",
                "Be confident, speak clearly, and be well-prepared to explain your academic projects in detail.",
                "Format your resume cleanly and list all certification achievements."
            ]
        else:
            rec = "Standard recruitment loop involving an initial screening, technical assessments, and cultural fit review."
            hr = ["Tell me about your career aspirations.", "How do you handle deadlines and pressure?"]
            tech = [f"What technologies would you use to build a system for {company_name}?", "Explain your primary tech stack."]
            dsa = ["Arrays", "Hashing", "Sorting"]
            tips = ["Research the company history.", "Prepare questions to ask the interviewer.", "Practice mock interviews."]

        return {
            "companyName": company_name,
            "role": role,
            "readinessPercentage": 25,
            "focusTopics": [
                {"topic": "Data Structures & Algorithms", "importance": "High", "userStatus": "UNSTARTED"},
                {"topic": "System Design", "importance": "Medium", "userStatus": "UNSTARTED"},
                {"topic": "Behavioral Alignment", "importance": "High", "userStatus": "UNSTARTED"}
            ],
            "checklist": [
                {"taskId": "prep_task_1", "description": f"Read typical interview loops summary for {company_name}", "done": False},
                {"taskId": "prep_task_2", "description": f"Solve top 5 interview questions for {role} at {company_name}", "done": False},
                {"taskId": "prep_task_3", "description": "Review company core cultural values", "done": False}
            ],
            "companyInsights": {
                "recruitmentProcess": rec,
                "hrQuestions": hr,
                "technicalQuestions": tech,
                "dsaTopics": dsa,
                "interviewTips": tips
            }
        }
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are a career placement researcher. Generate a structured company preparation guide detailing focus topics, a checklist of 3 tasks, and recruitment insights (incorporating HR questions, Technical questions, DSA topics, and Interview tips).",
                response_mime_type="application/json",
                response_schema=CompanyPrepOutputModel,
                temperature=0.3
            )
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error("Failed to generate company preparation guide: %s", str(e))
        raise AIException(f"Failed to generate company guide with AI: {str(e)}")

def generate_coding_hint(problem_id: str, code: str, language: str) -> dict:
    """Uses Gemini API to provide coding assistance based on current student progress."""
    client = get_gemini_client()
    user_prompt = f"Problem: {problem_id}\nLanguage: {language}\nCode Attempt:\n{code}"
    
    if client is None:
        return {
            "hint": "Try storing elements in a hash map as you iterate so you can check for the complement in O(1) time."
        }
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=CODING_HINT_SYSTEM_INSTRUCTION,
                temperature=0.4
            )
        )
        return {"hint": response.text.strip()}
    except Exception as e:
        logger.error("Failed to generate coding hint: %s", str(e))
        raise AIException(f"Failed to fetch coding hint: {str(e)}")

def evaluate_code_submission(problem_id: str, code: str, language: str) -> dict:
    """Assess execution status, logic correctness, complexity, and refactoring guidelines using Gemini."""
    client = get_gemini_client()
    user_prompt = f"Problem: {problem_id}\nLanguage: {language}\nCode Submission:\n{code}"
    
    if client is None:
        return {
            "status": "PASSED",
            "evaluation": {
                "timeComplexity": "O(N)",
                "spaceComplexity": "O(N)",
                "review": "Optimal solution using hash map complement tracking.",
                "refactoringTips": ["Add edge condition validations when nums contains less than 2 items."]
            }
        }
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=CODING_REVIEW_SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=CodeSubmissionEvaluationModel,
                temperature=0.2
            )
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error("Failed to evaluate coding submission: %s", str(e))
        raise AIException(f"Failed to evaluate coding solution: {str(e)}")

def simulate_code_execution(code: str, language: str, problem_id: str) -> dict:
    """Act as a sandboxed compiler and return simulated run results (stdout, stderr, success)."""
    client = get_gemini_client()
    
    # Try safe local execution for python as primary execution engine if environment supports it
    if language.lower() == "python":
        try:
            import sys
            import io
            assertions = ""
            if problem_id == "two-sum":
                assertions = "\ntry:\n    assert twoSum([2,7,11,15], 9) in [[0,1], [1,0]]\n    assert twoSum([3,2,4], 6) in [[1,2], [2,1]]\n    print('All assertions passed!')\nexcept AssertionError:\n    print('AssertionError: Code returned incorrect indices.', file=sys.stderr)"
            elif problem_id == "valid-anagram":
                assertions = "\ntry:\n    assert isAnagram('anagram', 'nagaram') == True\n    assert isAnagram('rat', 'car') == False\n    print('All assertions passed!')\nexcept AssertionError:\n    print('AssertionError: Code returned incorrect boolean results.', file=sys.stderr)"
            else:
                assertions = "\nprint('Syntax compiled and ran successfully.')"
                
            full_code = code + assertions
            old_out, old_err = sys.stdout, sys.stderr
            redirect_out = sys.stdout = io.StringIO()
            redirect_err = sys.stderr = io.StringIO()
            
            success = True
            try:
                exec(full_code, {"__builtins__": __builtins__, "sys": sys}, {})
            except Exception as ex:
                success = False
                print(f"RuntimeError: {str(ex)}", file=sys.stderr)
            finally:
                sys.stdout = old_out
                sys.stderr = old_err
                
            return {
                "success": success and not redirect_err.getvalue(),
                "stdout": redirect_out.getvalue(),
                "stderr": redirect_err.getvalue()
            }
        except Exception as local_fail:
            logger.warning("Local python code execution failed, falling back to AI: %s", str(local_fail))

    # AI Execution Simulation fallback
    if client is None:
        return {
            "success": True,
            "stdout": "Test cases passed successfully! (Local Mock Runtime)",
            "stderr": ""
        }
        
    system_prompt = """
    You are a sandboxed runtime compiler and code interpreter.
    Analyze the user's code, the language, and the target coding challenge problemId.
    Simulate running the code against standard test cases.
    Return a JSON response containing:
    1. success: boolean (true if code compiles, syntax is correct, and standard test assertions pass; false otherwise)
    2. stdout: string (standard output from code execution, including any prints or test messages)
    3. stderr: string (any compilation errors, syntax errors, traceback or assertion errors if failed)
    """
    user_prompt = f"Problem: {problem_id}\nLanguage: {language}\nCode:\n{code}"
    
    try:
        from pydantic import BaseModel
        class RunResultModel(BaseModel):
            success: bool
            stdout: str
            stderr: str
            
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=RunResultModel,
                temperature=0.1
            )
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error("AI execution simulation failed: %s", str(e))
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Runtime Error: Failed to execute code: {str(e)}"
        }
