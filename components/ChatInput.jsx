"use client";

import { useState, useRef } from "react";

const STARTER_PROMPTS = [
  "Which stock should I buy?",
  "What is a P/E ratio?",
  "Best dividend stocks?",
];



// ─────────────────────────────────────────────────────────────
// ChatInput — adapts between welcome mode and chat mode
// In welcome mode: shows prompt chips above the input
// In chat mode: shows only the input bar
// ─────────────────────────────────────────────────────────────
export default function ChatInput({ onSend, isLoading, mode }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }

  const canSend = text.trim().length > 0 && !isLoading;

  return (
    <div className="flex flex-col gap-3">

      {/* Prompt chips — only shown on welcome screen */}
      {mode === "welcome" && (
        <div className="flex flex-wrap gap-2 justify-center">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSend(prompt)}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-150 cursor-pointer whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-gray-300 transition-colors">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask Flin anything about stocks..."
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-gray-800 placeholder-gray-400 leading-relaxed max-h-36 overflow-y-auto"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
            canSend
              ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400">
        Flin provides educational content only — not financial advice.
      </p>
    </div>
  );
}