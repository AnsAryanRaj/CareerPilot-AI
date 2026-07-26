import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Sparkles, Loader2, AlertCircle, Terminal, CheckCircle2, ChevronRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError("Please fill in all email and password fields.");
    }
    setError("");
    setLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
          ? "Invalid email or password. Please verify and try again."
          : "An error occurred during authentication. Please try again."
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
      setError("Google Sign-In was cancelled or failed to authenticate.");
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
              The professional suite to <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                accelerate engineering offers
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
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                88%
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200">ATS Resume Evaluation</p>
                <p className="text-[10px] text-slate-450 truncate">Gemini audit reports generated successfully.</p>
              </div>
            </motion.div>

            {/* Element 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center space-x-4 max-w-sm ml-8 shadow-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Terminal size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200">Local Sandbox Execution</p>
                <p className="text-[10px] text-slate-450 truncate">Console validations executing assertions live.</p>
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

      {/* RIGHT PANEL: SaaS Login Form */}
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
              Sign in to platform
            </h3>
            <p className="text-slate-400 text-xs font-sans">
              Enter your registration details below to start prepping.
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
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Security Password
                </label>
                <Link to="/forgot-password" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold tracking-wide uppercase transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full bg-[#07090e]/80 border border-white/[0.08] hover:border-slate-700 focus:border-indigo-500 text-white text-xs px-3.5 py-3 pr-10 rounded-xl outline-none transition-colors placeholder:text-slate-650"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-505 hover:text-slate-300 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 select-none pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border border-white/[0.08] bg-[#07090e] text-indigo-500 focus:ring-0 outline-none cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-[10px] text-slate-400 font-medium uppercase tracking-wider cursor-pointer">
                Remember Me
              </label>
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
                  <LogIn size={14} />
                  <span className="font-semibold">Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-900"></div>
            <span className="flex-shrink mx-4 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Or Authentication via
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
            <span className="font-semibold">Sign in with Google</span>
          </button>

          {/* Footnotes */}
          <p className="text-center text-xs text-slate-500 mt-2 font-sans">
            Need an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-305 hover:underline font-semibold transition-colors ml-1">
              Create an account <ChevronRight size={12} className="inline -mt-0.5" />
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
