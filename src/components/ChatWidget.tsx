"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Send } from "lucide-react";
import { useChatbot } from "../hooks/use-chatbot";
import { useLanguage } from "@/hooks/useLanguage";
import ChatMessageContent from "@/components/chat/ChatMessageContent";
import VoiceListeningAnimation from "@/components/chat/VoiceListeningAnimation";
import Image from "next/image";

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

const VOICE_ERROR_MESSAGES: Record<
  string,
  { en: string; hi: string }
> = {
  "not-allowed": {
    en: "Microphone access was denied. Please allow microphone permission in your browser settings.",
    hi: "माइक्रोफ़ोन की अनुमति अस्वीकार कर दी गई। कृपया अपने ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।",
  },
  "service-not-allowed": {
    en: "Speech recognition is not allowed in this context. Try using HTTPS or a supported browser.",
    hi: "इस संदर्भ में वॉइस इनपुट की अनुमति नहीं है। HTTPS या समर्थित ब्राउज़र का उपयोग करें।",
  },
  "audio-capture": {
    en: "No microphone was found. Please connect a microphone and try again.",
    hi: "कोई माइक्रोफ़ोन नहीं मिला। कृपया माइक्रोफ़ोन कनेक्ट करके पुनः प्रयास करें।",
  },
  "no-speech": {
    en: "No speech was detected. Please try again.",
    hi: "कोई आवाज़ नहीं मिली। कृपया पुनः प्रयास करें।",
  },
  network: {
    en: "Network error during speech recognition. Please check your connection.",
    hi: "वॉइस इनपुट के दौरान नेटवर्क त्रुटि। कृपया अपना कनेक्शन जाँचें।",
  },
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const { messages, isLoading, error, sendMessage } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef("");
  const voiceFailedRef = useRef(false);
  const isLoadingRef = useRef(isLoading);
  const lang = useLanguage();
  const isHi = lang === "hi";

  const suggestedQuestions = isHi
    ? [
      "ओडीओपी (ODOP) योजना क्या है?",
      "ओडीओपी के तहत वित्तीय सहायता योजनाएं क्या हैं?"
    ]
    : [
      "What is ODOP?",
      "What are the financial assistance schemes?"
    ];

  const handleSend = useCallback(
    (text?: string) => {
      const message = (text ?? inputValue).trim();
      if (!message || isLoadingRef.current) {
        return;
      }
      sendMessage(message, isHi);
      setInputValue("");
      transcriptRef.current = "";
    },
    [inputValue, isHi, sendMessage],
  );

  const handleSendRef = useRef(handleSend);
  handleSendRef.current = handleSend;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const getVoiceErrorMessage = useCallback(
    (errorCode: string) => {
      const known = VOICE_ERROR_MESSAGES[errorCode];
      if (known) {
        return isHi ? known.hi : known.en;
      }
      return isHi
        ? "वॉइस इनपुट में त्रुटि हुई। कृपया पुनः प्रयास करें।"
        : "Voice input failed. Please try again.";
    },
    [isHi],
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const toggleVoiceInput = useCallback(() => {
    if (isLoadingRef.current) {
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) {
      setVoiceError(
        isHi
          ? "आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता। Chrome, Edge या Safari का उपयोग करें।"
          : "Your browser does not support voice input. Please use Chrome, Edge, or Safari.",
      );
      return;
    }

    setVoiceError(null);
    transcriptRef.current = "";
    voiceFailedRef.current = false;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = isHi ? "hi-IN" : "en-IN";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcriptRef.current = transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        return;
      }
      voiceFailedRef.current = true;
      setVoiceError(getVoiceErrorMessage(event.error));
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;

      const text = transcriptRef.current.trim();
      if (text && !isLoadingRef.current && !voiceFailedRef.current) {
        handleSendRef.current(text);
      }
      voiceFailedRef.current = false;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setVoiceError(
        isHi
          ? "वॉइस इनपुट शुरू नहीं हो सका। कृपया पुनः प्रयास करें।"
          : "Could not start voice input. Please try again.",
      );
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [getVoiceErrorMessage, isHi, isListening, stopListening]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
    if (isLoading && isListening) {
      stopListening();
    }
  }, [isLoading, isListening, stopListening]);

  useEffect(() => {
    setSpeechSupported(getSpeechRecognitionCtor() !== null);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      className={`fixed bottom-4 right-4 font-sans sm:bottom-6 sm:right-6 ${isOpen ? "z-[10060]" : "z-50"
        }`}
    >
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            key="chat-fab"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, y: 16 }}
            animate="rest"
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            whileHover="hover"
            whileTap="tap"
            variants={{
              rest: { opacity: 1, y: 0 },
              hover: {
                y: -4,
                boxShadow: "0 20px 40px rgba(138, 35, 28, 0.35)",
                transition: { type: "spring", stiffness: 420, damping: 22 },
              },
              tap: { y: 0 },
            }}
            className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-[#8a231c] text-white shadow-xl overflow-hidden border-2 border-white sm:h-[7.2rem] sm:w-[7.2rem]"
          >
            <motion.span
              aria-hidden
              variants={{
                rest: { scale: 1, opacity: 0 },
                hover: {
                  scale: [1, 1.35],
                  opacity: [0.5, 0],
                  transition: {
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeOut",
                  },
                },
              }}
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/70"
            />
            <motion.span
              aria-hidden
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1, transition: { duration: 0.2 } },
              }}
              className="pointer-events-none absolute inset-0 rounded-full bg-white/10"
            />
            <Image
              src="/assets/img/icon/odopmitr.png"
              alt="Chat Icon"
              width={115}
              height={115}
              className="relative z-10 h-full w-full object-cover"
            />
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-0 flex flex-col border-0 bg-white shadow-2xl dark:bg-slate-900 sm:static sm:inset-auto sm:h-[min(500px,calc(100dvh-3rem))] sm:w-[380px] sm:rounded-2xl sm:border sm:border-slate-200 dark:sm:border-slate-800"
          >
            <div className="flex shrink-0 items-center justify-between bg-[#8a231c] p-3 text-white sm:rounded-t-2xl sm:p-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/img/icon/odopmitr.png"
                  alt={isHi ? "ओडीओपी मित्र" : "ODOP Mitra"}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover bg-white"
                />
                <div>
                  <h3 className="font-semibold text-lg leading-tight" style={{ color: "#ffffff" }}>
                    {isHi ? "ओडीओपी मित्र" : "ODOP Mitra"}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={isHi ? "चैट बंद करें" : "Close chat"}
                className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3 space-y-3 sm:p-4 sm:space-y-4">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center text-slate-400">
                  <p className="text-sm leading-relaxed sm:text-base">
                    {isHi ? "नमस्ते! मैं आज आपकी कैसे मदद कर सकता हूँ?" : "Hello! How can I help you today?"}
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => {
                const isThinking =
                  msg.role === "assistant" &&
                  !msg.content &&
                  isLoading &&
                  idx === messages.length - 1;

                return (
                  <div
                    key={idx}
                    className={`flex w-full min-w-0 items-start ${msg.role === "user" ? "justify-end" : "justify-start gap-2.5"
                      }`}
                  >
                    {msg.role === "assistant" && (
                      <div
                        className="mt-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white dark:border-slate-700"
                        aria-hidden
                      >
                        <Image
                          src="/assets/img/icon/odopmitr.png"
                          alt=""
                          width={32}
                          height={32}
                          className="block h-full w-full object-cover object-center"
                        />
                      </div>
                    )}
                    <div
                      className={`flex min-w-0 flex-col ${msg.role === "user"
                          ? "max-w-[85%] items-end sm:max-w-[80%]"
                          : "min-w-0 flex-1 items-start"
                        }`}
                    >
                      <div
                        className={`rounded-2xl text-sm leading-relaxed ${isThinking
                            ? "w-fit px-1 py-1"
                            : `w-full px-3 py-2.5 sm:px-4 ${msg.role === "user"
                              ? "bg-[#8a231c] text-white"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                            }`
                          }`}
                      >
                        {msg.role === "assistant" ? (
                          isThinking ? (
                            <div className="flex items-center gap-1 px-1 py-0.5" aria-label={isHi ? "सोच रहा है..." : "Thinking..."}>
                              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]" />
                            </div>
                          ) : (
                            <ChatMessageContent content={msg.content} />
                          )
                        ) : (
                          <span className="break-words [overflow-wrap:anywhere]">
                            {msg.content}
                          </span>
                        )}
                      </div>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 w-full space-y-1.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {isHi ? "स्रोत" : "Sources"}
                          </p>
                          <ul className="space-y-1">
                            {msg.sources.map((src, sIdx) => (
                              <li key={sIdx}>
                                <a
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block break-all rounded-lg border border-[#f0d4d2] bg-[#fcf2f2] px-2.5 py-1.5 text-xs font-medium leading-snug text-[#8a231c] underline underline-offset-2 hover:bg-[#fae8e6] dark:border-[#6b1b15] dark:bg-[#3d1410] dark:text-[#f5d0cc] dark:hover:bg-[#4a1813]"
                                >
                                  {src.title || src.url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {msg.role === "assistant" &&
                        msg.relatedOptions &&
                        msg.relatedOptions.length > 0 &&
                        idx === messages.length - 1 &&
                        !isLoading && (
                          <div className="mt-2 w-full space-y-1">
                            {msg.relatedOptions.map((option, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleSend(option)}
                                disabled={isLoading}
                                className="group flex w-full items-start gap-1.5 rounded-md px-0.5 py-0.5 text-left text-xs leading-snug text-slate-600 transition-colors hover:text-[#8a231c] disabled:opacity-50 dark:text-slate-300 dark:hover:text-[#f5d0cc]"
                              >
                                <span
                                  aria-hidden
                                  className="mt-[2px] flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border border-slate-300 bg-white transition-colors group-hover:border-[#8a231c] group-hover:bg-[#8a231c]/5 dark:border-slate-600 dark:bg-slate-900 dark:group-hover:border-[#8a231c]"
                                />
                                <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                                  {option}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
              {error && (
                <div className="text-center text-xs text-red-500">{error}</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 0 && (
              <div className="shrink-0 space-y-1 px-3 pb-3 sm:px-4 sm:pb-4">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="group flex w-full items-start gap-1.5 rounded-md px-0.5 py-0.5 text-left text-xs leading-snug text-slate-600 transition-colors hover:text-[#8a231c] disabled:opacity-50 dark:text-slate-300 dark:hover:text-[#f5d0cc]"
                  >
                    <span
                      aria-hidden
                      className="mt-[2px] flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border border-slate-300 bg-white transition-colors group-hover:border-[#8a231c] group-hover:bg-[#8a231c]/5 dark:border-slate-600 dark:bg-slate-900 dark:group-hover:border-[#8a231c]"
                    />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                      {q}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex shrink-0 flex-col gap-1.5 border-t border-slate-200 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-slate-800 sm:pb-3"
            >
              {voiceError && (
                <p className="px-1 text-xs leading-snug text-red-500" role="alert">
                  {voiceError}
                </p>
              )}
              <VoiceListeningAnimation isListening={isListening} isHi={isHi} />
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setVoiceError(null);
                      setInputValue(e.target.value);
                      transcriptRef.current = e.target.value;
                    }}
                    placeholder={isHi ? "एक प्रश्न पूछें..." : "Ask a question..."}
                    className={`w-full rounded-full border py-2 pl-4 pr-11 text-sm focus:outline-none dark:bg-slate-800 dark:text-white ${isListening
                        ? "border-[#8a231c]/60 bg-[#fdf5f4] shadow-[0_0_0_3px_rgba(138,35,28,0.12)] dark:border-[#8a231c]/50 dark:bg-[#2a1210]"
                        : "border-slate-200 focus:border-[#8a231c] dark:border-slate-800"
                      }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    disabled={isLoading || !speechSupported}
                    aria-label={
                      isListening
                        ? isHi
                          ? "वॉइस इनपुट बंद करें"
                          : "Stop voice input"
                        : isHi
                          ? "वॉइस इनपुट शुरू करें"
                          : "Start voice input"
                    }
                    aria-pressed={isListening}
                    title={
                      !speechSupported
                        ? isHi
                          ? "वॉइस इनपुट समर्थित नहीं है"
                          : "Voice input not supported"
                        : undefined
                    }
                    className={`absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700 ${isListening
                        ? "text-[#8a231c]"
                        : "text-slate-400 hover:text-[#8a231c]"
                      }`}
                  >
                    {isListening && (
                      <>
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-full border border-[#8a231c]/40"
                          animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-full border border-[#8a231c]/25"
                          animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.35,
                          }}
                        />
                      </>
                    )}
                    <Mic className="relative z-10 h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  aria-label={isHi ? "भेजें" : "Send"}
                  style={{ backgroundColor: "#8a231c" }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
