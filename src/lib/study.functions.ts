import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { SYSTEM_PROMPT, StudySetSchema, buildUserPrompt, normalizeStudySet } from "./study-prompt";

export const generateStudySet = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ notes: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured yet.");

    const notes = data.notes.trim();
    if (!notes) throw new Error("Paste some notes first.");

    const gateway = createLovableAiGatewayProvider(apiKey);

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        system: SYSTEM_PROMPT,
        prompt: buildUserPrompt(notes),
        output: Output.object({ schema: StudySetSchema }),
      });
      return normalizeStudySet(output);
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error) && error.text) {
        const cleaned = error.text.replace(/^```(?:json)?/i, "").replace(/```$/, "");
        return normalizeStudySet(JSON.parse(cleaned));
      }
      const message = error instanceof Error ? error.message : "";
      if (message.includes("429")) throw new Error("Rate limit reached — try again in a moment.");
      if (message.includes("402")) throw new Error("AI credits exhausted. Add credits to continue.");
      throw new Error("Could not generate study materials. Please try again.");
    }
  });
