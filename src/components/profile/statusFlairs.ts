export type FlairCategory = "learning" | "heritage" | "focus" | "prestige";

export type FlairTier = "common" | "rare" | "epic" | "legendary";

export interface StatusFlair {
  id: string;
  emoji: string;
  labelEn: string;
  labelKu: string;
  description: string;
  color: string;
  bgLight: string;
  bgDark: string;
  borderColor: string;
  ringColor: string;
  tier: FlairTier;
  category: FlairCategory;
}

export interface FlairCategoryMeta {
  id: FlairCategory;
  labelEn: string;
  labelKu: string;
  icon: string;
  description: string;
}

export const FLAIR_CATEGORIES: FlairCategoryMeta[] = [
  {
    id: "learning",
    labelEn: "Linguistic & Learning",
    labelKu: "زمانەوانی و فێربوون",
    icon: "🎓",
    description: "Celebrate grammar mastery and linguistic devotion",
  },
  {
    id: "heritage",
    labelEn: "Kurdish Heritage",
    labelKu: "کەلتوور و ڕەسەنایەتی",
    icon: "🏔️",
    description: "Honor Kurdish roots, legends, and timeless traditions",
  },
  {
    id: "focus",
    labelEn: "Productivity & Focus",
    labelKu: "بەرهەمداری و سەرنج",
    icon: "⚡",
    description: "Unleash daily discipline, late-night study, and zen flow",
  },
  {
    id: "prestige",
    labelEn: "Prestige & Trophies",
    labelKu: "شانازی و سەرکەوتن",
    icon: "💎",
    description: "Elite milestones, top league ranks, and speed crowns",
  },
];

export const TIER_CONFIG: Record<
  FlairTier,
  {
    nameEn: string;
    nameKu: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    ring: string;
    glow: string;
  }
> = {
  common: {
    nameEn: "Common",
    nameKu: "باو",
    badgeBg: "bg-[#E5E5E5] dark:bg-[#37464F]",
    badgeText: "text-[#777777] dark:text-[#D1D5DB]",
    border: "border-[#D1D5DB] dark:border-[#4B5563]",
    ring: "ring-[#D1D5DB] dark:ring-[#4B5563]",
    glow: "shadow-xs",
  },
  rare: {
    nameEn: "Rare",
    nameKu: "دەگمەن",
    badgeBg: "bg-[#DDF4FF] dark:bg-[#1C3B4E]",
    badgeText: "text-[#1899D6] dark:text-[#3BC0F8]",
    border: "border-[#1CB0F6] dark:border-[#3BC0F8]",
    ring: "ring-[#1CB0F6]",
    glow: "shadow-[0_0_12px_rgba(28,176,246,0.25)]",
  },
  epic: {
    nameEn: "Epic",
    nameKu: "ناوازە",
    badgeBg: "bg-[#FAF5FF] dark:bg-[#361E4A]",
    badgeText: "text-[#9A46DE] dark:text-[#D996FF]",
    border: "border-[#CE82FF] dark:border-[#D996FF]",
    ring: "ring-[#CE82FF]",
    glow: "shadow-[0_0_15px_rgba(206,130,255,0.3)]",
  },
  legendary: {
    nameEn: "Legendary",
    nameKu: "ئەفسانەیی",
    badgeBg: "bg-[#FFF9E6] dark:bg-[#3E3405]",
    badgeText: "text-[#D97706] dark:text-[#FFD700]",
    border: "border-[#FFC800] dark:border-[#FFD700]",
    ring: "ring-[#FFC800]",
    glow: "shadow-[0_0_18px_rgba(255,200,0,0.35)]",
  },
};

