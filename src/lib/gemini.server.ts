import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;
let cachedKey: string | null = null;

export function getGeminiClient(apiKey: string): GoogleGenAI {
  if (!client || cachedKey !== apiKey) {
    client = new GoogleGenAI({ apiKey });
    cachedKey = apiKey;
  }
  return client;
}