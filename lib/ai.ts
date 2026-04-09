import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export type QuizQuestion = {
  question: string;
  options: string[]; // plain text, NO "A. " prefix — the UI adds letters itself
  correctIndex: number;
  explanation: string;
};

export type Flashcard = {
  front: string;
  back: string;
};

export async function generateQuizOrFlashcard(
  notes: string,
  mode: "quiz" | "flashcard",
  count: number = 10
): Promise<QuizQuestion[] | Flashcard[]> {
  const systemPrompt =
    mode === "quiz"
      ? `You are a strict JSON-only API. Your entire response must be a single valid JSON object — no markdown, no code fences, no commentary, no extra text whatsoever.

Required response structure:
{"items": [{"question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0, "explanation": "..."}, ...]}

Rules:
- Return exactly ${count} high-quality multiple-choice questions based on the provided notes.
- Each item must have: "question" (string), "options" (array of exactly 4 plain-text strings — NO letter prefix like "A." — just plain answer text), "correctIndex" (integer 0-3), "explanation" (string).
- correctIndex 0 = first option is correct, 1 = second, etc.
- Questions must be factual, clear, and directly derived from the notes.
- Do NOT output anything except the JSON object.`
      : `You are a strict JSON-only API. Your entire response must be a single valid JSON object — no markdown, no code fences, no commentary, no extra text whatsoever.

Required response structure:
{"items": [{"front": "...", "back": "..."}, ...]}

Rules:
- Return exactly ${count} high-quality flashcards based on the provided notes.
- "front": concise question or key term (max 150 characters).
- "back": precise, informative answer or definition (max 400 characters).
- Flashcards must be directly based on the notes.
- Do NOT output anything except the JSON object.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate ${count} ${mode === "quiz" ? "quiz questions" : "flashcards"} from the following notes:\n\n${notes}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 4096,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed.items)) {
    throw new Error(
      "Groq returned unexpected JSON shape — missing 'items' array."
    );
  }

  return parsed.items;
}