export const STATUS_FLAIRS: StatusFlair[] = [
  // 1. Linguistic & Learning
  {
    id: "polyglot",
    emoji: "🗣️",
    labelEn: "Polyglot",
    labelKu: "فرەزمان",
    description: "Mastering multiple tongues, Kurdish dialects, and cultures with joy",
    color: "#1CB0F6",
    bgLight: "#DDF4FF",
    bgDark: "#1C3B4E",
    borderColor: "#1899D6",
    ringColor: "#1CB0F6",
    tier: "epic",
    category: "learning",
  },
  {
    id: "kurdish_scholar",
    emoji: "📚",
    labelEn: "Kurdish Scholar",
    labelKu: "زانستی کوردی",
    description: "Deep dive into Kurdish literature, classical poetry, and dialectology",
    color: "#58CC02",
    bgLight: "#E8FAD4",
    bgDark: "#1E3B20",
    borderColor: "#58A700",
    ringColor: "#58CC02",
    tier: "rare",
    category: "learning",
  },
  {
    id: "sorani_scribe",
    emoji: "✍️",
    labelEn: "Sorani Scribe",
    labelKu: "ڕێنووس",
    description: "Crafting Kurdish Sorani letters with precision and calligraphic elegance",
    color: "#CE82FF",
    bgLight: "#FAF5FF",
    bgDark: "#361E4A",
    borderColor: "#9A46DE",
    ringColor: "#CE82FF",
    tier: "common",
    category: "learning",
  },
  {
    id: "grammar_master",
    emoji: "🧠",
    labelEn: "Grammar Master",
    labelKu: "شارەزای ڕێزمان",
    description: "Flawless command over Kurdish ergativity, affixes, and verbal moods",
    color: "#2B70C9",
    bgLight: "#EBF3FE",
    bgDark: "#162C4E",
    borderColor: "#1A539B",
    ringColor: "#2B70C9",
    tier: "rare",
    category: "learning",
  },

  // 2. Kurdish Heritage & Vibe
  {
    id: "kurdistan_sun",
    emoji: "☀️",
    labelEn: "Kurdistan Sun",
    labelKu: "ڕۆژی پیرۆز",
    description: "21 radiant golden rays shining courage, warmth, and hope",
    color: "#FFC800",
    bgLight: "#FFF9E6",
    bgDark: "#3E3405",
    borderColor: "#E5A500",
    ringColor: "#FFC800",
    tier: "legendary",
    category: "heritage",
  },
  {
    id: "mountain_eagle",
    emoji: "🦅",
    labelEn: "Mountain Eagle",
    labelKu: "هەڵۆی چیا",
    description: "Fierce, soaring high above the snowy Zagros peaks without fear",
    color: "#854D0E",
    bgLight: "#FEF3C7",
    bgDark: "#3A2E12",
    borderColor: "#A16207",
    ringColor: "#A16207",
    tier: "epic",
    category: "heritage",
  },
  {
    id: "dengbej",
    emoji: "🪕",
    labelEn: "Dengbêj",
    labelKu: "دەنگبێژ",
    description: "Keeper of timeless epic songs, folk tales, and musical heartbeats",
    color: "#E11D48",
    bgLight: "#FFE4E6",
    bgDark: "#4C131E",
    borderColor: "#BE123C",
    ringColor: "#E11D48",
    tier: "rare",
    category: "heritage",
  },
  {
    id: "newroz_fire",
    emoji: "🔥",
    labelEn: "Newroz Fire",
    labelKu: "ئاگری نەورۆز",
    description: "Lighting the ceremonial summit fires of rebirth, spring, and freedom",
    color: "#FF9600",
    bgLight: "#FFF4E5",
    bgDark: "#3A2208",
    borderColor: "#E06B00",
    ringColor: "#FF9600",
    tier: "epic",
    category: "heritage",
  },

  // 3. Productivity & Focus
  {
    id: "beast_mode",
    emoji: "🦁",
    labelEn: "Beast Mode",
    labelKu: "وزەی بێسنوور",
    description: "Fierce unstoppable momentum clearing lessons in rapid fire",
    color: "#FF4B4B",
    bgLight: "#FFDFDF",
    bgDark: "#3E1C1C",
    borderColor: "#EA2B2B",
    ringColor: "#FF4B4B",
    tier: "epic",
    category: "focus",
  },
  {
    id: "unstoppable_streak",
    emoji: "⚡",
    labelEn: "Unstoppable Streak",
    labelKu: "زنجیرەی نەپساو",
    description: "Every single day counts; keeping the streak burning through everything",
    color: "#FF9600",
    bgLight: "#FFF4E5",
    bgDark: "#341F05",
    borderColor: "#E06B00",
    ringColor: "#FF9600",
    tier: "rare",
    category: "focus",
  },
  {
    id: "midnight_study",
    emoji: "🌙",
    labelEn: "Midnight Study",
    labelKu: "شەونشینی خوێندن",
    description: "Serene night hours under the stars absorbing Kurdish vocabulary",
    color: "#6366F1",
    bgLight: "#EEF2FF",
    bgDark: "#1E234B",
    borderColor: "#4F46E5",
    ringColor: "#6366F1",
    tier: "common",
    category: "focus",
  },
  {
    id: "zen_focus",
    emoji: "🧘",
    labelEn: "Zen Focus",
    labelKu: "ئارامی و سەرنج",
    description: "Quiet calm, mindful concentration, and deep learning flow",
    color: "#10B981",
    bgLight: "#ECFDF5",
    bgDark: "#0D3325",
    borderColor: "#059669",
    ringColor: "#10B981",
    tier: "common",
    category: "focus",
  },

  // 4. Prestige & Gamification
  {
    id: "diamond_league",
    emoji: "💎",
    labelEn: "Diamond League",
    labelKu: "ڕیزی ئەڵماس",
    description: "At the apex of competition among the most dedicated Kurdish learners",
    color: "#00CD9C",
    bgLight: "#E6FAF5",
    bgDark: "#0B382F",
    borderColor: "#00A880",
    ringColor: "#00CD9C",
    tier: "legendary",
    category: "prestige",
  },
  {
    id: "kurdish_champion",
    emoji: "👑",
    labelEn: "Kurdish Champion",
    labelKu: "پاڵەوان",
    description: "Wearing the crown of perseverance, curiosity, and mastery",
    color: "#FFC800",
    bgLight: "#FFF9E6",
    bgDark: "#3E3405",
    borderColor: "#E5A500",
    ringColor: "#FFC800",
    tier: "legendary",
    category: "prestige",
  },
  {
    id: "lightning_learner",
    emoji: "💫",
    labelEn: "Lightning Learner",
    labelKu: "تیشک",
    description: "Speed round ace answering questions in the blink of an eye",
    color: "#F59E0B",
    bgLight: "#FEF3C7",
    bgDark: "#3A2E12",
    borderColor: "#D97706",
    ringColor: "#F59E0B",
    tier: "rare",
    category: "prestige",
  },
];

