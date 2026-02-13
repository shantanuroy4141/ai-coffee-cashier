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
      isFinal: boolean;
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
  onerror: ((event: { error: string }) => void) | null;
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
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Parse order from assistant message
  function parseOrder(text: string): { cleanText: string; orderData: Record<string, unknown> | null } {
    const orderMatch = text.match(
      /\|\|\|ORDER_START\|\|\|([\s\S]*?)\|\|\|ORDER_END\|\|\|/
    );
    if (orderMatch) {
      try {
        const orderData = JSON.parse(orderMatch[1]);
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
  async function submitOrder(orderData: Record<string, unknown>): Promise<Order | null> {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch (err) {
      console.error("Failed to submit order:", err);
    }
    return null;
  }

  // Text-to-speech: try Eleven Labs first, fallback to browser voice
  async function speakText(text: string) {
    if (!isVoiceMode) return;
    try {
      setIsSpeaking(true);
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
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        await audio.play();
      } else {
        // Fallback to browser's built-in speech (works without any API key)
        fallbackSpeak(text);
      }
    } catch (err) {
      console.error("TTS error:", err);
      fallbackSpeak(text);
    }
  }

  function fallbackSpeak(text: string) {
    if (!("speechSynthesis" in window)) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  }

  // Send message
  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
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
      const { cleanText, orderData } = parseOrder(data.message);

      let order: Order | undefined;
      if (orderData) {
        const submitted = await submitOrder(orderData);
        if (submitted) order = submitted;
      }

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: cleanText,
        timestamp: new Date().toISOString(),
        order,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Speak the response if in voice mode
      if (isVoiceMode && cleanText) {
        speakText(cleanText);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg = err instanceof Error ? err.message : "";
      const isQuota = errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED");
      const userMessage = isQuota
        ? "You've hit the free API limit for today. Try again in a few minutes, or check your usage at aistudio.google.com."
        : "The AI can't respond right now. Make sure you added GEMINI_API_KEY to .env.local (get one at aistudio.google.com/apikey), then restart the server.";
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

  // Voice recognition
  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recognition.onerror = (event: { error: string }) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
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
    <div className="flex flex-col h-full bg-cream">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b border-greek-100 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-greek-800">
            Order Here
          </h2>
          <p className="text-xs text-greek-500">
            Chat or speak to place your order
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-greek-500">
            {isVoiceMode ? "Voice" : "Text"}
          </span>
          <button
            onClick={() => {
              setIsVoiceMode(!isVoiceMode);
              if (isListening) stopListening();
              if (audioRef.current) {
                audioRef.current.pause();
                setIsSpeaking(false);
              }
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isVoiceMode ? "bg-greek-500" : "bg-greek-200"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                isVoiceMode ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
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
                    ? "bg-greek-500 text-white rounded-br-md"
                    : "bg-white text-greek-800 border border-greek-100 shadow-sm rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs">&#9749;</span>
                    <span className="text-xs font-medium text-greek-500">
                      Aegean Brew
                    </span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
                <span
                  className={`text-[10px] mt-1 block ${
                    msg.role === "user" ? "text-greek-200" : "text-greek-400"
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
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-greek-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs">&#9749;</span>
                <span className="text-xs font-medium text-greek-500">
                  Aegean Brew
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-greek-300 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-greek-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 bg-greek-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-greek-100">
        {isVoiceMode ? (
          <div className="flex flex-col items-center gap-3">
            {isSpeaking && (
              <div className="flex items-center gap-2 text-xs text-greek-500">
                <div className="flex gap-0.5">
                  <span className="w-1 h-3 bg-greek-400 rounded-full animate-pulse" />
                  <span
                    className="w-1 h-4 bg-greek-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-1 h-3 bg-greek-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="w-1 h-5 bg-greek-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.3s" }}
                  />
                  <span
                    className="w-1 h-3 bg-greek-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
                Speaking...
              </div>
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading || isSpeaking}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? "bg-red-500 text-white shadow-lg shadow-red-200 scale-110"
                  : isLoading || isSpeaking
                    ? "bg-greek-200 text-greek-400 cursor-not-allowed"
                    : "bg-greek-500 text-white shadow-lg shadow-greek-200 hover:bg-greek-600 hover:scale-105"
              }`}
            >
              {isListening ? (
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
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
            <p className="text-xs text-greek-500">
              {isListening
                ? "Listening... tap to stop"
                : isLoading
                  ? "Processing..."
                  : isSpeaking
                    ? "Playing response..."
                    : "Tap to speak your order"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your order..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl border border-greek-200 focus:outline-none focus:ring-2 focus:ring-greek-400 focus:border-transparent text-sm bg-greek-50/50 placeholder-greek-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-greek-500 text-white rounded-2xl font-medium text-sm hover:bg-greek-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg
                className="w-5 h-5"
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
        )}
      </div>
    </div>
  );
}
