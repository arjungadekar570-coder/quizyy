"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-background rounded-full" />
        </div>
      </div>
      
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-4 w-3/4 mx-auto rounded-full" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight animate-pulse">Generating your quiz...</h2>
        <p className="text-muted-foreground font-medium italic">Our AI is reading through your notes</p>
      </div>
    </div>
  );
}
