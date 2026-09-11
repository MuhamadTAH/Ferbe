import { v } from "convex/values";
import { mutation } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

const exerciseInput = v.object({
  type: v.union(
    v.literal("multiple_choice"),
    v.literal("word_bank"),
    v.literal("audio_match")
  ),
  promptText: v.string(),
  solutionData: v.any(),
  distractors: v.array(v.string()),
  order: v.number(),
});

const lessonInput = v.object({
  title: v.string(),
  order: v.number(),
  xpReward: v.number(),
  exercises: v.array(exerciseInput),
});

const unitInput = v.object({
  title: v.string(),
  order: v.number(),
  lessons: v.array(lessonInput),
});

/**
 * Admin-secured curriculum seeding used by `npm run seed`.
 * SECURITY: ADMIN_SEED_SECRET must be set on the Convex deployment; there is
 * deliberately no committed default.
 */
export const seedCurriculum = mutation({
  args: {
    adminSecret: v.string(),
    course: v.object({
      title: v.string(),
      slug: v.string(),
      sourceLanguage: v.string(),
      targetLanguage: v.string(),
    }),
    units: v.array(unitInput),
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

    let course = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.course.slug))
      .first();
    if (!course) {
      const courseId = await ctx.db.insert("courses", { ...args.course });
      course = await ctx.db.get(courseId);
    }
    if (!course) throw new Error("Failed to create course");

    let lessonsUpserted = 0;
    let exercisesWritten = 0;

    for (const unitInput of args.units) {
      const existingUnits = await ctx.db
        .query("units")
        .withIndex("by_course", (q) => q.eq("courseId", course!._id))
        .collect();
      let unit: Doc<"units"> | undefined = existingUnits.find(
        (u) => u.order === unitInput.order
      );
      if (!unit) {
        const unitId = await ctx.db.insert("units", {
          courseId: course._id,
          title: unitInput.title,
          order: unitInput.order,
        });
        unit = (await ctx.db.get(unitId)) ?? undefined;
      } else if (unit.title !== unitInput.title) {
        await ctx.db.patch(unit._id, { title: unitInput.title });
      }
      if (!unit) throw new Error("Failed to create unit");

      const existingLessons = await ctx.db
        .query("lessons")
        .withIndex("by_unit", (q) => q.eq("unitId", unit._id))
        .collect();

      for (const lessonInput of unitInput.lessons) {
        let lesson: Doc<"lessons"> | undefined = existingLessons.find(
          (l) => l.order === lessonInput.order
        );
        if (!lesson) {
          const lessonId = await ctx.db.insert("lessons", {
            unitId: unit._id,
            title: lessonInput.title,
            order: lessonInput.order,
            xpReward: lessonInput.xpReward,
          });
          lesson = (await ctx.db.get(lessonId)) ?? undefined;
        } else {
          await ctx.db.patch(lesson._id, {
            title: lessonInput.title,
            xpReward: lessonInput.xpReward,
          });
        }
        if (!lesson) throw new Error("Failed to create lesson");
        lessonsUpserted++;

        // Recreate exercises each run to keep seeding idempotent and fresh.
        const existingExercises = await ctx.db
          .query("exercises")
          .withIndex("by_lesson", (q) => q.eq("lessonId", lesson._id))
          .collect();
        for (const ex of existingExercises) {
          await ctx.db.delete(ex._id);
        }
        for (const exInput of lessonInput.exercises) {
          await ctx.db.insert("exercises", {
            lessonId: lesson._id,
            type: exInput.type,
            promptText: exInput.promptText,
            solutionData: exInput.solutionData,
            distractors: exInput.distractors,
            order: exInput.order,
          });
          exercisesWritten++;
        }
      }
    }

    return { courseSlug: course.slug, lessonsUpserted, exercisesWritten };
  },
});
