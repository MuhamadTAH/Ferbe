import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { requireUser, getUserOrNull } from "./users";

/**
 * Fetches words for a category (or all) and merges the signed-in user's
 * word-mastery status. Unauthenticated callers get the words with
 * isMastered=false (queries cannot create the user record).
 */
export const getWordsWithProgress = query({
  args: {
    categorySlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserOrNull(ctx);
    const userId = user?._id ?? null;

    let words;
    if (args.categorySlug) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug as string))
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

    if (!userId) {
      return words.map((word) => ({ ...word, isMastered: false }));
    }

    const progressRecords = await ctx.db
      .query("wordProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const progressMap = new Map(
      progressRecords.map((p) => [p.wordId.toString(), p.isMastered])
    );

    return words.map((word) => ({
      ...word,
      isMastered: progressMap.get(word._id.toString()) ?? false,
    }));
  },
});

/** Toggles mastered state for a word (Practice mode). Requires auth. */
export const toggleMastered = mutation({
  args: {
    wordId: v.id("words"),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const existing = await ctx.db
      .query("wordProgress")
      .withIndex("by_user_word", (q) =>
        q.eq("userId", user._id).eq("wordId", args.wordId)
      )
      .first();

    if (existing) {
      const nextState = !existing.isMastered;
      await ctx.db.patch(existing._id, {
        isMastered: nextState,
        lastReviewedAt: Date.now(),
      });
      return nextState;
    }

    await ctx.db.insert("wordProgress", {
      userId: user._id,
      wordId: args.wordId,
      isMastered: true,
      lastReviewedAt: Date.now(),
    });
    return true;
  },
});

/** Explicitly sets mastered state (quiz promote/demote). Requires auth. */
export const setWordMastery = mutation({
  args: {
    wordId: v.id("words"),
    isMastered: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const existing = await ctx.db
      .query("wordProgress")
      .withIndex("by_user_word", (q) =>
        q.eq("userId", user._id).eq("wordId", args.wordId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isMastered: args.isMastered,
        lastReviewedAt: Date.now(),
      });
      return args.isMastered;
    }

    await ctx.db.insert("wordProgress", {
      userId: user._id,
      wordId: args.wordId,
      isMastered: args.isMastered,
      lastReviewedAt: Date.now(),
    });
    return args.isMastered;
  },
});

/** Resets mastery for all words in a category. Requires auth. */
export const resetCategoryProgress = mutation({
  args: {
    categorySlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const slug = args.categorySlug ?? "basics";

    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!category) {
      return { resetCount: 0 };
    }

    const categoryWords = await ctx.db
      .query("words")
      .withIndex("by_category", (q) => q.eq("categoryId", category._id))
      .collect();

    const categoryWordIdSet = new Set(
      categoryWords.map((w) => w._id.toString())
    );

    const records = await ctx.db
      .query("wordProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const recordsToReset = records.filter(
      (record) =>
        categoryWordIdSet.has(record.wordId.toString()) && record.isMastered
    );

    await Promise.all(
      recordsToReset.map((record) =>
        ctx.db.patch(record._id, {
          isMastered: false,
          lastReviewedAt: Date.now(),
        })
      )
    );

    return { resetCount: recordsToReset.length };
  },
});

/**
 * Internal batch mutation to ingest words into a category.
 * Not callable from clients.
 */
