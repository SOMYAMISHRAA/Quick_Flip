import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { quizQuestions } from "@/lib/study-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — QuickFlip" },
      {
        name: "description",
        content: "Test yourself with multiple-choice questions, get instant right or wrong feedback, and see your final score.",
      },
      { property: "og:title", content: "Quiz — QuickFlip" },
      {
        property: "og:description",
        content: "Multiple-choice practice with instant feedback and a final score breakdown.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const total = quizQuestions.length;
  const q = quizQuestions[index];

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (index === total - 1) {
      setDone(true);
      return;
    }
    setSelected(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 py-12 text-center">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Quiz complete</span>
        <div className="mt-6 grid size-40 place-items-center rounded-full border-4 border-primary/40 bg-primary/10">
          <div>
            <div className="text-4xl font-bold text-primary">{pct}%</div>
            <div className="text-xs text-muted-foreground">
              {score} of {total}
            </div>
          </div>
        </div>
        <h1 className="mt-8 text-2xl font-bold tracking-tight">
          {pct >= 80 ? "Excellent recall" : pct >= 50 ? "Solid start" : "Worth another round"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review the deck and try again to lock these in.
        </p>
        <div className="mt-8 flex w-full gap-3">
          <Button variant="secondary" className="h-12 flex-1 rounded-2xl" asChild>
            <Link to="/flashcards">Review cards</Link>
          </Button>
          <Button className="h-12 flex-1 rounded-2xl" onClick={restart}>
            Retry quiz
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Link to="/" className="min-w-0 truncate text-sm text-muted-foreground hover:text-foreground">
          ← QuickFlip
        </Link>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          Question {index + 1} of {total}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <h1 className="mt-8 text-2xl font-semibold leading-snug tracking-tight">{q.question}</h1>

      <div className="mt-6 grid gap-3">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answerIndex;
          const isPicked = selected === i;
          let cls = "border-border bg-card hover:bg-accent";
          if (selected !== null) {
            if (isAnswer) cls = "border-success/60 bg-success/15 text-foreground";
            else if (isPicked) cls = "border-destructive/60 bg-destructive/15 text-foreground";
            else cls = "border-border bg-card opacity-55";
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-medium transition-colors ${cls}`}
            >
              <span className="min-w-0">{opt}</span>
              {selected !== null && isAnswer && <span className="shrink-0 text-success">✓</span>}
              {selected !== null && isPicked && !isAnswer && (
                <span className="shrink-0 text-destructive">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <>
          <p className="mt-5 text-sm text-muted-foreground">
            {selected === q.answerIndex
              ? "Correct — nice work."
              : `Not quite. The answer is "${q.options[q.answerIndex]}".`}
          </p>
          <Button className="mt-4 h-12 w-full rounded-2xl" onClick={next}>
            {index === total - 1 ? "See score" : "Next question"}
          </Button>
        </>
      )}
    </main>
  );
}
