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
          // Screen 1: Word Anchors
          {
            type: "multiple_choice",
            promptText: "Hello / Hi / Hey (سڵاو)",
            distractors: ["Goodbye (ماڵئاوا)", "Good night (شەو شاد)"],
            solutionData: {
              correct: "Hello / Hi / Hey (سڵاو)",
              instruction: "پێناسەی وشە (Word Anchors)",
              icon: "👋",
              isSpeaking: true,
              spokenText: "Hello, Hi, Hey",
              transliteration: "هێڵۆو (Hello) / های (Hi) / هێی (Hey - نافەرمی)",
            },
            order: 1,
          },
          // Screen 2: Acoustic Match
          {
            type: "audio_match",
            promptText: "گوێ بگرە و وشەی بیستراو دیاری بکە",
            distractors: ["Hello", "Hey"],
            solutionData: {
              correct: "Hi",
              spokenText: "Hi",
              instruction: "ڕاهێنانی بیستن (Acoustic Match)",
              icon: "👂",
            },
            order: 2,
          },
          // Screen 3: The "How are you?" Deconstruction
          {
            type: "multiple_choice",
            promptText: "How are you? (هەواریو؟)",
            distractors: ["How do you do?", "Where are you?"],
            solutionData: {
              correct: "How are you? (چۆنیت؟)",
              instruction: "شیکردنەوەی پێکهاتەی ڕستە (Analytics Breakdown)",
              icon: "🔍",
              isSpeaking: true,
              spokenText: "How are you?",
              breakdown: [
                { word: "How", sound: "هەو", meaning: "چۆن" },
                { word: "are", sound: "ئاڕ", meaning: "هەیت" },
                { word: "you", sound: "یو", meaning: "تۆ" },
              ],
            },
            order: 3,
          },
          // Screen 4: The Echo Mic
          {
            type: "multiple_choice",
            promptText: "How are you? (هەواریو؟)",
            distractors: ["Who are you?", "Are you okay?"],
            solutionData: {
              correct: "How are you?",
              instruction: "ڕاهێنانی وتار و دەنگدانەوە (The Echo Mic)",
              icon: "🎙️",
              isSpeaking: true,
              type: "speak",
              spokenText: "How are you?",
            },
            order: 4,
          },
          // Screen 5: Status Adjectives Bank
          {
            type: "word_bank",
            promptText: "وەسفی بارودۆخ: زۆر باشم، سوپاس (I'm great, thank you)",
            distractors: ["bad", "is", "where"],
            solutionData: {
              tokens: ["I'm", "great,", "thank", "you."],
              instruction: "کۆکردنەوەی ڕستەی بارودۆخ (Status Adjectives)",
              icon: "✨",
            },
            order: 5,
          },
          // Screen 6: Slot-and-Filler Check
          {
            type: "multiple_choice",
            promptText: "I'm [ ___ ], thank you.",
            distractors: ["hello", "how", "are"],
            solutionData: {
              correct: "great",
              instruction: "بۆشاییەکە بە وشەی گونجاو پڕبکەرەوە (Slot-and-Filler)",
              icon: "🧩",
              isSpeaking: true,
              spokenText: "I'm great, thank you.",
            },
            order: 6,
          },
          // Screen 7: Conversational Response Pairing
          {
            type: "multiple_choice",
            promptText: "وەڵامی دروست چییە بۆ: 'How are you?'",
            distractors: ["Hello Ahmad", "Good morning"],
            solutionData: {
              correct: "I'm good, thank you",
              instruction: "جووتبەندکردنی وەڵامە کۆمەڵایەتییەکان (Response Pairing)",
              icon: "🤝",
              isSpeaking: true,
              spokenText: "I'm good, thank you",
            },
            order: 7,
          },
          // Screen 8: The Bounce-Back Anchor
          {
            type: "multiple_choice",
            promptText: "What about you? (وەرەباوتیو؟ / ئەی تۆ؟)",
            distractors: ["Say goodbye (ماڵئاوایی کردن)", "Give an order (فەرمان دان)"],
            solutionData: {
              correct: "Ask the question back (پرسیارەکە بە هەمان شێوە بپرسەوە)",
              instruction: "گەڕاندنەوەی پرسیارەکە (The Bounce-Back Anchor)",
              icon: "🔄",
              isSpeaking: true,
              spokenText: "What about you?",
            },
            order: 8,
          },
          // Screen 9: Interactive Chat Dialogue
          {
            type: "multiple_choice",
            promptText: "📩 Hey Ahmad, how are you?",
            distractors: [
              "I'm fine, thank you. Hi Sara.",
              "Hello, me too.",
            ],
            solutionData: {
              correct: "I'm cool, thank you. What about you?",
              instruction: "دیالۆگ و چاتی زیندوو (Interactive Chat Dialogue)",
              icon: "💬",
              isSpeaking: true,
              spokenText: "I'm cool, thank you. What about you?",
            },
            order: 9,
          },
          // Screen 10: Capstone Spoken Handshake
          {
            type: "multiple_choice",
            promptText: "وەڵام بدەرەوە و پرسیارەکە بگەڕێنەوە: 'Hey, how are you?'",
            distractors: ["Goodbye", "Nice to meet you"],
            solutionData: {
              correct: "I'm good, thank you. What about you?",
              instruction: "تاقیکردنەوەی کۆتایی دەنگ (Capstone Spoken Handshake)",
              icon: "⏱️",
              isSpeaking: true,
              type: "speak",
              timerSeconds: 4,
              spokenText: "I'm good, thank you. What about you?",
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
