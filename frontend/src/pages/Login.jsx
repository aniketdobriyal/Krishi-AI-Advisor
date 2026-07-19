import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sprout, LogIn, Mail, Lock, AlertCircle, RefreshCw } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  // Check URL params for session expiry or Google OAuth token callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const expired = params.get("expired");
    const token = params.get("token");
    const oauthError = params.get("error");

    if (expired === "true") {
      setInfoMessage("Session expired. Please login again.");
      // Clean up the URL search params so the message goes away on refresh
      navigate("/login", { replace: true });
    } else if (oauthError) {
      setError("Google authentication failed. Please try again.");
      navigate("/login", { replace: true });
    } else if (token) {
      setLoading(true);
      loginWithToken(token)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          setError("Google login verification failed. Please try again.");
          setLoading(false);
        });
    }
  }, [location, loginWithToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(false);
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Invalid email or password.";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to the backend Passport Google OAuth route
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-fadeIn">
        <div className="p-8 space-y-6">
          
          {/* Logo Title area */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Sprout className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Mandakini Organic
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Krishi AI Advisor Platform
            </p>
          </div>

          {/* Messages Alert Banners */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/20 p-3 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-950 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Password reset functionality is under maintenance. Please contact your administrator.");
                  }}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-xs shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
              Or Connect With
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 text-xs text-slate-700 dark:text-slate-300 transition cursor-pointer flex items-center justify-center gap-2 font-semibold"
          >
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38C17,15.82,14.88,17.1,12,17.1c-3.11,0-5.74-2.11-6.68-4.96C5.07,11.4,5,10.71,5,10c0-0.71,0.07-1.4,0.32-2.14C6.26,4.96,8.89,2.85,12,2.85c1.88,0,3.46,0.69,4.68,1.82l2.02-2.02C17.38,1.44,14.93,0.75,12,0.75c-4.94,0-9.1,2.83-11.02,6.96C0.35,9.04,0.08,10.49,0.08,12c0,1.51,0.27,2.96,0.9,4.29C2.9,20.42,7.06,23.25,12,23.25c4.89,0,8.74-1.61,11.23-4.38c-0.12,0.11-2.48-1.93-2.48-1.93c-2.01,1.54-4.83,2.31-7.85,2.31c-4.09,0-7.39-2.88-8.23-6.68c0.07-0.03,8.96-0.01,9.03-0.04L21.35,11.1z" fill="#4285F4" />
                <path d="M12,23.25c4.89,0,8.74-1.61,11.23-4.38l-2.48-1.93c-2.01,1.54-4.83,2.31-7.85,2.31c-4.09,0-7.39-2.88-8.23-6.68H1.67v2.1c1.92,4.13,6.08,6.96,11,6.96z" fill="#34A853" />
                <path d="M3.77,12.56C3.52,11.82,3.45,11.11,3.45,10.4c0-0.71,0.07-1.4,0.32-2.14V6.16H1.67C1.04,7.49,0.77,8.94,0.77,10.45c0,1.51,0.27,2.96,0.9,4.29l2.1-2.18z" fill="#FBBC05" />
                <path d="M12,2.85c1.88,0,3.46,0.69,4.68,1.82l2.02-2.02C17.38,1.44,14.93,0.75,12,0.75c-4.94,0-9.1,2.83-11.02,6.96l2.1,2.15C3.92,6.18,7.22,3.3,11.31,3.3c0.23,0,10.69-0.45,10.69-0.45z" fill="#EA4335" />
              </g>
            </svg>
            Continue with Google
          </button>

          {/* Navigation link footer */}
          <div className="text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              New field supervisor?{" "}
              <Link 
                to="/register" 
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
              >
                Register here
              </Link>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
