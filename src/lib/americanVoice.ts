"use client";

/**
 * Reliable native American English speech synthesis.
 * Explicitly targets 'en-US' voices across Chrome, Safari, Edge, and mobile browsers.
 */

let cachedUsVoice: SpeechSynthesisVoice | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const immediate = window.speechSynthesis.getVoices();
    if (immediate.length > 0) {
      resolve(immediate);
      return;
    }
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(v);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Timeout fallback after 300ms
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    }, 300);
  });
}

export async function getAmericanVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedUsVoice) return cachedUsVoice;
  const voices = await loadVoices();

  // Priority 1: Natural or Online American voices
  let chosen = voices.find(
    (v) =>
      (v.lang === "en-US" || v.lang === "en_US") &&
      (v.name.includes("Natural") || v.name.includes("Online") || v.name.includes("Google") || v.name.includes("Samantha"))
  );

  // Priority 2: Any en-US voice
  if (!chosen) {
    chosen = voices.find((v) => v.lang === "en-US" || v.lang === "en_US");
  }

  // Priority 3: Fallback matching 'us' or 'united states'
  if (!chosen) {
    chosen = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("united states") || v.name.toLowerCase().includes("us"))
    );
  }

  // Priority 4: Any English voice
  if (!chosen) {
    chosen = voices.find((v) => v.lang.startsWith("en"));
  }

  if (chosen) cachedUsVoice = chosen;
  return chosen ?? null;
}

export async function playAmericanSpeech(text: string, rate: number = 0.88): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  try {
    window.speechSynthesis.cancel();
    const voice = await getAmericanVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    if (voice) {
      utterance.voice = voice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Failed to speak text:", err);
  }
}
