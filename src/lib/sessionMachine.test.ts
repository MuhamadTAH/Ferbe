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
    // Keeps current exercise on screen during FEEDBACK_SUCCESS
    expect(currentExercise(s)?._id).toBe("e1");
    // Advances to next exercise when user clicks CONTINUE
    s = sessionReducer(s, { type: "CONTINUE" });
    expect(s.queue).toHaveLength(2);
    expect(currentExercise(s)?._id).toBe("e2");
  });

  it("re-queues a wrong answer and deducts a heart upon CONTINUE", () => {
    let s = started();
    s = sessionReducer(s, { type: "SELECT", value: "Water" });
    s = sessionReducer(s, { type: "SUBMIT" });
    s = sessionReducer(s, { type: "EVALUATE" });
    expect(s.phase).toBe("FEEDBACK_ERROR");
    expect(s.hearts).toBe(4);
    // Remains on e1 during feedback error so user sees their mistake
    expect(currentExercise(s)?._id).toBe("e1");
    expect(s.correctSolution).toBe("Hello");
    // Once user clicks CONTINUE, queue advances and e1 is pushed to the end
    s = sessionReducer(s, { type: "CONTINUE" });
    expect(currentExercise(s)?._id).toBe("e2");
    expect(s.queue).toHaveLength(3);
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

  it("dynamically tracks progress based on remaining cards in active queue", () => {
    let s = started(); // 3 items
    expect(progressPercent(s)).toBe(0);

    // Answer incorrectly: exercise is re-queued, so queue still has 3 items
    s = sessionReducer(s, { type: "SELECT", value: "Wrong" });
    s = sessionReducer(s, { type: "SUBMIT" });
    s = sessionReducer(s, { type: "EVALUATE" });
    expect(s.phase).toBe("FEEDBACK_ERROR");
    expect(progressPercent(s)).toBe(0); // queue.length = 3, progress remains 0%

    // Answer correctly: item removed from queue
    s = sessionReducer(s, { type: "CONTINUE" });
    const correct1 = currentExercise(s)?.solutionData.correct ?? "";
    s = sessionReducer(s, { type: "SELECT", value: correct1 });
    s = sessionReducer(s, { type: "SUBMIT" });
    s = sessionReducer(s, { type: "EVALUATE" });
    expect(s.phase).toBe("FEEDBACK_SUCCESS");
    expect(progressPercent(s)).toBe(33); // 2 items left, 1/3 completed

    // Another correct answer
    s = sessionReducer(s, { type: "CONTINUE" });
    const correct2 = currentExercise(s)?.solutionData.correct ?? "";
    s = sessionReducer(s, { type: "SELECT", value: correct2 });
    s = sessionReducer(s, { type: "SUBMIT" });
    s = sessionReducer(s, { type: "EVALUATE" });
    expect(progressPercent(s)).toBe(67); // 1 item left, 2/3 completed

    // Final correct answer (the re-queued one)
    s = sessionReducer(s, { type: "CONTINUE" });
    const correct3 = currentExercise(s)?.solutionData.correct ?? "";
    s = sessionReducer(s, { type: "SELECT", value: correct3 });
    s = sessionReducer(s, { type: "SUBMIT" });
    s = sessionReducer(s, { type: "EVALUATE" });
    s = sessionReducer(s, { type: "CONTINUE" });
    expect(s.phase).toBe("SESSION_COMPLETE");
    expect(progressPercent(s)).toBe(100);
  });

  describe("spoken exercises evaluation in sessionMachine", () => {
    const spokenExercise: Exercise = {
      _id: "sp1",
      type: "multiple_choice",
      promptText: "ڕاهێنانی دەنگ و وتار",
      solutionData: {
        subtype: "capstone_spoken",
        correct: "I'm good, thank you. What about you?",
        spokenText: "I'm good, thank you. What about you?",
        visualScaffold: "I'm [good / cool], thank you. What about you?",
      },
      distractors: [],
      order: 1,
    };

    it("rejects wrong spoken input like 'Hello, thank you.'", () => {
      let s = sessionReducer(initialSessionState, {
        type: "START",
        queue: [spokenExercise],
        hearts: 5,
      });

      s = sessionReducer(s, { type: "SELECT", value: "Hello, thank you." });
      s = sessionReducer(s, { type: "SUBMIT" });
      s = sessionReducer(s, { type: "EVALUATE" });

      expect(s.phase).toBe("FEEDBACK_ERROR");
      expect(s.lastCorrect).toBe(false);
      expect(s.hearts).toBe(4);
    });

    it("accepts correct spoken input with or without punctuation", () => {
      let s = sessionReducer(initialSessionState, {
        type: "START",
        queue: [spokenExercise],
        hearts: 5,
      });

      s = sessionReducer(s, { type: "SELECT", value: "im good thank you what about you" });
      s = sessionReducer(s, { type: "SUBMIT" });
      s = sessionReducer(s, { type: "EVALUATE" });

      expect(s.phase).toBe("FEEDBACK_SUCCESS");
      expect(s.lastCorrect).toBe(true);
      expect(s.hearts).toBe(5);
    });
  });
});


