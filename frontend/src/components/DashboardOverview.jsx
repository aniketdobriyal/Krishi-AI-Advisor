import React from "react";
import { MessageSquare, ShieldAlert, Sprout, Leaf, Bookmark, ArrowRight, Sun, AlertTriangle, Play } from "lucide-react";

export default function DashboardOverview({ t, stats, setView, setChatQuery }) {
  const statCards = [
    {
      title: t.totalQuestions,
      value: stats.total,
      icon: MessageSquare,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      desc: t.activeLanguage === "English" ? "Lifetime conversations" : "आजीवन बातचीत"
    },
    {
      title: t.diseaseQueries,
      value: stats.disease,
      icon: ShieldAlert,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      desc: t.activeLanguage === "English" ? "Fungal & bacterial issues" : "कवक और जीवाणु समस्याएं"
    },
    {
      title: t.pestQueries,
      value: stats.pest,
      icon: Sprout,
      color: "from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      desc: t.activeLanguage === "English" ? "Insects and borers" : "कीट और छेदक"
    },
    {
      title: t.postHarvestQueries,
      value: stats.postHarvest,
      icon: Leaf,
      color: "from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      desc: t.activeLanguage === "English" ? "Storage & packaging" : "भंडारण और पैकेजिंग"
    },
    {
      title: t.savedConversations,
      value: stats.saved,
      icon: Bookmark,
      color: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      desc: t.activeLanguage === "English" ? "Bookmarked diagnostics" : "सहेजे गए निदान"
    }
  ];

  const handleAlertClick = (query) => {
    setChatQuery(query);
    setView("chat");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-6 text-white shadow-lg dark:border-emerald-950">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-300 border border-emerald-400/20 uppercase">
              {t.activeLanguage === "English" ? "Supervisor Panel" : "पर्यवेक्षक पैनल"}
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight font-display">
              {t.welcomeSupervisor}
            </h2>
            <p className="mt-2 text-emerald-100 max-w-xl text-sm leading-relaxed">
              {t.activeLanguage === "English"
                ? "Monitor crops, diagnose plant diseases instantly via AI, and ensure strict compliance with storage standards across your block."
                : "फसलों की निगरानी करें, एआई के माध्यम से तुरंत फसल रोगों का निदान करें, और अपने ब्लॉक में भंडारण मानकों का कड़ाई से अनुपालन सुनिश्चित करें।"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setView("chat")}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-md transition hover:bg-emerald-50 cursor-pointer"
            >
              {t.askQuestionAction}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Visual design element background shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-teal-500/10 blur-2xl"></div>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:shadow-md ${idx === 4 ? "col-span-2 lg:col-span-1" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`rounded-xl bg-gradient-to-br ${card.color} p-2.5 border`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-display">
                {card.value}
              </span>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 truncate">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Weather and Alert Warnings & Activity layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Local Uttarakhand Alerts */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {t.uttarakhandWeatherAlert}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Blight Alert */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/50 dark:bg-amber-950/10 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-amber-100 dark:bg-amber-900/50 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                  {t.activeLanguage === "English" ? "Humidity Alert" : "आर्द्रता चेतावनी"}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {t.activeLanguage === "English" ? "Hills Region" : "पर्वतीय क्षेत्र"}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {t.alertHumidityTitle}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.alertHumidityText}
              </p>
              <button 
                onClick={() => handleAlertClick(t.activeLanguage === "English" ? "My tomato leaves have yellow spots. What could be the reason?" : "मेरे टमाटर के पत्तों पर पीले धब्बे हैं")}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline pt-2 cursor-pointer"
              >
                {t.activeLanguage === "English" ? "Start Blight Diagnostic" : "झुलसा रोग निदान शुरू करें"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Rain Alert */}
            <div className="rounded-2xl border border-blue-200 dark:border-blue-950/60 bg-blue-50/50 dark:bg-blue-950/10 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/50 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                  {t.activeLanguage === "English" ? "Harvest Warning" : "कटाई चेतावनी"}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {t.activeLanguage === "English" ? "Plains Region" : "मैदानी क्षेत्र"}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {t.alertRainfallTitle}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.alertRainfallText}
              </p>
              <button
                onClick={() => setView("post-harvest")}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline pt-2 cursor-pointer"
              >
                {t.activeLanguage === "English" ? "Review Storage Checkpoints" : "भंडारण बिंदुओं की समीक्षा करें"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {t.quickActions}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setView("chat")}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-left transition hover:border-emerald-500/50 hover:bg-emerald-50/20 cursor-pointer"
              >
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.askQuestionAction}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t.activeLanguage === "English" ? "Query AI Bot" : "एआई बॉट से पूछें"}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setView("disease")}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-left transition hover:border-emerald-500/50 hover:bg-emerald-50/20 cursor-pointer"
              >
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.browseGuidesAction}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t.activeLanguage === "English" ? "Uttarakhand Diseases" : "उत्तराखंड रोग सूची"}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setView("post-harvest")}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-left transition hover:border-emerald-500/50 hover:bg-emerald-50/20 cursor-pointer"
              >
                <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
                  <Leaf className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.readPostHarvestAction}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t.activeLanguage === "English" ? "Storage Regulations" : "भंडारण नियम"}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Log Feed */}
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              {t.recentActivity}
            </h3>
            <div className="mt-4 space-y-4">
              <div className="relative flex gap-3 pb-4 border-l border-slate-100 dark:border-slate-800 pl-4 ml-2">
                <div className="absolute -left-1.5 top-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500"></div>
                <div>
                  <span className="block text-[11px] text-slate-400 dark:text-slate-500">Today, 10:45 AM</span>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    {t.activity1}
                  </p>
                </div>
              </div>
              <div className="relative flex gap-3 pb-4 border-l border-slate-100 dark:border-slate-800 pl-4 ml-2">
                <div className="absolute -left-1.5 top-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500"></div>
                <div>
                  <span className="block text-[11px] text-slate-400 dark:text-slate-500">Yesterday, 4:20 PM</span>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    {t.activity2}
                  </p>
                </div>
              </div>
              <div className="relative flex gap-3 pl-4 ml-2">
                <div className="absolute -left-1.5 top-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700"></div>
                <div>
                  <span className="block text-[11px] text-slate-400 dark:text-slate-500">June 08, 11:00 AM</span>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    {t.activity3}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-200/50 dark:border-slate-900/60 space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              <Sun className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
              {t.activeLanguage === "English" ? "Agromet Advisory" : "कृषि मौसम बुलेटिन"}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              {t.activeLanguage === "English"
                ? "Blowing winds in Terai valleys might accelerate aphid migrations in mustard fields. Supervisors must check yellow traps weekly."
                : "तराई घाटियों में हवाएं चलने से सरसों के खेतों में माहू (एफिड्स) का प्रसार बढ़ सकता है। पर्यवेक्षक साप्ताहिक रूप से पीले ट्रैप की जांच करें।"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
