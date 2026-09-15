import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Zap,
  Target,
  Flame,
  Volume2,
  Check,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import { PushButton } from "@/components/duo/PushButton";
import { QuestChest } from "@/components/duo/QuestChest";
import { SquirrelMascot } from "@/components/duo/SquirrelMascot";

export interface ScorecardItem {
  id: string;
  prompt: string;
  userResponse: string;
  correctResponse: string;
  isCorrect: boolean;
  audioUrl?: string;
  kurdishText?: string;
}

interface LessonCompleteProps {
  lessonTitle: string;
  xpEarned: number;
  accuracyPct: number;
  currentStreak: number;
  totalXp: number;
  scorecard?: ScorecardItem[];
  onRestart?: () => void;
  nextLessonId?: string | null;
}

const DEFAULT_SCORECARD: ScorecardItem[] = [
  {
    id: "sc-1",
    prompt: "How do you say \"Hello\" in Kurdish?",
    userResponse: "سڵاو (Slaw)",
    correctResponse: "سڵاو (Slaw)",
    isCorrect: true,
    kurdishText: "سڵاو",
  },
  {
    id: "sc-2",
    prompt: "Write in English: چۆنی باشی؟",
    userResponse: "How are you? Are you good?",
    correctResponse: "How are you? Are you good?",
    isCorrect: true,
    kurdishText: "چۆنی باشی؟",
  },
  {
    id: "sc-3",
    prompt: "Tap what you hear: سپاس",
    userResponse: "سپاس (Spas - Thank you)",
    correctResponse: "سپاس (Spas - Thank you)",
    isCorrect: true,
    kurdishText: "سپاس",
  },
  {
    id: "sc-4",
    prompt: "Complete the sentence: من ناوم _____.",
    userResponse: "ئازادە (Azada)",
    correctResponse: "ئازادە (Azada)",
    isCorrect: true,
    kurdishText: "من ناوم ئازادە",
  },
  {
    id: "sc-5",
    prompt: "Write in Kurdish: \"Good morning\"",
    userResponse: "بەیانیت باش (Bayanit bash)",
    correctResponse: "بەیانیت باش (Bayanit bash)",
    isCorrect: true,
    kurdishText: "بەیانیت باش",
  },
];

