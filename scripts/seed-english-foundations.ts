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
          // S1: Visual Anchor S
          {
            type: "multiple_choice",
            promptText: "پێناسەی دەنگ: پیتی S",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "word_anchors",
              instruction: "پێناسەی دەنگ (Sound Anchor)",
              correct: "completed",
              words: [
                {
                  english: "S",
                  pronunciationKurdish: "/s/",
                  kurdish: "دەنگی /s/ وەکو دەنگی مار سسس — کلیک لە دەنگ بکە پاشان پیتەکە دابگرە",
                  audio: "s",
                },
              ],
            },
          },
          // S2: Visual Anchor A
          {
            type: "multiple_choice",
            promptText: "پێناسەی دەنگ: پیتی A",
            distractors: [],
            order: 2,
            solutionData: {
              subtype: "word_anchors",
              instruction: "پێناسەی دەنگ (Sound Anchor)",
              correct: "completed",
              words: [
                {
                  english: "A",
                  pronunciationKurdish: "/æ/",
                  kurdish: "دەنگی کورتی /æ/ وەکو لە (at, ant) — دەم کەمێک دەکرێتەوە",
                  audio: "a",
                },
              ],
            },
          },
          // S3: Visual Anchor T
          {
            type: "multiple_choice",
            promptText: "پێناسەی دەنگ: پیتی T",
            distractors: [],
            order: 3,
            solutionData: {
              subtype: "word_anchors",
              instruction: "پێناسەی دەنگ (Sound Anchor)",
              correct: "completed",
              words: [
                {
                  english: "T",
                  pronunciationKurdish: "/t/",
                  kurdish: "دەنگی پاکی /t/ بەبێ زیادکردنی دەنگی تر (unvoiced)",
                  audio: "t",
                },
              ],
            },
          },
          // S4: Tactile Blending A + T -> AT
          {
            type: "multiple_choice",
            promptText: "پیتەکان بلکێنە بۆ دروستکردنی دەنگی AT",
            distractors: [],
            order: 4,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "پیتەکان بلکێنە (Tactile Blending)",
              visualCue: "🔤 /æ/ + /t/ = at",
              tiles: ["A", "T"],
              correctOrder: ["A", "T"],
              correct: "completed",
            },
          },
          // S5: Output Rehearsal Speak AT
          {
            type: "multiple_choice",
            promptText: "دەربڕینی وشەی AT لە مایکرۆفۆن",
            distractors: [],
            order: 5,
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی دەربڕین (Rehearsal Speak)",
              kurdishPrompt: "گوێ لە دەنگ بگرە و وشەی AT بڵێ",
              targetWord: "at",
              spokenText: "at",
              promptAudio: "at",
              correct: "completed",
            },
          },
          // S6: Visual Anchor P
          {
            type: "multiple_choice",
            promptText: "پێناسەی دەنگ: پیتی P (تەقینی هەوا)",
            distractors: [],
            order: 6,
            solutionData: {
              subtype: "word_anchors",
              instruction: "پێناسەی دەنگ (Aspirated /p/)",
              correct: "completed",
              words: [
                {
                  english: "P",
                  pronunciationKurdish: "/p/",
                  kurdish: "دەنگی هەوایی /p/ — لێوەکان دەپەستێنرێن و هەوا دەتەقێتە دەرەوە نەک /b/",
                  audio: "p",
                },
              ],
            },
          },
          // S7: Minimal Trap P vs T
          {
            type: "multiple_choice",
            promptText: "کام دەنگت بیست؟ P یان T؟",
            distractors: ["T"],
            order: 7,
            solutionData: {
              subtype: "speed_trap",
              instruction: "تەڵەی دەنگ (Minimal Trap)",
              question: "کام دەنگت بیست؟ (P vs T)",
              audioText: "p",
              options: ["P", "T"],
              correct: "P",
              timerSeconds: 6,
            },
          },
          // S8: Visual Anchor I and N -> IN
          {
            type: "multiple_choice",
            promptText: "پێناسەی دەنگ: پیتەکانی I و N",
            distractors: [],
            order: 8,
            solutionData: {
              subtype: "word_anchors",
              instruction: "دەنگەکانی I و N (IN /ɪn/)",
              correct: "completed",
              words: [
                {
                  english: "I",
                  pronunciationKurdish: "/ɪ/",
                  kurdish: "دەنگی کورتی /ɪ/ وەک لە pin",
                  audio: "i",
                },
                {
                  english: "N",
                  pronunciationKurdish: "/n/",
                  kurdish: "دەنگی لووت /n/ وەک لە in",
                  audio: "n",
                },
              ],
            },
          },
          // S9: Word Assembly PAN
          {
            type: "multiple_choice",
            promptText: "پیتەکان ڕێکبخە بۆ وشەی PAN",
            distractors: [],
            order: 9,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "دروستکردنی وشەی PAN (Frying Pan)",
              visualCue: "🍳 PAN",
              tiles: ["P", "A", "N", "S", "T"],
              correctOrder: ["P", "A", "N"],
              correct: "completed",
            },
          },
          // S10: Word Assembly PIN
          {
            type: "multiple_choice",
            promptText: "پیتەکان ڕێکبخە بۆ وشەی PIN",
            distractors: [],
            order: 10,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "دروستکردنی وشەی PIN (Sewing Pin)",
              visualCue: "🧷 PIN",
              tiles: ["P", "I", "N", "A", "T"],
              correctOrder: ["P", "I", "N"],
              correct: "completed",
            },
          },
          // S11: Ear Check Blind Discrimination PAN vs PIN
          {
            type: "multiple_choice",
            promptText: "گوێ بگرە: PAN یان PIN؟",
            distractors: ["PAN"],
            order: 11,
            solutionData: {
              subtype: "speed_trap",
              instruction: "جیاکردنەوەی کوێرانە (Blind Discrimination)",
              question: "کام وشەت بیست؟ (/æ/ vs /ɪ/)",
              audioText: "pin",
              options: ["PAN", "PIN"],
              correct: "PIN",
              timerSeconds: 5,
            },
          },
          // S12: Production Graded Vocal Read TAP
          {
            type: "multiple_choice",
            promptText: "خوێندنەوەی دەنگی TAP بەبێ گوێگرتن",
            distractors: [],
            order: 12,
            solutionData: {
              subtype: "timed_mic",
              instruction: "خوێندنەوەی دەنگی خێرا (Cold Read)",
              visualCue: "🚰 TAP",
              scaffoldText: "TAP",
              spokenText: "tap",
              correct: "tap",
              timerSeconds: 3,
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
          // S1: Anchor Introduce PAN
          {
            type: "multiple_choice",
            promptText: "ناساندنی وشە: PAN",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "word_anchors",
              instruction: "ناساندنی وشە (Lexical Anchor)",
              correct: "completed",
              words: [
                {
                  english: "PAN",
                  kurdish: "تاوەی سوورکردنەوە 🍳",
                  pronunciationKurdish: "پان",
                  audio: "pan",
                },
              ],
            },
          },
          // S2: Anchor Introduce ANT
          {
            type: "multiple_choice",
            promptText: "ناساندنی وشە: ANT",
            distractors: [],
            order: 2,
            solutionData: {
              subtype: "word_anchors",
              instruction: "ناساندنی وشە (Lexical Anchor)",
              correct: "completed",
              words: [
                {
                  english: "ANT",
                  kurdish: "مێروولە 🐜",
                  pronunciationKurdish: "ئانت",
                  audio: "ant",
                },
              ],
            },
          },
          // S3: Visual Match PAN vs ANT
          {
            type: "multiple_choice",
            promptText: "کام وێنەیە PANە؟",
            distractors: ["🐜 ANT"],
            order: 3,
            solutionData: {
              subtype: "audio_choice",
              instruction: "هاوتاکردنی وێنە (Visual Match)",
              question: "کام وێنەیە PANە؟",
              audioText: "pan",
              options: ["🍳 PAN", "🐜 ANT"],
              correct: "🍳 PAN",
            },
          },
          // S4: Anchor Introduce TIN
          {
            type: "multiple_choice",
            promptText: "ناساندنی وشە: TIN",
            distractors: [],
            order: 4,
            solutionData: {
              subtype: "word_anchors",
              instruction: "ناساندنی وشە (Lexical Anchor)",
              correct: "completed",
              words: [
                {
                  english: "TIN",
                  kurdish: "قوتووی تەنەکە 🥫",
                  pronunciationKurdish: "تین",
                  audio: "tin",
                },
              ],
            },
          },
          // S5: Anchor Introduce PIN
          {
            type: "multiple_choice",
            promptText: "ناساندنی وشە: PIN",
            distractors: [],
            order: 5,
            solutionData: {
              subtype: "word_anchors",
              instruction: "ناساندنی وشە (Lexical Anchor)",
              correct: "completed",
              words: [
                {
                  english: "PIN",
                  kurdish: "دەرزی جلوبەرگ 🧷",
                  pronunciationKurdish: "پین",
                  audio: "pin",
                },
              ],
            },
          },
          // S6: Trap Discrimination PIN vs TIN
          {
            type: "multiple_choice",
            promptText: "کام وێنەیە TINە؟ (5 چرکە)",
            distractors: ["🧷 PIN"],
            order: 6,
            solutionData: {
              subtype: "speed_trap",
              instruction: "تەڵەی جیاکردنەوە (Trap Discrimination)",
              question: "کام وێنەیە TINە؟",
              audioText: "tin",
              options: ["🥫 TIN", "🧷 PIN"],
              correct: "🥫 TIN",
              timerSeconds: 5,
            },
          },
          // S7: Anchor Introduce TAP
          {
            type: "multiple_choice",
            promptText: "ناساندنی وشە: TAP",
            distractors: [],
            order: 7,
            solutionData: {
              subtype: "word_anchors",
              instruction: "ناساندنی وشە (Lexical Anchor)",
              correct: "completed",
              words: [
                {
                  english: "TAP",
                  kurdish: "حەنەفیەی ئاو 🚰",
                  pronunciationKurdish: "تاپ",
                  audio: "tap",
                },
              ],
            },
          },
          // S8: Tile Spelling TAP
          {
            type: "multiple_choice",
            promptText: "وشەی TAP دروست بکە",
            distractors: [],
            order: 8,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "ڕێنووسی وشەی TAP",
              visualCue: "🚰 TAP",
              tiles: ["T", "A", "P"],
              correctOrder: ["T", "A", "P"],
              correct: "completed",
            },
          },
          // S9: 4-Way Image Matrix ANT
          {
            type: "multiple_choice",
            promptText: "کامەیە ANT؟",
            distractors: ["🍳 PAN", "🥫 TIN", "🚰 TAP"],
            order: 9,
            solutionData: {
              subtype: "audio_choice",
              instruction: "ماتریسی چوار وێنەیی (4-Way Matrix)",
              question: "دەنگی کام وێنەیە بیستت؟",
              audioText: "ant",
              options: ["🍳 PAN", "🐜 ANT", "🥫 TIN", "🚰 TAP"],
              correct: "🐜 ANT",
            },
          },
          // S10: Blind Listen PIN
          {
            type: "multiple_choice",
            promptText: "کام وشەت بیست؟",
            distractors: ["PAN", "TIN"],
            order: 10,
            solutionData: {
              subtype: "audio_choice",
              instruction: "گوێگرتنی کوێرانە (Blind Listen)",
              question: "کام وشەت بیست؟",
              audioText: "pin",
              options: ["PAN", "PIN", "TIN"],
              correct: "PIN",
            },
          },
          // S11: Vocal Rehearsal TIN
          {
            type: "multiple_choice",
            promptText: "دەربڕینی وشەی TIN لە مایکرۆفۆن",
            distractors: [],
            order: 11,
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی دەنگ (Vocal Rehearsal)",
              kurdishPrompt: "گوێ لە دەنگ بگرە و وشەی TIN بڵێ",
              targetWord: "tin",
              spokenText: "tin",
              promptAudio: "tin",
              visualCue: "🥫 TIN",
              correct: "completed",
            },
          },
          // S12: Graded Vocal Production PAN
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بە ئینگلیزی بڵێ (3 چرکە)",
            distractors: [],
            order: 12,
            solutionData: {
              subtype: "timed_mic",
              instruction: "تەواوکردنی دەنگی بەبێ نووسین (Graded Vocal)",
              visualCue: "🍳",
              scaffoldText: "...",
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
          // S1: Frame Deconstruction
          {
            type: "multiple_choice",
            promptText: "داڕشتەی ڕستە: I see a pan.",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "word_anchors",
              instruction: "داڕشتەی ڕستەی ئینگلیزی (SVO Frame)",
              correct: "completed",
              words: [
                {
                  english: "I see a pan.",
                  kurdish: "من تاوەیەک دەبینم (Subject + Verb + Object)",
                  pronunciationKurdish: "ئای سیی ئە پان",
                  audio: "I see a pan",
                },
              ],
            },
          },
          // S2: Tile Isolation [ I ], [ see ], [ a ]
          {
            type: "multiple_choice",
            promptText: "بەشەکانی ڕستە: I + see + a",
            distractors: [],
            order: 2,
            solutionData: {
              subtype: "word_anchors",
              instruction: "لێکۆڵینەوە لە پەیڤەکان (Tile Isolation)",
              correct: "completed",
              words: [
                { english: "I", kurdish: "من (Subject)", audio: "I" },
                { english: "see", kurdish: "دەبینم (Verb)", audio: "see" },
                { english: "a", kurdish: "یەک (نادیار /ə/)", audio: "a" },
              ],
            },
          },
          // S3: Slot & Filler 1
          {
            type: "multiple_choice",
            promptText: "بۆشاییەکە پڕبکەرەوە: I see an [ ___ ]",
            distractors: ["pan", "tin"],
            order: 3,
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
          // S4: Order Enforcement SVO
          {
            type: "multiple_choice",
            promptText: "ڕستەکە بەپێی ڕێزمانی ئینگلیزی ڕێکبخە",
            distractors: [],
            order: 4,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "ڕێکخستنی SVO (Subject-Verb-Object)",
              visualCue: "🥫 I see a tin.",
              tiles: ["a", "I", "see", "tin"],
              correctOrder: ["I", "see", "a", "tin"],
              correct: "completed",
            },
          },
          // S5: Receptive Audio Check
          {
            type: "multiple_choice",
            promptText: "واتای کام ڕستەیەت بیست؟",
            distractors: ["🍳 I see a pan", "🧷 I see a pin"],
            order: 5,
            solutionData: {
              subtype: "audio_choice",
              instruction: "پشکنینی بیستن (Receptive Audio Check)",
              question: "واتای کام ڕستەیەت بیست؟",
              audioText: "I see a tap",
              options: ["🚰 I see a tap", "🍳 I see a pan", "🧷 I see a pin"],
              correct: "🚰 I see a tap",
            },
          },
          // S6: Slot & Filler 2
          {
            type: "multiple_choice",
            promptText: "بۆشاییەکە پڕبکەرەوە: I see a [ ___ ]",
            distractors: ["tap", "ant"],
            order: 6,
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
          // S7: Negative Distractor True / False
          {
            type: "multiple_choice",
            promptText: "ئایا دەنگەکە و وێنەکە یەکدەگرنەوە؟",
            distractors: [],
            order: 7,
            solutionData: {
              subtype: "speed_ear_gate",
              instruction: "جیاکردنەوەی ڕاست / هەڵە (True/False Gate)",
              rounds: [{ audio: "I see a pin", display: "🍳 (Pan)", correct: false }],
              timerSeconds: 4,
              passMark: 1,
              correct: "completed",
            },
          },
          // S8: Rehearsal Repetition
          {
            type: "multiple_choice",
            promptText: "دووبارەکردنەوەی ڕستەی تەواو: I see a pan",
            distractors: [],
            order: 8,
            solutionData: {
              subtype: "echo_mic",
              instruction: "دووبارەکردنەوەی دەنگ (Rehearsal Repetition)",
              kurdishPrompt: "گوێ لە دەنگ بگرە و ڕستەکە بڵێ",
              targetWord: "I see a pan",
              spokenText: "I see a pan",
              promptAudio: "I see a pan",
              visualCue: "🍳 I see a pan",
              correct: "completed",
            },
          },
          // S9: Timed Sentence Rebuild (6s)
          {
            type: "multiple_choice",
            promptText: "ڕستەکە بە خێرایی ڕێکبخە (6 چرکە)",
            distractors: [],
            order: 9,
            solutionData: {
              subtype: "tile_assembly",
              instruction: "ڕێکخستنی خێرای ڕستە (Timed Rebuild)",
              visualCue: "🍳 I see a pan",
              tiles: ["see", "I", "a", "pan"],
              correctOrder: ["I", "see", "a", "pan"],
              timerSeconds: 6,
              correct: "completed",
            },
          },
          // S10: Ear-to-Text Mapping
          {
            type: "multiple_choice",
            promptText: "کام ڕستەت بیست؟",
            distractors: ["I see a pin"],
            order: 10,
            solutionData: {
              subtype: "audio_choice",
              instruction: "هاوتاکردنی دەنگ و دەق (Ear-to-Text)",
              question: "کام ڕستەت بیست؟",
              audioText: "I see a tin",
              options: ["I see a pin", "I see a tin"],
              correct: "I see a tin",
            },
          },
          // S11: Vocal Ramp 1 (5s)
          {
            type: "multiple_choice",
            promptText: "ڕستەکە لە مایکرۆفۆن بخوێنەرەوە (5 چرکە)",
            distractors: [],
            order: 11,
            solutionData: {
              subtype: "timed_mic",
              instruction: "ڕاهێنانی خێرایی (Vocal Ramp 1)",
              visualCue: "🚰 I see a tap",
              scaffoldText: "I see a tap",
              spokenText: "I see a tap",
              correct: "I see a tap",
              timerSeconds: 5,
            },
          },
          // S12: Cold Vocal Production (3s)
          {
            type: "multiple_choice",
            promptText: "بەبێ دەق، ڕستەکە بڵێ (3 چرکە)",
            distractors: [],
            order: 12,
            solutionData: {
              subtype: "timed_mic",
              instruction: "بەرهەمهێنانی دەنگی سەربەخۆ (Cold Vocal)",
              visualCue: "🐜",
              scaffoldText: "[ ? ] [ ? ] [ ? ] [ ? ]",
              spokenText: "I see an ant",
              correct: "I see an ant",
              timerSeconds: 3,
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
          // S1: Acoustic Calibration
          {
            type: "multiple_choice",
            promptText: "جیاوازی دەنگی نێوان PAN و PIN",
            distractors: [],
            order: 1,
            solutionData: {
              subtype: "acoustic_match",
              instruction: "جیاوازی دەنگەکان (Acoustic Calibration)",
              target1: "pan",
              target2: "pin",
              label1: "/æ/ (pan 🍳)",
              label2: "/ɪ/ (pin 🧷)",
              correct: "completed",
            },
          },
          // S2: Audio Discrimination 1
          {
            type: "multiple_choice",
            promptText: "کام دەنگەت بیست؟",
            distractors: ["I (/ɪ/)"],
            order: 2,
            solutionData: {
              subtype: "audio_choice",
              instruction: "ناسینەوەی دەنگ (Audio Discrimination)",
              question: "کام دەنگت بیست؟",
              audioText: "pan",
              options: ["A (/æ/ - pan)", "I (/ɪ/ - pin)"],
              correct: "A (/æ/ - pan)",
            },
          },
          // S3: Audio Discrimination 2
          {
            type: "multiple_choice",
            promptText: "کام دەنگەت بیست؟",
            distractors: ["A (/æ/)"],
            order: 3,
            solutionData: {
              subtype: "audio_choice",
              instruction: "ناسینەوەی دەنگ (Audio Discrimination)",
              question: "کام دەنگت بیست؟",
              audioText: "pin",
              options: ["A (/æ/ - pan)", "I (/ɪ/ - pin)"],
              correct: "I (/ɪ/ - pin)",
            },
          },
          // S4: Pair Sorting PAT
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
          // S5: Pair Sorting PIT
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
          // S6: Speed Decision TAN or TIN (4s)
          {
            type: "multiple_choice",
            promptText: "TAN یان TIN؟ (4 چرکە)",
            distractors: ["TAN"],
            order: 6,
            solutionData: {
              subtype: "speed_trap",
              instruction: "بڕیاردانی خێرا (Speed Decision)",
              question: "کام وشەت بیست؟",
              audioText: "tin",
              options: ["TAN", "TIN"],
              correct: "TIN",
              timerSeconds: 4,
            },
          },
          // S7: Connected Speech 1
          {
            type: "multiple_choice",
            promptText: "کام وێنەیەت بیست؟",
            distractors: ["🧷 PIN"],
            order: 7,
            solutionData: {
              subtype: "audio_choice",
              instruction: "دەنگی بەستراوە (Connected Speech)",
              question: "گوێ بگرە: کام وێنەیە؟",
              audioText: "I see a pan",
              options: ["🍳 PAN", "🧷 PIN"],
              correct: "🍳 PAN",
            },
          },
          // S8: Connected Speech 2
          {
            type: "multiple_choice",
            promptText: "کام وێنەیەت بیست؟",
            distractors: ["🔟 TEN"],
            order: 8,
            solutionData: {
              subtype: "audio_choice",
              instruction: "دەنگی بەستراوە (Connected Speech)",
              question: "گوێ بگرە: کام وێنەیە؟",
              audioText: "I see a tin",
              options: ["🥫 TIN", "🔟 TEN"],
              correct: "🥫 TIN",
            },
          },
          // S9: Rapid Identification SAT (4s)
          {
            type: "multiple_choice",
            promptText: "SIT یان SAT؟ (4 چرکە)",
            distractors: ["SIT"],
            order: 9,
            solutionData: {
              subtype: "speed_trap",
              instruction: "ناسینەوەی خێرا (Rapid Identification)",
              question: "کام وشەیە؟",
              audioText: "sat",
              options: ["SIT", "SAT"],
              correct: "SAT",
              timerSeconds: 4,
            },
          },
          // S10: Rapid Identification TIP (4s)
          {
            type: "multiple_choice",
            promptText: "TAP یان TIP؟ (4 چرکە)",
            distractors: ["TAP"],
            order: 10,
            solutionData: {
              subtype: "speed_trap",
              instruction: "ناسینەوەی خێرا (Rapid Identification)",
              question: "کام وشەیە؟",
              audioText: "tip",
              options: ["TAP", "TIP"],
              correct: "TIP",
              timerSeconds: 4,
            },
          },
          // S11: Echo Rehearsal PAN
          {
            type: "multiple_choice",
            promptText: "دەربڕینی وشەی PAN لە مایکرۆفۆن",
            distractors: [],
            order: 11,
            solutionData: {
              subtype: "echo_mic",
              instruction: "دەربڕینی دەنگ (Echo Rehearsal)",
              kurdishPrompt: "گوێ بگرە و بە دەنگی بەرز بڵێ PAN",
              targetWord: "pan",
              spokenText: "pan",
              promptAudio: "pan",
              visualCue: "🍳 PAN",
              correct: "completed",
            },
          },
          // S12: Vocal Discrimination PIN (3s)
          {
            type: "multiple_choice",
            promptText: "ناوی وێنەکە بڵێ (دڵنیابە PINە نەک PAN)",
            distractors: [],
            order: 12,
            solutionData: {
              subtype: "timed_mic",
              instruction: "جیاکردنەوەی دەربڕین (Vocal Discrimination)",
              visualCue: "🧷 PIN",
              scaffoldText: "PIN (not PAN)",
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
              instruction: "گەرمکردنەوە (Warm-Up Model)",
              targetWord: "pan",
              spokenText: "pan",
              promptAudio: "pan",
              visualCue: "🍳 PAN",
              correct: "completed",
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
              instruction: "گەرمکردنەوە (Warm-Up Model)",
              targetWord: "tap",
              spokenText: "tap",
              promptAudio: "tap",
              visualCue: "🚰 TAP",
              correct: "completed",
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
              instruction: "ڕاهێنانی نەرمی دەنگ (Frame Refresh)",
              targetWord: "I see a pan",
              spokenText: "I see a pan",
              promptAudio: "I see a pan",
              visualCue: "🍳 I see a pan",
              correct: "completed",
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
              instruction: "ئاستی خێرایی ١ (Tier 1 Speed - 5s)",
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
              instruction: "ئاستی خێرایی ١ (Tier 1 Speed - 5s)",
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
              instruction: "دەقی کاڵکراوە (Text Fading - 5s)",
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
              instruction: "دەقی کاڵکراوە (Text Fading - 5s)",
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
              instruction: "ئاستی خێرایی ٢ (Tier 2 Speed - 3s)",
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
              instruction: "ئاستی خێرایی ٢ (Tier 2 Speed - 3s)",
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
              instruction: "ئاستی خێرایی ٢ (Tier 2 Speed - 3s)",
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
              instruction: "سپرینتی ڕستەی تەواو (Full Frame Sprint - 4s)",
              visualCue: "🚰",
              scaffoldText: "[ ڕستەی تەواو بڵێ ]",
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
              instruction: "سپرینتی کۆتایی (Cap Sprint - 3s)",
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
              instruction: "وشەی نوێ پێکبهێنە (Unseen Blend)",
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
              instruction: "دەروازەی بیستنی خێرا (Rapid Acoustic Gate)",
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
              instruction: "وەرگێڕان بۆ ئینگلیزی (Reverse Translation)",
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
              instruction: "تەڵەی ناسینەوە (Trap Discrimination)",
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
              instruction: "دروستکردنی ڕستە (SVO Construction)",
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
              instruction: "پشکنینی جووتە دەنگ (Minimal Pair Gate)",
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
              instruction: "سپرینتی دەربڕین (Production Sprint 1)",
              visualCue: "🥫",
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
              instruction: "سپرینتی دەربڕین (Production Sprint 2)",
              visualCue: "🚰",
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
              instruction: "دەروازەی ڕستەی تەواو (Full Sentence Gate)",
              visualCue: "🐜",
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
              instruction: "دەروازەی ڕستەی تەواو (Full Sentence Gate)",
              visualCue: "🧷",
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
              instruction: "پڕکردنەوەی پەیڤ (Cloze Synthesis)",
              frameText: "I see [ ___ ] pan.",
              visualCue: "🍳",
              correctWord: "a",
              options: ["a", "an", "in"],
              correct: "a",
            },
          },
          // S12: Boss Scorecard
          {
            type: "multiple_choice",
            promptText: "دەرەنجامی Checkpoint 1 (The Gate)",
            distractors: [],
            order: 12,
            solutionData: {
              subtype: "boss_scorecard",
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
