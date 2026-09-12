// Web Audio API Sound Synthesizer for Treasure Chest Animations
// 100% dependency-free, zero external audio files required.
// Safely handles SSR, audio policy permissions, and muted devices.

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
 * Play a subtle wooden/metallic rattle click sound for chest anticipation.
 */
export function playChestRattleSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 3 rapid micro-ticks simulating mechanical latch rattles
    [0, 0.08, 0.16].forEach((delay, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? "triangle" : "square";
      osc.frequency.setValueAtTime(180 + index * 45, now + delay);
      osc.frequency.exponentialRampToValueAtTime(80, now + delay + 0.05);

      gain.gain.setValueAtTime(0.08, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.06);
    });
  } catch {
    // Fail silently if audio is not permitted
  }
}

/**
 * Play an authentic Duolingo-style victorious chime chord as the chest lid bursts open!
 * Generates an ascending major 9th arpeggio with shimmering bell harmonics.
 */
export function playChestOpenSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Ascending arpeggio frequencies: C5, E5, G5, B5, C6, E6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];

    notes.forEach((freq, i) => {
      const startTime = now + i * 0.07;
      const duration = 1.2 - i * 0.1;

      // Primary tone: warm sine wave
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, startTime);

      // Bell chime overtone: subtle triangle wave one octave higher
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      // Envelopes: crisp attack, smooth ringing decay
      gain1.gain.setValueAtTime(0.0001, startTime);
      gain1.gain.linearRampToValueAtTime(0.14, startTime + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      gain2.gain.setValueAtTime(0.0001, startTime);
      gain2.gain.linearRampToValueAtTime(0.05, startTime + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(startTime);
      osc1.stop(startTime + duration + 0.05);

      osc2.start(startTime);
      osc2.stop(startTime + duration * 0.6 + 0.05);
    });

    // High sparkle shimmer
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();

    shimmerOsc.type = "sine";
    shimmerOsc.frequency.setValueAtTime(2093.0, now + 0.35); // C7
    shimmerOsc.frequency.exponentialRampToValueAtTime(3135.96, now + 0.7); // G7

    shimmerGain.gain.setValueAtTime(0.0001, now + 0.35);
    shimmerGain.gain.linearRampToValueAtTime(0.06, now + 0.4);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);

    shimmerOsc.start(now + 0.35);
    shimmerOsc.stop(now + 0.9);
  } catch {
    // Fail gracefully
  }
}

/**
 * Play a delicate crystal sparkle / coin clink sound when gems pop out.
 */
export function playGemSparkleSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pitches = [1760.0, 2217.46, 2637.02]; // A6, C#7, E7

    pitches.forEach((freq, idx) => {
      const startTime = now + idx * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.07, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.26);
    });
  } catch {
    // Fail gracefully
  }
}

/**
 * Play a crisp rewarding collect sound when the user presses "CLAIM".
 */
export function playCollectRewardSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [698.46, 880.0, 1046.5]; // F5, A5, C6 (bright major triad)

    notes.forEach((freq, i) => {
      const startTime = now + i * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  } catch {
    // Fail gracefully
  }
}
