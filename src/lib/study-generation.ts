export type GeneratedFlashcard = {
  id: number;
  question: string;
  answer: string;
};

export type QuizDifficulty = "easy" | "medium" | "hard";

export type GeneratedQuizQuestion = {
  id: number;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export type StudySet = {
  flashcards: GeneratedFlashcard[];
  quiz: GeneratedQuizQuestion[];
  warning: string | null;
};

const STORAGE_KEY = "quickflip:study-set";

export function saveStudySet(set: StudySet) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(set));
}

export function loadStudySet(): StudySet | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudySet;
    if (!Array.isArray(parsed.flashcards) || !Array.isArray(parsed.quiz)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearStudySet() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
