"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 w-full max-w-lg aspect-[3/4] cursor-pointer group animate-pop"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full preserve-3d",
          "transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.34,1.26,0.64,1)]",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front */}
        <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center border-2 bg-card shadow-sm group-hover:shadow-lg group-hover:border-primary/40 transition-shadow duration-300">
          {/* Subtle shimmer on hover */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <p className="text-2xl font-semibold relative z-10">{front}</p>
          <p className="mt-8 text-sm text-muted-foreground uppercase tracking-widest animate-pulse relative z-10">
            Tap to flip
          </p>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-8 text-center border-2 bg-primary text-primary-foreground shadow-sm">
          {/* Radial glow */}
          <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,_oklch(1_0_0_/_.08)_0%,_transparent_70%)] pointer-events-none" />
          <p className="text-2xl font-medium relative z-10">{back}</p>
        </Card>
      </div>
    </div>
  );
}
