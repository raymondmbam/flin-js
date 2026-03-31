import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "./systemPrompt.js";

// Initialize the Gemini client once (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The Gemini model we're using
const MODEL_NAME = "gemini-3-flash-preview";

// ─────────────────────────────────────────────────────────────
// Send a message to Gemini and get Flin's reply
//
// @param userMessage  - The latest message from the user
// @param history      - All previous turns in the conversation
// @param stockContext - Optional: live stock data injected into prompt
// ─────────────────────────────────────────────────────────────
export async function askFlin(userMessage, history, stockContext, userName) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: getSystemPrompt(userName),  // personalized
  });

  // If we have live stock data, prepend it to the user's message
  // so Flin can reference it in the answer
  const fullUserMessage = stockContext
    ? `[LIVE STOCK DATA]\n${stockContext}\n\n[USER QUESTION]\n${userMessage}`
    : userMessage;

  // Start a chat session with the full conversation history
  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7, // balanced: not too creative, not too robotic
    },
  });

  // Send the message and wait for Flin's reply
  const result = await chat.sendMessage(fullUserMessage);
  const response = await result.response;

  return response.text();
}