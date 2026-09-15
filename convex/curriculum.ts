import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser, getUserOrNull } from "./users";
import {
  computeNextStreak,
  computeXp,
  todayKey,
  yesterdayKey,
  clamp,
} from "./stats";

/** Signed-in stats for the path page header. Read-only, safe when signed out. */
export const getMyStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserOrNull(ctx);
    if (!user) {
      return {
        currentStreak: 0,
        hearts: 5,
        gems: 500,
        totalXp: 0,
        activeStatus: null,
        streakFreezeActive: false,
        signedIn: false,
      };
    }
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    return {
      currentStreak: stats?.currentStreak ?? 0,
      hearts: stats?.hearts ?? 5,
      gems: stats?.gems ?? 500,
      totalXp: stats?.totalXp ?? 0,
      activeStatus: stats?.activeStatus ?? null,
      streakFreezeActive: stats?.streakFreezeActive ?? false,
      signedIn: true,
    };
  },
});

/** Lists all available courses (e.g. Kurdish Sorani, English for Kurdish). */
export const getCourses = query({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").collect();
    return courses.map((c) => ({
      _id: c._id,
      title: c.title,
      slug: c.slug,
      sourceLanguage: c.sourceLanguage,
      targetLanguage: c.targetLanguage,
    }));
  },
});

/** Full course -> units -> lessons tree with the user's completion state. */
export const getCourseCurriculum = query({
  args: { courseSlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getUserOrNull(ctx);

    const course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) =>
        q.eq("slug", args.courseSlug ?? "sorani-basics")
      )
      .first();
    if (!course) return null;

    const units = await ctx.db
      .query("units")
      .withIndex("by_course", (q) => q.eq("courseId", course._id))
      .collect();
    units.sort((a, b) => a.order - b.order);

    const unitViews = [];
    for (const unit of units) {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_unit", (q) => q.eq("unitId", unit._id))
        .collect();
      lessons.sort((a, b) => a.order - b.order);

      const lessonViews = [];
      for (const lesson of lessons) {
        const progress = user
          ? await ctx.db
              .query("userProgress")
              .withIndex("by_user_lesson", (q) =>
                q.eq("userId", user._id).eq("lessonId", lesson._id)
              )
              .first()
          : undefined;
        lessonViews.push({
          _id: lesson._id,
          title: lesson.title,
          order: lesson.order,
          xpReward: lesson.xpReward,
          isCompleted: progress?.isCompleted ?? false,
          bestScore: progress?.score ?? null,
        });
      }
      unitViews.push({
        _id: unit._id,
        title: unit.title,
        order: unit.order,
        lessons: lessonViews,
      });
    }

    return {
      course: { _id: course._id, title: course.title, slug: course.slug },
      units: unitViews,
    };
  },
});

/** Lesson + ordered exercises for one session. Read-only, open to all learners. */
export const getLessonSession = query({
  args: { lessonId: v.string() },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("lessons", args.lessonId);
    if (!id) return null;
    const lesson = await ctx.db.get(id);
    if (!lesson) return null;

    const exercises = await ctx.db
      .query("exercises")
      .withIndex("by_lesson", (q) => q.eq("lessonId", lesson._id))
      .collect();
    exercises.sort((a, b) => a.order - b.order);

    return {
      lesson: {
        _id: lesson._id,
        title: lesson.title,
        order: lesson.order,
        xpReward: lesson.xpReward,
      },
      exercises: exercises.map((e) => ({
        _id: e._id,
        type: e.type,
        promptText: e.promptText,
        solutionData: e.solutionData,
        distractors: e.distractors,
        order: e.order,
      })),
    };
  },
});

/**
 * Called when a lesson session boots.
 * Owner default: hearts refill to 5 at the start of every session.
 */
export const startLesson = mutation({
  args: { lessonId: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserOrNull(ctx);
    if (!user) {
      return { hearts: 5 };
    }
    const id = ctx.db.normalizeId("lessons", args.lessonId);
    if (!id) throw new Error("Lesson not found");
    const lesson = await ctx.db.get(id);
    if (!lesson) throw new Error("Lesson not found");

    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) return { hearts: 5 };

    if (stats.hearts !== 5) {
      await ctx.db.patch(stats._id, { hearts: 5 });
    }
    return { hearts: 5 };
  },
});

