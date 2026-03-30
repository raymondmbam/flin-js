"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

// ─────────────────────────────────────────────────────────────
// Typing indicator — three bouncing dots
// ─────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-4 animate-in">
      <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        F
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400 block"
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Welcome Screen — centered, shown before any message is sent
// ─────────────────────────────────────────────────────────────
function WelcomeScreen({ isExiting }) {
  return (
    <div className={`flex flex-col items-center justify-center flex-1 px-6 pb-8 ${isExiting ? "welcome-exit pointer-events-none" : ""}`}>
      <h1 className="text-3xl font-semibold text-gray-900 mb-3 text-center">
        Welcome back, Raymond
      </h1>
      <p className="text-gray-500 text-base text-center mb-10 leading-relaxed">
        Ask me questions about stocks: real-time stock data ,<br />
        investment concepts and more
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ChatWindow — manages welcome vs conversation state
// ─────────────────────────────────────────────────────────────
export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // "welcome" = initial centered screen, "chat" = conversation mode
  const [mode, setMode] = useState("welcome");
  const [isExiting, setIsExiting] = useState(false);

  const bottomRef = useRef(null);

  // Auto-scroll on new messages in chat mode
  useEffect(() => {
    if (mode === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, mode]);

  // ── Animate welcome out then switch to chat ────────────────
  function transitionToChat() {
    if (mode === "welcome") {
      setIsExiting(true);
      setTimeout(() => setMode("chat"), 220);
    }
  }

  // ── Handle sending a message ──────────────────────────────
  async function handleSend(userText) {
    transitionToChat();

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText,
      stockData: null,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build Gemini-compatible history from all previous messages
      const history = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          stockData: data.stockData ?? null,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "⚠️ Sorry, I ran into a connection issue. Please check your **GEMINI_API_KEY** in `.env.local` and try again.",
          stockData: null,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Reset back to welcome screen ──────────────────────────
  function handleNewChat() {
    setMessages([]);
    setIsExiting(false);
    setMode("welcome");
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white">

      {/* ── Header — only in chat mode ── */}
      {mode === "chat" && (
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">
            F
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Flin</div>
            <div className="text-xs text-gray-400">AI Stock Advisor</div>
          </div>
          <button
            onClick={handleNewChat}
            className="ml-auto text-xs text-gray-400 hover:text-gray-700 transition-colors px-3 py-1 rounded-full hover:bg-gray-100"
          >
            New chat
          </button>
        </div>
      )}

      {/* ── Welcome screen (centered) ── */}
      {mode === "welcome" && (
        <WelcomeScreen isExiting={isExiting} />
      )}

      {/* ── Chat messages ── */}
      {mode === "chat" && (
        <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl w-full mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}

      {/* ── Input bar — always visible at the bottom ── */}
      <div className={`flex-shrink-0 w-full ${mode === "welcome" ? "pb-10" : "pb-6"}`}>
        <div className="max-w-2xl mx-auto px-6">
          <ChatInput onSend={handleSend} isLoading={isLoading} mode={mode} />
        </div>
      </div>

    </div>
  );
}