"use client";

import { ScoreCircle } from "@/components/ScoreCircle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

const mockResults = [
  {
    question: "What is the capital of France?",
    correctAnswer: "Paris",
    userAnswer: "Paris",
    isCorrect: true,
  },
  {
    question: "Which hook is used for side effects in React?",
    correctAnswer: "useEffect",
    userAnswer: "useState",
    isCorrect: false,
  },
];

export default function ResultsPage() {
  const score = mockResults.filter((r) => r.isCorrect).length;
  const total = mockResults.length;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-12">
        <div className="flex justify-start">
          <Link href="/">
            <Button variant="ghost" className="gap-2 border-2 rounded-full">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <ScoreCircle score={score} total={total} />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Good effort!</h1>
            <p className="text-muted-foreground">You completed the session.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold px-2">Review</h2>
          <div className="space-y-3">
            {mockResults.map((result, i) => (
              <Card key={i} className={`border-2 ${result.isCorrect ? 'bg-primary/5' : 'bg-destructive/5'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {result.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive shrink-0 mt-1" />
                    )}
                    <div className="space-y-2 flex-1">
                      <p className="font-semibold text-lg">{result.question}</p>
                      <div className="p-3 bg-background/50 rounded-lg border text-sm">
                        <span className="text-muted-foreground font-medium uppercase tracking-tighter text-[10px] block mb-1">
                          Correct Answer
                        </span>
                        <p className="font-bold">{result.correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center pt-8">
          <Link href="/quiz">
            <Button size="lg" className="h-16 px-12 text-lg gap-3 shadow-xl rounded-full">
              <RefreshCcw className="w-5 h-5" />
              Retry Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
