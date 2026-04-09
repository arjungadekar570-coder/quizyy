"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { BookOpen, FlipHorizontal2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HistoryList() {
  const history = useQuery(api.history.getHistory);
  const router = useRouter();

  const handleClick = (item: NonNullable<typeof history>[number]) => {
    const encoded = encodeURIComponent(JSON.stringify(item.data.items));
    router.push(
      item.mode === "quiz"
        ? `/quiz?data=${encoded}`
        : `/flashcard?data=${encoded}`
    );
  };

  if (history === undefined) {
    // Shimmer skeleton
    return (
      <div className="space-y-1 px-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 80}ms` }}
            className="h-9 rounded-md bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-xs text-muted-foreground animate-fade-in">
        No history yet.
        <br />
        Generate a quiz or flashcard set to get started!
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {history.map((item, i) => (
        <Button
          key={item._id}
          variant="ghost"
          style={{ animationDelay: `${i * 20}ms` }}
          className="w-full justify-start font-normal text-sm h-auto py-2 px-3 gap-2 group animate-slide-in-left transition-all duration-150 hover:translate-x-1"
          onClick={() => handleClick(item)}
          title={item.topic}
        >
          {item.mode === "quiz" ? (
            <BookOpen className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <FlipHorizontal2 className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
          <span className="flex-1 text-left truncate">{item.topic}</span>
          <Badge
            variant={item.mode === "quiz" ? "default" : "secondary"}
            className="text-[10px] h-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            {item.mode === "quiz" ? "Quiz" : "Flash"}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
