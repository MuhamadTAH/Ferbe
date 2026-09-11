"use client";

import { X, Volume2, BookOpen, Lightbulb, Sparkles } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface UnitGuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitTitle: string;
  unitOrder: number;
}

const UNIT_KEY_PHRASES = [
  {
    kurdish: "سڵاو",
    transliteration: "Slaw",
    english: "Hello",
    audioUrl: "/audio/slaw.mp3",
    note: "Universal friendly greeting used at any time of day.",
  },
  {
    kurdish: "سوپاس",
    transliteration: "Supas",
    english: "Thank you",
    audioUrl: "/audio/supas.mp3",
    note: "Polite gratitude phrase in everyday Sorani Kurdish.",
  },
  {
    kurdish: "بەیانی باش",
    transliteration: "Beyanî bash",
    english: "Good morning",
    audioUrl: "/audio/beyani_bash.mp3",
    note: "Used until midday.",
  },
  {
    kurdish: "ئاو",
    transliteration: "Aw",
    english: "Water",
    audioUrl: "/audio/aw.mp3",
    note: "Essential noun.",
  },
  {
    kurdish: "نان",
    transliteration: "Nan",
    english: "Bread",
    audioUrl: "/audio/nan.mp3",
    note: "Pivotal food staple and everyday word.",
  },
];

export function UnitGuidebookModal({
  isOpen,
  onClose,
  unitTitle,
  unitOrder,
}: UnitGuidebookModalProps) {
  const { play, isPlayingUrl } = useAudioPlayer();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close guidebook"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F7F7] text-[#777777] transition-colors hover:bg-[#E5E5E5] hover:text-[#4B4B4B]"
        >
          <X className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#58CC02] text-white shadow-sm shadow-[#58CC02]/30">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#58CC02]">
              Unit {unitOrder} Guidebook
            </span>
            <h2 className="text-xl font-extrabold text-[#4B4B4B] sm:text-2xl">
              {unitTitle}
            </h2>
          </div>
        </div>

        {/* Grammar Tip Box */}
        <div className="mb-6 rounded-2xl border-2 border-[#84D8FF] bg-[#DDF4FF] p-4 text-sm text-[#1899D6]">
          <div className="mb-1.5 flex items-center gap-2 font-extrabold">
            <Lightbulb className="h-5 w-5 fill-[#1CB0F6] text-[#1CB0F6]" />
            <span>Key Grammar Tip: Word Order & Politeness</span>
          </div>
          <p className="font-medium leading-relaxed text-[#4B4B4B]">
            Sorani Kurdish uses <strong>Subject-Object-Verb (SOV)</strong> sentence structure.
            Kurdish is gender-neutral (no grammatical he/she distinction in pronouns).
            Greetings like <span dir="rtl" className="font-kurdish font-bold">سڵاو</span> (Slaw) can be used anywhere, anytime!
          </p>
        </div>

        {/* Key Vocabulary Section */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FFC800]" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#777777]">
              Key Vocabulary & Pronunciation
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {UNIT_KEY_PHRASES.map((phrase) => (
              <div
                key={phrase.kurdish}
                className="flex items-center justify-between rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F7F7]/60 p-3.5 transition-colors hover:bg-white hover:border-[#84D8FF]"
              >
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => play(phrase.audioUrl)}
                    aria-label={`Listen to ${phrase.transliteration}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-b-2 border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9] active:translate-y-0.5"
                  >
                    <Volume2
                      className={`h-5 w-5 ${
                        isPlayingUrl(phrase.audioUrl) ? "animate-pulse" : ""
                      }`}
                    />
                  </button>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-[#4B4B4B]">
                        {phrase.english}
                      </span>
                      <span className="text-xs font-semibold text-[#AFAFAF]">
                        ({phrase.transliteration})
                      </span>
                    </div>
                    <p className="text-xs text-[#777777]">{phrase.note}</p>
                  </div>
                </div>

                <span
                  dir="rtl"
                  lang="ku"
                  className="font-kurdish text-2xl font-bold text-[#58CC02]"
                >
                  {phrase.kurdish}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Close CTA */}
        <div className="mt-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border-b-4 border-[#46A302] bg-[#58CC02] py-3.5 text-center font-extrabold uppercase tracking-wide text-white transition-all hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
