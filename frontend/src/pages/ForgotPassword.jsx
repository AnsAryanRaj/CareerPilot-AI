import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { KeyRound, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError("Please provide your email address.");
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess("A password reset link has been dispatched to your email address.");
    } catch (err) {
      console.error(err);
      setError(
        err.code === "auth/user-not-found"
          ? "There is no account matching this email address."
          : "Failed to request password reset. Please double check the email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 filter blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#0a0d16]/65 backdrop-blur-xl border border-white/[0.06] p-8 rounded-2xl shadow-2xl relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg mx-auto glow-purple">
            <KeyRound size={22} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans">
            Reset password
          </h2>
          <p className="text-slate-450 text-xs font-sans">
            Enter your email below to dispatch a reset link.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-start space-x-3"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed font-sans">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 text-xs px-4 py-3 rounded-xl flex items-start space-x-3"
          >
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed font-sans">{success}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Work Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@university.edu"
              required
              disabled={loading}
              className="w-full bg-[#07090e]/80 border border-white/[0.08] hover:border-slate-700 focus:border-indigo-500 text-white text-xs px-3.5 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-650"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-medium text-xs py-3 rounded-xl shadow-lg shadow-indigo-500/10 flex justify-center items-center space-x-2 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <span className="font-semibold">Dispatch Reset Link</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center space-x-2 text-xs text-slate-450 hover:text-white transition-colors font-semibold uppercase tracking-wide">
            <ArrowLeft size={14} />
            <span>Back to Log In</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
