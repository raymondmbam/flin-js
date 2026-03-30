"use client";

import StockCard from "./StockCard";

// ─────────────────────────────────────────────────────────────
// Convert **bold** and newlines to JSX
// ─────────────────────────────────────────────────────────────
function renderText(text) {
  return text.split("\n").map((line, i, arr) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? (
        <strong key={j} className="font-semibold text-gray-900">
          {part}
        </strong>
      ) : (
        part
      )
    );
    return (
      <span key={i}>
        {rendered}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

// ─────────────────────────────────────────────────────────────
// MessageBubble — one message in the chat thread
// ─────────────────────────────────────────────────────────────
export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 mb-5 animate-in ${isUser ? "flex-row-reverse" : "flex-row"}`}>

      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
        isUser
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-900 text-white"
      }`}>
        {isUser ? "R" : "F"}
      </div>

      {/* Bubble + stock card */}
      <div className={`flex flex-col gap-2 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-gray-900 text-white rounded-tr-sm"
            : "bg-white border border-gray-200 text-gray-700 rounded-tl-sm"
        }`}>
          {renderText(message.content)}
        </div>

        {/* Stock card below Flin's message */}
        {!isUser && message.stockData && (
          <StockCard stock={message.stockData} />
        )}

        {/* Timestamp */}
        <span className="text-xs text-gray-400 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}