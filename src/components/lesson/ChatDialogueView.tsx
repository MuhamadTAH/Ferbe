"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Volume2, CheckCircle2, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface ChatDialogueViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
  lastCorrect: boolean | null;
}

export function ChatDialogueView({
  exercise,
  onSelect,
  selected,
  lastCorrect,
}: ChatDialogueViewProps) {
  const [chosenAnswer, setChosenAnswer] = useState<string | null>(selected);
  const [isPlayingIncoming, setIsPlayingIncoming] = useState(false);

  const solution = exercise.solutionData ?? {};
  const incomingMessage = (solution.incomingMessage as string) || "Hey Ahmad, how are you?";
  const correctAnswer = ((solution.correct as string) || "I'm good, thank you. How are you?").trim();

  const options: string[] = (solution.options as string[] | undefined) ?? [
    "I'm good, thank you. How are you?",
    "I'm fine, thank you. Hi Sara.",
    "Hello, me too.",
  ];

  const instruction = (solution.instruction as string) || "دیالۆگ و چاتی زیندوو (Interactive Chat Dialogue)";

  // Auto-play ONLY the incoming question on mount!
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePlayIncoming();
    }, 400);
    return () => clearTimeout(timer);
  }, [incomingMessage]);

  const handlePlayIncoming = () => {
    setIsPlayingIncoming(true);
    playAmericanSpeech(incomingMessage, 0.88);
    setTimeout(() => setIsPlayingIncoming(false), 1500);
  };

  const handlePickOption = (option: string) => {
    setChosenAnswer(option);
    onSelect(option);

    // If correct, play audio of the selected response so learner hears it in dialogue
    if (option.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setTimeout(() => {
        playAmericanSpeech(option, 0.88);
      }, 200);
    }
  };

  const isAnsweredCorrect =
    chosenAnswer !== null && chosenAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          وەڵامی گونجاو هەڵبژێرە بۆ بەردەوامیدان بە چاتەکە
        </h2>
      </div>

      {/* Messenger Chat Box */}
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F9FA] p-5 shadow-inner dark:border-[#37464F] dark:bg-[#0E161A]">
        {/* Bubble 1: Incoming Message from partner (Left) */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#1CB0F6] text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative flex items-center gap-2.5 rounded-2xl rounded-tl-none bg-white p-4 shadow-sm border border-[#E5E5E5] dark:border-[#2A3F49] dark:bg-[#1A262C]">
              <p dir="ltr" className="text-lg font-black text-[#4B4B4B] dark:text-white">
                {incomingMessage}
              </p>
              <button
                type="button"
                onClick={handlePlayIncoming}
                aria-label="Replay incoming audio"
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                  isPlayingIncoming
                    ? "bg-[#1CB0F6] text-white animate-pulse"
                    : "bg-[#F0F0F0] text-[#777777] hover:bg-[#1CB0F6] hover:text-white dark:bg-[#2B3B42] dark:text-white"
                )}
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <span className="text-[10px] font-bold text-[#AFAFAF] px-1">هاوڕێی گفتوگۆ</span>
          </div>
        </div>

        {/* Bubble 2: User's Response (Right) */}
        <div className="flex items-start justify-end gap-3">
          <div className="flex flex-col items-end gap-1">
            <div
              className={cn(
                "relative rounded-2xl rounded-tr-none p-4 shadow-sm transition-all border",
                chosenAnswer
                  ? isAnsweredCorrect
                    ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#1E3B20]"
                    : "border-[#EA2B2B] bg-[#FFDFE0] dark:border-[#EA2B2B] dark:bg-[#3A181D]"
                  : "border-dashed border-[#AFAFAF] bg-white dark:border-[#37464F] dark:bg-[#1A262C]"
              )}
            >
              <p
                dir="ltr"
                className={cn(
                  "text-lg font-black",
                  chosenAnswer
                    ? isAnsweredCorrect
                      ? "text-[#58A700] dark:text-[#58CC02]"
                      : "text-[#EA2B2B]"
                    : "text-[#AFAFAF] italic"
                )}
              >
                {chosenAnswer ? chosenAnswer : "وەڵامەکەت لێرە دەردەکەوێت..."}
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#AFAFAF] px-1">تۆ (Learner)</span>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#58CC02] text-white shadow-sm">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3 Response Choices */}
      <div className="flex flex-col gap-2.5 mt-2">
        <span className="text-center text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
          وەڵامێک دیاری بکە (Select a response):
        </span>

        {options.map((option, idx) => {
          const isSelected = chosenAnswer === option;
          const isCorrect = option.trim().toLowerCase() === correctAnswer.toLowerCase();
          const letter = ["A", "B", "C"][idx] || `${idx + 1}`;

          return (
            <button
              key={option}
              type="button"
              onClick={() => handlePickOption(option)}
              className={cn(
                "flex items-center gap-3.5 rounded-2xl border-2 border-b-4 p-4 font-black transition-all text-left select-none cursor-pointer",
                isSelected
                  ? isCorrect
                    ? "border-[#58CC02] bg-[#E8FAD4] text-[#58A700] dark:border-[#58CC02] dark:bg-[#1E3B20] dark:text-[#58CC02]"
                    : "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#3A181D]"
                  : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-b-2 text-xs font-black",
                  isSelected
                    ? "border-current bg-white dark:bg-[#131F24]"
                    : "border-[#E5E5E5] bg-[#F7F7F7] text-[#777777] dark:border-[#37464F] dark:bg-[#202F36] dark:text-white"
                )}
              >
                {letter}
              </span>

              <span dir="ltr" className="text-base flex-1">
                {option}
              </span>

              {isSelected && isCorrect && <CheckCircle2 className="h-5 w-5 stroke-[2.5] text-[#58CC02]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
