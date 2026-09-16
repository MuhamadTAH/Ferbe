"use client";

import { useState } from "react";
import { Volume2, Check, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface SoundTile {
  id: string;
  label: string;
  word: string;
}

interface AcousticMatchViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function AcousticMatchView({ exercise, onSelect, selected }: AcousticMatchViewProps) {
  const [selectedSoundId, setSelectedSoundId] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Map<string, string>>(new Map());
  const [shakeError, setShakeError] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const solution = exercise.solutionData ?? {};

  // Sounds (left column) randomized order: e.g. Sound 1 (Hi), Sound 2 (Hey), Sound 3 (Hello)
  const soundTiles: SoundTile[] = (solution.sounds as SoundTile[] | undefined) ?? [
    { id: "s1", label: "Sound 1", word: "Hi" },
    { id: "s2", label: "Sound 2", word: "Hey" },
    { id: "s3", label: "Sound 3", word: "Hello" },
  ];

  // English words (right column): e.g. Hey, Hello, Hi (zero Kurdish text)
  const wordTiles: string[] = (solution.words as string[] | undefined) ?? [
    "Hey",
    "Hello",
    "Hi",
  ];

  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Acoustic Match)";

  const handlePlaySound = (st: SoundTile) => {
    setSelectedSoundId(st.id);
    setPlayingId(st.id);
    playAmericanSpeech(st.word, 0.88);
    setTimeout(() => setPlayingId(null), 900);

    if (selectedWord) {
      evaluatePair(st.id, st.word, selectedWord);
    }
  };

  const handleSelectWord = (word: string) => {
    // If word is already matched
    if (Array.from(matchedPairs.values()).includes(word)) return;

    setSelectedWord(word);

    if (selectedSoundId) {
      const sound = soundTiles.find((s) => s.id === selectedSoundId);
      if (sound) {
        evaluatePair(sound.id, sound.word, word);
      }
    }
  };

  const evaluatePair = (soundId: string, soundWord: string, pickedWord: string) => {
    if (soundWord.toLowerCase() === pickedWord.toLowerCase()) {
      const next = new Map(matchedPairs);
      next.set(soundId, pickedWord);
      setMatchedPairs(next);
      setSelectedSoundId(null);
      setSelectedWord(null);

      // Check if all matched
      if (next.size >= soundTiles.length) {
        onSelect((solution.correct as string) || "matched");
      }
    } else {
      setShakeError(true);
      setTimeout(() => {
        setShakeError(false);
        setSelectedSoundId(null);
        setSelectedWord(null);
      }, 700);
    }
  };

  const allMatched = matchedPairs.size >= soundTiles.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <Headphones className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          گوێ لە دەنگەکان بگرە و وشە هاوتاکەیان دیاری بکە
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          کلیک لە دەنگەکە بکە پاشان کلیک لەسەر وشە ئینگلیزییەکە بکە
        </p>
      </div>

      {/* 2 Columns: Left Sounds & Right English Tiles */}
      <div className={cn("grid grid-cols-2 gap-4", shakeError && "animate-shake")}>
        {/* Left Column (Playable Sound Buttons) */}
        <div className="flex flex-col gap-3">
          <span className="text-center text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
            دەنگ (Sound)
          </span>
          {soundTiles.map((st) => {
            const isMatched = matchedPairs.has(st.id);
            const isSelected = selectedSoundId === st.id;
            const isPlaying = playingId === st.id;

            return (
              <button
                key={st.id}
                type="button"
                disabled={isMatched}
                onClick={() => handlePlaySound(st)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 font-black transition-all select-none cursor-pointer min-h-20",
                  isMatched
                    ? "border-[#58CC02] bg-[#E8FAD4] text-[#58A700] dark:border-[#58CC02] dark:bg-[#132817] dark:text-[#58CC02]"
                    : isSelected
                      ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1899D6] ring-2 ring-[#1CB0F6]/40 dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                      : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      isPlaying
                        ? "bg-[#1CB0F6] text-white animate-pulse"
                        : "bg-[#F0F0F0] text-[#777777] dark:bg-[#2A3B43] dark:text-white"
                    )}
                  >
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-black">{st.label}</span>
                </div>
                {isMatched && <Check className="h-5 w-5 stroke-[3] text-[#58CC02]" />}
              </button>
            );
          })}
        </div>

        {/* Right Column (English Text Tiles: zero Kurdish text) */}
        <div className="flex flex-col gap-3">
          <span className="text-center text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
            وشە (Word)
          </span>
          {wordTiles.map((w) => {
            const isMatched = Array.from(matchedPairs.values()).includes(w);
            const isSelected = selectedWord === w;

            return (
              <button
                key={w}
                type="button"
                disabled={isMatched}
                onClick={() => handleSelectWord(w)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 font-black transition-all select-none cursor-pointer min-h-20 text-left",
                  isMatched
                    ? "border-[#58CC02] bg-[#E8FAD4] text-[#58A700] dark:border-[#58CC02] dark:bg-[#132817] dark:text-[#58CC02]"
                    : isSelected
                      ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1899D6] ring-2 ring-[#1CB0F6]/40 dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                      : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
                )}
              >
                <span dir="ltr" className="text-xl font-black">
                  {w}
                </span>
                {isMatched && <Check className="h-5 w-5 stroke-[3] text-[#58CC02]" />}
              </button>
            );
          })}
        </div>
      </div>

      {shakeError && (
        <div className="rounded-xl bg-[#FFDFE0] dark:bg-[#3A181D] p-2.5 text-center">
          <p dir="rtl" className="font-kurdish text-xs font-bold text-[#EA2B2B]">
            دەنگەکە لەگەڵ ئەم وشەیە یەک ناگرێتەوە! دووبارە گوێ بگرەوە.
          </p>
        </div>
      )}

      {allMatched && (
        <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
            هەموو دەنگەکان بە دروستی هاوتا کران! کلیک لەسەر بەردەوامبوون بکە.
          </p>
        </div>
      )}
    </div>
  );
}
