import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Sparkles, Loader2, AlertCircle, Terminal, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      return setError("Please fill in all registration fields.");
    }
    if (password.length < 6) {
      return setError("Password should be at least 6 characters.");
    }
    setError("");
    setLoading(true);
    try {
      await signup(email, password, fullName);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.code === "auth/email-already-in-use"
          ? "The email address is already registered."
          : "Failed to create an account. Please verify details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Google Registration was cancelled or failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f8fafc] flex font-sans overflow-hidden">
      
      {/* LEFT PANEL: SaaS Hero Showcase (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#090b11] border-r border-slate-900 flex-col justify-between p-12 overflow-hidden select-none">
        
        {/* Glow meshes */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 filter blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-[450px] h-[450px] rounded-full bg-purple-600/10 filter blur-[150px] pointer-events-none"></div>
        <div className="absolute -bottom-20 left-10 w-80 h-80 rounded-full bg-blue-600/10 filter blur-[100px] pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-500/20">
            CP
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight text-white font-sans">
              CareerPilot <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">AI</span>
            </h1>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold block -mt-1">
              Enterprise Prep Engine
            </span>
          </div>
        </div>

        {/* Dynamic Graphic Showcase */}
        <div className="z-10 my-auto max-w-lg space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles size={10} className="mr-1.5 animate-pulse" />
              Intelligence Suite v2.0
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white font-sans">
              Build your custom <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                placement path today
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              A comprehensive preparation engine powered by Gemini AI, customized roadmap trackers, and local sandboxed playground runtimes.
            </p>
          </div>

          {/* Floating UI Elements */}
          <div className="space-y-4 pt-4">
            
            {/* Element 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center space-x-4 max-w-sm shadow-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200">Personalized Roadmap</p>
                <p className="text-[10px] text-slate-450 truncate">Weekly tasks, resource lists, and progress scores.</p>
              </div>
            </motion.div>

            {/* Element 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center space-x-4 max-w-sm ml-8 shadow-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-405 font-bold text-xs shrink-0">
                STAR
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200">Mock Interview Scorecards</p>
                <p className="text-[10px] text-slate-450 truncate">STAR frameworks Situation, Task, Action feedback.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Left footer */}
        <div className="text-[11px] text-slate-600 z-10 flex items-center space-x-4">
          <span>&copy; 2026 CareerPilot AI Inc.</span>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-450">Security Standards</a>
        </div>
      </div>

      {/* RIGHT PANEL: SaaS Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        
        {/* Glow background for mobile */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-indigo-600/5 filter blur-[100px] pointer-events-none lg:hidden"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-[#0a0d16]/65 backdrop-blur-xl border border-white/[0.06] p-8 rounded-2xl shadow-2xl relative z-10 space-y-6"
        >
          {/* Mobile Header Logo */}
          <div className="flex flex-col items-center text-center space-y-2 lg:items-start lg:text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg lg:hidden">
              CP
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white font-sans">
              Create an account
            </h3>
            <p className="text-slate-400 text-xs font-sans">
              Fill in the parameters below to launch your session.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs px-4 py-3.5 rounded-xl flex items-start space-x-3"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span className="leading-relaxed font-sans">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Full Username
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                required
                disabled={loading}
                className="w-full bg-[#07090e]/80 border border-white/[0.08] hover:border-slate-700 focus:border-indigo-500 text-white text-xs px-3.5 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-650"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Work Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                required
                disabled={loading}
                className="w-full bg-[#07090e]/80 border border-white/[0.08] hover:border-slate-700 focus:border-indigo-500 text-white text-xs px-3.5 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-650"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                disabled={loading}
                className="w-full bg-[#07090e]/80 border border-white/[0.08] hover:border-slate-700 focus:border-indigo-500 text-white text-xs px-3.5 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-650"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-medium text-xs py-3 rounded-xl shadow-lg shadow-indigo-500/10 flex justify-center items-center space-x-2 transition-all active:scale-[0.98] mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  <UserPlus size={14} />
                  <span className="font-semibold">Generate Account</span>
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-900"></div>
            <span className="flex-shrink mx-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Or registration via
            </span>
            <div className="flex-grow border-t border-slate-900"></div>
          </div>

          {/* Social login */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-slate-900/40 hover:bg-slate-900/80 border border-white/[0.06] hover:border-white/[0.1] text-slate-200 text-xs py-3 rounded-xl flex justify-center items-center space-x-2.5 transition-colors font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-semibold">Sign up with Google</span>
          </button>

          {/* Footnotes */}
          <p className="text-center text-xs text-slate-500 mt-2 font-sans">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-305 hover:underline font-semibold transition-colors ml-1">
              Log in here <ChevronRight size={12} className="inline -mt-0.5" />
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
