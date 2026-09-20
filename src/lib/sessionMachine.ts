import { hashString, seededShuffle } from "./seededShuffle";
import { evaluateSpokenAnswer } from "./speechEvaluation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ExerciseType = "multiple_choice" | "word_bank" | "audio_match";

export interface ExerciseSolutionData {
  correct?: string;
  tokens?: string[];
  audioUrl?: string;
  audioLang?: "kurdish" | "english";
  spokenText?: string;
  instruction?: string;
  icon?: string;
  isSpeaking?: boolean;
  type?: string;
  timerSeconds?: number;
  [key: string]: unknown;
}

export interface Exercise {
  _id: string;
  type: ExerciseType;
  promptText: string;
  solutionData: ExerciseSolutionData;
  distractors: string[];
  order: number;
}

export interface BankTile {
  id: string;
  token: string;
}

/**
 * The deterministic lesson-session state machine.
 * IDLE -> ACTIVE_QUESTION -> EVALUATING -> FEEDBACK_SUCCESS | FEEDBACK_ERROR
 *   -> (next question | SESSION_COMPLETE)
 * FEEDBACK_ERROR with hearts reaching 0 transitions to HEARTS_EXHAUSTED.
 */
export type SessionPhase =
  | "IDLE"
  | "ACTIVE_QUESTION"
  | "EVALUATING"
  | "FEEDBACK_SUCCESS"
  | "FEEDBACK_ERROR"
  | "HEARTS_EXHAUSTED"
  | "SESSION_COMPLETE";

export interface SessionState {
  phase: SessionPhase;
  initialQueue: Exercise[];
  queue: Exercise[];
  index: number;
  hearts: number;
  total: number;
  answeredCount: number;
  firstTryCorrect: number;
  attempts: Record<string, number>;
  selected: string | null;
  built: string[];
  optionList: string[];
  bankTiles: BankTile[];
  lastCorrect: boolean | null;
  correctSolution: string | null;
  pending: {
    correct: boolean;
    correctSolution: string;
    exerciseId: string;
  } | null;
}

export interface LessonSessionData {
  lesson: { _id: string; title: string; order: number; xpReward: number };
  exercises: Exercise[];
  nextLessonId?: string | null;
}

export const STARTING_HEARTS = 5;

