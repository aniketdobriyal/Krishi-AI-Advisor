import { useState } from "react";
import { Key, Save, CheckCircle, Info, Sliders, Eye, EyeOff } from "lucide-react";

export default function SettingsView({ t, apiKey, setApiKey, temp, setTemp, onSave }) {
  const [localKey, setLocalKey] = useState(apiKey || "");
  const [localTemp, setLocalTemp] = useState(temp || 0.2);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const isHindi = t.activeLanguage === "Hindi";

  const handleSave = () => {
    setApiKey(localKey);
    setTemp(localTemp);
    onSave(localKey, localTemp);
    
    // Save to localStorage
    localStorage.setItem("crop_advisor_api_key", localKey);
    localStorage.setItem("crop_advisor_temp", localTemp.toString());

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-display">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {isHindi ? "एआई मॉडल मापदंडों और एपीआई कुंजियों को कॉन्फ़िगर करें।" : "Configure AI model credentials, diagnostic parameters, and preferences."}
        </p>
      </div>

      {/* Success Toast */}
      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-4 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 shadow-md animate-fadeIn">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{t.settingsSavedSuccess}</span>
        </div>
      )}

      {/* Form cards */}
      <div className="space-y-6">
        
        {/* API Credentials */}
        <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-3">
            <Key className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {t.apiConfigHeader}
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              {t.apiKeyLabel}
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-4 pr-12 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showKey ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              {t.apiKeyHelp}
            </p>
          </div>

          {/* Mode Badge Status */}
          <div className={`rounded-xl border p-4 flex gap-3 ${
            localKey.trim() 
              ? "border-emerald-200 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-400" 
              : "border-amber-200 bg-amber-50/20 dark:bg-amber-950/10 text-amber-800 dark:text-amber-400"
          }`}>
            <Info className="h-5 w-5 flex-shrink-0" />
            <div>
              <span className="block text-xs font-bold">
                {localKey.trim() ? t.onlineModeActive : t.offlineModeActive}
              </span>
              <p className="mt-0.5 text-[10px] opacity-90 leading-relaxed">
                {localKey.trim() 
                  ? (isHindi ? "जेमिनी 1.5-फ्लैश मॉडल का उपयोग कर लाइव एआई सलाह सक्रिय है।" : "Active live AI advisor using Gemini 1.5 Flash model.") 
                  : (isHindi ? "ऑफ़लाइन मोड सक्रिय है। स्थानीय स्तर पर सहेजे गए फसल रोगों एवं कीटों के डेटाबेस का उपयोग किया जाएगा।" : "Offline fallback active. Queries will match the pre-populated database for instant answers.")
                }
              </p>
            </div>
          </div>
        </div>

        {/* Model parameters tuning */}
        <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-3">
            <Sliders className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {isHindi ? "एआई मॉडल मापदंड" : "AI Diagnostics Parameters"}
            </h3>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-600 dark:text-slate-400">
                {t.tempLabel}
              </label>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {localTemp}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={localTemp}
              onChange={(e) => setLocalTemp(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>{isHindi ? "सटीक / केंद्रित" : "Precise / Structured"}</span>
              <span>{isHindi ? "सृजनात्मक / विस्तृत" : "Creative / Detailed"}</span>
            </div>
          </div>

          {/* System Prompt View */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              {t.systemPromptLabel}
            </label>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-900">
              <code className="text-[10px] text-slate-500 dark:text-slate-400 block leading-relaxed whitespace-pre-wrap">
                {t.systemPromptVal}
              </code>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-right">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold cursor-pointer shadow-md transition"
          >
            <Save className="h-4 w-4" />
            {t.saveSettings}
          </button>
        </div>

      </div>
    </div>
  );
}
