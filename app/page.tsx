"use client";

import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Loader2, FileText, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { generateContent } from "@/app/actions";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<"quiz" | "flashcard">("quiz");
  const [size] = useState("10");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.name.toLowerCase().endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNotes(ev.target?.result as string);
        setFile(null);
      };
      reader.readAsText(selected);
    } else {
      setFile(selected);
      setNotes("");
    }
    e.target.value = "";
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = () => {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("notes", notes);
        fd.append("mode", mode);
        if (file) fd.append("file", file);
        await generateContent(fd);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
        // Ignore Next.js redirect "errors" — they're not real errors
        if (!msg.includes("NEXT_REDIRECT")) setError(msg);
      }
    });
  };

  const canSubmit = (notes.trim().length >= 20 || file !== null) && !isPending;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
        <div className="w-full max-w-4xl space-y-12 text-center">
          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-destructive/40 bg-destructive/10 text-destructive text-sm font-medium animate-pop text-left">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>{error}</p>
                {error.includes("GROQ_API_KEY") && (
                  <a
                    href="https://console.groq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 font-bold hover:opacity-70 transition-opacity"
                  >
                    → Get your free API key at console.groq.com
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ── Hero heading ── */}
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tight animate-fade-up">
              Quizzy AI
            </h1>
            <p className="text-xl text-muted-foreground font-medium italic animate-stagger-1">
              Learn any topic with fun
            </p>
          </div>

          {/* ── Main card ── */}
          <Card className="border-2 shadow-xl overflow-hidden bg-card animate-stagger-2">
            <CardContent className="p-0 flex flex-col md:flex-row h-[400px]">

              {/* Drop / Input area */}
              <div
                className="flex-1 border-r-2 p-8 flex flex-col items-center justify-center space-y-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {file ? (
                  <div className="flex flex-col items-center gap-3 w-full max-w-xs animate-pop">
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-bold text-lg truncate max-w-full px-4">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB · ready to extract
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    >
                      <X className="w-4 h-4" /> Remove file
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Floating upload icon */}
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm animate-float group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">Drop your notes here</p>
                      <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT</p>
                    </div>
                    <div
                      className="w-full max-w-xs mt-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Textarea
                        placeholder="Or paste your notes here…"
                        className="resize-none bg-background border-2 min-h-[100px] transition-shadow focus:shadow-md"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="w-full md:w-80 p-8 flex flex-col justify-center space-y-6 bg-card">
                <div className="space-y-3 animate-stagger-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Select Mode
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={mode === "quiz" ? "default" : "outline"}
                      className="h-12 border-2 btn-lift transition-all duration-200"
                      onClick={() => setMode("quiz")}
                      disabled={isPending}
                    >
                      Quiz
                    </Button>
                    <Button
                      variant={mode === "flashcard" ? "default" : "outline"}
                      className="h-12 border-2 btn-lift transition-all duration-200"
                      onClick={() => setMode("flashcard")}
                      disabled={isPending}
                    >
                      Flash card
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 animate-stagger-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Quiz Size
                  </p>
                  <div className="flex gap-2">
                    {["8", "10", "12"].map((s) => (
                      <Button
                        key={s}
                        variant={size === s ? "secondary" : "ghost"}
                        className={`flex-1 border-2 transition-all duration-150 ${size === s ? "border-primary scale-105" : "border-transparent"}`}
                        disabled
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    size="icon"
                    className="w-16 h-16 rounded-full shadow-lg group btn-lift"
                    onClick={handleGenerate}
                    disabled={!canSubmit}
                  >
                    {isPending ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform duration-200" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
