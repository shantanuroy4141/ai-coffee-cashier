"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, Order } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import OrderReceipt from "./OrderReceipt";

// Extend Window for webkitSpeechRecognition
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
      isFinal?: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content:
        "Hey there! Welcome to Aegean Brew. What can I get started for you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const transcriptRef = useRef("");
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Unlock audio on user gesture - required for TTS to work in modern browsers
  function unlockAudio() {
    if (audioUnlockedRef.current) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      audioUnlockedRef.current = true;
    } catch {
      audioUnlockedRef.current = true;
    }
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Refocus input when loading completes so user can keep typing without clicking
  const prevLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (prevLoadingRef.current && !isLoading) {
      inputRef.current?.focus();
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  // Parse order from assistant message (handles markdown-wrapped JSON from some models)
  function parseOrder(text: string): { cleanText: string; orderData: Record<string, unknown> | null } {
    const orderMatch = text.match(
      /\|\|\|ORDER_START\|\|\|([\s\S]*?)\|\|\|ORDER_END\|\|\|/
    );
    if (orderMatch) {
      try {
        let raw = orderMatch[1].trim();
        raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        const orderData = JSON.parse(raw);
        const cleanText = text
          .replace(/\|\|\|ORDER_START\|\|\|[\s\S]*?\|\|\|ORDER_END\|\|\|/, "")
          .trim();
        return { cleanText, orderData };
      } catch {
        return { cleanText: text, orderData: null };
      }
    }
    return { cleanText: text, orderData: null };
  }

  // Submit order to API
  async function submitOrder(orderData: Record<string, unknown>): Promise<{ order: Order | null; error?: string }> {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok) return { order: data.order };
      return { order: null, error: data.error || "Failed to submit order" };
    } catch (err) {
      console.error("Failed to submit order:", err);
      return { order: null, error: "Failed to submit order" };
    }
  }

  // Resume listening after barista finishes speaking (when using voice input)
  function maybeResumeListening() {
    if (!isLoading) setTimeout(() => startListening(), 300);
  }

  // Text-to-speech: try Eleven Labs first, fallback to browser voice
  // resumeAfter: if true, start listening again when done (false when order confirmed)
  async function speakText(text: string, resumeAfter = true) {
    setIsSpeaking(true);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          if (resumeAfter) maybeResumeListening();
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          if (resumeAfter) maybeResumeListening();
        };
        await audio.play();
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData?.error || `ElevenLabs error ${res.status}`;
        console.warn("ElevenLabs TTS failed, using browser voice:", errMsg);
        fallbackSpeak(text, resumeAfter);
      }
    } catch (err) {
      console.error("TTS error:", err);
      fallbackSpeak(text, resumeAfter);
    }
  }

  function stopSpeaking() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  function fallbackSpeak(text: string, resumeAfter = true) {
    if (!("speechSynthesis" in window)) {
      setIsSpeaking(false);
      if (resumeAfter) maybeResumeListening();
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => {
      setIsSpeaking(false);
      if (resumeAfter) maybeResumeListening();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (resumeAfter) maybeResumeListening();
    };
    speechSynthesis.speak(utterance);
  }

  // Send message (uses messagesRef so voice callbacks get latest history)
  async function sendMessage(text: string, fromVoice = false) {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const latestMessages = messagesRef.current;
    const updatedMessages = [...latestMessages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = updatedMessages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.error || "Chat request failed";
        throw new Error(errMsg);
      }
      const rawMessage = data?.message ?? "";
      const { cleanText, orderData } = parseOrder(typeof rawMessage === "string" ? rawMessage : "");

      let order: Order | undefined;
      let orderError: string | undefined;
      if (orderData) {
        const { order: submitted, error } = await submitOrder(orderData);
        if (submitted) order = submitted;
        else if (error) orderError = error;
      }

      const displayContent =
        orderError ? `${cleanText}\n\n⚠️ ${orderError}`.trim()
        : cleanText.trim() || "I didn't catch that. Could you try again?";
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: displayContent,
        timestamp: new Date().toISOString(),
        order,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // When order is confirmed, stop listening (order flow is complete)
      if (order) stopListening();

      // Speak the response only when message came from voice
      if (fromVoice) {
        const orderComplete = !!order;
        if (orderError) {
          speakText(`Sorry, ${orderError}`, !orderComplete);
        } else if (displayContent) {
          speakText(displayContent, !orderComplete);
        } else if (!orderComplete) {
          maybeResumeListening();
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg = err instanceof Error ? err.message : "";
      const isAuth = errMsg.includes("403") || errMsg.includes("API key") || errMsg.includes("API key not configured");
      const userMessage = isAuth
        ? "Invalid or expired API key. Get a new one at aistudio.google.com/apikey and add it to .env.local, then restart the server."
        : errMsg || "The AI can't respond right now. Check the console for details.";
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: userMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  // Voice recognition - continuous mode so it doesn't stop after 1-2s of silence
  function startListening() {
    unlockAudio();
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Use Chrome or Edge for voice input.");
      return;
    }

    transcriptRef.current = "";

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let full = "";
      for (let i = 0; i < event.results.length; i++) {
        const t = event.results[i]?.[0]?.transcript ?? "";
        if (t) full += t;
      }
      transcriptRef.current = full;
    };

    recognition.onerror = (event: { error?: string }) => {
      const err = (event as { error?: string })?.error ?? "unknown";
      console.warn("Speech recognition error:", err, event);
      setIsListening(false);
      if (err === "not-allowed") {
        alert("Microphone access was denied. Please allow microphone access and try again.");
      }
      // no-speech, aborted, etc. - just stop silently
    };

    recognition.onend = () => {
      setIsListening(false);
      const transcript = transcriptRef.current.trim();
      console.log("[Voice] Recognition ended, transcript:", transcript || "(empty)");
      if (transcript) {
        sendMessage(transcript, true);
        setVoiceFeedback(null);
      } else {
        setVoiceFeedback("No speech detected. Check your microphone and try again.");
        setTimeout(() => setVoiceFeedback(null), 4000);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    console.log("[Voice] Listening started");
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex flex-col min-h-0 flex-1 bg-cream">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b border-santorini-100 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-santorini-800">
            Order Here
          </h2>
          <p className="text-xs text-santorini-600">
            Chat or speak to place your order
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            <div
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-santorini-500 text-white rounded-br-md"
                    : "bg-white text-santorini-800 border border-santorini-100 shadow-sm rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs">&#9749;</span>
                    <span className="text-xs font-medium text-santorini-600">
                      Aegean Brew
                    </span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
                <span
                  className={`text-[10px] mt-1 block ${
                    msg.role === "user" ? "text-santorini-200" : "text-santorini-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            {/* Order Receipt */}
            {msg.order && (
              <div className="mt-3">
                <OrderReceipt order={msg.order} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-santorini-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs">&#9749;</span>
                <span className="text-xs font-medium text-santorini-600">
                  Aegean Brew
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-santorini-400 rounded-full animate-bounce" style={{ width: 8, height: 8, minWidth: 8, minHeight: 8 }} />
                <span
                  className="w-2 h-2 bg-santorini-400 rounded-full animate-bounce"
                  style={{ width: 8, height: 8, minWidth: 8, minHeight: 8, animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 bg-santorini-400 rounded-full animate-bounce"
                  style={{ width: 8, height: 8, minWidth: 8, minHeight: 8, animationDelay: "0.3s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-santorini-100">
        {isSpeaking && (
          <div className="flex items-center gap-3 text-xs text-santorini-600 mb-3">
            <div className="flex gap-0.5">
              <span className="w-1 h-3 bg-santorini-400 rounded-full animate-pulse" />
              <span
                className="w-1 h-4 bg-santorini-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="w-1 h-3 bg-santorini-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="w-1 h-5 bg-santorini-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
              <span
                className="w-1 h-3 bg-santorini-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
            <span>Speaking...</span>
            <button
              onClick={() => {
                stopSpeaking();
                maybeResumeListening();
              }}
              className="px-3 py-1 rounded-full bg-red-100 text-red-600 font-medium hover:bg-red-200 transition-colors"
            >
              Stop
            </button>
          </div>
        )}
        {(voiceFeedback || isListening) && (
          <p className="text-xs text-santorini-600 mb-2">
            {isListening ? "Listening... tap mic to stop" : voiceFeedback}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              unlockAudio();
              if (isListening) stopListening();
              else startListening();
            }}
            disabled={isLoading}
            className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-500 text-white"
                : "bg-santorini-100 text-santorini-600 hover:bg-santorini-200"
            }`}
          >
            {isListening ? (
              <svg width={20} height={20} fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg
                width={20}
                height={20}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading) sendMessage(input);
              }
            }}
            placeholder={isListening ? "Speak your order..." : "Type or tap mic to speak"}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl border border-santorini-200 focus:outline-none focus:ring-2 focus:ring-santorini-400 focus:border-transparent text-sm bg-santorini-50/50 placeholder-santorini-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-santorini-500 text-white rounded-2xl font-medium text-sm hover:bg-santorini-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
          >
            <svg
              width={20}
              height={20}
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
