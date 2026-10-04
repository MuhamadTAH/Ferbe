import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

export interface ExerciseInput {
  type: "multiple_choice" | "word_bank" | "audio_match";
  promptText: string;
  solutionData: Record<string, unknown>;
  distractors: string[];
  order: number;
}

export interface LessonInput {
  title: string;
  order: number;
  xpReward: number;
  exercises: ExerciseInput[];
}

export interface UnitInput {
  title: string;
  order: number;
  lessons: LessonInput[];
}

export const COURSE = {
  title: "English Foundations & Phonics (ئینگلیزی لە سفرەوە)",
  slug: "english-foundations",
  sourceLanguage: "ckb",
  targetLanguage: "en",
};

export const FOUNDATIONS_UNITS: UnitInput[] = [
  {
    title: "Unit 1: Sound, Blend & Lexical Anchors (دەنگ، پیت و وشانەکان)",
    order: 1,
    lessons: [
      // =======================================================================
      // LESSON 1.1: Sound & Blend (S, A, T, P, I, N)
      // =======================================================================
      {
        title: "1.1 Sound & Blend (S, A, T, P, I, N)",
        order: 1,
        xpReward: 20,
        exercises: [
          // S1: Word Anchors - Initial Sounds (S, A, T)
          {
            type: "multiple_choice",
            promptText: "پێناسەی دەنگە سەرەتاییەکان: S, A, T",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "word_anchors",
              instruction: "پێناسەی دەنگ (Sound Anchors)",
              correct: "completed",
              words: [
                {
                  english: "S",
                  pronunciationKurdish: "/s/",
                  meaningKurdish: "دەنگی مار 🐍",
                  note: "پیت: S",
                },
                {
                  english: "A",
                  pronunciationKurdish: "/æ/",
                  meaningKurdish: "دەنگی کورت 🍎",
                  note: "پیت: A",
                },
                {
                  english: "T",
                  pronunciationKurdish: "/t/",
                  meaningKurdish: "تەقینەوە ⏱️",
                  note: "پیت: T",
                },
              ],
            },
          },
          // S2: Tactile Blending A + T -> AT
          {
            type: "multiple_choice",
            promptText: "پیتەکان بلکێنە بۆ دروستکردنی دەنگی AT",
            distractors: [],
            order: 2,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "پیتەکان بلکێنە (Tactile Blending)",
              visualCue: "🔤 /æ/ + /t/ = AT",
              tiles: ["A", "T", "S"],
              correctOrder: ["A", "T"],
              correct: "completed",
            },
          },
          // S3: The Echo Mic - Speak AT
          {
            type: "multiple_choice",
            promptText: "دەربڕینی وشەی AT لە مایکرۆفۆن",
            distractors: [],
            order: 3,
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی وتار و دەنگدانەوە (The Echo Mic)",
              spokenText: "at",
              subTextGuide: "ئەت",
              correct: "at",
            },
          },
          // S4: Word Anchors - Secondary Sounds (P, I, N)
          {
            type: "multiple_choice",
            promptText: "پێناسەی دەنگە لاوەکییەکان: P, I, N",
            distractors: [],
            order: 4,
            solutionData: {
              subtype: "word_anchors",
              instruction: "پێناسەی دەنگ (Sound Anchors)",
              correct: "completed",
              words: [
                {
                  english: "P",
                  pronunciationKurdish: "/p/",
                  meaningKurdish: "هەوایی 💨",
                  note: "پیت: P",
                },
                {
                  english: "I",
                  pronunciationKurdish: "/ɪ/",
                  meaningKurdish: "دەنگی کورت 📌",
                  note: "پیت: I",
                },
                {
                  english: "N",
                  pronunciationKurdish: "/n/",
                  meaningKurdish: "دەنگی لووت 👃",
                  note: "پیت: N",
                },
              ],
            },
          },
          // S5: Acoustic Match - Sound to Spelling (P, T, S)
          {
            type: "audio_match",
            promptText: "گوێ لە دەنگەکان بگرە و پیتە هاوتاکەیان دیاری بکە",
            distractors: [],
            order: 5,
            solutionData: {
              subtype: "acoustic_match",
              instruction: "ڕاهێنانی بیستن (Acoustic Match)",
              correct: "matched",
              sounds: [
                { id: "s1", label: "Sound 1", word: "P" },
                { id: "s2", label: "Sound 2", word: "T" },
                { id: "s3", label: "Sound 3", word: "S" },
              ],
              words: ["T", "S", "P"],
            },
          },
          // S6: Tile Assembly - Word PAN
          {
            type: "multiple_choice",
            promptText: "پیتەکان ڕێکبخە بۆ وشەی PAN",
            distractors: [],
            order: 6,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "دروستکردنی وشەی PAN (Tile Assembly)",
              visualCue: "🍳 PAN",
              tiles: ["P", "A", "N", "T"],
              correctOrder: ["P", "A", "N"],
              correct: "completed",
            },
          },
          // S7: Tile Assembly - Word PIN
          {
            type: "multiple_choice",
            promptText: "پیتەکان ڕێکبخە بۆ وشەی PIN",
            distractors: [],
            order: 7,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "دروستکردنی وشەی PIN (Tile Assembly)",
              visualCue: "🧷 PIN",
              tiles: ["P", "I", "N", "A"],
              correctOrder: ["P", "I", "N"],
              correct: "completed",
            },
          },
          // S8: Speed Discrimination PAN vs PIN
          {
            type: "multiple_choice",
            promptText: "کام دەنگت بیست؟ PAN یان PIN؟",
            distractors: ["PAN"],
            order: 8,
            solutionData: {
              subtype: "speed_trap",
              instruction: "جیاکردنەوەی خێرا (Speed Discrimination)",
              question: "کام وشەت بیست؟ (/æ/ vs /ɪ/)",
              audioText: "pin",
              options: ["PAN", "PIN"],
              correct: "PIN",
              timerSeconds: 5,
            },
          },
          // S9: The Echo Mic - Speak PIN
          {
            type: "multiple_choice",
            promptText: "دەربڕینی وشەی PIN لە مایکرۆفۆن",
            distractors: [],
            order: 9,
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی وتار و دەنگدانەوە (The Echo Mic)",
              spokenText: "pin",
              subTextGuide: "پین",
              visualScaffold: "🧷 PIN",
              correct: "pin",
            },
          },
          // S10: Tile Assembly - Word TAP
          {
            type: "multiple_choice",
            promptText: "پیتەکان ڕێکبخە بۆ وشەی TAP",
            distractors: [],
            order: 10,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "دروستکردنی وشەی TAP (Tile Assembly)",
              visualCue: "🚰 TAP",
              tiles: ["T", "A", "P", "I"],
              correctOrder: ["T", "A", "P"],
              correct: "completed",
            },
          },
          // S11: Timed Mic - Cold Read TAP (4s)
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بە خێرایی بڵێ (4 چرکە)",
            distractors: [],
            order: 11,
            solutionData: {
              subtype: "timed_mic",
              instruction: "خوێندنەوەی خێرا (Timed Speaking)",
              visualCue: "🚰 TAP",
              scaffoldText: "TAP",
              spokenText: "tap",
              correct: "tap",
              timerSeconds: 4,
            },
          },
        ],
      },

      // =======================================================================
      // LESSON 1.2: Lexical Anchors (pan, tin, pin, ant, tap)
      // =======================================================================
      {
        title: "1.2 Lexical Anchors (pan, tin, pin, ant, tap)",
        order: 2,
        xpReward: 20,
        exercises: [
          // S1: Word Anchors - Group 1 (PAN, ANT, TAP)
          {
            type: "multiple_choice",
            promptText: "پێناسەی وشان: PAN, ANT, TAP",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "word_anchors",
              instruction: "پێناسەی وشە (Word Anchors)",
              correct: "completed",
              words: [
                {
                  english: "PAN",
                  pronunciationKurdish: "پان",
                  meaningKurdish: "تاوە 🍳",
                  note: "سوورکردنەوە",
                },
                {
                  english: "ANT",
                  pronunciationKurdish: "ئانت",
                  meaningKurdish: "مێروولە 🐜",
                  note: "مێروو",
                },
                {
                  english: "TAP",
                  pronunciationKurdish: "تاپ",
                  meaningKurdish: "حەنەفیە 🚰",
                  note: "بەلوعە",
                },
              ],
            },
          },
          // S2: Word Anchors - Group 2 (PIN, TIN)
          {
            type: "multiple_choice",
            promptText: "پێناسەی وشان: PIN, TIN",
            distractors: [],
            order: 2,
            solutionData: {
              subtype: "word_anchors",
              instruction: "پێناسەی وشە (Word Anchors)",
              correct: "completed",
              words: [
                {
                  english: "PIN",
                  pronunciationKurdish: "پین",
                  meaningKurdish: "دەرزی 🧷",
                  note: "جلوبەرگ",
                },
                {
                  english: "TIN",
                  pronunciationKurdish: "تین",
                  meaningKurdish: "قوتوو 🥫",
                  note: "تەنەکە",
                },
              ],
            },
          },
          // S3: Acoustic Match (PAN, TIN, ANT)
          {
            type: "audio_match",
            promptText: "گوێ لە دەنگەکان بگرە و وشە هاوتاکەیان دیاری بکە",
            distractors: [],
            order: 3,
            solutionData: {
              subtype: "acoustic_match",
              instruction: "ڕاهێنانی بیستن (Acoustic Match)",
              correct: "matched",
              sounds: [
                { id: "s1", label: "Sound 1", word: "PAN" },
                { id: "s2", label: "Sound 2", word: "TIN" },
                { id: "s3", label: "Sound 3", word: "ANT" },
              ],
              words: ["TIN", "ANT", "PAN"],
            },
          },
          // S4: Audio Choice - Visual Match PAN vs ANT
          {
            type: "multiple_choice",
            promptText: "کام وێنەیە PANە؟",
            distractors: ["🐜 ANT"],
            order: 4,
            solutionData: {
              subtype: "audio_choice",
              instruction: "هاوتاکردنی وێنە (Visual Match)",
              question: "کام وێنەیە PANە؟",
              audioText: "pan",
              options: ["🍳 PAN", "🐜 ANT"],
              correct: "🍳 PAN",
            },
          },
          // S5: Speed Trap - Discrimination PIN vs TIN (5s)
          {
            type: "multiple_choice",
            promptText: "کام وێنەیە TINە؟ (5 چرکە)",
            distractors: ["🧷 PIN"],
            order: 5,
            solutionData: {
              subtype: "speed_trap",
              instruction: "تەڵەی جیاکردنەوە (Speed Discrimination)",
              question: "کام وێنەیە TINە؟",
              audioText: "tin",
              options: ["🥫 TIN", "🧷 PIN"],
              correct: "🥫 TIN",
              timerSeconds: 5,
            },
          },
          // S6: Tile Assembly - Word TAP
          {
            type: "multiple_choice",
            promptText: "وشەی TAP دروست بکە",
            distractors: [],
            order: 6,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "ڕێنووسی وشەی TAP (Tile Assembly)",
              visualCue: "🚰 TAP",
              tiles: ["T", "A", "P", "S"],
              correctOrder: ["T", "A", "P"],
              correct: "completed",
            },
          },
          // S7: Audio Choice - 4-Way Image Matrix ANT
          {
            type: "multiple_choice",
            promptText: "کامەیە ANT؟",
            distractors: ["🍳 PAN", "🥫 TIN", "🚰 TAP"],
            order: 7,
            solutionData: {
              subtype: "audio_choice",
              instruction: "ماتریسی چوار وێنەیی (4-Way Matrix)",
              question: "دەنگی کام وێنەیە بیستت؟",
              audioText: "ant",
              options: ["🍳 PAN", "🐜 ANT", "🥫 TIN", "🚰 TAP"],
              correct: "🐜 ANT",
            },
          },
          // S8: Audio Choice - Blind Listen PIN
          {
            type: "multiple_choice",
            promptText: "کام وشەت بیست؟",
            distractors: ["PAN", "TIN"],
            order: 8,
            solutionData: {
              subtype: "audio_choice",
              instruction: "گوێگرتنی کوێرانە (Blind Listen)",
              question: "کام وشەت بیست؟",
              audioText: "pin",
              options: ["PAN", "PIN", "TIN"],
              correct: "PIN",
            },
          },
          // S9: The Echo Mic - Speak TIN
          {
            type: "multiple_choice",
            promptText: "دەربڕینی وشەی TIN لە مایکرۆفۆن",
            distractors: [],
            order: 9,
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی دەنگ (The Echo Mic)",
              spokenText: "tin",
              subTextGuide: "تین",
              visualScaffold: "🥫 TIN",
              correct: "tin",
            },
          },
          // S10: Timed Mic - Cold Vocal PAN (3s)
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بە ئینگلیزی بڵێ (3 چرکە)",
            distractors: [],
            order: 10,
            solutionData: {
              subtype: "timed_mic",
              instruction: "دەربڕینی خێرا (Timed Speaking)",
              visualCue: "🍳",
              scaffoldText: "PAN",
              spokenText: "pan",
              correct: "pan",
              timerSeconds: 3,
            },
          },
        ],
      },

      // =======================================================================
      // LESSON 1.3: Sentence Frame ("I see a...")
      // =======================================================================
      {
        title: "1.3 Sentence Frame (I see a...)",
        order: 3,
        xpReward: 20,
        exercises: [
          // S1: Analytic Breakdown - Deconstruct "I see a pan."
          {
            type: "multiple_choice",
            promptText: "شیکردنەوەی پێکهاتەی ڕستە: I see a pan.",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "analytic_breakdown",
              instruction: "شیکردنەوەی پێکهاتەی ڕستە (Analytic Breakdown)",
              correct: "I see a pan.",
              rows: [
                { english: "I", pronunciationKurdish: "ئای", meaningKurdish: "من" },
                { english: "see", pronunciationKurdish: "سیی", meaningKurdish: "دەبینم" },
                { english: "a pan", pronunciationKurdish: "ئە پان", meaningKurdish: "تاوەیەک" },
                {
                  english: "I see a pan.",
                  pronunciationKurdish: "ئای سیی ئە پان.",
                  meaningKurdish: "من تاوەیەک دەبینم.",
                  isFullPhrase: true,
                },
              ],
            },
          },
          // S2: Slot Filler - "I see an [ ___ ]"
          {
            type: "multiple_choice",
            promptText: "بۆشاییەکە پڕبکەرەوە: I see an [ ___ ]",
            distractors: ["pan", "tin"],
            order: 2,
            solutionData: {
              subtype: "slot_filler",
              instruction: "پڕکردنەوەی بۆشایی (Slot & Filler)",
              frameText: "I see an [ ___ ].",
              visualCue: "🐜",
              correctWord: "ant",
              options: ["ant", "pan", "tin"],
              correct: "ant",
            },
          },
          // S3: Tile Assembly - SVO Order
          {
            type: "multiple_choice",
            promptText: "ڕستەکە بەپێی ڕێزمانی ئینگلیزی ڕێکبخە",
            distractors: [],
            order: 3,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "ڕێکخستنی SVO (Tile Assembly)",
              visualCue: "🥫 I see a tin.",
              tiles: ["a", "I", "see", "tin."],
              correctOrder: ["I", "see", "a", "tin."],
              correct: "completed",
            },
          },
          // S4: Audio Choice - Receptive Check
          {
            type: "multiple_choice",
            promptText: "واتای کام ڕستەیەت بیست؟",
            distractors: ["🍳 I see a pan", "🧷 I see a pin"],
            order: 4,
            solutionData: {
              subtype: "audio_choice",
              instruction: "پشکنینی بیستن (Audio Choice)",
              question: "واتای کام ڕستەیەت بیست؟",
              audioText: "I see a tap",
              options: ["🚰 I see a tap", "🍳 I see a pan", "🧷 I see a pin"],
              correct: "🚰 I see a tap",
            },
          },
          // S5: Slot Filler - "I see a [ ___ ]"
          {
            type: "multiple_choice",
            promptText: "بۆشاییەکە پڕبکەرەوە: I see a [ ___ ]",
            distractors: ["tap", "ant"],
            order: 5,
            solutionData: {
              subtype: "slot_filler",
              instruction: "پڕکردنەوەی بۆشایی (Slot & Filler)",
              frameText: "I see a [ ___ ].",
              visualCue: "🧷",
              correctWord: "pin",
              options: ["pin", "tap", "ant"],
              correct: "pin",
            },
          },
          // S6: Speed Ear Gate - Rapid True/False Checkpoint
          {
            type: "multiple_choice",
            promptText: "ئایا دەنگەکە و وێنەکە یەکدەگرنەوە؟",
            distractors: [],
            order: 6,
            solutionData: {
              subtype: "speed_ear_gate",
              instruction: "جیاکردنەوەی ڕاست / هەڵە (Speed Ear Gate)",
              rounds: [
                { audio: "I see a pin", display: "🍳 (Pan)", correct: false },
                { audio: "I see a tin", display: "🥫 (Tin)", correct: true },
                { audio: "I see a tap", display: "🚰 (Tap)", correct: true },
              ],
              timerSeconds: 4,
              passMark: 2,
              correct: "completed",
            },
          },
          // S7: The Echo Mic - Rehearsal Repetition
          {
            type: "multiple_choice",
            promptText: "دووبارەکردنەوەی ڕستەی تەواو: I see a pan",
            distractors: [],
            order: 7,
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی دەنگدانەوە (The Echo Mic)",
              spokenText: "I see a pan",
              subTextGuide: "ئای سیی ئە پان",
              visualScaffold: "🍳 I see a pan",
              correct: "I see a pan",
            },
          },
          // S8: Tile Assembly - Timed Sentence Rebuild (6s)
          {
            type: "multiple_choice",
            promptText: "ڕستەکە بە خێرایی ڕێکبخە (6 چرکە)",
            distractors: [],
            order: 8,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "ڕێکخستنی خێرای ڕستە (Timed Tile Assembly)",
              visualCue: "🍳 I see a pan",
              tiles: ["see", "I", "a", "pan."],
              correctOrder: ["I", "see", "a", "pan."],
              timerSeconds: 6,
              correct: "completed",
            },
          },
          // S9: Audio Choice - Ear-to-Text Mapping
          {
            type: "multiple_choice",
            promptText: "کام ڕستەت بیست؟",
            distractors: ["I see a pin"],
            order: 9,
            solutionData: {
              subtype: "audio_choice",
              instruction: "هاوتاکردنی دەنگ و دەق (Audio Choice)",
              question: "کام ڕستەت بیست؟",
              audioText: "I see a tin",
              options: ["I see a pin", "I see a tin"],
              correct: "I see a tin",
            },
          },
          // S10: Timed Mic - Vocal Ramp (5s)
          {
            type: "multiple_choice",
            promptText: "ڕستەکە لە مایکرۆفۆن بخوێنەرەوە (5 چرکە)",
            distractors: [],
            order: 10,
            solutionData: {
              subtype: "timed_mic",
              instruction: "ڕاهێنانی خێرایی (Timed Speaking)",
              visualCue: "🚰 I see a tap",
              scaffoldText: "I see a tap",
              spokenText: "I see a tap",
              correct: "I see a tap",
              timerSeconds: 5,
            },
          },
          // S11: Timed Mic - Cold Vocal Production (4s)
          {
            type: "multiple_choice",
            promptText: "بەبێ دەق، ڕستەکە بڵێ (4 چرکە)",
            distractors: [],
            order: 11,
            solutionData: {
              subtype: "timed_mic",
              instruction: "دەربڕینی سەربەخۆ (Timed Speaking)",
              visualCue: "🐜",
              scaffoldText: "I see an [ ... ]",
              spokenText: "I see an ant",
              correct: "I see an ant",
              timerSeconds: 4,
            },
          },
        ],
      },

      // =======================================================================
      // LESSON 1.4: Ear Training (Short /æ/ vs. Short /ɪ/)
      // =======================================================================
      {
        title: "1.4 Ear Training (Short /æ/ vs. Short /ɪ/)",
        order: 4,
        xpReward: 20,
        exercises: [
          // S1: Acoustic Match (pan, pin, tan, tin)
          {
            type: "audio_match",
            promptText: "جیاوازی دەنگی کورت: /æ/ و /ɪ/",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "acoustic_match",
              instruction: "جیاوازی دەنگەکان (Acoustic Match)",
              correct: "matched",
              sounds: [
                { id: "s1", label: "Sound 1 (/æ/)", word: "pan" },
                { id: "s2", label: "Sound 2 (/ɪ/)", word: "pin" },
                { id: "s3", label: "Sound 3 (/æ/)", word: "tan" },
                { id: "s4", label: "Sound 4 (/ɪ/)", word: "tin" },
              ],
              words: ["pin", "tan", "pan", "tin"],
            },
          },
          // S2: Audio Choice - Discrimination 1
          {
            type: "multiple_choice",
            promptText: "کام دەنگەت بیست؟",
            distractors: ["I (/ɪ/ - pin)"],
            order: 2,
            solutionData: {
              subtype: "audio_choice",
              instruction: "ناسینەوەی دەنگ (Audio Choice)",
              question: "کام دەنگت بیست؟",
              audioText: "pan",
              options: ["A (/æ/ - pan)", "I (/ɪ/ - pin)"],
              correct: "A (/æ/ - pan)",
            },
          },
          // S3: Audio Choice - Discrimination 2
          {
            type: "multiple_choice",
            promptText: "کام دەنگەت بیست؟",
            distractors: ["A (/æ/ - pan)"],
            order: 3,
            solutionData: {
              subtype: "audio_choice",
              instruction: "ناسینەوەی دەنگ (Audio Choice)",
              question: "کام دەنگت بیست؟",
              audioText: "pin",
              options: ["A (/æ/ - pan)", "I (/ɪ/ - pin)"],
              correct: "I (/ɪ/ - pin)",
            },
          },
          // S4: Audio Choice - Pair Sorting PAT
          {
            type: "multiple_choice",
            promptText: "وشەی PAT سەر بە کام دەنگەیە؟",
            distractors: ["/ɪ/ وەک لە PIN"],
            order: 4,
            solutionData: {
              subtype: "audio_choice",
              instruction: "پۆلێنکردنی جووتە دەنگەکان (Pair Sorting)",
              question: "وشەی PAT سەر بە کام دەنگەیە؟",
              audioText: "pat",
              options: ["/æ/ وەک لە PAN", "/ɪ/ وەک لە PIN"],
              correct: "/æ/ وەک لە PAN",
            },
          },
          // S5: Audio Choice - Pair Sorting PIT
          {
            type: "multiple_choice",
            promptText: "وشەی PIT سەر بە کام دەنگەیە؟",
            distractors: ["/æ/ وەک لە PAN"],
            order: 5,
            solutionData: {
              subtype: "audio_choice",
              instruction: "پۆلێنکردنی جووتە دەنگەکان (Pair Sorting)",
              question: "وشەی PIT سەر بە کام دەنگەیە؟",
              audioText: "pit",
              options: ["/æ/ وەک لە PAN", "/ɪ/ وەک لە PIN"],
              correct: "/ɪ/ وەک لە PIN",
            },
          },
          // S6: Speed Trap - TAN vs TIN (4s)
          {
            type: "multiple_choice",
            promptText: "TAN یان TIN؟ (4 چرکە)",
            distractors: ["TAN"],
            order: 6,
            solutionData: {
              subtype: "speed_trap",
              instruction: "بڕیاردانی خێرا (Speed Discrimination)",
              question: "کام وشەت بیست؟",
              audioText: "tin",
              options: ["TAN", "TIN"],
              correct: "TIN",
              timerSeconds: 4,
            },
          },
          // S7: Audio Choice - Connected Speech 1
          {
            type: "multiple_choice",
            promptText: "کام وێنەیەت بیست؟",
            distractors: ["🧷 PIN"],
            order: 7,
            solutionData: {
              subtype: "audio_choice",
              instruction: "دەنگی بەستراوە (Audio Choice)",
              question: "گوێ بگرە: کام وێنەیە؟",
              audioText: "I see a pan",
              options: ["🍳 PAN", "🧷 PIN"],
              correct: "🍳 PAN",
            },
          },
          // S8: Audio Choice - Connected Speech 2
          {
            type: "multiple_choice",
            promptText: "کام وێنەیەت بیست؟",
            distractors: ["🔟 TEN"],
            order: 8,
            solutionData: {
              subtype: "audio_choice",
              instruction: "دەنگی بەستراوە (Audio Choice)",
              question: "گوێ بگرە: کام وێنەیە؟",
              audioText: "I see a tin",
              options: ["🥫 TIN", "🔟 TEN"],
              correct: "🥫 TIN",
            },
          },
          // S9: Speed Trap - SAT vs SIT (4s)
          {
            type: "multiple_choice",
            promptText: "SIT یان SAT؟ (4 چرکە)",
            distractors: ["SIT"],
            order: 9,
            solutionData: {
              subtype: "speed_trap",
              instruction: "ناسینەوەی خێرا (Speed Discrimination)",
              question: "کام وشەیە؟",
              audioText: "sat",
              options: ["SIT", "SAT"],
              correct: "SAT",
              timerSeconds: 4,
            },
          },
          // S10: Speed Trap - TAP vs TIP (4s)
          {
            type: "multiple_choice",
            promptText: "TAP یان TIP؟ (4 چرکە)",
            distractors: ["TAP"],
            order: 10,
            solutionData: {
              subtype: "speed_trap",
              instruction: "ناسینەوەی خێرا (Speed Discrimination)",
              question: "کام وشەیە؟",
              audioText: "tip",
              options: ["TAP", "TIP"],
              correct: "TIP",
              timerSeconds: 4,
            },
          },
          // S11: The Echo Mic - Echo Rehearsal PAN
          {
            type: "multiple_choice",
            promptText: "دەربڕینی وشەی PAN لە مایکرۆفۆن",
            distractors: [],
            order: 11,
            solutionData: {
              subtype: "echo_mic",
              instruction: "دەربڕینی دەنگ (The Echo Mic)",
              spokenText: "pan",
              subTextGuide: "پان",
              visualScaffold: "🍳 PAN",
              correct: "pan",
            },
          },
          // S12: Timed Mic - Vocal Discrimination PIN (3s)
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بڵێ (دڵنیابە PINە نەک PAN)",
            distractors: [],
            order: 12,
            solutionData: {
              subtype: "timed_mic",
              instruction: "جیاکردنەوەی دەربڕین (Timed Speaking)",
              visualCue: "🧷 PIN",
              scaffoldText: "PIN",
              spokenText: "pin",
              correct: "pin",
              timerSeconds: 3,
            },
          },
        ],
      },

      // =======================================================================
      // LESSON 1.5: Rapid Speaking (The Tiered Ramp)
      // =======================================================================
      {
        title: "1.5 Rapid Speaking (The Tiered Ramp)",
        order: 5,
        xpReward: 20,
        exercises: [
          // S1: Warm-Up PAN
          {
            type: "multiple_choice",
            promptText: "گەرمکردنەوە: دەربڕینی PAN",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "echo_mic",
              instruction: "گەرمکردنەوە (The Echo Mic)",
              targetWord: "pan",
              spokenText: "pan",
              subTextGuide: "پان",
              visualScaffold: "🍳 PAN",
              correct: "pan",
            },
          },
          // S2: Warm-Up TAP
          {
            type: "multiple_choice",
            promptText: "گەرمکردنەوە: دەربڕینی TAP",
            distractors: [],
            order: 2,
            solutionData: {
              subtype: "echo_mic",
              instruction: "گەرمکردنەوە (The Echo Mic)",
              targetWord: "tap",
              spokenText: "tap",
              subTextGuide: "تاپ",
              visualScaffold: "🚰 TAP",
              correct: "tap",
            },
          },
          // S3: Frame Refresh "I see a pan"
          {
            type: "multiple_choice",
            promptText: "دووبارەکردنەوەی ڕستەی: I see a pan",
            distractors: [],
            order: 3,
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی دەنگ (The Echo Mic)",
              targetWord: "I see a pan",
              spokenText: "I see a pan",
              subTextGuide: "ئای سیی ئە پان",
              visualScaffold: "🍳 I see a pan",
              correct: "I see a pan",
            },
          },
          // S4: Tier 1 Speed (5s) "I see a tin"
          {
            type: "multiple_choice",
            promptText: "خێرایی ئاستی ١: I see a tin (5 چرکە)",
            distractors: [],
            order: 4,
            solutionData: {
              subtype: "timed_mic",
              instruction: "ئاستی خێرایی ١ (Timed Speaking - 5s)",
              visualCue: "🥫",
              scaffoldText: "I see a tin",
              spokenText: "I see a tin",
              correct: "I see a tin",
              timerSeconds: 5,
            },
          },
          // S5: Tier 1 Speed (5s) "I see an ant"
          {
            type: "multiple_choice",
            promptText: "خێرایی ئاستی ١: I see an ant (5 چرکە)",
            distractors: [],
            order: 5,
            solutionData: {
              subtype: "timed_mic",
              instruction: "ئاستی خێرایی ١ (Timed Speaking - 5s)",
              visualCue: "🐜",
              scaffoldText: "I see an ant",
              spokenText: "I see an ant",
              correct: "I see an ant",
              timerSeconds: 5,
            },
          },
          // S6: Text Fading (5s) "I see a p__"
          {
            type: "multiple_choice",
            promptText: "دەقی کاڵکراوە: I see a p__ (5 چرکە)",
            distractors: [],
            order: 6,
            solutionData: {
              subtype: "timed_mic",
              instruction: "دەقی کاڵکراوە (Timed Speaking - 5s)",
              visualCue: "🧷",
              scaffoldText: "I see a p__",
              spokenText: "I see a pin",
              correct: "I see a pin",
              timerSeconds: 5,
            },
          },
          // S7: Text Fading (5s) "I see a t__"
          {
            type: "multiple_choice",
            promptText: "دەقی کاڵکراوە: I see a t__ (5 چرکە)",
            distractors: [],
            order: 7,
            solutionData: {
              subtype: "timed_mic",
              instruction: "دەقی کاڵکراوە (Timed Speaking - 5s)",
              visualCue: "🚰",
              scaffoldText: "I see a t__",
              spokenText: "I see a tap",
              correct: "I see a tap",
              timerSeconds: 5,
            },
          },
          // S8: Tier 2 Speed (3s) "pan"
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بەبێ دەق بڵێ (3 چرکە)",
            distractors: [],
            order: 8,
            solutionData: {
              subtype: "timed_mic",
              instruction: "ئاستی خێرایی ٢ (Timed Speaking - 3s)",
              visualCue: "🍳",
              scaffoldText: "...",
              spokenText: "pan",
              correct: "pan",
              timerSeconds: 3,
            },
          },
          // S9: Tier 2 Speed (3s) "tin"
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بەبێ دەق بڵێ (3 چرکە)",
            distractors: [],
            order: 9,
            solutionData: {
              subtype: "timed_mic",
              instruction: "ئاستی خێرایی ٢ (Timed Speaking - 3s)",
              visualCue: "🥫",
              scaffoldText: "...",
              spokenText: "tin",
              correct: "tin",
              timerSeconds: 3,
            },
          },
          // S10: Tier 2 Speed (3s) "ant"
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بەبێ دەق بڵێ (3 چرکە)",
            distractors: [],
            order: 10,
            solutionData: {
              subtype: "timed_mic",
              instruction: "ئاستی خێرایی ٢ (Timed Speaking - 3s)",
              visualCue: "🐜",
              scaffoldText: "...",
              spokenText: "ant",
              correct: "ant",
              timerSeconds: 3,
            },
          },
          // S11: Full Frame Sprint (4s) "I see a tap"
          {
            type: "multiple_choice",
            promptText: "ڕستەی تەواو بڵێ (4 چرکە)",
            distractors: [],
            order: 11,
            solutionData: {
              subtype: "timed_mic",
              instruction: "سپرینتی ڕستەی تەواو (Timed Speaking - 4s)",
              visualCue: "🚰",
              scaffoldText: "I see a [ ... ]",
              spokenText: "I see a tap",
              correct: "I see a tap",
              timerSeconds: 4,
            },
          },
          // S12: Cap Sprint (3s) "I see a pin"
          {
            type: "multiple_choice",
            promptText: "سپرینتی کۆتایی (3 چرکە): I see a pin",
            distractors: [],
            order: 12,
            solutionData: {
              subtype: "timed_mic",
              instruction: "سپرینتی کۆتایی (Timed Speaking - 3s)",
              visualCue: "🧷",
              scaffoldText: "...",
              spokenText: "I see a pin",
              correct: "I see a pin",
              timerSeconds: 3,
            },
          },
        ],
      },

      // =======================================================================
      // LESSON 1.6: Checkpoint 1 (The Gate)
      // =======================================================================
      {
        title: "1.6 Checkpoint 1: The Gate (دەروازەی پشکنین)",
        order: 6,
        xpReward: 30,
        exercises: [
          // S1: Unseen Blend SIT
          {
            type: "multiple_choice",
            promptText: "پیتەکان ڕێکبخە بۆ وشەی نوێ: SIT",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "وشەی نوێ پێکبهێنە (Tile Assembly)",
              visualCue: "🪑 SIT",
              tiles: ["S", "I", "T", "P"],
              correctOrder: ["S", "I", "T"],
              correct: "completed",
            },
          },
          // S2: Rapid Acoustic Gate (3 rounds)
          {
            type: "multiple_choice",
            promptText: "پشکنینی خێرای بیستن (3 جار)",
            distractors: [],
            order: 2,
            solutionData: {
              subtype: "speed_ear_gate",
              instruction: "دەروازەی بیستنی خێرا (Speed Ear Gate)",
              rounds: [
                { audio: "pan", display: "🍳 pan", correct: true },
                { audio: "pin", display: "🥫 tin", correct: false },
                { audio: "ant", display: "🐜 ant", correct: true },
              ],
              timerSeconds: 3,
              passMark: 2,
              correct: "completed",
            },
          },
          // S3: Reverse Translation "تاوەیەک دەبینم" -> "I see a pan"
          {
            type: "multiple_choice",
            promptText: "وەرگێڕانی پێچەوانە: تاوەیەک دەبینم",
            distractors: [],
            order: 3,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "وەرگێڕان بۆ ئینگلیزی (Tile Assembly)",
              visualCue: "🍳 تاوەیەک دەبینم",
              tiles: ["pan.", "I", "see", "a", "pin."],
              correctOrder: ["I", "see", "a", "pan."],
              correct: "completed",
            },
          },
          // S4: Trap Discrimination Audio "tin" -> TIN
          {
            type: "multiple_choice",
            promptText: "کام وێنەیەت بیست؟",
            distractors: ["🧷 PIN", "🍳 PAN"],
            order: 4,
            solutionData: {
              subtype: "audio_choice",
              instruction: "تەڵەی ناسینەوە (Audio Choice)",
              question: "کام وشەت بیست؟",
              audioText: "tin",
              options: ["🥫 TIN", "🧷 PIN", "🍳 PAN"],
              correct: "🥫 TIN",
            },
          },
          // S5: SVO Construction "I see a tap"
          {
            type: "multiple_choice",
            promptText: "ڕستەکە دروست بکە: I see a tap.",
            distractors: [],
            order: 5,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "دروستکردنی ڕستە (Tile Assembly)",
              visualCue: "🚰 I see a tap.",
              tiles: ["tap.", "I", "a", "see"],
              correctOrder: ["I", "see", "a", "tap."],
              correct: "completed",
            },
          },
          // S6: Acoustic Minimal Pair Gate "sat"
          {
            type: "multiple_choice",
            promptText: "کام دەنگت بیست؟ SAT یان SIT؟",
            distractors: ["SIT"],
            order: 6,
            solutionData: {
              subtype: "speed_trap",
              instruction: "پشکنینی جووتە دەنگ (Speed Discrimination)",
              question: "SAT یان SIT؟",
              audioText: "sat",
              options: ["SIT", "SAT"],
              correct: "SAT",
              timerSeconds: 4,
            },
          },
          // S7: Production Sprint 1 "tin" (3s)
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بە خێرایی بڵێ (3 چرکە)",
            distractors: [],
            order: 7,
            solutionData: {
              subtype: "timed_mic",
              instruction: "سپرینتی دەربڕین (Timed Speaking)",
              visualCue: "🥫",
              scaffoldText: "tin",
              spokenText: "tin",
              correct: "tin",
              timerSeconds: 3,
            },
          },
          // S8: Production Sprint 2 "tap" (3s)
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بە خێرایی بڵێ (3 چرکە)",
            distractors: [],
            order: 8,
            solutionData: {
              subtype: "timed_mic",
              instruction: "سپرینتی دەربڕین (Timed Speaking)",
              visualCue: "🚰",
              scaffoldText: "tap",
              spokenText: "tap",
              correct: "tap",
              timerSeconds: 3,
            },
          },
          // S9: Full Sentence Gate "I see an ant" (3s)
          {
            type: "multiple_choice",
            promptText: "ڕستەی تەواوی وێنەکە بڵێ (3 چرکە)",
            distractors: [],
            order: 9,
            solutionData: {
              subtype: "timed_mic",
              instruction: "دەروازەی ڕستەی تەواو (Timed Speaking)",
              visualCue: "🐜",
              scaffoldText: "I see an ant",
              spokenText: "I see an ant",
              correct: "I see an ant",
              timerSeconds: 3,
            },
          },
          // S10: Full Sentence Gate "I see a pin" (3s)
          {
            type: "multiple_choice",
            promptText: "ڕستەی تەواوی وێنەکە بڵێ (3 چرکە)",
            distractors: [],
            order: 10,
            solutionData: {
              subtype: "timed_mic",
              instruction: "دەروازەی ڕستەی تەواو (Timed Speaking)",
              visualCue: "🧷",
              scaffoldText: "I see a pin",
              spokenText: "I see a pin",
              correct: "I see a pin",
              timerSeconds: 3,
            },
          },
          // S11: Cloze Synthesis "I see [ ___ ] pan."
          {
            type: "multiple_choice",
            promptText: "بۆشاییەکە پڕبکەرەوە: I see [ ___ ] pan.",
            distractors: ["an", "in"],
            order: 11,
            solutionData: {
              subtype: "slot_filler",
              instruction: "پڕکردنەوەی پەیڤ (Slot & Filler)",
              frameText: "I see [ ___ ] pan.",
              visualCue: "🍳",
              correctWord: "a",
              options: ["a", "an", "in"],
              correct: "a",
            },
          },
          // S12: Boss Scorecard (Template 23)
          {
            type: "multiple_choice",
            promptText: "دەرەنجامی Checkpoint 1 (The Gate)",
            distractors: [],
            order: 12,
            solutionData: {
              subtype: "boss_score_card",
              instruction: "دەروازەی پشکنینی ئاستی یەکەم (Level 1 Passed!)",
              title: "ئاستی ١ تەواو بوو! پیرۆزە!",
              grade: "A+",
              stats: [
                { label: "دەنگسازی (Phonics)", value: "100%" },
                { label: "جیاکردنەوەی بیستن (Ear Discrimination)", value: "100%" },
                { label: "ڕستەسازی (SVO Frame)", value: "100%" },
                { label: "دەربڕینی دەنگی (Vocal Speed)", value: "< 3s" },
              ],
              correct: "completed",
            },
          },
        ],
      },
    ],
  },
];

