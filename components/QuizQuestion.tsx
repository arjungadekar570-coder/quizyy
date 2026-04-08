"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedOption?: number;
  onSelect: (index: number) => void;
}

export function QuizQuestion({ question, options, selectedOption, onSelect }: QuizQuestionProps) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <Card className="min-h-[200px] flex items-center justify-center text-center p-8 bg-card border-2">
        <CardContent className="p-0">
          <h2 className="text-2xl font-semibold leading-tight">{question}</h2>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, i) => (
          <Button
            key={i}
            variant={selectedOption === i ? "default" : "outline"}
            className="h-20 text-lg justify-start px-6 gap-4 border-2 hover:border-primary transition-all duration-200"
            onClick={() => onSelect(i)}
          >
            <span className="font-bold text-primary">{letters[i]}.</span>
            <span className="font-medium">{option}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
