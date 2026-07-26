import logging
from firebase_admin import firestore
from app.core.exceptions import DatabaseException
from app.core.config import settings

logger = logging.getLogger("app")

_db_client = None
_in_memory_db = {}  # Fallback local dictionary for development mock runs

def get_firestore_client():
    """Retrieve the Firestore client. Returns None if credentials are missing or uninitialized."""
    global _db_client
    if _db_client is not None:
        return _db_client
    
    try:
        _db_client = firestore.client()
        return _db_client
    except Exception as e:
        logger.warning("Firestore Client could not be initialized: %s. Using local in-memory fallback storage.", str(e))
        return None

def get_user_profile(uid: str) -> dict | None:
    """Fetches user document from Firestore, falling back to local memory if Firestore is unavailable."""
    db = get_firestore_client()
    if db is None:
        return _in_memory_db.get(uid)
    
    try:
        doc_ref = db.collection("users").document(uid)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        logger.error("Error reading Firestore: %s. Falling back to local cache.", str(e))
        return _in_memory_db.get(uid)

def create_or_update_user_profile(uid: str, email: str, name: str = None, picture: str = None) -> dict:
    """Creates or updates a user profile document, with in-memory fallback."""
    db = get_firestore_client()
    if db is None:
        # Development in-memory fallback path
        if uid not in _in_memory_db:
            _in_memory_db[uid] = {
                "uid": uid,
                "email": email,
                "fullName": name or email.split("@")[0] if email else "Jane Doe",
                "avatarUrl": picture or "",
                "targetRole": "Software Engineer",
                "targetCompanies": ["Google", "Stripe"],
                "experienceLevel": "Entry-Level",
                "onboarded": False,
                "createdAt": "Just now",
                "updatedAt": "Just now"
            }
        else:
            profile = _in_memory_db[uid]
            if name:
                profile["fullName"] = name
            if picture:
                profile["avatarUrl"] = picture
        return _in_memory_db[uid]
    
    try:
        doc_ref = db.collection("users").document(uid)
        doc = doc_ref.get()
        
        if doc.exists:
            profile = doc.to_dict()
            updates = {}
            if name and not profile.get("fullName"):
                updates["fullName"] = name
            if picture and not profile.get("avatarUrl"):
                updates["avatarUrl"] = picture
            
            if updates:
                updates["updatedAt"] = firestore.SERVER_TIMESTAMP
                doc_ref.update(updates)
                profile.update(updates)
            
            profile["createdAt"] = str(profile.get("createdAt"))
            profile["updatedAt"] = str(profile.get("updatedAt"))
            return profile
        else:
            profile = {
                "uid": uid,
                "email": email,
                "fullName": name or email.split("@")[0] if email else "User",
                "avatarUrl": picture or "",
                "targetRole": "",
                "targetCompanies": [],
                "experienceLevel": "",
                "onboarded": False,
                "createdAt": firestore.SERVER_TIMESTAMP,
                "updatedAt": firestore.SERVER_TIMESTAMP
            }
            doc_ref.set(profile)
            profile["createdAt"] = "Just now"
            profile["updatedAt"] = "Just now"
            return profile
    except Exception as e:
        logger.error("Firestore write failed: %s. Storing in local in-memory fallback.", str(e))
        # Backup write to local cache so developer sessions don't crash
        if uid not in _in_memory_db:
            _in_memory_db[uid] = {
                "uid": uid,
                "email": email,
                "fullName": name or email.split("@")[0] if email else "User",
                "avatarUrl": picture or "",
                "targetRole": "",
                "targetCompanies": [],
                "experienceLevel": "",
                "onboarded": False,
                "createdAt": "Just now",
                "updatedAt": "Just now"
            }
        return _in_memory_db[uid]

def onboard_user_profile(uid: str, target_role: str, target_companies: list, experience_level: str) -> dict:
    """Applies target career specs and registers onboarding completion."""
    db = get_firestore_client()
    if db is None:
        if uid not in _in_memory_db:
            create_or_update_user_profile(uid, "student@university.edu")
        profile = _in_memory_db[uid]
        profile["targetRole"] = target_role
        profile["targetCompanies"] = target_companies
        profile["experienceLevel"] = experience_level
        profile["onboarded"] = True
        return profile
        
    try:
        doc_ref = db.collection("users").document(uid)
        doc = doc_ref.get()
        if not doc.exists:
            create_or_update_user_profile(uid, "")
        
        updates = {
            "targetRole": target_role,
            "targetCompanies": target_companies,
            "experienceLevel": experience_level,
            "onboarded": True,
            "updatedAt": firestore.SERVER_TIMESTAMP
        }
        doc_ref.update(updates)
        updated_doc = doc_ref.get()
        profile = updated_doc.to_dict()
        profile["createdAt"] = str(profile.get("createdAt"))
        profile["updatedAt"] = str(profile.get("updatedAt"))
        return profile
    except Exception as e:
        logger.error("Firestore update failed: %s. Falling back to local update.", str(e))
        if uid in _in_memory_db:
            profile = _in_memory_db[uid]
            profile["targetRole"] = target_role
            profile["targetCompanies"] = target_companies
            profile["experienceLevel"] = experience_level
            profile["onboarded"] = True
            return profile
        raise DatabaseException(f"Failed to onboard user: {str(e)}")