export const seedCategoryWords = internalMutation({
  args: {
    categorySlug: v.optional(v.string()),
    categoryName: v.optional(v.string()),
    words: v.array(
      v.object({
        kurdishText: v.string(),
        englishText: v.string(),
        transliteration: v.string(),
        imageUrl: v.string(),
        kurdishAudioUrl: v.optional(v.union(v.string(), v.null())),
        englishAudioUrl: v.optional(v.union(v.string(), v.null())),
        order: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const slug = args.categorySlug ?? "basics";
    const name =
      args.categoryName ?? (slug.charAt(0).toUpperCase() + slug.slice(1));

    let category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!category) {
      const categoryId = await ctx.db.insert("categories", {
        name,
        slug,
        description: `${name} Kurdish Sorani vocabulary`,
      });
      category = await ctx.db.get(categoryId);
    }

    if (!category) throw new Error("Failed to find or create category");

    const existingWords = await ctx.db
      .query("words")
      .withIndex("by_category", (q) => q.eq("categoryId", category!._id))
      .collect();

    const existingKurdishTexts = new Set(
      existingWords.map((w) => w.kurdishText.trim())
    );

    let inserted = 0;
    let skipped = 0;
    let currentOrder = existingWords.length;

    for (const word of args.words) {
      const trimmedKurdish = word.kurdishText.trim();
      if (existingKurdishTexts.has(trimmedKurdish)) {
        skipped++;
        continue;
      }

      currentOrder++;
      await ctx.db.insert("words", {
        categoryId: category._id,
        kurdishText: trimmedKurdish,
        englishText: word.englishText.trim(),
        transliteration: word.transliteration.trim(),
        imageUrl: word.imageUrl,
        kurdishAudioUrl: word.kurdishAudioUrl ?? undefined,
        englishAudioUrl: word.englishAudioUrl ?? undefined,
        order: word.order ?? currentOrder,
      });

      existingKurdishTexts.add(trimmedKurdish);
      inserted++;
    }

    return {
      categoryId: category._id,
      categorySlug: slug,
      inserted,
      skipped,
      total: args.words.length,
    };
  },
});

/**
 * Admin-secured mutation for scripts when running via HTTP client.
 * SECURITY: ADMIN_SEED_SECRET is mandatory — no committed default.
 */
export const seedCategoryWordsAdmin = mutation({
  args: {
    adminSecret: v.string(),
    categorySlug: v.optional(v.string()),
    categoryName: v.optional(v.string()),
    words: v.array(
      v.object({
        kurdishText: v.string(),
        englishText: v.string(),
        transliteration: v.string(),
        imageUrl: v.string(),
        kurdishAudioUrl: v.optional(v.union(v.string(), v.null())),
        englishAudioUrl: v.optional(v.union(v.string(), v.null())),
        order: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const expectedSecret = process.env.ADMIN_SEED_SECRET;
    if (!expectedSecret) {
      throw new Error(
        "ADMIN_SEED_SECRET is not configured on the Convex deployment"
      );
    }
    if (args.adminSecret !== expectedSecret) {
      throw new Error("Unauthorized: Invalid admin secret");
    }

    const slug = args.categorySlug ?? "basics";
    const name =
      args.categoryName ?? (slug.charAt(0).toUpperCase() + slug.slice(1));

    let category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!category) {
      const categoryId = await ctx.db.insert("categories", {
        name,
        slug,
        description: `${name} Kurdish Sorani vocabulary`,
      });
      category = await ctx.db.get(categoryId);
    }

    if (!category) throw new Error("Failed to find or create category");

    const existingWords = await ctx.db
      .query("words")
      .withIndex("by_category", (q) => q.eq("categoryId", category!._id))
      .collect();

    const existingKurdishTexts = new Set(
      existingWords.map((w) => w.kurdishText.trim())
    );

    let inserted = 0;
    let skipped = 0;
    let currentOrder = existingWords.length;

    for (const word of args.words) {
      const trimmedKurdish = word.kurdishText.trim();
      if (existingKurdishTexts.has(trimmedKurdish)) {
        skipped++;
        continue;
      }

      currentOrder++;
      await ctx.db.insert("words", {
        categoryId: category._id,
        kurdishText: trimmedKurdish,
        englishText: word.englishText.trim(),
        transliteration: word.transliteration.trim(),
        imageUrl: word.imageUrl,
        kurdishAudioUrl: word.kurdishAudioUrl ?? undefined,
        englishAudioUrl: word.englishAudioUrl ?? undefined,
        order: word.order ?? currentOrder,
      });

      existingKurdishTexts.add(trimmedKurdish);
      inserted++;
    }

    return {
      categoryId: category._id,
      categorySlug: slug,
      inserted,
      skipped,
      total: args.words.length,
    };
  },
});
