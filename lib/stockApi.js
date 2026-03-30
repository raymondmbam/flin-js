import yahooFinance from "yahoo-finance2";

// ─────────────────────────────────────────────────────────────
// Fetch live stock data for a single ticker
// Returns null if the ticker is invalid or the request fails
// ─────────────────────────────────────────────────────────────
export async function getStockData(ticker) {
  try {
    const quote = await yahooFinance.quote(ticker.toUpperCase());

    // If Yahoo Finance returns no price, the ticker is probably invalid
    if (!quote || !quote.regularMarketPrice) {
      return null;
    }

    return {
      ticker: quote.symbol,
      name: quote.longName ?? quote.shortName ?? quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange ?? 0,
      changePercent: quote.regularMarketChangePercent ?? 0,
      volume: quote.regularMarketVolume ?? 0,
      marketCap: quote.marketCap ?? null,
      high52Week: quote.fiftyTwoWeekHigh ?? null,
      low52Week: quote.fiftyTwoWeekLow ?? null,
      currency: quote.currency ?? "USD",
    };
  } catch (error) {
    // Silently return null — the chatbot will still work without stock data
    console.error(`Failed to fetch stock data for ${ticker}:`, error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Extract all stock ticker symbols from a user's message
//
// Matches patterns like: AAPL, TSLA, MSFT, BRK.B
// Ignores common short words that happen to be all-caps
// ─────────────────────────────────────────────────────────────
export function extractTickers(message) {
  // Match 1-5 uppercase letters, optionally followed by . and more letters (e.g. BRK.B)
  const tickerRegex = /\b([A-Z]{1,5}(?:\.[A-Z]{1,2})?)\b/g;

  // Words to ignore — common English words that look like tickers
  const IGNORE_LIST = new Set([
    "I", "A", "AN", "THE", "IS", "IT", "IN", "ON", "AT", "TO", "BE",
    "DO", "GO", "US", "AM", "PM", "OR", "AND", "FOR", "NOT", "BUT",
    "CAN", "HAS", "HAD", "YOU", "WAS", "ARE", "ALL", "ANY", "ETF",
    "CEO", "IPO", "GDP", "USA", "UK", "AI", "OK", "TV", "NO", "YES",
  ]);

  const matches = message.match(tickerRegex) ?? [];

  // De-duplicate and filter out ignored words
  const tickers = [...new Set(matches)].filter(
    (word) => !IGNORE_LIST.has(word)
  );

  return tickers;
}

// ─────────────────────────────────────────────────────────────
// Format stock data as a readable string for Gemini's context
// ─────────────────────────────────────────────────────────────
export function formatStockContext(stock) {
  const direction = stock.change >= 0 ? "▲" : "▼";
  const sign = stock.change >= 0 ? "+" : "";

  return `
${stock.name} (${stock.ticker})
Price: ${stock.currency} ${stock.price.toFixed(2)}
Change: ${direction} ${sign}${stock.change.toFixed(2)} (${sign}${stock.changePercent.toFixed(2)}%)
Volume: ${stock.volume.toLocaleString()}
Market Cap: ${stock.marketCap ? "$" + (stock.marketCap / 1e9).toFixed(2) + "B" : "N/A"}
52-Week High: ${stock.high52Week?.toFixed(2) ?? "N/A"}
52-Week Low: ${stock.low52Week?.toFixed(2) ?? "N/A"}
  `.trim();
}