/**
 * Authoritative hearts engine: the server owns the hearts value.
 * Called by the client on each wrong answer.
 */
export const recordAnswer = mutation({
  args: { lessonId: v.string(), correct: v.boolean() },
  handler: async (ctx, args) => {
    const user = await getUserOrNull(ctx);
    if (!user) return { hearts: 5 };

    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) return { hearts: 5 };

    if (!args.correct) {
      const hearts = Math.max(0, stats.hearts - 1);
      if (hearts !== stats.hearts) {
        await ctx.db.patch(stats._id, { hearts });
      }
      return { hearts };
    }
    return { hearts: stats.hearts };
  },
});

/**
 * Persists lesson completion: best-score userProgress, XP award and streak
 * update. XP is recomputed server-side from clamped inputs.
 */
export const completeLesson = mutation({
  args: {
    lessonId: v.string(),
    correctFirstTry: v.number(),
    totalExercises: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getUserOrNull(ctx);
    const id = ctx.db.normalizeId("lessons", args.lessonId);
    if (!id) throw new Error("Lesson not found");
    const lesson = await ctx.db.get(id);
    if (!lesson) throw new Error("Lesson not found");

    const total = Math.max(0, Math.floor(args.totalExercises));
    const correctFirstTry = clamp(Math.floor(args.correctFirstTry), 0, total);
    const xpEarned = computeXp(lesson.xpReward, correctFirstTry, total);
    const pct = total > 0 ? Math.round((100 * correctFirstTry) / total) : 0;
    const isCompleted = pct >= 80;

    if (!user) {
      return {
        xpEarned,
        totalXp: xpEarned,
        gemsAwarded: 5,
        gems: 505,
        currentStreak: 1,
        isCompleted,
        score: pct,
      };
    }

    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", lesson._id)
      )
      .first();

    const finalCompleted = (existing?.isCompleted ?? false) || isCompleted;
    const score = Math.max(existing?.score ?? 0, pct);

    if (existing) {
      const patch: { isCompleted: boolean; score: number; completedAt?: number } = {
        isCompleted: finalCompleted,
        score,
      };
      if (finalCompleted && !existing.completedAt) patch.completedAt = Date.now();
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("userProgress", {
        userId: user._id,
        lessonId: lesson._id,
        isCompleted: finalCompleted,
        score,
        completedAt: finalCompleted ? Date.now() : undefined,
      });
    }

    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) {
      return {
        xpEarned,
        totalXp: xpEarned,
        gemsAwarded: 5,
        gems: 505,
        currentStreak: 1,
        isCompleted: finalCompleted,
        score,
      };
    }

    const today = todayKey();
    const streak = computeNextStreak(
      stats.currentStreak,
      stats.lastActiveDate,
      today,
      yesterdayKey()
    );
    const totalXp = stats.totalXp + xpEarned;
    const currentGems = stats.gems ?? 500;
    const gemsAwarded = 5;
    const newGems = currentGems + gemsAwarded;
    await ctx.db.patch(stats._id, {
      totalXp,
      currentStreak: streak,
      lastActiveDate: today,
      gems: newGems,
    });

    return {
      xpEarned,
      totalXp,
      gemsAwarded,
      gems: newGems,
      currentStreak: streak,
      isCompleted: finalCompleted,
      score,
    };
  },
});

