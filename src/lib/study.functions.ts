import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getGeminiClient } from "./gemini.server";
import { SYSTEM_PROMPT, buildUserPrompt, normalizeStudySet } from "./study-prompt";

export const generateStudySet = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ notes: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;


    if (!apiKey) throw new Error("AI is not configured yet.");

    const notes = data.notes.trim();
    if (!notes) throw new Error("Paste some notes first.");

    const ai = getGeminiClient(apiKey);

    try {
     const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: `${SYSTEM_PROMPT}

${buildUserPrompt(notes)}

Return ONLY valid JSON.`,
});

      const text = response.text;
      
      if (!text) throw new Error("Empty response from Gemini.");

      const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

      let parsed: unknown;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        throw new Error("Could not parse AI response. Please try again.");
      }

      return normalizeStudySet(parsed);
    } catch (error) {

      
      const message = error instanceof Error ? error.message : "";
      if (message.includes("429")) throw new Error("Rate limit reached — try again in a moment.");
      if (message.includes("402") || message.includes("RESOURCE_EXHAUSTED")) {
        throw new Error("AI credits exhausted. Add credits to continue.");
      }
      if (message === "Could not parse AI response. Please try again.") throw error;
      if (message === "Empty response from Gemini.") throw new Error("Could not generate study materials. Please try again.");
      throw new Error("Could not generate study materials. Please try again.");
    }
  });