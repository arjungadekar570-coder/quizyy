"use client";

import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Loader2, FileText, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { generateContent } from "@/app/actions";

export default function Home() {
  const [mode, setMode] = useState<"quiz" | "flashcard">("quiz");
  const [size] = useState("10"); // forced to 10 per spec
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // For .txt files, read content client-side and populate the textarea
    if (selected.name.toLowerCase().endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNotes(ev.target?.result as string);
        setFile(null); // no need to send the file; notes has the text
      };
      reader.readAsText(selected);
    } else {
      // PDF / DOCX — keep as file, extraction happens server-side
      setFile(selected);
      setNotes(""); // clear textarea to avoid confusion
    }

    // Reset the input so the same file can be re-selected if needed
    e.target.value = "";
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleGenerate = () => {
    if (isPending) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("notes", notes);
      fd.append("mode", mode);
      if (file) fd.append("file", file);
      await generateContent(fd);
    });
  };

  const canSubmit = (notes.trim().length >= 20 || file !== null) && !isPending;

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
              {/* ── Drop / Input area ─────────────────────────────────────────── */}
              <div
                className="flex-1 border-r-2 p-8 flex flex-col items-center justify-center space-y-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => !file && fileInputRef.current?.click()}
              >
                {/* Hidden real file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {file ? (
                  /* File selected indicator */
                  <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-bold text-lg truncate max-w-full px-4">
                      {file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB · ready to extract
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                    >
                      <X className="w-4 h-4" /> Remove file
                    </Button>
                  </div>
                ) : (
                  /* Default upload + textarea */
                  <>
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">Drop your notes here</p>
                      <p className="text-sm text-muted-foreground">
                        PDF, DOCX, or TXT
                      </p>
                    </div>
                    <div
                      className="w-full max-w-xs mt-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Textarea
                        placeholder="Or paste your notes here…"
                        className="resize-none bg-background border-2 min-h-[100px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* ── Controls ─────────────────────────────────────────────────── */}
              <div className="w-full md:w-80 p-8 flex flex-col justify-center space-y-6 bg-card">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Select Mode
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={mode === "quiz" ? "default" : "outline"}
                      className="h-12 border-2"
                      onClick={() => setMode("quiz")}
                      disabled={isPending}
                    >
                      Quiz
                    </Button>
                    <Button
                      variant={mode === "flashcard" ? "default" : "outline"}
                      className="h-12 border-2"
                      onClick={() => setMode("flashcard")}
                      disabled={isPending}
                    >
                      Flash card
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Quiz Size
                  </p>
                  <div className="flex gap-2">
                    {["8", "10", "12"].map((s) => (
                      <Button
                        key={s}
                        variant={size === s ? "secondary" : "ghost"}
                        className={`flex-1 border-2 ${size === s ? "border-primary" : "border-transparent"}`}
                        disabled // locked to 10 per spec
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    size="icon"
                    className="w-16 h-16 rounded-full shadow-lg group"
                    onClick={handleGenerate}
                    disabled={!canSubmit}
                  >
                    {isPending ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
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
