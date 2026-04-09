"use client";

import { useEffect, useState } from "react";

interface ScoreCircleProps {
  score: number;
  total: number;
}

export function ScoreCircle({ score, total }: ScoreCircleProps) {
  const percentage = (score / total) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  // Animate the arc from 0 → target on mount
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOffset(circumference - (percentage / 100) * circumference);
    }, 60); // slight delay so the page is visible first
    return () => clearTimeout(timeout);
  }, [circumference, percentage]);

  // Animate the score counter
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    if (score === 0) return;
    let current = 0;
    const step = Math.ceil(score / 12);
    const interval = setInterval(() => {
      current = Math.min(current + step, score);
      setDisplayScore(current);
      if (current >= score) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center w-64 h-64 animate-score-in">
      <svg className="w-full h-full transform -rotate-90">
        {/* Track */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-muted/20"
        />
        {/* Arc — animated via JS state */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-[stroke-dashoffset] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Score
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-6xl font-black tabular-nums transition-all">
            {displayScore}
          </span>
          <span className="text-2xl text-muted-foreground font-semibold">
            /{total}
          </span>
        </div>
      </div>
    </div>
  );
}
