"use server";

import { redirect } from "next/navigation";
import { generateQuizOrFlashcard, type QuizQuestion, type Flashcard } from "@/lib/ai";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

// ── PDF text extraction via pdf2json ──────────────────────────────────────────
function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    import("pdf2json").then(({ default: PDFParser }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parser = new (PDFParser as any)();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parser.on("pdfParser_dataReady", (data: any) => {
        const text: string = (data.Pages ?? [])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((page: any) =>
            (page.Texts ?? [])
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((t: any) => { try { return decodeURIComponent(t.R?.[0]?.T ?? ""); } catch { return ""; } })
              .join(" ")
          )
          .join("\n");
        resolve(text.trim());
      });
      parser.on("pdfParser_dataError", reject);
      parser.parseBuffer(buffer);
    });
  });
}

// ── File → plain text ─────────────────────────────────────────────────────────
async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt")) return buffer.toString("utf-8");

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (name.endsWith(".pdf")) return extractPdfText(buffer);

  throw new Error(
    "Unsupported file type. Please upload a .pdf, .docx, or .txt file."
  );
}

// ── Derive a short readable topic from the notes ──────────────────────────────
function deriveTopic(notes: string, file: File | null): string {
  if (file) {
    // Strip extension and clean up filename
    return file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim();
  }
  // Use the first non-empty line of pasted notes (max 60 chars)
  const firstLine = notes
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0) ?? "Untitled";
  return firstLine.slice(0, 60);
}

// ── Server Action ─────────────────────────────────────────────────────────────
export async function generateContent(formData: FormData) {
  let notes = (formData.get("notes") as string | null) ?? "";
  const mode = formData.get("mode") as "quiz" | "flashcard";
  const file = formData.get("file") as File | null;

  // Extract text from uploaded file if present
  if (file && file.size > 0) {
    notes = await extractTextFromFile(file);
  }

  if (!notes || notes.trim().length < 20) {
    throw new Error(
      "Please provide more detailed notes (at least 20 characters)."
    );
  }

  // Validate Groq API key before attempting generation
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey || groqKey === "your_groq_api_key_here") {
    throw new Error(
      "GROQ_API_KEY is not set. Open .env.local in the project root and add your key from console.groq.com"
    );
  }

  // Generate content with Groq
  const items = await generateQuizOrFlashcard(notes.trim(), mode, 10);

  // Derive a human-readable topic label
  const topic = deriveTopic(notes, file && file.size > 0 ? file : null);

  // Save to Convex history via the HTTP API (works in Server Actions)
  await fetchMutation(
    api.history.saveHistory,
    {
      topic,
      mode,
      data:
        mode === "quiz"
          ? { kind: "quiz", items: items as QuizQuestion[] }
          : { kind: "flashcard", items: items as Flashcard[] },
    },
    { url: process.env.NEXT_PUBLIC_CONVEX_URL }
  );

  // Redirect to the appropriate page with data in URL
  const encoded = encodeURIComponent(JSON.stringify(items));
  redirect(mode === "quiz" ? `/quiz?data=${encoded}` : `/flashcard?data=${encoded}`);
}
