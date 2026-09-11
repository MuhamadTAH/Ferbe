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

/** Session-complete screen with XP / accuracy / streak stats and interactive Scorecard. */
export function LessonComplete({
  lessonTitle,
  xpEarned,
  accuracyPct,
  currentStreak,
  totalXp,
  scorecard = DEFAULT_SCORECARD,
  onRestart,
}: LessonCompleteProps) {
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
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 py-16 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#FFC800]/20 animate-ping" />
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#FFC800]">
          <Star className="h-14 w-14 fill-white text-white" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-[#58CC02]">Practice Complete!</h1>
        <p className="mt-1 text-sm font-bold text-[#777777]">{lessonTitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid w-full grid-cols-3 gap-3">
        <div className="rounded-2xl border-2 border-b-4 border-[#FFC800] p-4">
          <Zap className="mx-auto h-6 w-6 text-[#FFC800]" />
          <p className="mt-1 text-2xl font-extrabold text-[#4B4B4B]">{xpEarned}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-[#AFAFAF]">
            TOTAL XP
          </p>
        </div>
        <div className="rounded-2xl border-2 border-b-4 border-[#58CC02] p-4">
          <Target className="mx-auto h-6 w-6 text-[#58CC02]" />
          <p className="mt-1 text-2xl font-extrabold text-[#4B4B4B]">{accuracyPct}%</p>
          <p className="text-xs font-bold uppercase tracking-wide text-[#AFAFAF]">
            ACCURACY
          </p>
        </div>
        <div className="rounded-2xl border-2 border-b-4 border-[#FF4B4B] p-4">
          <Flame className="mx-auto h-6 w-6 text-[#FF4B4B]" />
          <p className="mt-1 text-2xl font-extrabold text-[#4B4B4B]">{currentStreak}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-[#AFAFAF]">
            DAY STREAK
          </p>
        </div>
      </div>

      {/* 7-Day Streak Calendar Progression */}
      <div className="w-full rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-sm text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 fill-[#FF9600] text-[#FF9600]" />
            <span className="text-sm font-extrabold text-[#4B4B4B]">
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
              <span className="text-[11px] font-extrabold text-[#AFAFAF]">
                {day.label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-transform ${
                  day.done
                    ? "border-[#FF9600] bg-[#FF9600] text-white shadow-xs"
                    : "border-[#E5E5E5] bg-[#F7F7F7] text-[#AFAFAF]"
                } ${day.today ? "scale-110 ring-2 ring-[#FF9600]/30" : ""}`}
              >
                {day.done ? <Flame className="h-4 w-4 fill-white" /> : "·"}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs font-bold text-[#777777]">
          Practicing daily grows your streak, but skipping a day resets it!
        </p>
      </div>

      {/* Fêrbe Pro Ad / Promo Card */}
      <div className="flex w-full items-center justify-between rounded-2xl border-2 border-[#CE82FF]/40 bg-gradient-to-r from-[#7928CA]/10 via-[#8B35D9]/10 to-[#CE82FF]/10 p-4 text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CE82FF] text-white shadow-sm">
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
            className="shrink-0 rounded-xl bg-[#CE82FF] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white hover:bg-[#B55BE0] transition-colors"
          >
            Try Free
          </button>
        </Link>
      </div>

      {/* Total XP footer text */}
      <p className="text-xs font-bold text-[#AFAFAF]">
        Total Kurdish XP: <span className="font-extrabold text-[#4B4B4B]">{totalXp}</span>
      </p>

      {/* Action Buttons */}
      <div className="flex w-full max-w-sm flex-col gap-2.5">
        <Link href="/learn" className="w-full">
          <PushButton variant="green" className="w-full py-3.5 text-base uppercase tracking-wider">
            CONTINUE
          </PushButton>
        </Link>

        {/* REVIEW LESSON Button (Duolingo authentic) */}
        <button
          type="button"
          onClick={() => setIsScorecardOpen(true)}
          className="w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-3 text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer"
        >
          REVIEW LESSON
        </button>

        {/* PRACTICE AGAIN Button */}
        {onRestart ? (
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center justify-center gap-1.5 w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#777777] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>PRACTICE AGAIN</span>
          </button>
        ) : (
          <Link href="/practice" className="w-full">
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#777777] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>PRACTICE AGAIN</span>
            </button>
          </Link>
        )}
      </div>

      {/* SCORECARD DRAWER MODAL */}
      {isScorecardOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200">
          <div
            className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-3xl border-t-2 border-[#E5E5E5] bg-white p-6 shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Scorecard"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#F0F0F0] pb-4 text-left">
              <div>
                <h3 className="text-xl font-extrabold text-[#4B4B4B]">
                  Check out your scorecard!
                </h3>
                <p className="mt-1 text-xs font-bold text-[#777777]">
                  Click the tiles below to reveal the solutions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScorecardOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#AFAFAF] hover:bg-[#F7F7F7] hover:text-[#4B4B4B] transition-colors"
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
                    className="overflow-hidden rounded-2xl border-2 border-[#E5E5E5] transition-all hover:border-[#CCCCCC]"
                  >
                    {/* Tile Header */}
                    <button
                      type="button"
                      onClick={() => toggleTile(item.id)}
                      className="flex w-full items-center justify-between p-4 text-left cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Audio Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playPronunciation(item.kurdishText || item.correctResponse);
                          }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6] hover:bg-[#BAE9FF] transition-colors cursor-pointer"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-extrabold text-[#4B4B4B]">
                          {item.prompt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#58CC02] text-white shadow-xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-[#AFAFAF]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#AFAFAF]" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Expandable Content (Duolingo style) */}
                    {isExpanded && (
                      <div className="border-t border-[#F0F0F0] bg-[#F7F7F7] p-4 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#777777]">
                            YOUR RESPONSE:
                          </p>
                          <p className="text-sm font-extrabold text-[#4B4B4B] mt-0.5">
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
            <div className="mt-4 border-t border-[#F0F0F0] pt-4">
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

