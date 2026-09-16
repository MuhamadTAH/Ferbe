import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  playOptionSelectSound,
  playCheckClickSound,
  playCorrectSound,
  playIncorrectSound,
  playLessonCompleteSound,
  _resetAudioContextForTesting,
} from "./lessonAudio";

describe("lessonAudio", () => {
  beforeEach(() => {
    _resetAudioContextForTesting();
  });

  it("runs safely in Node.js environment without window", () => {
    expect(() => playOptionSelectSound()).not.toThrow();
    expect(() => playCheckClickSound()).not.toThrow();
    expect(() => playCorrectSound()).not.toThrow();
    expect(() => playIncorrectSound()).not.toThrow();
    expect(() => playLessonCompleteSound()).not.toThrow();
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
      delete (globalThis as unknown as { window?: unknown }).window;
    });

    it("synthesizes option select tick sound", () => {
      expect(() => playOptionSelectSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockContext.createGain).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
    });

    it("synthesizes check button click sound", () => {
      expect(() => playCheckClickSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockContext.createGain).toHaveBeenCalled();
    });

    it("synthesizes Duolingo correct ascending chime with harmonic overtone", () => {
      expect(() => playCorrectSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockContext.createGain).toHaveBeenCalled();
    });

    it("synthesizes Duolingo incorrect double-pulse tone", () => {
      expect(() => playIncorrectSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockContext.createGain).toHaveBeenCalled();
    });

    it("synthesizes lesson complete fanfare chord", () => {
      expect(() => playLessonCompleteSound()).not.toThrow();
      expect(mockContext.createOscillator).toHaveBeenCalled();
      expect(mockContext.createGain).toHaveBeenCalled();
    });
  });
});
