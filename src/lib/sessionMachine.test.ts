import { describe, it, expect } from "vitest";
import {
  sessionReducer,
  initialSessionState,
  currentExercise,
  progressPercent,
  builtTokens,
  type Exercise,
} from "./sessionMachine";

function ex(id: string, overrides: Partial<Exercise> = {}): Exercise {
  return {
    _id: id,
    type: "multiple_choice",
    promptText: "سڵاو",
    solutionData: { correct: "Hello" },
    distractors: ["Thanks", "Water", "Bread"],
    order: 1,
    ...overrides,
  };
}

function started(queue: Exercise[] = [ex("e1"), ex("e2"), ex("e3")]) {
  return sessionReducer(initialSessionState, {
    type: "START",
    queue,
    hearts: 5,
  });
}

describe("lesson session machine", () => {
  it("starts in ACTIVE_QUESTION with prepared options", () => {
    const s = started();
    expect(s.phase).toBe("ACTIVE_QUESTION");
    expect(s.total).toBe(3);
    expect(s.hearts).toBe(5);
    expect(s.optionList).toContain("Hello");
    expect(s.optionList).toHaveLength(4);
  });

  it("SUBMIT moves to EVALUATING, EVALUATE to FEEDBACK_SUCCESS on a correct answer", () => {
    let s = started();
    s = sessionReducer(s, { type: "SELECT", value: "Hello" });
    s = sessionReducer(s, { type: "SUBMIT" });
    expect(s.phase).toBe("EVALUATING");
    s = sessionReducer(s, { type: "EVALUATE" });
    expect(s.phase).toBe("FEEDBACK_SUCCESS");
    expect(s.lastCorrect).toBe(true);
    expect(s.firstTryCorrect).toBe(1);
    expect(s.answeredCount).toBe(1);
    expect(s.hearts).toBe(5);
    expect(s.queue).toHaveLength(2);
  });

  it("re-queues a wrong answer and deducts a heart", () => {
    let s = started();
    s = sessionReducer(s, { type: "SELECT", value: "Water" });
    s = sessionReducer(s, { type: "SUBMIT" });
    s = sessionReducer(s, { type: "EVALUATE" });
    expect(s.phase).toBe("FEEDBACK_ERROR");
    expect(s.hearts).toBe(4);
    expect(s.queue).toHaveLength(3); // re-queued at the end
    expect(s.correctSolution).toBe("Hello");
    // Current exercise is now the second one
    expect(currentExercise(s)?._id).toBe("e2");
    // e1 is at the end of the queue
    expect(s.queue[s.queue.length - 1]._id).toBe("e1");
  });

  it("transitions to HEARTS_EXHAUSTED when hearts hit 0", () => {
    let s = started();
    for (let i = 0; i < 5; i++) {
      s = sessionReducer(s, { type: "SELECT", value: "Wrong" });
      s = sessionReducer(s, { type: "SUBMIT" });
      s = sessionReducer(s, { type: "EVALUATE" });
      if (i < 4) s = sessionReducer(s, { type: "CONTINUE" });
    }
    expect(s.hearts).toBe(0);
    expect(s.phase).toBe("HEARTS_EXHAUSTED");
  });

  it("restarting from HEARTS_EXHAUSTED resets hearts and queue", () => {
    let s = started();
    s = sessionReducer(s, { type: "SELECT", value: "Wrong" });
    s = sessionReducer(s, { type: "SUBMIT" });
    s = sessionReducer(s, { type: "EVALUATE" });
    s = sessionReducer(s, { type: "RESTART" });
    expect(s.phase).toBe("ACTIVE_QUESTION");
    expect(s.hearts).toBe(5);
    expect(s.queue).toHaveLength(3);
    expect(s.answeredCount).toBe(0);
  });

  it("reaches SESSION_COMPLETE when the queue is exhausted", () => {
    let s = started();
    while (s.phase !== "SESSION_COMPLETE") {
      if (s.phase === "ACTIVE_QUESTION") {
        const correct = currentExercise(s)?.solutionData.correct ?? "";
        s = sessionReducer(s, { type: "SELECT", value: correct });
        s = sessionReducer(s, { type: "SUBMIT" });
      } else if (s.phase === "EVALUATING") {
        s = sessionReducer(s, { type: "EVALUATE" });
      } else if (s.phase === "FEEDBACK_SUCCESS") {
        s = sessionReducer(s, { type: "CONTINUE" });
      } else {
        throw new Error(`unexpected phase ${s.phase}`);
      }
    }
    expect(s.firstTryCorrect).toBe(3);
    expect(progressPercent(s)).toBe(100);
  });

  it("word_bank evaluation compares assembled tokens", () => {
    const bank = ex("w1", {
      type: "word_bank",
      promptText: "The water is cold",
      solutionData: { tokens: ["ئاو", "ساردە"] },
      distractors: ["خۆشە"],
    });
    let s = started([bank]);
    const tileIds = s.bankTiles;
    const aw = tileIds.find((t) => t.token === "ئاو");
    const sard = tileIds.find((t) => t.token === "ساردە");
    expect(aw && sard).toBeTruthy();
    s = sessionReducer(s, { type: "BUILD_TOKEN", id: aw!.id });
    s = sessionReducer(s, { type: "BUILD_TOKEN", id: sard!.id });
    expect(builtTokens(s)).toEqual(["ئاو", "ساردە"]);
    s = sessionReducer(s, { type: "SUBMIT" });
    s = sessionReducer(s, { type: "EVALUATE" });
    expect(s.phase).toBe("FEEDBACK_SUCCESS");
  });

  it("progress is capped at 100 with re-queued repeats", () => {
    let s = started();
    for (let i = 0; i < 12 && s.phase !== "SESSION_COMPLETE"; i++) {
      if (s.phase === "ACTIVE_QUESTION") {
        s = sessionReducer(s, { type: "SELECT", value: "Wrong" });
        s = sessionReducer(s, { type: "SUBMIT" });
      } else if (s.phase === "EVALUATING") {
        s = sessionReducer(s, { type: "EVALUATE" });
      } else if (s.phase === "FEEDBACK_ERROR") {
        s = sessionReducer(s, { type: "CONTINUE" });
      } else {
        break; // HEARTS_EXHAUSTED stops progress
      }
    }
    expect(progressPercent(s)).toBeLessThanOrEqual(100);
  });
});
