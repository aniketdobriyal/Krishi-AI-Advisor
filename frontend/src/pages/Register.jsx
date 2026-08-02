import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sprout, User, Mail, Lock, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import loginBg from "../assets/login-bg.png";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await register(name, email, password);
      setSuccess(true);
      // Automatically redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Registration failed. Email might already be in use.";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4 transition-colors duration-200"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]" />
      
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-fadeIn relative z-10">
        <div className="p-8 space-y-6">
          
          {/* Logo Title area */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Sprout className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Register as a field supervisor for Mandakini Organic
            </p>
          </div>

          {/* Success / Error Banners */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/20 p-3 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-xs text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>Registration successful! Redirecting to login...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Suresh Upadhyay"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                  disabled={success}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mandakiniorganic.org"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                  disabled={success}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (Min 6 characters)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                  disabled={success}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-xs shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Navigation link footer */}
          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
              >
                Sign In
              </Link>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
