import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Shared validators (mirrored from schema.ts) ───────────────────────────────
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

const dataValidator = v.union(
  v.object({ kind: v.literal("quiz"), items: v.array(quizQuestionValidator) }),
  v.object({
    kind: v.literal("flashcard"),
    items: v.array(flashcardValidator),
  })
);

// ── Mutations ─────────────────────────────────────────────────────────────────

/** Save a newly generated quiz or flashcard set to history. */
export const saveHistory = mutation({
  args: {
    topic: v.string(),
    mode: v.union(v.literal("quiz"), v.literal("flashcard")),
    data: dataValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("history", {
      topic: args.topic,
      mode: args.mode,
      data: args.data,
    });
  },
});

// ── Queries ───────────────────────────────────────────────────────────────────

/** Return the 50 most recent history items, newest first. */
export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("history")
      .order("desc")
      .take(50);
  },
});

/** Load a single history item by ID (for re-attempt). */
export const getSingleSet = query({
  args: { id: v.id("history") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
