"use client";

import Link from "next/link";
import { HeartCrack } from "lucide-react";
import { PushButton } from "@/components/duo/PushButton";

interface FailureModalProps {
  visible: boolean;
  correctSolution: string | null;
  onRestart: () => void;
}

/** Shown when hearts reach 0: restart the lesson or switch to Practice. */
export function FailureModal({
  visible,
  correctSolution,
  onRestart,
}: FailureModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl border-2 border-[#E5E5E5] bg-white p-8 text-center shadow-xl dark:border-[#37464F] dark:bg-[#131F24]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFDFE0] dark:bg-[#3A181D]">
          <HeartCrack className="h-10 w-10 text-[#EA2B2B] dark:text-[#FF5252]" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-[#4B4B4B] dark:text-white">
          You ran out of hearts!
        </h2>
        {correctSolution ? (
          <p className="mt-2 text-sm font-bold text-[#777777] dark:text-[#8495A0]">
            Last correct solution:{" "}
            <span dir="rtl" lang="ku" className="font-kurdish text-base kurdish-word text-[#EA2B2B] dark:text-[#FF5252]">
              {correctSolution}
            </span>
          </p>
        ) : null}
        <p className="mt-2 text-sm text-[#777777] dark:text-[#8495A0]">
          Practice the words to sharpen up, then try the lesson again.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <PushButton variant="green" onClick={onRestart} className="py-3">
            Restart lesson
          </PushButton>
          <Link href="/practice" className="block">
            <PushButton variant="blue" className="w-full py-3">
              Practice mode
            </PushButton>
          </Link>
          <Link
            href="/learn"
            className="text-sm font-extrabold uppercase tracking-wide text-[#AFAFAF] hover:text-[#777777] dark:text-[#8495A0] dark:hover:text-white"
          >
            Exit lesson
          </Link>
        </div>
      </div>
    </div>
  );
}
