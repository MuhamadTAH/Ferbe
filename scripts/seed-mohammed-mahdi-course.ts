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
  title: "Mohammed Mahdi English Course (ئینگلیزی لەگەڵ محەمەد مەهدی)",
  slug: "mohammed-mahdi-english",
  sourceLanguage: "ckb",
  targetLanguage: "en",
};

export const MOHAMMED_MAHDI_UNITS: UnitInput[] = [
  // =========================================================================
  // LEVEL 1 / UNIT 1: Conversational Fundamentals & The Social Ping-Pong
  // =========================================================================
  {
    title: "Level 1: Conversational Fundamentals (ئاستی ١: بنەماکانی گفتوگۆ)",
    order: 1,
    lessons: [
      // -----------------------------------------------------------------------
      // LESSON 1.1: The Opening Ping-Pong (10 Screens)
      // -----------------------------------------------------------------------
      {
        title: "1.1 The Opening Ping-Pong (سڵاوکردن و هەواڵپرسین)",
        order: 1,
        xpReward: 15,
        exercises: [
          // Screen 1: Word Anchors (Greetings) - 3 stacked word cards
          {
            type: "multiple_choice",
            promptText: "سڵاوکردن لە زمانی ئینگلیزیدا",
            distractors: [],
            solutionData: {
              subtype: "word_anchors",
              instruction: "پێناسەی وشە (Word Anchors)",
              correct: "completed",
              words: [
                {
                  english: "Hello",
                  pronunciationKurdish: "هێڵۆو",
                  meaningKurdish: "سڵاو",
                  note: "فەرمی و باو",
                },
                {
                  english: "Hi",
                  pronunciationKurdish: "های",
                  meaningKurdish: "سڵاو",
                  note: "دۆستانە",
                },
                {
                  english: "Hey",
                  pronunciationKurdish: "هێی",
                  meaningKurdish: "سڵاو",
                  note: "نافەرمی",
                },
              ],
            },
            order: 1,
          },
          // Screen 2: Acoustic Match (Sound to Spelling) - 3 playable audio buttons & 3 English text tiles
          {
            type: "audio_match",
            promptText: "گوێ لە دەنگەکان بگرە و وشە هاوتاکەیان دیاری بکە",
            distractors: [],
            solutionData: {
              subtype: "acoustic_match",
              instruction: "ڕاهێنانی بیستن (Acoustic Match)",
              correct: "matched",
              sounds: [
                { id: "s1", label: "Sound 1", word: "Hi" },
                { id: "s2", label: "Sound 2", word: "Hey" },
                { id: "s3", label: "Sound 3", word: "Hello" },
              ],
              words: ["Hey", "Hello", "Hi"],
            },
            order: 2,
          },
          // Screen 3: The "How are you?" Deconstruction - 4 interactive horizontal rows
          {
            type: "multiple_choice",
            promptText: "شیکردنەوەی پێکهاتەی ڕستە",
            distractors: [],
            solutionData: {
              subtype: "analytic_breakdown",
              instruction: "شیکردنەوەی پێکهاتەی ڕستە (Analytic Breakdown)",
              correct: "How are you?",
              rows: [
                { english: "How", pronunciationKurdish: "هەو", meaningKurdish: "چۆن" },
                { english: "are", pronunciationKurdish: "ئاڕ", meaningKurdish: "هەیت" },
                { english: "you", pronunciationKurdish: "یو", meaningKurdish: "تۆ" },
                {
                  english: "How are you?",
                  pronunciationKurdish: "هەواریو؟",
                  meaningKurdish: "چۆنیت؟",
                  isFullPhrase: true,
                },
              ],
            },
            order: 3,
          },
          // Screen 4: The Echo Mic (Spoken Practice) - auto-plays American speech, Kurdish guide
          {
            type: "multiple_choice",
            promptText: "ڕاهێنانی دەنگ و وتار",
            distractors: [],
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی وتار و دەنگدانەوە (The Echo Mic)",
              correct: "How are you?",
              spokenText: "How are you?",
              subTextGuide: "هەواریو؟",
            },
            order: 4,
          },
          // Screen 5: Status Adjectives Bank - I'm [ ___ ], thank you.
          {
            type: "multiple_choice",
            promptText: "بانکی وەسفی بارودۆخ",
            distractors: [],
            solutionData: {
              subtype: "status_bank",
              instruction: "بانکی وەسفی بارودۆخ (Status Adjectives Bank)",
              correct: "completed",
              cards: [
                { word: "fine", sound: "فاین", meaning: "باش" },
                { word: "good", sound: "گود", meaning: "باش" },
                { word: "great", sound: "گرەیت", meaning: "زۆر باش" },
                { word: "cool", sound: "کووڵ", meaning: "نایاب" },
              ],
            },
            order: 5,
          },
          // Screen 6: Slot-and-Filler Check - I'm [ ? ], thank you.
          {
            type: "multiple_choice",
            promptText: "بۆشاییەکە پڕبکەرەوە",
            distractors: ["hello", "how", "are"],
            solutionData: {
              subtype: "slot_filler",
              instruction: "بۆشاییەکە بە وشەی گونجاو پڕبکەرەوە (Slot-and-Filler)",
              correct: "great",
              options: ["great", "hello", "how", "are"],
            },
            order: 6,
          },
          // Screen 7: Conversational Response Pairing - Social Logic Match
          {
            type: "multiple_choice",
            promptText: "پەیامەکە بە وەڵامە سروشتییەکەی ببەستەوە",
            distractors: [],
            solutionData: {
              subtype: "response_pairing",
              instruction: "جووتبەندکردنی گفتوگۆ (Social Logic Match)",
              correct: "paired",
              pairs: [
                { prompt: "Hi Sara", response: "Hello Ahmad" },
                { prompt: "How are you?", response: "I'm good, thank you" },
              ],
            },
            order: 7,
          },
          // Screen 8: The Bounce-Back Anchor ("What about you?")
          {
            type: "multiple_choice",
            promptText: "گەڕاندنەوەی پرسیارەکە",
            distractors: ["Say goodbye (ماڵئاوایی کردن)"],
            solutionData: {
              subtype: "bounce_back_anchor",
              instruction: "گەڕاندنەوەی پرسیارەکە (The Bounce-Back Anchor)",
              phrase: "What about you?",
              pronunciation: "وەرەباوتیو؟",
              meaning: "ئەی تۆ؟ / تۆ چۆنیت؟",
              correct: "Ask the question back (پرسیارەکە بە هەمان شێوە بپرسەوە)",
              options: [
                "Ask the question back (پرسیارەکە بە هەمان شێوە بپرسەوە)",
                "Say goodbye (ماڵئاوایی کردن)",
              ],
            },
            order: 8,
          },
          // Screen 9: Interactive Chat Dialogue - Messenger bubbles, auto-plays incoming question only
          {
            type: "multiple_choice",
            promptText: "دیالۆگ و چاتی زیندوو",
            distractors: [
              "I'm fine, thank you. Hi Sara.",
              "Hello, me too.",
            ],
            solutionData: {
              subtype: "chat_dialogue",
              instruction: "دیالۆگ و چاتی زیندوو (Interactive Chat Dialogue)",
              incomingMessage: "Hey Ahmad, how are you?",
              correct: "I'm cool, thank you. What about you?",
              options: [
                "I'm cool, thank you. What about you?",
                "I'm fine, thank you. Hi Sara.",
                "Hello, me too.",
              ],
            },
            order: 9,
          },
          // Screen 10: Capstone Spoken Handshake - Avatar waves, prompt banner on own line, 4s circular timer
          {
            type: "multiple_choice",
            promptText: "تاقیکردنەوەی کۆتایی دەنگ",
            distractors: [],
            solutionData: {
              subtype: "capstone_spoken",
              instruction: "تاقیکردنەوەی کۆتایی دەنگ (Capstone Spoken Handshake)",
              correct: "I'm good, thank you. What about you?",
              spokenText: "I'm good, thank you. What about you?",
              subTextGuide: "ئایم گود، سانک یو. وەرەباوتیو؟",
              visualScaffold: "I'm [good / cool], thank you. What about you?",
              timerSeconds: 4,
            },
            order: 10,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.2: Ear Training - Theme A (8 Screens)
      // -----------------------------------------------------------------------
      {
        title: "1.2 Ear Training: Theme A (ڕاهێنانی گوێ: تێما A)",
        order: 2,
        xpReward: 15,
        exercises: [
          // Screen 1: Intonation Radar (Question vs. Statement)
          {
            type: "multiple_choice",
            promptText: "پرسیاره یان داخوێندراوه؟",
            distractors: [],
            solutionData: {
              subtype: "intonation_radar",
              instruction: "ڕاهێنانی گوێ (Intonation Radar)",
              correct: "completed",
              prompts: [
                { text: "How are you?", type: "question" },
                { text: "I'm good, thank you", type: "statement" },
              ],
            },
            order: 1,
          },
          // Screen 2: Greeting Catcher (Fast Acoustic Contrast)
          {
            type: "multiple_choice",
            promptText: "کام سڵاوکردن بیستیت؟",
            distractors: [],
            solutionData: {
              subtype: "greeting_catcher",
              instruction: "ڕاهێنانی بیستن (Greeting Catcher)",
              correct: "completed",
              buttons: ["Hey", "Hi", "Hello"],
              rounds: [
                { audio: "Hey Ahmad!", correct: "Hey" },
                { audio: "Hi Sara!", correct: "Hi" },
              ],
            },
            order: 2,
          },
          // Screen 3: Mood Decoder (Acoustic Adjective Identification)
          {
            type: "multiple_choice",
            promptText: "چۆن هەستی دەربڕی؟",
            distractors: [],
            solutionData: {
              subtype: "mood_decoder",
              instruction: "ڕاهێنانی بیستن (Mood Decoder)",
              correct: "completed",
              cards: [
                { word: "fine", emoji: "🙂" },
                { word: "good", emoji: "👍" },
                { word: "great", emoji: "😁" },
                { word: "cool", emoji: "😎" },
              ],
              rounds: [
                { audio: "I'm great, thank you!", correct: "great" },
                { audio: "I'm cool, thank you.", correct: "cool" },
              ],
            },
            order: 3,
          },
          // Screen 4: The Connected Speed Trap ("How are you?")
          {
            type: "multiple_choice",
            promptText: "کامیان دەچێتە گفتوگۆی ڕاستەقینە؟",
            distractors: [],
            solutionData: {
              subtype: "speed_trap",
              instruction: "ڕاهێنانی بیستن (Connected Speech)",
              slowText: "How — are — you?",
              fastText: "How are you?",
              slowLabel: "Slow / Articulated",
              fastLabel: "Natural Native Speed",
              promptKurdish: "کامیان دەچێتە گفتوگۆی ڕاستەقینە؟",
              correct: "fast",
            },
            order: 4,
          },
          // Screen 5: Reduction Decoder ("What about you?")
          {
            type: "audio_match",
            promptText: "چیت بیست؟",
            distractors: [],
            solutionData: {
              subtype: "audio_choice",
              instruction: "ڕاهێنانی بیستن (Reduction Decoder)",
              audioText: "What about you?",
              question: "چیت بیست؟",
              correct: "What about you?",
              options: [
                "What about you?",
                "How are you?",
                "Thank you",
              ],
            },
            order: 5,
          },
          // Screen 6: Blind Audio Scramble (Dialogue Sequencing)
          {
            type: "multiple_choice",
            promptText: "ترتیبی دروستی گفتوگۆ دیاری بکە",
            distractors: [],
            solutionData: {
              subtype: "blind_audio_scramble",
              instruction: "ڕاهێنانی بیستن (Blind Audio Scramble)",
              correct: "completed",
              clips: [
                { id: "A", label: "Audio A", text: "I'm good, thank you. What about you?" },
                { id: "B", label: "Audio B", text: "Hey Ahmad, how are you?" },
                { id: "C", label: "Audio C", text: "I'm cool, thank you." },
              ],
              correctOrder: ["B", "A", "C"],
            },
            order: 6,
          },
          // Screen 7: Social Context Detection
          {
            type: "multiple_choice",
            promptText: "ئایا ئەم دەنگە لەکوێدایە؟",
            distractors: [],
            solutionData: {
              subtype: "social_context",
              instruction: "ڕاهێنانی بیستن (Social Context)",
              correct: "completed",
              scenario1: "Student & Teacher",
              scenario1Emoji: "👨‍🏫",
              scenario2: "Friends on the street",
              scenario2Emoji: "👫",
              rounds: [
                { audio: "Hey! How are you?", correct: "2" },
                { audio: "Hello, teacher.", correct: "1" },
              ],
            },
            order: 7,
          },
          // Screen 8: Speed Ear Gate (Lesson Checkpoint)
          {
            type: "multiple_choice",
            promptText: "تاقیکردنەوەی گوێ — ڕاست یان هەڵە؟",
            distractors: [],
            solutionData: {
              subtype: "speed_ear_gate",
              instruction: "تاقیکردنەوەی گوێ (Speed Ear Gate)",
              correct: "completed",
              timerSeconds: 3,
              passMark: 2,
              rounds: [
                { audio: "I'm cool, thank you.", display: "😎", correct: true },
                { audio: "Hi Ahmad.", display: "👧 Sara", correct: false },
                { audio: "What about you?", display: "How are you?", correct: false },
              ],
            },
            order: 8,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.3: Rapid Speaking — Theme A (8 Screens)
      // -----------------------------------------------------------------------
      {
        title: "1.3 Rapid Speaking: Theme A (قسەکردنی خێرا: تێما A)",
        order: 3,
        xpReward: 15,
        exercises: [
          // Screen 1: Shadowing Warm-Up (Untimed)
          {
            type: "multiple_choice",
            promptText: "ڕاهێنانی وتار — بێ ماوە",
            distractors: [],
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی وتار (Shadowing Warm-Up)",
              correct: "Hey!",
              spokenText: "Hey!",
              subTextGuide: "هێی!",
            },
            order: 1,
          },
          // Screen 2: Echo Drill — Question Frame (Untimed)
          {
            type: "multiple_choice",
            promptText: "دووبارەی پرسیارەکە بکەرەوە",
            distractors: [],
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی وتار (Echo Drill)",
              correct: "How are you?",
              spokenText: "How are you?",
              subTextGuide: "هەواریو؟",
            },
            order: 2,
          },
          // Screen 3: Visual Status Trigger (Tier 1 — 5s)
          {
            type: "multiple_choice",
            promptText: "چۆنیت؟",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 1 — 5s)",
              correct: "I'm good, thank you",
              spokenText: "I'm good, thank you",
              promptAudio: "How are you?",
              promptLabel: "هاواری سەرووەکە گوێ بگرە",
              visualCue: "👍",
              scaffoldText: "I'm [ ? ], thank you.",
              timerSeconds: 5,
            },
            order: 3,
          },
          // Screen 4: Status Shift (Tier 1 — 5s)
          {
            type: "multiple_choice",
            promptText: "چۆنیت؟",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 1 — 5s)",
              correct: "I'm cool, thank you",
              spokenText: "I'm cool, thank you",
              promptAudio: "How are you?",
              promptLabel: "هاواری سەرووەکە گوێ بگرە",
              visualCue: "😎",
              scaffoldText: "I'm [ ? ], thank you.",
              timerSeconds: 5,
            },
            order: 4,
          },
          // Screen 5: Bounce-Back Trigger (Tier 2 — 4s)
          {
            type: "multiple_choice",
            promptText: "پرسیارەکە بگەڕاندەرەوە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 2 — 4s)",
              correct: "What about you?",
              spokenText: "What about you?",
              promptAudio: "I'm fine, thank you.",
              promptLabel: "دەنگی ئەواترەکان گوێ بگرە",
              visualCue: "↩️",
              scaffoldText: "What about you?",
              timerSeconds: 4,
            },
            order: 5,
          },
          // Screen 6: Two-Part Assembly (Tier 2 — 4s)
          {
            type: "multiple_choice",
            promptText: "وەڵامی تەواو بدە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 2 — 4s)",
              correct: "I'm great, thank you. What about you?",
              spokenText: "I'm great, thank you. What about you?",
              promptAudio: "Hey! How are you?",
              promptLabel: "هاواری سەرووەکە گوێ بگرە",
              visualCue: "🌟",
              scaffoldText: "I'm great, thank you... [ ? ]",
              timerSeconds: 4,
            },
            order: 6,
          },
          // Screen 7: Social Greeting Trigger (Tier 3 — 3s)
          {
            type: "multiple_choice",
            promptText: "سڵاوی کردن بکە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 3 — 3s)",
              correct: "Hi Ahmad",
              spokenText: "Hi Ahmad",
              promptAudio: "",
              promptLabel: "",
              visualCue: "🪧 Ahmad",
              scaffoldText: "",
              timerSeconds: 3,
            },
            order: 7,
          },
          // Screen 8: Cold Ping-Pong Sprint (Speaking Gate — 3s)
          {
            type: "multiple_choice",
            promptText: "ئامادەیت؟ وەڵام بدە!",
            distractors: [],
            solutionData: {
              subtype: "capstone_spoken",
              instruction: "دەروازەی وتار (Speaking Gate — 3s)",
              correct: "I'm good, thank you. What about you?",
              spokenText: "I'm good, thank you. What about you?",
              subTextGuide: "ئایم گود، سانک یو. وەرەباوتیو؟",
              visualScaffold: "I'm [good/cool/fine], thank you. What about you?",
              timerSeconds: 3,
            },
            order: 8,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.4: Pattern & Assembly — Theme B (8 Screens)
      // -----------------------------------------------------------------------
      {
        title: "1.4 Pattern & Assembly: Theme B (کێشەو دروستکردن: تێما B)",
        order: 4,
        xpReward: 15,
        exercises: [
          // Screen 1: Spatial Anchor (This vs. That)
          {
            type: "multiple_choice",
            promptText: "نزیک یان دوور؟",
            distractors: [],
            solutionData: {
              subtype: "spatial_anchor",
              instruction: "پێناسەی شوێن (Spatial Anchor)",
              correct: "completed",
              cards: [
                { label: "Near", word: "This", emoji: "👆🚗", description: "ذس / ئەمە - نزیک", distance: "near" },
                { label: "Far", word: "That", emoji: "👉🚗💨", description: "ذات / ئەوە - دوور", distance: "far" },
              ],
            },
            order: 1,
          },
          // Screen 2: Concrete Object Anchors (car, flower, house)
          {
            type: "audio_match",
            promptText: "گوێ بگرە — کامی دیاری بکە",
            distractors: [],
            solutionData: {
              subtype: "acoustic_match",
              instruction: "پێناسەی بەرهەم (Object Anchors)",
              correct: "matched",
              sounds: [
                { id: "s1", label: "Sound 1", word: "car" },
                { id: "s2", label: "Sound 2", word: "flower" },
                { id: "s3", label: "Sound 3", word: "house" },
              ],
              words: ["car", "flower", "house"],
            },
            order: 2,
          },
          // Screen 3: Demonstrative Snap (This/That + Noun)
          {
            type: "multiple_choice",
            promptText: "بۆشاییەکە پڕبکەرەوە",
            distractors: ["That"],
            solutionData: {
              subtype: "slot_filler",
              instruction: "بۆشاییەکە پڕبکەرەوە (Demonstrative Snap)",
              correct: "This",
              options: ["This", "That"],
              slotSuffix: "house",
            },
            order: 3,
          },
          // Screen 4: The Opinion Ladder
          {
            type: "multiple_choice",
            promptText: "لە باشترین بۆ خراپترین ڕیزبندی بکە",
            distractors: [],
            solutionData: {
              subtype: "opinion_ladder",
              instruction: "پلەی بۆچوون (Opinion Ladder)",
              correct: "completed",
              headerKurdish: "لە باشترین بۆ خراپترین ڕیزبندی بکە",
              correctOrder: ["love", "like", "don't like", "hate"],
              cards: [
                { word: "love", emoji: "😍", kurdish: "ئای ڵەڤ" },
                { word: "like", emoji: "👍", kurdish: "ئای ڵایک" },
                { word: "don't like", emoji: "👎", kurdish: "ئارۆن ڵایک" },
                { word: "hate", emoji: "😡", kurdish: "ئای هەیت" },
              ],
            },
            order: 4,
          },
          // Screen 5: Sentence Frame Construction
          {
            type: "multiple_choice",
            promptText: "بۆشاییەکە پڕبکەرەوە",
            distractors: ["hate", "how", "are"],
            solutionData: {
              subtype: "slot_filler",
              instruction: "دروستکردنی ڕستە (Sentence Frame)",
              correct: "love",
              options: ["love", "hate", "how", "are"],
              slotPrefix: "I",
              slotSuffix: "this car.",
            },
            order: 5,
          },
          // Screen 6: Agreement Trigger ("Me too")
          {
            type: "multiple_choice",
            promptText: "کام وەڵامی دروستە؟",
            distractors: ["I'm fine"],
            solutionData: {
              subtype: "bounce_back_anchor",
              instruction: "پەیمانی ڕێکەوتن (Agreement Trigger)",
              phrase: "Me too!",
              pronunciation: "می توو",
              meaning: "منیش / من ئیش",
              correct: "Me too! (می توو / منیش)",
              options: [
                "Me too! (می توو / منیش)",
                "I'm fine (ئام فاین)",
              ],
              avatarSays: "I like BMW, what about you?",
            },
            order: 6,
          },
          // Screen 7: Untimed Shadowing Rehearsal
          {
            type: "multiple_choice",
            promptText: "دووبارەی بکەرەوە",
            distractors: [],
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی وتار (Shadowing Rehearsal)",
              correct: "I hate that car",
              spokenText: "I hate that car",
              subTextGuide: "ئای هەیت ذات کار",
            },
            order: 7,
          },
          // Screen 8: Assembly Gate (Timed Synthesis — 5s)
          {
            type: "multiple_choice",
            promptText: "ڕستەکە ڕێکبخە",
            distractors: [],
            solutionData: {
              subtype: "tile_assembly",
              instruction: "دەروازەی دروستکردن (Assembly Gate — 5s)",
              correct: "completed",
              visualCue: "🚗❌",
              tiles: ["that car.", "I", "don't like", "this"],
              correctOrder: ["I", "don't like", "that car."],
              timerSeconds: 5,
            },
            order: 8,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.5: Ear Training & Reductions — Theme B (8 Screens)
      // -----------------------------------------------------------------------
      {
        title: "1.5 Ear Training & Reductions: Theme B (ڕاهێنانی گوێ: تێما B)",
        order: 5,
        xpReward: 15,
        exercises: [
          // Screen 1: Acoustic Reality Check (Robot vs. Native)
          {
            type: "multiple_choice",
            promptText: "کامیان دەچێتە گفتوگۆی ڕاستەقینە؟",
            distractors: [],
            solutionData: {
              subtype: "speed_trap",
              instruction: "ڕاهێنانی بیستن (Acoustic Reality Check)",
              correct: "fast",
              slowText: "I — do — not — like — this — car.",
              fastText: "I don't like this car.",
              slowLabel: "🤖 Robot Mode",
              fastLabel: "⚡ American Street Mode",
              promptKurdish: "کامیان دەچێتە گفتوگۆی ڕاستەقینە؟",
            },
            order: 1,
          },
          // Screen 2: Sentiment Decoder by Ear (Like vs Don't Like)
          {
            type: "multiple_choice",
            promptText: "حەزی لێیە یان نا؟",
            distractors: [],
            solutionData: {
              subtype: "mood_decoder",
              instruction: "ڕاهێنانی بیستن (Sentiment Decoder)",
              correct: "completed",
              cards: [
                { word: "Like", emoji: "👍" },
                { word: "Don't Like", emoji: "👎" },
              ],
              rounds: [
                { audio: "I don't like this car.", correct: "Don't Like" },
                { audio: "I like this car.", correct: "Like" },
              ],
            },
            order: 2,
          },
          // Screen 3: Distance Trap (This vs. That by ear)
          {
            type: "multiple_choice",
            promptText: "نزیک یان دوور؟",
            distractors: [],
            solutionData: {
              subtype: "social_context",
              instruction: "ڕاهێنانی بیستن (Distance Trap)",
              correct: "completed",
              scenario1: "Near (This)",
              scenario1Emoji: "👆🚗",
              scenario2: "Far (That)",
              scenario2Emoji: "👉🚗💨",
              rounds: [
                { audio: "I love that car.", correct: "2" },
                { audio: "I love this car.", correct: "1" },
              ],
            },
            order: 3,
          },
          // Screen 4: Blind Lexical Identification
          {
            type: "audio_match",
            promptText: "چیت بیست؟",
            distractors: [],
            solutionData: {
              subtype: "audio_choice",
              instruction: "ڕاهێنانی بیستن (Blind Lexical ID)",
              audioText: "I don't like that flower.",
              question: "چیت بیست؟",
              correct: "I don't like that flower",
              options: [
                "I don't like that flower",
                "I don't have that flower",
                "I hate this flower",
              ],
            },
            order: 4,
          },
          // Screen 5: Agreement Ear Trap (Me too vs distractors)
          {
            type: "audio_match",
            promptText: "کام وەڵامی دروستە؟",
            distractors: [],
            solutionData: {
              subtype: "agreement_ear_trap",
              instruction: "ڕاهێنانی بیستن (Agreement Ear Trap)",
              correct: "A",
              promptText: "I like Dolma, what about you?",
              responses: [
                { id: "A", label: "Response A", text: "Me too." },
                { id: "B", label: "Response B", text: "You too." },
                { id: "C", label: "Response C", text: "Thank you." },
              ],
              correctId: "A",
            },
            order: 5,
          },
          // Screen 6: Intensity Discrimination by Pitch & Stress
          {
            type: "multiple_choice",
            promptText: "هەستی چییە؟",
            distractors: [],
            solutionData: {
              subtype: "mood_decoder",
              instruction: "ڕاهێنانی بیستن (Intensity Discrimination)",
              correct: "completed",
              cards: [
                { word: "Love", emoji: "❤️" },
                { word: "Like", emoji: "👍" },
                { word: "Hate", emoji: "😡" },
              ],
              rounds: [
                { audio: "I hate that house!", correct: "Hate" },
                { audio: "I love this house!", correct: "Love" },
              ],
            },
            order: 6,
          },
          // Screen 7: Blind Tile Assembly (Ear-to-Syntax)
          {
            type: "multiple_choice",
            promptText: "گوێ بگرە — ڕستەکە دروست بکەرەوە",
            distractors: [],
            solutionData: {
              subtype: "blind_audio_scramble",
              instruction: "ڕاهێنانی بیستن (Blind Tile Assembly)",
              correct: "completed",
              clips: [
                { id: "A", label: "Audio A", text: "I don't like this car." },
              ],
              correctOrder: ["A"],
              isSingleClip: true,
              tiles: ["this car.", "don't like", "I", "hate"],
              correctTileOrder: ["I", "don't like", "this car."],
            },
            order: 7,
          },
          // Screen 8: Speed Reduction Gate (Checkpoint — 3s per rep)
          {
            type: "multiple_choice",
            promptText: "ڕاست یان هەڵە؟",
            distractors: [],
            solutionData: {
              subtype: "speed_ear_gate",
              instruction: "تاقیکردنەوەی گوێ (Speed Reduction Gate)",
              correct: "completed",
              timerSeconds: 3,
              passMark: 2,
              rounds: [
                { audio: "I don't like that car.", display: "🚗❌ (Far)", correct: true },
                { audio: "I love this flower.", display: "🏠", correct: false },
                { audio: "Me too.", display: "You too", correct: false },
              ],
            },
            order: 8,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.6: Rapid Speaking — Theme B (8 Screens)
      // -----------------------------------------------------------------------
      {
        title: "1.6 Rapid Speaking: Theme B (قسەکردنی خێرا: تێما B)",
        order: 6,
        xpReward: 15,
        exercises: [
          // Screen 1: Shadowing Warm-Up (Untimed — The Reduction)
          {
            type: "multiple_choice",
            promptText: "دووبارەی بکەرەوە",
            distractors: [],
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی وتار (Shadowing Warm-Up)",
              correct: "I don't like",
              spokenText: "I don't like",
              subTextGuide: "ئارۆن ڵایک /aɪ roʊn laɪk/",
            },
            order: 1,
          },
          // Screen 2: Demonstrative Vocal Contrast (Untimed)
          {
            type: "multiple_choice",
            promptText: "هەردووکی بڵێ",
            distractors: [],
            solutionData: {
              subtype: "echo_mic",
              instruction: "ڕاهێنانی وتار (Vocal Contrast)",
              correct: "This car. That car.",
              spokenText: "This car. That car.",
              subTextGuide: "ذس کار... ذات کار",
            },
            order: 2,
          },
          // Screen 3: Reflex Agreement (Tier 1 — 5s)
          {
            type: "multiple_choice",
            promptText: "ڕێکەوتنت دەربڕە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 1 — 5s)",
              correct: "Me too",
              spokenText: "Me too",
              promptAudio: "I like Dolma, what about you?",
              promptLabel: "هاواری سەرووەکە گوێ بگرە",
              visualCue: "🤝",
              scaffoldText: "Say you agree!",
              timerSeconds: 5,
            },
            order: 3,
          },
          // Screen 4: Distance + Object Naming (Tier 1 — 5s)
          {
            type: "multiple_choice",
            promptText: "چییە ئەوە؟",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 1 — 5s)",
              correct: "That house",
              spokenText: "That house",
              promptAudio: "",
              promptLabel: "",
              visualCue: "👉🏠💨",
              scaffoldText: "[ That ] [ house ]",
              timerSeconds: 5,
            },
            order: 4,
          },
          // Screen 5: Positive Opinion Sprint (Tier 2 — 4s)
          {
            type: "multiple_choice",
            promptText: "بۆچوونت دەربڕە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 2 — 4s)",
              correct: "I love this car",
              spokenText: "I love this car",
              promptAudio: "Do you like this car?",
              promptLabel: "پرسیارەکە گوێ بگرە",
              visualCue: "🚗😍",
              scaffoldText: "I [ ? ] this car.",
              timerSeconds: 4,
            },
            order: 5,
          },
          // Screen 6: Spoken Reduction Under Pressure (Tier 2 — 4s)
          {
            type: "multiple_choice",
            promptText: "بۆچوونت دەربڕە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 2 — 4s)",
              correct: "I don't like this car",
              spokenText: "I don't like this car",
              promptAudio: "",
              promptLabel: "",
              visualCue: "🚗👎",
              scaffoldText: "I don't like... [ ? ]",
              timerSeconds: 4,
            },
            order: 6,
          },
          // Screen 7: Strong Negative Rejection (Tier 3 — 3s)
          {
            type: "multiple_choice",
            promptText: "بۆچوونت دەربڕە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "قسەکردنی خێرا (Tier 3 — 3s)",
              correct: "I hate that house",
              spokenText: "I hate that house",
              promptAudio: "What about that house?",
              promptLabel: "پرسیارەکە گوێ بگرە",
              visualCue: "🏚️😡",
              scaffoldText: "",
              timerSeconds: 3,
            },
            order: 7,
          },
          // Screen 8: Cold Capstone Gate (Speaking Gate — 3s)
          {
            type: "multiple_choice",
            promptText: "ئامادەیت؟ وەڵام بدە!",
            distractors: [],
            solutionData: {
              subtype: "capstone_spoken",
              instruction: "دەروازەی وتار (Speaking Gate — 3s)",
              correct: "I love this flower",
              spokenText: "I love this flower",
              subTextGuide: "ئای ڵەڤ ذس فڵاوەر",
              visualScaffold: "I love/like this flower",
              timerSeconds: 3,
            },
            order: 8,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.7: Boss Checkpoint — The Street Dialogue (8 Screens)
      // -----------------------------------------------------------------------
      {
        title: "1.7 Boss Checkpoint: The Street Dialogue (تاقیکردنەوەی باس)",
        order: 7,
        xpReward: 30,
        exercises: [
          // Screen 1: Scenario Briefing
          {
            type: "multiple_choice",
            promptText: "ئامادەیت بۆ گفتوگۆی ڕاستەقینە؟",
            distractors: [],
            solutionData: {
              subtype: "boss_score_card",
              subtype2: "boss_briefing",
              instruction: "داوای باس (Boss Checkpoint)",
            },
            order: 1,
          },
          // Screen 2: Turn 1 — Opening Handshake (3s)
          {
            type: "multiple_choice",
            promptText: "وەڵامی سڵاوەکە بدە",
            distractors: [],
            solutionData: {
              subtype: "capstone_spoken",
              instruction: "نووبەی ١ (Turn 1 — 3s)",
              correct: "I'm good, thank you",
              spokenText: "I'm good, thank you",
              subTextGuide: "ئایم گود، سانک یو",
              visualScaffold: "I'm [good / cool / great], thank you.",
              timerSeconds: 3,
            },
            order: 2,
          },
          // Screen 3: Turn 2 — Counter-Question (3s)
          {
            type: "multiple_choice",
            promptText: "پرسیارەکە بگەڕاندەرەوە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "نووبەی ٢ (Turn 2 — 3s)",
              correct: "What about you?",
              spokenText: "What about you?",
              promptAudio: "I'm fine, thank you!",
              promptLabel: "گفتوگۆکە بەردەوام بکە",
              visualCue: "🔄",
              scaffoldText: "Keep the conversation going!",
              timerSeconds: 3,
            },
            order: 3,
          },
          // Screen 4: Turn 3 — Agreement Reflex (3s)
          {
            type: "multiple_choice",
            promptText: "ڕێکەوتنت دەربڕە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "نووبەی ٣ (Turn 3 — 3s)",
              correct: "Me too",
              spokenText: "Me too",
              promptAudio: "I like Dolma, what about you?",
              promptLabel: "هاواری سەرووەکە گوێ بگرە",
              visualCue: "🍲",
              scaffoldText: "",
              timerSeconds: 3,
            },
            order: 4,
          },
          // Screen 5: Turn 4 — Near Object Evaluation (This) (4s)
          {
            type: "multiple_choice",
            promptText: "بۆچوونت دەربڕە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "نووبەی ٤ (Turn 4 — 4s)",
              correct: "I love this car",
              spokenText: "I love this car",
              promptAudio: "Do you like this car?",
              promptLabel: "پرسیارەکە گوێ بگرە",
              visualCue: "🚗😍",
              scaffoldText: "",
              timerSeconds: 4,
            },
            order: 5,
          },
          // Screen 6: Turn 5 — Far Object Evaluation (That) (4s)
          {
            type: "multiple_choice",
            promptText: "بۆچوونت دەربڕە",
            distractors: [],
            solutionData: {
              subtype: "timed_mic",
              instruction: "نووبەی ٥ (Turn 5 — 4s)",
              correct: "I don't like that house",
              spokenText: "I don't like that house",
              promptAudio: "What about that house over there?",
              promptLabel: "پرسیارەکە گوێ بگرە",
              visualCue: "🏚️👎",
              scaffoldText: "",
              timerSeconds: 4,
            },
            order: 6,
          },
          // Screen 7: Final Ear Trap (Surprise Check — 3s)
          {
            type: "multiple_choice",
            promptText: "تێیگەیشتیت؟",
            distractors: [],
            solutionData: {
              subtype: "speed_ear_gate",
              instruction: "تاقیکردنەوەی گوێ (Final Ear Trap)",
              correct: "completed",
              timerSeconds: 3,
              passMark: 1,
              rounds: [
                { audio: "Cool, see ya later!", display: "How are you?", correct: false },
              ],
            },
            order: 7,
          },
          // Screen 8: Mastery Scorecard
          {
            type: "multiple_choice",
            promptText: "پۆلی کۆتایی",
            distractors: [],
            solutionData: {
              subtype: "boss_score_card",
              instruction: "پۆلی کۆتایی (Mastery Scorecard)",
              correct: "unit_mastered",
              speedScore: 85,
              accuracyScore: 78,
              flowScore: 82,
            },
            order: 8,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // LEVEL 2: Daily Life, Time & Expanding Conversations
  // =========================================================================
  {
    title: "Level 2: Daily Life & Expanding Vocabulary (ئاستی ٢: ژیانی ڕۆژانە)",
    order: 2,
    lessons: [
      {
        title: "2.1 Telling Time & Daily Schedules (کات و خشتەی ڕۆژانە)",
        order: 1,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "2.2 Family & Friends (خێزان و هاوڕێیان)",
        order: 2,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "2.3 Food & Restaurant Ordering (خواردن و داواکردن لە چێشتخانە)",
        order: 3,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "2.4 Weather & Seasons (کەشوهەوا و وەرزەکان)",
        order: 4,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "2.5 Hobbies & Free Time (حەز و کاتی بەتاڵ)",
        order: 5,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "2.6 Shopping & Clothing (کڕین و جلوبەرگ)",
        order: 6,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "2.7 Level 2 Capstone Exam (تاقیکردنەوەی ئاستی ٢)",
        order: 7,
        xpReward: 30,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // LEVEL 3: Travel, Health & Practical Scenarios
  // =========================================================================
  {
    title: "Level 3: Travel & Real-World Practicalities (ئاستی ٣: گەشت و پێداویستی)",
    order: 3,
    lessons: [
      {
        title: "3.1 At the Airport & Flying (لە فڕۆکەخانە و گەشتکردن)",
        order: 1,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "3.2 Hotel Check-in & Requests (مانەوە لە هۆتێل)",
        order: 2,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "3.3 Emergencies & Doctor Visits (فریاگوزاری و سەردانی پزیشک)",
        order: 3,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "3.4 Transportation: Buses, Trains & Taxis (هۆکارەکانی گواستنەوە)",
        order: 4,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "3.5 Sightseeing & City Tours (گەشتوگوزار لە شار)",
        order: 5,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "3.6 Handling Problems & Complaints (چارەسەری کێشەکان)",
        order: 6,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "3.7 Level 3 Capstone Exam (تاقیکردنەوەی ئاستی ٣)",
        order: 7,
        xpReward: 30,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // LEVEL 4: Work, Business & Professional Communication
  // =========================================================================
  {
    title: "Level 4: Work & Professional English (ئاستی ٤: زمانی کار و پیشە)",
    order: 4,
    lessons: [
      {
        title: "4.1 Job Interviews & Introductions (چاوپێکەوتنی کار)",
        order: 1,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "4.2 Emails & Workplace Messaging (ئیمەیڵ و پەیامی فەرمی)",
        order: 2,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "4.3 Meetings & Presentations (کۆبوونەوە و پێشکەشکردن)",
        order: 3,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "4.4 Phone Calls & Negotiation (پەیوەندی تەلەفۆنی و ڕێککەوتن)",
        order: 4,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "4.5 Professional Opinions & Disagreements (دەربڕینی بۆچوونی فەرمی)",
        order: 5,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "4.6 Projects & Deadlines (پڕۆژەکان و کاتی دیاریکراو)",
        order: 6,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "4.7 Level 4 Capstone Exam (تاقیکردنەوەی ئاستی ٤)",
        order: 7,
        xpReward: 30,
        exercises: [],
      },
    ],
  },

  // =========================================================================
  // LEVEL 5: Advanced Fluency & Real-Life Debates
  // =========================================================================
  {
    title: "Level 5: Advanced Fluency & Deep Conversation (ئاستی ٥: قسەکردنی ڕەوان)",
    order: 5,
    lessons: [
      {
        title: "5.1 Idioms & Native Expressions (دەستەواژە و ئیدیۆمە باوەکان)",
        order: 1,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "5.2 Storytelling & Past Events (گێڕانەوەی چیرۆک و ڕووداوەکان)",
        order: 2,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "5.3 Complex Opinions & Debating (گفتوگۆی قووڵ و مشتومڕ)",
        order: 3,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "5.4 Culture & Social Nuances (کولتوور و وردەکاری کۆمەڵایەتی)",
        order: 4,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "5.5 Fast Native Listening & Slang (تێگەیشتن لە دەنگی خێرای بیانی)",
        order: 5,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "5.6 Impromptu Speaking & Thinking in English (قسەکردنی کتوپڕ)",
        order: 6,
        xpReward: 15,
        exercises: [],
      },
      {
        title: "5.7 Graduation Capstone Exam (تاقیکردنەوەی گەورەی دەرچوون)",
        order: 7,
        xpReward: 50,
        exercises: [],
      },
    ],
  },
];

export async function runMohammedMahdiSeed() {
  console.log("=== Seeding Mohammed Mahdi English Course (ئینگلیزی لەگەڵ محەمەد مەهدی) ===");

  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL || "https://qualified-egret-206.convex.cloud";
  const adminSecret = process.env.ADMIN_SEED_SECRET || "ferbe-secret-2026";

  const totalExercises = MOHAMMED_MAHDI_UNITS.reduce(
    (acc, u) => acc + u.lessons.reduce((lAcc, l) => lAcc + l.exercises.length, 0),
    0
  );
  const totalLessons = MOHAMMED_MAHDI_UNITS.reduce((acc, u) => acc + u.lessons.length, 0);

  console.log(
    `Prepared ${MOHAMMED_MAHDI_UNITS.length} levels, ${totalLessons} lessons, and ${totalExercises} interactive exercises.`
  );

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log(`Connecting to Convex at: ${convexUrl}...`);
    const result = await client.mutation(api.admin.seedCurriculum, {
      adminSecret,
      course: COURSE,
      units: MOHAMMED_MAHDI_UNITS,
      deleteOtherCourses: false, // Keep existing courses safe
    });

    console.log("\nCourse successfully seeded!");
    console.log(`- Course slug: ${result.courseSlug}`);
    console.log(`- Lessons upserted: ${result.lessonsUpserted}`);
    console.log(`- Exercises written: ${result.exercisesWritten}`);
    return result;
  } catch (err) {
    console.error("Failed to seed Mohammed Mahdi course:", err);
    throw err;
  }
}

// Execute if called directly via CLI
if (typeof require !== "undefined" && require.main === module) {
  runMohammedMahdiSeed().catch(() => process.env.NODE_ENV !== "test" && process.exit(1));
} else if (process.argv[1]?.includes("seed-mohammed-mahdi-course")) {
  runMohammedMahdiSeed().catch(() => process.env.NODE_ENV !== "test" && process.exit(1));
}
