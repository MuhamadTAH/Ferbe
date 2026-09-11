"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { X } from "lucide-react";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { useLessonSession } from "@/hooks/useLessonSession";
import { currentExercise } from "@/lib/sessionMachine";
import { HeartsBar } from "@/components/duo/HeartsBar";
import { PushButton } from "@/components/duo/PushButton";
import { MultipleChoiceView } from "@/components/lesson/MultipleChoiceView";
import { AudioMatchView } from "@/components/lesson/AudioMatchView";
import { WordBankView } from "@/components/lesson/WordBankView";
import { FeedbackBanner } from "@/components/lesson/FeedbackBanner";
import { FailureModal } from "@/components/lesson/FailureModal";
import { LessonComplete } from "@/components/lesson/LessonComplete";

function solutionIsKurdish(
  type: string | undefined,
  solution: { audioLang?: string } | undefined
): boolean {
  if (type === "word_bank") return true;
  if (type === "audio_match") return solution?.audioLang === "kurdish";
  return false;
}

function SessionInner({ lessonId }: { lessonId: string }) {
  const {
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
    progress,
  } = useLessonSession(lessonId);

  const exercise = currentExercise(state);
  const isHeartsExhausted = state.phase === "HEARTS_EXHAUSTED";
  const showFeedback =
    state.phase === "FEEDBACK_SUCCESS" ||
    state.phase === "FEEDBACK_ERROR" ||
    isHeartsExhausted;
  const canCheck =
    state.phase === "ACTIVE_QUESTION" &&
    (exercise?.type === "word_bank"
      ? state.built.length > 0
      : state.selected !== null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        if (showFeedback && !isHeartsExhausted) {
          e.preventDefault();
          continueSession();
        } else if (canCheck) {
          e.preventDefault();
          submit();
        }
      } else if (
        !showFeedback &&
        state.phase === "ACTIVE_QUESTION" &&
        exercise?.type === "multiple_choice"
      ) {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= state.optionList.length) {
          select(state.optionList[num - 1]);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showFeedback,
    isHeartsExhausted,
    canCheck,
    continueSession,
    submit,
    state.phase,
    exercise?.type,
    state.optionList,
    select,
  ]);

  if (session === undefined || state.phase === "IDLE") {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading lesson...
      </div>
    );
  }

  if (session === null) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-xl font-extrabold text-[#4B4B4B]">Lesson not found</h1>
        <p className="mt-2 text-sm text-[#777777]">
          Seed the curriculum with{" "}
          <code className="rounded bg-[#F7F7F7] px-1.5 py-0.5 font-mono text-xs">
            npm run seed
          </code>
          .
        </p>
      </div>
    );
  }

  if (state.phase === "SESSION_COMPLETE") {
    const accuracy =
      state.total > 0 ? Math.round((100 * state.firstTryCorrect) / state.total) : 0;
    return (
      <LessonComplete
        lessonTitle={session.lesson.title}
        xpEarned={result?.xpEarned ?? 0}
        accuracyPct={accuracy}
        currentStreak={result?.currentStreak ?? 0}
        totalXp={result?.totalXp ?? 0}
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Lesson top bar */}
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-5">
        <Link
          href="/learn"
          aria-label="Exit lesson"
          className="text-[#AFAFAF] transition-colors hover:text-[#777777]"
        >
          <X className="h-8 w-8 stroke-[3]" />
        </Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#E5E5E5]">
          <div
            className="h-full rounded-full bg-[#58CC02] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <HeartsBar hearts={state.hearts} />
      </div>

      {serverError ? (
        <p className="mx-auto max-w-2xl px-4 pb-2 text-center text-xs font-bold text-[#EA2B2B]">
          Results could not be saved: {serverError}
        </p>
      ) : null}

      {/* Exercise area */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-44 pt-2">
        {exercise ? (
          exercise.type === "multiple_choice" ? (
            <MultipleChoiceView
              exercise={exercise}
              options={state.optionList}
              selected={state.selected}
              lastCorrect={state.lastCorrect}
              onSelect={select}
              kurdishPrompt
            />
          ) : exercise.type === "audio_match" ? (
            <AudioMatchView
              exercise={exercise}
              options={state.optionList}
              selected={state.selected}
              lastCorrect={state.lastCorrect}
              onSelect={select}
            />
          ) : (
            <WordBankView
              exercise={exercise}
              bankTiles={state.bankTiles}
              built={state.built}
              onBuild={buildToken}
              onUnbuild={unbuildToken}
              lastCorrect={state.lastCorrect}
            />
          )
        ) : null}
      </main>

      {/* Check footer (hidden while the feedback banner is up) */}
      {!showFeedback ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-[#E5E5E5] bg-white">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={submit}
              className="rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] transition-all hover:bg-[#F7F7F7] hover:text-[#777777] active:translate-y-[2px] active:border-b-2 shadow-xs"
            >
              Skip
            </button>
            <PushButton
              variant="green"
              disabled={!canCheck}
              onClick={submit}
              className="shrink-0 px-10 py-3"
            >
              Check
            </PushButton>
          </div>
        </div>
      ) : null}

      <FeedbackBanner
        visible={showFeedback && !isHeartsExhausted}
        correct={state.lastCorrect}
        correctSolution={state.correctSolution}
        solutionIsKurdish={solutionIsKurdish(
          exercise?.type,
          exercise?.solutionData
        )}
        onContinue={continueSession}
      />

      <FailureModal
        visible={isHeartsExhausted}
        correctSolution={state.correctSolution}
        onRestart={restart}
      />
    </div>
  );
}

export default function LessonSessionPage() {
  const { hasConvex } = useAppConfig();
  const params = useParams<{ lessonId: string }>();
  const lessonId = params?.lessonId ?? "";

  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }
  if (!lessonId) {
    return (
      <div className="py-24 text-center font-extrabold text-[#777777]">
        No lesson selected.
      </div>
    );
  }
  return (
    <ErrorBoundary>
      <SessionInner lessonId={lessonId} />
    </ErrorBoundary>
  );
}
