"use client";

import React from "react";
import { Star, Headphones, Trophy, Check } from "lucide-react";
import { LessonPopover } from "./LessonPopover";



export type LessonNodeType = "star" | "audio" | "trophy";

interface PathLessonNodeProps {
  lesson: {
    _id: string;
    title: string;
    order: number;
    xpReward: number;
    isCompleted: boolean;
  };
  nodeType?: LessonNodeType;
  unlocked: boolean;
  isDone: boolean;
  isCurrent: boolean;
  isPopoverOpen: boolean;
  offset: number;
  onNodeClick: () => void;
  onClosePopover: () => void;
}

export function PathLessonNode({
  lesson,
  nodeType = "star",
  unlocked,
  isDone,
  isCurrent,
  isPopoverOpen,
  offset,
  onNodeClick,
  onClosePopover,
}: PathLessonNodeProps) {
  // Render the appropriate icon for this node type
  const renderIcon = (completed: boolean, isLocked: boolean) => {
    if (completed) {
      return <Check className="h-9 w-9 stroke-[3]" />;
    }

    if (isLocked) {
      if (nodeType === "audio") {
        return (
          <Headphones className="h-8 w-8 stroke-[2.5] text-[#AFAFAF] dark:text-[#52656D]" />
        );
      }
      if (nodeType === "trophy") {
        return (
          <Trophy className="h-8 w-8 fill-current text-[#AFAFAF] dark:text-[#52656D]" />
        );
      }
      return (
        <Star className="h-8 w-8 fill-current text-[#AFAFAF] dark:text-[#52656D]" />
      );
    }

    // Active / Unlocked state
    if (nodeType === "audio") {
      return <Headphones className="h-8 w-8 stroke-[2.5] text-white" />;
    }
    if (nodeType === "trophy") {
      return <Trophy className="h-8 w-8 fill-current text-white" />;
    }
    return <Star className="h-8 w-8 fill-current text-white" />;
  };

  return (
    <li
      style={{ marginLeft: offset }}
      className="relative flex flex-col items-center select-none"
    >
      {/* Floating Animated 'START' Badge for Active Lesson (Duolingo Style) */}
      {isCurrent && !isPopoverOpen && (
        <button
          type="button"
          onClick={onNodeClick}
          className="absolute -top-9 z-20 whitespace-nowrap rounded-xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02] shadow-sm animate-bounce cursor-pointer hover:scale-105 transition-transform"
        >
          <span>Start</span>
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-white dark:border-t-[#131F24]" />
        </button>
      )}

      {/* Outer Active Progress Ring for the Current Lesson */}
      {isCurrent && (
        <div className="absolute -inset-2.5 flex items-center justify-center pointer-events-none">
          <svg
            className="h-[92px] w-[92px] animate-[spin_20s_linear_infinite]"
            viewBox="0 0 92 92"
          >
            <circle
              cx="46"
              cy="46"
              r="42"
              fill="none"
              stroke="#58CC02"
              strokeWidth="4"
              strokeDasharray="264"
              strokeDashoffset="66"
              strokeLinecap="round"
              className="opacity-90"
            />
          </svg>
        </div>
      )}

      {/* 3D Circular Node Button */}
      {unlocked ? (
        <button
          type="button"
          onClick={onNodeClick}
          aria-label={`${lesson.title} (${nodeType})`}
          className={`relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] transition-all active:translate-y-[2px] active:border-b-2 cursor-pointer ${
            isDone
              ? "border-[#46A302] bg-[#58CC02] text-white hover:bg-[#61E002]"
              : nodeType === "trophy"
              ? "border-[#D99B00] bg-[#FFC800] text-white shadow-lg shadow-[#FFC800]/30 hover:bg-[#FFD733]"
              : "border-[#46A302] bg-[#58CC02] text-white shadow-lg shadow-[#58CC02]/30 hover:bg-[#61E002]"
          }`}
        >
          {renderIcon(isDone, false)}
        </button>
      ) : (
        <div
          aria-label={`${lesson.title} (Locked)`}
          className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] border-[#C7C7C7] dark:border-[#2B383F] bg-[#E5E5E5] dark:bg-[#37464F]"
        >
          {renderIcon(false, true)}
        </div>
      )}

      {/* Interactive Lesson Speech-Bubble Popover */}
      {isPopoverOpen && unlocked && (
        <LessonPopover
          lessonId={lesson._id}
          title={lesson.title}
          order={lesson.order}
          xpReward={lesson.xpReward}
          isCompleted={isDone}
          onClose={onClosePopover}
        />
      )}

      <p className="mt-2 text-center text-xs font-bold text-[#777777] dark:text-[#8495A0] max-w-[140px] truncate">
        {lesson.title}
      </p>
    </li>
  );
}
