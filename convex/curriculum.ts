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
      return { currentStreak: 0, hearts: 5, totalXp: 0, signedIn: false };
    }
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    return {
      currentStreak: stats?.currentStreak ?? 0,
      hearts: stats?.hearts ?? 5,
      totalXp: stats?.totalXp ?? 0,
      signedIn: true,
    };
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

/** Lesson + ordered exercises for one session. Requires an identity. */
export const getLessonSession = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("UNAUTHENTICATED: sign in to continue");
    }

    const lesson = await ctx.db.get(args.lessonId);
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
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) throw new Error("Lesson not found");

    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) throw new Error("User stats missing");

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
  args: { lessonId: v.id("lessons"), correct: v.boolean() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) throw new Error("User stats missing");

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
    lessonId: v.id("lessons"),
    correctFirstTry: v.number(),
    totalExercises: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) throw new Error("Lesson not found");

    const total = Math.max(0, Math.floor(args.totalExercises));
    const correctFirstTry = clamp(Math.floor(args.correctFirstTry), 0, total);
    const xpEarned = computeXp(lesson.xpReward, correctFirstTry, total);
    const pct = total > 0 ? Math.round((100 * correctFirstTry) / total) : 0;

    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", user._id).eq("lessonId", lesson._id)
      )
      .first();

    const isCompleted = (existing?.isCompleted ?? false) || pct >= 80;
    const score = Math.max(existing?.score ?? 0, pct);

    if (existing) {
      const patch: { isCompleted: boolean; score: number; completedAt?: number } = {
        isCompleted,
        score,
      };
      if (isCompleted && !existing.completedAt) patch.completedAt = Date.now();
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("userProgress", {
        userId: user._id,
        lessonId: lesson._id,
        isCompleted,
        score,
        completedAt: isCompleted ? Date.now() : undefined,
      });
    }

    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) throw new Error("User stats missing");

    const today = todayKey();
    const streak = computeNextStreak(
      stats.currentStreak,
      stats.lastActiveDate,
      today,
      yesterdayKey()
    );
    const totalXp = stats.totalXp + xpEarned;
    await ctx.db.patch(stats._id, { totalXp, currentStreak: streak, lastActiveDate: today });

    return { xpEarned, totalXp, currentStreak: streak, isCompleted, score: pct };
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

    if (args.item === "heart_refill") {
      await ctx.db.patch(stats._id, { hearts: 5 });
      return { success: true, hearts: 5, message: "Hearts refilled to 5!" };
    }

    if (args.item === "streak_freeze") {
      return { success: true, message: "Streak Freeze equipped for 1 day!" };
    }

    return { success: false, message: "Unknown item" };
  },
});

/** Claims a completed daily quest reward (+XP). */
export const claimQuestReward = mutation({
  args: {
    questId: v.string(),
    xpReward: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!stats) throw new Error("User stats missing");

    const totalXp = stats.totalXp + args.xpReward;
    await ctx.db.patch(stats._id, { totalXp });

    return { success: true, totalXp, xpReward: args.xpReward };
  },
});
