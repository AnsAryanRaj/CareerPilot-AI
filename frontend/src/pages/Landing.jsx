import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquareCode,
  CheckSquare,
  Building2,
  GitBranch,
  BarChart3,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Menu,
  X,
  Play,
  Zap,
  Target,
  Clock,
  BookOpen,
  ArrowUpRight,
  Star,
  Check,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Landing() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState("overview");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqData = [
    {
      q: "What is CareerPilot AI?",
      a: "CareerPilot AI is an AI-powered placement preparation platform that brings resume analysis, DSA tracking, interview preparation, skill gap analysis, career roadmaps, performance analytics and LinkedIn profile analysis into one workspace."
    },
    {
      q: "How does the AI Resume Analyzer work?",
      a: "CareerPilot analyzes the resume information you provide and evaluates areas such as ATS-relevant content, structure, keywords and improvement opportunities. It then provides actionable feedback to help strengthen your resume."
    },
    {
      q: "Can CareerPilot help me prepare for DSA?",
      a: "Yes. The DSA Tracker helps you record and monitor your coding preparation, organize practice by topic and difficulty, and maintain visibility into the areas you are working on."
    },
    {
      q: "What does AI Interview Preparation provide?",
      a: "CareerPilot provides AI-assisted technical and behavioral interview practice with feedback designed to help you identify areas for improvement and strengthen your interview responses."
    },
    {
      q: "What is Skill Gap Analysis?",
      a: "Skill Gap Analysis helps identify skills and preparation areas that may need attention for your target role by comparing the information available in your CareerPilot profile with relevant role requirements."
    },
    {
      q: "How does the Career Roadmap help?",
      a: "The Career Roadmap turns identified preparation areas into a structured path so you can organize what to work on and move through your preparation step by step."
    },
    {
      q: "How does the LinkedIn Profile Analyzer use my information?",
      a: "The LinkedIn Profile Analyzer works with profile information that you provide or authorize for analysis. It can help identify areas for improvement across your professional profile, including sections such as the headline, About, experience, projects and relevant keywords."
    },
    {
      q: "Does CareerPilot guarantee placement?",
      a: "No. CareerPilot is a preparation and decision-support platform. It can help you identify improvement areas, practice important skills and track your preparation, but placement outcomes depend on many factors outside the platform."
    },
    {
      q: "What information does CareerPilot use?",
      a: "CareerPilot uses the information and activity you provide through its supported features, such as resume content, skills, DSA activity, interview preparation, career goals and authorized profile information."
    },
    {
      q: "Can I track my preparation over time?",
      a: "Yes. CareerPilot includes tracking and analytics features that help you review your preparation activity and revisit areas that need further improvement."
    }
  ];

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <Compass size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight font-sans">
                CareerPilot
              </span>
              <span className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200/80 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection("preview")}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Platform Overview
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("workflow")}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Workflow
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3.5">
            {currentUser ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4.5 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer h-[42px]"
              >
                <span>Dashboard</span>
                <ArrowRight size={16} className="shrink-0" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-blue-600 font-semibold text-sm px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4.5 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:shadow-md hover:-translate-y-0.5 inline-flex items-center justify-center h-[42px]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3"
            >
              <nav className="flex flex-col space-y-2.5 text-sm font-medium text-slate-700">
                <button
                  onClick={() => scrollToSection("preview")}
                  className="text-left py-2 hover:text-blue-600 transition-colors border-b border-slate-100"
                >
                  Platform Overview
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left py-2 hover:text-blue-600 transition-colors border-b border-slate-100"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("workflow")}
                  className="text-left py-2 hover:text-blue-600 transition-colors border-b border-slate-100"
                >
                  Workflow
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-left py-2 hover:text-blue-600 transition-colors border-b border-slate-100"
                >
                  FAQ
                </button>
              </nav>

              <div className="pt-2 flex flex-col space-y-2">
                {currentUser ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className="w-full text-center bg-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-sm"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center bg-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-sm"
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. OPENING HERO VIEWPORT */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-slate-200/60 min-h-[80vh] flex items-center">
        {/* Full-bleed environmental background image (z-0) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-right lg:bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: "url('/images/careerpilot-hero-bg.png')" }}
        />

        {/* Directional light SaaS readability overlay (strong text contrast on LEFT, background subject visible on RIGHT) */}
        <div 
          className="absolute inset-0 z-[1] bg-gradient-to-r from-white via-white/80 to-white/20 md:to-transparent pointer-events-none"
        />

        {/* Hero content & UI cards layered above background (z-10) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Hero Text & Actions */}
            <div className="lg:col-span-6 space-y-5 lg:space-y-6 text-center lg:text-left flex flex-col justify-center">
              
              {/* Top Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-blue-50/90 backdrop-blur-xs border border-blue-200/80 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs w-fit mx-auto lg:mx-0"
              >
                <GraduationCap size={15} className="text-blue-600 shrink-0" />
                <span>AI-Powered Placement Companion</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[38px] sm:text-5xl lg:text-[54px] xl:text-[58px] font-extrabold text-slate-900 tracking-tight leading-[1.08] lg:leading-[1.06]"
              >
                Your Next Career Move, <span className="text-blue-600">Smarter.</span>
              </motion.h1>

              {/* Supporting Text */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg lg:text-[19px] text-slate-600 leading-[1.58] font-normal max-w-[570px] mx-auto lg:mx-0"
              >
                AI-driven tools to help you build a stronger resume, ace interviews, track your DSA progress and get job-ready for your dream career.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3.5"
              >
                <button
                  onClick={() => navigate(currentUser ? "/dashboard" : "/signup")}
                  className="w-full sm:w-auto h-[54px] sm:h-[56px] inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-6.5 sm:px-7 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer shrink-0"
                >
                  <span>{currentUser ? "Go to Dashboard" : "Get Started Free"}</span>
                  <ArrowRight size={18} className="shrink-0" />
                </button>

                <button
                  onClick={() => scrollToSection("preview")}
                  className="w-full sm:w-auto h-[54px] sm:h-[56px] inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-slate-50 text-slate-700 font-semibold text-base px-6.5 sm:px-7 rounded-xl border border-slate-300 shadow-sm transition-all hover:border-slate-400 cursor-pointer shrink-0"
                >
                  <span>Explore Platform</span>
                  <ChevronRight size={18} className="text-slate-400 shrink-0" />
                </button>
              </motion.div>

              {/* Proof Points Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-3 flex flex-wrap items-center lg:justify-start justify-center gap-y-2.5 gap-x-6 sm:gap-x-7 text-[14px] font-medium text-slate-600"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Instant Resume ATS Scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>STAR Method Interview Practice</span>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Floating Product UI Overlay */}
            <div className="lg:col-span-6 w-full flex justify-center lg:justify-end items-end pt-4 lg:pt-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full max-w-[530px] bg-white/92 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-4 sm:p-5 space-y-4 relative z-10 lg:translate-y-2"
              >
                
                {/* Header Strip inside Card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      CP
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Placement Readiness Engine</h4>
                      <p className="text-xs text-slate-500">Target Role: Software Engineering (Configurable)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-1 rounded-md">
                    Unified Platform
                  </span>
                </div>

                {/* Score Gauge & Module Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Gauge Card */}
                  <div className="sm:col-span-5 bg-slate-50/90 p-4 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="38" stroke="#e2e8f0" strokeWidth="7" fill="transparent" />
                        <circle cx="48" cy="48" r="38" stroke="#2563eb" strokeWidth="7" fill="transparent" strokeDasharray="238" strokeDashoffset="38" strokeLinecap="round" />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xl font-extrabold text-slate-900 leading-none">Score</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Gauge</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                      Readiness Index
                    </span>
                  </div>

                  {/* 4 Core Modules List */}
                  <div className="sm:col-span-7 space-y-2.5">
                    
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <FileText size={16} className="text-blue-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">AI Resume Audit</span>
                          <span className="text-[10px] text-slate-500">ATS Match Analysis</span>
                        </div>
                      </div>
                      <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded text-[11px]">
                        Instant Feedback
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <CheckSquare size={16} className="text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">DSA Tracker</span>
                          <span className="text-[10px] text-slate-500">Problem Tracking & Streaks</span>
                        </div>
                      </div>
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded text-[11px]">
                        Topic Mastery
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <MessageSquareCode size={16} className="text-purple-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">STAR Mock Interview</span>
                          <span className="text-[10px] text-slate-500">Technical & Behavioral Practice</span>
                        </div>
                      </div>
                      <span className="font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded text-[11px]">
                        AI Evaluated
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <GitBranch size={16} className="text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">Placement Roadmap</span>
                          <span className="text-[10px] text-slate-500">Structured Preparation Milestones</span>
                        </div>
                      </div>
                      <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded text-[11px]">
                        Active Path
                      </span>
                    </div>

                  </div>

                </div>

                {/* Subtitle Annotation Banner */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-medium text-slate-500">
                  <span className="flex items-center space-x-1.5 text-blue-700 font-semibold">
                    <Sparkles size={14} className="text-blue-600" />
                    <span>Better Skills, Bigger Opportunities</span>
                  </span>
                  <button
                    onClick={() => scrollToSection("preview")}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 hover:underline cursor-pointer"
                  >
                    <span>View Command Center</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

              </motion.div>
            </div>

          </div>

          {/* Trusted Institutions / Hiring Destinations Strip */}
          <div className="mt-14 pt-8 border-t border-slate-200/80">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
              Designed For Campus & Off-Campus Recruitment Preparation
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all">
              {["Product Companies", "Tech Startups", "IT Services", "Fintech", "Consulting", "Enterprise SaaS"].map((category) => (
                <span key={category} className="text-xs font-bold text-slate-600 tracking-wider uppercase font-mono">
                  {category}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. PRODUCT PREVIEW SECTION */}
      <section id="preview" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
              Product Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Purpose-Built Placement Command Center
            </h2>
            <p className="text-slate-600 text-base">
              Everything you need to benchmark your readiness, optimize your resume, and master technical interviews.
            </p>
          </div>

          {/* Combined Image + Authentic Application UI Frame */}
          <div className="bg-slate-900 p-2 sm:p-4 rounded-2xl shadow-2xl border border-slate-800 max-w-5xl mx-auto overflow-hidden">
            
            {/* Window Top Controls */}
            <div className="bg-slate-800/80 px-4 py-3 rounded-t-xl flex items-center justify-between border-b border-slate-700/60">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-xs text-slate-400 font-mono ml-2 hidden sm:inline-block">careerpilot.app/dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                {["overview", "resume", "interview", "dsa"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePreviewTab(tab)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors uppercase tracking-wider ${
                      activePreviewTab === tab
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Application Interface Mockup Container */}
            <div className="bg-slate-950 p-4 sm:p-6 rounded-b-xl text-slate-100 font-sans">
              
              {/* Authentic Top Candidate Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900/90 rounded-xl border border-slate-800 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                    CP
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                      <span>Candidate Dashboard Preview</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono">Platform View</span>
                    </h4>
                    <p className="text-xs text-slate-400">Engineering & Tech Recruitment &bull; Target Role: Customizable</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="font-semibold text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800/60">
                    Software Engineer / SDE-1
                  </span>
                </div>
              </div>

              {/* Required 5 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                
                {/* 1. Placement Readiness */}
                <div className="bg-slate-900/70 p-4 rounded-xl border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Placement Readiness</span>
                    <TrendingUp size={14} className="text-blue-400" />
                  </div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl font-black text-white">--</span>
                    <span className="text-[10px] text-blue-400 font-semibold">Live Index</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-[10px] text-blue-300 font-medium block">Target Threshold: 85%</span>
                </div>

                {/* 2. Resume Score */}
                <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Resume Score</span>
                    <FileText size={14} className="text-indigo-400" />
                  </div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl font-black text-white">0-100</span>
                    <span className="text-xs text-slate-400">Range</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                  <span className="text-[10px] text-indigo-300 font-medium block">ATS Keyword Audit</span>
                </div>

                {/* 3. DSA Progress */}
                <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>DSA Progress</span>
                    <CheckSquare size={14} className="text-emerald-400" />
                  </div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-lg font-bold text-white">Tracked</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Streaks</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-medium block">Topic-wise Solved List</span>
                </div>

                {/* 4. Interview Readiness */}
                <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Interview Prep</span>
                    <MessageSquareCode size={14} className="text-purple-400" />
                  </div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-lg font-bold text-white">STAR</span>
                    <span className="text-[10px] text-purple-400 font-semibold">Evaluated</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <span className="text-[10px] text-purple-300 font-medium block">AI Voice/Text Sessions</span>
                </div>

                {/* 5. Skill Gap */}
                <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Skill Gap Analysis</span>
                    <Target size={14} className="text-amber-400" />
                  </div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-lg font-bold text-amber-400">Audited</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">System Design</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Docker</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-medium block">Actionable Insights</span>
                </div>

              </div>

              {/* Lower Section of Preview Interface */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* Left: Active Roadmap Milestones */}
                <div className="md:col-span-2 bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h5 className="font-bold text-slate-200 flex items-center space-x-2">
                      <GitBranch size={14} className="text-blue-400" />
                      <span>Placement Preparation Roadmap Milestones</span>
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">Structured Sequence</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-medium">Data Structures & Algorithms Core Patterns</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium">Core Module</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-blue-950/40 rounded-lg border border-blue-900/60">
                      <div className="flex items-center space-x-2.5">
                        <Clock size={16} className="text-blue-400 shrink-0" />
                        <span className="text-blue-200 font-medium">System Architecture & RESTful API Engineering</span>
                      </div>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-medium">In Progress</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/80 opacity-75">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0"></div>
                        <span className="text-slate-400">Behavioral STAR HR Interview Simulation</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Upcoming</span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Cards */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h5 className="font-bold text-slate-200 flex items-center space-x-2 border-b border-slate-800 pb-2">
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Placement Optimization</span>
                  </h5>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    CareerPilot AI evaluates your resume against target job descriptions, identifies high-frequency technical keywords, and provides actionable recommendations to maximize your ATS match rate.
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer">
                    <span>Audit Resume Now</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Eyebrow, Heading & Supporting Paragraph */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/80">
              Everything You Need for Placement Preparation
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
              One Platform. Your Complete Career Preparation.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              CareerPilot AI brings resume auditing, coding practice, mock interviews, skill gap analysis, roadmaps, performance analytics, and professional LinkedIn optimization together into one unified placement system.
            </p>
          </div>

          {/* 6 Core Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Feature 1 — AI Resume Analyzer */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 hover:-translate-y-1 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">AI Resume Analyzer</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Analyze resumes against real ATS criteria. Detect formatting errors, weak action verbs, missing technical keywords, and quantitative impact gaps.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/resume"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>Explore Module</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 2 — DSA Tracker */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 hover:-translate-y-1 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <CheckSquare size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">DSA Tracker</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Log and track DSA problems solved across arrays, trees, dynamic programming, and system design with topic mastery and active streak metrics.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/dsa"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <span>Explore Module</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 3 — AI Interview Preparation */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 hover:-translate-y-1 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs">
                  <MessageSquareCode size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">AI Interview Preparation</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Practice role-specific technical and HR interview tracks with real-time AI evaluation, STAR method answer framing, and actionable feedback.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/interview"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <span>Explore Module</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 4 — Skill Gap Analysis */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 hover:-translate-y-1 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Skill Gap Analysis</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Detect missing technical skills and keyword requirements by evaluating your current preparation baseline against target role descriptions.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/skills"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <span>Explore Module</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 5 — Career Roadmap */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 hover:-translate-y-1 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                  <GitBranch size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Career Roadmap</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Follow a structured, milestone-driven preparation path tailored to your graduation timeline, target software role, and skill baseline.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/roadmap"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <span>Explore Module</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 6 — Analytics & Performance Tracking */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200 hover:-translate-y-1 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Analytics & Performance</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Monitor genuine preparation activity, readiness index trends, and module progress metrics across your complete learning timeline.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/analytics"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <span>Explore Module</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

          </div>

          {/* Feature 7 — LinkedIn Analyzer Spotlight Card */}
          <div className="mt-8 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold font-mono uppercase tracking-wider">
                <Sparkles size={14} className="text-blue-400" />
                <span>Professional Presence Spotlight</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                LinkedIn Profile Analyzer
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Optimize your professional LinkedIn presence. Identify weak profile sections, improve your headline, About section, experience, and projects, extract role-specific technical keywords, and get recruiter-oriented suggestions based on user-provided profile data.
              </p>
            </div>

            <div className="shrink-0 relative z-10 w-full md:w-auto">
              <Link
                to="/linkedin-analyzer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer"
              >
                <span>Explore LinkedIn Analyzer</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS / WORKFLOW SECTION */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-b border-slate-200/80 scroll-mt-16">
        <div id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Eyebrow, Heading & Supporting Paragraph */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/80">
              How CareerPilot Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
              From Preparation to Placement, Step by Step.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              CareerPilot brings your resume, coding practice, interviews, skills, professional profile and career goals into one continuous preparation journey.
            </p>
          </div>

          {/* 5-Step Connected Visual Workflow Journey */}
          <div className="relative">
            
            {/* Connecting Line for Desktop (Hidden on mobile) */}
            <div className="hidden lg:block absolute top-[44px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-blue-200 via-purple-300 via-amber-300 to-emerald-300 z-0 pointer-events-none" />

            {/* 5 Connected Step Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
              
              {/* Step 01 — Build Your Profile */}
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 space-y-4 flex flex-col justify-between relative group">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
                    <FileText size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Build Your Profile
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Start with the information that defines your current career profile and preparation level — including resume, skills, DSA activity, interview history, career goals, and authorized profile data.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Phase 01</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                    Profile Baseline <ChevronRight size={12} />
                  </span>
                </div>
              </div>

              {/* Step 02 — Analyze Your Readiness */}
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 space-y-4 flex flex-col justify-between relative group">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                    <Sparkles size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Analyze Your Readiness
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Understand your current strengths, weaknesses and areas that need attention across resume ATS match, technical skill coverage, mock interview responses, and profile strength.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Phase 02</span>
                  <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                    Multi-Module Audit <ChevronRight size={12} />
                  </span>
                </div>
              </div>

              {/* Step 03 — Identify Your Gaps */}
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 space-y-4 flex flex-col justify-between relative group">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                    <Target size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    Identify Your Gaps
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    See what is missing between where you are today and where your target role requires you to be — identifying missing skills, resume keywords, DSA topics, and interview weaknesses.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Phase 03</span>
                  <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                    Gap Detection <ChevronRight size={12} />
                  </span>
                </div>
              </div>

              {/* Step 04 — Follow Your Preparation Path */}
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 space-y-4 flex flex-col justify-between relative group">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    04
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-purple-100/80 border border-purple-200 flex items-center justify-center text-purple-600 shadow-2xs">
                    <GitBranch size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Follow Your Path
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Turn your gaps into a structured preparation plan and work through the areas that matter most — completing roadmap milestones, target DSA topics, STAR interviews, and resume updates.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Phase 04</span>
                  <span className="text-purple-600 font-semibold flex items-center gap-0.5">
                    Roadmap Plan <ChevronRight size={12} />
                  </span>
                </div>
              </div>

              {/* Step 05 — Track & Improve */}
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 space-y-4 flex flex-col justify-between relative group">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    05
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                    <BarChart3 size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Track & Improve
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Track your progress, revisit weak preparation areas and continuously improve your overall placement readiness index over time.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Phase 05</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                    Placement Ready <CheckCircle2 size={12} />
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6.5. CAREERPILOT ECOSYSTEM / PRODUCT PREVIEW */}
      <section id="ecosystem" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/80 inline-block">
              Your Career Preparation, Connected
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need. One Career Preparation System.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Bring your resume, coding practice, interview preparation, skill development, career roadmap and professional profile into one connected workspace.
            </p>
          </div>

          {/* Connected Hub Product Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-8">
            
            {/* SaaS Top Window Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                </div>
                <span className="text-xs font-mono text-slate-400 pl-2 border-l border-slate-200">
                  careerpilot-workspace // product-preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Integrated Candidate System
                </span>
              </div>
            </div>

            {/* Central Product State UI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Placement Readiness</div>
                <div className="text-lg font-bold text-slate-900 flex items-center justify-between">
                  <span>Ready to Analyze</span>
                  <TrendingUp className="text-blue-500" size={18} />
                </div>
                <div className="text-xs text-slate-500 font-medium">Connect your preparation data</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Resume Analyzer</div>
                <div className="text-lg font-bold text-slate-900 flex items-center justify-between">
                  <span>Upload Resume</span>
                  <FileText className="text-blue-500" size={18} />
                </div>
                <div className="text-xs text-slate-500 font-medium">ATS format & keyword check</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">DSA Tracker</div>
                <div className="text-lg font-bold text-slate-900 flex items-center justify-between">
                  <span>Track Practice</span>
                  <CheckSquare className="text-indigo-500" size={18} />
                </div>
                <div className="text-xs text-slate-500 font-medium">Log topics & problem status</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Interview Prep</div>
                <div className="text-lg font-bold text-slate-900 flex items-center justify-between">
                  <span>Start Session</span>
                  <MessageSquareCode className="text-emerald-500" size={18} />
                </div>
                <div className="text-xs text-slate-500 font-medium">Technical & HR mock practice</div>
              </div>
            </div>

            {/* 7 Connected Modules Grid */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Connected Preparation Modules
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Unified candidate modules
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Module 1: AI Resume Analyzer */}
                <div className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                      ATS Engine
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      AI Resume Analyzer
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      Upload your resume to receive ATS format scoring, keyword gap identification, and targeted bullet-point recommendations.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Upload your resume to begin analysis</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Module 2: DSA Tracker */}
                <div className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <CheckSquare size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                      Problem Log
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      DSA Tracker
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      Organize solved coding problems by topic, difficulty, and revision status with structured practice lists.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Track your DSA preparation</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Module 3: AI Interview Preparation */}
                <div className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <MessageSquareCode size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      Voice & Speech
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      AI Interview Prep
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      Practice role-specific technical and behavioral mock interviews with speech feedback and STAR method structure.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Start an AI interview session</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Module 4: Skill Gap Analysis */}
                <div className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Target size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                      Role Alignment
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Skill Gap Analysis
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      Compare your current technical skills against target job descriptions to identify missing competencies.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Compare skills with target roles</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Module 5: Career Roadmap */}
                <div className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <GitBranch size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                      Guided Path
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      Career Roadmap
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      Follow structured, step-by-step learning paths tailored to your target domain with curated study milestones.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Build your preparation path</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Module 6: Analytics & Tracking */}
                <div className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <BarChart3 size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
                      Readiness Metrics
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      Analytics & Tracking
                    </h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      View your preparation activity history, skill growth trends, and overall readiness progress over time.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Your activity will appear here</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Module 7: LinkedIn Profile Analyzer */}
                <div className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all space-y-3 md:col-span-2 lg:col-span-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                            LinkedIn Profile Analyzer
                          </h4>
                          <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
                            Recruiter Visibility
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs mt-0.5">
                          Analyze user-provided or authorized profile information to optimize headline structure, summary impact, and skills for recruiter searches.
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 sm:pt-0 sm:border-l sm:border-slate-100 sm:pl-4 flex items-center gap-2 text-xs text-sky-700 font-semibold shrink-0">
                      <span>Analyze user-provided profile data</span>
                      <ChevronRight size={14} className="text-sky-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Platform Navigation CTA */}
          <div className="text-center space-y-4">
            <button
              onClick={() => navigate(currentUser ? "/dashboard" : "/signup")}
              className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all text-sm sm:text-base cursor-pointer"
            >
              <span>Explore the Platform</span>
              <ArrowRight size={18} />
            </button>
            <p className="text-xs text-slate-500">
              Access all 7 modules seamlessly in one unified candidate portal.
            </p>
          </div>

        </div>
      </section>

      {/* 7. COMPLETE PLACEMENT JOURNEY */}
      <section id="journey" className="py-16 md:py-24 bg-white border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/80 inline-block">
              Built for the Complete Placement Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Prepare Smarter Across Every Stage of Your Career.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              CareerPilot brings the key parts of placement preparation together so you can understand where you stand, identify what needs improvement, and keep working toward your target role.
            </p>
          </div>

          {/* Horizontal Connected Preparation Path Motif */}
          <div className="bg-slate-50/80 p-4 sm:p-6 rounded-2xl border border-slate-200/80">
            <div className="text-center mb-4">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
                End-to-End Preparation Sequence
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm">
                <FileText size={14} className="text-blue-600" />
                <span>Resume</span>
              </span>
              <ChevronRight size={14} className="text-slate-400 hidden sm:inline-block" />

              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm">
                <Target size={14} className="text-indigo-600" />
                <span>Skills</span>
              </span>
              <ChevronRight size={14} className="text-slate-400 hidden sm:inline-block" />

              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm">
                <CheckSquare size={14} className="text-emerald-600" />
                <span>DSA</span>
              </span>
              <ChevronRight size={14} className="text-slate-400 hidden sm:inline-block" />

              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm">
                <MessageSquareCode size={14} className="text-amber-600" />
                <span>Interviews</span>
              </span>
              <ChevronRight size={14} className="text-slate-400 hidden sm:inline-block" />

              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm">
                <Sparkles size={14} className="text-sky-600" />
                <span>Profile</span>
              </span>
              <ChevronRight size={14} className="text-slate-400 hidden sm:inline-block" />

              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm">
                <GitBranch size={14} className="text-purple-600" />
                <span>Roadmap</span>
              </span>
            </div>
          </div>

          {/* 6 Preparation Concept Value Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Concept 01 — Build a Stronger Resume */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <FileText size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    01
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Build a Stronger Resume
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    Analyze your resume, identify improvement areas and strengthen ATS-relevant content.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>ATS Relevance & Quality</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Concept 02 — Strengthen Your Skills */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <Target size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    02
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Strengthen Your Skills
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    Identify skill gaps and focus your preparation on the capabilities relevant to your target roles.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Target Role Alignment</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Concept 03 — Practice DSA Consistently */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <CheckSquare size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    03
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Practice DSA Consistently
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    Track your coding preparation and keep visibility into the topics you are working through.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Topic Practice & Review</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Concept 04 — Improve Interview Performance */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <MessageSquareCode size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    04
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Improve Interview Performance
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    Practice technical and behavioral interviews and use AI feedback to identify areas to improve.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>STAR Speech Feedback</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Concept 05 — Build Your Professional Profile */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    05
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Build Your Professional Profile
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    Improve your LinkedIn presence using user-provided or authorized profile information.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Recruiter Visibility</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Concept 06 — Follow a Structured Path */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <GitBranch size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    06
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Follow a Structured Path
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    Turn identified gaps into a structured preparation journey through your career roadmap.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Milestone Roadmap</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7.5. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* Header & Context (Left Column on Desktop) */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/80 inline-block">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Questions Before You Get Started?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Here are some common questions about how CareerPilot works and what you can expect from the platform.
              </p>

              <div className="pt-4 hidden lg:block">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Need more details?</h4>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      Explore our feature modules or create a free account to test the placement preparation workspace.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessible Accordion (Right Column on Desktop) */}
            <div className="lg:col-span-8 space-y-3">
              {faqData.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      id={`faq-question-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base cursor-pointer hover:bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-1"
                    >
                      <span className="pr-2">{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-blue-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-answer-${index}`}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        className="px-5 pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3"
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION (CTA) */}
      <section id="final-cta" className="py-16 md:py-24 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-100 border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-2xl border border-blue-100 shadow-xl p-8 sm:p-12 lg:p-16 max-w-5xl mx-auto text-center space-y-6">
            
            {/* Eyebrow Badge with Icon */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/80">
                <Sparkles size={14} className="text-blue-500" />
                <span>Ready to Prepare Smarter?</span>
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto">
              Take the Next Step Toward Your Career Goals.
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Bring your resume, DSA practice, interview preparation, skills and career planning together in one place with CareerPilot AI.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              
              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => navigate(currentUser ? "/dashboard" : "/signup")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span>{currentUser ? "Go to Dashboard" : "Get Started Free"}</span>
                <ArrowRight size={18} />
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-sm hover:shadow transition-all hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <span>Explore Platform</span>
                <ChevronRight size={18} />
              </button>

            </div>

            {/* Factual Subtext */}
            <p className="text-xs text-slate-500 pt-2 font-medium">
              Free candidate access &bull; Connected placement preparation workspace
            </p>

          </div>

        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-8 border-b border-slate-800">
            
            {/* Brand column */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Compass size={18} />
                </div>
                <span className="text-base font-bold text-white tracking-tight">CareerPilot AI</span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                A practical, production-ready career and placement platform helping engineering students build ATS resumes, master technical interviews, and track placement readiness.
              </p>
            </div>

            {/* Product Links */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Product</h4>
              <ul className="space-y-1.5 font-normal">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">Resume Analyzer</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">STAR Mock Interview</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">DSA Tracker</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">Placement Roadmap</button></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Resources</h4>
              <ul className="space-y-1.5 font-normal">
                <li><button onClick={() => scrollToSection("how-it-works")} className="hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={() => scrollToSection("workflow")} className="hover:text-white transition-colors">Placement Workflow</button></li>
                <li><button onClick={() => scrollToSection("journey")} className="hover:text-white transition-colors">Placement Journey</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Account</h4>
              <ul className="space-y-1.5 font-normal">
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Register Free</Link></li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>&copy; {new Date().getFullYear()} CareerPilot AI. All rights reserved. Practical tools for student placement success.</p>
            <div className="flex items-center space-x-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Support</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
