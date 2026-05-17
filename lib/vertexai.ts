import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY environment variable is not set. Please set it in .env.local");
}

export const ai = new GoogleGenAI({ apiKey });

export const MODEL_NAME = "gemini-1.5-flash";
export const GENERATION_CONFIG = {
  maxOutputTokens: 8192,
  temperature: 0.1,
  responseMimeType: "application/json",
};
