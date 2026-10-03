"use client";

import { useState } from "react";
import { Volume2, CheckCircle2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface AudioClip {
  id: string;      // "A" | "B" | "C"
  label: string;   // "Audio A"
  text: string;    // the actual sentence to speak
}

interface BlindAudioScrambleViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function BlindAudioScrambleView({ exercise, onSelect, selected }: BlindAudioScrambleViewProps) {
  const solution = exercise.solutionData ?? {};
  const clips: AudioClip[] = (solution.clips as AudioClip[] | undefined) ?? [
    { id: "A", label: "Audio A", text: "I'm good, thank you. What about you?" },
    { id: "B", label: "Audio B", text: "Hey Ahmad, how are you?" },
    { id: "C", label: "Audio C", text: "I'm cool, thank you." },
  ];
  const correctOrder: string[] = (solution.correctOrder as string[] | undefined) ?? ["B", "A", "C"];
  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Blind Audio Scramble)";

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  // Which clips are already placed in a slot
  const placedIds = slots.filter(Boolean) as string[];
  const unplacedClips = clips.filter((c) => !placedIds.includes(c.id));

  const playClip = (clip: AudioClip) => {
    setPlayingId(clip.id);
    playAmericanSpeech(clip.text, 0.9);
    setTimeout(() => setPlayingId(null), 1800);
  };

  const handleSlotTap = (slotIndex: number) => {
    if (submitted) return;
    // If slot is occupied, clear it
    if (slots[slotIndex]) {
      const next = [...slots];
      next[slotIndex] = null;
      setSlots(next);
    }
  };

  const handleClipTap = (clipId: string) => {
    if (submitted) return;
    // Place in first empty slot
    const nextSlots = [...slots];
    const firstEmpty = nextSlots.findIndex((s) => s === null);
    if (firstEmpty === -1) return;
    nextSlots[firstEmpty] = clipId;
    setSlots(nextSlots);

    if (nextSlots.every((s) => s !== null)) {
      // Auto-submit when all 3 placed
      const correct = nextSlots.every((s, i) => s === correctOrder[i]);
      setResult(correct ? "correct" : "wrong");
      setSubmitted(true);
      onSelect(correct ? "completed" : "wrong_order");
    }
  };

  const handleReset = () => {
    setSlots([null, null, null]);
    setSubmitted(false);
    setResult(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <Volume2 className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          گوێ بگرە — ترتیبی دروستی گفتوگۆ دیاری بکە
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          هەر دەنگێک گوێ بگرەوە، پاشان بیانبنێ بە ترتیبی دروست
        </p>
      </div>

      {/* Audio clip players */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
          دەنگەکان (Clips)
        </span>
        {clips.map((clip) => {
          const isPlaced = placedIds.includes(clip.id);
          return (
            <div key={clip.id} className="flex gap-2.5">
              {/* Play button */}
              <button
                type="button"
                onClick={() => playClip(clip)}
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-b-2 transition-all",
                  playingId === clip.id
                    ? "border-[#1899D6] bg-[#1CB0F6] text-white animate-pulse"
                    : "border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9]"
                )}
              >
                <Volume2 className="h-5 w-5" />
              </button>

              {/* Clip tile — tap to place */}
              <button
                type="button"
                onClick={() => !isPlaced && handleClipTap(clip.id)}
                disabled={isPlaced || submitted}
                className={cn(
                  "flex-1 flex items-center justify-between rounded-2xl border-2 border-b-4 px-4 py-3 font-black transition-all select-none",
                  isPlaced
                    ? "border-[#AFAFAF] bg-[#F7F7F7] text-[#AFAFAF] cursor-not-allowed dark:border-[#52656D] dark:bg-[#1A1F24] dark:text-[#52656D]"
                    : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#F4FBFF] cursor-pointer dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
                )}
              >
                <span className="text-base">🔈 {clip.label}</span>
                <GripVertical className="h-4 w-4 text-[#AFAFAF]" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Ordering slots */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
          ترتیبی دروست (Correct Order)
        </span>
        {[0, 1, 2].map((i) => {
          const slotId = slots[i];
          const clip = clips.find((c) => c.id === slotId);
          const isCorrectSlot = submitted && slotId === correctOrder[i];
          const isWrongSlot = submitted && slotId && slotId !== correctOrder[i];

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSlotTap(i)}
              className={cn(
                "flex items-center justify-between rounded-2xl border-2 border-b-4 px-4 py-3 transition-all min-h-14",
                !submitted && slotId
                  ? "border-[#1CB0F6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#202F36] cursor-pointer"
                  : !submitted
                    ? "border-dashed border-[#AFAFAF] bg-[#F7F7F7] dark:border-[#52656D] dark:bg-[#1A1F24]"
                    : isCorrectSlot
                      ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#132817]"
                      : "border-[#EA2B2B] bg-[#FFDFE0] dark:border-[#EA2B2B] dark:bg-[#3A181D]"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black",
                  slotId ? "bg-[#1CB0F6] text-white" : "bg-[#E5E5E5] text-[#AFAFAF] dark:bg-[#37464F] dark:text-[#52656D]"
                )}>
                  {i + 1}
                </span>
                <span className={cn(
                  "text-base font-black",
                  slotId ? "text-[#4B4B4B] dark:text-white" : "text-[#AFAFAF] dark:text-[#52656D]"
                )}>
                  {clip ? `🔈 ${clip.label}` : "___"}
                </span>
              </div>
              {isCorrectSlot && <CheckCircle2 className="h-5 w-5 text-[#58CC02]" />}
            </button>
          );
        })}
      </div>

      {submitted && result === "wrong" && (
        <button
          type="button"
          onClick={handleReset}
          className="mx-auto rounded-2xl border-2 border-b-4 border-[#1CB0F6] bg-[#DDF4FF] px-6 py-3 text-sm font-black text-[#1CB0F6] transition-all hover:bg-[#B8E8FF]"
        >
          دووبارە هەوڵبدەرەوە
        </button>
      )}
    </div>
  );
}
