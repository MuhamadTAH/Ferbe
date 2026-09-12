"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Sparkles, Trash2, Smile, ArrowRight } from "lucide-react";
import {
  StatusFlair,
  FlairCategory,
  FLAIR_CATEGORIES,
  STATUS_FLAIRS,
  TIER_CONFIG,
  resolveFlair,
  writeStoredUserStatus,
  readStoredUserStatus,
} from "./statusFlairs";
import { AvatarWithFlair } from "./AvatarWithFlair";

export interface ProfileStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFlairId?: string | null;
  currentStatusText?: string | null;
  userName?: string;
  avatarUrl?: string;
  onSave?: (flair: StatusFlair | null, customText: string | null) => Promise<void> | void;
}

const PRESET_STATUS_QUOTES = [
  "Studying 15 mins daily 📚",
  "Keeping the flame alive 🔥",
  "Kurdish Sorani in progress ☀️",
  "Beast mode focus ⚡",
  "Zimanzanî Kurdî 📖",
];

export function ProfileStatusModal({
  isOpen,
  onClose,
  currentFlairId,
  currentStatusText,
  userName = "Learner",
  avatarUrl,
  onSave,
}: ProfileStatusModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<FlairCategory>("learning");
  const [selectedFlairId, setSelectedFlairId] = useState<string | null>(null);
  const [customText, setCustomText] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize or update state when modal opens
  useEffect(() => {
    if (isOpen) {
      const stored = readStoredUserStatus();
      const initialFlairId = currentFlairId ?? stored.flairId;
      const initialText = currentStatusText ?? stored.statusText ?? "";
      setSelectedFlairId(initialFlairId);
      setCustomText(initialText);

      // Auto-switch category to match selected flair
      if (initialFlairId) {
        const matching = resolveFlair(initialFlairId);
        if (matching) {
          setSelectedCategory(matching.category);
        }
      }
    }
  }, [isOpen, currentFlairId, currentStatusText]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeFlair = resolveFlair(selectedFlairId, false);
  const tierConfig = activeFlair ? TIER_CONFIG[activeFlair.tier] : null;

  const categoryFlairs = STATUS_FLAIRS.filter(
    (f) => f.category === selectedCategory
  );

  const handleSave = async () => {
    setIsSaving(true);
    const trimmedText = customText.trim();
    const finalFlair = activeFlair;
    const finalText = trimmedText.length > 0 ? trimmedText : null;

    try {
      writeStoredUserStatus(finalFlair ? finalFlair.id : null, finalText);
      if (onSave) {
        await onSave(finalFlair, finalText);
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    setIsSaving(true);
    try {
      setSelectedFlairId(null);
      setCustomText("");
      writeStoredUserStatus(null, null);
      if (onSave) {
        await onSave(null, null);
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-[#E5E5E5] bg-white shadow-2xl dark:border-[#37464F] dark:bg-[#131F24] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#E5E5E5] px-6 py-4 dark:border-[#37464F]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DDF4FF] text-[#1CB0F6] dark:bg-[#1C3B4E] dark:text-[#3BC0F8]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#4B4B4B] dark:text-white">
                Status & Flair
              </h3>
              <p className="text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                دۆخ و نیشانەی فێربوون · Personalize your Kurdish profile badge
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#AFAFAF] transition-colors hover:bg-[#F7F7F7] hover:text-[#4B4B4B] dark:text-[#8495A0] dark:hover:bg-[#202F36] dark:hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* 1. Live Avatar Preview Section */}
          <div className="rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F7F7] p-4.5 dark:border-[#37464F] dark:bg-[#202F36]">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <AvatarWithFlair
                displayName={userName}
                avatarUrl={avatarUrl}
                flair={activeFlair}
                size="lg"
              />

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                    {userName}
                  </span>
                  {activeFlair && tierConfig && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide ${tierConfig.badgeBg} ${tierConfig.badgeText}`}
                    >
                      <span>{activeFlair.emoji}</span>
                      <span>{tierConfig.nameEn}</span>
                      <span className="opacity-70">({tierConfig.nameKu})</span>
                    </span>
                  )}
                </div>

                {activeFlair ? (
                  <div className="mt-1">
                    <p className="text-xs font-extrabold text-[#1CB0F6] dark:text-[#3BC0F8]">
                      {activeFlair.labelEn}{" "}
                      <span className="text-[#4B4B4B] dark:text-white font-normal">
                        ({activeFlair.labelKu})
                      </span>
                    </p>
                    <p className="text-[11px] font-bold text-[#777777] dark:text-[#8495A0] line-clamp-1 mt-0.5">
                      {activeFlair.description}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                    Select a Kurdish heritage or learning flair below
                  </p>
                )}

                {/* Custom Status Quote Bubble */}
                {customText.trim().length > 0 && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-white px-3 py-1 text-xs font-bold text-[#4B4B4B] shadow-xs dark:border-[#37464F] dark:bg-[#131F24] dark:text-white">
                    <Smile className="h-3.5 w-3.5 text-[#FF9600] shrink-0" />
                    <span className="truncate">&ldquo;{customText.trim()}&rdquo;</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Custom Status Text Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="custom-status-input"
                className="text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0]"
              >
                Custom status text (optional)
              </label>
              <span className="text-[11px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                {customText.length}/60
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                id="custom-status-input"
                type="text"
                maxLength={60}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Studying 15 mins daily · ڕۆژانە دەخوێنم..."
                className="w-full rounded-2xl border-2 border-[#E5E5E5] bg-white px-4 py-2.5 text-xs font-bold text-[#4B4B4B] placeholder-[#AFAFAF] transition-all focus:border-[#1CB0F6] focus:outline-hidden dark:border-[#37464F] dark:bg-[#131F24] dark:text-white dark:placeholder-[#52656D]"
              />
              {customText.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCustomText("")}
                  className="absolute right-3 text-[#AFAFAF] hover:text-[#4B4B4B] dark:text-[#8495A0] dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Suggestions Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-extrabold text-[#AFAFAF] dark:text-[#8495A0] mr-1">
                Presets:
              </span>
              {PRESET_STATUS_QUOTES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCustomText(preset)}
                  className="rounded-full border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-[#777777] transition-colors hover:border-[#1CB0F6] hover:text-[#1CB0F6] dark:border-[#37464F] dark:bg-[#202F36] dark:text-[#8495A0] dark:hover:border-[#3BC0F8] dark:hover:text-white cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Category Tabs */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0]">
              Choose Badge Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FLAIR_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 p-2.5 text-center transition-all cursor-pointer ${
                      isActive
                        ? "border-[#1CB0F6] bg-[#DDF4FF]/60 dark:bg-[#1C3B4E]/60 shadow-xs scale-[1.02]"
                        : "border-[#E5E5E5] bg-white dark:border-[#37464F] dark:bg-[#131F24] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36]"
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.icon}</span>
                    <span
                      className={`text-xs font-extrabold leading-tight ${
                        isActive
                          ? "text-[#1899D6] dark:text-[#3BC0F8]"
                          : "text-[#4B4B4B] dark:text-white"
                      }`}
                    >
                      {cat.labelEn}
                    </span>
                    <span className="text-[10px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                      {cat.labelKu}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Categorized Flair Selection Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0]">
                {FLAIR_CATEGORIES.find((c) => c.id === selectedCategory)?.description}
              </span>
              <span className="text-[11px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                {categoryFlairs.length} Badges
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryFlairs.map((flair) => {
                const isSelected = selectedFlairId === flair.id;
                const tier = TIER_CONFIG[flair.tier];

                return (
                  <button
                    key={flair.id}
                    type="button"
                    onClick={() => setSelectedFlairId(flair.id)}
                    className={`relative flex items-start gap-3 rounded-2xl border-2 p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#1CB0F6] bg-[#DDF4FF]/40 dark:bg-[#1C3B4E]/50 ring-2 ring-[#1CB0F6] shadow-sm scale-[1.01]"
                        : "border-[#E5E5E5] bg-white dark:border-[#37464F] dark:bg-[#131F24] hover:border-[#D1D5DB] dark:hover:border-[#52656D] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36]"
                    }`}
                  >
                    {/* Flair Icon Pill */}
                    <div
                      style={{
                        backgroundColor: flair.bgLight,
                      }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-xs border border-black/5"
                    >
                      {flair.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="truncate">
                          <span className="text-xs font-extrabold text-[#4B4B4B] dark:text-white mr-1.5">
                            {flair.labelEn}
                          </span>
                          <span className="text-xs font-bold text-[#1899D6] dark:text-[#3BC0F8]">
                            {flair.labelKu}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1CB0F6] text-white shadow-xs">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] font-bold text-[#777777] dark:text-[#8495A0] leading-snug line-clamp-2 mt-0.5">
                        {flair.description}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${tier.badgeBg} ${tier.badgeText}`}
                        >
                          {tier.nameEn} · {tier.nameKu}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t-2 border-[#E5E5E5] px-6 py-4 dark:border-[#37464F] bg-[#F7F7F7]/50 dark:bg-[#131F24]">
          <div>
            {(activeFlair || customText.length > 0) && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isSaving}
                className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] transition-colors hover:text-[#EA2B2B] dark:text-[#8495A0] dark:hover:text-[#FF4B4B] cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove Flair & Status</span>
              </button>
            )}
          </div>

          <div className="flex w-full sm:w-auto items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-1/2 sm:w-auto rounded-2xl border-2 border-[#E5E5E5] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#777777] transition-colors hover:bg-[#E5E5E5] dark:border-[#37464F] dark:text-[#8495A0] dark:hover:bg-[#202F36] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-1/2 sm:w-auto rounded-2xl border-b-4 border-[#58A700] bg-[#58CC02] px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
