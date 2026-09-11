import { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

/**
 * Reads the signed-in user's record without writing (safe inside queries).
 * Returns null when unauthenticated or when the record does not exist yet
 * (e.g. before the user's first mutation ran).
 */
export async function getUserOrNull(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const existing = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
    .unique();
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

  const existing = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
    .unique();
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
