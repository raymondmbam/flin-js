import { NextResponse } from "next/server";
import { getStockData } from "@/lib/stockApi";

// GET /api/stock?ticker=AAPL
// Returns live stock data for the given ticker
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  // Validate that a ticker was provided
  if (!ticker) {
    return NextResponse.json(
      { error: "Missing ticker parameter" },
      { status: 400 }
    );
  }

  const stockData = await getStockData(ticker);

  // Return 404 if ticker not found or invalid
  if (!stockData) {
    return NextResponse.json(
      { error: `Could not find stock data for "${ticker}"` },
      { status: 404 }
    );
  }

  return NextResponse.json(stockData);
}