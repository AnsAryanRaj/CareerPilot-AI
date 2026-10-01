import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquareCode,
  CheckSquare,
  Building2,
  GitBranch,
  BarChart3,
  LogOut,
  Upload,
  Play,
  CheckCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Send,
  Loader2,
  Sparkles,
  Download,
  Plus,
  Code2,
  Terminal,
  ChevronDown,
  Bell,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Target,
  Trophy,
  Sliders,
  CheckCircle2,
  BookOpen,
  Menu,
  X,
  Calendar,
  AlertCircle,
  HelpCircle,
  User,
  Check,
  Briefcase,
  Trash2,
  Compass
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import {
  uploadResume,
  getResumeHistory,
  startMockInterview,
  submitInterviewAnswer,
  evaluateMockInterview,
  getDSATopics,
  updateDSAProblemProgress,
  getCompanyPrepInsight,
  generateCompanyPrepGuide,
  generateStudyRoadmap,
  toggleRoadmapMilestoneTask,
  getDashboardAnalytics,
  getActiveRoadmap,
  downloadResumeReport,
  deleteResume,
  addDSAProblem,
  getCodingProblems,
  getCodingHint,
  submitCodingSolution,
  runCodingCode,
  getInterviewHistory
} from "./services/api";

// Custom Premium Count-Up Animation Component for SaaS metrics
const AnimatedCounter = ({ value, duration = 0.8, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const stepTime = Math.max(Math.floor((duration * 1000) / end), 15);
    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
};

// Reusable Circular Progress Ring for Readiness metrics
const CircularProgress = ({ value, size = 100, strokeWidth = 8, color = "stroke-blue-600" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="stroke-slate-200"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${color} transition-all duration-700 ease-out`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-extrabold text-slate-900 tracking-tight">
          <AnimatedCounter value={value} suffix="%" />
        </span>
        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Ready</span>
      </div>
    </div>
  );
};

// Reusable Loading Skeleton Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-850/50 rounded-xl border border-white/[0.03] ${className}`}></div>
);

function DashboardWrapper() {
  const { currentUser, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Layout Controls
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // States for each feature panel
  const [stats, setStats] = useState(null);
  const [resumeList, setResumeList] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);

  const [dashboardResumeFile, setDashboardResumeFile] = useState(null);
  const [dashboardUploadProgress, setDashboardUploadProgress] = useState(0);
  const [dashboardUploadStatus, setDashboardUploadStatus] = useState("idle");
  const [dashboardUploadMessage, setDashboardUploadMessage] = useState("");
  const [dashboardAnalysisResult, setDashboardAnalysisResult] = useState(null);
  const [dashboardResumeId, setDashboardResumeId] = useState(null);

  const [interviewSession, setInterviewSession] = useState(null);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewResult, setInterviewResult] = useState(null);

  const [mockInterviewHistory, setMockInterviewHistory] = useState([]);
  const [interviewType, setInterviewType] = useState("TECHNICAL");
  const [customRole, setCustomRole] = useState("Software Engineer");
  const [customCompany, setCustomCompany] = useState("");
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const [dsaTopics, setDSATopics] = useState([]);
  const [companyPreps, setCompanyPreps] = useState([]);
  const [roadmap, setRoadmap] = useState(null);

  // Interactive Goals Checklist State (persisted per authenticated user)
  const [dailyGoals, setDailyGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState("");

  useEffect(() => {
    if (currentUser?.uid) {
      try {
        const saved = localStorage.getItem(`dailyGoals_${currentUser.uid}`);
        if (saved) {
          setDailyGoals(JSON.parse(saved));
        } else {
          setDailyGoals([]);
        }
      } catch (e) {
        setDailyGoals([]);
      }
    }
  }, [currentUser?.uid]);

  // Simulated AI Assistant Floating Widget State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I am your CareerPilot AI Assistant. Ask me anything about DSA, resumes, or mock interviews!" }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  // Notifications list (empty state until backend provides notifications)
  const [notifications, setNotifications] = useState([]);

  // Upcoming Interviews list (empty state until user schedules interviews)
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  // Custom problem states
  const [customProblemTitle, setCustomProblemTitle] = useState("");
  const [customProblemTopic, setCustomProblemTopic] = useState("Arrays & Hashing");
  const [customProblemDifficulty, setCustomProblemDifficulty] = useState("Easy");

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // AI Roadmap states
  const [roadmapRole, setRoadmapRole] = useState("Software Engineer");
  const [roadmapCompany, setRoadmapCompany] = useState("Google");
  const [roadmapWeeks, setRoadmapWeeks] = useState(6);
  const [roadmapSkills, setRoadmapSkills] = useState("React, Python, SQL");

  // Coding Playground states
  const [codingProblems, setCodingProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [editorLanguage, setEditorLanguage] = useState("python");
  const [editorCode, setEditorCode] = useState("");
  const [runSuccess, setRunSuccess] = useState(null);
  const [runStdout, setRunStdout] = useState("");
  const [runStderr, setRunStderr] = useState("");
  const [aiReview, setAiReview] = useState(null);
  const [codingHint, setCodingHint] = useState("");

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, aiTyping]);

  // Load Initial Setup Data on mount or when user changes
  useEffect(() => {
    fetchProfileAndStats();
  }, [userProfile?.uid]);

  const fetchProfileAndStats = async () => {
    if (!userProfile) return;
    try {
      setLoading(true);
      const statsRes = await getDashboardAnalytics();
      setStats(statsRes.data);

      const dsaRes = await getDSATopics();
      setDSATopics(dsaRes.data);

      const companyRes = await getCompanyPrepInsight();
      setCompanyPreps(companyRes.data);

      const historyRes = await getResumeHistory();
      setResumeList(historyRes.data);

      try {
        const roadmapRes = await getActiveRoadmap();
        if (roadmapRes.data) {
          setRoadmap(roadmapRes.data);
        }
      } catch (roadmapErr) {
        console.warn("No active roadmap found on login:", roadmapErr);
      }

      try {
        const interviewHistRes = await getInterviewHistory();
        setMockInterviewHistory(interviewHistRes.data);
      } catch (histErr) {
        console.warn("Failed to load interview history:", histErr);
      }
    } catch (err) {
      console.error("Error loading initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Resume upload handler
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    // Validate size (5MB max)
    if (resumeFile.size > 5 * 1024 * 1024) {
      showToast("File size exceeds the 5 MB maximum limit.", "error");
      return;
    }

    // Validate extension
    const ext = resumeFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      showToast("Unsupported file type. Please upload a PDF, DOC, or DOCX document.", "error");
      return;
    }

    try {
      setLoading(true);
      if (currentUser) {
        await currentUser.getIdToken(true);
      }
      const formData = new FormData();
      formData.append("file", resumeFile);
      const res = await uploadResume(formData);
      setResumeResult(res.data);
      showToast("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to upload resume.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!resumeId) return;
    if (!confirm("Are you sure you want to delete this resume analysis from your history?")) return;
    
    try {
      setLoading(true);
      await deleteResume(resumeId);
      showToast("Resume record deleted successfully!");
      
      if (resumeResult && resumeResult.resumeId === resumeId) {
        setResumeResult(null);
      }
      if (dashboardResumeId === resumeId) {
        setDashboardAnalysisResult(null);
        setDashboardResumeId(null);
      }
      
      const historyRes = await getResumeHistory();
      setResumeList(historyRes.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to delete resume record.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setDashboardUploadStatus("error");
      setDashboardUploadMessage("File size exceeds the 5 MB maximum limit.");
      setDashboardResumeFile(null);
      return;
    }

    // Validate extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setDashboardUploadStatus("error");
      setDashboardUploadMessage("Unsupported file type. Please upload a PDF, DOC, or DOCX document.");
      setDashboardResumeFile(null);
      return;
    }

    setDashboardResumeFile(file);
    setDashboardUploadStatus("idle");
    setDashboardUploadMessage("");
    e.target.value = "";
  };

  const handleDashboardResumeUpload = async (e) => {
    e.preventDefault();
    if (!dashboardResumeFile) return;

    setDashboardUploadStatus("uploading");
    setDashboardUploadProgress(10);
    setDashboardUploadMessage("Uploading...");

    let progressInterval;
    try {
      if (currentUser) {
        await currentUser.getIdToken(true);
      }
      const formData = new FormData();
      formData.append("file", dashboardResumeFile);

      progressInterval = setInterval(() => {
        setDashboardUploadProgress((prev) => {
          if (prev < 40) {
            setDashboardUploadMessage("Extracting Resume...");
            return prev + 10;
          } else if (prev < 70) {
            setDashboardUploadMessage("Analyzing Resume...");
            return prev + 5;
          } else if (prev < 95) {
            setDashboardUploadMessage("Saving Analysis...");
            return prev + 3;
          }
          return prev;
        });
      }, 500);

      const res = await uploadResume(formData);
      clearInterval(progressInterval);

      setDashboardUploadProgress(100);
      setDashboardUploadStatus("success");
      setDashboardUploadMessage("Completed");
      showToast("Resume parsed and analyzed successfully!");
      
      if (res.data && res.data.analysis) {
        setDashboardAnalysisResult(res.data.analysis);
        setDashboardResumeId(res.data.resumeId);
      }
    } catch (err) {
      if (progressInterval) clearInterval(progressInterval);
      console.error(err);
      setDashboardUploadStatus("error");
      setDashboardUploadMessage(
        err.response?.data?.message || err.response?.data?.detail || "Failed to analyze resume."
      );
      showToast("Upload failed.", "error");
    }
  };

  // Download report handler
  const handleDownloadReport = async (resumeId) => {
    if (!resumeId) return;
    try {
      setLoading(true);
      const res = await downloadResumeReport(resumeId);
      const blob = new Blob([res.data], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CareerPilot_Resume_Report_${resumeId}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast("Download report completed!");
    } catch (err) {
      console.error("Error downloading report:", err);
      showToast("Failed to download report.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Interview handlers
  const handleStartInterview = async (role, company, type) => {
    try {
      setLoading(true);
      setInterviewResult(null);

      if (timerInterval) clearInterval(timerInterval);
      setInterviewDuration(0);

      const res = await startMockInterview(role, company, type);
      setInterviewSession({
        id: res.data.sessionId,
        role,
        company,
        interviewType: type,
        currentQuestion: res.data.firstQuestion,
        history: []
      });
      showToast("Interview session generated!");

      const interval = setInterval(() => {
        setInterviewDuration((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } catch (err) {
      console.error(err);
      showToast("Failed to start mock interview.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnswer = async (e) => {
    e.preventDefault();
    if (!interviewAnswer.trim() || !interviewSession) return;
    try {
      setLoading(true);
      const answer = interviewAnswer;
      setInterviewAnswer("");

      const updatedHistory = [
        ...interviewSession.history,
        { question: interviewSession.currentQuestion, answer }
      ];

      setInterviewSession({
        ...interviewSession,
        history: updatedHistory,
        currentQuestion: "Interviewer is analyzing your response..."
      });

      const res = await submitInterviewAnswer(interviewSession.id, answer);

      if (res.data.isCompleted || !res.data.nextQuestion) {
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
        const evalRes = await evaluateMockInterview(interviewSession.id);
        setInterviewResult(evalRes.data);
        setInterviewSession(null);
        showToast("Session complete! Evaluation ready.");

        const interviewHistRes = await getInterviewHistory();
        setMockInterviewHistory(interviewHistRes.data);
        fetchProfileAndStats();
      } else {
        setInterviewSession({
          ...interviewSession,
          currentQuestion: res.data.nextQuestion,
          history: updatedHistory
        });
      }
    } catch (err) {
      console.error(err);
      showToast("Error submitting answer. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInterview = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setInterviewSession(null);
    setInterviewAnswer("");
    showToast("Interview session cancelled.");
  };

  // Custom problem submit
  const handleAddCustomProblem = async (e) => {
    e.preventDefault();
    if (!customProblemTitle.trim() || !customProblemTopic.trim()) return;
    try {
      setLoading(true);
      await addDSAProblem({
        title: customProblemTitle,
        topic: customProblemTopic,
        difficulty: customProblemDifficulty,
        status: "UNSTARTED"
      });
      setCustomProblemTitle("");

      const dsaRes = await getDSATopics();
      setDSATopics(dsaRes.data);

      fetchProfileAndStats();
      showToast("Problem added successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to add custom problem.", "error");
    } finally {
      setLoading(false);
    }
  };

  // DSA Update
  const handleToggleDSA = async (problemId, currentStatus) => {
    const nextStatus = currentStatus === "SOLVED" ? "UNSTARTED" : "SOLVED";
    try {
      await updateDSAProblemProgress({
        problemId,
        status: nextStatus,
        notes: "Completed"
      });
      setDSATopics(
        dsaTopics.map((topic) => ({
          ...topic,
          problems: topic.problems.map((p) =>
            p.problemId === problemId ? { ...p, status: nextStatus } : p
          )
        }))
      );
      showToast(nextStatus === "SOLVED" ? "Problem marked solved! 🔥" : "Problem reset.");
      fetchProfileAndStats();
    } catch (err) {
      console.error(err);
      showToast("Failed to update status.", "error");
    }
  };

  // AI Roadmap Generator
  const handleGenerateRoadmap = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const skillsArray = roadmapSkills.split(",").map(s => s.trim()).filter(s => s.length > 0);
      const res = await generateStudyRoadmap(roadmapRole, roadmapCompany, roadmapWeeks, skillsArray);
      setRoadmap(res.data);
      showToast("Study roadmap generated!");
    } catch (err) {
      console.error(err);
      showToast("Failed to generate study roadmap. Please verify parameters.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRoadmapTask = async (weekNumber, taskId, currentVal) => {
    if (!roadmap) return;
    try {
      const nextVal = !currentVal;
      await toggleRoadmapMilestoneTask(roadmap.roadmapId, taskId, nextVal);
      setRoadmap({
        ...roadmap,
        weeks: roadmap.weeks.map((w) =>
          w.weekNumber === weekNumber
            ? {
              ...w,
              tasks: w.tasks.map((t) =>
                t.taskId === taskId ? { ...t, completed: nextVal } : t
              )
            }
            : w
        )
      });
      showToast(nextVal ? "Milestone task completed!" : "Milestone task reset.");
    } catch (err) {
      console.error(err);
    }
  };

  // Coding Playground Handlers
  const fetchCodingProblems = async () => {
    try {
      const res = await getCodingProblems();
      setCodingProblems(res.data);
      if (res.data.length > 0) {
        setSelectedProblem(res.data[0]);
        setEditorCode(res.data[0].starterCode[editorLanguage] || res.data[0].starterCode["python"]);
      }
    } catch (err) {
      console.error("Failed to load coding problems:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "coding" && codingProblems.length === 0) {
      fetchCodingProblems();
    }
  }, [activeTab]);

  const handleSelectProblem = (prob) => {
    setSelectedProblem(prob);
    setEditorCode(prob.starterCode[editorLanguage] || prob.starterCode["python"] || "");
    setRunSuccess(null);
    setRunStdout("");
    setRunStderr("");
    setAiReview(null);
    setCodingHint("");
  };

  const handleLanguageChange = (lang) => {
    setEditorLanguage(lang);
    if (selectedProblem) {
      setEditorCode(selectedProblem.starterCode[lang] || "");
    }
  };

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    try {
      setLoading(true);
      setRunSuccess(null);
      setRunStdout("Executing test cases...");
      setRunStderr("");
      const res = await runCodingCode(selectedProblem.problemId, editorCode, editorLanguage);
      setRunSuccess(res.data.success);
      setRunStdout(res.data.stdout);
      setRunStderr(res.data.stderr);
      showToast(res.data.success ? "Code executed successfully!" : "Code execution failed.", res.data.success ? "success" : "error");
    } catch (err) {
      console.error(err);
      setRunStdout("");
      setRunStderr("Failed to execute code compilation.");
      showToast("Failed to execute code compilation.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!selectedProblem) return;
    try {
      setLoading(true);
      setAiReview(null);
      const res = await submitCodingSolution(selectedProblem.problemId, editorCode, editorLanguage);
      setAiReview(res.data.evaluation);
      showToast("AI Review generated successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to submit solution for AI evaluation.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCodingHint = async () => {
    if (!selectedProblem) return;
    try {
      setLoading(true);
      setCodingHint("Consulting AI mentor...");
      const res = await getCodingHint(selectedProblem.problemId, editorCode, editorLanguage);
      setCodingHint(res.data.hint);
      showToast("AI Hint generated!");
    } catch (err) {
      console.error(err);
      setCodingHint("Could not fetch hint.");
      showToast("Could not fetch hint.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Company prep guide generator
  const handleGenerateCompanyPrep = async (companyName, role) => {
    try {
      setLoading(true);
      const res = await generateCompanyPrepGuide(companyName, role);
      setCompanyPreps([res.data, ...companyPreps]);
      showToast(`Prep guide generated for ${companyName}!`);
    } catch (err) {
      console.error(err);
      showToast("Failed to generate company prep guide.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Human Readable Breadcrumbs based on activeTab
  const getBreadcrumbName = () => {
    switch (activeTab) {
      case "dashboard": return "Readiness Dashboard";
      case "resume": return "Resume Analyzer";
      case "interview": return "Mock Interview Panel";
      case "dsa": return "DSA Progress Tracker";
      case "coding": return "Coding Playground";
      case "company": return "Company Insights";
      case "roadmap": return "Personalized Roadmap";
      default: return "Dashboard";
    }
  };

  // Goals interaction
  const saveGoalsToStorage = (updatedGoals) => {
    setDailyGoals(updatedGoals);
    if (currentUser?.uid) {
      try {
        localStorage.setItem(`dailyGoals_${currentUser.uid}`, JSON.stringify(updatedGoals));
      } catch (e) {}
    }
  };

  const toggleGoal = (id) => {
    const updated = dailyGoals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g));
    saveGoalsToStorage(updated);
    showToast("Goal status updated!");
  };

  const addCustomGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const updated = [
      ...dailyGoals,
      { id: Date.now(), text: newGoalText.trim(), completed: false }
    ];
    saveGoalsToStorage(updated);
    setNewGoalText("");
    showToast("Goal added successfully!");
  };

  const deleteGoal = (id) => {
    const updated = dailyGoals.filter((g) => g.id !== id);
    saveGoalsToStorage(updated);
    showToast("Goal deleted.");
  };

  // AI Assistant Chat Interaction
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setAiTyping(true);

    // Simulate streaming AI reply
    setTimeout(() => {
      let reply = "I can help analyze your progress. Make sure to complete your Resume Audit or take a Mock Interview to improve your placement scores!";
      if (userText.toLowerCase().includes("dsa") || userText.toLowerCase().includes("code")) {
        reply = "For DSA preparation, focus on patterns like Two Pointers, Sliding Windows, and Depth-First Search. Try our Coding Playground module!";
      } else if (userText.toLowerCase().includes("resume") || userText.toLowerCase().includes("ats")) {
        reply = "Your Resume ATS grading score stands at 82%. Try adding high-impact action verbs and removing redundant formatting to hit 90%!";
      } else if (userText.toLowerCase().includes("interview") || userText.toLowerCase().includes("mock")) {
        reply = "Mock interviews help benchmark your Situation-Task-Action-Result answers. You have scheduled mocks coming up tomorrow!";
      }
      setChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setAiTyping(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans transition-all duration-300">

      {/* COLLAPSIBLE SIDEBAR: SaaS Light Theme */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="border-r border-slate-200 bg-white flex flex-col justify-between select-none z-45 shrink-0 shadow-sm"
      >
        <div>
          {/* Logo Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-200 h-16">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                <Compass size={20} className="text-white" />
              </div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h1 className="text-sm font-bold tracking-tight text-slate-900 flex items-center space-x-1">
                    <span>CareerPilot</span>
                    <span className="text-blue-600">AI</span>
                  </h1>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block -mt-0.5">
                    Campus Prep Engine
                  </span>
                </motion.div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 hidden md:block transition-all"
                title="Collapse Sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            )}
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "resume", label: "Resume Analyzer", icon: FileText },
              { id: "interview", label: "Mock Interview", icon: MessageSquareCode },
              { id: "dsa", label: "DSA Tracker", icon: CheckSquare },
              { id: "coding", label: "Coding Playground", icon: Code2 },
              { id: "company", label: "Company Prep", icon: Building2 },
              { id: "roadmap", label: "AI Roadmap", icon: GitBranch },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center rounded-xl transition-all duration-200 text-left py-2.5 px-3.5 relative overflow-hidden group ${isActive
                    ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  title={item.label}
                >
                  <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700 transition-colors"} />
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-medium ml-3 whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Session Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 relative">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200/60"
                title="Expand Sidebar"
              >
                <ChevronRight size={16} />
              </button>
              <div
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 uppercase shrink-0 text-xs cursor-pointer hover:border-blue-500 transition-colors shadow-sm"
              >
                {userProfile?.fullName ? userProfile.fullName[0] : "U"}
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center justify-between min-w-0 cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  {userProfile?.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 uppercase shrink-0 text-xs group-hover:border-blue-400 transition-colors">
                      {userProfile?.fullName ? userProfile.fullName[0] : "U"}
                    </div>
                  )}
                  <div className="overflow-hidden min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{userProfile?.fullName || "Student"}</p>
                    <p className="text-[10px] text-slate-500 truncate">{userProfile?.email || "B.Tech CSE '25"}</p>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
          )}

          {/* Profile Dropdown */}
          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={`absolute bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 z-50 text-xs font-sans space-y-1 ${sidebarCollapsed ? "left-16 bottom-3 w-48" : "left-3 right-3 bottom-16"
                  }`}
              >
                <div className="px-2 py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Profile Actions</span>
                </div>
                <button
                  onClick={() => { setActiveTab("dashboard"); setProfileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all text-left"
                >
                  <User size={14} className="text-blue-600" />
                  <span>Personal Profile</span>
                </button>
                {roadmap?.targetCompany && (
                  <div className="px-2.5 py-1 text-[10px] text-slate-500">
                    Target: {roadmap.targetCompany}
                  </div>
                )}
                <button
                  onClick={() => { setProfileMenuOpen(false); logout(); }}
                  className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-all text-left border-t border-slate-100"
                >
                  <LogOut size={14} />
                  <span className="font-semibold">Log Out Session</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* TOP NAVIGATION HEADER */}
        <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex justify-between items-center sticky top-0 z-30 select-none shadow-sm">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Expand Sidebar"
              >
                <Menu size={16} />
              </button>
            )}
            <span className="font-semibold text-slate-700">CareerPilot AI</span>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="font-medium text-slate-900">{getBreadcrumbName()}</span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 w-72 focus-within:border-blue-500 focus-within:bg-white transition-all group">
            <Search size={15} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search specs, roadmaps, problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs outline-none text-slate-800 placeholder:text-slate-400 w-full"
            />
          </div>

          {/* Right Metrics & Badges */}
          <div className="flex items-center space-x-3 relative">
            {/* Student Designation Badge */}
            {userProfile?.degree && (
              <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-[10px] font-bold">
                <Award size={12} className="text-blue-600" />
                <span>{userProfile.degree}{userProfile?.graduationYear ? ` '${String(userProfile.graduationYear).slice(-2)}` : ''}</span>
              </div>
            )}

            {/* Streak Badge */}
            {userProfile?.dsaStreak && typeof userProfile.dsaStreak === 'number' && userProfile.dsaStreak > 0 ? (
              <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-[10px] font-bold">
                <span>🔥</span>
                <span>{userProfile.dsaStreak} Day Streak</span>
              </div>
            ) : null}

            {/* Target Badge */}
            {(roadmap?.targetCompany || userProfile?.targetCompany) && (
              <div className="hidden xl:flex items-center space-x-1 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-100 text-slate-700 text-[10px] font-bold">
                <Target size={12} className="text-blue-600" />
                <span>Target: {roadmap?.targetCompany || userProfile?.targetCompany}</span>
              </div>
            )}

            <div className="w-px h-5 bg-slate-200 hidden sm:block"></div>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-slate-500 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
            >
              <Bell size={18} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 space-y-3 z-50 text-xs font-sans"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800">Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                        className="text-[10px] text-blue-600 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className={`p-2.5 rounded-lg border transition-all ${n.read ? "bg-slate-50 border-slate-100 text-slate-500" : "bg-blue-50/60 border-blue-100 text-slate-800"}`}>
                          <p className="leading-snug text-xs">{n.text}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-slate-500 text-xs">
                        No new notifications
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* CONTENT SWITCH AREA */}
        <main className="flex-1 p-6 overflow-y-auto relative bg-slate-50 min-w-0">

          {loading && (
            <div className="absolute top-4 right-6 flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full z-50 shadow-md">
              <Loader2 className="animate-spin text-blue-600" size={14} />
              <span className="text-xs font-semibold text-slate-700">Syncing data...</span>
            </div>
          )}

          {/* PAGE VIEWS SWITCH */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >

              {/* Tab 1: Dashboard */}
              {activeTab === "dashboard" && (() => {
                // Real resume calculations
                const hasResume = resumeList && resumeList.length > 0;
                const avgResume = hasResume
                  ? Math.round(resumeList.reduce((acc, r) => acc + (r.overallScore || 0), 0) / resumeList.length)
                  : null;

                // Real interview calculations
                const evaluatedInterviews = (mockInterviewHistory || []).filter(h => h.evaluation && typeof h.evaluation.overallScore === 'number');
                const hasInterview = evaluatedInterviews.length > 0;
                const avgInterview = hasInterview
                  ? Math.round(evaluatedInterviews.reduce((acc, h) => acc + h.evaluation.overallScore, 0) / evaluatedInterviews.length)
                  : null;

                // Real DSA calculations
                let dsaTotal = 0;
                let dsaSolved = 0;
                const topicStats = [];
                (dsaTopics || []).forEach(topic => {
                  let tSolved = 0;
                  const probList = topic.problems || [];
                  probList.forEach(prob => {
                    dsaTotal++;
                    if (prob.status === "SOLVED") {
                      dsaSolved++;
                      tSolved++;
                    }
                  });
                  topicStats.push({ title: topic.title, total: probList.length, solved: tSolved });
                });

                const hasDSA = dsaTotal > 0 && dsaSolved > 0;
                const dsaPercent = dsaTotal > 0 ? Math.round((dsaSolved / dsaTotal) * 100) : 0;

                // Calculate overall placement readiness strictly from available real metrics
                const availableScores = [];
                if (avgResume !== null) availableScores.push({ score: avgResume, weight: 0.35 });
                if (avgInterview !== null) availableScores.push({ score: avgInterview, weight: 0.35 });
                if (dsaTotal > 0) availableScores.push({ score: dsaPercent, weight: 0.30 });

                let readiness = null;
                if (availableScores.length > 0) {
                  const totalWeight = availableScores.reduce((acc, s) => acc + s.weight, 0);
                  const weightedSum = availableScores.reduce((acc, s) => acc + (s.score * s.weight), 0);
                  readiness = Math.round(weightedSum / totalWeight);
                }

                const activeTargetCompany = roadmap?.targetCompany || userProfile?.targetCompany || null;

                // Placement drive date calculation
                const getPlacementDriveDays = () => {
                  const driveDateStr = userProfile?.placementDriveDate || userProfile?.targetDate;
                  if (!driveDateStr) return null;
                  const targetDate = new Date(driveDateStr);
                  if (isNaN(targetDate.getTime())) return null;
                  const diffTime = targetDate.getTime() - new Date().getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 ? diffDays : 0;
                };
                const placementDays = getPlacementDriveDays();

                // Build real historical data points for line chart
                const historicalPoints = [];
                (resumeList || []).forEach(r => {
                  if (r.overallScore && (r.createdAt || r.uploadedAt)) {
                    historicalPoints.push({
                      date: new Date(r.createdAt || r.uploadedAt),
                      score: r.overallScore,
                      label: `Resume (${r.overallScore})`
                    });
                  }
                });
                (mockInterviewHistory || []).forEach(h => {
                  if (h.evaluation?.overallScore && (h.createdAt || h.timestamp)) {
                    historicalPoints.push({
                      date: new Date(h.createdAt || h.timestamp),
                      score: h.evaluation.overallScore,
                      label: `Interview (${h.evaluation.overallScore}%)`
                    });
                  }
                });
                historicalPoints.sort((a, b) => a.date - b.date);

                const hasSufficientChartData = historicalPoints.length >= 2;
                const lineChartData = hasSufficientChartData ? {
                  labels: historicalPoints.map(p => p.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
                  datasets: [
                    {
                      label: "Readiness Score (%)",
                      data: historicalPoints.map(p => p.score),
                      borderColor: "#2563eb",
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                      tension: 0.35,
                      fill: true,
                      pointBackgroundColor: "#2563eb",
                      pointBorderColor: "#ffffff",
                      pointBorderWidth: 2,
                      pointRadius: 4,
                      pointHoverRadius: 6
                    }
                  ]
                } : null;

                const lineChartOptions = {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#0f172a",
                      padding: 10,
                      titleFont: { size: 12, weight: 'bold' },
                      bodyFont: { size: 11 }
                    }
                  },
                  scales: {
                    x: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b", font: { size: 11 } } },
                    y: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b", font: { size: 11 } }, min: 0, max: 100 }
                  }
                };

                // DSA Strength / Focus Topic calculation
                const sortedTopics = [...topicStats].sort((a, b) => b.solved - a.solved);
                const topTopic = (sortedTopics.length > 0 && sortedTopics[0].solved > 0) ? sortedTopics[0] : null;
                const sortedUnsolved = [...topicStats].sort((a, b) => (b.total - b.solved) - (a.total - a.solved));
                const focusTopic = (sortedUnsolved.length > 0 && (sortedUnsolved[0].total - sortedUnsolved[0].solved) > 0) ? sortedUnsolved[0] : null;

                // Dynamic Personalized Recommendations from real state
                const realRecommendations = [];
                if (!hasResume) {
                  realRecommendations.push({
                    id: "rec_resume",
                    icon: FileText,
                    color: "blue",
                    title: "Upload & Audit Your Resume",
                    description: "Upload your resume to receive an instant ATS score and detailed feedback.",
                    actionLabel: "Analyze",
                    tab: "resume"
                  });
                } else if (avgResume < 85) {
                  realRecommendations.push({
                    id: "rec_resume_opt",
                    icon: FileText,
                    color: "blue",
                    title: "Optimize Resume Bullet Points",
                    description: `Your current ATS score is ${avgResume}/100. Review recommendations to hit 85%+ threshold.`,
                    actionLabel: "Review",
                    tab: "resume"
                  });
                }

                if (!hasDSA) {
                  realRecommendations.push({
                    id: "rec_dsa_start",
                    icon: CheckSquare,
                    color: "emerald",
                    title: "Start Practicing DSA Sheet",
                    description: "Begin solving curated algorithm patterns to build your coding problem-solving speed.",
                    actionLabel: "Practice",
                    tab: "dsa"
                  });
                } else if (focusTopic) {
                  realRecommendations.push({
                    id: "rec_dsa_focus",
                    icon: CheckSquare,
                    color: "emerald",
                    title: `Practice ${focusTopic.title} Patterns`,
                    description: `You have ${focusTopic.total - focusTopic.solved} unstarted problems remaining in ${focusTopic.title}.`,
                    actionLabel: "Solve",
                    tab: "dsa"
                  });
                }

                if (!hasInterview) {
                  realRecommendations.push({
                    id: "rec_interview_start",
                    icon: MessageSquareCode,
                    color: "purple",
                    title: "Take Your First Mock Interview",
                    description: "Simulate an interactive STAR interview session to benchmark your answer quality.",
                    actionLabel: "Start Mock",
                    tab: "interview"
                  });
                } else if (avgInterview < 85) {
                  realRecommendations.push({
                    id: "rec_interview_opt",
                    icon: MessageSquareCode,
                    color: "purple",
                    title: "Improve Interview STAR Rating",
                    description: `Your current average interview score is ${avgInterview}%. Take another mock to sharpen responses.`,
                    actionLabel: "Practice",
                    tab: "interview"
                  });
                }

                if (!roadmap) {
                  realRecommendations.push({
                    id: "rec_roadmap",
                    icon: GitBranch,
                    color: "amber",
                    title: "Generate Personalized Career Roadmap",
                    description: "Create a customized week-by-week study roadmap targeted for your target company.",
                    actionLabel: "Generate",
                    tab: "roadmap"
                  });
                }

                // Build real activity timeline from actual user actions
                const realActivities = [];
                (resumeList || []).forEach(r => {
                  realActivities.push({
                    id: `resume_${r.resumeId || r.id || Math.random()}`,
                    title: `Uploaded ${r.fileName || 'Resume document'}`,
                    subtitle: r.overallScore ? `ATS score evaluated: ${r.overallScore}/100` : "Resume parsed & analyzed",
                    timestamp: r.createdAt || r.uploadedAt || new Date().toISOString(),
                    type: "resume"
                  });
                });
                (mockInterviewHistory || []).forEach(h => {
                  realActivities.push({
                    id: `interview_${h.sessionId || h.id || Math.random()}`,
                    title: `Mock Interview evaluated (${h.role || 'Technical'})`,
                    subtitle: h.evaluation?.overallScore ? `STAR score: ${h.evaluation.overallScore}%` : "Interview response session recorded",
                    timestamp: h.createdAt || h.timestamp || new Date().toISOString(),
                    type: "interview"
                  });
                });
                realActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                const recentFeed = realActivities.slice(0, 5);

                return (
                  <div className="space-y-6">

                    {/* 1. GREETING BANNER */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1.5 z-10">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-2xl font-bold tracking-tight">
                            Good morning, {userProfile?.fullName?.split(' ')[0] || "Student"} 👋
                          </h2>
                          <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Student Tier
                          </span>
                        </div>
                        <p className="text-blue-100 text-xs leading-relaxed max-w-xl">
                          Here is your placement preparation journey at a glance.
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-medium text-white border border-white/20">
                            <Target size={13} className="text-blue-200" />
                            <span>Target: {activeTargetCompany || "Not set"}</span>
                          </span>

                          {placementDays !== null && (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-medium text-white border border-white/20">
                              <Calendar size={13} className="text-blue-200" />
                              <span>{placementDays} Days to Placement Season</span>
                            </span>
                          )}

                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 text-xs font-medium border border-emerald-400/30">
                            <CheckCircle size={13} />
                            <span>Placement Ready: {readiness !== null ? (readiness >= 75 ? "High" : readiness >= 50 ? "Moderate" : "Building") : "Pending Data"}</span>
                          </span>
                        </div>
                      </div>

                      <div className="z-10 shrink-0 flex items-center space-x-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                        <div className="text-right">
                          <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Active Goal</p>
                          <p className="text-sm font-bold">{activeTargetCompany ? `${activeTargetCompany} SDE Prep` : "Career Readiness Track"}</p>
                        </div>
                        <button
                          onClick={() => setActiveTab("roadmap")}
                          className="px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs rounded-lg transition-colors shadow-sm"
                        >
                          View Specs
                        </button>
                      </div>
                    </div>

                    {/* 2. PLACEMENT READINESS SCORE CARD */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
                      <div className="flex items-center space-x-6 w-full lg:w-auto">
                        <CircularProgress value={readiness !== null ? readiness : 0} size={90} strokeWidth={7} color="stroke-blue-600" />
                        <div className="space-y-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Placement Readiness</span>
                          <div className="flex items-baseline space-x-2">
                            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                              {readiness !== null ? <AnimatedCounter value={readiness} suffix=" / 100" /> : "-- / 100"}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-600">
                            {readiness !== null
                              ? "Overall placement readiness benchmark based on your actual performance."
                              : "Complete your first resume audit, DSA problem, or mock interview to compute your placement readiness score."}
                          </p>
                        </div>
                      </div>

                      {/* 4 Breakdown mini cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0">
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <div className="flex justify-between items-center text-slate-500">
                            <span className="text-[10px] uppercase font-bold tracking-wider">Resume</span>
                            <FileText size={14} className="text-blue-600" />
                          </div>
                          <p className="text-lg font-bold text-slate-900">
                            {hasResume ? `${avgResume} / 100` : "--"}
                          </p>
                          <p className="text-[10px] text-slate-500">{hasResume ? "ATS Verified" : "No resume analyzed yet"}</p>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <div className="flex justify-between items-center text-slate-500">
                            <span className="text-[10px] uppercase font-bold tracking-wider">DSA Solved</span>
                            <CheckSquare size={14} className="text-emerald-600" />
                          </div>
                          <p className="text-lg font-bold text-slate-900">
                            {dsaTotal > 0 ? `${dsaSolved} / ${dsaTotal}` : "--"}
                          </p>
                          <p className="text-[10px] text-slate-500">{dsaTotal > 0 ? `${dsaPercent}% Topic Coverage` : "No DSA activity yet"}</p>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <div className="flex justify-between items-center text-slate-500">
                            <span className="text-[10px] uppercase font-bold tracking-wider">Interview</span>
                            <MessageSquareCode size={14} className="text-purple-600" />
                          </div>
                          <p className="text-lg font-bold text-slate-900">
                            {hasInterview ? `${avgInterview}%` : "--"}
                          </p>
                          <p className="text-[10px] text-slate-500">{hasInterview ? "STAR Scorecard Evaluated" : "No interviews yet"}</p>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <div className="flex justify-between items-center text-slate-500">
                            <span className="text-[10px] uppercase font-bold tracking-wider">Roadmap</span>
                            <GitBranch size={14} className="text-amber-600" />
                          </div>
                          <p className="text-lg font-bold text-slate-900">
                            {roadmap ? `${roadmap.durationWeeks || roadmap.weeks?.length || 0} Wks` : "--"}
                          </p>
                          <p className="text-[10px] text-slate-500">{roadmap ? `Target: ${activeTargetCompany || "Active"}` : "No active roadmap"}</p>
                        </div>
                      </div>
                    </div>

                    {/* 3. QUICK ACTIONS GRID */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div
                          onClick={() => setActiveTab("resume")}
                          className="p-4 bg-white border border-slate-200 hover:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FileText size={18} />
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                            <span>Analyze Resume</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">Upload & audit your ATS resume score</p>
                        </div>

                        <div
                          onClick={() => setActiveTab("dsa")}
                          className="p-4 bg-white border border-slate-200 hover:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <CheckSquare size={18} />
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                            <span>Practice DSA</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">Solve topic-wise pattern questions</p>
                        </div>

                        <div
                          onClick={() => setActiveTab("interview")}
                          className="p-4 bg-white border border-slate-200 hover:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <MessageSquareCode size={18} />
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                            <span>Start Mock Interview</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">AI interactive STAR session</p>
                        </div>

                        <div
                          onClick={() => setActiveTab("roadmap")}
                          className="p-4 bg-white border border-slate-200 hover:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <GitBranch size={18} />
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                            <span>View Career Roadmap</span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">Step-by-step target prep roadmap</p>
                        </div>
                      </div>
                    </div>

                    {/* 4. ANALYTICS & TODAY'S PREPARATION */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                      {/* Analytics Line Chart */}
                      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                              <TrendingUp size={16} className="text-blue-600" />
                              <span>Placement Readiness Velocity</span>
                            </h3>
                            <p className="text-xs text-slate-500">Historical performance trend over time</p>
                          </div>
                        </div>

                        <div className="h-[200px] relative">
                          {hasSufficientChartData ? (
                            <Line data={lineChartData} options={lineChartOptions} />
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 border border-slate-200 border-dashed rounded-xl space-y-2">
                              <TrendingUp size={28} className="text-slate-400" />
                              <h4 className="font-bold text-slate-700 text-xs">Not enough activity history yet</h4>
                              <p className="text-[11px] text-slate-500 max-w-sm">
                                Your placement readiness velocity trend will appear here as you complete resume audits and mock interviews.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Secondary breakdown callouts */}
                        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-800 mb-1">Top Strength Area</p>
                            <p className="text-xs text-slate-600">
                              {topTopic ? `${topTopic.title} (${topTopic.solved} solved)` : "No DSA solves logged yet"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 mb-1">Focus Area Needed</p>
                            <p className="text-xs text-slate-600">
                              {focusTopic ? `${focusTopic.title} (${focusTopic.total - focusTopic.solved} remaining)` : "Start practicing to identify focus areas"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Today's Preparation (Daily Goals Checklist) */}
                      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                              <CheckSquare size={16} className="text-blue-600" />
                              <span>Today's Preparation</span>
                            </h3>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                              {dailyGoals.filter(g => g.completed).length} / {dailyGoals.length} Met
                            </span>
                          </div>

                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {dailyGoals.length > 0 ? (
                              dailyGoals.map((g) => (
                                <div
                                  key={g.id}
                                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${g.completed
                                    ? "bg-slate-50 border-slate-200 text-slate-400"
                                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                                    }`}
                                >
                                  <div className="flex items-center space-x-3 min-w-0">
                                    <button
                                      onClick={() => toggleGoal(g.id)}
                                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${g.completed
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "border-slate-300 hover:border-slate-400 bg-white"
                                        }`}
                                    >
                                      {g.completed && <Check size={11} />}
                                    </button>
                                    <span className={`text-xs ${g.completed ? "line-through text-slate-400" : "font-medium text-slate-800"}`}>
                                      {g.text}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => deleteGoal(g.id)}
                                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                    title="Delete task"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl my-2">
                                No prep goals set for today yet. Add a goal below to track your daily progress!
                              </div>
                            )}
                          </div>
                        </div>

                        <form onSubmit={addCustomGoal} className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-100">
                          <input
                            type="text"
                            placeholder="Add prep task goal..."
                            value={newGoalText}
                            onChange={(e) => setNewGoalText(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-2 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                          />
                          <button
                            type="submit"
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center space-x-1"
                          >
                            <Plus size={14} />
                            <span>Add</span>
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* 5. RECOMMENDED FOR YOU & RECENT ACTIVITY */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                      {/* Recommended For You */}
                      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                            <Sparkles size={16} className="text-blue-600" />
                            <span>Recommended For You</span>
                          </h3>
                          <p className="text-xs text-slate-500">Personalized actions generated from your activity data</p>
                        </div>

                        <div className="space-y-3">
                          {realRecommendations.length > 0 ? (
                            realRecommendations.map((rec) => {
                              const Icon = rec.icon;
                              return (
                                <div key={rec.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${rec.color === 'blue' ? 'bg-blue-100 text-blue-700' : rec.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : rec.color === 'purple' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'} font-bold shrink-0 mt-0.5`}>
                                      <Icon size={16} />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-slate-900 text-xs">{rec.title}</h4>
                                      <p className="text-xs text-slate-600 mt-0.5">{rec.description}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setActiveTab(rec.tab)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 shadow-sm"
                                  >
                                    {rec.actionLabel}
                                  </button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-6 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-center space-y-1">
                              <Sparkles size={24} className="text-blue-600 mx-auto mb-1" />
                              <p className="font-bold text-slate-700 text-xs">All Recommended Prep Steps Completed!</p>
                              <p className="text-xs text-slate-500">Complete more activities to receive new personalized AI recommendations.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recent Activity Feed */}
                      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="border-b border-slate-100 pb-3">
                          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                            <Clock size={16} className="text-slate-600" />
                            <span>Recent Activity Feed</span>
                          </h3>
                        </div>

                        {recentFeed.length > 0 ? (
                          <div className="relative border-l border-slate-200 pl-5 space-y-4 py-1 ml-2 text-xs">
                            {recentFeed.map((act) => (
                              <div key={act.id} className="relative">
                                <span className={`absolute -left-[25px] top-0.5 w-3.5 h-3.5 rounded-full ${act.type === 'resume' ? 'bg-emerald-600' : 'bg-blue-600'} border-2 border-white shadow-sm`}></span>
                                <div>
                                  <p className="font-semibold text-slate-900">{act.title}</p>
                                  <p className="text-slate-500 text-[11px]">{act.subtitle}</p>
                                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                    {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-center space-y-1">
                            <Clock size={24} className="text-slate-400 mx-auto mb-1" />
                            <p className="font-bold text-slate-700 text-xs">No Recent Activity Recorded</p>
                            <p className="text-xs text-slate-500">Activities will be logged automatically as you perform resume audits or mock interviews.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tab 2: Resume Analyzer */}
              {activeTab === "resume" && (
                <div className="space-y-8 animate-float">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                      AI Resume Analyzer
                    </h2>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed font-sans">
                      Upload your resume PDF to let Gemini inspect alignment against engineering roles.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                      {/* Source File Card */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-3 flex items-center space-x-2">
                          <Upload size={16} className="text-blue-600" />
                          <span>Source File</span>
                        </h3>

                        <form onSubmit={handleResumeUpload} className="space-y-4">
                          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 relative">
                            <Upload size={28} className="text-slate-400 mb-2" />
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setResumeFile(file);
                                  e.target.value = "";
                                }
                              }}
                              className="hidden"
                              id="resume-file-input"
                            />
                            <label htmlFor="resume-file-input" className="text-[11px] text-slate-600 font-bold cursor-pointer text-center select-none uppercase tracking-wide">
                              {resumeFile ? resumeFile.name : "Click to select PDF, DOC, DOCX"}
                            </label>
                            {resumeFile && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setResumeFile(null);
                                }}
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Clear File Selection"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                          <button type="submit" disabled={!resumeFile} className="w-full btn-primary flex justify-center items-center space-x-2 text-xs py-2.5">
                            <Upload size={14} />
                            <span>Upload Resume</span>
                          </button>
                        </form>
                      </div>

                      {/* Resume Audit History Card */}
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-2.5 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock size={15} className="text-blue-600" />
                            <span>Audit History</span>
                          </div>
                          <span className="text-[8px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold font-mono">
                            {resumeList.length} logs
                          </span>
                        </h3>

                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {resumeList.length === 0 ? (
                            <p className="text-[10px] text-slate-500 text-center py-4">No past evaluations found.</p>
                          ) : (
                            resumeList.map((item) => {
                              const itemScores = item.scores || {};
                              const scoreVal = item.overallScore || itemScores.overallScore || 0;
                              const isSelected = resumeResult && resumeResult.resumeId === item.resumeId;
                              return (
                                <div
                                  key={item.resumeId}
                                  className={`p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                                    isSelected
                                      ? "bg-blue-50 border-blue-200"
                                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                                  }`}
                                  onClick={() => setResumeResult(item)}
                                >
                                  <div className="space-y-0.5 overflow-hidden flex-1 pr-2">
                                    <h4 className="font-bold text-slate-800 text-[10px] truncate" title={item.fileName}>
                                      {item.fileName}
                                    </h4>
                                    <span className="text-[8px] text-slate-500 block font-semibold">
                                      {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : "Unknown date"}
                                    </span>
                                  </div>

                                  <div className="flex items-center space-x-2 shrink-0">
                                    <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                      {scoreVal}/100
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteResume(item.resumeId);
                                      }}
                                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 md:opacity-0 group-hover:opacity-100 opacity-80"
                                      title="Delete Audit"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-emerald-600" />
                          <span>Evaluation Scorecard</span>
                        </div>
                        {resumeResult && (
                          <button
                            onClick={() => handleDownloadReport(resumeResult.resumeId)}
                            className="flex items-center space-x-1.5 text-[10px] bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider"
                          >
                            <Download size={12} />
                            <span>Download Audit</span>
                          </button>
                        )}
                      </h3>

                      {loading && !resumeResult ? (
                        <div className="mt-6 space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 bg-slate-50 p-4 rounded-xl border border-slate-200 gap-4 animate-pulse">
                            <Skeleton className="w-20 h-14" />
                            <Skeleton className="w-20 h-14" />
                            <div className="flex-1 grid grid-cols-4 gap-4 pl-4 border-l border-slate-200">
                              <Skeleton className="h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                        </div>
                      ) : resumeResult ? (
                        (() => {
                          const isNewFormat = !!resumeResult.analysis;
                          const analysis = isNewFormat ? resumeResult.analysis : null;
                          
                          if (isNewFormat) {
                            return (
                              <div className="mt-6 space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                  {[
                                    { label: "Overall", value: analysis.overallScore, color: "text-blue-600" },
                                    { label: "ATS Match", value: analysis.atsScore, color: "text-purple-600" },
                                    { label: "Grammar", value: analysis.grammarScore, color: "text-emerald-600" },
                                    { label: "Technical", value: analysis.technicalScore, color: "text-amber-600" },
                                    { label: "Communication", value: analysis.communicationScore, color: "text-pink-600" }
                                  ].map((score, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center space-y-1">
                                      <div className={`text-xl font-extrabold ${score.color}`}>{score.value}/100</div>
                                      <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">{score.label}</div>
                                    </div>
                                  ))}
                                </div>

                                <div className="space-y-4 font-sans text-xs">
                                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Executive Summary</h4>
                                    <p className="text-[11.5px] text-slate-700 leading-relaxed font-sans">{analysis.resumeSummary}</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                                      <h4 className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-2 flex items-center space-x-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                        <span>Key Strengths</span>
                                      </h4>
                                      <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 leading-relaxed">
                                        {analysis.strengths?.map((str, idx) => <li key={idx} className="font-sans">{str}</li>)}
                                      </ul>
                                    </div>
                                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
                                      <h4 className="text-[10px] text-rose-700 font-bold uppercase tracking-wider mb-2 flex items-center space-x-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                                        <span>Areas for Improvement</span>
                                      </h4>
                                      <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 leading-relaxed">
                                        {analysis.weaknesses?.map((imp, idx) => <li key={idx} className="font-sans">{imp}</li>)}
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-4">
                                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                      <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Missing Skills</h4>
                                      <div className="flex flex-wrap gap-1.5 mt-1">
                                        {analysis.missingSkills?.map((kw, idx) => (
                                          <span key={idx} className="bg-rose-100 border border-rose-200 text-rose-700 text-[8.5px] px-2 py-0.5 rounded font-semibold font-mono">
                                            {kw}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                      <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Recommended Projects</h4>
                                      <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 leading-relaxed">
                                        {analysis.recommendedProjects?.map((p, idx) => <li key={idx} className="font-sans">{p}</li>)}
                                      </ul>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                      <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Certifications</h4>
                                      <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 leading-relaxed">
                                        {analysis.recommendedCertifications?.map((c, idx) => <li key={idx} className="font-sans">{c}</li>)}
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="border-t border-slate-200 pt-4">
                                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Practice Interview Questions</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                      {analysis.interviewQuestions?.map((q, idx) => (
                                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                          <p className="text-[10px] text-slate-800 font-medium leading-relaxed font-sans">"{q}"</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          
                          return (
                            <div className="mt-6 space-y-6">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 bg-slate-50 p-4 rounded-xl border border-slate-200 gap-4">
                                <div className="flex items-center space-x-4">
                                  <div className="text-center p-3 bg-white rounded-xl border border-slate-200 w-20 shadow-sm">
                                    <div className="text-xl font-extrabold text-blue-600">{resumeResult.overallScore}</div>
                                    <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mt-1">Overall</div>
                                  </div>
                                  <div className="text-center p-3 bg-white rounded-xl border border-slate-200 w-20 shadow-sm">
                                    <div className="text-xl font-extrabold text-emerald-600">{resumeResult.atsScore ?? 0}</div>
                                    <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mt-1">ATS Score</div>
                                  </div>
                                </div>
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 border-l border-slate-200 pl-6">
                                  <div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Impact</span>
                                    <p className="text-xs font-bold text-slate-800 mt-0.5">{resumeResult.metrics.impact}%</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Structure</span>
                                    <p className="text-xs font-bold text-slate-800 mt-0.5">{resumeResult.metrics.structure}%</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Brevity</span>
                                    <p className="text-xs font-bold text-slate-800 mt-0.5">{resumeResult.metrics.brevity}%</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Grammar</span>
                                    <p className="text-xs font-bold text-slate-800 mt-0.5">{resumeResult.metrics.grammar}%</p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4 font-sans text-xs">
                                <div>
                                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Key Strengths</h4>
                                  <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1">
                                    {resumeResult.feedback.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Areas for Improvement</h4>
                                  <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1">
                                    {resumeResult.feedback.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
                                  </ul>
                                </div>

                                {resumeResult.feedback.grammarSuggestions && resumeResult.feedback.grammarSuggestions.length > 0 && (
                                  <div>
                                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Grammar & Phrasing Suggestions</h4>
                                    <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1">
                                      {resumeResult.feedback.grammarSuggestions.map((g, idx) => <li key={idx}>{g}</li>)}
                                    </ul>
                                  </div>
                                )}

                                {resumeResult.feedback.technicalSkillSuggestions && resumeResult.feedback.technicalSkillSuggestions.length > 0 && (
                                  <div>
                                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Technical Skill Recommendations</h4>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {resumeResult.feedback.technicalSkillSuggestions.map((t, idx) => (
                                        <span key={idx} className="bg-blue-50 border border-blue-200 text-blue-700 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {resumeResult.feedback.projectSuggestions && resumeResult.feedback.projectSuggestions.length > 0 && (
                                  <div>
                                    <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Project Enhancements</h4>
                                    <ul className="list-disc list-inside text-slate-700 space-y-1.5 pl-1">
                                      {resumeResult.feedback.projectSuggestions.map((p, idx) => <li key={idx} className="leading-relaxed">{p}</li>)}
                                    </ul>
                                  </div>
                                )}

                                <div>
                                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Missing Keywords ({resumeResult.feedback.keywordMatchPercentage}% Match)</h4>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {resumeResult.feedback.missingKeywords.map((kw, idx) => (
                                      <span key={idx} className="bg-rose-100 border border-rose-200 text-rose-700 text-[9px] px-2 py-0.5 rounded-md font-semibold">
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="mt-12 text-center py-16 text-slate-400">
                          <BookOpen size={28} className="mx-auto text-slate-400 animate-pulse mb-3" />
                          <p className="text-xs text-slate-500">No analysis active. Upload and audit your resume.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Mock Interview */}
              {activeTab === "interview" && (
                <div className="space-y-8 animate-float">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                      AI Mock Interviewer
                    </h2>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed font-sans">
                      Tailored sessions checking verbal readiness across STAR scorecard metrics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Session setup / details sidebar */}
                    <div className="lg:col-span-1 space-y-6">

                      {!interviewSession && (
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-3 flex items-center space-x-2">
                            <Play size={16} className="text-blue-600" />
                            <span>Configure Session</span>
                          </h3>

                          <div className="space-y-4 font-sans text-xs">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Interview Format</label>
                              <div className="grid grid-cols-3 gap-2">
                                {["TECHNICAL", "HR", "DSA"].map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => setInterviewType(type)}
                                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${interviewType === type
                                      ? "bg-blue-50 border-blue-200 text-blue-700"
                                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                      }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Role</label>
                              <input
                                type="text"
                                value={customRole}
                                onChange={(e) => setCustomRole(e.target.value)}
                                placeholder="e.g. Software Engineer"
                                className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors placeholder:text-slate-400"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Company</label>
                              <input
                                type="text"
                                value={customCompany}
                                onChange={(e) => setCustomCompany(e.target.value)}
                                placeholder="e.g. Stripe"
                                className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors placeholder:text-slate-400"
                              />
                            </div>

                            <button
                              onClick={() => handleStartInterview(customRole, customCompany, interviewType)}
                              className="w-full btn-primary flex justify-center items-center space-x-2 text-xs py-2.5"
                            >
                              <Sparkles size={14} />
                              <span>Launch Session</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-3 flex items-center space-x-2">
                          <Clock size={16} className="text-amber-600" />
                          <span>Interview History</span>
                        </h3>

                        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                          {mockInterviewHistory.length > 0 ? (
                            mockInterviewHistory.map((hist, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  if (hist.evaluation) {
                                    setInterviewResult(hist.evaluation);
                                    setInterviewSession(null);
                                  } else {
                                    showToast("Evaluation not yet complete for this session.", "error");
                                  }
                                }}
                                className="bg-slate-50 border border-slate-200 hover:border-blue-300 p-3 rounded-xl flex items-center justify-between cursor-pointer group transition-all"
                              >
                                <div className="overflow-hidden pr-2">
                                  <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                    {hist.company} • {hist.role}
                                  </h4>
                                  <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1 block font-bold">
                                    {hist.interviewType || "TECHNICAL"} • {hist.status}
                                  </span>
                                </div>
                                {hist.evaluation && (
                                  <span className="text-xs font-extrabold text-blue-600 shrink-0">
                                    {hist.evaluation.overallScore}%
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-500 text-center py-4">No past sessions found.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Chat session workspace panel */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col min-h-[450px] justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquareCode size={16} className="text-purple-600" />
                          <span>Panel Dialogue</span>
                        </div>
                        {interviewSession && (
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">
                              Time: {Math.floor(interviewDuration / 60).toString().padStart(2, '0')}:{(interviewDuration % 60).toString().padStart(2, '0')}
                            </span>
                            <span className="text-[9px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">
                              Turn: {interviewSession.history.length + 1} / 5
                            </span>
                            <button
                              onClick={handleCancelInterview}
                              className="text-[9px] bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 px-2 py-0.5 rounded transition-colors uppercase font-bold"
                            >
                              Exit
                            </button>
                          </div>
                        )}
                      </h3>

                      {interviewSession ? (
                        <div className="flex-1 flex flex-col justify-between mt-6 font-sans text-xs">
                          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {interviewSession.history.map((turn, idx) => (
                              <div key={idx} className="space-y-2">
                                <p className="font-bold text-blue-600 flex items-center space-x-1">
                                  <ChevronRight size={12} />
                                  <span>Interviewer: {turn.question}</span>
                                </p>
                                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                                  Your Answer: {turn.answer}
                                </p>
                              </div>
                            ))}

                            {/* Active Question banner */}
                            <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl space-y-1 shadow-sm">
                              <span className="text-[8px] bg-blue-100 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                                ACTIVE QUESTION
                              </span>
                              <p className="font-semibold text-slate-900 mt-1.5 leading-relaxed">
                                {interviewSession.currentQuestion}
                              </p>
                            </div>
                          </div>

                          <form onSubmit={handleSendAnswer} className="flex space-x-3 mt-6">
                            <input
                              type="text"
                              value={interviewAnswer}
                              onChange={(e) => setInterviewAnswer(e.target.value)}
                              placeholder="Type your response answer here..."
                              className="flex-1 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs px-3.5 py-3 rounded-xl outline-none"
                            />
                            <button type="submit" className="btn-primary flex items-center justify-center p-3 rounded-xl">
                              <Send size={15} />
                            </button>
                          </form>
                        </div>
                      ) : interviewResult ? (
                        <div className="mt-6 space-y-6 font-sans text-xs">

                          <div className="flex items-center space-x-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="text-center">
                              <div className="text-2xl font-extrabold text-blue-600">{interviewResult.overallScore}%</div>
                              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold block mt-1">Score</span>
                            </div>
                            <div className="flex-1 text-slate-700 pl-6 border-l border-slate-200 leading-relaxed">
                              {interviewResult.overallFeedback}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">STAR Scorecard breakdown</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                              {Object.entries(interviewResult.starFrameworkScore).map(([step, val]) => (
                                <div key={step} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center shadow-sm">
                                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest block">{step}</span>
                                  <p className="text-lg font-black text-slate-900 mt-1">{val}%</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end pt-4 border-t border-slate-200">
                            <button
                              onClick={() => setInterviewResult(null)}
                              className="btn-primary text-xs"
                            >
                              Start New Session
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-12 text-center py-16 text-slate-400">
                          <MessageSquareCode size={28} className="mx-auto text-slate-400 animate-pulse mb-3" />
                          <p className="text-xs text-slate-500">Configure your parameters on the left and start the AI session.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: DSA Tracker */}
              {activeTab === "dsa" && (() => {
                let total = 0;
                let solved = 0;
                let easySolved = 0;
                let easyTotal = 0;
                let mediumSolved = 0;
                let mediumTotal = 0;
                let hardSolved = 0;
                let hardTotal = 0;

                dsaTopics.forEach(topic => {
                  topic.problems.forEach(prob => {
                    total++;
                    if (prob.status === "SOLVED") solved++;

                    if (prob.difficulty === "Easy") {
                      easyTotal++;
                      if (prob.status === "SOLVED") easySolved++;
                    } else if (prob.difficulty === "Medium") {
                      mediumTotal++;
                      if (prob.status === "SOLVED") mediumSolved++;
                    } else if (prob.difficulty === "Hard") {
                      hardTotal++;
                      if (prob.status === "SOLVED") hardSolved++;
                    }
                  });
                });

                const percentSolved = total > 0 ? Math.round((solved / total) * 100) : 0;

                return (
                  <div className="space-y-8 animate-float">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                          DSA Progress Tracker
                        </h2>
                        <p className="text-slate-600 text-sm mt-1 leading-relaxed font-sans">
                          Progress tracking sheet map. Solve coding sheets directly from standard patterns.
                        </p>
                      </div>

                      {userProfile?.dsaStreak > 0 && (
                        <div className="border border-orange-200 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl flex items-center space-x-2 shrink-0">
                          <span className="text-lg">🔥</span>
                          <div>
                            <p className="text-xs font-bold leading-none">{userProfile.dsaStreak} Day Streak</p>
                            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 block">Keep active daily</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress summary card */}
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 font-sans text-xs">

                      <div className="flex items-center space-x-4 border-r border-slate-200 pr-4">
                        <CircularProgress value={percentSolved} size={70} strokeWidth={5} color="stroke-blue-600" />
                        <div>
                          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Progress</h4>
                          <p className="text-lg font-black text-slate-900 mt-0.5">{solved} / {total}</p>
                          <span className="text-[9px] text-slate-500 mt-1 block">solved problems</span>
                        </div>
                      </div>

                      {/* Difficulty blocks with Progress tracks */}
                      <div className="flex flex-col justify-between py-1">
                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                          <span>Easy</span>
                          <span className="text-emerald-700">{easySolved}/{easyTotal}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}></div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between py-1">
                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                          <span>Medium</span>
                          <span className="text-amber-700">{mediumSolved}/{mediumTotal}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0}%` }}></div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between py-1">
                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                          <span>Hard</span>
                          <span className="text-rose-700">{hardSolved}/{hardTotal}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Layout split: Left side add custom, right side table list */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-xs">

                      {/* Sidebar panel */}
                      <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm h-fit space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-3 flex items-center space-x-2">
                          <Plus size={16} className="text-blue-600" />
                          <span>Add Custom Problem</span>
                        </h3>

                        <form onSubmit={handleAddCustomProblem} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Problem Title</label>
                            <input
                              type="text"
                              value={customProblemTitle}
                              onChange={(e) => setCustomProblemTitle(e.target.value)}
                              placeholder="e.g. Reverse Linked List"
                              required
                              className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Topic / Pattern</label>
                            <select
                              value={customProblemTopic}
                              onChange={(e) => setCustomProblemTopic(e.target.value)}
                              className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            >
                              {dsaTopics.map(t => (
                                <option key={t.topic} value={t.topic}>{t.topic}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Difficulty</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["Easy", "Medium", "Hard"].map(diff => (
                                <button
                                  key={diff}
                                  type="button"
                                  onClick={() => setCustomProblemDifficulty(diff)}
                                  className={`py-2 rounded-lg font-semibold border transition-all text-center ${customProblemDifficulty === diff
                                    ? diff === "Easy" ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                      : diff === "Medium" ? "bg-amber-50 border-amber-200 text-amber-700"
                                        : "bg-rose-50 border-rose-200 text-rose-700"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                  {diff}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button type="submit" className="w-full btn-primary text-xs py-2.5 mt-2">
                            Add Problem
                          </button>
                        </form>
                      </div>

                      {/* Problems listing list */}
                      <div className="lg:col-span-8 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
                        {dsaTopics.map((topic) => (
                          <div key={topic.topic} className="space-y-3.5">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                              <h4 className="text-sm font-bold text-slate-900 tracking-tight">{topic.topic}</h4>
                              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                {topic.problems.filter(p => p.status === "SOLVED").length} / {topic.problems.length} solved
                              </span>
                            </div>

                            <div className="space-y-2">
                              {topic.problems.map((prob) => (
                                <div
                                  key={prob.problemId}
                                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all"
                                >
                                  <div className="flex items-center space-x-3.5">
                                    <input
                                      type="checkbox"
                                      checked={prob.status === "SOLVED"}
                                      onChange={() => handleToggleDSA(prob.problemId, prob.status)}
                                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <div>
                                      <h5 className={`font-semibold text-slate-800 ${prob.status === "SOLVED" ? "line-through text-slate-400" : ""}`}>
                                        {prob.title}
                                      </h5>
                                      <span className={`text-[8px] font-extrabold uppercase tracking-widest mt-1 block ${prob.difficulty === "Easy" ? "text-emerald-700"
                                        : prob.difficulty === "Medium" ? "text-amber-700"
                                          : "text-rose-700"
                                        }`}>
                                        {prob.difficulty}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tab 5: Coding Playground */}
              {activeTab === "coding" && (
                <div className="space-y-8 animate-float">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                      AI Coding Playground
                    </h2>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed font-sans">
                      Compile and run solutions on standard DSA challenges with continuous AI code review.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-xs">

                    {/* Problem list (3 cols) */}
                    <div className="lg:col-span-3 space-y-4">
                      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                        <h3 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest border-b border-slate-200 pb-2">Challenges</h3>

                        <div className="space-y-2">
                          {codingProblems.map((prob) => (
                            <div
                              key={prob.problemId}
                              onClick={() => handleSelectProblem(prob)}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${selectedProblem?.problemId === prob.problemId
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                                }`}
                            >
                              <h4 className="font-semibold text-slate-900">{prob.title}</h4>
                              <span className={`text-[8px] font-extrabold uppercase tracking-widest mt-1.5 inline-block ${prob.difficulty === "Easy" ? "text-emerald-700" : "text-amber-700"
                                }`}>
                                {prob.difficulty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedProblem && (
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3.5">
                          <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">Description</h3>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[11px]">
                            {selectedProblem.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Editor Workspace (6 cols) */}
                    <div className="lg:col-span-6 flex flex-col space-y-4">
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                          <h3 className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                            <Code2 size={15} className="text-blue-600" />
                            <span className="font-bold text-slate-900">Workspace</span>
                          </h3>

                          <div className="flex items-center space-x-2">
                            <label className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Language:</label>
                            <select
                              value={editorLanguage}
                              onChange={(e) => handleLanguageChange(e.target.value)}
                              className="bg-white border border-slate-300 text-slate-900 text-[10px] px-2 py-0.5 rounded-lg focus:ring-0 outline-none"
                            >
                              <option value="python">Python</option>
                              <option value="javascript">JavaScript</option>
                              <option value="cpp">C++</option>
                            </select>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-[#1e1e1e]">
                          <Editor
                            height="380px"
                            language={editorLanguage === "cpp" ? "cpp" : editorLanguage}
                            value={editorCode}
                            onChange={(val) => setEditorCode(val || "")}
                            theme="vs-dark"
                            options={{
                              fontSize: 13,
                              minimap: { enabled: false },
                              scrollbar: { vertical: "visible" },
                              lineNumbers: "on",
                              tabSize: 4,
                              automaticLayout: true
                            }}
                          />
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                          <button
                            onClick={handleGetCodingHint}
                            className="text-xs text-blue-600 hover:text-blue-700 px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors font-semibold"
                          >
                            Get AI Hint
                          </button>
                          <div className="flex space-x-3">
                            <button
                              onClick={handleRunCode}
                              className="text-xs bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors flex items-center space-x-2 font-semibold"
                            >
                              <Play size={12} />
                              <span>Run Code</span>
                            </button>
                            <button
                              onClick={handleSubmitCode}
                              className="text-xs btn-primary px-4 py-2 rounded-xl transition-all flex items-center space-x-2 font-semibold"
                            >
                              <Sparkles size={12} />
                              <span>Submit & Review</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Console Log output panel */}
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                        <h3 className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center space-x-2 font-bold">
                          <Terminal size={14} className="text-amber-600" />
                          <span>Console Log</span>
                        </h3>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-[10px] leading-relaxed min-h-[100px] max-h-[160px] overflow-y-auto shadow-inner text-slate-100">
                          {runSuccess !== null && (
                            <div className="mb-2">
                              <span className={`font-bold uppercase text-[8px] px-2 py-0.5 rounded border ${runSuccess ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                }`}>
                                {runSuccess ? "Assertions Passed" : "Assertions Failed"}
                              </span>
                            </div>
                          )}
                          {runStdout && <pre className="text-emerald-400 whitespace-pre-wrap">{runStdout}</pre>}
                          {runStderr && <pre className="text-rose-400 whitespace-pre-wrap mt-1">{runStderr}</pre>}
                          {!runStdout && !runStderr && (
                            <span className="text-slate-500">Hit 'Run Code' to execute assertions...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI review side panel (3 cols) */}
                    <div className="lg:col-span-3 space-y-6">

                      {aiReview ? (
                        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-5">
                          <div className="border-b border-slate-200 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">AI Code Review</h3>
                            <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2.5 inline-block bg-blue-50 border border-blue-200 text-blue-700">
                              Time: {aiReview.timeComplexity} • Space: {aiReview.spaceComplexity}
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1 block">Analysis Summary</h4>
                              <p className="text-[11px] text-slate-700 leading-relaxed">{aiReview.review}</p>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                              <h4 className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2 block">Improvement Tips</h4>
                              <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-1.5 pl-1">
                                {aiReview.refactoringTips?.map((tip, idx) => (
                                  <li key={idx} className="leading-relaxed">{tip}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center py-12 text-slate-500">
                          <Sparkles size={24} className="mx-auto text-blue-600 animate-pulse mb-3" />
                          <p className="text-xs text-slate-500">Submit code to generate complexity analysis and refactoring recommendations.</p>
                        </div>
                      )}

                      {/* Progressive Hints block */}
                      {codingHint && (
                        <div className="bg-blue-50/60 p-5 rounded-2xl shadow-sm space-y-2.5 border border-blue-200">
                          <h4 className="text-xs font-bold text-blue-700 flex items-center space-x-1.5">
                            <Sparkles size={14} className="text-blue-600 animate-pulse" />
                            <span>Mentor Hint</span>
                          </h4>
                          <p className="text-slate-800 leading-relaxed text-[11px] whitespace-pre-wrap">{codingHint}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Company Prep */}
              {activeTab === "company" && (
                <div className="space-y-8 animate-float">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                      Company Prep Insights
                    </h2>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed font-sans">
                      Deep dive behavioral and technical guides customized for enterprise brands.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-xs">

                    {/* Brand grid selection */}
                    <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 h-fit">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-3 flex items-center space-x-2">
                        <Sliders size={16} className="text-blue-600" />
                        <span>Target Settings</span>
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Dream Company</label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Google", "Amazon", "Microsoft", "TCS", "Infosys"].map(co => (
                              <button
                                key={co}
                                onClick={() => handleGenerateCompanyPrep(co, "Software Engineer")}
                                className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition-all text-center text-slate-700 font-semibold"
                              >
                                {co}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* prep display area */}
                    <div className="lg:col-span-8 space-y-6">
                      {companyPreps.length > 0 ? (
                        companyPreps.map((prep, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">

                            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                              <h3 className="text-lg font-bold text-slate-900 font-sans">{prep.companyName} ({prep.role})</h3>
                              <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                {prep.readinessPercentage}% Ready
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Recruitment Pipeline</h4>
                                <p className="text-slate-700 leading-relaxed">{prep.companyInsights.recruitmentProcess}</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
                                <div>
                                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Behavioral / HR Prompts</h4>
                                  <ul className="list-decimal list-inside space-y-1.5 text-slate-700 pl-1">
                                    {prep.companyInsights.hrQuestions.map((q, qidx) => (
                                      <li key={qidx} className="leading-relaxed">{q}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Technical / System Design Prompts</h4>
                                  <ul className="list-decimal list-inside space-y-1.5 text-slate-700 pl-1">
                                    {prep.companyInsights.technicalQuestions.map((q, qidx) => (
                                      <li key={qidx} className="leading-relaxed">{q}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                                <div>
                                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Common DSA Topics</h4>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {prep.companyInsights.dsaTopics.map((topic, tidx) => (
                                      <span key={tidx} className="bg-blue-50 border border-blue-200 text-blue-700 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Tactical Prep Tips</h4>
                                  <ul className="list-disc list-inside space-y-1.5 text-slate-700 pl-1">
                                    {prep.companyInsights.interviewTips.map((tip, tidx) => (
                                      <li key={tidx} className="leading-relaxed">{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center py-16 text-slate-400">
                          <Building2 size={28} className="mx-auto text-slate-400 animate-pulse mb-3" />
                          <p className="text-xs text-slate-500">No active guides. Pick a dream company target on the left settings menu.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: AI Roadmap */}
              {activeTab === "roadmap" && (() => {
                const roadmapStats = (() => {
                  if (!roadmap) return { totalTasks: 0, completedTasks: 0, percent: 0 };
                  let totalTasks = 0;
                  let completedTasks = 0;
                  roadmap.weeks.forEach(w => {
                    w.tasks.forEach(t => {
                      totalTasks++;
                      if (t.completed) completedTasks++;
                    });
                  });
                  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                  return { totalTasks, completedTasks, percent };
                })();

                return (
                  <div className="space-y-8 animate-float">
                    <div>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                        Personalized Study Roadmap
                      </h2>
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed font-sans">
                        Weekly milestones generated by AI based on your skill levels and target constraints.
                      </p>
                    </div>

                    {loading && !roadmap ? (
                      <div className="space-y-6">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex justify-between items-center animate-pulse">
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <Skeleton className="h-10 w-20" />
                        </div>
                        <div className="relative border-l border-slate-200 ml-4 space-y-8 pl-8">
                          <div className="space-y-4">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                          <div className="space-y-4">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                        </div>
                      </div>
                    ) : !roadmap ? (
                      <div className="bg-white border border-slate-200 p-8 max-w-xl mx-auto rounded-2xl shadow-sm space-y-6 font-sans text-xs">
                        <div className="text-center space-y-2">
                          <Sparkles size={36} className="mx-auto text-blue-600 animate-pulse" />
                          <h3 className="text-lg font-bold text-slate-900">No Roadmap Active</h3>
                          <p className="text-slate-600 leading-relaxed">
                            Let Gemini custom-architect a week-by-week agenda matching your dream company target.
                          </p>
                        </div>

                        <form onSubmit={handleGenerateRoadmap} className="space-y-4 pt-4 border-t border-slate-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Role</label>
                              <input
                                type="text"
                                value={roadmapRole}
                                onChange={(e) => setRoadmapRole(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Dream Company</label>
                              <input
                                type="text"
                                value={roadmapCompany}
                                onChange={(e) => setRoadmapCompany(e.target.value)}
                                className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Time Available (Weeks)</label>
                              <input
                                type="number"
                                min="1"
                                max="12"
                                value={roadmapWeeks}
                                onChange={(e) => setRoadmapWeeks(parseInt(e.target.value) || 6)}
                                className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Current Skills</label>
                              <input
                                type="text"
                                value={roadmapSkills}
                                onChange={(e) => setRoadmapSkills(e.target.value)}
                                placeholder="React, Python, SQL"
                                className="w-full bg-white border border-slate-300 text-slate-900 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                              />
                            </div>
                          </div>

                          <button type="submit" className="w-full btn-primary text-xs py-2.5 flex justify-center items-center space-x-2 mt-2">
                            <Sparkles size={14} />
                            <span>Generate Study Agenda</span>
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-8 font-sans text-xs">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex justify-between items-center gap-6 flex-wrap">
                          <div>
                            <h3 className="text-md font-bold text-slate-900 font-sans">
                              Adaptive Roadmap for {roadmap.targetCompany ? `${roadmap.targetCompany} (${roadmap.targetRole})` : roadmap.targetRole}
                            </h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{roadmap.durationWeeks} Weeks Timeline</p>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <p className="text-xs font-bold text-blue-600">{roadmapStats.percent}% Complete</p>
                              <span className="text-[9px] text-slate-500 font-bold block mt-0.5">{roadmapStats.completedTasks}/{roadmapStats.totalTasks} milestones met</span>
                            </div>
                            <div className="w-24 bg-slate-100 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${roadmapStats.percent}%` }}></div>
                            </div>
                            <button onClick={() => setRoadmap(null)} className="btn-secondary text-xs py-1.5 px-3">
                              Reset
                            </button>
                          </div>
                        </div>

                        <div className="relative border-l border-slate-200 ml-4 space-y-8 pl-8">
                          {roadmap.weeks.map((week) => {
                            const weekCompleted = week.tasks.length > 0 && week.tasks.every(t => t.completed);
                            return (
                              <div key={week.weekNumber} className="relative">

                                <span className={`absolute -left-11 top-1.5 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center font-bold text-[9px] transition-colors ${weekCompleted ? "border-emerald-600 text-emerald-700" : "border-blue-600 text-blue-600"
                                  }`}>
                                  {week.weekNumber}
                                </span>

                                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                                  <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                                    <div>
                                      <h4 className="text-sm font-bold text-slate-900 font-sans">Week {week.weekNumber}: {week.title}</h4>
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {week.topics.map((t, idx) => (
                                          <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                                            {t}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    {weekCompleted && (
                                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                        Week Complete
                                      </span>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed">
                                    <div className="space-y-2">
                                      <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Topics & Study Guides</h5>
                                      <ul className="list-disc list-inside text-slate-700 space-y-1.5 pl-1">
                                        {week.resources.map((res, idx) => <li key={idx}>{res}</li>)}
                                      </ul>
                                    </div>

                                    <div className="space-y-3">
                                      <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Milestone Tasks</h5>
                                      <div className="space-y-2">
                                        {week.tasks.map((task) => (
                                          <div key={task.taskId} className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                                            <input
                                              type="checkbox"
                                              checked={task.completed}
                                              onChange={() => handleToggleRoadmapTask(week.weekNumber, task.taskId, task.completed)}
                                              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className={`font-semibold ${task.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                                              {task.description}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {dashboardAnalysisResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl space-y-6 mt-6 text-xs font-sans"
                      >
                        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600">
                              AI Resume Audit Report
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-1">Generated by CareerPilot AI suite</p>
                          </div>
                          {dashboardResumeId && (
                            <button
                              onClick={() => handleDownloadReport(dashboardResumeId)}
                              className="flex items-center space-x-1.5 text-[10px] bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider"
                            >
                              <Download size={12} />
                              <span>Download PDF Report</span>
                            </button>
                          )}
                        </div>

                        {/* Scores Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {[
                            { label: "Overall Score", value: dashboardAnalysisResult.overallScore, color: "text-blue-600" },
                            { label: "ATS Match Score", value: dashboardAnalysisResult.atsScore, color: "text-purple-600" },
                            { label: "Grammar Score", value: dashboardAnalysisResult.grammarScore, color: "text-emerald-600" },
                            { label: "Technical Score", value: dashboardAnalysisResult.technicalScore, color: "text-amber-600" },
                            { label: "Communication", value: dashboardAnalysisResult.communicationScore, color: "text-pink-600" }
                          ].map((score, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center space-y-1">
                              <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold block">{score.label}</span>
                              <span className={`text-2xl font-black ${score.color}`}>{score.value}/100</span>
                            </div>
                          ))}
                        </div>

                        {/* Resume Summary */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Executive Profile Summary</h4>
                          <p className="text-[11.5px] text-slate-700 leading-relaxed font-sans">{dashboardAnalysisResult.resumeSummary}</p>
                        </div>

                        {/* Strengths & Weaknesses Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl space-y-3">
                            <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              <span>Core Strengths</span>
                            </h4>
                            <ul className="space-y-2 text-[11px] text-slate-700 list-disc list-inside">
                              {dashboardAnalysisResult.strengths?.map((str, idx) => (
                                <li key={idx} className="leading-relaxed font-sans">{str}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-rose-50 border border-rose-200 p-5 rounded-xl space-y-3">
                            <h4 className="text-[10px] font-bold text-rose-700 uppercase tracking-widest flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                              <span>Areas for Improvement</span>
                            </h4>
                            <ul className="space-y-2 text-[11px] text-slate-700 list-disc list-inside">
                              {dashboardAnalysisResult.weaknesses?.map((wk, idx) => (
                                <li key={idx} className="leading-relaxed font-sans">{wk}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Missing Skills & suggestions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Missing Skills */}
                          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                            <h4 className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Missing Industry Skills</h4>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {dashboardAnalysisResult.missingSkills?.map((skill, idx) => (
                                <span key={idx} className="text-[9px] px-2.5 py-1 bg-amber-100 border border-amber-200 text-amber-800 rounded-lg font-mono font-semibold">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Recommended Projects */}
                          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                            <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Recommended Portfolio Projects</h4>
                            <ul className="space-y-2 text-[10px] text-slate-700 list-disc list-inside">
                              {dashboardAnalysisResult.recommendedProjects?.map((proj, idx) => (
                                <li key={idx} className="leading-relaxed font-sans">{proj}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Recommended Certifications */}
                          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                            <h4 className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Recommended Coursework & Certs</h4>
                            <ul className="space-y-2 text-[10px] text-slate-700 list-disc list-inside">
                              {dashboardAnalysisResult.recommendedCertifications?.map((cert, idx) => (
                                <li key={idx} className="leading-relaxed font-sans">{cert}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Interview Questions */}
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
                          <h4 className="text-[10px] font-bold text-pink-700 uppercase tracking-wider flex items-center space-x-1.5">
                            <span>Practice Interview Questions</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardAnalysisResult.interviewQuestions?.map((q, idx) => (
                              <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-[10.5px] text-slate-800 font-medium leading-relaxed font-sans">"{q}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })()}

            </motion.div>
          </AnimatePresence>

          {/* Toast Overlay System */}
          {toast && (
            <div className="fixed bottom-5 right-5 z-[9999] animate-bounce-subtle">
              <div className={`p-4 rounded-xl border flex items-center space-x-3 shadow-2xl backdrop-blur-xl ${toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-455 shadow-emerald-500/10 shadow-lg"
                : "bg-rose-500/10 border-rose-500/35 text-rose-455 shadow-rose-500/10 shadow-lg"
                }`}>
                <Sparkles size={16} />
                <span className="text-xs font-semibold font-sans">{toast.message}</span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* AI ASSISTANT FLOATING WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 font-sans text-xs">

        {/* Floating Bubble Icon */}
        {!chatOpen ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatOpen(true)}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all outline-none relative group"
          >
            <Sparkles size={20} className="group-hover:animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
          </motion.button>
        ) : (
          /* Floating Light SaaS Chat Box */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-80 h-96 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Chat header */}
            <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex justify-between items-center select-none shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Sparkles size={12} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Gemini Assistant</h4>
                  <span className="text-[8px] text-slate-500 font-semibold block uppercase tracking-widest">Active Mentor</span>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat message history feed */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed text-[10.5px] border ${msg.sender === "user"
                    ? "bg-blue-600 border-blue-600 text-white rounded-br-none font-medium"
                    : "bg-white border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {aiTyping && (
                <div className="flex justify-start">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 rounded-bl-none flex items-center space-x-1.5 shadow-sm">
                    <Loader2 size={12} className="animate-spin text-blue-600" />
                    <span>Gemini is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions list */}
            <div className="px-3.5 pb-2 pt-1 flex flex-wrap gap-1.5 shrink-0 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => { setChatInput("Explain DSA patterns"); }}
                className="text-[8.5px] bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full transition-colors font-medium shadow-sm"
              >
                Explain DSA patterns
              </button>
              <button
                onClick={() => { setChatInput("Audit my resume suggestions"); }}
                className="text-[8.5px] bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full transition-colors font-medium shadow-sm"
              >
                Audit my resume
              </button>
            </div>

            {/* Chat submit input */}
            <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-200 bg-white flex space-x-2 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask CareerPilot..."
                className="flex-1 bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:bg-white text-slate-900 text-[10px] px-3 py-2 rounded-xl outline-none transition-colors"
              />
              <button type="submit" className="btn-primary p-2 rounded-xl flex items-center justify-center">
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard/*" element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>} />
          <Route path="/*" element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
