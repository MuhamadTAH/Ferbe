import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  playChestRattleSound,
  playChestOpenSound,
  playGemSparkleSound,
  playCollectRewardSound,
  _resetAudioContextForTesting,
} from "./chestAudio";

describe("chestAudio", () => {
  beforeEach(() => {
    _resetAudioContextForTesting();
  });
  it("runs safely in Node.js environment without window", () => {
    expect(() => playChestRattleSound()).not.toThrow();
    expect(() => playChestOpenSound()).not.toThrow();
    expect(() => playGemSparkleSound()).not.toThrow();
    expect(() => playCollectRewardSound()).not.toThrow();
  });

  describe("with mock AudioContext", () => {
    let mockOscillator: {
      type: string;
      frequency: {
        setValueAtTime: ReturnType<typeof vi.fn>;
        exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
      };
      connect: ReturnType<typeof vi.fn>;
      start: ReturnType<typeof vi.fn>;
      stop: ReturnType<typeof vi.fn>;
    };

    let mockGain: {
      gain: {
        setValueAtTime: ReturnType<typeof vi.fn>;
        linearRampToValueAtTime: ReturnType<typeof vi.fn>;
        exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
      };
      connect: ReturnType<typeof vi.fn>;
    };

    let mockContext: {
      currentTime: number;
      state: string;
      destination: object;
      createOscillator: ReturnType<typeof vi.fn>;
      createGain: ReturnType<typeof vi.fn>;
      resume: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      mockOscillator = {
        type: "sine",
        frequency: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };

      mockGain = {
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };

      mockContext = {
        currentTime: 0,
        state: "running",
        destination: {},
        createOscillator: vi.fn(() => mockOscillator),
        createGain: vi.fn(() => mockGain),
        resume: vi.fn().mockResolvedValue(undefined),
      };

      // Set up global window with AudioContext
      const mockGlobal = globalThis as unknown as {
        window: {
          AudioContext: new () => typeof mockContext;
        };
      };
      mockGlobal.window = {
        AudioContext: vi.fn().mockImplementation(() => mockContext) as unknown as new () => typeof mockContext,
      };
    });

    afterEach(() => {
      // Clean up window mock
      delete (globalThis as unknown as { window?: unknown }).window;
    });

    it("synthesizes chest rattle sound with audio context", () => {
      expect(() => playChestRattleSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockContext.createGain).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
    });

    it("synthesizes chest open chime arpeggio", () => {
      expect(() => playChestOpenSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
    });

    it("synthesizes gem sparkle sound", () => {
      expect(() => playGemSparkleSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
    });

    it("synthesizes collect reward chime", () => {
      expect(() => playCollectRewardSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
    });
  });
});
