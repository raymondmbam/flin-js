import { NextResponse } from "next/server";
import { askFlin } from "@/lib/gemini";
import { extractTickers, getStockData, formatStockContext } from "@/lib/stockApi";

// POST /api/chat
// Body: { message: string, history: array }
// Returns: { reply: string, stockData: object | null }
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, history } = body;

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid message" },
        { status: 400 }
      );
    }

    // ── Step 1: Look for stock tickers in the user's message ──────────────
    const tickers = extractTickers(message);

    // ── Step 2: Fetch live stock data for the first ticker found ──────────
    // We only fetch one at a time to keep responses focused
    let stockData = null;
    let stockContext = "";

    if (tickers.length > 0) {
      stockData = await getStockData(tickers[0]);
      if (stockData) {
        stockContext = formatStockContext(stockData);
      }
    }

    // ── Step 3: Ask Flin (Gemini) with full history + stock context ───────
    const reply = await askFlin(message, history, stockContext || undefined);

    // ── Step 4: Return Flin's reply and any stock data ────────────────────
    return NextResponse.json({ reply, stockData });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}