def save_resume_analysis(user_id: str, file_name: str, raw_text: str, analysis_result: dict) -> dict:
    """Saves a resume analysis evaluation in Firestore, falling back to local memory if Firestore is unavailable."""
    db = get_firestore_client()
    import uuid
    from datetime import datetime
    
    resume_id = f"res_{uuid.uuid4().hex[:8]}"
    doc_data = {
        "resumeId": resume_id,
        "userId": user_id,
        "fileName": file_name,
        "rawText": raw_text[:5000],  # Keep raw text within bounds
        "overallScore": analysis_result.get("overallScore"),
        "atsScore": analysis_result.get("atsScore", 0),
        "metrics": analysis_result.get("metrics"),
        "feedback": analysis_result.get("feedback"),
        "analyzedAt": datetime.utcnow().isoformat()  # standard ISO string for consistency
    }
    
    if db is None:
        if "resumes" not in _in_memory_db:
            _in_memory_db["resumes"] = []
        _in_memory_db["resumes"].append(doc_data)
        return doc_data
        
    try:
        db.collection("resumes").document(resume_id).set(doc_data)
        return doc_data
    except Exception as e:
        logger.error("Failed to save resume in Firestore: %s. Saving to cache.", str(e))
        if "resumes" not in _in_memory_db:
            _in_memory_db["resumes"] = []
        _in_memory_db["resumes"].append(doc_data)
        return doc_data

def get_user_resumes(user_id: str) -> list:
    """Retrieves all past resume reviews for a user, sorted by date in memory for resilience."""
    db = get_firestore_client()
    if db is None:
        res = [r for r in _in_memory_db.get("resumes", []) if r.get("userId") == user_id]
        res.sort(key=lambda x: x.get("analyzedAt", ""), reverse=True)
        return res
        
    try:
        docs = db.collection("resumes").where("userId", "==", user_id).stream()
        resumes = []
        for doc in docs:
            d = doc.to_dict()
            resumes.append(d)
        # Sort in memory to avoid index requirements in Firestore console
        resumes.sort(key=lambda x: x.get("analyzedAt", ""), reverse=True)
        return resumes
    except Exception as e:
        logger.error("Failed to query resumes in Firestore: %s. Falling back to local cache.", str(e))
        res = [r for r in _in_memory_db.get("resumes", []) if r.get("userId") == user_id]
        res.sort(key=lambda x: x.get("analyzedAt", ""), reverse=True)
        return res

def create_interview_session(user_id: str, role: str, company: str, first_question: str, interview_type: str = "TECHNICAL") -> dict:
    """Creates a new mock interview session document in Firestore, falling back to local memory if Firestore is unavailable."""
    db = get_firestore_client()
    import uuid
    from datetime import datetime
    
    session_id = f"mock_{uuid.uuid4().hex[:8]}"
    doc_data = {
        "sessionId": session_id,
        "userId": user_id,
        "role": role,
        "company": company,
        "interviewType": interview_type,
        "status": "STARTED",
        "currentTurn": 0,
        "history": [],
        "createdAt": datetime.utcnow().isoformat(),
        "currentQuestion": first_question
    }
    
    if db is None:
        if "interviews" not in _in_memory_db:
            _in_memory_db["interviews"] = {}
        _in_memory_db["interviews"][session_id] = doc_data
        return doc_data
        
    try:
        db.collection("interviews").document(session_id).set(doc_data)
        return doc_data
    except Exception as e:
        logger.error("Failed to create interview session in Firestore: %s", str(e))
        if "interviews" not in _in_memory_db:
            _in_memory_db["interviews"] = {}
        _in_memory_db["interviews"][session_id] = doc_data
        return doc_data

