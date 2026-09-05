import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const MOCK_BASICS_WORDS = [
  {
    kurdishText: "سڵاو",
    englishText: "Hello",
    transliteration: "Slaw",
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/slaw.mp3",
    englishAudioUrl: "/audio/hello.mp3",
    order: 1,
  },
  {
    kurdishText: "سوپاس",
    englishText: "Thank you",
    transliteration: "Supas",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/supas.mp3",
    englishAudioUrl: "/audio/thank_you.mp3",
    order: 2,
  },
  {
    kurdishText: "بەیانی باش",
    englishText: "Good morning",
    transliteration: "Beyanî bash",
    imageUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/beyani_bash.mp3",
    englishAudioUrl: "/audio/good_morning.mp3",
    order: 3,
  },
  {
    kurdishText: "ئاو",
    englishText: "Water",
    transliteration: "Aw",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/aw.mp3",
    englishAudioUrl: "/audio/water.mp3",
    order: 4,
  },
  {
    kurdishText: "نان",
    englishText: "Bread",
    transliteration: "Nan",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/nan.mp3",
    englishAudioUrl: "/audio/bread.mp3",
    order: 5,
  },
];

/**
 * Fetches words for a given category (or all) and in-memory merges each word's isMastered
 * status based on the authenticated user (with a 'dev_user' fallback when identity is null).
 */
export const getWordsWithProgress = query({
  args: {
    categorySlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject ?? "dev_user";

    let words;
    if (args.categorySlug) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug!))
        .first();

      if (!category) {
        return [];
      }

      words = await ctx.db
        .query("words")
        .withIndex("by_category", (q) => q.eq("categoryId", category._id))
        .collect();
    } else {
      words = await ctx.db.query("words").collect();
    }

    words.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Fetch user progress records for this user
    const progressRecords = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const progressMap = new Map(
      progressRecords.map((p) => [p.wordId.toString(), p.isMastered])
    );

    // Merge isMastered in memory inside the resolver before returning to client
    return words.map((word) => ({
      ...word,
      isMastered: progressMap.get(word._id.toString()) ?? false,
    }));
  },
});

/**
 * Toggles or sets mastered state for a word.
 * userId is NEVER accepted as a client argument; it is read from ctx.auth.getUserIdentity()
 * with a 'dev_user' server fallback.
 */
export const toggleMastered = mutation({
  args: {
    wordId: v.id("words"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject ?? "dev_user";

    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_word", (q) =>
        q.eq("userId", userId).eq("wordId", args.wordId)
      )
      .first();

    if (existing) {
      const nextState = !existing.isMastered;
      await ctx.db.patch(existing._id, {
        isMastered: nextState,
        lastReviewedAt: Date.now(),
      });
      return nextState;
    } else {
      await ctx.db.insert("userProgress", {
        userId,
        wordId: args.wordId,
        isMastered: true,
        lastReviewedAt: Date.now(),
      });
      return true;
    }
  },
});

/**
 * Seeds the database with the 'Basics' category and 5 mock words if not already present.
 */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    let category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", "basics"))
      .first();

    if (!category) {
      const categoryId = await ctx.db.insert("categories", {
        name: "Basics",
        slug: "basics",
        description: "Essential everyday Kurdish words and greetings",
      });
      category = await ctx.db.get(categoryId);
    }

    if (!category) throw new Error("Failed to create category");

    const existingWords = await ctx.db
      .query("words")
      .withIndex("by_category", (q) => q.eq("categoryId", category!._id))
      .collect();

    if (existingWords.length === 0) {
      for (const word of MOCK_BASICS_WORDS) {
        await ctx.db.insert("words", {
          categoryId: category._id,
          ...word,
        });
      }
    }

    return {
      success: true,
      categoryCreated: !category,
      wordCount: MOCK_BASICS_WORDS.length,
    };
  },
});