export async function runFoundationsSeed() {
  console.log("=== Seeding English Foundations & Phonics Course (ئینگلیزی لە سفرەوە) ===");

  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL || "https://qualified-egret-206.convex.cloud";
  const adminSecret = process.env.ADMIN_SEED_SECRET || "ferbe-secret-2026";

  const totalExercises = FOUNDATIONS_UNITS.reduce(
    (acc, u) => acc + u.lessons.reduce((lAcc, l) => lAcc + l.exercises.length, 0),
    0
  );
  const totalLessons = FOUNDATIONS_UNITS.reduce((acc, u) => acc + u.lessons.length, 0);

  console.log(
    `Prepared ${FOUNDATIONS_UNITS.length} units, ${totalLessons} lessons, and ${totalExercises} interactive exercises.`
  );

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log(`Connecting to Convex at: ${convexUrl}...`);
    const result = await client.mutation(api.admin.seedCurriculum, {
      adminSecret,
      course: COURSE,
      units: FOUNDATIONS_UNITS,
      deleteOtherCourses: false, // Keep existing courses safe
    });

    console.log("\nCourse successfully seeded!");
    console.log(`- Course slug: ${result.courseSlug}`);
    console.log(`- Lessons upserted: ${result.lessonsUpserted}`);
    console.log(`- Exercises written: ${result.exercisesWritten}`);
    return result;
  } catch (err) {
    console.error("Failed to seed Foundations course:", err);
    throw err;
  }
}

// Execute if called directly via CLI
if (typeof require !== "undefined" && require.main === module) {
  runFoundationsSeed().catch(() => process.env.NODE_ENV !== "test" && process.exit(1));
} else if (process.argv[1]?.includes("seed-english-foundations")) {
  runFoundationsSeed().catch(() => process.env.NODE_ENV !== "test" && process.exit(1));
}
