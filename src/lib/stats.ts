// Pure streak/XP logic. This file mirrors convex/stats.ts (Convex functions
// live in their own bundle). The functions here are covered by vitest tests.

export function todayKey(now: number = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function yesterdayKey(now: number = Date.now()): string {
  return new Date(now - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function computeNextStreak(
  prevStreak: number,
  lastActiveDate: string | undefined | null,
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

export function computeXp(
  xpReward: number,
  correctFirstTry: number,
  totalExercises: number
): number {
  if (totalExercises <= 0) return 0;
  const ratio = clamp(correctFirstTry, 0, totalExercises) / totalExercises;
  return Math.round(xpReward * ratio);
}
