import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Shared validators for the two content types
const quizQuestionValidator = v.object({
  question: v.string(),
  options: v.array(v.string()),
  correctIndex: v.number(),
  explanation: v.string(),
});

const flashcardValidator = v.object({
  front: v.string(),
  back: v.string(),
});

export default defineSchema({
  history: defineTable({
    topic: v.string(),
    mode: v.union(v.literal("quiz"), v.literal("flashcard")),
    // Discriminated union keeps types strict on read
    data: v.union(
      v.object({
        kind: v.literal("quiz"),
        items: v.array(quizQuestionValidator),
      }),
      v.object({
        kind: v.literal("flashcard"),
        items: v.array(flashcardValidator),
      })
    ),
  }),
  // No custom index needed — Convex queries default to ascending _creationTime,
  // and we use .order("desc") in getHistory to get newest first.
});
