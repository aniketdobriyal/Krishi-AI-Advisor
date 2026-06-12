import React, { useState } from "react";
import { Search, Calendar, MessageSquare, Trash2, ArrowUpRight, Inbox } from "lucide-react";

export default function ChatHistoryView({ t, historyList, onLoadChat, onDeleteChat }) {
  const [historySearch, setHistorySearch] = useState("");
  const isHindi = t.activeLanguage === "Hindi";

  // Filter history by search term
  const filteredHistory = historyList.filter(item => {
    const title = isHindi ? item.titleHi : item.titleEn;
    return title.toLowerCase().includes(historySearch.toLowerCase());
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isHindi ? "hi-IN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-display">
          {t.chatHistory}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {isHindi ? "सहेजे गए पिछले रोग निदान और एआई सलाहकार सत्रों की सूची।" : "Review or resume previous crop diagnostic sessions and advisory chats."}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
        <input
          type="text"
          placeholder={t.searchHistoryPlaceholder}
          value={historySearch}
          onChange={(e) => setHistorySearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Inbox className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.noHistory}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map(item => {
            const firstUserQuery = item.messages.find(m => m.sender === "user")?.text || "";

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.date)}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">
                      {isHindi ? item.titleHi : item.titleEn}
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {firstUserQuery || item.messages[0]?.text || ""}
                    </p>
                  </div>
                </div>

                {/* Actions footer */}
                <div className="border-t border-slate-50 dark:border-slate-800 mt-4 pt-3.5 flex justify-between gap-2">
                  <button
                    onClick={() => onDeleteChat(item.id)}
                    className="flex items-center gap-1 rounded-xl p-2 text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer text-xs font-semibold transition"
                    title={t.deleteChat}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{t.deleteChat}</span>
                  </button>

                  <button
                    onClick={() => onLoadChat(item)}
                    className="flex items-center gap-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 text-xs font-semibold hover:bg-emerald-100/50 dark:hover:bg-emerald-950/70 transition cursor-pointer"
                  >
                    <span>{t.loadChat}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
