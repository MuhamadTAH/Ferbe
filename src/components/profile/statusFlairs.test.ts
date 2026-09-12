import { describe, it, expect, beforeEach } from "vitest";
import {
  STATUS_FLAIRS,
  FLAIR_CATEGORIES,
  TIER_CONFIG,
  getStatusFlairById,
  getStatusFlairByEmoji,
  resolveFlair,
  readStoredUserStatus,
  writeStoredUserStatus,
  STORAGE_KEY_FLAIR,
  STORAGE_KEY_STATUS,
  STATUS_CHANGE_EVENT,
} from "./statusFlairs";

describe("statusFlairs Ecosystem", () => {
  it("defines all required categories", () => {
    const categoryIds = FLAIR_CATEGORIES.map((c) => c.id);
    expect(categoryIds).toContain("learning");
    expect(categoryIds).toContain("heritage");
    expect(categoryIds).toContain("focus");
    expect(categoryIds).toContain("prestige");
  });

  it("contains all Linguistic & Learning flairs with Kurdish Sorani titles", () => {
    const polyglot = getStatusFlairById("polyglot");
    expect(polyglot).toBeDefined();
    expect(polyglot?.labelEn).toBe("Polyglot");
    expect(polyglot?.labelKu).toBe("فرەزمان");

    const scholar = getStatusFlairById("kurdish_scholar");
    expect(scholar).toBeDefined();
    expect(scholar?.labelEn).toBe("Kurdish Scholar");
    expect(scholar?.labelKu).toBe("زانستی کوردی");

    const scribe = getStatusFlairById("sorani_scribe");
    expect(scribe).toBeDefined();
    expect(scribe?.labelEn).toBe("Sorani Scribe");
    expect(scribe?.labelKu).toBe("ڕێنووس");

    const grammar = getStatusFlairById("grammar_master");
    expect(grammar).toBeDefined();
    expect(grammar?.labelEn).toBe("Grammar Master");
    expect(grammar?.labelKu).toBe("شارەزای ڕێزمان");
  });

  it("contains all Kurdish Heritage flairs with Kurdish Sorani titles", () => {
    const sun = getStatusFlairById("kurdistan_sun");
    expect(sun).toBeDefined();
    expect(sun?.labelEn).toBe("Kurdistan Sun");
    expect(sun?.labelKu).toBe("ڕۆژی پیرۆز");
    expect(sun?.tier).toBe("legendary");

    const eagle = getStatusFlairById("mountain_eagle");
    expect(eagle).toBeDefined();
    expect(eagle?.labelEn).toBe("Mountain Eagle");
    expect(eagle?.labelKu).toBe("هەڵۆی چیا");

    const dengbej = getStatusFlairById("dengbej");
    expect(dengbej).toBeDefined();
    expect(dengbej?.labelEn).toBe("Dengbêj");
    expect(dengbej?.labelKu).toBe("دەنگبێژ");

    const fire = getStatusFlairById("newroz_fire");
    expect(fire).toBeDefined();
    expect(fire?.labelEn).toBe("Newroz Fire");
    expect(fire?.labelKu).toBe("ئاگری نەورۆز");
  });

  it("contains all Productivity & Focus flairs with Kurdish Sorani titles", () => {
    const beast = getStatusFlairById("beast_mode");
    expect(beast).toBeDefined();
    expect(beast?.labelEn).toBe("Beast Mode");
    expect(beast?.labelKu).toBe("وزەی بێسنوور");

    const streak = getStatusFlairById("unstoppable_streak");
    expect(streak).toBeDefined();
    expect(streak?.labelEn).toBe("Unstoppable Streak");
    expect(streak?.labelKu).toBe("زنجیرەی نەپساو");

    const midnight = getStatusFlairById("midnight_study");
    expect(midnight).toBeDefined();
    expect(midnight?.labelEn).toBe("Midnight Study");
    expect(midnight?.labelKu).toBe("شەونشینی خوێندن");

    const zen = getStatusFlairById("zen_focus");
    expect(zen).toBeDefined();
    expect(zen?.labelEn).toBe("Zen Focus");
    expect(zen?.labelKu).toBe("ئارامی و سەرنج");
  });

  it("contains all Prestige & Gamification flairs with Kurdish Sorani titles", () => {
    const diamond = getStatusFlairById("diamond_league");
    expect(diamond).toBeDefined();
    expect(diamond?.labelEn).toBe("Diamond League");
    expect(diamond?.labelKu).toBe("ڕیزی ئەڵماس");

    const champion = getStatusFlairById("kurdish_champion");
    expect(champion).toBeDefined();
    expect(champion?.labelEn).toBe("Kurdish Champion");
    expect(champion?.labelKu).toBe("پاڵەوان");

    const lightning = getStatusFlairById("lightning_learner");
    expect(lightning).toBeDefined();
    expect(lightning?.labelEn).toBe("Lightning Learner");
    expect(lightning?.labelKu).toBe("تیشک");
  });

  it("resolves flairs by id or emoji and falls back properly", () => {
    expect(resolveFlair("kurdistan_sun")?.id).toBe("kurdistan_sun");
    expect(resolveFlair("☀️")?.id).toBe("kurdistan_sun");
    expect(resolveFlair("non_existent_flair", false)).toBeNull();
    expect(resolveFlair(null, true)?.id).toBe("kurdistan_sun");
  });

  it("supports tier configuration for all tiers", () => {
    const tiers = ["common", "rare", "epic", "legendary"] as const;
    for (const tier of tiers) {
      expect(TIER_CONFIG[tier]).toBeDefined();
      expect(TIER_CONFIG[tier].nameEn).toBeTruthy();
      expect(TIER_CONFIG[tier].nameKu).toBeTruthy();
      expect(TIER_CONFIG[tier].ring).toBeTruthy();
    }
  });

  describe("LocalStorage & State Sync", () => {
    let mockStore: Record<string, string> = {};
    const listeners: Record<string, ((e: any) => void)[]> = {};

    beforeEach(() => {
      mockStore = {};
      const mockLocalStorage = {
        getItem: (key: string) => mockStore[key] ?? null,
        setItem: (key: string, val: string) => {
          mockStore[key] = val;
        },
        removeItem: (key: string) => {
          delete mockStore[key];
        },
        clear: () => {
          mockStore = {};
        },
      };

      const mockWindow = {
        addEventListener: (event: string, cb: any) => {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(cb);
        },
        removeEventListener: (event: string, cb: any) => {
          if (!listeners[event]) return;
          listeners[event] = listeners[event].filter((l) => l !== cb);
        },
        dispatchEvent: (event: any) => {
          const cbs = listeners[event.type] || [];
          cbs.forEach((cb) => cb(event));
          return true;
        },
        localStorage: mockLocalStorage,
      };

      (globalThis as any).window = mockWindow;
      (globalThis as any).localStorage = mockLocalStorage;
      (globalThis as any).CustomEvent = class {
        type: string;
        detail: any;
        constructor(type: string, opts?: any) {
          this.type = type;
          this.detail = opts?.detail;
        }
      };
    });

    it("reads and writes status and flair to localStorage", () => {
      expect(readStoredUserStatus().flair).toBeNull();
      expect(readStoredUserStatus().statusText).toBeNull();

      writeStoredUserStatus("kurdistan_sun", "Studying Kurdish daily!");

      expect((globalThis as any).localStorage.getItem(STORAGE_KEY_FLAIR)).toBe("kurdistan_sun");
      expect((globalThis as any).localStorage.getItem(STORAGE_KEY_STATUS)).toBe("Studying Kurdish daily!");

      const state = readStoredUserStatus();
      expect(state.flair?.id).toBe("kurdistan_sun");
      expect(state.statusText).toBe("Studying Kurdish daily!");
    });

    it("cleans up storage when null is passed", () => {
      writeStoredUserStatus("kurdistan_sun", "Studying");
      writeStoredUserStatus(null, null);

      expect((globalThis as any).localStorage.getItem(STORAGE_KEY_FLAIR)).toBeNull();
      expect((globalThis as any).localStorage.getItem(STORAGE_KEY_STATUS)).toBeNull();
    });

    it("dispatches custom event on status change", () => {
      let eventFired = false;
      const handler = (e: any) => {
        expect(e.detail.flairId).toBe("polyglot");
        expect(e.detail.statusText).toBe("Polyglot vibe");
        eventFired = true;
      };

      (globalThis as any).window.addEventListener(STATUS_CHANGE_EVENT, handler);
      writeStoredUserStatus("polyglot", "Polyglot vibe");
      (globalThis as any).window.removeEventListener(STATUS_CHANGE_EVENT, handler);

      expect(eventFired).toBe(true);
    });
  });
});
