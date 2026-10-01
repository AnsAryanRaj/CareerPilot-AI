<div align="center">



\# CareerPilot AI



\### AI-Powered Placement Preparation Platform



A unified workspace for resume analysis, DSA tracking, interview preparation, skill development, career planning, and placement readiness.



<br>



\[View Repository](https://github.com/AnsAryanRaj/CareerPilot-AI)



</div>



\---



\## Overview



CareerPilot AI is a full-stack placement-preparation platform designed to connect the major stages of technical placement preparation into one continuous workflow.



Students can work on their resume, track DSA practice, prepare for interviews, identify skill gaps, build career roadmaps, and monitor their preparation from a single platform.



The application combines a React frontend, FastAPI backend, Firebase authentication and persistence, and Google Gemini for AI-powered analysis.



\---



\## The Platform



| Module | Purpose |

|---|---|

| AI Resume Analyzer | Resume analysis, ATS-oriented feedback and improvement suggestions |

| DSA Tracker | Track coding practice, topics and problem-solving progress |

| AI Interview Preparation | Technical and HR interview practice |

| Skill Gap Analysis | Identify skills that need improvement |

| Career Roadmaps | Build a structured preparation path |

| Preparation Analytics | Understand preparation activity and progress |

| Professional Profile Analysis | Analyze authorized professional-profile information |



\---



\## Product Flow



```text

Create Profile

&#x20;     |

&#x20;     v

Resume Analysis

&#x20;     |

&#x20;     v

Identify Skill Gaps

&#x20;     |

&#x20;     +----------------+----------------+

&#x20;     |                |                |

&#x20;     v                v                v

&#x20;DSA Practice     Interviews     Skill Building

&#x20;     |                |                |

&#x20;     +----------------+----------------+

&#x20;                      |

&#x20;                      v

&#x20;               Career Roadmap

&#x20;                      |

&#x20;                      v

&#x20;               Track \& Improve

Architecture

+-------------------------------------------------------------+

|                         FRONTEND                            |

|                                                             |

|              React + Vite + Tailwind CSS                    |

|                                                             |

| Landing | Dashboard | Resume | DSA | Interview | Roadmap   |

+------------------------------+------------------------------+

&#x20;                              |

&#x20;                              | REST API

&#x20;                              v

+-------------------------------------------------------------+

|                          BACKEND                            |

|                                                             |

|                          FastAPI                            |

|                                                             |

| Auth | Resume | DSA | Interviews | Roadmaps | AI Services  |

+------------------+------------------------+-----------------+

&#x20;                  |                        |

&#x20;                  v                        v

&#x20;         +----------------+       +----------------+

&#x20;         |    Firebase    |       |  Google Gemini |

&#x20;         |                |       |                |

&#x20;         | Authentication|       | AI Analysis    |

&#x20;         | Firestore      |       | Structured AI  |

&#x20;         +----------------+       +----------------+

AI Resume Analysis



The resume pipeline is designed around structured analysis rather than returning unstructured AI text.



Resume Upload

&#x20;     |

&#x20;     v

File Validation

&#x20;     |

&#x20;     v

PDF / DOCX / TXT Parsing

&#x20;     |

&#x20;     v

Resume Content Validation

&#x20;     |

&#x20;     v

Gemini Structured Analysis

&#x20;     |

&#x20;     v

Validated Analysis Schema

&#x20;     |

&#x20;     v

Firestore Persistence

&#x20;     |

&#x20;     v

Dashboard / Resume Report



The analysis can cover:



Overall resume score

ATS score

Grammar

Technical strength

Communication

Keywords

Missing skills

Project recommendations

Certification recommendations

Career suggestions

Interview preparation areas

Technology

Layer	Technology

Frontend	React

Build Tool	Vite

Styling	Tailwind CSS

Backend	FastAPI

API Server	Uvicorn

Authentication	Firebase Authentication

Database	Cloud Firestore

AI	Google Gemini

Resume Parsing	PyPDF2 / DOCX XML parsing

API Communication	REST

Languages	JavaScript / Python

Project Structure

CareerPilot AI/

|

+-- backend/

|   +-- app/

|   |   +-- api/

|   |   +-- core/

|   |   +-- parsers/

|   |   +-- prompts/

|   |   +-- services/

|   |   +-- main.py

|   |

|   +-- tests/

|   +-- requirements.txt

|

+-- frontend/

|   +-- public/

|   +-- src/

|       +-- components/

|       +-- pages/

|       +-- services/

|       +-- App.jsx

|

+-- .gitignore

+-- README.md

Authentication and Data Handling



CareerPilot AI uses Firebase Authentication for user identity and Cloud Firestore for persistent application data.



Backend APIs use authenticated requests and user ownership checks to keep user-specific resources separated.



The application follows a simple data-integrity principle:



User-specific information should come from authenticated user data or actual application activity, not fabricated values.



Examples include:



Resume reports

DSA progress

Interview history

Roadmap tasks

User profile information

Preparation analytics

Engineering Focus



CareerPilot AI is not only a UI project.



The backend includes separate services for:



Authentication

Resume parsing

AI analysis

Firebase persistence

DSA tracking

Interview workflows

Career roadmap generation

Company preparation



The application also uses structured validation for AI-generated resume analysis so frontend components can work with predictable data.



Security Considerations



Security and data integrity are treated as part of the product rather than as an afterthought.



Current engineering work includes:



Firebase token verification

Authenticated API requests

User-owned Firestore resources

Resume file validation

Environment-based secret management

Git exclusion of credentials and generated files

Separation of frontend and backend responsibilities



Production hardening remains part of the development roadmap.



Product Design



CareerPilot AI uses a light-first SaaS design language focused on clarity and usability.



The interface uses:



White and soft neutral surfaces

Blue primary actions

Dark navy typography

Subtle borders

Soft shadows

Responsive layouts

Consistent navigation

Clear loading, empty, and error states



The product is intentionally designed as a practical career-preparation workspace rather than a futuristic AI dashboard.



Demo



Product demo coming soon.



The repository will include a real application walkthrough showing the main CareerPilot AI workflow.



Screenshots



Screenshots will be added as the product UI continues to evolve.



Planned views:



Landing Page

Dashboard

Resume Analyzer

DSA Tracker

Interview Preparation

Skill Gap Analysis

Career Roadmap

Analytics

Local Development

1\. Clone the repository

git clone https://github.com/AnsAryanRaj/CareerPilot-AI.git

cd CareerPilot-AI

2\. Backend

cd backend

..\\.venv\\Scripts\\Activate.ps1

pip install -r requirements.txt

uvicorn app.main:app --reload



Backend:



http://localhost:8000



Health endpoint:



http://localhost:8000/health

3\. Frontend



Open another terminal:



cd frontend

npm install

npm run dev

Environment Configuration



Secrets and credentials should never be committed to the repository.



Typical configuration includes:



Gemini API credentials

Firebase configuration

Firebase Admin credentials

Frontend API configuration



Use local environment variables or secure configuration files for development.



Development Roadmap

Completed / Integrated

&#x20;React + Vite frontend

&#x20;FastAPI backend

&#x20;Firebase Authentication

&#x20;Firestore integration

&#x20;Resume upload and parsing

&#x20;AI resume analysis

&#x20;DSA tracking

&#x20;Interview preparation workflow

&#x20;Career roadmap workflow

&#x20;Landing page

&#x20;Responsive product UI

&#x20;GitHub repository and documentation

In Progress

&#x20;Production security hardening

&#x20;Complete authorization coverage

&#x20;AI failure handling and reliability

&#x20;Skill Gap Analysis backend

&#x20;LinkedIn Profile Analyzer backend

&#x20;Analytics refinement

&#x20;Real product demo and screenshots

Future

&#x20;Deeper placement-readiness intelligence

&#x20;Expanded career and company preparation

&#x20;More personalized preparation workflows

&#x20;Production deployment

Project Philosophy



CareerPilot AI is being developed around three principles.



1\. Useful over flashy



Every feature should solve a real placement-preparation problem.



2\. Real data over fabricated numbers



The application should represent actual user activity and actual analysis.



Missing information should not be disguised as fabricated progress.



3\. AI as an assistant



AI is used to analyze, explain, recommend, and personalize preparation, not to replace the student's own decision-making.



Project Status



CareerPilot AI is an actively developed full-stack project.



The core application architecture, authentication, AI resume analysis, DSA tracking, interview workflows, roadmap functionality, and product UI are integrated.



Current development is focused on reliability, security hardening, feature completion, and production readiness.



Author



Aryan Raj



Computer Science and Engineering — Data Science



GitHub



<div align="center">

CareerPilot AI



Prepare smarter. Track progress. Build toward your career.



</div>

