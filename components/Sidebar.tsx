"use client";

import { History, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const mockHistory = [
  "Capital of France",
  "React Hooks Guide",
  "WW2 Timeline",
  "Photosynthesis Basics",
  "Quantum Mechanics",
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen stick top-0 shrink-0">
      <div className="p-4 flex items-center gap-2 font-bold text-xl">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
          Q
        </div>
        Quizzy AI
      </div>

      <div className="px-4 py-2">
        <Button className="w-full justify-start gap-2" variant="outline">
          <Plus className="w-4 h-4" />
          New Quiz
        </Button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          History
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {mockHistory.map((item, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start font-normal text-sm overflow-hidden text-ellipsis whitespace-nowrap"
              >
                <History className="w-4 h-4 mr-2 shrink-0" />
                {item}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2 h-12">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">Arjun</div>
            <div className="text-xs text-muted-foreground">Free Plan</div>
          </div>
        </Button>
      </div>
    </aside>
  );
}
