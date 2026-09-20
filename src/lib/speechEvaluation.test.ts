import { describe, it, expect } from "vitest";
import {
  evaluateSpokenAnswer,
  normalizeSpeech,
  expandContractions,
  extractCandidateTargets,
} from "./speechEvaluation";

describe("speechEvaluation", () => {
  describe("normalizeSpeech and expandContractions", () => {
    it("expands contractions and strips punctuation cleanly", () => {
      expect(normalizeSpeech("I'm good, thank you!")).toBe("i am good thank you");
      expect(normalizeSpeech("What's your name?")).toBe("what is your name");
      expect(normalizeSpeech("Thanks!")).toBe("thank you");
    });
  });

  describe("extractCandidateTargets", () => {
    it("extracts scaffold alternatives", () => {
      const variants = extractCandidateTargets(
        "I'm good, thank you. What about you?",
        "I'm [good / cool], thank you. What about you?"
      );
      expect(variants).toContain("I'm good, thank you. What about you?");
      expect(variants).toContain("I'm cool, thank you. What about you?");
    });
  });

  describe("evaluateSpokenAnswer scenarios", () => {
    const targetCapstone = "I'm good, thank you. What about you?";
    const scaffoldCapstone = "I'm [good / cool], thank you. What about you?";

    it("rejects unrelated or partially wrong phrases like 'Hello, thank you.'", () => {
      const result = evaluateSpokenAnswer(
        "Hello, thank you.",
        targetCapstone,
        scaffoldCapstone
      );
      expect(result.isMatch).toBe(false);
      expect(result.score).toBeLessThan(0.45);
    });

    it("accepts exact spoken match", () => {
      const result = evaluateSpokenAnswer(
        "I'm good, thank you. What about you?",
        targetCapstone,
        scaffoldCapstone
      );
      expect(result.isMatch).toBe(true);
      expect(result.score).toBe(1.0);
    });

    it("accepts browser ASR output without punctuation", () => {
      const result = evaluateSpokenAnswer(
        "im good thank you what about you",
        targetCapstone,
        scaffoldCapstone
      );
      expect(result.isMatch).toBe(true);
      expect(result.score).toBe(1.0);
    });

    it("accepts contraction expansion ('I am' for 'I'm')", () => {
      const result = evaluateSpokenAnswer(
        "I am good thank you what about you",
        targetCapstone,
        scaffoldCapstone
      );
      expect(result.isMatch).toBe(true);
      expect(result.score).toBe(1.0);
    });

    it("accepts scaffold variant ('I'm cool, thank you. What about you?')", () => {
      const result = evaluateSpokenAnswer(
        "I'm cool, thank you. What about you?",
        targetCapstone,
        scaffoldCapstone
      );
      expect(result.isMatch).toBe(true);
      expect(result.score).toBe(1.0);
    });

    it("evaluates short phrases like 'How are you?' accurately", () => {
      const match = evaluateSpokenAnswer("How are you", "How are you?");
      expect(match.isMatch).toBe(true);

      const wrong = evaluateSpokenAnswer("Hello thank you", "How are you?");
      expect(wrong.isMatch).toBe(false);
    });

    it("handles empty or blank spoken inputs gracefully", () => {
      const empty = evaluateSpokenAnswer("", targetCapstone);
      expect(empty.isMatch).toBe(false);
      expect(empty.score).toBe(0);
    });
  });
});
