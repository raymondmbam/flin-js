"use client";

function formatMarketCap(value) {
  if (!value) return "N/A";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9)  return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6)  return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function formatVolume(value) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// StockCard — live stock snapshot attached to Flin's message
// ─────────────────────────────────────────────────────────────
export default function StockCard({ stock }) {
  const isGain = stock.change >= 0;
  const sign   = isGain ? "+" : "";
  const arrow  = isGain ? "▲" : "▼";

  return (
    <div className={`animate-in bg-white border rounded-2xl p-4 w-72 shadow-sm ${
      isGain ? "border-l-4 border-l-emerald-400" : "border-l-4 border-l-red-400"
    } border-gray-200`}>

      {/* Ticker + name */}
      <div className="mb-3">
        <div className="text-lg font-bold text-gray-900 tracking-wide">{stock.ticker}</div>
        <div className="text-xs text-gray-400 mt-0.5">{stock.name}</div>
      </div>

      {/* Price + change */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold text-gray-900">
          {stock.currency} {stock.price.toFixed(2)}
        </span>
        <span className={`text-sm font-semibold ${isGain ? "text-emerald-500" : "text-red-500"}`}>
          {arrow} {sign}{stock.change.toFixed(2)} ({sign}{stock.changePercent.toFixed(2)}%)
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
        <Stat label="Volume"     value={formatVolume(stock.volume)} />
        <Stat label="Market Cap" value={formatMarketCap(stock.marketCap)} />
        <Stat label="52W High"   value={stock.high52Week ? `$${stock.high52Week.toFixed(2)}` : "N/A"} />
        <Stat label="52W Low"    value={stock.low52Week  ? `$${stock.low52Week.toFixed(2)}`  : "N/A"} />
      </div>

      {/* Live badge */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className={`w-1.5 h-1.5 rounded-full ${isGain ? "bg-emerald-400" : "bg-red-400"}`} />
        <span className="text-xs text-gray-400">Live via Yahoo Finance</span>
      </div>
    </div>
  );
}