export const DEFAULT_FLAIR_ID = "kurdistan_sun";
export const DEFAULT_FLAIR: StatusFlair =
  STATUS_FLAIRS.find((f) => f.id === DEFAULT_FLAIR_ID) ?? STATUS_FLAIRS[0];

export const STORAGE_KEY_STATUS = "ferbe_user_status";
export const STORAGE_KEY_FLAIR = "ferbe_user_flair";
export const STATUS_CHANGE_EVENT = "ferbe_status_change";

export function getStatusFlairById(id?: string | null): StatusFlair | undefined {
  if (!id) return undefined;
  return STATUS_FLAIRS.find((f) => f.id.toLowerCase() === id.toLowerCase());
}

export function getStatusFlairByEmoji(emoji?: string | null): StatusFlair | undefined {
  if (!emoji) return undefined;
  return STATUS_FLAIRS.find((f) => f.emoji === emoji);
}

/**
 * Resolves a flair by id, falling back to emoji match, or default flair.
 */
export function resolveFlair(
  flairIdOrEmoji?: string | null,
  fallbackToDefault = false
): StatusFlair | null {
  if (!flairIdOrEmoji) return fallbackToDefault ? DEFAULT_FLAIR : null;
  const byId = getStatusFlairById(flairIdOrEmoji);
  if (byId) return byId;
  const byEmoji = getStatusFlairByEmoji(flairIdOrEmoji);
  if (byEmoji) return byEmoji;
  return fallbackToDefault ? DEFAULT_FLAIR : null;
}

export interface UserStatusState {
  flairId: string | null;
  statusText: string | null;
  flair: StatusFlair | null;
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readStoredUserStatus(): UserStatusState {
  const storage = getStorage();
  if (!storage) {
    return { flairId: null, statusText: null, flair: null };
  }
  try {
    const rawFlair = storage.getItem(STORAGE_KEY_FLAIR);
    const rawStatus = storage.getItem(STORAGE_KEY_STATUS);
    const flair = resolveFlair(rawFlair || rawStatus, false);
    return {
      flairId: rawFlair || (flair ? flair.id : null),
      statusText: rawStatus || null,
      flair,
    };
  } catch {
    return { flairId: null, statusText: null, flair: null };
  }
}

export function writeStoredUserStatus(
  flairId: string | null,
  statusText: string | null
): void {
  const storage = getStorage();
  if (!storage || typeof window === "undefined") return;
  try {
    if (flairId) {
      storage.setItem(STORAGE_KEY_FLAIR, flairId);
    } else {
      storage.removeItem(STORAGE_KEY_FLAIR);
    }

    if (statusText && statusText.trim().length > 0) {
      storage.setItem(STORAGE_KEY_STATUS, statusText.trim());
    } else {
      storage.removeItem(STORAGE_KEY_STATUS);
    }

    window.dispatchEvent(
      new CustomEvent(STATUS_CHANGE_EVENT, {
        detail: { flairId, statusText: statusText?.trim() || null },
      })
    );
  } catch {
    // Ignore localStorage access errors
  }
}