/** Real-time weekly leaderboard standings with league info. */
export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getUserOrNull(ctx);
    const users = await ctx.db.query("users").collect();
    const statsList = await ctx.db.query("userStats").collect();

    const statsByUser = new Map(statsList.map((s) => [s.userId, s]));

    // Real signed-in users from DB
    const realParticipants = users.map((u) => {
      const stats = statsByUser.get(u._id);
      return {
        id: u._id,
        name: u.name || "Learner",
        totalXp: stats?.totalXp ?? 0,
        currentStreak: stats?.currentStreak ?? 0,
        isCurrentUser: currentUser ? currentUser._id === u._id : false,
      };
    });

    // Cohort participants to populate the weekly league
    const cohortSeed = [
      { id: "cohort-1", name: "Aram Sorani", totalXp: 450, currentStreak: 7, isCurrentUser: false },
      { id: "cohort-2", name: "Darya Hawlerî", totalXp: 380, currentStreak: 5, isCurrentUser: false },
      { id: "cohort-3", name: "Shwan Sulaimani", totalXp: 310, currentStreak: 12, isCurrentUser: false },
      { id: "cohort-4", name: "Rojda Kurdish", totalXp: 260, currentStreak: 4, isCurrentUser: false },
      { id: "cohort-5", name: "Goran Slemani", totalXp: 210, currentStreak: 3, isCurrentUser: false },
      { id: "cohort-6", name: "Payman Duhok", totalXp: 180, currentStreak: 2, isCurrentUser: false },
      { id: "cohort-7", name: "Soran Kirkuk", totalXp: 140, currentStreak: 1, isCurrentUser: false },
      { id: "cohort-8", name: "Tara Baban", totalXp: 110, currentStreak: 6, isCurrentUser: false },
      { id: "cohort-9", name: "Zana Erbil", totalXp: 75, currentStreak: 2, isCurrentUser: false },
      { id: "cohort-10", name: "Kani Mahabad", totalXp: 40, currentStreak: 1, isCurrentUser: false },
    ];

    const all = [...realParticipants, ...cohortSeed];
    all.sort((a, b) => b.totalXp - a.totalXp);

    const leaderboard = all.slice(0, 20).map((player, index) => ({
      ...player,
      rank: index + 1,
    }));

    return {
      league: "Bronze League",
      leagueOrder: 1,
      daysRemaining: 5,
      promotionZoneCutoff: 10,
      leaderboard,
      currentUserRank: leaderboard.find((p) => p.isCurrentUser)?.rank ?? null,
    };
  },
});

/** Purchases a shop power-up item. */
export const buyShopItem = mutation({
  args: {
    item: v.union(v.literal("heart_refill"), v.literal("streak_freeze")),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) throw new Error("User stats missing");

    const currentGems = stats.gems ?? 500;

    if (args.item === "heart_refill") {
      const COST = 350;
      if (currentGems < COST) {
        throw new Error(
          `Insufficient gems: heart refill costs ${COST} gems, you have ${currentGems}.`
        );
      }
      const newGems = currentGems - COST;
      await ctx.db.patch(stats._id, { hearts: 5, gems: newGems });
      return { success: true, hearts: 5, gems: newGems, message: "Hearts refilled to 5!" };
    }

    if (args.item === "streak_freeze") {
      const COST = 200;
      if (currentGems < COST) {
        throw new Error(
          `Insufficient gems: streak freeze costs ${COST} gems, you have ${currentGems}.`
        );
      }
      const newGems = currentGems - COST;
      await ctx.db.patch(stats._id, { streakFreezeActive: true, gems: newGems });
      return { success: true, gems: newGems, message: "Streak Freeze equipped for 1 day!" };
    }

    return { success: false, message: "Unknown item" };
  },
});

/** Claims a completed daily quest reward (+XP and +Gems) and saves claim record. */
export const claimQuestReward = mutation({
  args: {
    questId: v.string(),
    xpReward: v.number(),
    gemReward: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) throw new Error("User stats missing");

    const existingClaim = await ctx.db
      .query("userQuests")
      .withIndex("by_user_quest", (q) =>
        q.eq("userId", user._id).eq("questId", args.questId)
      )
      .first();
    if (existingClaim) {
      return {
        success: false,
        message: "Quest already claimed today",
        totalXp: stats.totalXp,
        gems: stats.gems ?? 500,
      };
    }

    const gemReward = args.gemReward ?? 5;
    const currentGems = stats.gems ?? 500;
    const totalXp = stats.totalXp + args.xpReward;
    const newGems = currentGems + gemReward;

    await ctx.db.patch(stats._id, { totalXp, gems: newGems });
    await ctx.db.insert("userQuests", {
      userId: user._id,
      questId: args.questId,
      claimedAt: Date.now(),
    });

    return { success: true, totalXp, xpReward: args.xpReward, gems: newGems, gemReward };
  },
});

/** Real-time list of claimed quest IDs for the signed-in user. */
export const getMyQuests = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserOrNull(ctx);
    if (!user) return [];
    const quests = await ctx.db
      .query("userQuests")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return quests.map((q) => q.questId);
  },
});

/** Sets or clears the user's custom daily status emoji/label. */
export const setUserStatus = mutation({
  args: {
    status: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) throw new Error("User stats missing");

    await ctx.db.patch(stats._id, {
      activeStatus: args.status ?? undefined,
    });

    return { success: true, status: args.status };
  },
});
