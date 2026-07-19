import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RefreshCw } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Verifying agricultural supervisor credentials...
        </span>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
