import { describe, it, expect } from "vitest";
import {
  computeNextStreak,
  computeXp,
} from "./stats";

describe("streak logic", () => {
  it("keeps the streak when the last activity was today", () => {
    expect(computeNextStreak(7, "2026-09-11", "2026-09-11", "2026-09-10")).toBe(7);
  });

  it("increments when the last activity was yesterday", () => {
    expect(computeNextStreak(7, "2026-09-10", "2026-09-11", "2026-09-10")).toBe(8);
  });

  it("resets to 1 when the last activity is older", () => {
    expect(computeNextStreak(7, "2026-09-01", "2026-09-11", "2026-09-10")).toBe(1);
  });

  it("starts at 1 with no previous activity", () => {
    expect(computeNextStreak(0, undefined, "2026-09-11", "2026-09-10")).toBe(1);
  });
});

describe("XP computation", () => {
  it("awards the full reward for a perfect run", () => {
    expect(computeXp(10, 13, 13)).toBe(10);
  });

  it("awards proportional XP rounded to an integer", () => {
    expect(computeXp(10, 10, 13)).toBe(8); // 7.69 -> 8
    expect(computeXp(10, 0, 13)).toBe(0);
  });

  it("clamps out-of-range inputs and handles zero totals", () => {
    expect(computeXp(10, 99, 13)).toBe(10);
    expect(computeXp(10, -5, 13)).toBe(0);
    expect(computeXp(10, 5, 0)).toBe(0);
  });
});
