import { describe, it, expect } from "vitest";
import { generateQuizOptions } from "./quiz";
import { hashString, seededShuffle } from "./seededShuffle";

describe("generateQuizOptions", () => {
  const words = [
    { englishText: "Hello" },
    { englishText: "Water" },
    { englishText: "Bread" },
    { englishText: "Home" },
    { englishText: "Book" },
    { englishText: "Sun" },
  ];

  it("returns 4 unique options including the correct answer", () => {
    const options = generateQuizOptions("Hello", words, hashString("a"));
    expect(options).toHaveLength(4);
    expect(new Set(options).size).toBe(4);
    expect(options).toContain("Hello");
  });

  it("is deterministic for the same seed", () => {
    const a = generateQuizOptions("Hello", words, 12345);
    const b = generateQuizOptions("Hello", words, 12345);
    expect(a).toEqual(b);
  });

  it("never includes the correct answer as a distractor", () => {
    for (let seed = 0; seed < 20; seed++) {
      const options = generateQuizOptions("Water", words, seed);
      expect(options.filter((o) => o === "Water")).toHaveLength(1);
    }
  });
});

describe("seededShuffle", () => {
  it("is a permutation of the input", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const output = seededShuffle(input, hashString("seed"));
    expect([...output].sort((a, b) => a - b)).toEqual(input);
  });

  it("does not mutate the input", () => {
    const input = [1, 2, 3];
    seededShuffle(input, 42);
    expect(input).toEqual([1, 2, 3]);
  });
});
