# System Architecture

This document describes the high-level architecture, flow, and component design of CareerPilot AI.

## 1. Directory Layout & Flow

The repository is structured as a monorepo containing:
- `docs/`: System documentation and specifications.
- `backend/`: FastAPI Python backend codebase.
- `frontend/`: React + Vite + Tailwind CSS frontend application.

## 2. Authentication Flow

Authentication is managed via Firebase Authentication on the client side, while the FastAPI backend validates authorization tokens.

```
+----------+             +---------------+             +-----------------+
|  Client  | ----------> | Firebase Auth | ----------> | Return ID Token |
+----------+             +---------------+             +-----------------+
     |                                                          |
     | (Include Bearer Token)                                   |
     v                                                          v
+-----------------+      +-----------------------+     +-------------------+
| FastAPI Backend | ---> | Decode & Verify Token | --> | DB/Gemini Actions |
+-----------------+      +-----------------------+     +-------------------+
```

1. The React app requests Google / Email-Password login from Firebase client SDK.
2. Firebase issues a JWT ID token.
3. Every API call made by the Axios client includes this JWT in the `Authorization: Bearer <ID_TOKEN>` header.
4. FastAPI's auth dependency (`get_current_user`) decodes and verifies the token using the `firebase-admin` SDK.
5. If the token is valid, the backend retrieves or initializes the user profile in Firestore.

## 3. Database Strategy (NoSQL Firestore)

Firestore stores structured data across collections. The FastAPI backend holds service wrappers to execute transactions, filters, and records updates:
- **`users`**: Master user profiles.
- **`resumes`**: Store analyzed resume scores, parsed sections, and Gemini feedback.
- **`interviews`**: Maintain logs of individual mock sessions, transcripts, and STAR evaluations.
- **`dsa_progress`**: Tracks problem status (`SOLVED`, `ATTEMPTED`) and topic mappings.
- **`company_prep`**: Custom checkpoints, targeted guides, and insights.
- **`roadmaps`**: Adaptive weeks schedules.

## 4. Prompts & Structured AI Output

To achieve production reliability, prompt templates are isolated from logic:
- Prompt definitions live in `backend/app/prompts/`.
- Pydantic response models reside in `backend/app/parsers/`.
- The backend prompts Gemini with system instructions requesting `response_schema` format configurations. This guarantees that JSON replies always parse correctly into Pydantic models.
