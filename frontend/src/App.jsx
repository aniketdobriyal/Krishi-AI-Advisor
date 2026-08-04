import { useState, useEffect } from "react";
import { 
  LayoutDashboard, MessageSquare, ShieldAlert, Sprout, Leaf,
  History, Settings, Sun, Moon, Bell, Search, 
  Menu, X, ChevronDown, LogOut, RefreshCw, AlertCircle
} from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { TRANSLATIONS } from "./data";
import DashboardOverview from "./components/DashboardOverview";
import ChatAssistant from "./components/ChatAssistant";
import Guides from "./components/Guides";
import ChatHistoryView from "./components/ChatHistoryView";
import SettingsView from "./components/SettingsView";
import API from "./api";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainAppContent />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function MainAppContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Global States
  const [view, setView] = useState("dashboard"); // dashboard, chat, disease, pest, post-harvest, history, settings
  const [language, setLanguage] = useState(() => localStorage.getItem("crop_advisor_lang") || "en");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("crop_advisor_dark") === "true");
  
  const [apiKey, setApiKey] = useState("");
  const [temp, setTemp] = useState(() => {
    const t = localStorage.getItem("crop_advisor_temp");
    return t ? parseFloat(t) : 0.2;
  });

  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatQuery, setChatQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Initialize application and fetch database values
  const initApp = async () => {
    try {
      setLoadingHistory(true);
      setApiError(null);
      
      // Fetch server key configuration
      const configRes = await API.get("/config");
      if (configRes.data.hasGeminiKey) {
        setApiKey("configured");
      } else {
        setApiKey("");
      }

      // Fetch saved sessions
      const historyRes = await API.get("/history");
      setHistoryList(historyRes.data);
    } catch (err) {
      console.error("Initialization error:", err);
      const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const apiBaseURL = rawBaseURL.replace(/\/$/, "");
      setApiError(`Could not connect to the backend server. Please verify it is running on ${apiBaseURL}.`);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initApp();
  }, []);

  // Apply dark mode on state change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("crop_advisor_dark", darkMode.toString());
  }, [darkMode]);

  // Sync language selection to localStorage
  useEffect(() => {
    localStorage.setItem("crop_advisor_lang", language);
  }, [language]);

  // Handle active translation dictionary
  const t = TRANSLATIONS[language];

  // Dynamic statistic metrics based on saved and active chats
  const getStats = () => {
    const stats = {
      total: 0,
      disease: 0,
      pest: 0,
      postHarvest: 0,
      saved: historyList.length
    };

    const countCategories = (text) => {
      const q = text.toLowerCase();
      stats.total++;
      if (q.includes("blight") || q.includes("wilt") || q.includes("spot") || q.includes("rust") || q.includes("mildew") || q.includes("झुलसा") || q.includes("म्लानि") || q.includes("धब्बा") || q.includes("रस्ट") || q.includes("आसिता")) {
        stats.disease++;
      } else if (q.includes("aphid") || q.includes("whitefl") || q.includes("borer") || q.includes("armyworm") || q.includes("thrip") || q.includes("माहू") || q.includes("मक्खी") || q.includes("छेदक") || q.includes("कीट") || q.includes("थ्रिप्स")) {
        stats.pest++;
      } else if (q.includes("storage") || q.includes("harvest") || q.includes("packag") || q.includes("clean") || q.includes("भंडारण") || q.includes("कटाई") || q.includes("पैकेजिंग")) {
        stats.postHarvest++;
      } else {
        // default split
        stats.disease++;
      }
    };

    historyList.forEach(item => {
      item.messages.filter(m => m.sender === "user").forEach(m => countCategories(m.text));
    });

    // Only count active messages if this is a new unsaved chat (to avoid double-counting)
    if (!activeChatId) {
      messages.filter(m => m.sender === "user").forEach(m => countCategories(m.text));
    }

    return stats;
  };

  const handleSaveConversation = async () => {
    if (messages.length === 0) return;
    
    // Find first user message for title
    const firstUserMsg = messages.find(m => m.sender === "user")?.text || "Crop Advisor Chat";
    const titleEn = `Session: ${firstUserMsg.slice(0, 30)}...`;
    const titleHi = `सत्र: ${firstUserMsg.slice(0, 30)}...`;

    const payload = {
      id: activeChatId,
      titleEn,
      titleHi,
      messages
    };

    try {
      const response = await API.post("/history", payload);
      const savedSession = response.data;
      
      if (activeChatId) {
        setHistoryList(prev => prev.map(h => h.id === activeChatId ? savedSession : h));
      } else {
        setHistoryList(prev => [savedSession, ...prev]);
        setActiveChatId(savedSession.id);
      }
      alert(t.chatSavedSuccess);
    } catch (err) {
      console.error("Failed to save chat:", err);
      alert(language === "en" ? "Failed to save conversation on backend." : "बातचीत बैकएंड पर सहेजने में विफल रही।");
    }
  };

  const onLoadChat = (chat) => {
    setMessages(chat.messages);
    setActiveChatId(chat.id);
    setView("chat");
  };

  const onDeleteChat = async (chatId) => {
    try {
      await API.delete(`/history/${chatId}`);
      setHistoryList(prev => prev.filter(h => h.id !== chatId));

      // If the active chat is deleted, clear current viewport
      if (chatId === activeChatId) {
        setMessages([]);
        setActiveChatId(null);
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
      alert(language === "en" ? "Failed to delete conversation on backend." : "बातचीत बैकएंड से हटाने में विफल रही।");
    }
  };

  // Nav items configuration
  const navigationItems = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
    { id: "chat", label: t.aiChatAssistant, icon: MessageSquare },
    { id: "disease", label: t.diseaseGuide, icon: ShieldAlert },
    { id: "pest", label: t.pestManagement, icon: Sprout },
    { id: "post-harvest", label: t.postHarvestGuide, icon: Leaf },
    { id: "history", label: t.chatHistory, icon: History },
    { id: "settings", label: t.settings, icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200 overflow-x-hidden max-w-full">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Logo Brand area */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-900">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="h-4.5 w-4.5" />
              </div>
              <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-display">
                Mandakini Organic
              </span>
            </div>
            {/* Mobile close sidebar button */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                    isActive 
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-900">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-900/60 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase overflow-hidden flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user?.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "MO"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-300 truncate">
                {user?.name || "S. Upadhyay"}
              </span>
              <span className="block text-[9px] text-slate-400 dark:text-slate-500 truncate">
                {user?.provider === "google" ? "Google Account" : "Local Account"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-30">
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>

          {/* Search bar placeholder (non functional search, points to guides search) */}
          <div className="hidden sm:block relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              onClick={() => setView("disease")}
              readOnly
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-9 pr-4 py-2 text-xs text-slate-500 cursor-pointer focus:outline-none"
            />
          </div>

          {/* Right Top Header utilities */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            {/* Language Switcher Switch */}
            <div className="flex rounded-xl bg-slate-50 dark:bg-slate-950 p-1 border border-slate-200/50 dark:border-slate-900/60">
              <button
                onClick={() => setLanguage("en")}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                  language === "en"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-100 dark:border-slate-800"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                  language === "hi"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-100 dark:border-slate-800"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                हिं
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl space-y-3 z-50 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {t.notifications}
                    </span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      {t.activeLanguage === "English" ? "Dismiss All" : "सभी हटाएँ"}
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2.5 items-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                        <strong>Late Blight humidity warning</strong> in Almora block fields.
                      </p>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                        <strong>Rabi harvest weather alert</strong>: Light rain warnings in Haridwar district.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 pr-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs uppercase overflow-hidden flex-shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user?.name ? user.name[0] : "S"
                  )}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 shadow-xl z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {user?.name || "Suresh Upadhyay"}
                    </span>
                    <span className="block text-[9px] text-slate-400 truncate">
                      {user?.email || "suresh.upadhyay@mandakiniorganic.org"}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setView("settings");
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    {t.settings}
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileDropdown(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {t.activeLanguage === "English" ? "Sign Out" : "साइन आउट"}
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* View Content Frame */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {apiError ? (
            <div className="rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/50 dark:bg-red-950/10 p-6 text-center max-w-xl mx-auto space-y-4 my-10 animate-fadeIn">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="text-base font-bold text-red-800 dark:text-red-300">
                {language === "en" ? "Connection Error" : "कनेक्शन त्रुटि"}
              </h3>
              <p className="text-xs text-red-600 dark:text-red-405 leading-relaxed">
                {apiError}
              </p>
              <button
                onClick={initApp}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer transition shadow-sm mx-auto"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {language === "en" ? "Retry Connection" : "पुनः प्रयास करें"}
              </button>
            </div>
          ) : loadingHistory ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <RefreshCw className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {language === "en" ? "Connecting to agricultural advisor server..." : "कृषि सलाहकार सर्वर से जुड़ रहा है..."}
              </span>
            </div>
          ) : (
            <>
              {view === "dashboard" && (
                <DashboardOverview 
                  t={t} 
                  stats={getStats()} 
                  setView={setView} 
                  setChatQuery={setChatQuery} 
                />
              )}

              {view === "chat" && (
                <ChatAssistant
                  t={t}
                  messages={messages}
                  setMessages={setMessages}
                  apiKey={apiKey}
                  onSaveConversation={handleSaveConversation}
                  chatQuery={chatQuery}
                  setChatQuery={setChatQuery}
                  onNewChat={() => {
                    setMessages([]);
                    setActiveChatId(null);
                  }}
                />
              )}

              {view === "disease" && (
                <Guides t={t} activeSubTab="disease" />
              )}

              {view === "pest" && (
                <Guides t={t} activeSubTab="pest" />
              )}

              {view === "post-harvest" && (
                <Guides t={t} activeSubTab="post-harvest" />
              )}

              {view === "history" && (
                <ChatHistoryView
                  t={t}
                  historyList={historyList}
                  onLoadChat={onLoadChat}
                  onDeleteChat={onDeleteChat}
                />
              )}

              {view === "settings" && (
                <SettingsView
                  t={t}
                  apiKey={apiKey}
                  setApiKey={setApiKey}
                  temp={temp}
                  setTemp={setTemp}
                  onSave={(key, val) => {
                    setApiKey(key);
                    setTemp(val);
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>

    </div>
  );
}