def get_interview_session(session_id: str) -> dict | None:
    """Retrieves mock interview session details by ID."""
    db = get_firestore_client()
    if db is None:
        return _in_memory_db.get("interviews", {}).get(session_id)
        
    try:
        doc = db.collection("interviews").document(session_id).get()
        if doc.exists:
            return doc.to_dict()
        return _in_memory_db.get("interviews", {}).get(session_id)
    except Exception as e:
        logger.error("Failed to retrieve interview session from Firestore: %s", str(e))
        return _in_memory_db.get("interviews", {}).get(session_id)

def add_interview_turn(session_id: str, question: str, answer: str, next_question: str = None, is_completed: bool = False) -> dict:
    """Appends an interview turn and updates the current turn count/question status."""
    session = get_interview_session(session_id)
    if not session:
        raise DatabaseException("Interview session not found.")
        
    from datetime import datetime
    turn = {
        "turn": session["currentTurn"] + 1,
        "question": question,
        "userAnswer": answer,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    session["currentTurn"] += 1
    session["history"].append(turn)
    if next_question:
        session["currentQuestion"] = next_question
    if is_completed:
        session["status"] = "COMPLETED"
        
    db = get_firestore_client()
    if db is None:
        _in_memory_db["interviews"][session_id] = session
        return session
        
    try:
        db.collection("interviews").document(session_id).set(session)
        return session
    except Exception as e:
        logger.error("Failed to update interview turn in Firestore: %s", str(e))
        # Update local fallback
        if "interviews" not in _in_memory_db:
            _in_memory_db["interviews"] = {}
        _in_memory_db["interviews"][session_id] = session
        return session

def save_interview_evaluation(session_id: str, evaluation: dict) -> dict:
    """Saves the final AI interview evaluation details and sets status to COMPLETED."""
    session = get_interview_session(session_id)
    if not session:
        raise DatabaseException("Interview session not found.")
        
    session["status"] = "COMPLETED"
    session["evaluation"] = evaluation
    from datetime import datetime
    session["completedAt"] = datetime.utcnow().isoformat()
    
    db = get_firestore_client()
    if db is None:
        _in_memory_db["interviews"][session_id] = session
        return session
        
    try:
        db.collection("interviews").document(session_id).set(session)
        return session
    except Exception as e:
        logger.error("Failed to save interview evaluation in Firestore: %s", str(e))
        if "interviews" not in _in_memory_db:
            _in_memory_db["interviews"] = {}
        _in_memory_db["interviews"][session_id] = session
        return session

def get_user_dsa_progress(user_id: str) -> list:
    """Retrieves all DSA problem solving records for a user."""
    db = get_firestore_client()
    if db is None:
        return [p for p in _in_memory_db.get("dsa_progress", []) if p.get("userId") == user_id]
        
    try:
        docs = db.collection("dsa_progress").where("userId", "==", user_id).stream()
        progress = []
        for doc in docs:
            progress.append(doc.to_dict())
        return progress
    except Exception as e:
        logger.error("Failed to query DSA progress from Firestore: %s", str(e))
        return [p for p in _in_memory_db.get("dsa_progress", []) if p.get("userId") == user_id]

def update_user_dsa_progress(user_id: str, problem_id: str, status: str, code: str = None, language: str = None, notes: str = None, time_spent: int = None) -> dict:
    """Updates solving status, notes, last submitted code, or timer intervals for a DSA problem."""
    db = get_firestore_client()
    from datetime import datetime
    
    if status == "SOLVED":
        try:
            update_dsa_streak(user_id)
        except Exception as stre:
            logger.error("Failed to update daily streak: %s", str(stre))
            
    progress_id = f"{user_id}_{problem_id}"
    doc_data = {
        "progressId": progress_id,
        "userId": user_id,
        "problemId": problem_id,
        "status": status,
        "lastCodeSubmitted": code,
        "language": language or "python",
        "notes": notes,
        "timeSpentSeconds": time_spent or 0,
        "updatedAt": datetime.utcnow().isoformat()
    }
    
    if db is None:
        if "dsa_progress" not in _in_memory_db:
            _in_memory_db["dsa_progress"] = []
            
        existing = next((p for p in _in_memory_db["dsa_progress"] if p["progressId"] == progress_id), None)
        if existing:
            existing.update(doc_data)
        else:
            _in_memory_db["dsa_progress"].append(doc_data)
        return doc_data
        
    try:
        db.collection("dsa_progress").document(progress_id).set(doc_data)
        return doc_data
    except Exception as e:
        logger.error("Failed to update DSA progress in Firestore: %s", str(e))
        if "dsa_progress" not in _in_memory_db:
            _in_memory_db["dsa_progress"] = []
        existing = next((p for p in _in_memory_db["dsa_progress"] if p["progressId"] == progress_id), None)
        if existing:
            existing.update(doc_data)
        else:
            _in_memory_db["dsa_progress"].append(doc_data)
        return doc_data

def get_user_roadmap(user_id: str) -> dict | None:
    """Retrieves the active roadmap for a user."""
    db = get_firestore_client()
    if db is None:
        return _in_memory_db.get(f"roadmap_{user_id}")
        
    try:
        docs = db.collection("roadmaps").where("userId", "==", user_id).stream()
        for doc in docs:
            return doc.to_dict()
        return _in_memory_db.get(f"roadmap_{user_id}")
    except Exception as e:
        logger.error("Failed to query roadmap from Firestore: %s", str(e))
        return _in_memory_db.get(f"roadmap_{user_id}")

def save_user_roadmap(user_id: str, target_role: str, duration_weeks: int, roadmap_data: dict) -> dict:
    """Saves a generated learning roadmap for a user."""
    db = get_firestore_client()
    from datetime import datetime
    
    roadmap_id = roadmap_data.get("roadmapId") or f"roadmap_{user_id}"
    doc_data = {
        "roadmapId": roadmap_id,
        "userId": user_id,
        "targetRole": target_role,
        "durationWeeks": duration_weeks,
        "currentWeek": 1,
        "weeks": roadmap_data.get("weeks", []),
        "generatedAt": datetime.utcnow().isoformat()
    }
    
    if db is None:
        _in_memory_db[f"roadmap_{user_id}"] = doc_data
        return doc_data
        
    try:
        db.collection("roadmaps").document(roadmap_id).set(doc_data)
        return doc_data
    except Exception as e:
        logger.error("Failed to save roadmap in Firestore: %s", str(e))
        _in_memory_db[f"roadmap_{user_id}"] = doc_data
        return doc_data

def toggle_roadmap_task_status(roadmap_id: str, task_id: str, completed: bool) -> dict:
    """Finds the roadmap, toggles completion status of the subtask identified by task_id."""
    db = get_firestore_client()
    
    roadmap = None
    if db is None:
        for key, val in _in_memory_db.items():
            if key.startswith("roadmap_") and isinstance(val, dict) and val.get("roadmapId") == roadmap_id:
                roadmap = val
                break
    else:
        try:
            doc = db.collection("roadmaps").document(roadmap_id).get()
            if doc.exists:
                roadmap = doc.to_dict()
        except Exception as e:
            logger.error("Failed to fetch roadmap for toggling: %s", str(e))
            
    if not roadmap:
        for key, val in _in_memory_db.items():
            if key.startswith("roadmap_") and isinstance(val, dict) and val.get("roadmapId") == roadmap_id:
                roadmap = val
                break
                
    if not roadmap:
        raise DatabaseException("Roadmap document not found.")
        
    task_found = False
    for week in roadmap.get("weeks", []):
        for task in week.get("tasks", []):
            if task.get("taskId") == task_id:
                task["completed"] = completed
                task_found = True
                break
        if task_found:
            week["completed"] = all(t.get("completed", False) for t in week.get("tasks", []))
            break
            
    if db is None:
        user_id = roadmap.get("userId")
        _in_memory_db[f"roadmap_{user_id}"] = roadmap
        return roadmap
        
    try:
        db.collection("roadmaps").document(roadmap_id).set(roadmap)
        return roadmap
    except Exception as e:
        logger.error("Failed to update roadmap tasks in Firestore: %s", str(e))
        user_id = roadmap.get("userId")
        _in_memory_db[f"roadmap_{user_id}"] = roadmap
        return roadmap

def get_user_company_preps(user_id: str) -> list:
    """Retrieves all company preparation documents for a user."""
    db = get_firestore_client()
    if db is None:
        return [c for c in _in_memory_db.get("company_preps", []) if c.get("userId") == user_id]
        
    try:
        docs = db.collection("company_prep").where("userId", "==", user_id).stream()
        preps = []
        for doc in docs:
            preps.append(doc.to_dict())
        return preps
    except Exception as e:
        logger.error("Failed to query company preps from Firestore: %s", str(e))
        return [c for c in _in_memory_db.get("company_preps", []) if c.get("userId") == user_id]

def save_user_company_prep(user_id: str, company_name: str, role: str, prep_data: dict) -> dict:
    """Saves a generated company preparation guide for a user."""
    db = get_firestore_client()
    import uuid
    from datetime import datetime
    
    prep_id = f"prep_{uuid.uuid4().hex[:8]}"
    doc_data = {
        "prepId": prep_id,
        "userId": user_id,
        "companyName": company_name,
        "role": role,
        "readinessPercentage": prep_data.get("readinessPercentage", 0),
        "focusTopics": prep_data.get("focusTopics", []),
        "checklist": prep_data.get("checklist", []),
        "companyInsights": prep_data.get("companyInsights", {}),
        "updatedAt": datetime.utcnow().isoformat()
    }
    
    if db is None:
        if "company_preps" not in _in_memory_db:
            _in_memory_db["company_preps"] = []
        _in_memory_db["company_preps"].append(doc_data)
        return doc_data
        
    try:
        db.collection("company_prep").document(prep_id).set(doc_data)
        return doc_data
    except Exception as e:
        logger.error("Failed to save company prep in Firestore: %s", str(e))
        if "company_preps" not in _in_memory_db:
            _in_memory_db["company_preps"] = []
        _in_memory_db["company_preps"].append(doc_data)
        return doc_data

def get_user_interviews(user_id: str) -> list:
    """Retrieves all mock interview sessions for a specific user ID."""
    db = get_firestore_client()
    if db is None:
        return [i for i in _in_memory_db.get("interviews", {}).values() if i.get("userId") == user_id]
        
    try:
        docs = db.collection("interviews").where("userId", "==", user_id).stream()
        interviews = []
        for doc in docs:
            interviews.append(doc.to_dict())
        return interviews
    except Exception as e:
        logger.error("Failed to query interviews in Firestore: %s. Falling back to local cache.", str(e))
        return [i for i in _in_memory_db.get("interviews", {}).values() if i.get("userId") == user_id]

def get_resume_analysis(resume_id: str) -> dict | None:
    """Retrieves a single resume analysis details by ID."""
    db = get_firestore_client()
    if db is None:
        return next((r for r in _in_memory_db.get("resumes", []) if r.get("resumeId") == resume_id), None)
        
    try:
        doc = db.collection("resumes").document(resume_id).get()
        if doc.exists:
            return doc.to_dict()
        return next((r for r in _in_memory_db.get("resumes", []) if r.get("resumeId") == resume_id), None)
    except Exception as e:
        logger.error("Failed to retrieve resume from Firestore: %s", str(e))
        return next((r for r in _in_memory_db.get("resumes", []) if r.get("resumeId") == resume_id), None)

def update_dsa_streak(user_id: str) -> int:
    """Updates the user's daily problem-solving streak and returns the new streak value."""
    db = get_firestore_client()
    from datetime import datetime, timedelta
    today_str = datetime.utcnow().date().isoformat()
    yesterday_str = (datetime.utcnow().date() - timedelta(days=1)).isoformat()
    
    streak = 1
    last_solve = today_str
    
    profile = get_user_profile(user_id)
    if profile:
        last_solve = profile.get("lastSolveDate")
        current_streak = profile.get("dsaStreak", 0)
        
        if last_solve == today_str:
            streak = current_streak
        elif last_solve == yesterday_str:
            streak = current_streak + 1
        else:
            streak = 1
            
    if db is None:
        if user_id in _in_memory_db:
            _in_memory_db[user_id]["dsaStreak"] = streak
            _in_memory_db[user_id]["lastSolveDate"] = today_str
    else:
        try:
            db.collection("users").document(user_id).update({
                "dsaStreak": streak,
                "lastSolveDate": today_str
            })
        except Exception as e:
            logger.error("Failed to update user streak in Firestore: %s", str(e))
            if user_id in _in_memory_db:
                _in_memory_db[user_id]["dsaStreak"] = streak
                _in_memory_db[user_id]["lastSolveDate"] = today_str
                
    return streak

def add_custom_dsa_problem(user_id: str, problem_id: str, title: str, topic: str, difficulty: str, status: str) -> dict:
    """Inserts a custom DSA problem solved record with category metadata."""
    db = get_firestore_client()
    from datetime import datetime
    
    progress_id = f"{user_id}_{problem_id}"
    doc_data = {
        "progressId": progress_id,
        "userId": user_id,
        "problemId": problem_id,
        "title": title,
        "topic": topic,
        "difficulty": difficulty,
        "status": status,
        "notes": "Custom problem added by user",
        "updatedAt": datetime.utcnow().isoformat()
    }
    
    if db is None:
        if "dsa_progress" not in _in_memory_db:
            _in_memory_db["dsa_progress"] = []
        _in_memory_db["dsa_progress"].append(doc_data)
        return doc_data
        
    try:
        db.collection("dsa_progress").document(progress_id).set(doc_data)
        return doc_data
    except Exception as e:
        logger.error("Failed to save custom problem progress in Firestore: %s", str(e))
        if "dsa_progress" not in _in_memory_db:
            _in_memory_db["dsa_progress"] = []
        _in_memory_db["dsa_progress"].append(doc_data)
        return doc_data







