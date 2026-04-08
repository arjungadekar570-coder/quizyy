"use client";

import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [mode, setMode] = useState<"quiz" | "flashcard">("quiz");
  const [size, setSize] = useState("10");

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-4xl space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tight">Quizzy AI</h1>
            <p className="text-xl text-muted-foreground font-medium italic">
              Learn any topic with fun
            </p>
          </div>

          <Card className="border-2 shadow-xl overflow-hidden bg-card">
            <CardContent className="p-0 flex flex-col md:flex-row h-[400px]">
              {/* Drop area */}
              <div className="flex-1 border-r-2 p-8 flex flex-col items-center justify-center space-y-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">Drop your notes here</p>
                  <p className="text-sm text-muted-foreground">PDF, TXT, or Image</p>
                </div>
                <div className="w-full max-w-xs mt-4">
                  <Textarea 
                    placeholder="Or paste your text here..." 
                    className="resize-none bg-background border-2 min-h-[100px]"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="w-full md:w-80 p-8 flex flex-col justify-center space-y-6 bg-card">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Mode</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={mode === "quiz" ? "default" : "outline"}
                      className="h-12 border-2"
                      onClick={() => setMode("quiz")}
                    >
                      Quiz
                    </Button>
                    <Button 
                      variant={mode === "flashcard" ? "default" : "outline"}
                      className="h-12 border-2"
                      onClick={() => setMode("flashcard")}
                    >
                      Flash card
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quiz Size</p>
                  <div className="flex gap-2">
                    {["8", "10", "12"].map((s) => (
                      <Button
                        key={s}
                        variant={size === s ? "secondary" : "ghost"}
                        className={`flex-1 border-2 ${size === s ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => setSize(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Link href={mode === "quiz" ? "/quiz" : "/flashcard"} passHref>
                    <Button size="icon" className="w-16 h-16 rounded-full shadow-lg group">
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
