import axios from "axios";
import { auth } from "./firebase";

// Create Axios Instance
const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach Firebase Auth JWT Token dynamically
// api.interceptors.request.use(
//   async (config) => {
//     const user = auth.currentUser;
//     if (user) {
//       const token = await user.getIdToken();
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// demo code edited
// Interceptor to attach Firebase Auth JWT Token dynamically
api.interceptors.request.use(
  async (config) => {
    try {
      // Wait until Firebase Auth has initialized
      await auth.authStateReady();

      const user = auth.currentUser;

      if (user) {
        // Always request a fresh ID token
        const token = await user.getIdToken(true);

        config.headers.Authorization = `Bearer ${token}`;

        console.log("✅ Token attached:", token.substring(0, 20) + "...");
      } else {
        console.warn("⚠️ No authenticated Firebase user found.");
      }

      return config;
    } catch (err) {
      console.error("Failed to attach Firebase token:", err);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// API Endpoints Functions

// Auth & User Profile
export const getUserProfile = () => api.get("/auth/me");
export const onboardUser = (onboardData) => api.post("/auth/onboard", onboardData);

// Resume Analyzer
export const uploadResume = (formData) => {
  return api.post("/resumes/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getResumeHistory = () => api.get("/resumes/history");
export const downloadResumeReport = (resumeId) => api.get(`/resumes/${resumeId}/report`);

// Mock Interviews
export const startMockInterview = (role, company, interviewType) => api.post("/interviews/start", { role, company, interviewType });
export const submitInterviewAnswer = (sessionId, answer) => api.post(`/interviews/${sessionId}/answer`, { answer });
export const evaluateMockInterview = (sessionId) => api.post(`/interviews/${sessionId}/evaluate`);
export const getInterviewHistory = () => api.get("/interviews/history");

// Coding Workspace
export const getCodingProblems = () => api.get("/coding/problems");
export const getCodingHint = (problemId, code, language) => api.post(`/coding/${problemId}/hint`, { code, language });
export const submitCodingSolution = (problemId, code, language) => api.post(`/coding/${problemId}/submit`, { code, language });
export const runCodingCode = (problemId, code, language) => api.post(`/coding/${problemId}/run`, { code, language });

// DSA Progress Tracker
export const getDSATopics = () => api.get("/dsa/topics");
export const updateDSAProblemProgress = (progressData) => api.post("/dsa/update", progressData);
export const addDSAProblem = (problemData) => api.post("/dsa/add", problemData);

// Company Prep
export const getCompanyPrepInsight = () => api.get("/company/prep");
export const generateCompanyPrepGuide = (companyName, role) => api.post("/company/generate", { companyName, role });

// AI Roadmap
export const generateStudyRoadmap = (targetRole, targetCompany, durationWeeks, currentSkills) => {
  return api.post("/roadmap/generate", { targetRole, targetCompany, durationWeeks, currentSkills });
};
export const toggleRoadmapMilestoneTask = (roadmapId, taskId, completed) => {
  return api.patch(`/roadmap/${roadmapId}/tasks/${taskId}`, { completed });
};
export const getActiveRoadmap = () => {
  return api.get("/roadmap/active");
};

// Analytics Dashboard
export const getDashboardAnalytics = () => api.get("/stats/overview");

export default api;
