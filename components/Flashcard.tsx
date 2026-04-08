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
      className="perspective-1000 w-full max-w-lg aspect-[3/4] cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full duration-500 preserve-3d transition-transform",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front */}
        <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center border-2 bg-card shadow-sm">
          <p className="text-2xl font-semibold">{front}</p>
          <p className="mt-8 text-sm text-muted-foreground uppercase tracking-widest animate-pulse">
            Tap to flip
          </p>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-8 text-center border-2 bg-primary text-primary-foreground shadow-sm">
          <p className="text-2xl font-medium">{back}</p>
        </Card>
      </div>
    </div>
  );
}
