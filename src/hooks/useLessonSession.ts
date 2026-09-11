"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import {
  currentExercise,
  evaluateAnswer,
  initialSessionState,
  progressPercent,
  sessionReducer,
  STARTING_HEARTS,
  type LessonSessionData,
} from "@/lib/sessionMachine";

export interface CompleteLessonResult {
  xpEarned: number;
  totalXp: number;
  currentStreak: number;
  isCompleted: boolean;
  score: number;
}

/**
 * Binds the pure session state machine to the Convex backend:
 * - startLesson refills hearts and acknowledges the session
 * - recordAnswer persists each wrong answer (authoritative hearts)
 * - completeLesson persists XP, progress and streak at SESSION_COMPLETE
 * Server failures never crash the session; they surface in the return value.
 */
export function useLessonSession(lessonId: string) {
  const typedLessonId = lessonId as Id<"lessons">;

  const sessionQuery = useQuery(api.curriculum.getLessonSession, {
    lessonId: typedLessonId,
  });
  const session = sessionQuery as LessonSessionData | null | undefined;

  const startLesson = useMutation(api.curriculum.startLesson);
  const recordAnswer = useMutation(api.curriculum.recordAnswer);
  const completeLesson = useMutation(api.curriculum.completeLesson);

  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);
  const [result, setResult] = useState<CompleteLessonResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!session || startedRef.current) return;
    startedRef.current = true;
    startLesson({ lessonId: typedLessonId })
      .then((hearts) => {
        dispatch({ type: "START", queue: session.exercises, hearts: hearts.hearts });
      })
      .catch(() => {
        // Session still runs locally; persistence errors surface via mutations.
        dispatch({ type: "START", queue: session.exercises, hearts: STARTING_HEARTS });
      });
  }, [session, startLesson, typedLessonId]);

  useEffect(() => {
    if (state.phase !== "SESSION_COMPLETE" || completedRef.current) return;
    completedRef.current = true;
    completeLesson({
      lessonId: typedLessonId,
      correctFirstTry: state.firstTryCorrect,
      totalExercises: state.total,
    })
      .then((r) => setResult(r as CompleteLessonResult))
      .catch((err: unknown) => {
        setServerError(
          err instanceof Error ? err.message : "Failed to save session results"
        );
      });
  }, [state.phase, state.firstTryCorrect, state.total, typedLessonId, completeLesson]);

  const select = useCallback((value: string) => dispatch({ type: "SELECT", value }), []);
  const buildToken = useCallback(
    (id: string) => dispatch({ type: "BUILD_TOKEN", id }),
    []
  );
  const unbuildToken = useCallback(
    (id: string) => dispatch({ type: "UNBUILD_TOKEN", id }),
    []
  );

  const submit = useCallback(() => {
    if (state.phase !== "ACTIVE_QUESTION") return;
    const exercise = currentExercise(state);
    if (!exercise) return;
    const evaluation = evaluateAnswer(exercise, state);
    dispatch({ type: "SUBMIT" });
    window.setTimeout(() => {
      dispatch({ type: "EVALUATE" });
      if (!evaluation.correct) {
        recordAnswer({ lessonId: typedLessonId, correct: false }).catch(() => {});
      }
    }, 350);
  }, [state, typedLessonId, recordAnswer]);

  const continueSession = useCallback(() => dispatch({ type: "CONTINUE" }), []);

  const restart = useCallback(() => {
    completedRef.current = false;
    setResult(null);
    setServerError(null);
    dispatch({ type: "RESTART" });
    startLesson({ lessonId: typedLessonId }).catch(() => {});
  }, [typedLessonId, startLesson]);

  return {
    session,
    state,
    result,
    serverError,
    select,
    buildToken,
    unbuildToken,
    submit,
    continueSession,
    restart,
    progress: progressPercent(state),
  };
}
