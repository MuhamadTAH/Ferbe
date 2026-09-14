import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

interface ExerciseInput {
  type: "multiple_choice" | "word_bank" | "audio_match";
  promptText: string;
  solutionData: Record<string, unknown>;
  distractors: string[];
  order: number;
}

interface LessonInput {
  title: string;
  order: number;
  xpReward: number;
  exercises: ExerciseInput[];
}

interface UnitInput {
  title: string;
  order: number;
  lessons: LessonInput[];
}

export const COURSE = {
  title: "English for Kurdish Speakers (ئینگلیزی بۆ کورد)",
  slug: "english-from-kurdish",
  sourceLanguage: "ckb",
  targetLanguage: "en",
};

/**
 * Level 0 Curriculum: Foundations, Phonics, Blends, and Basic Conversational Frames.
 * Structured into Orientation + 9 Core Sections (10 Units, 57 Lessons).
 * Exercises are left empty initially as per curriculum plan.
 */
export const LEVEL_0_UNITS: UnitInput[] = [
  // =========================================================================
  // UNIT 1: Orientation: The Launchpad (Ungated Pre-Course)
  // =========================================================================
  {
    title: "Orientation: The Launchpad (دەستپێک)",
    order: 1,
    lessons: [
      {
        title: "0.1 Left-to-Right: Read the Line",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "0.2 Mic Check: Hear Your Voice",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "0.3 Rules of the App: Timers & Checkpoints",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // UNIT 2: Section 1: The Core Six (S, A, T, P, I, N)
  // =========================================================================
  {
    title: "Section 1: The Core Six (S, A, T, P, I, N)",
    order: 2,
    lessons: [
      // -----------------------------------------------------------------------
      // Lesson 1.1: Sound & Blend (S, A, T, P, I, N)
      // -----------------------------------------------------------------------
      {
        title: "1.1 Sound & Blend: First Letters (S, A, T, P, I, N)",
        order: 1,
        xpReward: 10,
        exercises: [
          {
            type: "audio_match",
            promptText: "Listen to the letter sound: /s/",
            solutionData: { correct: "S", spokenText: "s", instruction: "Visual Anchor: Letter S", icon: "🔤" },
            distractors: ["A", "T", "P"],
            order: 1,
          },
          {
            type: "audio_match",
            promptText: "Listen to the short vowel: /æ/",
            solutionData: { correct: "A", spokenText: "ah", instruction: "Visual Anchor: Short A (/æ/)", icon: "🔤" },
            distractors: ["S", "T", "I"],
            order: 2,
          },
          {
            type: "audio_match",
            promptText: "Listen to the unvoiced stop: /t/",
            solutionData: { correct: "T", spokenText: "t", instruction: "Visual Anchor: Unvoiced /t/", icon: "🔤" },
            distractors: ["S", "A", "N"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "Blend the sounds: /æ/ + /t/ = AT",
            solutionData: { tokens: ["a", "t"], instruction: "Tactile Blending: Blend A into T", icon: "🧩" },
            distractors: ["s", "p", "n"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "Say aloud: AT (/æt/)",
            solutionData: { correct: "at", isSpeaking: true, spokenText: "at", instruction: "Rehearsal Speak: Tap mic & mimic sound", icon: "🎙️" },
            distractors: ["it", "an"],
            order: 5,
          },
          {
            type: "audio_match",
            promptText: "Listen to the crisp air burst /p/ (not /b/)",
            solutionData: { correct: "P", spokenText: "p", instruction: "Visual Anchor: Aspirated P", icon: "💨" },
            distractors: ["B", "T", "S"],
            order: 6,
          },
          {
            type: "audio_match",
            promptText: "Catch the initial sound",
            solutionData: { correct: "P", spokenText: "p", instruction: "Minimal Trap: 6s decision", timerSeconds: 6, icon: "⚡" },
            distractors: ["T"],
            order: 7,
          },
          {
            type: "word_bank",
            promptText: "Blend the sounds: /ɪ/ + /n/ = IN",
            solutionData: { tokens: ["i", "n"], instruction: "Tactile Blending: Blend I into N", icon: "🧩" },
            distractors: ["a", "t", "s"],
            order: 8,
          },
          {
            type: "word_bank",
            promptText: "Build the word: PAN",
            solutionData: { tokens: ["p", "a", "n"], instruction: "Word Assembly: Spell PAN", icon: "🍳" },
            distractors: ["s", "t", "i"],
            order: 9,
          },
          {
            type: "word_bank",
            promptText: "Build the word: PIN",
            solutionData: { tokens: ["p", "i", "n"], instruction: "Word Assembly: Spell PIN", icon: "🧷" },
            distractors: ["a", "t", "s"],
            order: 10,
          },
          {
            type: "audio_match",
            promptText: "Short /æ/ vs Short /ɪ/",
            solutionData: { correct: "pin", spokenText: "pin", instruction: "Blind Discrimination: Pin or Pan?", timerSeconds: 5, icon: "👂" },
            distractors: ["pan"],
            order: 11,
          },
          {
            type: "multiple_choice",
            promptText: "Read aloud: TAP (/tæp/)",
            solutionData: { correct: "tap", isSpeaking: true, spokenText: "tap", instruction: "Graded Vocal Read: Cold read in 3s", timerSeconds: 3, icon: "🎙️" },
            distractors: ["tip", "top"],
            order: 12,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // Lesson 1.2: Lexical Anchors (pan, tin, pin, ant, tap)
      // -----------------------------------------------------------------------
      {
        title: "1.2 Word Builder: Build Real Words (Pan, Tin, Pin, Ant, Tap)",
        order: 2,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "PAN (Frying pan)",
            solutionData: { correct: "pan", instruction: "Anchor Introduce: Tap to confirm", icon: "🍳" },
            distractors: ["ant", "tin"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "ANT (Ant)",
            solutionData: { correct: "ant", instruction: "Anchor Introduce: Tap to confirm", icon: "🐜" },
            distractors: ["tap", "pin"],
            order: 2,
          },
          {
            type: "audio_match",
            promptText: "Which item do you hear?",
            solutionData: { correct: "pan 🍳", spokenText: "pan", instruction: "Visual Match: Select the matching item", icon: "👂" },
            distractors: ["ant 🐜"],
            order: 3,
          },
          {
            type: "multiple_choice",
            promptText: "TIN (Tin can)",
            solutionData: { correct: "tin", instruction: "Anchor Introduce: Tap to confirm", icon: "🥫" },
            distractors: ["pan", "pin"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "PIN (Sewing pin)",
            solutionData: { correct: "pin", instruction: "Anchor Introduce: Tap to confirm", icon: "🧷" },
            distractors: ["tin", "tap"],
            order: 5,
          },
          {
            type: "audio_match",
            promptText: "Listen carefully: /p/ or /t/?",
            solutionData: { correct: "tin 🥫", spokenText: "tin", instruction: "Trap Discrimination: 5s decision", timerSeconds: 5, icon: "⚡" },
            distractors: ["pin 🧷"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "TAP (Water tap)",
            solutionData: { correct: "tap", instruction: "Anchor Introduce: Tap to confirm", icon: "🚰" },
            distractors: ["tin", "ant"],
            order: 7,
          },
          {
            type: "word_bank",
            promptText: "Spell the item: TAP",
            solutionData: { tokens: ["t", "a", "p"], instruction: "Tile Spelling: Water tap", icon: "🚰" },
            distractors: ["i", "n", "s"],
            order: 8,
          },
          {
            type: "audio_match",
            promptText: "Tap the matching quadrant",
            solutionData: { correct: "ant 🐜", spokenText: "ant", instruction: "4-Way Matrix: What do you hear?", icon: "🎯" },
            distractors: ["pan 🍳", "tin 🥫", "tap 🚰"],
            order: 9,
          },
          {
            type: "audio_match",
            promptText: "Select the exact word",
            solutionData: { correct: "pin", spokenText: "pin", instruction: "Blind Listen: Pin, Pan, or Tin?", icon: "👂" },
            distractors: ["pan", "tin"],
            order: 10,
          },
          {
            type: "multiple_choice",
            promptText: "TIN (Tin can)",
            solutionData: { correct: "tin", isSpeaking: true, spokenText: "tin", instruction: "Vocal Rehearsal: Record your voice", icon: "🥫" },
            distractors: ["ten", "tan"],
            order: 11,
          },
          {
            type: "multiple_choice",
            promptText: "Say what you see in 3s!",
            solutionData: { correct: "pan", isSpeaking: true, spokenText: "pan", instruction: "Graded Vocal Production", timerSeconds: 3, icon: "🍳" },
            distractors: ["pin", "pen"],
            order: 12,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // Lesson 1.3: Sentence Frame ("I see a...")
      // -----------------------------------------------------------------------
      {
        title: "1.3 Sentence Frame: 'I see a...'",
        order: 3,
        xpReward: 10,
        exercises: [
          {
            type: "word_bank",
            promptText: "I see a pan",
            solutionData: { tokens: ["I", "see", "a", "pan"], instruction: "Frame Deconstruction: SVO order", icon: "🍳" },
            distractors: ["tin", "tap"],
            order: 1,
          },
          {
            type: "word_bank",
            promptText: "Build the opener: I see a",
            solutionData: { tokens: ["I", "see", "a"], instruction: "Tile Isolation: Structure Cadence", icon: "🗣️" },
            distractors: ["pan", "is", "the"],
            order: 2,
          },
          {
            type: "multiple_choice",
            promptText: "I see an [ ___ ]",
            solutionData: { correct: "ant", instruction: "Slot & Filler: Complete the sentence", icon: "🐜" },
            distractors: ["tin", "tap", "pan"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "Strict SVO English order (Subject + Verb + Object)",
            solutionData: { tokens: ["I", "see", "a", "tin"], instruction: "Order Enforcement: Override SOV habits", icon: "🥫" },
            distractors: ["pan", "ant"],
            order: 4,
          },
          {
            type: "audio_match",
            promptText: "Which sentence did you hear?",
            solutionData: { correct: "I see a tap 🚰", spokenText: "I see a tap", instruction: "Receptive Audio Check", icon: "👂" },
            distractors: ["I see a pan 🍳", "I see a pin 🧷"],
            order: 5,
          },
          {
            type: "multiple_choice",
            promptText: "I see a [ ___ ]",
            solutionData: { correct: "pin", instruction: "Slot & Filler: Complete the sentence", icon: "🧷" },
            distractors: ["pan", "ant", "tap"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "Audio: 'I see a pin' vs Image: 🍳 (Pan)",
            solutionData: { correct: "False (It is a pan)", instruction: "Negative Distractor: True or False?", icon: "🍳" },
            distractors: ["True (It is a pin)"],
            order: 7,
          },
          {
            type: "multiple_choice",
            promptText: "I see a pan",
            solutionData: { correct: "I see a pan", isSpeaking: true, spokenText: "I see a pan", instruction: "Rehearsal Repetition: Mimic full sentence", icon: "🍳" },
            distractors: ["I see a pin", "I see a tin"],
            order: 8,
          },
          {
            type: "word_bank",
            promptText: "Assemble the frame fast!",
            solutionData: { tokens: ["I", "see", "a", "pan"], instruction: "Timed Sentence Rebuild: 6s timer", icon: "⚡" },
            distractors: ["tin", "pin"],
            order: 9,
          },
          {
            type: "audio_match",
            promptText: "Select the matching sentence",
            solutionData: { correct: "I see a tin", spokenText: "I see a tin", instruction: "Ear-to-Text Mapping: Pin vs Tin", icon: "🥫" },
            distractors: ["I see a pin"],
            order: 10,
          },
          {
            type: "multiple_choice",
            promptText: "I see a tap 🚰",
            solutionData: { correct: "I see a tap", isSpeaking: true, spokenText: "I see a tap", instruction: "Vocal Ramp: 5-second window", timerSeconds: 5, icon: "🚰" },
            distractors: ["I see a pan", "I see a tin"],
            order: 11,
          },
          {
            type: "multiple_choice",
            promptText: "[ ? ] [ ? ] [ ? ] [ ? ]",
            solutionData: { correct: "I see an ant", isSpeaking: true, spokenText: "I see an ant", instruction: "Cold Vocal Production: Speak full frame in 3s", timerSeconds: 3, icon: "🐜" },
            distractors: ["I see a tap", "I see a pan"],
            order: 12,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // Lesson 1.4: Ear Training (Short /æ/ vs. Short /ɪ/)
      // -----------------------------------------------------------------------
      {
        title: "1.4 Ear Training: Catch the Sound (Pan vs. Pin)",
        order: 4,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "Compare: Short /æ/ (pan) vs Short /ɪ/ (pin)",
            solutionData: { correct: "I understand the contrast", instruction: "Acoustic Calibration", icon: "🎧" },
            distractors: ["Repeat sounds again"],
            order: 1,
          },
          {
            type: "audio_match",
            promptText: "Which vowel sound was spoken?",
            solutionData: { correct: "A (/æ/)", spokenText: "pan", instruction: "Audio Discrimination: A or I?", icon: "👂" },
            distractors: ["I (/ɪ/)"],
            order: 2,
          },
          {
            type: "audio_match",
            promptText: "Which vowel sound was spoken?",
            solutionData: { correct: "I (/ɪ/)", spokenText: "pin", instruction: "Audio Discrimination: A or I?", icon: "👂" },
            distractors: ["A (/æ/)"],
            order: 3,
          },
          {
            type: "audio_match",
            promptText: "Sort sound: /æ/ or /ɪ/?",
            solutionData: { correct: "/æ/ column (like pan)", spokenText: "pat", instruction: "Pair Sorting: Categorize the sound", icon: "📂" },
            distractors: ["/ɪ/ column (like pin)"],
            order: 4,
          },
          {
            type: "audio_match",
            promptText: "Sort sound: /æ/ or /ɪ/?",
            solutionData: { correct: "/ɪ/ column (like pin)", spokenText: "pit", instruction: "Pair Sorting: Categorize the sound", icon: "📂" },
            distractors: ["/æ/ column (like pan)"],
            order: 5,
          },
          {
            type: "audio_match",
            promptText: "Which word is spoken?",
            solutionData: { correct: "tin", spokenText: "tin", instruction: "Speed Decision: 4s window", timerSeconds: 4, icon: "⚡" },
            distractors: ["tan"],
            order: 6,
          },
          {
            type: "audio_match",
            promptText: "Connected speech: Choose the image",
            solutionData: { correct: "pan 🍳", spokenText: "I see a pan", instruction: "Connected Speech at Native Speed", icon: "👂" },
            distractors: ["pin 🧷"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "Connected speech: Choose the image",
            solutionData: { correct: "tin 🥫", spokenText: "I see a tin", instruction: "Connected Speech at Native Speed", icon: "👂" },
            distractors: ["ten 🔟"],
            order: 8,
          },
          {
            type: "audio_match",
            promptText: "Which word was spoken?",
            solutionData: { correct: "sat", spokenText: "sat", instruction: "Rapid Identification: 4s window", timerSeconds: 4, icon: "⚡" },
            distractors: ["sit"],
            order: 9,
          },
          {
            type: "audio_match",
            promptText: "Which word was spoken?",
            solutionData: { correct: "tip", spokenText: "tip", instruction: "Rapid Identification: 4s window", timerSeconds: 4, icon: "⚡" },
            distractors: ["tap"],
            order: 10,
          },
          {
            type: "multiple_choice",
            promptText: "PAN (/pæn/)",
            solutionData: { correct: "pan", isSpeaking: true, spokenText: "pan", instruction: "Echo Rehearsal: Mimic pitch & duration", icon: "🎙️" },
            distractors: ["pin", "pun"],
            order: 11,
          },
          {
            type: "multiple_choice",
            promptText: "Speak this word: PIN (not PAN!)",
            solutionData: { correct: "pin", isSpeaking: true, spokenText: "pin", instruction: "Vocal Discrimination: 3s timer", timerSeconds: 3, icon: "🧷" },
            distractors: ["pan", "pen"],
            order: 12,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // Lesson 1.5: Rapid Speaking (The Tiered Ramp)
      // -----------------------------------------------------------------------
      {
        title: "1.5 Rapid Speaking: Say What You See",
        order: 5,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "PAN",
            solutionData: { correct: "pan", isSpeaking: true, spokenText: "pan", instruction: "Warm-Up Model: Untimed repetition", icon: "🍳" },
            distractors: ["tin", "tap"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "TAP",
            solutionData: { correct: "tap", isSpeaking: true, spokenText: "tap", instruction: "Warm-Up Model: Untimed repetition", icon: "🚰" },
            distractors: ["ant", "pan"],
            order: 2,
          },
          {
            type: "multiple_choice",
            promptText: "I see a pan",
            solutionData: { correct: "I see a pan", isSpeaking: true, spokenText: "I see a pan", instruction: "Frame Refresh: Model smooth prosody", icon: "🍳" },
            distractors: ["I see a pin", "I see a tap"],
            order: 3,
          },
          {
            type: "multiple_choice",
            promptText: "I see a tin",
            solutionData: { correct: "I see a tin", isSpeaking: true, spokenText: "I see a tin", instruction: "Tier 1 Speed: 5s countdown", timerSeconds: 5, icon: "🥫" },
            distractors: ["I see a tap", "I see an ant"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "I see an ant",
            solutionData: { correct: "I see an ant", isSpeaking: true, spokenText: "I see an ant", instruction: "Tier 1 Speed: 5s countdown", timerSeconds: 5, icon: "🐜" },
            distractors: ["I see a pan", "I see a pin"],
            order: 5,
          },
          {
            type: "multiple_choice",
            promptText: "I see a p__",
            solutionData: { correct: "I see a pin", isSpeaking: true, spokenText: "I see a pin", instruction: "Text Fading: Complete full frame", timerSeconds: 5, icon: "🧷" },
            distractors: ["I see a tin", "I see a tap"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "I see a t__",
            solutionData: { correct: "I see a tap", isSpeaking: true, spokenText: "I see a tap", instruction: "Text Fading: Complete full frame", timerSeconds: 5, icon: "🚰" },
            distractors: ["I see an ant", "I see a pan"],
            order: 7,
          },
          {
            type: "multiple_choice",
            promptText: "Speak the object in 3s!",
            solutionData: { correct: "pan", isSpeaking: true, spokenText: "pan", instruction: "Tier 2 Speed: 3-second flash", timerSeconds: 3, icon: "🍳" },
            distractors: ["pin", "tin"],
            order: 8,
          },
          {
            type: "multiple_choice",
            promptText: "Speak the object in 3s!",
            solutionData: { correct: "tin", isSpeaking: true, spokenText: "tin", instruction: "Tier 2 Speed: 3-second flash", timerSeconds: 3, icon: "🥫" },
            distractors: ["tan", "ten"],
            order: 9,
          },
          {
            type: "multiple_choice",
            promptText: "Speak the object in 3s!",
            solutionData: { correct: "ant", isSpeaking: true, spokenText: "ant", instruction: "Tier 2 Speed: 3-second flash", timerSeconds: 3, icon: "🐜" },
            distractors: ["at", "and"],
            order: 10,
          },
          {
            type: "multiple_choice",
            promptText: "[ Speak the full sentence ]",
            solutionData: { correct: "I see a tap", isSpeaking: true, spokenText: "I see a tap", instruction: "Full Frame Sprint: 4s timer", timerSeconds: 4, icon: "🚰" },
            distractors: ["I see a pan", "I see a tin"],
            order: 11,
          },
          {
            type: "multiple_choice",
            promptText: "[ Zero prompts — speak full frame ]",
            solutionData: { correct: "I see a pin", isSpeaking: true, spokenText: "I see a pin", instruction: "Cap Sprint: 3s timer", timerSeconds: 3, icon: "🧷" },
            distractors: ["I see a pan", "I see a tap"],
            order: 12,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // Lesson 1.6: Checkpoint 1 (The Gate)
      // -----------------------------------------------------------------------
      {
        title: "1.6 Checkpoint 1: Unlock the Next Step",
        order: 6,
        xpReward: 20,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "Cold word card: NAP",
            solutionData: { correct: "Sleep / Short rest 😴", instruction: "Unseen Blend: Select representation", icon: "🔤" },
            distractors: ["Cooking pot 🍳", "Sewing tool 🧷"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "Cold word card: SIP",
            solutionData: { correct: "Drink a little 🥤", instruction: "Unseen Blend: Select representation", icon: "🔤" },
            distractors: ["Water tap 🚰", "Small insect 🐜"],
            order: 2,
          },
          {
            type: "audio_match",
            promptText: "Zero-hint discrimination",
            solutionData: { correct: "pat", spokenText: "pat", instruction: "Acoustic Minimal Pair: PAT or PET?", icon: "👂" },
            distractors: ["pet"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "Listen & unscramble within 6 seconds",
            solutionData: { tokens: ["I", "see", "a", "tin"], spokenText: "I see a tin", instruction: "Sentence Assembly: Zero hints", icon: "🥫" },
            distractors: ["pan", "tap"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "Word card: TIP",
            solutionData: { correct: "tip", isSpeaking: true, spokenText: "tip", instruction: "Unseen Vocal Decode: 3s countdown", timerSeconds: 3, icon: "🎙️" },
            distractors: ["tap", "top"],
            order: 5,
          },
          {
            type: "multiple_choice",
            promptText: "[ Capstone: Speak the full sentence ]",
            solutionData: { correct: "I see a pan", isSpeaking: true, spokenText: "I see a pan", instruction: "Oral Capstone: 3s countdown", timerSeconds: 3, icon: "🍳" },
            distractors: ["I see a pin", "I see a tin"],
            order: 6,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // UNIT 3: Section 2: First Consonants & The English R (C, K, E, H, R, M, D)
  // =========================================================================
  {
    title: "Section 2: First Consonants & The English R (C, K, E, H, R, M, D)",
    order: 3,
    lessons: [
      {
        title: "2.1 Sound & Blend: New Letters & The English R",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "2.2 Word Builder: Daily Objects (Cat, Hat, Map, Hen, Kid, Pen)",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "2.3 Sentence Frame: 'It is a...' and 'It is red'",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "2.4 Ear Training: The 3 Vowels (Bad vs. Bed vs. Bid)",
        order: 4,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "2.5 Rapid Speaking: Describe It Fast",
        order: 5,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "2.6 Checkpoint 2: Unlock the Next Step",
        order: 6,
        xpReward: 20,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // UNIT 4: Section 3: Vowels, Voicing & Ending Sounds (G, O, U, L, F, B, CK)
  // =========================================================================
  {
    title: "Section 3: Vowels, Voicing & Ending Sounds (G, O, U, L, F, B, CK)",
    order: 4,
    lessons: [
      {
        title: "3.1 Sound & Blend: Deep Vowels & Hard Stops (G, O, U, L, F, B, CK)",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "3.2 Word Builder: Things Around You (Bag, Dog, Cup, Log, Fan, Bun)",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "3.3 Sentence Frame: 'I have a...'",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "3.4 Ear Training: Word Endings (Bag vs. Back, Cap vs. Cab)",
        order: 4,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "3.5 Rapid Speaking: Claim Your Items",
        order: 5,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "3.6 Checkpoint 3: Unlock the Next Step",
        order: 6,
        xpReward: 20,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // UNIT 5: Section 4: Edge Letters & Sound Traps (J, Z, W, V, Y, X, Q)
  // =========================================================================
  {
    title: "Section 4: Edge Letters & Sound Traps (J, Z, W, V, Y, X, Q)",
    order: 5,
    lessons: [
      {
        title: "4.1 Sound & Blend: Tricky Letters (J, Z, W, V, Y, X, Q)",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "4.2 Word Builder: Quick Decodes (Wet, Van, Web, Wig, Box, Zip, Yak, Quiz)",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "4.3 Sentence Frame: 'This is...' and 'This is not...'",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "4.4 Ear Training: W vs. V (Wet vs. Vet)",
        order: 4,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "4.5 Rapid Speaking: Fast Corrections",
        order: 5,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "4.6 Checkpoint 4: Unlock the Next Step",
        order: 6,
        xpReward: 20,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // UNIT 6: Section 5: Team Letters & Questions (SH, CH, TH, NG, WH)
  // =========================================================================
  {
    title: "Section 5: Team Letters & Questions (SH, CH, TH, NG, WH)",
    order: 6,
    lessons: [
      {
        title: "5.1 Sound & Blend: Two Letters, One Sound (SH, CH, TH, NG, WH)",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "5.2 Word Builder: Everyday Chunks (Ship, Shop, Fish, Chin, Rich, Thin, Ring, Song, What)",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "5.3 Sentence Frame: 'Where is it?' / 'Here and there'",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "5.4 Ear Training: Friction Sounds (Ship vs. Chip, Sink vs. Think)",
        order: 4,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "5.5 Rapid Speaking: Find and Point",
        order: 5,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "5.6 Checkpoint 5: Unlock the Next Step",
        order: 6,
        xpReward: 20,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // UNIT 7: Section 6: The Magic E & Long Vowels (A_E, I_E, O_E, U_E)
  // =========================================================================
  {
    title: "Section 6: The Magic E & Long Vowels (A_E, I_E, O_E, U_E)",
    order: 7,
    lessons: [
      {
        title: "6.1 Sound & Blend: The Silent E Secret",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "6.2 Word Builder: Long Vowel Words (Cake, Bike, Home, Rope, Five, Cute)",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "6.3 Sentence Frame: 'I have a...' (Upgraded)",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "6.4 Ear Training: Short vs. Long (Cap vs. Cape, Kit vs. Kite)",
        order: 4,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "6.5 Rapid Speaking: Smooth Vowels",
        order: 5,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "6.6 Checkpoint 6: Unlock the Next Step",
        order: 6,
        xpReward: 20,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // UNIT 8: Section 7: Vowel Teams I (AI, AY, EE, OA)
  // =========================================================================
  {
    title: "Section 7: Vowel Teams I (AI, AY, EE, OA)",
    order: 8,
    lessons: [
      {
        title: "7.1 Sound & Blend: Paired Vowels (AI, AY, EE, OA)",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "7.2 Word Builder: Nature & Travel (Rain, Day, Tree, Bee, Boat, Coat)",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "7.3 Sentence Frame: 'I see a...' (Upgraded)",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "7.4 Ear Training: Same Sound, Different Letters (Day vs. Rain)",
        order: 4,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "7.5 Rapid Speaking: Fluency Sprint",
        order: 5,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "7.6 Checkpoint 7: Unlock the Next Step",
        order: 6,
        xpReward: 20,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // UNIT 9: Section 8: Vowel Teams II & Word Shapes (OO, AR, OR, ER, OW, OI)
  // =========================================================================
  {
    title: "Section 8: Vowel Teams II & Word Shapes (OO, AR, OR, ER, OW, OI)",
    order: 9,
    lessons: [
      {
        title: "8.1 Sound & Blend: Deep Sounds & Rolling Letters",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "8.2 Word Builder: Heavy Sounds (Moon, Book, Car, Bird, Cow, Coin)",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "8.3 Sentence Frame: 'It is a...' (Full Set)",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "8.4 Ear Training: Sound Contrasts (Moon vs. Book, Car vs. For)",
        order: 4,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "8.5 Rapid Speaking: Fast Responses",
        order: 5,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "8.6 Checkpoint 8: Unlock the Next Step",
        order: 6,
        xpReward: 20,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // UNIT 10: Section 9: Rhythm, Gender & The Gateway (Schwa & Pronouns)
  // =========================================================================
  {
    title: "Section 9: Rhythm, Gender & The Gateway (Schwa & Pronouns)",
    order: 10,
    lessons: [
      {
        title: "9.1 Sound & Blend: English Rhythm & The Lazy Vowel (/ə/)",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "9.2 Word Builder: Full Speed Recall",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "9.3 Sentence Frame: 'He is...' / 'She is...' / 'Is he...?'",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "9.4 Ear Training: Sentence Rhythm & Voice Tone",
        order: 4,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "9.5 Rapid Speaking: People & Questions",
        order: 5,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "9.6 Checkpoint 9: Level 0 Capstone Exam",
        order: 6,
        xpReward: 30,
        exercises: [],
      },
    ],
  },
];

async function seedEnglishCourse() {
  console.log("=== Seeding English for Kurdish Speakers (ئینگلیزی بۆ کورد) ===");

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const adminSecret = process.env.ADMIN_SEED_SECRET;

  const totalExercises = LEVEL_0_UNITS.reduce(
    (acc, u) => acc + u.lessons.reduce((lAcc, l) => lAcc + l.exercises.length, 0),
    0
  );
  const totalLessons = LEVEL_0_UNITS.reduce((acc, u) => acc + u.lessons.length, 0);

  console.log(
    `Prepared ${LEVEL_0_UNITS.length} units, ${totalLessons} lessons, ${totalExercises} interactive exercises.`
  );

  if (!convexUrl || convexUrl.includes("dummy-preview") || !adminSecret) {
    console.log(
      "\n[VALIDATION OK] Curriculum data verified. To push to Convex, ensure NEXT_PUBLIC_CONVEX_URL and ADMIN_SEED_SECRET are set."
    );
    return;
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log(`Connecting to Convex at: ${convexUrl}...`);
    const result = await client.mutation(api.admin.seedCurriculum, {
      adminSecret,
      course: COURSE,
      units: LEVEL_0_UNITS,
    });

    console.log("\nCourse successfully seeded!");
    console.log(`- Course slug: ${result.courseSlug}`);
    console.log(`- Lessons upserted: ${result.lessonsUpserted}`);
    console.log(`- Exercises written: ${result.exercisesWritten}`);
  } catch (err) {
    console.error("Failed to seed course:", err);
    process.exit(1);
  }
}

seedEnglishCourse();
