"use client";

import Link from "next/link";
import { Zap, RotateCcw, X } from "lucide-react";

interface LessonPopoverProps {
  lessonId: string;
  title: string;
  order: number;
  xpReward: number;
  isCompleted: boolean;
  onClose: () => void;
}

export function LessonPopover({
  lessonId,
  title,
  order,
  xpReward,
  isCompleted,
  onClose,
}: LessonPopoverProps) {
  return (
    <div className="absolute left-1/2 top-full z-30 mt-3.5 -translate-x-1/2 animate-in zoom-in-95 duration-150">
      {/* Speech bubble pointer (triangle) pointing UP at the circle node */}
      <div className="mx-auto h-0 w-0 border-8 border-transparent border-b-[#58CC02]" />

      <div className="w-72 rounded-3xl border-2 border-[#58CC02] bg-[#58CC02] p-4 text-white shadow-xl">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/80">
              Lesson {order}
            </span>
            <h4 className="text-base font-extrabold leading-tight text-white">
              {title}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss popover"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-white/80 hover:bg-black/20 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs font-bold text-white/90">
          <span className="flex items-center gap-1 rounded-lg bg-black/15 px-2 py-0.5">
            <Zap className="h-3.5 w-3.5 fill-[#FFC800] text-[#FFC800]" />
            +{xpReward} XP
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 rounded-lg bg-black/15 px-2 py-0.5 text-white">
              <RotateCcw className="h-3.5 w-3.5" />
              Completed
            </span>
          )}
        </div>

        <Link href={`/lesson/${lessonId}`} className="block w-full">
          <button
            type="button"
            className="w-full rounded-2xl border-b-4 border-white/40 bg-white py-3 text-center text-sm font-extrabold uppercase tracking-wide text-[#58CC02] transition-all hover:bg-white/95 active:translate-y-[2px] active:border-b-2 shadow-sm"
          >
            {isCompleted ? "Practice" : "Start"}
          </button>
        </Link>
      </div>
    </div>
  );
}
