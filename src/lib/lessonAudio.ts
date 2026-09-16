// Web Audio API Sound Synthesizer for Lesson Interactive Feedback
// 100% dependency-free, zero external audio files required.
// Matches Duolingo's iconic audio cues:
// - Option selection tick
// - Check button click
// - Cheerful ascending major chime for correct answers
// - Low double-pulse buzz for incorrect answers
// - Triumphant fanfare for lesson completion

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/** Reset cached AudioContext for testing isolation */
export function _resetAudioContextForTesting(): void {
  sharedAudioCtx = null;
}

/**
 * Play a subtle, crisp pop/tick when selecting an option or word tile.
 */
export function playOptionSelectSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch {
    // Fail silently if audio is not permitted
  }
}

/**
 * Play a crisp click when tapping the Check button.
 */
export function playCheckClickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Fail silently
  }
}

/**
 * Authentic Duolingo Correct Answer Chime!
 * Ascending major arpeggio: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> high C6 (1046Hz)
 * with a bell harmonic overtone and sparkling decay.
 */
export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 523.25, delay: 0.0, dur: 0.4 },     // C5
      { freq: 659.25, delay: 0.065, dur: 0.4 },   // E5
      { freq: 783.99, delay: 0.13, dur: 0.5 },    // G5
      { freq: 1046.5, delay: 0.20, dur: 0.85 },   // C6
    ];

    notes.forEach(({ freq, delay, dur }) => {
      const startTime = now + delay;

      // Fundamental warm sine
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, startTime);

      gain1.gain.setValueAtTime(0.0001, startTime);
      gain1.gain.linearRampToValueAtTime(0.13, startTime + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(startTime);
      osc1.stop(startTime + dur + 0.02);

      // Shimmering octave bell harmonic
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      gain2.gain.setValueAtTime(0.0001, startTime);
      gain2.gain.linearRampToValueAtTime(0.05, startTime + 0.012);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + dur * 0.7);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(startTime);
      osc2.stop(startTime + dur * 0.7 + 0.02);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Authentic Duolingo Incorrect Answer Tone!
 * Soft descending low double-pulse: Eb3 (155Hz) then C3 (130Hz)
 * Distinct, helpful, non-grating feedback.
 */
export function playIncorrectSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pulses = [
      { freq: 155.56, delay: 0.0, dur: 0.14 },  // Eb3
      { freq: 130.81, delay: 0.12, dur: 0.22 }, // C3
    ];

    pulses.forEach(({ freq, delay, dur }) => {
      const startTime = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.92, startTime + dur);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur + 0.02);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Play triumphant fanfare chord when finishing a lesson.
 */
export function playLessonCompleteSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.5]; // C major chord

    fanfareNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch {
    // Fail silently
  }
}
