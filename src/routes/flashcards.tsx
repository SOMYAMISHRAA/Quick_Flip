import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { flashcards } from "@/lib/study-data";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards — QuickFlip" },
      {
        name: "description",
        content: "Flip through your generated study flashcards one card at a time and track your progress.",
      },
      { property: "og:title", content: "Flashcards — QuickFlip" },
      {
        property: "og:description",
        content: "Tap to flip, swipe through your deck, and track progress card by card.",
      },
    ],
  }),
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[index];
  const total = flashcards.length;

  const go = (delta: number) => {
    setFlipped(false);
    setIndex((i) => Math.min(total - 1, Math.max(0, i + delta)));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Link to="/" className="min-w-0 truncate text-sm text-muted-foreground hover:text-foreground">
          ← QuickFlip
        </Link>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          Card {index + 1} of {total}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        aria-label="Flip card"
        className="flip-scene mt-8 w-full text-left"
      >
        <div className={`flip-inner min-h-72 w-full ${flipped ? "flip-inner-flipped" : ""}`}>
          <div className="flip-face flex min-h-72 w-full flex-col justify-between rounded-3xl border border-border bg-card p-6">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Question</span>
            <p className="text-2xl font-semibold leading-snug">{card.front}</p>
            <span className="text-xs text-muted-foreground">Tap to reveal answer</span>
          </div>
          <div className="flip-face flip-face-back absolute inset-0 flex min-h-72 w-full flex-col justify-between rounded-3xl border border-primary/40 bg-primary/10 p-6">
            <span className="text-xs uppercase tracking-widest text-primary">Answer</span>
            <p className="text-xl font-medium leading-relaxed">{card.back}</p>
            <span className="text-xs text-muted-foreground">Tap to flip back</span>
          </div>
        </div>
      </button>

      <div className="mt-8 flex gap-3">
        <Button
          variant="secondary"
          className="h-12 flex-1 rounded-2xl"
          onClick={() => go(-1)}
          disabled={index === 0}
        >
          Previous
        </Button>
        {index === total - 1 ? (
          <Button asChild className="h-12 flex-1 rounded-2xl">
            <Link to="/quiz">Start quiz</Link>
          </Button>
        ) : (
          <Button className="h-12 flex-1 rounded-2xl" onClick={() => go(1)}>
            Next
          </Button>
        )}
      </div>
    </main>
  );
}
