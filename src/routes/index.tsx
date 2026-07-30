import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuickFlip — Turn Notes Into Flashcards & Quizzes" },
      {
        name: "description",
        content:
          "Paste your notes and QuickFlip turns them into flippable flashcards and instant-feedback quizzes. Minimal, dark, mobile-first studying.",
      },
      { property: "og:title", content: "QuickFlip — Turn Notes Into Flashcards & Quizzes" },
      {
        property: "og:description",
        content: "Paste notes, get flashcards and quizzes in seconds. Study smarter with QuickFlip.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generate = () => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/flashcards" }), 700);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-12 pt-14">
      <div className="flex items-center gap-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground">
          Q
        </span>
        <span className="text-lg font-semibold tracking-tight">QuickFlip</span>
      </div>

      <h1 className="mt-10 text-4xl font-bold leading-[1.1] tracking-tight">
        Paste your notes.
        <br />
        <span className="text-primary">Flip into knowledge.</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        QuickFlip turns messy study notes into clean flashcards and quick quizzes.
      </p>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your lecture notes, textbook summary, or anything you need to memorize…"
        className="mt-8 min-h-56 resize-none rounded-2xl border-border bg-card p-4 text-base leading-relaxed placeholder:text-muted-foreground/70 focus-visible:ring-primary"
      />
      <div className="mt-2 text-right text-xs text-muted-foreground">
        {notes.trim() ? `${notes.trim().split(/\s+/).length} words` : "Demo data is used for now"}
      </div>

      <Button
        size="lg"
        onClick={generate}
        disabled={loading}
        className="mt-4 h-13 w-full rounded-2xl py-6 text-base font-semibold"
      >
        {loading ? "Generating…" : "Generate"}
      </Button>

      <div className="mt-10 grid gap-3">
        <Link
          to="/flashcards"
          className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-accent"
        >
          <span className="text-sm font-medium">Flashcards</span>
          <span className="text-xs text-muted-foreground">10 cards →</span>
        </Link>
        <Link
          to="/quiz"
          className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-accent"
        >
          <span className="text-sm font-medium">Quiz</span>
          <span className="text-xs text-muted-foreground">5 questions →</span>
        </Link>
      </div>
    </main>
  );
}
