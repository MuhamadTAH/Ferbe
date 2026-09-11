// Server-side copy of the pure streak/XP logic in src/lib/stats.ts.
// Convex functions live in their own bundle, so the logic is duplicated here.
// Keep the two files in sync — the src copy is covered by vitest unit tests.

export function todayKey(now: number = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function yesterdayKey(now: number = Date.now()): string {
  return new Date(now - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * Streak rule (owner default):
 * - last activity was today        -> streak unchanged
 * - last activity was yesterday    -> streak + 1
 * - last activity older / none     -> streak resets to 1
 */
export function computeNextStreak(
  prevStreak: number,
  lastActiveDate: string | undefined,
  today: string,
  yesterday: string
): number {
  if (lastActiveDate === today) return prevStreak;
  if (lastActiveDate === yesterday) return prevStreak + 1;
  return 1;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * XP for a completed lesson, proportional to first-try correct answers and
 * clamped server-side so a malicious client cannot mint XP.
 */
export function computeXp(
  xpReward: number,
  correctFirstTry: number,
  totalExercises: number
): number {
  if (totalExercises <= 0) return 0;
  const ratio = clamp(correctFirstTry, 0, totalExercises) / totalExercises;
  return Math.round(xpReward * ratio);
}
