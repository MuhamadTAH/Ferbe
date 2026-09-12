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

const COURSE = {
  title: "English for Kurdish Speakers (ئینگلیزی بۆ کورد)",
  slug: "english-from-kurdish",
  sourceLanguage: "ckb",
  targetLanguage: "en",
};

const UNITS: UnitInput[] = [
  // =========================================================================
  // UNIT 1: سڵاوکردن و ناساندن (Greetings & Introductions)
  // =========================================================================
  {
    title: "سڵاوکردن و ناساندن (Greetings & Introductions)",
    order: 1,
    lessons: [
      {
        title: "سڵاو و دەستپێک (Hellos & Greetings)",
        order: 1,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "سڵاو",
            solutionData: { correct: "Hello" },
            distractors: ["Goodbye", "Night", "Bad"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "بەیانی باش",
            solutionData: { correct: "Good morning" },
            distractors: ["Good evening", "Goodbye", "Good night"],
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "سڵاو، بەیانیت باش",
            solutionData: { tokens: ["Hello,", "good", "morning"] },
            distractors: ["night", "bye", "I"],
            order: 3,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و وشەکە هەڵبژێرە (Listen & Match)",
            solutionData: {
              correct: "Good morning",
              audioLang: "english",
            },
            distractors: ["Good night", "Goodbye", "Hello"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "خواحافیز",
            solutionData: { correct: "Goodbye" },
            distractors: ["Hello", "Please", "Morning"],
            order: 5,
          },
          {
            type: "word_bank",
            promptText: "سڵاو و خواحافیز",
            solutionData: { tokens: ["Hello", "and", "goodbye"] },
            distractors: ["morning", "night", "yes"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "ئێوارە باش",
            solutionData: { correct: "Good evening" },
            distractors: ["Good morning", "Good night", "Hello"],
            order: 7,
          },
          {
            type: "word_bank",
            promptText: "خواحافیز، شەو شاد",
            solutionData: { tokens: ["Goodbye,", "good", "night"] },
            distractors: ["morning", "hello", "day"],
            order: 8,
          },
        ],
      },
      {
        title: "من کێم؟ (Personal Pronouns & 'To be')",
        order: 2,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "من خوێندکارم",
            solutionData: { correct: "I am a student" },
            distractors: ["You are a student", "She is a teacher", "I have a book"],
            order: 1,
          },
          {
            type: "word_bank",
            promptText: "من مامۆستام",
            solutionData: { tokens: ["I", "am", "a", "teacher"] },
            distractors: ["you", "he", "student"],
            order: 2,
          },
          {
            type: "multiple_choice",
            promptText: "تۆ هاوڕێی منی",
            solutionData: { correct: "You are my friend" },
            distractors: ["He is my friend", "I am your friend", "She is happy"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "ئەو دڵخۆشە",
            solutionData: { tokens: ["She", "is", "happy"] },
            distractors: ["sad", "I", "am"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "ئێمە ئامادەین",
            solutionData: { correct: "We are ready" },
            distractors: ["They are ready", "You are ready", "I am ready"],
            order: 5,
          },
          {
            type: "word_bank",
            promptText: "تۆ شایەنی ڕێزیت (سەرچاو)",
            solutionData: { tokens: ["You", "are", "welcome"] },
            distractors: ["I", "am", "good"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "ئەو کوڕە",
            solutionData: { correct: "He is a boy" },
            distractors: ["She is a girl", "I am a boy", "He is a man"],
            order: 7,
          },
          {
            type: "word_bank",
            promptText: "ئەو کچە خوێندکارە",
            solutionData: { tokens: ["She", "is", "a", "student"] },
            distractors: ["he", "teacher", "boy"],
            order: 8,
          },
        ],
      },
      {
        title: "ناو و ناسین (Names & Questions)",
        order: 3,
        xpReward: 10,
        exercises: [
          {
            type: "word_bank",
            promptText: "ناوت چییە؟",
            solutionData: { tokens: ["What", "is", "your", "name?"] },
            distractors: ["how", "my", "who"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "ناوی من ئازادە",
            solutionData: { correct: "My name is Azad" },
            distractors: ["Your name is Azad", "His name is Azad", "What is your name?"],
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "چۆنیت؟",
            solutionData: { tokens: ["How", "are", "you?"] },
            distractors: ["what", "who", "I"],
            order: 3,
          },
          {
            type: "multiple_choice",
            promptText: "من باشم، سوپاس",
            solutionData: { correct: "I am fine, thank you" },
            distractors: ["My name is fine", "How are you?", "You are welcome"],
            order: 4,
          },
          {
            type: "word_bank",
            promptText: "خۆشحاڵم بە ناسینت",
            solutionData: { tokens: ["Nice", "to", "meet", "you"] },
            distractors: ["see", "good", "bye"],
            order: 5,
          },
          {
            type: "multiple_choice",
            promptText: "ئەو کێیە؟",
            solutionData: { correct: "Who is he?" },
            distractors: ["What is he?", "Where is he?", "How is he?"],
            order: 6,
          },
          {
            type: "word_bank",
            promptText: "ناوی ئەو چییە؟",
            solutionData: { tokens: ["What", "is", "her", "name?"] },
            distractors: ["his", "your", "my"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و دەستەواژەکە دیاری بکە",
            solutionData: {
              correct: "Nice to meet you",
              audioLang: "english",
            },
            distractors: ["Good morning", "What is your name?", "How are you?"],
            order: 8,
          },
        ],
      },
      {
        title: "ڕێزگرتن و قسەی باو (Politeness & Courtesy)",
        order: 4,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "تکایە",
            solutionData: { correct: "Please" },
            distractors: ["Thank you", "Sorry", "Yes"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "سوپاس",
            solutionData: { correct: "Thank you" },
            distractors: ["Please", "Hello", "No"],
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "بەڵێ، تکایە",
            solutionData: { tokens: ["Yes,", "please"] },
            distractors: ["no", "thank", "you"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "نەخێر، سوپاس",
            solutionData: { tokens: ["No,", "thank", "you"] },
            distractors: ["yes", "please", "sorry"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "ببورە",
            solutionData: { correct: "Sorry" },
            distractors: ["Welcome", "Please", "Fine"],
            order: 5,
          },
          {
            type: "word_bank",
            promptText: "بێزەحمەت، یارمەتیم بدە",
            solutionData: { tokens: ["Excuse", "me,", "help", "me"] },
            distractors: ["please", "sorry", "you"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "زۆر سوپاس",
            solutionData: { correct: "Thank you very much" },
            distractors: ["Please very much", "You are welcome", "Excuse me"],
            order: 7,
          },
          {
            type: "word_bank",
            promptText: "ببورە، من درەنگ کەوتم",
            solutionData: { tokens: ["Sorry,", "I", "am", "late"] },
            distractors: ["early", "you", "are"],
            order: 8,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // UNIT 2: ژیانی ڕۆژانە و خێزان (Daily Life & Family)
  // =========================================================================
  {
    title: "ژیانی ڕۆژانە و خێزان (Daily Life & Family)",
    order: 2,
    lessons: [
      {
        title: "خێزانەکەم (My Family)",
        order: 1,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "باوک و دایک",
            solutionData: { correct: "Father and mother" },
            distractors: ["Brother and sister", "Son and daughter", "Boy and girl"],
            order: 1,
          },
          {
            type: "word_bank",
            promptText: "ئەمە باوکمە",
            solutionData: { tokens: ["This", "is", "my", "father"] },
            distractors: ["mother", "brother", "sister"],
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "ئەمە دایکمە",
            solutionData: { tokens: ["This", "is", "my", "mother"] },
            distractors: ["father", "friend", "sister"],
            order: 3,
          },
          {
            type: "multiple_choice",
            promptText: "من برام هەیە",
            solutionData: { correct: "I have a brother" },
            distractors: ["I have a sister", "I am a brother", "You have a brother"],
            order: 4,
          },
          {
            type: "word_bank",
            promptText: "ئەو خوشکمە",
            solutionData: { tokens: ["She", "is", "my", "sister"] },
            distractors: ["he", "brother", "mother"],
            order: 5,
          },
          {
            type: "multiple_choice",
            promptText: "کوڕەکەم و کچەکەم",
            solutionData: { correct: "My son and my daughter" },
            distractors: ["My brother and my sister", "My father and my mother", "A boy and a girl"],
            order: 6,
          },
          {
            type: "word_bank",
            promptText: "خێزانەکەم لە هەولێرن",
            solutionData: { tokens: ["My", "family", "is", "in", "Erbil"] },
            distractors: ["Sulaimani", "house", "we"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و ڕستەکە دیاری بکە",
            solutionData: {
              correct: "This is my family",
              audioLang: "english",
            },
            distractors: ["This is my brother", "I have a sister", "My father is a teacher"],
            order: 8,
          },
        ],
      },
      {
        title: "خواردن و خواردنەوە (Food & Drinks)",
        order: 2,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "ئاو",
            solutionData: { correct: "Water" },
            distractors: ["Tea", "Bread", "Milk"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "نان و چای",
            solutionData: { correct: "Bread and tea" },
            distractors: ["Coffee and milk", "Water and apple", "Bread and butter"],
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "من چا دەخۆمەوە",
            solutionData: { tokens: ["I", "drink", "tea"] },
            distractors: ["coffee", "eat", "bread"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "ئایا قاوەت دەوێت؟",
            solutionData: { tokens: ["Do", "you", "want", "coffee?"] },
            distractors: ["tea", "drink", "water"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "شیر و سێو",
            solutionData: { correct: "Milk and apple" },
            distractors: ["Water and bread", "Tea and coffee", "Fish and rice"],
            order: 5,
          },
          {
            type: "word_bank",
            promptText: "من نان دەخۆم",
            solutionData: { tokens: ["I", "eat", "bread"] },
            distractors: ["drink", "tea", "water"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "قاوەیەکی گەرم، تکایە",
            solutionData: { correct: "Hot coffee, please" },
            distractors: ["Cold water, please", "Sweet tea, please", "Fresh milk, please"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و وشەکە دیاری بکە",
            solutionData: {
              correct: "I want water",
              audioLang: "english",
            },
            distractors: ["I drink tea", "Do you want coffee?", "Bread and milk"],
            order: 8,
          },
        ],
      },
      {
        title: "وەسفکردنی سادە (Simple Descriptions)",
        order: 3,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "ماڵێکی گەورە",
            solutionData: { correct: "A big house" },
            distractors: ["A small house", "A new car", "A good day"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "کتێبێکی نوێ",
            solutionData: { correct: "A new book" },
            distractors: ["An old book", "A big car", "A small city"],
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "ئەم شارە گەورەیە",
            solutionData: { tokens: ["This", "city", "is", "big"] },
            distractors: ["small", "house", "good"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "ئەمڕۆ ڕۆژێکی باشە",
            solutionData: { tokens: ["Today", "is", "a", "good", "day"] },
            distractors: ["bad", "night", "new"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "ئەو دڵخۆشە",
            solutionData: { correct: "She is happy" },
            distractors: ["He is sad", "I am tired", "We are ready"],
            order: 5,
          },
          {
            type: "word_bank",
            promptText: "ئۆتۆمبێلێکی بچووک",
            solutionData: { tokens: ["A", "small", "car"] },
            distractors: ["big", "house", "new"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "قوتابخانەیەکی نوێ",
            solutionData: { correct: "A new school" },
            distractors: ["An old school", "A big market", "A small room"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و ڕستەکە دیاری بکە",
            solutionData: {
              correct: "A good book",
              audioLang: "english",
            },
            distractors: ["A new house", "A big city", "A small cat"],
            order: 8,
          },
        ],
      },
      {
        title: "ڕۆژانی هەفتە و کات (Days & Time)",
        order: 4,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "شەو شاد",
            solutionData: { correct: "Good night" },
            distractors: ["Good morning", "Good evening", "Goodbye"],
            order: 1,
          },
          {
            type: "word_bank",
            promptText: "سبەینێ دەتبینمەوە",
            solutionData: { tokens: ["See", "you", "tomorrow"] },
            distractors: ["today", "yesterday", "good"],
            order: 2,
          },
          {
            type: "multiple_choice",
            promptText: "ئەمڕۆ چییە؟",
            solutionData: { correct: "What day is today?" },
            distractors: ["Where are you today?", "How are you tomorrow?", "Good morning today"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "ئەمڕۆ هەینییە",
            solutionData: { tokens: ["Today", "is", "Friday"] },
            distractors: ["Monday", "tomorrow", "night"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "دوێنێ",
            solutionData: { correct: "Yesterday" },
            distractors: ["Tomorrow", "Today", "Now"],
            order: 5,
          },
          {
            type: "word_bank",
            promptText: "ڕۆژ و شەو",
            solutionData: { tokens: ["Day", "and", "night"] },
            distractors: ["morning", "today", "tomorrow"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "کاتژمێر چەندە؟",
            solutionData: { correct: "What time is it?" },
            distractors: ["What day is it?", "How much is it?", "Where is it?"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و ڕستەکە بدۆزەرەوە",
            solutionData: {
              correct: "See you tomorrow",
              audioLang: "english",
            },
            distractors: ["Good morning", "Good night", "See you today"],
            order: 8,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // UNIT 3: ژمارەکان و شوێن (Numbers & Places)
  // =========================================================================
  {
    title: "ژمارەکان و شوێن (Numbers & Places)",
    order: 3,
    lessons: [
      {
        title: "ژمارە ١ تا ١٠ (Numbers 1 to 10)",
        order: 1,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "یەک، دوو، سێ",
            solutionData: { correct: "One, two, three" },
            distractors: ["Four, five, six", "Seven, eight, nine", "Ten, nine, eight"],
            order: 1,
          },
          {
            type: "word_bank",
            promptText: "من دوو برام هەیە",
            solutionData: { tokens: ["I", "have", "two", "brothers"] },
            distractors: ["three", "sisters", "one"],
            order: 2,
          },
          {
            type: "multiple_choice",
            promptText: "پێنج پیاڵە چا",
            solutionData: { correct: "Five cups of tea" },
            distractors: ["Four cups of water", "Two cups of coffee", "Three apples"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "چوار کتێب",
            solutionData: { tokens: ["Four", "books"] },
            distractors: ["five", "pencils", "three"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "دە خوێندکار",
            solutionData: { correct: "Ten students" },
            distractors: ["Five students", "Seven teachers", "Eight boys"],
            order: 5,
          },
          {
            type: "word_bank",
            promptText: "شەش، حەوت، هەشت",
            solutionData: { tokens: ["Six,", "seven,", "eight"] },
            distractors: ["nine", "ten", "five"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "نۆ و دە",
            solutionData: { correct: "Nine and ten" },
            distractors: ["One and two", "Three and four", "Five and six"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و ژمارەکان دیاری بکە",
            solutionData: {
              correct: "One, two, three",
              audioLang: "english",
            },
            distractors: ["Four, five, six", "Seven, eight, nine", "Ten, nine, eight"],
            order: 8,
          },
        ],
      },
      {
        title: "شوێن و شارەکان (Places & Cities)",
        order: 2,
        xpReward: 10,
        exercises: [
          {
            type: "word_bank",
            promptText: "من لە کوردستان دەژیم",
            solutionData: { tokens: ["I", "live", "in", "Kurdistan"] },
            distractors: ["city", "work", "school"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "ئێمە لە ماڵەوەین",
            solutionData: { correct: "We are at home" },
            distractors: ["They are at school", "I am at work", "She is in the market"],
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "ئەو دەچێتە قوتابخانە",
            solutionData: { tokens: ["He", "goes", "to", "school"] },
            distractors: ["she", "market", "home"],
            order: 3,
          },
          {
            type: "multiple_choice",
            promptText: "بازاڕەکە لەکوێیە؟",
            solutionData: { correct: "Where is the market?" },
            distractors: ["What is the market?", "Who is in the market?", "How is the school?"],
            order: 4,
          },
          {
            type: "word_bank",
            promptText: "هەولێر شارێکی گەورەیە",
            solutionData: { tokens: ["Erbil", "is", "a", "big", "city"] },
            distractors: ["small", "Sulaimani", "Kurdistan"],
            order: 5,
          },
          {
            type: "multiple_choice",
            promptText: "سلێمانی شارێکی جوانە",
            solutionData: { correct: "Sulaimani is a beautiful city" },
            distractors: ["Erbil is a big city", "Kurdistan is my home", "Duhok is small"],
            order: 6,
          },
          {
            type: "word_bank",
            promptText: "من دەچمە سەر کار",
            solutionData: { tokens: ["I", "go", "to", "work"] },
            distractors: ["school", "home", "market"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و شارەکە دیاری بکە",
            solutionData: {
              correct: "I live in Erbil",
              audioLang: "english",
            },
            distractors: ["I live in Sulaimani", "We are at home", "He goes to school"],
            order: 8,
          },
        ],
      },
      {
        title: "پیشەکان (Jobs & Occupations)",
        order: 3,
        xpReward: 10,
        exercises: [
          {
            type: "multiple_choice",
            promptText: "مامۆستا",
            solutionData: { correct: "Teacher" },
            distractors: ["Doctor", "Student", "Engineer"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "پزیشک",
            solutionData: { correct: "Doctor" },
            distractors: ["Teacher", "Driver", "Nurse"],
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "باوکم پزیشکە",
            solutionData: { tokens: ["My", "father", "is", "a", "doctor"] },
            distractors: ["teacher", "mother", "student"],
            order: 3,
          },
          {
            type: "word_bank",
            promptText: "خوشکم ئەندازیارە",
            solutionData: { tokens: ["My", "sister", "is", "an", "engineer"] },
            distractors: ["doctor", "brother", "teacher"],
            order: 4,
          },
          {
            type: "multiple_choice",
            promptText: "من خوێندکاری ئینگلیزیم",
            solutionData: { correct: "I am an English student" },
            distractors: ["I am a Kurdish teacher", "She is a doctor", "He is an engineer"],
            order: 5,
          },
          {
            type: "word_bank",
            promptText: "ئەو مامۆستایەکی باشە",
            solutionData: { tokens: ["She", "is", "a", "good", "teacher"] },
            distractors: ["doctor", "student", "bad"],
            order: 6,
          },
          {
            type: "multiple_choice",
            promptText: "ئیشی تۆ چییە؟",
            solutionData: { correct: "What is your job?" },
            distractors: ["Where is your job?", "How is your job?", "Who is your teacher?"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و پیشەکە بدۆزەرەوە",
            solutionData: {
              correct: "My mother is a teacher",
              audioLang: "english",
            },
            distractors: ["My father is a doctor", "I am a student", "She is an engineer"],
            order: 8,
          },
        ],
      },
      {
        title: "کورتەی یەکە (Unit 3 Mastery Review)",
        order: 4,
        xpReward: 10,
        exercises: [
          {
            type: "word_bank",
            promptText: "سڵاو، من ئازادم و لە هەولێر دەژیم",
            solutionData: { tokens: ["Hello,", "I", "am", "Azad", "and", "I", "live", "in", "Erbil"] },
            distractors: ["Sulaimani", "doctor", "father"],
            order: 1,
          },
          {
            type: "multiple_choice",
            promptText: "ئایا تۆ ئینگلیزی دەزانیت؟",
            solutionData: { correct: "Do you speak English?" },
            distractors: ["Do you drink water?", "Where do you live?", "What is your name?"],
            order: 2,
          },
          {
            type: "word_bank",
            promptText: "بەڵێ، کەمێک ئینگلیزی دەزانم",
            solutionData: { tokens: ["Yes,", "I", "speak", "a", "little", "English"] },
            distractors: ["no", "Kurdish", "tea"],
            order: 3,
          },
          {
            type: "multiple_choice",
            promptText: "بەخێربێن بۆ کوردستان",
            solutionData: { correct: "Welcome to Kurdistan" },
            distractors: ["Goodbye Kurdistan", "Thank you Kurdistan", "Where is Kurdistan?"],
            order: 4,
          },
          {
            type: "word_bank",
            promptText: "ئێمە خوێندکاری زانکۆین",
            solutionData: { tokens: ["We", "are", "university", "students"] },
            distractors: ["teachers", "doctors", "school"],
            order: 5,
          },
          {
            type: "multiple_choice",
            promptText: "ڕۆژێکی خۆش بۆ هەمووان",
            solutionData: { correct: "Have a nice day everyone" },
            distractors: ["Good night everyone", "Goodbye everyone", "Hello everyone"],
            order: 6,
          },
          {
            type: "word_bank",
            promptText: "سوپاس و خواحافیز",
            solutionData: { tokens: ["Thank", "you", "and", "goodbye"] },
            distractors: ["please", "hello", "welcome"],
            order: 7,
          },
          {
            type: "audio_match",
            promptText: "گوێ بگرە و دەستەواژەکە دیاری بکە",
            solutionData: {
              correct: "Welcome to Kurdistan",
              audioLang: "english",
            },
            distractors: ["I live in Kurdistan", "Have a nice day", "Thank you very much"],
            order: 8,
          },
        ],
      },
    ],
  },
];

async function seedEnglishCourse() {
  console.log("=== Seeding English for Kurdish Speakers (ئینگلیزی بۆ کورد) ===");

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
  const adminSecret = process.env.ADMIN_SEED_SECRET;

  if (!adminSecret) {
    console.error("ADMIN_SEED_SECRET must be set in your environment.");
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  const totalExercises = UNITS.reduce(
    (acc, u) => acc + u.lessons.reduce((lAcc, l) => lAcc + l.exercises.length, 0),
    0
  );
  const totalLessons = UNITS.reduce((acc, u) => acc + u.lessons.length, 0);

  console.log(
    `Prepared ${UNITS.length} units, ${totalLessons} lessons, ${totalExercises} interactive exercises.`
  );

  try {
    const result = await client.mutation(api.admin.seedCurriculum, {
      adminSecret,
      course: COURSE,
      units: UNITS,
    });

    console.log("Course successfully seeded!");
    console.log(`Course slug: ${result.courseSlug}`);
    console.log(`Lessons upserted: ${result.lessonsUpserted}`);
    console.log(`Exercises written: ${result.exercisesWritten}`);
  } catch (err) {
    console.error("Failed to seed course:", err);
    process.exit(1);
  }
}

seedEnglishCourse();
