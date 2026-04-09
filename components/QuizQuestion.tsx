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
  const delays = ["0ms", "30ms", "60ms", "90ms"];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Question card — pops in */}
      <Card className="min-h-[200px] flex items-center justify-center text-center p-8 bg-card border-2 animate-pop">
        <CardContent className="p-0">
          <h2 className="text-2xl font-semibold leading-tight">{question}</h2>
        </CardContent>
      </Card>

      {/* Options — stagger in */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, i) => {
          const isSelected = selectedOption === i;
          return (
            <Button
              key={i}
              variant={isSelected ? "default" : "outline"}
              style={{ animationDelay: delays[i] }}
              className={[
                "h-20 text-lg justify-start px-6 gap-4 border-2 animate-fade-up",
                "transition-all duration-200",
                isSelected
                  ? "scale-[1.02] shadow-md"
                  : "hover:border-primary hover:scale-[1.01] hover:shadow-sm",
              ].join(" ")}
              onClick={() => onSelect(i)}
            >
              <span className={`font-bold transition-colors ${isSelected ? "text-primary-foreground" : "text-primary"}`}>
                {letters[i]}.
              </span>
              <span className="font-medium">{option}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