export const initialSessionState: SessionState = {
  phase: "IDLE",
  initialQueue: [],
  queue: [],
  index: 0,
  hearts: STARTING_HEARTS,
  total: 0,
  answeredCount: 0,
  firstTryCorrect: 0,
  attempts: {},
  selected: null,
  built: [],
  optionList: [],
  bankTiles: [],
  lastCorrect: null,
  correctSolution: null,
  pending: null,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function currentExercise(state: SessionState): Exercise | null {
  return state.queue[state.index] ?? null;
}

function prepareFor(exercise: Exercise): {
  optionList: string[];
  bankTiles: BankTile[];
} {
  const seed = hashString(exercise._id);
  const solution = exercise.solutionData ?? {};

  if (exercise.type === "word_bank") {
    const tokens = solution.tokens ?? [];
    const all = [...tokens, ...(exercise.distractors ?? [])];
    return {
      optionList: [],
      bankTiles: seededShuffle(
        all.map((token, i) => ({ id: `${exercise._id}:${i}`, token })),
        seed
      ),
    };
  }

  const correct = solution.correct ?? "";
  const options = [correct, ...(exercise.distractors ?? [])].filter(
    (option, i, arr) => option.length > 0 && arr.indexOf(option) === i
  );
  return { optionList: seededShuffle(options, seed), bankTiles: [] };
}

/** Tokens the user has assembled in the word-bank answer row. */
export function builtTokens(state: SessionState): string[] {
  return state.built
    .map((id) => state.bankTiles.find((tile) => tile.id === id)?.token ?? "")
    .filter((token) => token.length > 0);
}

export function evaluateAnswer(
  exercise: Exercise,
  state: SessionState
): { correct: boolean; correctSolution: string } {
  const solution = exercise.solutionData ?? {};

  if (exercise.type === "word_bank") {
    const tokens = solution.tokens ?? [];
    const target = tokens.join(" ").trim();
    const built = builtTokens(state).join(" ").trim();
    return {
      correct: built.length > 0 && built === target,
      correctSolution: target,
    };
  }

  const correct = (solution.correct ?? "").trim();
  const selected = (state.selected ?? "").trim();

  // Spoken speech exercises (echo_mic / capstone_spoken)
  if (solution.subtype === "echo_mic" || solution.subtype === "capstone_spoken") {
    const target = ((solution.spokenText as string) || correct).trim();
    const scaffold = solution.visualScaffold as string | undefined;
    const spokenEval = evaluateSpokenAnswer(selected, target, scaffold);
    return {
      correct: spokenEval.isMatch,
      correctSolution: target || correct,
    };
  }

  const isInteractiveCompletion =
    selected === "completed" ||
    selected === "matched" ||
    selected === "paired" ||
    (correct.length > 0 && selected.toLowerCase() === correct.toLowerCase());

  return {
    correct: selected.length > 0 && isInteractiveCompletion,
    correctSolution: correct || selected,
  };
}

/**
 * Session progress as a percentage based on remaining cards in the active queue.
 * Completing an exercise removes it from queue (advancing progress).
 * An incorrect answer keeps the exercise in the queue (moved to the end),
 * preventing premature progress bar advancement.
 */
export function progressPercent(state: SessionState): number {
  if (state.total <= 0) return 0;
  if (state.phase === "SESSION_COMPLETE") return 100;
  const correctOffset = state.phase === "FEEDBACK_SUCCESS" ? 1 : 0;
  const completed = Math.max(0, state.total - state.queue.length + correctOffset);
  return Math.min(100, Math.max(0, Math.round((completed / state.total) * 100)));
}


// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type SessionAction =
  | { type: "START"; queue: Exercise[]; hearts: number }
  | { type: "SELECT"; value: string }
  | { type: "BUILD_TOKEN"; id: string }
  | { type: "UNBUILD_TOKEN"; id: string }
  | { type: "SUBMIT" }
  | { type: "EVALUATE" }
  | { type: "CONTINUE" }
  | { type: "RESTART" }
  | { type: "EXIT" };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function sessionReducer(
  state: SessionState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case "START": {
      const queue = [...action.queue];
      const base: SessionState = {
        ...initialSessionState,
        initialQueue: queue,
        queue,
        total: queue.length,
        hearts: action.hearts,
      };
      if (queue.length === 0) {
        return { ...base, phase: "SESSION_COMPLETE" };
      }
      const prep = prepareFor(queue[0]);
      return { ...base, phase: "ACTIVE_QUESTION", ...prep };
    }

    case "SELECT": {
      if (state.phase !== "ACTIVE_QUESTION") return state;
      return { ...state, selected: action.value };
    }

    case "BUILD_TOKEN": {
      if (state.phase !== "ACTIVE_QUESTION") return state;
      if (state.built.includes(action.id)) return state;
      if (!state.bankTiles.some((tile) => tile.id === action.id)) return state;
      return { ...state, built: [...state.built, action.id] };
    }

    case "UNBUILD_TOKEN": {
      if (state.phase !== "ACTIVE_QUESTION") return state;
      return { ...state, built: state.built.filter((id) => id !== action.id) };
    }

    case "SUBMIT": {
      if (state.phase !== "ACTIVE_QUESTION") return state;
      const exercise = currentExercise(state);
      if (!exercise) return { ...state, phase: "SESSION_COMPLETE" };
      const evaluation = evaluateAnswer(exercise, state);
      return {
        ...state,
        phase: "EVALUATING",
        pending: {
          correct: evaluation.correct,
          correctSolution: evaluation.correctSolution,
          exerciseId: exercise._id,
        },
      };
    }

    case "EVALUATE": {
      if (state.phase !== "EVALUATING" || !state.pending) return state;
      const exercise = currentExercise(state);
      if (!exercise || exercise._id !== state.pending.exerciseId) {
        return { ...state, phase: "ACTIVE_QUESTION", pending: null };
      }

      const attempts = { ...state.attempts };
      const attemptNumber = (attempts[exercise._id] ?? 0) + 1;
      attempts[exercise._id] = attemptNumber;

      const answeredCount = state.answeredCount + 1;
      const lastCorrect = state.pending.correct;
      const correctSolution = state.pending.correctSolution;

      if (lastCorrect) {
        // First-try correct answers earn XP credit; repeats do not.
        const firstTryCorrect =
          attemptNumber === 1 ? state.firstTryCorrect + 1 : state.firstTryCorrect;
        return {
          ...state,
          phase: "FEEDBACK_SUCCESS",
          attempts,
          answeredCount,
          firstTryCorrect,
          lastCorrect,
          correctSolution,
          pending: null,
        };
      }

      // Wrong answer: deduct heart; exercise will be re-queued to the end on CONTINUE.
      const hearts = Math.max(0, state.hearts - 1);
      return {
        ...state,
        phase: hearts <= 0 ? "HEARTS_EXHAUSTED" : "FEEDBACK_ERROR",
        attempts,
        answeredCount,
        hearts,
        lastCorrect,
        correctSolution,
        pending: null,
      };
    }

    case "CONTINUE": {
      if (state.phase !== "FEEDBACK_SUCCESS" && state.phase !== "FEEDBACK_ERROR") {
        return state;
      }
      const queue = [...state.queue];
      if (state.lastCorrect) {
        // Remove successfully completed exercise from the queue
        queue.splice(state.index, 1);
      } else {
        // Re-queue wrong answer to the end of the queue for spaced repetition
        const [removed] = queue.splice(state.index, 1);
        queue.push(removed);
      }

      if (queue.length === 0) {
        return { ...state, phase: "SESSION_COMPLETE", queue };
      }

      const nextExercise = queue[state.index] ?? null;
      if (!nextExercise) {
        return { ...state, phase: "SESSION_COMPLETE", queue };
      }

      const prep = prepareFor(nextExercise);
      return {
        ...state,
        phase: "ACTIVE_QUESTION",
        queue,
        selected: null,
        built: [],
        lastCorrect: null,
        correctSolution: null,
        ...prep,
      };
    }

    case "RESTART": {
      if (
        state.phase === "IDLE" ||
        state.phase === "ACTIVE_QUESTION" ||
        state.phase === "EVALUATING"
      ) {
        return state;
      }
      return sessionReducer(state, {
        type: "START",
        queue: state.initialQueue,
        hearts: STARTING_HEARTS,
      });
    }

    case "EXIT":
      return initialSessionState;

    default:
      return state;
  }
}
