import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// NOTE: Nothing is deployed yet (no Convex deployment exists), so this schema
// restructures freely to match the build spec:
// - word-mastery progress moved from `userProgress` to `wordProgress`
// - `userProgress` is now lesson-level per the original spec
export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  userStats: defineTable({
    userId: v.id("users"),
    currentStreak: v.number(),
    hearts: v.number(),
    gems: v.optional(v.number()),
    lastActiveDate: v.optional(v.string()),
    totalXp: v.number(),
    activeStatus: v.optional(v.string()),
    streakFreezeActive: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),

  courses: defineTable({
    title: v.string(),
    slug: v.string(),
    sourceLanguage: v.string(),
    targetLanguage: v.string(),
  }).index("by_slug", ["slug"]),

  units: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    order: v.number(),
  }).index("by_course", ["courseId"]),

  lessons: defineTable({
    unitId: v.id("units"),
    title: v.string(),
    order: v.number(),
    xpReward: v.number(),
  }).index("by_unit", ["unitId"]),

  exercises: defineTable({
    lessonId: v.id("lessons"),
    type: v.union(
      v.literal("multiple_choice"),
      v.literal("word_bank"),
      v.literal("audio_match")
    ),
    promptText: v.string(),
    solutionData: v.any(),
    distractors: v.array(v.string()),
    order: v.number(),
  }).index("by_lesson", ["lessonId", "order"]),

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
    kurdishAudioUrl: v.optional(v.string()),
    englishAudioUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  }).index("by_category", ["categoryId"]),

  wordProgress: defineTable({
    userId: v.id("users"),
    wordId: v.id("words"),
    isMastered: v.boolean(),
    lastReviewedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_word", ["userId", "wordId"]),

  userProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    isCompleted: v.boolean(),
    score: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_lesson", ["userId", "lessonId"]),

  userQuests: defineTable({
    userId: v.id("users"),
    questId: v.string(),
    claimedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_quest", ["userId", "questId"]),
});
