"use client";

import { useState } from "react";
import { Flashcard } from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export type FlashcardItem = {
  front: string;
  back: string;
};

const MOCK_FLASHCARDS: FlashcardItem[] = [
  { front: "What is the capital of France?", back: "Paris" },
  { front: "What does JSX stand for?", back: "JavaScript XML" },
  { front: "Who developed React?", back: "Meta (Facebook)" },
  { front: "What is a major river in Egypt?", back: "The Nile" },
  { front: "How many legs does a spider have?", back: "Eight" },
  { front: "What is the square root of 64?", back: "8" },
  { front: "What color is a banana when ripe?", back: "Yellow" },
];

interface FlashcardClientProps {
  flashcards?: FlashcardItem[] | null;
}

export default function FlashcardClient({ flashcards }: FlashcardClientProps) {
  const data =
    flashcards && flashcards.length > 0 ? flashcards : MOCK_FLASHCARDS;
  const [current, setCurrent] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col page-enter">
      <header className="p-6 border-b flex items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 overflow-x-auto">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex gap-2">
            {data.map((_, i) => (
              <Button
                key={i}
                variant={current === i ? "default" : "outline"}
                className="w-10 h-10 p-0 rounded-md border-2"
                onClick={() => setCurrent(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>

        <Link href="/quiz">
          <Button variant="outline" className="gap-2 border-2 shrink-0">
            <RefreshCw className="w-4 h-4" />
            Switch Quiz
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <Flashcard front={data[current].front} back={data[current].back} />
      </main>

      <footer className="p-6 border-t bg-card/50">
        <div className="max-w-lg mx-auto flex justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 gap-2 border-2 h-14 btn-lift"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 gap-2 border-2 h-14 btn-lift"
            disabled={current === data.length - 1}
            onClick={() => setCurrent(current + 1)}
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
