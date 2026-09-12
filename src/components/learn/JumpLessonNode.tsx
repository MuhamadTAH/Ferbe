"use client";

import { useState } from "react";
import { ChevronsRight, X, Zap, Award, Sparkles } from "lucide-react";
import { SquirrelMascot } from "@/components/duo/SquirrelMascot";

interface JumpLessonNodeProps {
  currentUnitOrder: number;
  nextUnitOrder: number;
  nextUnitTitle: string;
  onJump?: () => void;
}

export function JumpLessonNode({
  currentUnitOrder,
  nextUnitOrder,
  nextUnitTitle,
  onJump,
}: JumpLessonNodeProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [jumping, setJumping] = useState(false);

  const handleStartJump = () => {
    setJumping(true);
    setTimeout(() => {
      setJumping(false);
      setModalOpen(false);
      if (onJump) {
        onJump();
      } else {
        // Smooth scroll to next unit or notify
        const nextElem = document.getElementById(`unit-section-${nextUnitOrder}`);
        if (nextElem) {
          nextElem.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 800);
  };

  return (
    <div className="relative my-8 flex flex-col items-center select-none">
      {/* Companion Mascot Standing on the Left Side of the Path (Duolingo Style) */}
      <div className="absolute -left-28 -top-3 hidden sm:flex flex-col items-center select-none animate-in fade-in duration-300">
        <div className="relative mb-1 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] px-2.5 py-1 text-[11px] font-extrabold text-[#4B4B4B] dark:text-white shadow-xs">
          <span className="font-kurdish text-xs font-bold text-[#CE82FF] kurdish-word">
            ئامادەی؟
          </span>
          <span className="ml-1 text-[10px] text-[#AFAFAF] dark:text-[#8495A0]">
            (Ready to jump?)
          </span>
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-[#131F24]" />
        </div>
        <div className="flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
          <SquirrelMascot
            mood="fire"
            accessory="sunglasses"
            size={68}
            animate
            interactive
            title="Smorik cheering you to jump ahead!"
          />
        </div>
      </div>

      {/* "JUMP HERE?" Floating Speech Bubble Badge */}
      <div className="relative mb-2 animate-bounce">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="whitespace-nowrap rounded-xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#A560EC] dark:text-[#CE82FF] shadow-sm hover:scale-105 transition-transform cursor-pointer"
        >
          <span>Jump here?</span>
          <span className="ml-1 font-kurdish text-[11px] font-bold text-[#8495A0]">
            (بازبدە ئێرە؟)
          </span>
          {/* Pointer Triangle */}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-white dark:border-t-[#131F24]" />
        </button>
      </div>

      {/* 3D Purple Fast-Forward Button */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label={`Jump to Unit ${nextUnitOrder}`}
        className="group relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] border-[#8438D6] bg-[#A560EC] text-white shadow-lg shadow-[#A560EC]/30 transition-all hover:bg-[#B777FA] active:translate-y-[2px] active:border-b-2 cursor-pointer"
      >
        <div className="flex items-center justify-center transition-transform group-hover:scale-110">
          <ChevronsRight className="h-9 w-9 stroke-[3]" />
        </div>
      </button>

      <span className="mt-2 text-center text-xs font-extrabold text-[#777777] dark:text-[#8495A0]">
        Jump to Unit {nextUnitOrder}
      </span>

      {/* JUMP CHECKPOINT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-6 text-[#4B4B4B] dark:text-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#A560EC] text-white shadow-sm shadow-[#A560EC]/30">
                  <ChevronsRight className="h-6 w-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#A560EC] dark:text-[#CE82FF]">
                    Jump to Unit {nextUnitOrder}?
                  </h3>
                  <p
                    dir="rtl"
                    className="font-kurdish text-xs font-bold text-[#8495A0]"
                  >
                    بازدان بۆ یەکەی {nextUnitOrder}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Illustration */}
            <div className="my-6 flex flex-col items-center justify-center rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36] p-6 text-center border border-[#E5E5E5] dark:border-[#37464F]/60">
              <SquirrelMascot mood="cheering" size={96} animate />
              <h4 className="mt-3 text-base font-extrabold text-[#4B4B4B] dark:text-white">
                Pass the test to jump ahead!
              </h4>
              <p className="mt-1 text-xs text-[#777777] dark:text-[#8495A0] max-w-xs leading-relaxed">
                Take a quick challenge to test out of Unit {currentUnitOrder} and unlock{" "}
                <strong className="text-[#A560EC] dark:text-[#CE82FF]">{nextUnitTitle}</strong>{" "}
                immediately.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleStartJump}
                disabled={jumping}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-[#8438D6] bg-[#A560EC] py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#B777FA] active:translate-y-[2px] active:border-b-2 cursor-pointer"
              >
                {jumping ? (
                  <span>Unlocking Unit {nextUnitOrder}...</span>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-white text-white" />
                    <span>Let&apos;s Go · بازبدە</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full rounded-2xl border-2 border-transparent py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] transition-colors cursor-pointer"
              >
                Maybe Later · دواتر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
