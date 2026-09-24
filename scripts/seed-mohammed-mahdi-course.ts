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
              correct: "I'm good, thank you. How are you?",
              options: [
                "I'm good, thank you. How are you?",
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
      // LESSON 1.2: Name & Identity (ناساندنی ناو و کەسایەتی)
      // -----------------------------------------------------------------------
      {
        title: "1.2 Name & Identity (ناساندنی ناو و ناسین)",
        order: 2,
        xpReward: 15,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "What is your name? (ناوت چییە؟)",
            distractors: ["Where are you?", "How old are you?"],
            solutionData: {
              correct: "What is your name?",
              instruction: "پێناسەی دەستەواژە (Phrase Anchor)",
              icon: "🏷️",
              isSpeaking: true,
              spokenText: "What is your name?",
            },
            order: 1,
          },
          {
            type: "word_bank",
            promptText: "ناوم ئەحمەدە (My name is Ahmad)",
            distractors: ["your", "are", "what"],
            solutionData: {
              tokens: ["My", "name", "is", "Ahmad."],
              instruction: "ڕستەکە ڕێکبخە (Sentence Assembly)",
              icon: "✍️",
            },
            order: 2,
          },
          {
            type: "multiple_choice",
            promptText: "Nice to meet you (خۆشحاڵم بە ناسینت)",
            distractors: ["See you tomorrow", "Good afternoon"],
            solutionData: {
              correct: "Nice to meet you",
              instruction: "ڕێزگرتن و بەخێرهاتن (Social Etiquette)",
              icon: "🤝",
              isSpeaking: true,
              spokenText: "Nice to meet you",
            },
            order: 3,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و ناوچەکە هەڵبژێرە",
            distractors: ["I am from London", "I am from Canada"],
            solutionData: {
              correct: "I am from Kurdistan",
              spokenText: "I am from Kurdistan",
              instruction: "ڕاهێنانی بیستن (Ear Training)",
              icon: "🌍",
            },
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "Nice to meet you (نایس تو میت یو)",
            distractors: ["Who are you?", "Excuse me"],
            solutionData: {
              correct: "Nice to meet you too",
              instruction: "دەنگدانەوە و دووبارەکردنەوە (The Echo Mic)",
              icon: "🎙️",
              isSpeaking: true,
              type: "speak",
              spokenText: "Nice to meet you too",
            },
            order: 5,
          },
          {
            type: "multiple_choice",
            promptText: "📩 Hi! What is your name?",
            distractors: [
              "I am from Erbil.",
              "Nice to meet you.",
            ],
            solutionData: {
              correct: "Hello! My name is Mohammed. What about you?",
              instruction: "چاتی زیندوو (Chat Simulation)",
              icon: "💬",
              isSpeaking: true,
              spokenText: "Hello! My name is Mohammed. What about you?",
            },
            order: 6,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.3: Polite Requests & Daily Etiquette (داواکاری و ڕێزگرتن)
      // -----------------------------------------------------------------------
      {
        title: "1.3 Polite Requests & Daily Etiquette (داواکاری بەڕێزانە)",
        order: 3,
        xpReward: 15,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "Please & Thank you (تکایە و سوپاس)",
            distractors: ["Yes and No", "Stop and Go"],
            solutionData: {
              correct: "Please & Thank you",
              instruction: "دەستەواژەی سەرەکی (Core Etiquette)",
              icon: "🙏",
              isSpeaking: true,
              spokenText: "Please and Thank you",
            },
            order: 1,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و وشەی بیستراو دەستنیشان بکە",
            distractors: ["Thank you", "Sorry"],
            solutionData: {
              correct: "Excuse me",
              spokenText: "Excuse me",
              instruction: "ڕاهێنانی بیستن (Ear Training)",
              icon: "👂",
            },
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "دەکرێت ئاوێکم پێبدەیت، تکایە؟ (Can I have water, please?)",
            distractors: ["you", "are", "where"],
            solutionData: {
              tokens: ["Can", "I", "have", "water,", "please?"],
              instruction: "ڕستەکە ڕێکبخە (Sentence Assembly)",
              icon: "💧",
            },
            order: 3,
          },
          {
            type: "multiple_choice",
            promptText: "وەڵامی دروست چییە بۆ کەسێک کە دەڵێت: 'Thank you!'",
            distractors: ["Excuse me", "Good night"],
            solutionData: {
              correct: "You're welcome (سەرچاو / شایەنی نییە)",
              instruction: "وەڵامدانەوەی ڕێز (Polite Response)",
              icon: "🌟",
              isSpeaking: true,
              spokenText: "You are welcome",
            },
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "Excuse me, please (ببورە، تکایە)",
            distractors: ["Go away", "No thanks"],
            solutionData: {
              correct: "Excuse me, please",
              instruction: "ڕاهێنانی وتار (Echo Mic)",
              icon: "🎙️",
              isSpeaking: true,
              type: "speak",
              spokenText: "Excuse me, please",
            },
            order: 5,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.4: Numbers & Daily Essentials (ژمارەکان و مامەڵەی ڕۆژانە)
      // -----------------------------------------------------------------------
      {
        title: "1.4 Numbers & Daily Essentials (ژمارەکان و مامەڵەی ڕۆژانە)",
        order: 4,
        xpReward: 15,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "One, Two, Three, Four, Five (١، ٢، ٣، ٤، ٥)",
            distractors: ["Six, Seven, Eight", "Ten, Twenty, Thirty"],
            solutionData: {
              correct: "One, Two, Three, Four, Five",
              instruction: "فێربوونی ژمارەکان (Numbers 1-5)",
              icon: "🔢",
              isSpeaking: true,
              spokenText: "One, Two, Three, Four, Five",
            },
            order: 1,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و دەستەواژەی پرسیار دیاری بکە",
            distractors: ["What time is it?", "Where are you?"],
            solutionData: {
              correct: "How much is this?",
              spokenText: "How much is this?",
              instruction: "ڕاهێنانی بیستنی پرسیار (Price Inquiry)",
              icon: "💵",
            },
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "فەرموو، دە دۆلارە (Here you go, ten dollars)",
            distractors: ["is", "not", "why"],
            solutionData: {
              tokens: ["Here", "you", "go,", "ten", "dollars."],
              instruction: "ڕستەکە ڕێکبخە (Sentence Assembly)",
              icon: "🛍️",
            },
            order: 3,
          },
          {
            type: "multiple_choice",
            promptText: "Here you [ ___ ]. (فەرموو)",
            distractors: ["come", "is", "have"],
            solutionData: {
              correct: "go",
              instruction: "بۆشایی پڕبکەرەوە (Slot-and-Filler)",
              icon: "🤲",
              isSpeaking: true,
              spokenText: "Here you go.",
            },
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "How much is this? (هاو مەچ ئیز دیس؟)",
            distractors: ["Where is this?", "What is this?"],
            solutionData: {
              correct: "How much is this?",
              instruction: "ڕاهێنانی وتار (Echo Mic)",
              icon: "🎙️",
              isSpeaking: true,
              type: "speak",
              spokenText: "How much is this?",
            },
            order: 5,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.5: Likes, Coffee & Tea (حەز و ئارەزووەکان: چا و قاوە)
      // -----------------------------------------------------------------------
      {
        title: "1.5 Likes, Coffee & Tea (حەز و ئارەزووەکان)",
        order: 5,
        xpReward: 15,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "Coffee / Tea / Water (قاوە / چا / ئاو)",
            distractors: ["Bread / Rice / Meat", "Apple / Orange / Banana"],
            solutionData: {
              correct: "Coffee / Tea / Water",
              instruction: "وشە سەرەکییەکان (Drink Anchors)",
              icon: "☕",
              isSpeaking: true,
              spokenText: "Coffee, Tea, Water",
            },
            order: 1,
          },
          {
            type: "word_bank",
            promptText: "من حەزم لە قاوەیە (I like coffee)",
            distractors: ["tea", "don't", "is"],
            solutionData: {
              tokens: ["I", "like", "coffee."],
              instruction: "ڕستەکە ڕێکبخە (Positive Preference)",
              icon: "❤️",
            },
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "من حەزم لە چا نییە (I do not like tea)",
            distractors: ["yes", "like", "water"],
            solutionData: {
              tokens: ["I", "do", "not", "like", "tea."],
              instruction: "ڕستەی نەرێ ڕێکبخە (Negative Preference)",
              icon: "🚫",
            },
            order: 3,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و پرسیارەکە هەڵبژێرە",
            distractors: ["Do you have tea?", "Is this coffee?"],
            solutionData: {
              correct: "Do you want coffee?",
              spokenText: "Do you want coffee?",
              instruction: "ڕاهێنانی بیستن (Ear Training)",
              icon: "👂",
            },
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "Do you want coffee? (دەتەوێت؟)",
            distractors: ["I am Ahmad", "Good night"],
            solutionData: {
              correct: "Yes, please! I like coffee.",
              instruction: "وەڵامدانەوەی خێرا (Dialogue Response)",
              icon: "💬",
              isSpeaking: true,
              spokenText: "Yes, please! I like coffee.",
            },
            order: 5,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.6: Places & Directions (شوێنەکان و ڕێگا دۆزینەوە)
      // -----------------------------------------------------------------------
      {
        title: "1.6 Places & Directions (شوێنەکان و ڕێگا دۆزینەوە)",
        order: 6,
        xpReward: 15,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "Where is the... ? (لە کوێیە... ؟)",
            distractors: ["When is the... ?", "Who is the... ?"],
            solutionData: {
              correct: "Where is the... ?",
              instruction: "پرسیارکردن لە شوێن (Place Question)",
              icon: "📍",
              isSpeaking: true,
              spokenText: "Where is the hotel?",
            },
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "Left (چەپ) & Right (ڕاست) & Straight (ڕاستەوخۆ)",
            distractors: ["Up and Down", "Inside and Outside"],
            solutionData: {
              correct: "Left & Right & Straight",
              instruction: "ئاراستەکان (Direction Anchors)",
              icon: "🧭",
              isSpeaking: true,
              spokenText: "Left, Right, Straight",
            },
            order: 2,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و ئاراستەکە هەڵبژێرە",
            distractors: ["Turn left", "Stop here"],
            solutionData: {
              correct: "Turn right",
              spokenText: "Turn right",
              instruction: "ڕاهێنانی بیستنی ئاراستە (Acoustic Direction)",
              icon: "➡️",
            },
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "ببورە، هۆتێل لە کوێیە؟ (Excuse me, where is the hotel?)",
            distractors: ["airport", "is", "left"],
            solutionData: {
              tokens: ["Excuse", "me,", "where", "is", "the", "hotel?"],
              instruction: "ڕستەکە ڕێکبخە (Sentence Assembly)",
              icon: "🏨",
            },
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "Go straight, please (بڕۆ ڕێک، تکایە)",
            distractors: ["Turn around", "Stay here"],
            solutionData: {
              correct: "Go straight, please",
              instruction: "دەنگدانەوە و وتار (Echo Mic)",
              icon: "🎙️",
              isSpeaking: true,
              type: "speak",
              spokenText: "Go straight, please",
            },
            order: 5,
          },
        ],
      },

      // -----------------------------------------------------------------------
      // LESSON 1.7: Level 1 Capstone Exam (تاقیکردنەوەی تەواوکاری ئاستی ١)
      // -----------------------------------------------------------------------
      {
        title: "1.7 Level 1 Capstone Exam & Dialogue (تاقیکردنەوەی کۆتایی ئاستی ١)",
        order: 7,
        xpReward: 30,
        exercises: [
          {
            type: "audio_match",
            promptText: "تاقیکردنەوە: گوێ بگرە و وەڵامی شیاو هەڵبژێرە",
            distractors: ["My name is Ahmad", "I'm from Kurdistan"],
            solutionData: {
              correct: "I'm great, thank you. What about you?",
              spokenText: "Hey! How are you doing today?",
              instruction: "تاقیکردنەوەی بیستن (Capstone Listening)",
              icon: "🎧",
            },
            order: 1,
          },
          {
            type: "word_bank",
            promptText: "خۆشحاڵم بە ناسینت، ناوم محەمەدە (Nice to meet you, my name is Mohammed)",
            distractors: ["your", "how", "coffee"],
            solutionData: {
              tokens: ["Nice", "to", "meet", "you,", "my", "name", "is", "Mohammed."],
              instruction: "داڕشتنی ڕستەی تەواو (Full Sentence Mastery)",
              icon: "🏆",
            },
            order: 2,
          },
          {
            type: "multiple_choice",
            promptText: "📩 Excuse me, do you want tea or coffee?",
            distractors: [
              "Turn right, please.",
              "I am fine, thank you.",
            ],
            solutionData: {
              correct: "I like coffee, please! Thank you.",
              instruction: "دیالۆگی خێرا (Rapid Dialogue)",
              icon: "💬",
              isSpeaking: true,
              spokenText: "I like coffee, please! Thank you.",
            },
            order: 3,
          },
          {
            type: "multiple_choice",
            promptText: "دەستەواژەی کۆتایی ئاستی ١ بڵێ: 'I am ready for Level 2!'",
            distractors: ["I want to stop", "See you later"],
            solutionData: {
              correct: "I am ready for Level 2!",
              instruction: "تاقیکردنەوەی وتاری کۆتایی (Graduation Speech Gate)",
              icon: "🎓",
              isSpeaking: true,
              type: "speak",
              spokenText: "I am ready for Level 2!",
            },
            order: 4,
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
