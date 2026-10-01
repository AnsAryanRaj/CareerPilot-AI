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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-xl relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shadow-sm mx-auto">
            <KeyRound size={22} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
            Reset password
          </h2>
          <p className="text-slate-500 text-xs font-sans">
            Enter your email below to receive a password reset link.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-start space-x-3"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-relaxed font-sans">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-4 py-3 rounded-xl flex items-start space-x-3"
          >
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-relaxed font-sans">{success}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Work Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@university.edu"
              required
              disabled={loading}
              className="w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 text-xs px-3.5 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-3 rounded-xl shadow-sm flex justify-center items-center space-x-2 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <span className="font-semibold">Send Reset Link</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-blue-600 transition-colors font-semibold uppercase tracking-wide">
            <ArrowLeft size={14} />
            <span>Back to Log In</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
