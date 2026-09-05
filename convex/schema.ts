import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  words: defineTable({
    categoryId: v.id("categories"),
    kurdishText: v.string(),
    englishText: v.string(),
    transliteration: v.string(),
    imageUrl: v.string(),
    kurdishAudioUrl: v.string(),
    englishAudioUrl: v.string(),
    order: v.optional(v.number()),
  }).index("by_category", ["categoryId"]),

  userProgress: defineTable({
    userId: v.string(),
    wordId: v.id("words"),
    isMastered: v.boolean(),
    lastReviewedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_word", ["userId", "wordId"]),
});
