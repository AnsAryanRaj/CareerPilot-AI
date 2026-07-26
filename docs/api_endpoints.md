# API Endpoints Specification

All endpoints are prefix-routed under `/api/v1` and require an Authorization Header:
`Authorization: Bearer <FIREBASE_JWT_TOKEN>`

---

## 1. Authentication & Onboarding

### `GET /api/v1/auth/me`
Retrieve user profile details. Automatically sets up a profile database record if the Firebase UID doesn't exist.
- **Headers**: `Authorization: Bearer <Token>`
- **Response (200 OK)**:
  ```json
  {
    "uid": "1a2b3c4d5e",
    "email": "student@university.edu",
    "fullName": "Jane Doe",
    "avatarUrl": "https://lh3.googleusercontent.com/...",
    "targetRole": "Software Engineer",
    "targetCompanies": ["Google", "Stripe"],
    "experienceLevel": "Entry-Level",
    "onboarded": true,
    "createdAt": "2026-07-17T14:48:13Z"
  }
  ```

### `POST /api/v1/auth/onboard`
Submit onboarding data.
- **Request Body**:
  ```json
  {
    "targetRole": "Frontend Engineer",
    "targetCompanies": ["Stripe", "Microsoft"],
    "experienceLevel": "Entry-Level"
  }
  ```
- **Response (200 OK)**: User profile dict updated.

---

## 2. Resume Builder & Analyzer

### `POST /api/v1/resumes/analyze`
Upload a resume document (PDF / TXT) to execute Gemini AI evaluations.
- **Content-Type**: `multipart/form-data`
- **Request Body**: file upload payload (`file`)
- **Response (200 OK)**:
  ```json
  {
    "resumeId": "res_897123",
    "overallScore": 82,
    "metrics": {
      "impact": 78,
      "structure": 85,
      "brevity": 90,
      "grammar": 95
    },
    "feedback": {
      "strengths": ["Clear impact statements", "Good layout consistency"],
      "improvements": ["Quantify impact on project achievements"],
      "keywordMatchPercentage": 65,
      "missingKeywords": ["GraphQL", "CI/CD"]
    }
  }
  ```

### `GET /api/v1/resumes/history`
Retrieve all previous evaluations.
- **Response (200 OK)**: Array of resume analysis summaries.

---

## 3. AI Mock Interview

### `POST /api/v1/interviews/start`
Start a new role/company mock interview session.
- **Request Body**:
  ```json
  {
    "role": "Software Engineer",
    "company": "Google"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "sessionId": "mock_678234",
    "firstQuestion": "Can you tell me about a time you solved an ambiguous technical problem?"
  }
  ```

### `POST /api/v1/interviews/{sessionId}/answer`
Submit reply to the active interview question.
- **Request Body**:
  ```json
  {
    "answer": "We had a bug where the client session was desyncing, so I set up a heartbeat monitor..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "nextQuestion": "How did you monitor performance bottlenecks?",
    "isCompleted": false
  }
  ```
  *(Returns `nextQuestion: null` and `isCompleted: true` on completion)*

### `POST /api/v1/interviews/{sessionId}/evaluate`
Get final performance audit scores based on behavioral coherence and STAR structure metrics.
- **Response (200 OK)**:
  ```json
  {
    "overallScore": 75,
    "overallFeedback": "Strong technical details, structure Situation-Task-Result metrics more cleanly.",
    "starFrameworkScore": {
      "Situation": 80,
      "Task": 70,
      "Action": 85,
      "Result": 65
    }
  }
  ```

---

## 4. DSA Progress Tracker

### `GET /api/v1/dsa/topics`
Get the list of problems map sorted by category/topic.
- **Response (200 OK)**:
  ```json
  [
    {
      "topic": "Arrays & Hashing",
      "solved": 1,
      "total": 15,
      "problems": [
        {
          "problemId": "two-sum",
          "title": "Two Sum",
          "difficulty": "Easy",
          "status": "SOLVED"
        }
      ]
    }
  ]
  ```

### `POST /api/v1/dsa/update`
Update progress for a specific DSA challenge.
- **Request Body**:
  ```json
  {
    "problemId": "two-sum",
    "status": "SOLVED",
    "code": "def twoSum(nums, target): ...",
    "language": "python",
    "notes": "Fast hash map solution.",
    "timeSpent": 320
  }
  ```
- **Response (200 OK)**: Success status + updated entry block.

---

## 5. Company Preparation

### `GET /api/v1/company/prep`
List user's active targeted company configurations.
- **Response (200 OK)**: Array of company insights list.

### `POST /api/v1/company/generate`
Trigger Gemini analysis to construct insights, common question patterns, and targeted preparation steps.
- **Request Body**:
  ```json
  {
    "companyName": "Google",
    "role": "Software Engineer"
  }
  ```
- **Response (200 OK)**: Details on recruitment flow, targeted checklists, and key coding focus areas.

---

## 6. AI Roadmap Generator

### `POST /api/v1/roadmap/generate`
Trigger Gemini assessment to outline weekly schedules based on student profile and durations.
- **Request Body**:
  ```json
  {
    "targetRole": "Full-Stack Developer",
    "durationWeeks": 6,
    "currentSkills": ["React", "Python"]
  }
  ```
- **Response (200 OK)**: A JSON map listing week numbers, titles, tasks, resources, and checkboxes.
