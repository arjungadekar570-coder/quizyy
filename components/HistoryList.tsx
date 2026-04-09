"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { History, BookOpen, FlipHorizontal2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export function HistoryList() {
  const history = useQuery(api.history.getHistory);
  const router = useRouter();

  const handleClick = (item: NonNullable<typeof history>[number]) => {
    // Re-encode the items array and push to the correct page
    const encoded = encodeURIComponent(JSON.stringify(item.data.items));
    router.push(
      item.mode === "quiz"
        ? `/quiz?data=${encoded}`
        : `/flashcard?data=${encoded}`
    );
  };

  if (history === undefined) {
    // Loading skeleton
    return (
      <div className="space-y-1 px-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-9 rounded-md bg-muted/40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-xs text-muted-foreground">
        No history yet.
        <br />
        Generate a quiz or flashcard set to get started!
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {history.map((item) => (
        <Button
          key={item._id}
          variant="ghost"
          className="w-full justify-start font-normal text-sm h-auto py-2 px-3 gap-2 group"
          onClick={() => handleClick(item)}
          title={item.topic}
        >
          {/* Mode icon */}
          {item.mode === "quiz" ? (
            <BookOpen className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <FlipHorizontal2 className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          )}

          {/* Topic label */}
          <span className="flex-1 text-left truncate">{item.topic}</span>

          {/* Mode badge */}
          <Badge
            variant={item.mode === "quiz" ? "default" : "secondary"}
            className="text-[10px] h-5 shrink-0 hidden group-hover:flex"
          >
            {item.mode === "quiz" ? "Quiz" : "Flash"}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
