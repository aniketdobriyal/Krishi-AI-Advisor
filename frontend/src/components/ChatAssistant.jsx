import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Volume2, VolumeX, Bookmark, Loader, Info, HelpCircle, User, Bot, AlertTriangle, Sprout } from "lucide-react";
import API from "../api";
import { SUGGESTED_QUESTIONS } from "../data";

export default function ChatAssistant({ t, messages, setMessages, apiKey, onSaveConversation, chatQuery, setChatQuery, onNewChat }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState(null);
  const [globalStatus, setGlobalStatus] = useState("online");
  const [fallbackReason, setFallbackReason] = useState(null);
  const [loadingStatusText, setLoadingStatusText] = useState("Connecting to Gemini...");

  const messagesEndRef = useRef(null);
  const ttsUtteranceRef = useRef(null);
  const recognitionRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const res = await API.get("/chat/status");
      if (res.data && res.data.data) {
        setGlobalStatus(res.data.data.online ? "online" : "offline");
        setFallbackReason(res.data.data.fallbackReason);
      }
    } catch (err) {
      console.error("Failed to fetch chat status:", err);
      setGlobalStatus("offline");
      setFallbackReason("Network error");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  const getMsgSource = (msg) => {
    if (msg.source) return msg.source;
    if (msg.advisory && msg.advisory.disclaimer) {
      const disc = msg.advisory.disclaimer.toLowerCase();
      if (disc.includes("offline") || disc.includes("ऑफ़लाइन") || disc.includes("triggered by blight-related keywords")) {
        return "offline";
      }
    }
    return "gemini";
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle preset query loaded from dashboard alert click
  useEffect(() => {
    if (chatQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInput(chatQuery);
      setChatQuery(""); // clear
    }
  }, [chatQuery, setChatQuery]);

  // Cleanup speech synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    // Add user message
    const updatedMessages = [...messages, { sender: "user", text: queryText }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setLoadingStatusText(t.activeLanguage === "English" ? "Connecting to Gemini..." : "जेमिनी से कनेक्ट किया जा रहा है...");

    try {
      const isHindi = t.activeLanguage === "Hindi";
      // Ask Gemini via backend API
      const response = await API.post("/chat", { query: queryText, isHindi });
      const data = response.data; // { response, source, model, fallbackReason }

      if (data.source === "offline") {
        setLoadingStatusText(t.activeLanguage === "English"
          ? "Gemini unavailable. Switching to offline knowledge base."
          : "जेमिनी अनुपलब्ध है। ऑफ़लाइन ज्ञान आधार पर स्विच किया जा रहा है।"
        );
        // Delay to show transition message
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setMessages([
        ...updatedMessages,
        {
          sender: "ai",
          isAdvisory: true,
          advisory: data.response,
          source: data.source,
          model: data.model,
          fallbackReason: data.fallbackReason
        }
      ]);
      
      // Update global indicator instantly
      fetchStatus();
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        {
          sender: "ai",
          text: t.activeLanguage === "English" 
            ? "Sorry, I encountered an error connecting to the agricultural brain. Please try again." 
            : "क्षमा करें, मुझे कृषि मस्तिष्क से जुड़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Real browser Voice input (Speech to Text) using Web Speech API
  const handleVoiceInput = () => {
    if (loading) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.activeLanguage === "Hindi"
        ? "आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता है। कृपया क्रोम या एज का उपयोग करें।"
        : "Your browser does not support voice input. Please try Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = t.activeLanguage === "Hindi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to initialize speech recognition:", err);
      setIsListening(false);
    }
  };

  // Text-To-Speech (TTS) Reader
  const toggleSpeech = (msgIndex, advisory) => {
    if (activeSpeechId === msgIndex) {
      window.speechSynthesis?.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis?.cancel();

    const isHindi = t.activeLanguage === "Hindi";
    // Build text payload to read aloud
    const textToRead = isHindi 
      ? `पहचानी गई समस्या: ${advisory.problem}. संभावित कारण: ${advisory.causes}. अनुशंसित कार्रवाई: ${advisory.actions}. सावधानियां: ${advisory.precautions}.`
      : `Problem Identified: ${advisory.problem}. Possible causes: ${advisory.causes}. Recommended actions: ${advisory.actions}. Precautions: ${advisory.precautions}.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Attempt to select proper locale voice
    const voices = window.speechSynthesis?.getVoices() || [];
    const targetLang = isHindi ? "hi-IN" : "en-US";
    const matchingVoice = voices.find(v => v.lang.startsWith(targetLang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    
    utterance.lang = targetLang;
    utterance.rate = 0.95; // slightly slower for clarity in field conditions
    
    utterance.onend = () => {
      setActiveSpeechId(null);
    };

    utterance.onerror = () => {
      setActiveSpeechId(null);
    };

    ttsUtteranceRef.current = utterance;
    setActiveSpeechId(msgIndex);
    window.speechSynthesis?.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm animate-fadeIn">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {t.welcomeChatTitle}
            </h3>
            <span className="text-[10px] font-medium flex items-center gap-1.5 mt-0.5">
              {globalStatus === "online" ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wide">
                    🟢 AI Service Online
                  </span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wide" title={fallbackReason || ""}>
                    🟡 Offline Knowledge Base Active
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {messages.length > 0 && (
            <button
              onClick={onNewChat}
              className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.newChat}
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={onSaveConversation}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer shadow-sm"
            >
              <Bookmark className="h-3.5 w-3.5" />
              {t.saveChat}
            </button>
          )}
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30 dark:bg-slate-950/5">
        
        {/* Empty State */}
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto text-center py-10 space-y-6"
            >
              <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sprout className="h-8 w-8 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                  {t.welcomeChatTitle}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t.welcomeChatSubtitle}
                </p>
              </div>

              {/* Warnings for Offline state */}
              {!apiKey && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/10 p-4 text-left flex gap-3">
                  <Info className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-normal">
                    {t.apiKeyWarning}
                  </p>
                </div>
              )}

              {/* Suggested Questions */}
              <div className="space-y-3 pt-4 text-left">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                  <HelpCircle className="h-4 w-4" />
                  {t.suggestedQuestionsTitle}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(t.activeLanguage === "English" ? q.textEn : q.textHi)}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 transition hover:border-emerald-500 hover:bg-emerald-50/10 hover:shadow-sm cursor-pointer"
                    >
                      {t.activeLanguage === "English" ? q.textEn : q.textHi}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Stream */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* AI Avatar */}
            {msg.sender === "ai" && (
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <Bot className="h-5 w-5" />
              </div>
            )}

            <div className={`max-w-2xl space-y-2 ${msg.sender === "user" ? "order-1" : "order-2"}`}>
              {msg.isAdvisory ? (
                /* High-fidelity Advisory Card */
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-md">
                  
                  {/* Card Header Seal */}
                  <div className="relative border-b border-slate-100 dark:border-slate-800 px-6 py-3.5 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center seal-pattern">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-2">
                        {t.officialSealText}
                      </span>
                      
                      {/* Message Source Badge */}
                      {getMsgSource(msg) === "gemini" ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>🟢 AI Online • Powered by {msg.model || "Gemini"}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-500/10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide" title={msg.fallbackReason || ""}>
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>🟡 Offline Mode • Using Local Agricultural Knowledge Base</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSpeech(index, msg.advisory)}
                        className={`rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition`}
                        title={activeSpeechId === index ? t.ttsStop : t.ttsRead}
                      >
                        {activeSpeechId === index ? (
                          <VolumeX className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Content grid */}
                  <div className="p-6 space-y-4">
                    {/* Problem */}
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                        {t.problemIdentified}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                        {msg.advisory.problem}
                      </h4>
                    </div>

                    {/* Causes */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        {t.possibleCauses}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                        {msg.advisory.causes}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-900">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                        {t.recommendedActions}
                      </span>
                      <div className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 whitespace-pre-line leading-relaxed space-y-1">
                        {msg.advisory.actions}
                      </div>
                    </div>

                    {/* Precautions */}
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                        {t.precautions}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                        {msg.advisory.precautions}
                      </p>
                    </div>

                    {/* Disclaimer */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex gap-2 items-start">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic">
                        <strong>{t.verificationDisclaimer}:</strong> {msg.advisory.disclaimer}
                      </p>
                    </div>

                  </div>
                </div>
              ) : (
                /* Simple text message */
                <div
                  className={`rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>

            {/* User Avatar */}
            {msg.sender === "user" && (
              <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}

        {/* Loading / Thinking Skeleton */}
        {loading && (
          <div className="space-y-3 animate-fadeIn">
            {/* Status notice */}
            <div className="flex gap-2 items-center text-xs font-semibold pl-1.5 transition-colors">
              {loadingStatusText.includes("Gemini unavailable") || loadingStatusText.includes("जेमिनी अनुपलब्ध") ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-amber-600 dark:text-amber-400">{loadingStatusText}</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-slate-500 dark:text-slate-400">{loadingStatusText}</span>
                </>
              )}
            </div>

            <div className="flex gap-4 justify-start">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <Loader className="h-5 w-5 animate-spin" />
              </div>

              <div className="max-w-2xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm animate-pulse">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-20 bg-slate-50 dark:bg-slate-950 rounded-xl"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Listening Overlay */}
      {isListening && (
        <div className="bg-emerald-50 dark:bg-slate-950 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-red-500 text-white animate-pulse">
              <Mic className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.voiceListening}
            </span>
          </div>
          {/* Animated sound wave bars */}
          <div className="flex items-end gap-1 h-5">
            <div className="w-1 bg-red-400 dark:bg-red-500 rounded-t h-full animate-wave-1"></div>
            <div className="w-1 bg-red-400 dark:bg-red-500 rounded-t h-full animate-wave-2"></div>
            <div className="w-1 bg-red-400 dark:bg-red-500 rounded-t h-full animate-wave-3"></div>
            <div className="w-1 bg-red-400 dark:bg-red-500 rounded-t h-full animate-wave-4"></div>
            <div className="w-1 bg-red-400 dark:bg-red-500 rounded-t h-full animate-wave-5"></div>
          </div>
        </div>
      )}

      {/* Input container */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 p-4 bg-slate-50/20 dark:bg-slate-950/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={loading}
            className={isListening 
              ? "rounded-xl border border-red-500/30 text-red-500 bg-red-50 dark:bg-red-950/20 p-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0 animate-pulse"
              : "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0"
            }
            title={t.voiceButton}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={t.inputPlaceholder}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white p-3 cursor-pointer transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

    </div>
  );
}
