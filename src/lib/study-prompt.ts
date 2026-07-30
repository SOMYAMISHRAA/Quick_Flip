import { z } from "zod";
import type { QuizDifficulty, StudySet } from "./study-generation";

export const SYSTEM_PROMPT = `You are an expert study assistant. You read study notes and generate learning materials from them.

Rules:
- Generate exactly 10 flashcards. Each has a "question" (front) and an "answer" (back). Cover the most important concepts, not trivial details.
- Generate exactly 5 multiple-choice quiz questions from the same notes, with difficulty distributed as 2 easy, 2 medium, 1 hard.
  - "easy" = direct recall of a fact stated in the notes
  - "medium" = requires connecting two ideas from the notes
  - "hard" = requires applying or inferring beyond what is explicitly stated
- Each quiz question has exactly 4 options and exactly one correct answer, identified by correctAnswerIndex (0-based).
- Never invent facts that the notes do not support.
- If the notes are too short or unclear to produce meaningful material, still return the full structure and describe the limitation in the "warning" field. Otherwise "warning" must be null.
- Respond with data only: no markdown, no code fences, no commentary.`;

export function buildUserPrompt(notes: string) {
  return `STUDY NOTES:\n"""\n${notes}\n"""`;
}

const DIFFICULTIES: QuizDifficulty[] = ["easy", "medium", "hard"];

export function normalizeStudySet(raw: unknown): StudySet {
  const value = (raw ?? {}) as Record<string, unknown>;
  const rawCards = Array.isArray(value.flashcards) ? value.flashcards : [];
  const rawQuiz = Array.isArray(value.quiz) ? value.quiz : [];

  const flashcards = rawCards
    .map((c, i) => {
      const card = (c ?? {}) as Record<string, unknown>;
      return {
        id: i + 1,
        question: String(card.question ?? "").trim(),
        answer: String(card.answer ?? "").trim(),
      };
    })
    .filter((c) => c.question && c.answer)
    .slice(0, 10);

  const quiz = rawQuiz
    .map((q, i) => {
      const item = (q ?? {}) as Record<string, unknown>;
      const options = (Array.isArray(item.options) ? item.options : [])
        .map((o) => String(o ?? "").trim())
        .filter(Boolean)
        .slice(0, 4);
      const difficulty = String(item.difficulty ?? "easy").toLowerCase() as QuizDifficulty;
      const index = Number(item.correctAnswerIndex);
      return {
        id: i + 1,
        difficulty: DIFFICULTIES.includes(difficulty) ? difficulty : ("easy" as QuizDifficulty),
        question: String(item.question ?? "").trim(),
        options,
        correctAnswerIndex: Number.isInteger(index) && index >= 0 && index < options.length ? index : 0,
        explanation: String(item.explanation ?? "").trim(),
      };
    })
    .filter((q) => q.question && q.options.length === 4)
    .slice(0, 5);

  const warning =
    typeof value.warning === "string" && value.warning.trim() ? value.warning.trim() : null;

  return { flashcards, quiz, warning };
}

export const StudySetSchema = z.object({
  flashcards: z.array(
    z.object({
      id: z.number(),
      question: z.string(),
      answer: z.string(),
    }),
  ),
  quiz: z.array(
    z.object({
      id: z.number(),
      difficulty: z.string(),
      question: z.string(),
      options: z.array(z.string()),
      correctAnswerIndex: z.number(),
      explanation: z.string(),
    }),
  ),
  warning: z.string().nullable(),
});
