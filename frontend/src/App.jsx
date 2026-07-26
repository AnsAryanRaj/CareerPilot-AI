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
  Briefcase
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
const CircularProgress = ({ value, size = 110, strokeWidth = 8, color = "stroke-indigo-500" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="stroke-slate-800/70"
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
        <span className="text-xl font-extrabold text-white tracking-tight">
          <AnimatedCounter value={value} suffix="%" />
        </span>
        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Ready</span>
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

  const [interviewSession, setInterviewSession] = useState(null);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewResult, setInterviewResult] = useState(null);

  const [mockInterviewHistory, setMockInterviewHistory] = useState([]);
  const [interviewType, setInterviewType] = useState("TECHNICAL");
  const [customRole, setCustomRole] = useState("Software Engineer");
  const [customCompany, setCustomCompany] = useState("Google");
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const [dsaTopics, setDSATopics] = useState([]);
  const [companyPreps, setCompanyPreps] = useState([]);
  const [roadmap, setRoadmap] = useState(null);

  // Interactive Goals Checklist State
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, text: "Solve 2 Medium DSA problems", completed: false },
    { id: 2, text: "Review resume grammar suggestions", completed: true },
    { id: 3, text: "Conduct 1 Mock Interview session", completed: false },
    { id: 4, text: "Generate Google tech prep roadmaps", completed: false }
  ]);
  const [newGoalText, setNewGoalText] = useState("");

  // Simulated AI Assistant Floating Widget State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I am your CareerPilot AI Assistant. Ask me anything about DSA, resumes, or mock interviews!" }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  // Mock Notifications list
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Resume ATS review updated: 82/100", time: "10m ago", read: false },
    { id: 2, text: "Google Mock interview evaluation ready", time: "2h ago", read: false },
    { id: 3, text: "Solved 3 DSA patterns: Streak 3 days!", time: "1d ago", read: true }
  ]);

  // Mock Upcoming Interviews
  const [upcomingInterviews, setUpcomingInterviews] = useState([
    { id: 1, role: "Backend Engineer", company: "Google", type: "Technical Mock", date: "Tomorrow, 3:00 PM", status: "Confirmed" },
    { id: 2, role: "Software Engineer", company: "Amazon", type: "System Design Mock", date: "July 26th, 11:30 AM", status: "Pending" },
    { id: 3, role: "Fullstack Developer", company: "Stripe", type: "HR Behavioral", date: "July 28th, 4:00 PM", status: "Scheduled" }
  ]);

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
  };

  const handleDashboardResumeUpload = async (e) => {
    e.preventDefault();
    if (!dashboardResumeFile) return;

    setDashboardUploadStatus("uploading");
    setDashboardUploadProgress(20);
    setDashboardUploadMessage("Preparing upload...");

    try {
      if (currentUser) {
        await currentUser.getIdToken(true);
      }
      const formData = new FormData();
      formData.append("file", dashboardResumeFile);

      setDashboardUploadProgress(55);
      setDashboardUploadMessage("Uploading to server...");

      const res = await uploadResume(formData);

      setDashboardUploadProgress(100);
      setDashboardUploadStatus("success");
      setDashboardUploadMessage("Resume uploaded successfully!");
      showToast("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      setDashboardUploadStatus("error");
      setDashboardUploadMessage(
        err.response?.data?.message || "Failed to upload resume to the backend server."
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
  const toggleGoal = (id) => {
    setDailyGoals(
      dailyGoals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
    showToast("Goal status updated!");
  };

  const addCustomGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setDailyGoals([
      ...dailyGoals,
      { id: Date.now(), text: newGoalText, completed: false }
    ]);
    setNewGoalText("");
    showToast("Goal added successfully!");
  };

  const deleteGoal = (id) => {
    setDailyGoals(dailyGoals.filter((g) => g.id !== id));
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
    <div className="flex min-h-screen bg-[#07080e] text-[#f1f5f9] font-sans transition-all duration-300">

      {/* COLLAPSIBLE SIDEBAR: Glassmorphic left deck */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="border-r border-white/[0.06] bg-[#090b11]/70 backdrop-blur-xl flex flex-col justify-between select-none z-45 shrink-0"
      >
        <div>
          {/* Logo Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/[0.06] h-16">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shrink-0">
                CP
              </div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h1 className="text-xs font-bold tracking-tight text-white flex items-center space-x-1">
                    <span>CareerPilot</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">AI</span>
                  </h1>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-semibold block -mt-0.5">
                    PREP ENGINE
                  </span>
                </motion.div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="text-slate-550 hover:text-white p-1.5 rounded-lg hover:bg-slate-900/50 hidden md:block transition-all"
                title="Collapse Sidebar"
              >
                <ChevronLeft size={15} />
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
                    ? "bg-gradient-to-r from-indigo-500/10 to-transparent text-indigo-400 border-l-[3px] border-indigo-500 font-semibold"
                    : "text-slate-400 hover:bg-slate-900/40 hover:text-white"
                    }`}
                  title={item.label}
                >
                  <Icon size={16} className={isActive ? "text-indigo-400 animate-pulse" : "text-slate-400 group-hover:scale-105 transition-transform"} />
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] font-medium ml-3 whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card Session Card with Dropdown */}
        <div className="p-3 border-t border-white/[0.06] bg-[#07090e]/30 relative">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="text-slate-550 hover:text-white p-1.5 rounded-lg hover:bg-slate-900/50"
                title="Expand Sidebar"
              >
                <ChevronRight size={15} />
              </button>
              <div
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-350 uppercase shrink-0 text-xs cursor-pointer hover:border-indigo-500 transition-colors"
              >
                {userProfile?.fullName ? userProfile.fullName[0] : "U"}
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center justify-between min-w-0 cursor-pointer p-1.5 rounded-xl hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  {userProfile?.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border border-slate-700 object-cover shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-350 uppercase shrink-0 text-[10px] group-hover:border-indigo-500 transition-colors">
                      {userProfile?.fullName ? userProfile.fullName[0] : "U"}
                    </div>
                  )}
                  <div className="overflow-hidden min-w-0">
                    <p className="text-[11px] font-semibold text-slate-200 truncate">{userProfile?.fullName || "Student"}</p>
                    <p className="text-[9px] text-slate-500 truncate">{userProfile?.email || ""}</p>
                  </div>
                </div>
                <ChevronDown size={12} className={`text-slate-550 transition-transform duration-250 ${profileMenuOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
          )}

          {/* Profile Dropdown panel */}
          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={`absolute bg-[#090d16]/95 border border-white/[0.08] rounded-xl shadow-2xl backdrop-blur-xl p-2.5 z-50 text-[11px] font-sans space-y-1.5 ${sidebarCollapsed ? "left-16 bottom-3 w-40" : "left-3 right-3 bottom-14"
                  }`}
              >
                <div className="px-2 py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-550 uppercase tracking-widest text-[8px] font-bold">Profile Actions</span>
                </div>
                <button
                  onClick={() => { setActiveTab("dashboard"); setProfileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-900/60 text-slate-300 hover:text-white transition-all text-left"
                >
                  <User size={13} className="text-indigo-400" />
                  <span>Personal Profile</span>
                </button>
                {roadmap?.targetCompany && (
                  <div className="px-2 py-1 border-t border-white/[0.04] text-[9.5px] text-slate-455">
                    Target: {roadmap.targetCompany}
                  </div>
                )}
                <button
                  onClick={() => { setProfileMenuOpen(false); logout(); }}
                  className="w-full flex items-center space-x-2.5 px-2 py-1.5 rounded-lg hover:bg-rose-500/5 text-rose-455 hover:text-rose-400 transition-all text-left border-t border-white/[0.04]"
                >
                  <LogOut size={13} />
                  <span className="font-semibold">Log Out Session</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* MAIN CONTAINER FRAME */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* TOP NAVIGATION */}
        <header className="h-16 border-b border-white/[0.06] bg-[#07090e]/75 backdrop-blur-md px-6 flex justify-between items-center sticky top-0 z-30 select-none">
          {/* Path Breadcrumbs & Collapsible trigger */}
          <div className="flex items-center space-x-3 text-xs text-slate-450">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="text-slate-550 hover:text-white p-1 rounded-lg hover:bg-slate-900/50 transition-colors"
                title="Expand Sidebar"
              >
                <Menu size={15} />
              </button>
            )}
            <span className="font-semibold text-slate-400">CareerPilot</span>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="font-medium text-slate-200">{getBreadcrumbName()}</span>
          </div>

          {/* Search bar inside header */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/60 border border-white/[0.06] rounded-xl px-3 py-1.5 w-64 focus-within:border-indigo-500/40 transition-colors group">
            <Search size={14} className="text-slate-555 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search specs, roadmaps, codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-[10px] outline-none text-slate-200 placeholder:text-slate-600 w-full"
            />
          </div>

          {/* Quick Metrics Indicators & Notifications drop */}
          <div className="flex items-center space-x-3.5 relative">
            {userProfile?.dsaStreak > 0 && (
              <div className="hidden sm:flex items-center space-x-1 px-2.5 py-0.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-455 text-[9px] font-bold uppercase tracking-wider animate-pulse-subtle">
                <span>🔥</span>
                <span>{userProfile.dsaStreak} Day Streak</span>
              </div>
            )}

            {roadmap?.targetCompany && (
              <div className="hidden sm:flex items-center space-x-1 px-2.5 py-0.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[9px] font-bold uppercase tracking-wider">
                <Target size={9} />
                <span>Target: {roadmap.targetCompany}</span>
              </div>
            )}

            <div className="w-px h-4 bg-white/[0.08] hidden sm:block"></div>

            {/* Notification Bell with Dropdown trigger */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-slate-455 hover:text-white p-1.5 rounded-lg hover:bg-slate-900/50 transition-colors relative"
            >
              <Bell size={15} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
              )}
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-10 w-72 bg-[#090d16]/95 border border-white/[0.08] rounded-xl shadow-2xl backdrop-blur-xl p-4 space-y-3 z-50 text-xs font-sans"
                >
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <span className="font-bold text-slate-350">Notifications</span>
                    <button
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                      className="text-[9px] text-indigo-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2 rounded-lg border transition-all ${n.read ? "bg-slate-950/20 border-transparent text-slate-455 hover:text-slate-300" : "bg-indigo-500/5 border-indigo-500/10 text-slate-200"
                        }`}>
                        <p className="leading-snug text-[10px]">{n.text}</p>
                        <span className="text-[8px] text-slate-500 block mt-1">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* CONTENT SWITCH AREA */}
        <main className="flex-1 p-6 overflow-y-auto relative bg-[#07080e] min-w-0">

          {loading && (
            <div className="absolute top-4 right-6 flex items-center space-x-2 bg-slate-950/80 border border-white/[0.05] px-3 py-1.5 rounded-full z-50 shadow-xl backdrop-blur-md">
              <Loader2 className="animate-spin text-indigo-400" size={13} />
              <span className="text-[9px] font-semibold text-slate-400 tracking-wide">Syncing data...</span>
            </div>
          )}

          {/* PAGE VIEWS SWITCH */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="w-full"
            >

              {/* Tab 1: Dashboard */}
              {activeTab === "dashboard" && (() => {
                const avgResume = resumeList.length > 0
                  ? Math.round(resumeList.reduce((acc, r) => acc + (r.overallScore || 0), 0) / resumeList.length)
                  : 82;

                const evaluatedInterviews = mockInterviewHistory.filter(h => h.evaluation);
                const avgInterview = evaluatedInterviews.length > 0
                  ? Math.round(evaluatedInterviews.reduce((acc, h) => acc + h.evaluation.overallScore, 0) / evaluatedInterviews.length)
                  : 76;

                let dsaTotal = 0;
                let dsaSolved = 0;
                let easySolved = 0, mediumSolved = 0, hardSolved = 0;
                dsaTopics.forEach(topic => {
                  topic.problems.forEach(prob => {
                    dsaTotal++;
                    if (prob.status === "SOLVED") {
                      dsaSolved++;
                      if (prob.difficulty === "Easy") easySolved++;
                      else if (prob.difficulty === "Medium") mediumSolved++;
                      else if (prob.difficulty === "Hard") hardSolved++;
                    }
                  });
                });

                // Fallbacks for empty states
                if (dsaTotal === 0) { dsaTotal = 50; dsaSolved = 18; easySolved = 8; mediumSolved = 7; hardSolved = 3; }
                const dsaPercent = dsaTotal > 0 ? Math.round((dsaSolved / dsaTotal) * 100) : 0;
                const readiness = Math.round(0.3 * avgResume + 0.3 * avgInterview + 0.4 * dsaPercent);

                // Activity grid
                const activityGrid = Array.from({ length: 28 }, (_, i) => {
                  const hasActivity = i % 4 === 0 || i === 27;
                  return { day: i + 1, active: hasActivity };
                });

                // Line Chart
                const lineChartData = {
                  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                  datasets: [
                    {
                      label: "Readiness Score (%)",
                      data: [42, 58, 67, readiness],
                      borderColor: "#818cf8",
                      backgroundColor: "rgba(129, 140, 248, 0.05)",
                      tension: 0.4,
                      fill: true,
                      pointBackgroundColor: "#a5b4fc",
                      pointBorderColor: "#090d16",
                      pointHoverRadius: 6
                    }
                  ]
                };

                const chartOptions = {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    x: { grid: { color: "rgba(255,255,255,0.03)" }, ticks: { color: "#64748b", font: { size: 9 } } },
                    y: { grid: { color: "rgba(255,255,255,0.03)" }, ticks: { color: "#64748b", font: { size: 9 } } }
                  }
                };

                return (
                  <div className="space-y-6 animate-float">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                          Readiness Command Center
                        </h2>
                        <p className="text-slate-455 text-xs mt-0.5 leading-relaxed">
                          Your centralized dashboard for resume scores, algorithm velocity, mock sessions, and tasks.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold bg-[#0a0d16] border border-white/[0.04] px-3 py-1.5 rounded-lg select-none">
                        <Calendar size={12} className="mr-1" />
                        <span>Mock Session Live</span>
                      </div>
                    </div>

                    {/* Skeletons loader if loading */}
                    {loading && stats === null ? (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ) : (
                      /* Dashboard Metric Scorecards: Linear styled stats card deck */
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                        {/* Placement Readiness Score Card */}
                        <motion.div
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-4.5 rounded-2xl flex items-center justify-between hover:border-indigo-500/25 transition-all shadow-xl duration-300"
                        >
                          <div className="space-y-1 overflow-hidden">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Placement score</span>
                            <span className="text-2xl font-black text-white">
                              <AnimatedCounter value={readiness} suffix="%" />
                            </span>
                            <span className="text-[8px] text-indigo-400 font-semibold block mt-1 truncate">Ready for Google target</span>
                          </div>
                          <CircularProgress value={readiness} size={64} strokeWidth={5} />
                        </motion.div>

                        {/* Resume Score Card */}
                        <motion.div
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-4.5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/25 transition-all shadow-xl duration-300"
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Resume grading</span>
                            <span className="text-2xl font-black text-emerald-450">
                              <AnimatedCounter value={avgResume} suffix="/100" />
                            </span>
                            <span className="text-[8px] text-slate-550 block mt-1.5">ATS suggestions verified</span>
                          </div>
                        </motion.div>

                        {/* Interview Score Card */}
                        <motion.div
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-4.5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/25 transition-all shadow-xl duration-300"
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Interview Average</span>
                            <span className="text-2xl font-black text-purple-400">
                              <AnimatedCounter value={avgInterview} suffix="%" />
                            </span>
                            <span className="text-[8px] text-slate-550 block mt-1.5">STAR scorecard breakdown</span>
                          </div>
                        </motion.div>

                        {/* DSA Progress Card */}
                        <motion.div
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-4.5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/25 transition-all shadow-xl duration-300"
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">DSA Completed</span>
                            <span className="text-2xl font-black text-amber-400">
                              <AnimatedCounter value={dsaSolved} /> solves
                            </span>
                            <span className="text-[8px] text-slate-550 block mt-1.5">{dsaPercent}% of patterns sheet met</span>
                          </div>
                        </motion.div>

                        {/* AI Roadmap Card */}
                        <motion.div
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-4.5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/25 transition-all shadow-xl duration-300"
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Roadmap Weeks</span>
                            <span className="text-2xl font-black text-indigo-400">
                              <AnimatedCounter value={roadmap?.durationWeeks || 6} /> weeks
                            </span>
                            <span className="text-[8px] text-slate-550 block mt-1.5">Target: {roadmap?.targetCompany || "Google"}</span>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* Middle grid section: Graph + Goals */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                      {/* Graph representing Weekly Progress Chart */}
                      <div className="lg:col-span-7 bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl flex flex-col justify-between min-h-[300px]">
                        <div className="flex justify-between items-center border-b border-white/[0.05] pb-2.5">
                          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <span>Weekly Progress Velocity</span>
                          </h3>
                          <span className="text-[9px] text-slate-500">Updated: Today</span>
                        </div>
                        <div className="flex-1 mt-4 relative h-[180px]">
                          <Line data={lineChartData} options={chartOptions} />
                        </div>
                      </div>

                      {/* Daily Goals Checklist */}
                      <div className="lg:col-span-5 bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl flex flex-col justify-between min-h-[300px] text-xs font-sans">
                        <div className="flex justify-between items-center border-b border-white/[0.05] pb-2.5">
                          <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest flex items-center space-x-2">
                            <CheckSquare size={14} className="text-indigo-400" />
                            <span>Daily Goals Checklist</span>
                          </h3>
                          <span className="text-[8px] text-slate-555 font-bold uppercase tracking-wider">
                            {dailyGoals.filter(g => g.completed).length} / {dailyGoals.length} met
                          </span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 mt-4 pr-1 max-h-[160px]">
                          {dailyGoals.map((g) => (
                            <div
                              key={g.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-950/30 border border-white/[0.03] hover:border-slate-800 transition-all duration-200"
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <button
                                  onClick={() => toggleGoal(g.id)}
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${g.completed
                                    ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-455"
                                    : "border-white/[0.08] hover:border-slate-650"
                                    }`}
                                >
                                  {g.completed && <Check size={10} />}
                                </button>
                                <span className={`text-[10.5px] truncate ${g.completed ? "line-through text-slate-550" : "text-slate-200"
                                  }`}>
                                  {g.text}
                                </span>
                              </div>
                              <button
                                onClick={() => deleteGoal(g.id)}
                                className="text-slate-600 hover:text-rose-455 transition-colors p-1"
                                title="Delete Goal"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add custom goal */}
                        <form onSubmit={addCustomGoal} className="flex items-center space-x-2 mt-4 pt-3 border-t border-white/[0.04]">
                          <input
                            type="text"
                            placeholder="Add task goal..."
                            value={newGoalText}
                            onChange={(e) => setNewGoalText(e.target.value)}
                            className="flex-1 bg-[#07090e] border border-white/[0.06] text-white text-[10px] px-3 py-2 rounded-lg outline-none focus:border-indigo-550 transition-colors"
                          />
                          <button type="submit" className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-lg transition-colors">
                            <Plus size={13} />
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Bottom grid section: Upload + Schedule + Timeline */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                      {/* Dashboard Resume Upload Card */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center border-b border-white/[0.05] pb-2.5 mb-4">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                              <Upload size={14} className="text-indigo-400" />
                              <span>Resume Upload Center</span>
                            </h3>
                            <span className="text-[8px] bg-slate-900 border border-white/[0.04] text-slate-500 px-2 py-0.5 rounded font-bold">FastAPI</span>
                          </div>

                          <form onSubmit={handleDashboardResumeUpload} className="space-y-4">
                            <div className="border border-dashed border-white/[0.08] hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#07090e]/30">
                              <Upload size={20} className="text-slate-500 mb-1" />
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleDashboardResumeChange}
                                className="hidden"
                                id="dashboard-resume-file-input"
                              />
                              <label htmlFor="dashboard-resume-file-input" className="text-[10px] text-slate-455 font-bold cursor-pointer text-center select-none uppercase tracking-wide">
                                {dashboardResumeFile ? dashboardResumeFile.name : "Select PDF, DOC, DOCX (Max 5MB)"}
                              </label>
                            </div>

                            {dashboardUploadStatus === "uploading" && (
                              <div className="space-y-2 mt-2">
                                <div className="w-full bg-slate-900 rounded-full h-1">
                                  <div className="bg-indigo-500 h-1 rounded-full transition-all duration-300" style={{ width: `${dashboardUploadProgress}%` }}></div>
                                </div>
                                <div className="flex items-center space-x-1 text-[9px] text-slate-400">
                                  <Loader2 className="animate-spin text-indigo-400" size={10} />
                                  <span>{dashboardUploadMessage}</span>
                                </div>
                              </div>
                            )}

                            {dashboardUploadStatus === "success" && (
                              <p className="text-[9.5px] text-emerald-450 mt-2 font-medium">
                                {dashboardUploadMessage}
                              </p>
                            )}

                            {dashboardUploadStatus === "error" && (
                              <p className="text-[9.5px] text-rose-455 mt-2 font-medium">
                                {dashboardUploadMessage}
                              </p>
                            )}

                            <button
                              type="submit"
                              disabled={!dashboardResumeFile || dashboardUploadStatus === "uploading"}
                              className="w-full btn-primary flex justify-center items-center space-x-2 text-[10px] py-2 mt-3 disabled:opacity-40"
                            >
                              {dashboardUploadStatus === "uploading" ? (
                                <Loader2 className="animate-spin" size={12} />
                              ) : (
                                <Upload size={12} />
                              )}
                              <span>Upload to Backend</span>
                            </button>
                          </form>
                        </div>
                      </motion.div>

                      {/* Upcoming Interview Schedule */}
                      <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl space-y-4 text-xs font-sans">
                        <div className="flex justify-between items-center border-b border-white/[0.05] pb-2.5">
                          <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest flex items-center space-x-2">
                            <Briefcase size={14} className="text-purple-400" />
                            <span>Upcoming Interview Schedule</span>
                          </h3>
                          <span className="text-[8px] bg-slate-900 border border-white/[0.04] text-slate-500 px-2 py-0.5 rounded font-bold">LIVE</span>
                        </div>

                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {upcomingInterviews.map((int) => (
                            <div key={int.id} className="p-3.5 bg-[#07090e]/60 rounded-xl border border-white/[0.03] hover:border-slate-800 transition-colors flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="font-bold text-slate-200">{int.company} &bull; {int.role}</h4>
                                <div className="flex items-center space-x-2 text-[9px] text-slate-500">
                                  <Clock size={10} />
                                  <span>{int.date}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${int.status === "Confirmed"
                                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                                  : int.status === "Scheduled"
                                    ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400"
                                    : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                                  }`}>
                                  {int.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activity Timeline */}
                      <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl space-y-4 text-xs font-sans">
                        <div className="border-b border-white/[0.05] pb-2.5">
                          <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest flex items-center space-x-2">
                            <Clock size={14} className="text-amber-400" />
                            <span>Recent Activity Timeline</span>
                          </h3>
                        </div>

                        <div className="relative border-l border-white/[0.06] pl-6 space-y-4 py-1.5 ml-1.5 text-xs">

                          {/* Item 1 */}
                          <div className="relative">
                            <span className="absolute -left-[30px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                            </span>
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-200">Mock Interview evaluated successfully</p>
                              <p className="text-[9.5px] text-slate-500 leading-normal">Completed Technical segment for Google target role.</p>
                              <span className="text-[8px] text-slate-550 block font-semibold mt-1">10 mins ago</span>
                            </div>
                          </div>

                          {/* Item 2 */}
                          <div className="relative">
                            <span className="absolute -left-[30px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-emerald-500"></span>
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-200">Uploaded Resume_v2.pdf</p>
                              <p className="text-[9.5px] text-slate-500 leading-normal">ATS audit triggered score upgrade to 82/100.</p>
                              <span className="text-[8px] text-slate-550 block font-semibold mt-1">2 hours ago</span>
                            </div>
                          </div>

                          {/* Item 3 */}
                          <div className="relative">
                            <span className="absolute -left-[30px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-amber-500"></span>
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-200">Roadmap Milestone Completed</p>
                              <p className="text-[9.5px] text-slate-500 leading-normal">Checked week 2 task: Implement dynamic programming matrices.</p>
                              <span className="text-[8px] text-slate-550 block font-semibold mt-1">Yesterday</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Consistency Heatmap */}
                    <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-white/[0.05] pb-2.5">
                        <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest flex items-center space-x-2">
                          <CheckCircle2 size={14} className="text-emerald-450" />
                          <span>Consistency Grid Heatmap</span>
                        </h3>
                        <span className="text-[8px] text-slate-555 uppercase tracking-widest font-bold font-mono">Last 28 Days</span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1 justify-between">
                        {activityGrid.map((act) => (
                          <div
                            key={act.day}
                            title={`Day ${act.day}: ${act.active ? "Activity logged" : "No updates"}`}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold border transition-all ${act.active
                              ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400 shadow-md"
                              : "bg-slate-900/40 border-white/[0.04] text-slate-650"
                              }`}
                          >
                            {act.day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tab 2: Resume Analyzer */}
              {activeTab === "resume" && (
                <div className="space-y-8 animate-float">
                  <div>
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                      AI Resume Analyzer
                    </h2>
                    <p className="text-slate-455 text-sm mt-1 leading-relaxed">
                      Upload your resume PDF to let Gemini inspect alignment against engineering roles.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/[0.05] pb-3 flex items-center space-x-2">
                        <Upload size={16} className="text-indigo-400" />
                        <span>Source File</span>
                      </h3>

                      <form onSubmit={handleResumeUpload} className="space-y-4">
                        <div className="border border-dashed border-white/[0.08] hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#07090e]/30">
                          <Upload size={28} className="text-slate-500 mb-2" />
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                            className="hidden"
                            id="resume-file-input"
                          />
                          <label htmlFor="resume-file-input" className="text-[11px] text-slate-455 font-bold cursor-pointer text-center select-none uppercase tracking-wide">
                            {resumeFile ? resumeFile.name : "Click to select PDF, DOC, DOCX"}
                          </label>
                        </div>
                        <button type="submit" disabled={!resumeFile} className="w-full btn-primary flex justify-center items-center space-x-2 text-xs py-2.5">
                          <Upload size={14} />
                          <span>Upload Resume</span>
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl">
                      <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/[0.05] pb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-emerald-400" />
                          <span>Evaluation Scorecard</span>
                        </div>
                        {resumeResult && (
                          <button
                            onClick={() => handleDownloadReport(resumeResult.resumeId)}
                            className="flex items-center space-x-1.5 text-[10px] bg-slate-900 border border-white/[0.06] hover:bg-slate-850 text-white font-bold px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider"
                          >
                            <Download size={12} />
                            <span>Download Audit</span>
                          </button>
                        )}
                      </h3>

                      {loading && !resumeResult ? (
                        <div className="mt-6 space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 bg-[#07090e]/60 p-4 rounded-xl border border-white/[0.03] gap-4 animate-pulse">
                            <Skeleton className="w-20 h-14" />
                            <Skeleton className="w-20 h-14" />
                            <div className="flex-1 grid grid-cols-4 gap-4 pl-4 border-l border-white/[0.04]">
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
                        <div className="mt-6 space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 bg-[#07090e]/60 p-4 rounded-xl border border-white/[0.03] gap-4">
                            <div className="flex items-center space-x-4">
                              <div className="text-center p-3 bg-slate-900/60 rounded-xl border border-white/[0.03] w-20">
                                <div className="text-xl font-extrabold text-indigo-400">{resumeResult.overallScore}</div>
                                <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mt-1">Overall</div>
                              </div>
                              <div className="text-center p-3 bg-slate-900/60 rounded-xl border border-white/[0.03] w-20">
                                <div className="text-xl font-extrabold text-emerald-450">{resumeResult.atsScore || 70}</div>
                                <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mt-1">ATS Score</div>
                              </div>
                            </div>
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 border-l border-white/[0.04] pl-6">
                              <div>
                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Impact</span>
                                <p className="text-xs font-bold text-slate-200 mt-0.5">{resumeResult.metrics.impact}%</p>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Structure</span>
                                <p className="text-xs font-bold text-slate-200 mt-0.5">{resumeResult.metrics.structure}%</p>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Brevity</span>
                                <p className="text-xs font-bold text-slate-200 mt-0.5">{resumeResult.metrics.brevity}%</p>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Grammar</span>
                                <p className="text-xs font-bold text-slate-200 mt-0.5">{resumeResult.metrics.grammar}%</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 font-sans text-xs">
                            <div>
                              <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Key Strengths</h4>
                              <ul className="list-disc list-inside text-slate-350 space-y-1 pl-1">
                                {resumeResult.feedback.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Areas for Improvement</h4>
                              <ul className="list-disc list-inside text-slate-350 space-y-1 pl-1">
                                {resumeResult.feedback.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
                              </ul>
                            </div>

                            {resumeResult.feedback.grammarSuggestions && resumeResult.feedback.grammarSuggestions.length > 0 && (
                              <div>
                                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Grammar & Phrasing Suggestions</h4>
                                <ul className="list-disc list-inside text-slate-350 space-y-1 pl-1">
                                  {resumeResult.feedback.grammarSuggestions.map((g, idx) => <li key={idx}>{g}</li>)}
                                </ul>
                              </div>
                            )}

                            {resumeResult.feedback.technicalSkillSuggestions && resumeResult.feedback.technicalSkillSuggestions.length > 0 && (
                              <div>
                                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Technical Skill Recommendations</h4>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {resumeResult.feedback.technicalSkillSuggestions.map((t, idx) => (
                                    <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {resumeResult.feedback.projectSuggestions && resumeResult.feedback.projectSuggestions.length > 0 && (
                              <div>
                                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Project Enhancements</h4>
                                <ul className="list-disc list-inside text-slate-355 space-y-1.5 pl-1">
                                  {resumeResult.feedback.projectSuggestions.map((p, idx) => <li key={idx} className="leading-relaxed">{p}</li>)}
                                </ul>
                              </div>
                            )}

                            <div>
                              <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Missing Keywords ({resumeResult.feedback.keywordMatchPercentage}% Match)</h4>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {resumeResult.feedback.missingKeywords.map((kw, idx) => (
                                  <span key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-455 text-[9px] px-2 py-0.5 rounded-md font-semibold">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-12 text-center py-16 text-slate-500">
                          <BookOpen size={28} className="mx-auto text-slate-700 animate-pulse mb-3" />
                          <p className="text-xs">No analysis active. Upload and audit your resume.</p>
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
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                      AI Mock Interviewer
                    </h2>
                    <p className="text-slate-455 text-sm mt-1 leading-relaxed">
                      Tailored sessions checking verbal readiness across STAR scorecard metrics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Session setup / details sidebar */}
                    <div className="lg:col-span-1 space-y-6">

                      {!interviewSession && (
                        <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl space-y-6">
                          <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/[0.05] pb-3 flex items-center space-x-2">
                            <Play size={16} className="text-indigo-400" />
                            <span>Configure Session</span>
                          </h3>

                          <div className="space-y-4 font-sans text-xs">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Interview Format</label>
                              <div className="grid grid-cols-3 gap-2">
                                {["TECHNICAL", "HR", "DSA"].map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => setInterviewType(type)}
                                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${interviewType === type
                                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                                      : "bg-slate-900/60 border-white/[0.04] text-slate-450 hover:text-white"
                                      }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Role</label>
                              <input
                                type="text"
                                value={customRole}
                                onChange={(e) => setCustomRole(e.target.value)}
                                placeholder="e.g. Software Engineer"
                                className="w-full bg-[#07090e]/80 border border-white/[0.08] text-white text-xs px-3 py-2.5 rounded-xl outline-none focus:border-indigo-500 transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Company</label>
                              <input
                                type="text"
                                value={customCompany}
                                onChange={(e) => setCustomCompany(e.target.value)}
                                placeholder="e.g. Stripe"
                                className="w-full bg-[#07090e]/80 border border-white/[0.08] text-white text-xs px-3 py-2.5 rounded-xl outline-none focus:border-indigo-500 transition-colors"
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

                      <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/[0.05] pb-3 flex items-center space-x-2">
                          <Clock size={16} className="text-amber-400" />
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
                                className="bg-[#07090e]/60 border border-white/[0.04] hover:border-indigo-500/35 p-3 rounded-xl flex items-center justify-between cursor-pointer group transition-all"
                              >
                                <div className="overflow-hidden pr-2">
                                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
                                    {hist.company} • {hist.role}
                                  </h4>
                                  <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1 block font-bold">
                                    {hist.interviewType || "TECHNICAL"} • {hist.status}
                                  </span>
                                </div>
                                {hist.evaluation && (
                                  <span className="text-xs font-extrabold text-indigo-400 shrink-0">
                                    {hist.evaluation.overallScore}%
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-550 text-center py-4">No past sessions found.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Chat session workspace panel */}
                    <div className="lg:col-span-2 bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl flex flex-col min-h-[450px] justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/[0.05] pb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquareCode size={16} className="text-purple-400" />
                          <span>Panel Dialogue</span>
                        </div>
                        {interviewSession && (
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-mono text-amber-455 bg-[#07090e] border border-white/[0.04] px-2 py-0.5 rounded">
                              Time: {Math.floor(interviewDuration / 60).toString().padStart(2, '0')}:{(interviewDuration % 60).toString().padStart(2, '0')}
                            </span>
                            <span className="text-[9px] font-mono text-indigo-400 bg-[#07090e] border border-white/[0.04] px-2 py-0.5 rounded">
                              Turn: {interviewSession.history.length + 1} / 5
                            </span>
                            <button
                              onClick={handleCancelInterview}
                              className="text-[9px] bg-rose-500/10 border border-rose-500/25 text-rose-455 hover:bg-rose-500/20 px-2 py-0.5 rounded transition-colors uppercase font-bold"
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
                                <p className="font-bold text-indigo-400 flex items-center space-x-1">
                                  <ChevronRight size={12} />
                                  <span>Interviewer: {turn.question}</span>
                                </p>
                                <p className="text-slate-355 bg-[#07090e]/60 p-3 rounded-xl border border-white/[0.03] leading-relaxed">
                                  Your Answer: {turn.answer}
                                </p>
                              </div>
                            ))}

                            {/* Active Question banner */}
                            <div className="bg-[#07090e]/80 border border-indigo-500/20 p-4 rounded-xl space-y-1 shadow-lg shadow-indigo-500/5">
                              <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                                ACTIVE QUESTION
                              </span>
                              <p className="font-semibold text-slate-200 mt-1.5 leading-relaxed">
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
                              className="flex-1 bg-[#07090e]/80 border border-white/[0.08] hover:border-slate-700 focus:border-indigo-500 text-white text-xs px-3.5 py-3 rounded-xl outline-none"
                            />
                            <button type="submit" className="btn-primary flex items-center justify-center p-3 rounded-xl">
                              <Send size={15} />
                            </button>
                          </form>
                        </div>
                      ) : interviewResult ? (
                        <div className="mt-6 space-y-6 font-sans text-xs">

                          <div className="flex items-center space-x-6 bg-[#07090e]/60 p-4 rounded-xl border border-white/[0.03]">
                            <div className="text-center">
                              <div className="text-2xl font-extrabold text-indigo-400">{interviewResult.overallScore}%</div>
                              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold block mt-1">Score</span>
                            </div>
                            <div className="flex-1 text-slate-355 pl-6 border-l border-white/[0.04] leading-relaxed">
                              {interviewResult.overallFeedback}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">STAR Scorecard breakdown</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                              {Object.entries(interviewResult.starFrameworkScore).map(([step, val]) => (
                                <div key={step} className="bg-slate-900/60 p-4 rounded-xl border border-white/[0.03] text-center shadow-md">
                                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest block">{step}</span>
                                  <p className="text-lg font-black text-white mt-1">{val}%</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                            <button
                              onClick={() => setInterviewResult(null)}
                              className="btn-primary text-xs"
                            >
                              Start New Session
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-12 text-center py-16 text-slate-500">
                          <MessageSquareCode size={28} className="mx-auto text-slate-700 animate-pulse mb-3" />
                          <p className="text-xs">Configure your parameters on the left and start the AI session.</p>
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
                        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                          DSA Progress Tracker
                        </h2>
                        <p className="text-slate-455 text-sm mt-1 leading-relaxed">
                          Progress tracking sheet map. Solve coding sheets directly from standard patterns.
                        </p>
                      </div>

                      {userProfile?.dsaStreak > 0 && (
                        <div className="border border-orange-500/20 bg-orange-500/5 text-orange-455 px-4 py-2 rounded-xl flex items-center space-x-2 shrink-0">
                          <span className="text-lg">🔥</span>
                          <div>
                            <p className="text-xs font-bold leading-none">{userProfile.dsaStreak} Day Streak</p>
                            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mt-0.5 block">Keep active daily</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress summary card */}
                    <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 font-sans text-xs">

                      <div className="flex items-center space-x-4 border-r border-white/[0.04] pr-4">
                        <CircularProgress value={percentSolved} size={70} strokeWidth={5} color="stroke-amber-500" />
                        <div>
                          <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Progress</h4>
                          <p className="text-lg font-black text-white mt-0.5">{solved} / {total}</p>
                          <span className="text-[9px] text-slate-455 mt-1 block">solved problems</span>
                        </div>
                      </div>

                      {/* Difficulty blocks with Gradient Progress tracks */}
                      <div className="flex flex-col justify-between py-1">
                        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                          <span>Easy</span>
                          <span className="text-emerald-450">{easySolved}/{easyTotal}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full" style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}></div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between py-1">
                        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                          <span>Medium</span>
                          <span className="text-amber-450">{mediumSolved}/{mediumTotal}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-1.5 rounded-full" style={{ width: `${mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0}%` }}></div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between py-1">
                        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                          <span>Hard</span>
                          <span className="text-rose-455">{hardSolved}/{hardTotal}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-rose-500 to-rose-400 h-1.5 rounded-full" style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Layout split: Left side add custom, right side table list */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-xs">

                      {/* Sidebar panel */}
                      <div className="lg:col-span-4 bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl h-fit space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/[0.05] pb-3 flex items-center space-x-2">
                          <Plus size={16} className="text-indigo-400" />
                          <span>Add Custom problem</span>
                        </h3>

                        <form onSubmit={handleAddCustomProblem} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Problem Title</label>
                            <input
                              type="text"
                              value={customProblemTitle}
                              onChange={(e) => setCustomProblemTitle(e.target.value)}
                              placeholder="e.g. Reverse Linked List"
                              required
                              className="w-full bg-[#07090e]/80 border border-white/[0.08] text-white text-xs px-3 py-2.5 rounded-xl outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Topic / Pattern</label>
                            <select
                              value={customProblemTopic}
                              onChange={(e) => setCustomProblemTopic(e.target.value)}
                              className="w-full bg-[#07090e]/80 border border-white/[0.08] text-slate-350 text-xs px-3 py-2.5 rounded-xl outline-none bg-slate-900"
                            >
                              {dsaTopics.map(t => (
                                <option key={t.topic} value={t.topic}>{t.topic}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Difficulty</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["Easy", "Medium", "Hard"].map(diff => (
                                <button
                                  key={diff}
                                  type="button"
                                  onClick={() => setCustomProblemDifficulty(diff)}
                                  className={`py-2 rounded-lg font-semibold border transition-all text-center ${customProblemDifficulty === diff
                                    ? diff === "Easy" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                      : diff === "Medium" ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                        : "bg-rose-500/10 border-rose-500/30 text-rose-405"
                                    : "bg-slate-900/60 border-white/[0.04] text-slate-450 hover:text-white"
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
                      <div className="lg:col-span-8 bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl space-y-6">
                        {dsaTopics.map((topic) => (
                          <div key={topic.topic} className="space-y-3.5">
                            <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                              <h4 className="text-sm font-bold text-white tracking-tight">{topic.topic}</h4>
                              <span className="text-[9px] text-slate-550 uppercase tracking-widest font-bold">
                                {topic.problems.filter(p => p.status === "SOLVED").length} / {topic.problems.length} solved
                              </span>
                            </div>

                            <div className="space-y-2">
                              {topic.problems.map((prob) => (
                                <div
                                  key={prob.problemId}
                                  className="flex items-center justify-between p-3.5 bg-[#07090e]/50 border border-white/[0.03] hover:border-slate-800 rounded-xl transition-all"
                                >
                                  <div className="flex items-center space-x-3.5">
                                    <input
                                      type="checkbox"
                                      checked={prob.status === "SOLVED"}
                                      onChange={() => handleToggleDSA(prob.problemId, prob.status)}
                                      className="w-4 h-4 rounded text-indigo-500 border-white/[0.08] bg-[#07090e] focus:ring-0 cursor-pointer"
                                    />
                                    <div>
                                      <h5 className={`font-semibold text-slate-205 ${prob.status === "SOLVED" ? "line-through text-slate-500" : ""}`}>
                                        {prob.title}
                                      </h5>
                                      <span className={`text-[8px] font-extrabold uppercase tracking-widest mt-1 block ${prob.difficulty === "Easy" ? "text-emerald-400"
                                        : prob.difficulty === "Medium" ? "text-amber-400"
                                          : "text-rose-455"
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
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-sans">
                      AI Coding Playground
                    </h2>
                    <p className="text-slate-455 text-sm mt-1 leading-relaxed font-sans">
                      Compile and run solutions on standard DSA challenges with continuous AI code review.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-xs">

                    {/* Problem list (3 cols) */}
                    <div className="lg:col-span-3 space-y-4">
                      <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-4 rounded-2xl shadow-xl space-y-3">
                        <h3 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest border-b border-white/[0.05] pb-2">Challenges</h3>

                        <div className="space-y-2">
                          {codingProblems.map((prob) => (
                            <div
                              key={prob.problemId}
                              onClick={() => handleSelectProblem(prob)}
                              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${selectedProblem?.problemId === prob.problemId
                                ? "bg-indigo-500/10 border-indigo-500/35 text-white"
                                : "bg-[#07090e]/40 border-white/[0.03] text-slate-405 hover:border-slate-800"
                                }`}
                            >
                              <h4 className="font-semibold text-slate-202">{prob.title}</h4>
                              <span className={`text-[8px] font-extrabold uppercase tracking-widest mt-1.5 inline-block ${prob.difficulty === "Easy" ? "text-emerald-400" : "text-amber-405"
                                }`}>
                                {prob.difficulty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedProblem && (
                        <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl space-y-3.5">
                          <h3 className="text-xs font-bold text-slate-300 border-b border-white/[0.05] pb-2">Description</h3>
                          <p className="text-slate-350 leading-relaxed whitespace-pre-line text-[11px]">
                            {selectedProblem.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Editor Workspace (6 cols) */}
                    <div className="lg:col-span-6 flex flex-col space-y-4">
                      <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl flex flex-col space-y-4">
                        <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                          <h3 className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                            <Code2 size={15} className="text-indigo-400" />
                            <span>Workspace</span>
                          </h3>

                          <div className="flex items-center space-x-2">
                            <label className="text-[9px] text-slate-555 uppercase font-bold tracking-wider">Language:</label>
                            <select
                              value={editorLanguage}
                              onChange={(e) => handleLanguageChange(e.target.value)}
                              className="bg-[#07090e] border border-white/[0.08] text-slate-300 text-[10px] px-2 py-0.5 rounded-lg focus:ring-0 outline-none"
                            >
                              <option value="python">Python</option>
                              <option value="javascript">JavaScript</option>
                              <option value="cpp">C++</option>
                            </select>
                          </div>
                        </div>

                        <div className="border border-white/[0.06] rounded-xl overflow-hidden shadow-inner bg-[#1e1e1e]">
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

                        <div className="flex justify-between items-center pt-2 border-t border-white/[0.05]">
                          <button
                            onClick={handleGetCodingHint}
                            className="text-xs text-indigo-400 hover:text-indigo-300 px-3.5 py-2 rounded-xl border border-indigo-500/20 hover:bg-indigo-500/5 transition-colors font-semibold"
                          >
                            Get AI Hint
                          </button>
                          <div className="flex space-x-3">
                            <button
                              onClick={handleRunCode}
                              className="text-xs bg-slate-900 border border-white/[0.06] hover:border-slate-800 text-slate-300 px-4 py-2 rounded-xl transition-colors flex items-center space-x-2 font-semibold"
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
                      <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl space-y-3">
                        <h3 className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                          <Terminal size={14} className="text-amber-400 animate-pulse" />
                          <span>Console Log</span>
                        </h3>
                        <div className="bg-slate-950/80 p-4 rounded-xl border border-white/[0.04] font-mono text-[10px] leading-relaxed min-h-[100px] max-h-[160px] overflow-y-auto shadow-inner">
                          {runSuccess !== null && (
                            <div className="mb-2">
                              <span className={`font-bold uppercase text-[8px] px-2 py-0.5 rounded border ${runSuccess ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20" : "bg-rose-500/10 text-rose-455 border-rose-500/20"
                                }`}>
                                {runSuccess ? "Assertions Passed" : "Assertions Failed"}
                              </span>
                            </div>
                          )}
                          {runStdout && <pre className="text-emerald-450 whitespace-pre-wrap">{runStdout}</pre>}
                          {runStderr && <pre className="text-rose-455 whitespace-pre-wrap mt-1">{runStderr}</pre>}
                          {!runStdout && !runStderr && (
                            <span className="text-slate-600">Hit 'Run Code' to execute assertions...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI review side panel (3 cols) */}
                    <div className="lg:col-span-3 space-y-6">

                      {aiReview ? (
                        <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-5 rounded-2xl shadow-xl space-y-5">
                          <div className="border-b border-white/[0.05] pb-3">
                            <h3 className="text-sm font-bold text-slate-200">AI Code Review</h3>
                            <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2.5 inline-block bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
                              Time: {aiReview.timeComplexity} • Space: {aiReview.spaceComplexity}
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-1 block">Analysis Summary</h4>
                              <p className="text-[11px] text-slate-300 leading-relaxed">{aiReview.review}</p>
                            </div>

                            <div className="border-t border-white/[0.04] pt-4">
                              <h4 className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2 block">Improvement Tips</h4>
                              <ul className="list-disc list-inside text-[11px] text-slate-350 space-y-1.5 pl-1">
                                {aiReview.refactoringTips?.map((tip, idx) => (
                                  <li key={idx} className="leading-relaxed">{tip}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl text-center py-12 text-slate-500">
                          <Sparkles size={24} className="mx-auto text-indigo-400 animate-pulse mb-3" />
                          <p className="text-xs">Submit code to generate complexity analysis and refactoring recommendations.</p>
                        </div>
                      )}

                      {/* Progressive Hints block */}
                      {codingHint && (
                        <div className="bg-[#0a0d16]/45 backdrop-blur-md border-indigo-500/10 p-5 rounded-2xl shadow-xl space-y-2.5 border border-indigo-500/20">
                          <h4 className="text-xs font-bold text-indigo-400 flex items-center space-x-1.5">
                            <Sparkles size={14} className="animate-pulse" />
                            <span>Mentor Hint</span>
                          </h4>
                          <p className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap">{codingHint}</p>
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
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                      Company Prep insights
                    </h2>
                    <p className="text-slate-455 text-sm mt-1 leading-relaxed">
                      Deep dive behavioral and technical guides customized for enterprise brands.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-xs">

                    {/* Brand grid selection */}
                    <div className="lg:col-span-4 bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl space-y-6 h-fit">
                      <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/[0.05] pb-3 flex items-center space-x-2">
                        <Sliders size={16} className="text-indigo-400" />
                        <span>Target Settings</span>
                      </h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dream Company</label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Google", "Amazon", "Microsoft", "TCS", "Infosys"].map(co => (
                              <button
                                key={co}
                                onClick={() => handleGenerateCompanyPrep(co, "Software Engineer")}
                                className="py-2 px-3 rounded-xl border border-white/[0.04] bg-[#07090e]/60 hover:border-indigo-500/35 hover:text-white transition-all text-center text-slate-350"
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
                          <div key={idx} className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl space-y-6">

                            <div className="border-b border-white/[0.05] pb-3 flex justify-between items-center">
                              <h3 className="text-lg font-bold text-white font-sans">{prep.companyName} ({prep.role})</h3>
                              <span className="bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                {prep.readinessPercentage}% Ready
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Recruitment Pipeline</h4>
                                <p className="text-slate-300 leading-relaxed">{prep.companyInsights.recruitmentProcess}</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/[0.04]">
                                <div>
                                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Behavioral / HR prompts</h4>
                                  <ul className="list-decimal list-inside space-y-1.5 text-slate-350 pl-1">
                                    {prep.companyInsights.hrQuestions.map((q, qidx) => (
                                      <li key={qidx} className="leading-relaxed">{q}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Technical / System Design prompts</h4>
                                  <ul className="list-decimal list-inside space-y-1.5 text-slate-350 pl-1">
                                    {prep.companyInsights.technicalQuestions.map((q, qidx) => (
                                      <li key={qidx} className="leading-relaxed">{q}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/[0.04]">
                                <div>
                                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Common DSA Topics</h4>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {prep.companyInsights.dsaTopics.map((topic, tidx) => (
                                      <span key={tidx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                                        {topic}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Tactical Prep Tips</h4>
                                  <ul className="list-disc list-inside space-y-1.5 text-slate-350 pl-1">
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
                        <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl text-center py-16 text-slate-500">
                          <Building2 size={28} className="mx-auto text-slate-700 animate-pulse mb-3" />
                          <p className="text-xs">No active guides. Pick a dream company target on the left settings menu.</p>
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
                      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent font-sans">
                        Personalized Study Roadmap
                      </h2>
                      <p className="text-slate-455 text-sm mt-1 leading-relaxed">
                        Weekly milestones generated by AI based on your skill levels and target constraints.
                      </p>
                    </div>

                    {loading && !roadmap ? (
                      <div className="space-y-6">
                        <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl flex justify-between items-center animate-pulse">
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <Skeleton className="h-10 w-20" />
                        </div>
                        <div className="relative border-l border-white/[0.06] ml-4 space-y-8 pl-8">
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
                      <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-8 max-w-xl mx-auto space-y-6 font-sans text-xs">
                        <div className="text-center space-y-2">
                          <Sparkles size={36} className="mx-auto text-indigo-400 animate-pulse" />
                          <h3 className="text-lg font-bold text-slate-200">No Roadmap Active</h3>
                          <p className="text-slate-455 leading-relaxed">
                            Let Gemini custom-architect a week-by-week agenda matching your dream company target.
                          </p>
                        </div>

                        <form onSubmit={handleGenerateRoadmap} className="space-y-4 pt-4 border-t border-white/[0.05]">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Role</label>
                              <input
                                type="text"
                                value={roadmapRole}
                                onChange={(e) => setRoadmapRole(e.target.value)}
                                className="w-full bg-[#07090e]/80 border border-white/[0.08] text-white text-xs px-3 py-2.5 rounded-xl outline-none"
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dream Company</label>
                              <input
                                type="text"
                                value={roadmapCompany}
                                onChange={(e) => setRoadmapCompany(e.target.value)}
                                className="w-full bg-[#07090e]/80 border border-white/[0.08] text-white text-xs px-3 py-2.5 rounded-xl outline-none"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Time Available (Weeks)</label>
                              <input
                                type="number"
                                min="1"
                                max="12"
                                value={roadmapWeeks}
                                onChange={(e) => setRoadmapWeeks(parseInt(e.target.value) || 6)}
                                className="w-full bg-[#07090e]/80 border border-white/[0.08] text-white text-xs px-3 py-2.5 rounded-xl outline-none"
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Current Skills</label>
                              <input
                                type="text"
                                value={roadmapSkills}
                                onChange={(e) => setRoadmapSkills(e.target.value)}
                                placeholder="React, Python, SQL"
                                className="w-full bg-[#07090e]/80 border border-white/[0.08] text-white text-xs px-3 py-2.5 rounded-xl outline-none"
                              />
                            </div>
                          </div>

                          <button type="submit" className="w-full btn-primary text-xs py-2.5 flex justify-center items-center space-x-2 mt-2">
                            <Sparkles size={14} />
                            <span>Generate study agenda</span>
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-8 font-sans text-xs">
                        <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl flex justify-between items-center gap-6 flex-wrap">
                          <div>
                            <h3 className="text-md font-bold text-white font-sans">
                              Adaptive Roadmap for {roadmap.targetCompany ? `${roadmap.targetCompany} (${roadmap.targetRole})` : roadmap.targetRole}
                            </h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{roadmap.durationWeeks} Weeks timeline</p>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <p className="text-xs font-bold text-indigo-400">{roadmapStats.percent}% Complete</p>
                              <span className="text-[9px] text-slate-500 font-bold block mt-0.5">{roadmapStats.completedTasks}/{roadmapStats.totalTasks} milestones met</span>
                            </div>
                            <div className="w-24 bg-slate-900 rounded-full h-1.5">
                              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${roadmapStats.percent}%` }}></div>
                            </div>
                            <button onClick={() => setRoadmap(null)} className="btn-secondary text-xs py-1.5 px-3">
                              Reset
                            </button>
                          </div>
                        </div>

                        <div className="relative border-l border-white/[0.06] ml-4 space-y-8 pl-8">
                          {roadmap.weeks.map((week) => {
                            const weekCompleted = week.tasks.length > 0 && week.tasks.every(t => t.completed);
                            return (
                              <div key={week.weekNumber} className="relative">

                                <span className={`absolute -left-11 top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 flex items-center justify-center font-bold text-[9px] transition-colors ${weekCompleted ? "border-emerald-500 text-emerald-450" : "border-indigo-500 text-indigo-400"
                                  }`}>
                                  {week.weekNumber}
                                </span>

                                <div className="bg-[#0a0d16]/45 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl shadow-xl space-y-4">
                                  <div className="flex justify-between items-start border-b border-white/[0.05] pb-3">
                                    <div>
                                      <h4 className="text-sm font-bold text-white font-sans">Week {week.weekNumber}: {week.title}</h4>
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {week.topics.map((t, idx) => (
                                          <span key={idx} className="bg-slate-900 border border-white/[0.04] text-slate-550 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                                            {t}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    {weekCompleted && (
                                      <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-455 text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                        Week Complete
                                      </span>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed">
                                    <div className="space-y-2">
                                      <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Topics & Study Guides</h5>
                                      <ul className="list-disc list-inside text-slate-350 space-y-1.5 pl-1">
                                        {week.resources.map((res, idx) => <li key={idx}>{res}</li>)}
                                      </ul>
                                    </div>

                                    <div className="space-y-3">
                                      <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Milestone Tasks</h5>
                                      <div className="space-y-2">
                                        {week.tasks.map((task) => (
                                          <div key={task.taskId} className="flex items-center space-x-3 bg-slate-900/40 p-2.5 rounded-xl border border-white/[0.03] hover:border-slate-800 transition-colors">
                                            <input
                                              type="checkbox"
                                              checked={task.completed}
                                              onChange={() => handleToggleRoadmapTask(week.weekNumber, task.taskId, task.completed)}
                                              className="w-4 h-4 rounded text-indigo-500 border-white/[0.08] bg-[#07090e] focus:ring-0 cursor-pointer"
                                            />
                                            <span className={`font-semibold ${task.completed ? "line-through text-slate-550" : "text-slate-300"}`}>
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
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow outline-none relative group"
          >
            <Sparkles size={20} className="group-hover:animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          </motion.button>
        ) : (
          /* Floating Glass Chat Box */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-80 h-96 bg-[#0a0d16]/95 border border-white/[0.08] rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden"
          >
            {/* Chat header */}
            <div className="p-3.5 border-b border-white/[0.05] bg-[#07090e]/60 flex justify-between items-center select-none shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0">
                  <Sparkles size={12} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Gemini Assistant</h4>
                  <span className="text-[8px] text-slate-500 font-semibold block uppercase tracking-widest">Active Mentor</span>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-slate-500 hover:text-white p-1 hover:bg-slate-900/50 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat message history feed */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-950/20">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed text-[10.5px] border ${msg.sender === "user"
                    ? "bg-indigo-500/10 border-indigo-500/20 text-white rounded-br-none"
                    : "bg-[#0a0d16] border-white/[0.04] text-slate-300 rounded-bl-none"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {aiTyping && (
                <div className="flex justify-start">
                  <div className="p-2.5 rounded-xl bg-[#0a0d16] border border-white/[0.04] text-slate-440 rounded-bl-none flex items-center space-x-1.5">
                    <Loader2 size={12} className="animate-spin text-indigo-400" />
                    <span>Gemini is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions list */}
            <div className="px-3.5 pb-2 pt-1 flex flex-wrap gap-1.5 shrink-0 bg-slate-950/20 border-t border-white/[0.03]">
              <button
                onClick={() => { setChatInput("Explain DSA patterns"); }}
                className="text-[8.5px] bg-[#0a0d16] hover:bg-slate-900 border border-white/[0.05] text-slate-400 px-2 py-0.5 rounded-full transition-colors font-medium"
              >
                Explain DSA patterns
              </button>
              <button
                onClick={() => { setChatInput("Audit my resume suggestions"); }}
                className="text-[8.5px] bg-[#0a0d16] hover:bg-slate-900 border border-white/[0.05] text-slate-400 px-2 py-0.5 rounded-full transition-colors font-medium"
              >
                Audit my resume
              </button>
            </div>

            {/* Chat submit input */}
            <form onSubmit={handleChatSubmit} className="p-3 border-t border-white/[0.05] bg-[#07090e]/60 flex space-x-2 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask CareerPilot..."
                className="flex-1 bg-[#07090e] border border-white/[0.08] text-white text-[10px] px-3 py-2 rounded-xl outline-none"
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
