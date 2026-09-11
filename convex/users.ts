import { mutation, MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

/**
 * Reads the signed-in user's record without writing (safe inside queries).
 * Returns null when unauthenticated or when the record does not exist yet
 * (e.g. before the user's first mutation ran).
 */
export async function getUserOrNull(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  let existing = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
    .unique();

  if (!existing && identity.tokenIdentifier && identity.tokenIdentifier !== identity.subject) {
    existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  }

  return existing ?? null;
}

/**
 * Requires an authenticated identity and get-or-creates the users row plus the
 * default userStats row (currentStreak 0, totalXp 0, hearts 5).
 *
 * SECURITY: there is intentionally NO anonymous fallback. Every user-facing
 * mutation must call this — unauthenticated calls throw.
 */
export async function requireUser(ctx: MutationCtx): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("UNAUTHENTICATED: sign in to continue");
  }

  let existing = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
    .unique();

  if (!existing && identity.tokenIdentifier && identity.tokenIdentifier !== identity.subject) {
    existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  }

  if (existing) return existing;

  const userId = await ctx.db.insert("users", {
    tokenIdentifier: identity.subject,
    name: identity.name ?? "Learner",
    email: identity.email ?? "",
    createdAt: Date.now(),
  });

  await ctx.db.insert("userStats", {
    userId,
    currentStreak: 0,
    hearts: 5,
    totalXp: 0,
  });

  const created = await ctx.db.get(userId);
  if (!created) throw new Error("Failed to create user record");
  return created;
}

/**
 * Automatically creates or syncs the user's Convex record on sign-up / sign-in
 * and initializes their default stats (streak 0, total XP 0, hearts 5).
 */
export const syncUser = mutation({
  args: {},
  handler: async (ctx) => {
    return await requireUser(ctx);
  },
});