/** Session-complete screen with multi-slide celebration: Stats -> Quest Complete -> Gem Reward. */
export function LessonComplete({
  lessonTitle,
  xpEarned,
  accuracyPct,
  currentStreak,
  totalXp,
  scorecard = DEFAULT_SCORECARD,
  onRestart,
  nextLessonId,
}: LessonCompleteProps) {
  const [slide, setSlide] = useState<"summary" | "quest" | "reward">("summary");
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [expandedTileId, setExpandedTileId] = useState<string | null>(null);

  // Allow closing scorecard via Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isScorecardOpen) {
        setIsScorecardOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isScorecardOpen]);

  const toggleTile = (id: string) => {
    setExpandedTileId(expandedTileId === id ? null : id);
  };

  const playPronunciation = (kurdishText?: string) => {
    if (!kurdishText) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(kurdishText);
      utterance.lang = "ku";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 py-12 text-center">
      {/* SLIDE 0: SUMMARY STATS */}
      {slide === "summary" && (
        <>
          <div className="relative flex items-center justify-center -mb-2">
            <SquirrelMascot
              mood="celebrating"
              accessory="golden_acorn"
              size={144}
              animate
              title="Smorik Celebrating Kurdish Lesson Completion"
            />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-[#58CC02]">
              {accuracyPct === 100 ? "Perfect lesson!" : "Practice Complete!"}
            </h1>
            <p className="mt-1 text-sm font-bold text-[#777777] dark:text-[#8495A0]">
              {accuracyPct === 100
                ? "You made no mistakes in this lesson"
                : lessonTitle}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid w-full grid-cols-3 gap-3">
            <div className="rounded-2xl border-2 border-b-4 border-[#FFC800] p-4 bg-white shadow-xs dark:bg-[#131F24]">
              <Zap className="mx-auto h-6 w-6 text-[#FFC800] fill-[#FFC800]" />
              <p className="mt-1 text-2xl font-extrabold text-[#4B4B4B] dark:text-white">{xpEarned}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-[#AFAFAF] dark:text-[#8495A0]">
                TOTAL XP
              </p>
            </div>
            <div className="rounded-2xl border-2 border-b-4 border-[#58CC02] p-4 bg-white shadow-xs dark:bg-[#131F24]">
              <Target className="mx-auto h-6 w-6 text-[#58CC02]" />
              <p className="mt-1 text-2xl font-extrabold text-[#4B4B4B] dark:text-white">{accuracyPct}%</p>
              <p className="text-xs font-bold uppercase tracking-wide text-[#AFAFAF] dark:text-[#8495A0]">
                ACCURACY
              </p>
            </div>
            <div className="rounded-2xl border-2 border-b-4 border-[#FF4B4B] p-4 bg-white shadow-xs dark:bg-[#131F24]">
              <Flame className="mx-auto h-6 w-6 text-[#FF4B4B] fill-[#FF4B4B]" />
              <p className="mt-1 text-2xl font-extrabold text-[#4B4B4B] dark:text-white">{currentStreak}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-[#AFAFAF] dark:text-[#8495A0]">
                DAY STREAK
              </p>
            </div>
          </div>

          {/* 7-Day Streak Calendar Progression */}
          <div className="w-full rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-xs text-left dark:border-[#37464F] dark:bg-[#131F24]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 fill-[#FF9600] text-[#FF9600]" />
                <span className="text-sm font-extrabold text-[#4B4B4B] dark:text-white">
                  Day {currentStreak} of your Kurdish streak!
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#58CC02]">Active</span>
            </div>

            {/* Days Circles */}
            <div className="mt-4 flex items-center justify-between gap-1">
              {[
                { label: "M", done: true },
                { label: "Tu", done: true },
                { label: "W", done: true },
                { label: "Th", done: true },
                { label: "F", done: true, today: true },
                { label: "Sa", done: false },
                { label: "Su", done: false },
              ].map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-extrabold text-[#AFAFAF] dark:text-[#8495A0]">
                    {day.label}
                  </span>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-transform ${
                      day.done
                        ? "border-[#FF9600] bg-[#FF9600] text-white shadow-xs"
                        : "border-[#E5E5E5] bg-[#F7F7F7] text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#202F36] dark:text-[#8495A0]"
                    } ${day.today ? "scale-110 ring-2 ring-[#FF9600]/30" : ""}`}
                  >
                    {day.done ? <Flame className="h-4 w-4 fill-white" /> : "·"}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs font-bold text-[#777777] dark:text-[#8495A0]">
              Practicing daily grows your streak, but skipping a day resets it!
            </p>
          </div>

          {/* Fêrbe Pro Ad / Promo Card */}
          <div className="flex w-full items-center justify-between rounded-2xl border-2 border-[#CE82FF]/40 bg-gradient-to-r from-[#7928CA]/10 via-[#8B35D9]/10 to-[#CE82FF]/10 p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CE82FF] text-white shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#4B4B4B]">
                  Fêrbe Pro · Unlimited Hearts
                </h4>
                <p className="text-[11px] font-bold text-[#777777]">
                  Learn Kurdish without interruptions or heart limits
                </p>
              </div>
            </div>
            <Link href="/shop">
              <button
                type="button"
                className="shrink-0 rounded-xl bg-[#CE82FF] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white hover:bg-[#B55BE0] transition-colors cursor-pointer"
              >
                Try Free
              </button>
            </Link>
          </div>

          {/* Total XP footer text */}
          <p className="text-xs font-bold text-[#AFAFAF]">
            Total Kurdish XP:{" "}
            <span className="font-extrabold text-[#4B4B4B]">{totalXp}</span>
          </p>
        </>
      )}

      {/* SLIDE 1: ALL DAILY QUESTS COMPLETE */}
      {slide === "quest" && (
        <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#FFC800]/20 animate-ping" />
            <QuestChest isOpen size={88} />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-[#4B4B4B] dark:text-white">
              All Daily Quests complete!
            </h2>
            <p className="mt-1 text-sm font-bold text-[#777777] dark:text-[#8495A0]">
              You hit your XP goal and unlocked today&apos;s treasure reward!
            </p>
          </div>

          {/* Completed Quest Card with Animated Bar */}
          <div className="rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-sm text-left dark:border-[#37464F] dark:bg-[#131F24]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF9E6] text-[#FFC800] dark:bg-[#2A2415]">
                <Zap className="h-6 w-6 fill-[#FFC800]" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-extrabold text-[#4B4B4B] dark:text-white">
                  Earn 10 XP
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#37464F]">
                    <div className="h-full w-full rounded-full bg-[#FFC800] transition-all duration-700 shadow-sm" />
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-[#4B4B4B] dark:text-white">
                      10 / 10
                    </span>
                  </div>
                  <QuestChest isOpen size={38} className="animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 2: YOU EARNED 5 GEMS */}
      {slide === "reward" && (
        <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#1CB0F6]/20 animate-ping" />
            <QuestChest isOpen size={100} />
            <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-[#FFC800] animate-pulse" />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-[#4B4B4B] dark:text-white">
              You earned 5 gems!
            </h2>
            <p className="mt-1 text-sm font-bold text-[#777777] dark:text-[#8495A0]">
              Nice job reaching your daily goal!
            </p>
          </div>

          <div className="mx-auto flex max-w-xs items-center justify-center gap-2 rounded-2xl border-2 border-[#1CB0F6]/30 bg-[#DDF4FF]/60 py-3.5 dark:border-[#3BC0F8]/40 dark:bg-[#202F36]">
            <span className="text-3xl">💎</span>
            <span className="text-2xl font-extrabold text-[#1CB0F6] dark:text-[#3BC0F8]">
              +5 GEMS
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons (Shared across all slides) */}
      <div className="flex w-full max-w-sm flex-col gap-2.5 pt-2">
        {slide === "summary" ? (
          <PushButton
            variant="green"
            onClick={() => setSlide("quest")}
            className="w-full py-3.5 text-base uppercase tracking-wider"
          >
            CONTINUE
          </PushButton>
        ) : slide === "quest" ? (
          <PushButton
            variant="green"
            onClick={() => setSlide("reward")}
            className="w-full py-3.5 text-base uppercase tracking-wider"
          >
            CONTINUE
          </PushButton>
        ) : (
          <>
            <Link
              href={nextLessonId ? `/lesson/${nextLessonId}` : "/learn"}
              className="w-full"
            >
              <PushButton
                variant="green"
                className="w-full py-3.5 text-base uppercase tracking-wider"
              >
                {nextLessonId ? "NEXT LESSON ➔" : "CONTINUE"}
              </PushButton>
            </Link>
            {nextLessonId && (
              <Link href="/learn" className="w-full text-center">
                <span className="inline-block py-1 text-xs font-black uppercase tracking-wider text-[#AFAFAF] hover:text-[#777777] dark:hover:text-white transition-colors cursor-pointer">
                  Back to Learning Path / گەڕانەوە
                </span>
              </Link>
            )}
          </>
        )}

        {/* REVIEW LESSON Button (Duolingo authentic) */}
        <button
          type="button"
          onClick={() => setIsScorecardOpen(true)}
          className="w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-3 text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#3BC0F8] dark:hover:bg-[#202F36]"
        >
          REVIEW LESSON
        </button>

        {/* PRACTICE AGAIN Button */}
        {onRestart ? (
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center justify-center gap-1.5 w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#777777] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#8495A0] dark:hover:bg-[#202F36]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>PRACTICE AGAIN</span>
          </button>
        ) : (
          <Link href="/practice" className="w-full">
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#777777] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#8495A0] dark:hover:bg-[#202F36]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>PRACTICE AGAIN</span>
            </button>
          </Link>
        )}
      </div>

      {/* SCORECARD DRAWER MODAL */}
      {isScorecardOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200">
          <div
            className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-3xl border-t-2 border-[#E5E5E5] bg-white p-6 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 dark:border-[#37464F] dark:bg-[#131F24]"
            role="dialog"
            aria-modal="true"
            aria-label="Scorecard"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#F0F0F0] pb-4 text-left dark:border-[#37464F]">
              <div>
                <h3 className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">
                  Check out your scorecard!
                </h3>
                <p className="mt-1 text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                  Click the tiles below to reveal the solutions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScorecardOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#AFAFAF] hover:bg-[#F7F7F7] hover:text-[#4B4B4B] transition-colors cursor-pointer dark:text-[#8495A0] dark:hover:bg-[#202F36] dark:hover:text-white"
                aria-label="Close scorecard"
              >
                <X className="h-6 w-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Scorecard Tiles Scrollable List */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 text-left">
              {scorecard.map((item) => {
                const isExpanded = expandedTileId === item.id;

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border-2 border-[#E5E5E5] transition-all hover:border-[#CCCCCC] dark:border-[#37464F] dark:hover:border-[#52656D]"
                  >
                    {/* Tile Header */}
                    <button
                      type="button"
                      onClick={() => toggleTile(item.id)}
                      className="flex w-full items-center justify-between p-4 text-left cursor-pointer hover:bg-[#FAFAFA] transition-colors dark:hover:bg-[#202F36]"
                    >
                      <div className="flex items-center gap-3">
                        {/* Audio Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playPronunciation(item.kurdishText || item.correctResponse);
                          }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6] hover:bg-[#BAE9FF] transition-colors cursor-pointer dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-extrabold text-[#4B4B4B] dark:text-white">
                          {item.prompt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#58CC02] text-white shadow-xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-[#AFAFAF] dark:text-[#8495A0]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#AFAFAF] dark:text-[#8495A0]" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Expandable Content (Duolingo style) */}
                    {isExpanded && (
                      <div className="border-t border-[#F0F0F0] bg-[#F7F7F7] p-4 space-y-2.5 animate-in slide-in-from-top-2 duration-150 dark:border-[#37464F] dark:bg-[#1A262C]">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#777777] dark:text-[#8495A0]">
                            YOUR RESPONSE:
                          </p>
                          <p className="text-sm font-extrabold text-[#4B4B4B] dark:text-white mt-0.5">
                            {item.userResponse}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#58CC02]">
                            CORRECT RESPONSE:
                          </p>
                          <p className="text-sm font-extrabold text-[#58CC02] mt-0.5">
                            {item.correctResponse}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Footer Button */}
            <div className="mt-4 border-t border-[#F0F0F0] pt-4 dark:border-[#37464F]">
              <PushButton
                variant="green"
                onClick={() => setIsScorecardOpen(false)}
                className="w-full py-3 text-sm font-extrabold uppercase tracking-wider"
              >
                CONTINUE
              </PushButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
