"use client";

import { useState } from "react";
import { QuizQuestion } from "@/components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type QuizItem = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const MOCK_QUESTIONS: QuizItem[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correctIndex: 1,
    explanation: "Paris is the capital and largest city of France.",
  },
  {
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useContext", "useEffect", "useReducer"],
    correctIndex: 2,
    explanation:
      "useEffect is the hook designed to run side effects after renders.",
  },
];

interface QuizClientProps {
  questions?: QuizItem[] | null;
}

export default function QuizClient({ questions }: QuizClientProps) {
  const data = questions && questions.length > 0 ? questions : MOCK_QUESTIONS;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const router = useRouter();

  const handleSelect = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);
  };

  const progress = ((current + 1) / data.length) * 100;

  const handleFinish = () => {
    // Encode answers + questions for the results page
    const resultData = data.map((q, i) => ({
      question: q.question,
      correctAnswer: q.options[q.correctIndex],
      explanation: q.explanation,
      userAnswer: answers[i] !== undefined ? q.options[answers[i]] : null,
      isCorrect: answers[i] === q.correctIndex,
    }));
    router.push(`/results?data=${encodeURIComponent(JSON.stringify(resultData))}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col page-enter">
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
            {current + 1} / {data.length}
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
          question={data[current].question}
          options={data[current].options}
          selectedOption={answers[current]}
          onSelect={handleSelect}
        />
      </main>

      <footer className="p-6 border-t bg-card/50">
        <div className="max-w-3xl mx-auto flex justify-between items-center whitespace-nowrap">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-2 h-14 px-8 btn-lift"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </Button>

          {current === data.length - 1 ? (
            <Button
              size="lg"
              className="gap-2 h-14 px-10 shadow-lg"
              onClick={handleFinish}
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
