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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFDFE0]">
          <HeartCrack className="h-10 w-10 text-[#EA2B2B]" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-[#4B4B4B]">
          You ran out of hearts!
        </h2>
        {correctSolution ? (
          <p className="mt-2 text-sm font-bold text-[#777777]">
            Last correct solution:{" "}
            <span dir="rtl" lang="ku" className="font-kurdish text-base kurdish-word">
              {correctSolution}
            </span>
          </p>
        ) : null}
        <p className="mt-2 text-sm text-[#777777]">
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
            className="text-sm font-extrabold uppercase tracking-wide text-[#AFAFAF] hover:text-[#777777]"
          >
            Exit lesson
          </Link>
        </div>
      </div>
    </div>
  );
}
