"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { QuizQuestion } from "@/components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const mockQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correct: 1,
  },
  {
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useContext", "useEffect", "useReducer"],
    correct: 2,
  },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const router = useRouter();

  const handleSelect = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);
  };

  const progress = ((current + 1) / mockQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-6 border-b flex items-center justify-between gap-8 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 min-w-[200px] md:min-w-[400px]">
            <Progress value={progress} className="h-3" />
          </div>
          <span className="text-sm font-bold whitespace-nowrap">
            {current + 1} / {mockQuestions.length}
          </span>
        </div>
        
        <Link href="/flashcard">
          <Button variant="outline" className="gap-2 border-2">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Switch Flash</span>
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-5xl mx-auto w-full">
        <QuizQuestion
          question={mockQuestions[current].question}
          options={mockQuestions[current].options}
          selectedOption={answers[current]}
          onSelect={handleSelect}
        />
      </main>

      <footer className="p-6 border-t bg-card/50">
        <div className="max-w-3xl mx-auto flex justify-between items-center whitespace-nowrap">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-2 h-14 px-8"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </Button>

          {current === mockQuestions.length - 1 ? (
             <Button
                size="lg"
                className="gap-2 h-14 px-10 shadow-lg"
                onClick={() => router.push("/results")}
                disabled={answers[current] === undefined}
              >
                Finish Quiz
                <ArrowRight className="w-5 h-5" />
              </Button>
          ) : (
            <Button
              size="lg"
              className="gap-2 h-14 px-8 shadow-lg"
              onClick={() => setCurrent(current + 1)}
              disabled={answers[current] === undefined}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
