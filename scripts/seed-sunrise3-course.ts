import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { SUNRISE3_WORD_IMAGES } from "./sunrise3-word-images";

// ===========================================================================
// Sunrise 3 — full course seed.
//
// Every one of the 18 units is built from the three recurring Sunrise 3 lessons:
//   Lesson 1 = Practice 1  — Vocabulary Audio-Visual Drill
//   Lesson 2 = Practice 2  — Multi-Panel Story Dialogue
//   Lesson 3 = Practice 4/5/6 — Alphabet, Spelling, Phonics & Punctuation
// and the specialised practices (3, 7, 8, 9, 10, 12) are appended to the lesson
// the book places them in. Song practice (11) was dropped by author decision.
//
// All 12 practices are expressed through the existing view subtypes dispatched
// in src/app/learn/[lessonId]/page.tsx — no schema change is required.
// ===========================================================================

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
  title: "Sunrise 3 — English for Kurdish Schools (ئینگلیزی پۆلی ٣)",
  slug: "sunrise-3",
  sourceLanguage: "ckb",
  targetLanguage: "en",
};

// ---------------------------------------------------------------------------
// Course shape — 18 units (Map of the book, p.2–3).
// ---------------------------------------------------------------------------
const UNIT_TOPICS: { title: string; topic: string }[] = [
  { title: "Unit 1: Review of Level 2 (پێداچوونەوەی ئاستی ٢)", topic: "Review: Alphabet, to be/to have" },
  { title: "Unit 2: Review of Level 2 (پێداچوونەوەی ئاستی ٢)", topic: "Review: Present continuous" },
  { title: "Unit 3: Jobs (پیشەکان)", topic: "Jobs" },
  { title: "Unit 4: Happy or sad? (دڵخۆش یان خەمگین؟)", topic: "Happy or sad?" },
  { title: "Unit 5: Transport (گواستنەوە)", topic: "Transport" },
  { title: "Unit 6: School things (کەلوپەلی قوتابخانە)", topic: "School things" },
  { title: "Unit 7: Furniture (کەلوپەلی ماڵ)", topic: "Furniture" },
  { title: "Unit 8: Animals (ئاژەڵان)", topic: "Animals" },
  { title: "Unit 9: Activities at home (چالاکی لە ماڵ)", topic: "Activities at home" },
  { title: "Unit 10: Activities outside (چالاکی دەرەوە)", topic: "Activities outside" },
  { title: "Unit 11: Food (خواردن)", topic: "Food" },
  { title: "Unit 12: Parts of the body (بەشەکانی لەش)", topic: "Parts of the body" },
  { title: "Unit 13: Drinks (خواردنەوە)", topic: "Drinks" },
  { title: "Unit 14: Clothes (جلوبەرگ)", topic: "Clothes" },
  { title: "Unit 15: My family (خێزانەکەم)", topic: "My family" },
  { title: "Unit 16: Possessions (خاوەندارێتی)", topic: "Possessions" },
  { title: "Unit 17: Talking about days (قسەکردن دەربارەی ڕۆژەکان)", topic: "Talking about days" },
  { title: "Unit 18: Review all units (پێداچوونەوەی گشتی)", topic: "Review all units" },
];

const LESSON_ACTIVITY: Record<number, string> = {
  1: "Listen and say (Practice 1 — Vocabulary)",
  2: "Listen and read. Say. (Practice 2 — Story)",
  3: "Listen and repeat. Then circle and say. (Practice 4/5/6 — Spelling & Phonics)",
  4: "Revision — Boss Battle (Practice 12)",
};

// ---------------------------------------------------------------------------
// Word model. `image` is only set where a real picture was cropped from the
// book; everywhere else the emoji is used (per the image-sourcing rule).
// ---------------------------------------------------------------------------
interface Word {
  english: string;
  /** Kurdish (Sorani) pronunciation helper. */
  pron: string;
  /** Kurdish (Sorani) meaning. */
  meaning: string;
  article: string;
  emoji: string;
  image?: string;
}

interface UnitData {
  /** Short topic used by generators. */
  topic: string;
  words: Word[];
  /** Lesson 2 story lines (from the book). */
  story: string[];
  /** Lesson 3 pronunciation / spelling list (from the book). */
  phonics: string[];
  /** Lesson 3 "Add punctuation" sentences, when the book has them. */
  punctuation?: string[];
}

const w = (
  english: string,
  pron: string,
  meaning: string,
  emoji: string,
  article = "a",
  image?: string
): Word => ({ english, pron, meaning, emoji, article, image });

const UNIT_DATA: UnitData[] = [
  {
    topic: "Review: Alphabet, to be/to have",
    words: [
      w("cap", "کاپ", "شەپکە", "🧢"),
      w("hat", "هات", "کڵاو", "🎩"),
      w("pen", "پێن", "قەڵەم", "🖊️"),
      w("car", "کار", "ئۆتۆمبێل", "🚗"),
      w("apple", "ئاپڵ", "سێو", "🍎", "an"),
    ],
    story: [
      "Hello! My name's Sirwa.",
      "He's Nabaz.",
      "He has a pen.",
      "I have a yo-yo.",
      "Wow!",
      "I have a car.",
      "She has an apple.",
      "He has a cat.",
    ],
    phonics: ["ant", "cat", "apple", "hat", "pen"],
    punctuation: ["I have a car.", "She has an apple.", "He has a cat."],
  },
  {
    topic: "Review: Present continuous",
    words: [
      w("banana", "بەنانا", "مۆز", "🍌"),
      w("spider", "سپایدەر", "جاڵجاڵۆکە", "🕷️"),
      w("flower", "فڵاوەر", "گوڵ", "🌸"),
      w("van", "ڤان", "ڤان", "🚐"),
      w("rabbit", "ڕابیت", "کەروێشک", "🐰"),
      w("teeth", "تیث", "ددان", "🦷"),
    ],
    story: [
      "What are you doing?",
      "I'm washing my face.",
      "What are you doing?",
      "I'm cleaning my teeth.",
      "My name's Jack. What's your name?",
      "My name's Emma.",
      "I'm playing with my rabbit.",
    ],
    phonics: ["van", "flower", "banana", "spider", "this", "that"],
    punctuation: ["What are you doing?", "I'm washing my face.", "What's your name?", "I'm Emma."],
  },
  {
    topic: "Jobs",
    words: [
      w("doctor", "دۆکتەر", "پزیشک", "👨‍⚕️", "a", "/images/sunrise3/jobs/doctor.png"),
      w("nurse", "نێرس", "پەرستار", "👩‍⚕️", "a", "/images/sunrise3/jobs/nurse.png"),
      w("teacher", "تیچەر", "مامۆستا", "👩‍🏫", "a", "/images/sunrise3/jobs/teacher.png"),
      w("policeman", "پۆلیسمەن", "پۆلیس", "👮", "a", "/images/sunrise3/jobs/policeman.png"),
      w("chef", "شێف", "چێشتلێنەر", "👨‍🍳", "a", "/images/sunrise3/jobs/chef.png"),
      w("firefighter", "فایەرفایتەر", "ئاگرکوژێنەرەوە", "👨‍🚒", "a", "/images/sunrise3/jobs/firefighter.png"),
    ],
    story: [
      "Hello! We're firefighters!",
      "He's a chef!",
      "They're firefighters! Wow!",
      "Sorry!",
      "I'm a nurse. You're a doctor.",
      "I'm a doctor.",
      "He's a chef.",
      "You're a firefighter.",
    ],
    phonics: ["doctor", "orange", "box", "yoghurt", "doll", "top"],
    punctuation: ["She's a nurse.", "I'm a teacher.", "They're doctors.", "You're a firefighter."],
  },
  {
    topic: "Happy or sad?",
    words: [
      w("tall", "تاڵ", "بەرز", "📏"),
      w("short", "شۆرت", "کورت", "📐"),
      w("happy", "هاپی", "دڵخۆش", "😀"),
      w("sad", "ساد", "خەمگین", "😢"),
      w("old", "ئۆڵد", "بەساڵاچوو", "👴"),
      w("young", "یانگ", "گەنج", "👦"),
    ],
    story: [
      "Look at Nabaz. He isn't happy.",
      "Wow! That's very big!",
      "I'm not sad! I'm happy!",
      "Look!",
      "Nabaz! You're sad!",
      "What's the matter?",
    ],
    phonics: ["jug", "up", "duck", "nut", "umbrella", "young"],
    punctuation: ["You aren't tall.", "I'm not old.", "They aren't happy.", "It isn't small."],
  },
  {
    topic: "Transport",
    words: [
      w("boat", "بۆت", "بەلەم", "⛵"),
      w("car", "کار", "ئۆتۆمبێل", "🚗"),
      w("bus", "باس", "پاس", "🚌"),
      w("plane", "پڵەین", "فڕۆکە", "✈️"),
      w("van", "ڤان", "ڤان", "🚐"),
      w("train", "ترەین", "قەتار", "🚆"),
    ],
    story: [
      "What is it?",
      "Is it big? Yes, it is.",
      "Is it small? No, it isn't.",
      "It's a train!",
      "Are they big? Yes, they are.",
    ],
    phonics: ["train", "plane", "gate", "grey", "they"],
  },
  {
    topic: "School things",
    words: [
      w("pen", "پێن", "قەڵەم", "🖊️"),
      w("pencil", "پێنسڵ", "قەڵەمی دار", "✏️"),
      w("eraser", "ئێرەیسەر", "سڕەرەوە", "🧽", "an"),
      w("ruler", "ڕوولەر", "خەتکێش", "📏"),
      w("notebook", "نۆتبووک", "دفتر", "📓"),
      w("crayon", "کرەیۆن", "ڕەنگچە", "🖍️"),
    ],
    story: [
      "What's in your box, Nabaz?",
      "There's a pen.",
      "There are two pencils.",
      "There's a spider in my bag!",
      "There are twenty-five crayons.",
    ],
    phonics: ["notebook", "look", "goodbye", "goodnight"],
    punctuation: ["There is a pen.", "There are two pencils.", "There are twenty-five crayons.", "There is an eraser."],
  },
  {
    topic: "Furniture",
    words: [
      w("chair", "چێر", "کورسی", "🪑"),
      w("table", "تەیبڵ", "مێز", "🍽️"),
      w("sofa", "سۆفا", "قەنەفە", "🛋️"),
      w("desk", "دێسک", "مێزی خوێندن", "🪑"),
      w("lamp", "لامپ", "چرای ڕووناکی", "💡"),
      w("bed", "بێد", "قەرەوێڵە", "🛏️"),
    ],
    story: [
      "Where's Lucky?",
      "He's on the chair!",
      "He's under the desk.",
      "He's on the lamp!",
      "He's under the sofa.",
      "He's in the box!",
    ],
    phonics: ["desk", "bed", "pen", "pencil", "leg", "insect"],
  },
  {
    topic: "Animals",
    words: [
      w("cow", "کاو", "مانگا", "🐄"),
      w("horse", "هۆرس", "ئەسپ", "🐴"),
      w("sheep", "شیپ", "مەڕ", "🐑"),
      w("goat", "گۆت", "بزن", "🐐"),
      w("cat", "کات", "پشیلە", "🐱"),
      w("dog", "دۆگ", "سەگ", "🐶"),
    ],
    story: [
      "I have a cat,",
      "You have a cow,",
      "He has a monkey and a mouse.",
      "She has a sheep,",
      "They have a horse,",
      "We have fun in my house!",
      "I have a goat.",
      "You have two goats.",
      "They have lots of goats.",
    ],
    phonics: ["teacher", "policeman", "queen", "three", "sheep", "green"],
    punctuation: ["She has two oranges.", "They have three dolls.", "We have two tops.", "I have four dogs."],
  },
  {
    topic: "Activities at home",
    words: [
      w("read", "ڕید", "خوێندنەوە", "📖"),
      w("talk", "تۆک", "قسەکردن", "💬"),
      w("look", "لووک", "سەیرکردن", "👀"),
      w("write", "ڕایت", "نووسین", "✍️"),
      w("eat", "ئیت", "خواردن", "🍽️"),
      w("drink", "درینک", "خواردنەوە", "🥤"),
    ],
    story: [
      "He's reading.",
      "She's writing.",
      "It's drinking.",
      "It's eating the food!",
      "He's eating.",
      "She's reading.",
      "It's looking.",
      "He's talking.",
    ],
    phonics: ["reading", "talking", "looking", "writing", "eating", "drinking"],
  },
  {
    topic: "Activities outside",
    words: [
      w("run", "ڕان", "ڕاکردن", "🏃"),
      w("jump", "جامپ", "بازدان", "🤸"),
      w("walk", "وۆک", "پیاسەکردن", "🚶"),
      w("ride a horse", "ڕاید ئە هۆرس", "سواربوونی ئەسپ", "🏇"),
      w("listen", "لیسن", "گوێگرتن", "👂"),
      w("sing", "سینگ", "گۆرانیوتن", "🎤"),
    ],
    story: [
      "Look at Nabaz.",
      "He's listening to music.",
      "He isn't running,",
      "He isn't walking.",
      "He's singing a happy song. Look!",
      "She isn't talking,",
      "She isn't riding,",
      "She's reading a picture book!",
    ],
    phonics: ["write", "firefighter", "kite", "tiger", "ride"],
    punctuation: ["He's jumping.", "She isn't walking.", "He isn't eating.", "She's running."],
  },
  {
    topic: "Food",
    words: [
      w("biscuits", "بیسکیتس", "بسکێت", "🍪"),
      w("kebabs", "کەبابس", "کەباب", "🍢"),
      w("pizza", "پیتزا", "پیتزا", "🍕"),
      w("chips", "چیپس", "چیپس", "🍟"),
      w("ice cream", "ئایس کریم", "ئایسکریم", "🍦", "an"),
      w("sandwiches", "ساندویچس", "ساندویچ", "🥪"),
    ],
    story: [
      "Where are the rabbits?",
      "They aren't eating carrots.",
      "They aren't drinking water.",
      "They're sleeping!",
      "They aren't sleeping.",
      "They aren't drinking.",
      "They're eating.",
    ],
    phonics: ["chips", "chair", "teacher", "sheep", "shirt", "she"],
  },
  {
    topic: "Parts of the body",
    words: [
      w("hand", "هاند", "دەست", "✋"),
      w("arm", "ئارم", "قۆڵ", "💪", "an"),
      w("leg", "لێگ", "قاچ", "🦵"),
      w("foot", "فووت", "پێ", "🦶"),
      w("head", "هێد", "سەر", "🙂"),
      w("neck", "نێک", "مل", "🧣"),
    ],
    story: [
      "Jack is at home. He's in his room.",
      "Is he reading a book? No, he isn't. Look!",
      "Is he playing the guitar? Yes, he is! He's a star!",
      "He's playing the guitar and Nabaz is singing!",
      "Where's Jack?",
      "Is he washing his hands?",
      "Is he reading a book? It's horrible!",
    ],
    phonics: ["foot", "feet", "happy", "egg", "apple", "rabbit", "umbrella"],
    punctuation: ["Is he singing?", "Is he playing the guitar?", "Is she washing her hands?", "Is she reading a book?"],
  },
  {
    topic: "Drinks",
    words: [
      w("milk", "میلک", "شیر", "🥛"),
      w("tea", "تی", "چا", "🍵"),
      w("coffee", "کۆفی", "قاوە", "☕"),
      w("water", "وۆتەر", "ئاو", "💧"),
      w("lemonade", "لێمۆنەید", "لیمۆنادە", "🍋"),
      w("orange juice", "ئۆرنج جووس", "شەربەتی پرتەقاڵ", "🍊", "an"),
    ],
    story: [
      "Are you looking at Nabaz and Sirwa?",
      "Yes, I am. They're running!",
      "Are they eating? No, they aren't.",
      "Are they drinking lemonade?",
      "Yes, they are! They're drinking a lot of lemonade!",
    ],
    phonics: ["listen", "milk", "big", "fig", "zip", "window"],
  },
  {
    topic: "Clothes",
    words: [
      w("shirt", "شێرت", "کراس", "👔"),
      w("trousers", "تراوزەرز", "پانتۆڵ", "👖"),
      w("T-shirt", "تی شێرت", "تیشێرت", "👕"),
      w("shoes", "شووز", "پێڵاو", "👟"),
      w("skirt", "سکێرت", "تەنوورە", "👗"),
      w("trainers", "ترەینەرز", "پێڵاوی وەرزشی", "👟"),
    ],
    story: [
      "What is Nabaz wearing?",
      "What is he wearing? He's wearing a big white hat. He's a chef.",
      "Yes, I'm sure of that!",
      "What are they wearing? They're wearing nice black caps. They're policemen.",
      "He's wearing trousers and a T-shirt.",
      "What are you wearing, Nabaz? I'm wearing a brown T-shirt.",
    ],
    phonics: ["shirt", "shoes", "sheep", "desk", "skirt", "ask"],
    punctuation: ["What are they wearing?", "Is she wearing trousers?", "Is he wearing a cap?", "Are they wearing T-shirts?"],
  },
  {
    topic: "My family",
    words: [
      w("mother", "مەدەر", "دایک", "👩"),
      w("father", "فادەر", "باوک", "👨"),
      w("sister", "سیستەر", "خوشک", "👧"),
      w("brother", "برەدەر", "برا", "👦"),
      w("grandmother", "گراند مەدەر", "داپیر", "👵"),
      w("grandfather", "گراند فادەر", "باپیر", "👴"),
    ],
    story: [
      "These are my pictures.",
      "Where are your yo-yos, Sirwa?",
      "They're in this room!",
      "This is our house.",
    ],
    phonics: ["mother", "father", "doctor", "listen", "sofa", "kitten"],
    punctuation: ["My watch is new.", "Your caps aren't new.", "Our car isn't big.", "Your school isn't old."],
  },
  {
    topic: "Possessions",
    words: [
      w("watch", "وۆچ", "کاتژمێر", "⌚"),
      w("bag", "باگ", "جانتا", "🎒"),
      w("bicycle", "بایسیکڵ", "پاسکیل", "🚲"),
      w("CD", "سی دی", "سی دی", "💿"),
      w("magazine", "ماگەزین", "گۆڤار", "📖"),
      w("mobile phone", "مۆبایل فۆن", "مۆبایلی دەست", "📱"),
    ],
    story: [
      "Her watch is small. His watch is big.",
      "Their bicycle is very big!",
      "We're sharing our toys, look, look, look!",
      "We're sharing his bicycle and my book,",
      "We're sharing her dolls and their CDs,",
      "We're sharing our toys, my friends and me!",
    ],
    phonics: ["bag", "magazine", "kebab", "sandwich", "cat", "van"],
  },
  {
    topic: "Talking about days",
    words: [
      w("Saturday", "ساتەردەی", "شەممە", "📅"),
      w("Sunday", "سان دەی", "یەکشەممە", "📅"),
      w("Monday", "مان دەی", "دووشەممە", "📅"),
      w("Tuesday", "تیوز دەی", "سێشەممە", "📅"),
      w("Wednesday", "وێنز دەی", "چوارشەممە", "📅"),
      w("Thursday", "ثەرز دەی", "پێنجشەممە", "📅"),
      w("Friday", "فرایدەی", "هەینی", "📅"),
    ],
    story: [
      "Look, Lucky! A carrot!",
      "What day is it? It's Tuesday.",
      "What time is it? It's four o'clock.",
      "Great! Lucky! It's time for your English class!",
      "What time is it? It's one o'clock.",
      "What day is it? It's Wednesday.",
    ],
    phonics: ["Thursday", "three", "thirteen", "thank you", "this", "that", "these", "those"],
  },
  {
    topic: "Review all units",
    words: [
      w("chair", "چێر", "کورسی", "🪑"),
      w("table", "تەیبڵ", "مێز", "🍽️"),
      w("mother", "مەدەر", "دایک", "👩"),
      w("father", "فادەر", "باوک", "👨"),
      w("watch", "وۆچ", "کاتژمێر", "⌚"),
      w("teacher", "تیچەر", "مامۆستا", "👩‍🏫"),
    ],
    story: [
      "There are lots of chairs and desks.",
      "She's at school! Yes! Yes!",
      "Where are they? Listen and guess.",
      "There's a chair and there are beds. They're at home!",
      "Lucky's in the school bag!",
    ],
    phonics: ["chair", "table", "mother", "father", "watch", "teacher"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Distractor pool = every word in the set except `english`. */
const otherWords = (words: Word[], english: string) =>
  words.filter((x) => x.english !== english).map((x) => x.english);

/** Distractor pool from a raw string list. */
const others = (list: string[], value: string) =>
  Array.from(new Set(list.filter((x) => x !== value))).slice(0, 3);

/**
 * Split a sentence into display tokens, keeping trailing punctuation as its
 * own token (matching how the children read sentences aloud).
 */
const tokenize = (sentence: string): string[] =>
  sentence.replace(/([.?!,'’])/g, " $1").split(/\s+/).filter(Boolean);

/**
 * TileAssemblyView keys tiles by their string value and disables every copy of
 * a used value, so an exercise containing repeated letters/tokens is
 * unsolvable. Only emit tile_assembly for inputs whose tokens are all distinct.
 */
const hasUniqueTokens = (tokens: string[]): boolean => new Set(tokens).size === tokens.length;
const uniqueLetterWord = (word: string): boolean =>
  hasUniqueTokens(word.toLowerCase().split(""));
const pickSentence = (sentences: string[]): string | undefined =>
  sentences.find((s) => hasUniqueTokens(tokenize(s)));

const DIGRAPHS = ["ch", "sh", "th", "sk", "ph", "wh", "ng", "oo", "ee", "ea", "ai", "ck"];

/** Leading digraph of a word, if it is a known digraph; otherwise its first letter. */
const leadingSound = (word: string): string => {
  const lower = word.toLowerCase();
  const two = lower.slice(0, 2);
  return DIGRAPHS.includes(two) ? two : lower[0];
};

/**
 * Keep the first item per key. PairMatchView draws its right column from the
 * pair's value, so two pairs sharing a value are visually identical and cannot
 * be told apart when tapped.
 */
const uniqBy = <T>(items: T[], key: (item: T) => string): T[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

// ===========================================================================
// Practice 1 — Vocabulary Audio-Visual Drill
//   1. Visual Word Anchors (vertical cards, 2 per screen)
//   2. Matching (3 words ↔ 3 images per screen)
//   3. Image multiple-choice (one screen per word)
//   4. Isolated Echo Mic (one screen per word)
// ===========================================================================
export function buildPractice1Exercises(words: Word[]): ExerciseInput[] {
  const exercises: ExerciseInput[] = [];
  let order = 1;

  chunk(words, 2).forEach((group, idx) => {
    exercises.push({
      type: "multiple_choice",
      promptText: "گوێ لە وێنەکان بگرە و دەست لێیان بدە",
      distractors: [],
      solutionData: {
        subtype: "word_anchors",
        instruction: "پێناسەی وشە (Word Anchors)",
        title: idx === 0 ? "وشە نوێیەکان" : `وشەکان (بەشی ${idx + 1})`,
        correct: "completed",
        words: group.map((x) => ({
          english: x.english,
          pronunciationKurdish: x.pron,
          meaningKurdish: x.meaning,
          note: `${x.article} ${x.english}`,
          emoji: x.emoji,
          imageUrl: x.image,
        })),
      },
      order: order++,
    });
  });

  chunk(words, 3)
    .map((group) => uniqBy(group, (x) => x.emoji))
    .filter((group) => group.length >= 2)
    .forEach((group) => {
    exercises.push({
      type: "multiple_choice",
      promptText: "وشەکە بە وێنەکەی ببەستەوە",
      distractors: [],
      solutionData: {
        subtype: "pair_match",
        instruction: "جووتبەندکردن (Matching)",
        correct: "matched",
        pairs: group.map((x) => ({
          id: x.english,
          word: x.english,
          emoji: x.emoji,
          imageUrl: x.image,
        })),
      },
      order: order++,
    });
  });

  words.forEach((x) => {
    exercises.push({
      type: "multiple_choice",
      promptText: "What is this?",
      distractors: otherWords(words, x.english),
      solutionData: {
        subtype: "image_mcq",
        instruction: "هەڵبژاردنی وێنە (Choose the word)",
        icon: x.emoji,
        imageUrl: x.image,
        correct: x.english,
        isSpeaking: true,
        type: "speak",
        spokenText: x.english,
      },
      order: order++,
    });
  });

  words.forEach((x) => {
    exercises.push({
      type: "multiple_choice",
      promptText: "گوێ بگرە و بە دەنگ دووبارەی بکەرەوە",
      distractors: [],
      solutionData: {
        subtype: "echo_mic",
        instruction: "ڕاهێنانی دەنگدانەوە (The Echo Mic)",
        correct: x.english,
        spokenText: x.english,
        subTextGuide: x.pron,
        visualScaffold: `${x.article} ${x.english} — ${x.meaning}`,
      },
      order: order++,
    });
  });

  return exercises;
}

// ===========================================================================
// Practice 2 — Multi-Panel Story Dialogue
//   1. Progressive chat_dialogue panels (rebuild the story)
//   2. Ear-match (audio_choice): hear a line, pick it
//   3. Scaffolded mic response (timed_mic)
//   4. Word ↔ image prop binding (pair_match)
// ===========================================================================
export function buildPractice2Exercises(unit: UnitData): ExerciseInput[] {
  const { story, words } = unit;
  const exercises: ExerciseInput[] = [];
  let order = 1;

  // Training 1 — Visual slot-filler: tap the role/thing from visual clues.
  const frame = unit.topic === "Jobs" ? "He's [ ___ ]." : "It's [ ___ ].";
  chunk(words, 3)
    .filter((group) => group.length >= 2)
    .forEach((group) => {
      const target = group[0];
      exercises.push({
        type: "multiple_choice",
        promptText: "وشەکە بخە ناو بۆشاییەکە",
        distractors: [],
        solutionData: {
          subtype: "slot_filler",
          instruction: "پڕکردنەوەی بۆشایی (Slot Filler)",
          frameText: frame,
          options: group.map((x) => x.english),
          correct: target.english,
          correctWord: target.english,
          visualCue: target.emoji,
        },
        order: order++,
      });
    });

  const panels = Math.min(4, Math.max(1, story.length - 1));
  for (let i = 0; i < panels; i++) {
    const incoming = story[i];
    const correct = story[i + 1];
    exercises.push({
      type: "multiple_choice",
      promptText: "چیرۆکەکە درێژە بدە — گوێ بگرە و وەڵامی دروست هەڵبژێرە",
      distractors: others(story, correct),
      solutionData: {
        subtype: "chat_dialogue",
        instruction: `چیرۆک — پانێلی ${i + 1} (Story Panel ${i + 1})`,
        incomingMessage: incoming,
        options: [correct, ...others(story, correct).slice(0, 2)],
        correct,
      },
      order: order++,
    });
  }

  for (let i = 0; i < Math.min(2, story.length); i++) {
    const line = story[i];
    const decoys = others(story, line).slice(0, 2);
    if (decoys.length < 2) continue;
    exercises.push({
      type: "multiple_choice",
      promptText: "گوێ بگرە — کام ڕستە بیسترا؟",
      distractors: [],
      solutionData: {
        subtype: "audio_choice",
        instruction: "گوێگرتن (Listen and choose)",
        audioText: line,
        options: [line, ...decoys],
        correct: line,
      },
      order: order++,
    });
  }

  const micLine = story[Math.min(1, story.length - 1)];
  exercises.push({
    type: "multiple_choice",
    promptText: "بە دەنگی خۆت ڕستەکە بڵێ",
    distractors: [],
    solutionData: {
      subtype: "timed_mic",
      instruction: "قسەکردن (Say it)",
      spokenText: micLine,
      correct: micLine,
      promptAudio: micLine,
      visualCue: micLine,
      scaffoldText: micLine,
      promptLabel: "دووبارەی بکەرەوە",
      timerSeconds: 6,
    },
    order: order++,
  });

  chunk(words, 3)
    .map((group) => uniqBy(group, (x) => x.emoji))
    .filter((group) => group.length >= 2)
    .forEach((group) => {
    exercises.push({
      type: "multiple_choice",
      promptText: "وشەکە بە وێنەکەی ببەستەوە",
      distractors: [],
      solutionData: {
        subtype: "pair_match",
        instruction: "بەستنەوە (Match)",
        correct: "matched",
        pairs: group.map((x) => ({ id: x.english, word: x.english, emoji: x.emoji, imageUrl: x.image })),
      },
      order: order++,
    });
  });

  return exercises;
}

// ===========================================================================
// Practice 3 — Visual Prompt Q&A & Inspection Deduction
//   1. Visual grid intake (word_anchors, a/an labels)
//   2. Target Q&A comprehension (multiple_choice)
//   3. Mystery deduction game (multiple_choice yes/no clues)
//   4. Roleplay production (timed_mic)
// ===========================================================================
export function buildPractice3Exercises(unit: UnitData): ExerciseInput[] {
  const { words } = unit;
  const exercises: ExerciseInput[] = [];
  let order = 1;

  // English "Is this X or Y?" questions. The word anchors already appear in
  // Practice 1, so this practice is Q&A only (no repeated anchor screen).
  // Leave the last word for the mystery game so it is never asked twice.
  words.slice(0, Math.min(5, words.length - 1)).forEach((x, i) => {
    const pool = words.filter((w) => w.english !== x.english);
    const wrong = pool[i % pool.length];
    exercises.push({
      type: "multiple_choice",
      promptText: `Is this ${x.article} ${x.english} or ${wrong.article} ${wrong.english}?`,
      distractors: [wrong.english],
      solutionData: {
        subtype: "image_mcq",
        instruction: "پرسیار و وەڵام (Ask and answer)",
        icon: x.emoji,
        imageUrl: x.image,
        correct: x.english,
        isSpeaking: true,
        type: "speak",
        spokenText: `Is this ${x.article} ${x.english}? Yes, it is.`,
      },
      order: order++,
    });
  });

  const mystery = words[words.length - 1];
  const wrong = otherWords(words, mystery.english)[0];
  const mysteryWrong = words.find((w) => w.english === wrong) ?? words[0];
  exercises.push({
    type: "multiple_choice",
    promptText: `Is this ${mystery.article} ${mystery.english} or ${mysteryWrong.article} ${mysteryWrong.english}?`,
    distractors: [wrong],
    solutionData: {
      subtype: "image_mcq",
      instruction: "یاری دۆزینەوە (Mystery game)",
      icon: mystery.emoji,
      imageUrl: mystery.image,
      correct: mystery.english,
      isSpeaking: true,
      type: "speak",
      spokenText: `Is it ${mystery.article} ${mystery.english}? Yes, it is.`,
    },
    order: order++,
  });

  exercises.push({
    type: "multiple_choice",
    promptText: "بە دەنگی خۆت وەڵام بدەوە",
    distractors: [],
    solutionData: {
      subtype: "timed_mic",
      instruction: "ڕۆڵگێڕان (Roleplay)",
      spokenText: `It's ${mystery.article} ${mystery.english}.`,
      correct: `It's ${mystery.article} ${mystery.english}.`,
      promptAudio: `What is it?`,
      visualCue: `${mystery.emoji}  It's ${mystery.article} [ ___ ].`,
      scaffoldText: `It's ${mystery.article} ${mystery.english}.`,
      promptLabel: "وەڵام بدەوە",
      timerSeconds: 6,
    },
    order: order++,
  });

  return exercises;
}

// ===========================================================================
// Practice 4 — Alphabet & Spelling Drills
//   1. Initial sound match (multiple_choice, letter → word)
//   2. Letter Box Builder (tile_assembly, tap-to-spell)
//   3. Word ↔ image matching (pair_match)
//   4. Missing letter hunter (multiple_choice)
//   5. Spell with letter tiles (word_bank)
// ===========================================================================
export function buildPractice4Exercises(unit: UnitData): ExerciseInput[] {
  const { phonics, words } = unit;
  const exercises: ExerciseInput[] = [];
  let order = 1;

  phonics
    .filter(
      (word, i) =>
        phonics.some(
          (other, j) => j !== i && other[0].toLowerCase() !== word[0].toLowerCase(),
        ),
    )
    .slice(0, 3)
    .forEach((target) => {
      const letter = target[0].toUpperCase();
      // A distractor that also starts with `letter` would be a second valid
      // answer to "which word starts with <letter>?", so exclude those.
      const distractors = uniqBy(
        phonics.filter(
          (w) => w !== target && w[0].toLowerCase() !== target[0].toLowerCase(),
        ),
        (w) => w,
      ).slice(0, 3);
      exercises.push({
        type: "multiple_choice",
        promptText: `کام وشە بە پیتی «${letter}» دەست پێدەکات؟`,
        distractors,
        solutionData: {
          subtype: "image_mcq",
          instruction: "دەنگی سەرەتا (Initial sound)",
          icon: letter,
          correct: target,
          isSpeaking: true,
          type: "speak",
          spokenText: target,
        },
        order: order++,
      });
    });

  phonics.filter(uniqueLetterWord).slice(0, 3).forEach((word) => {
    exercises.push({
      type: "multiple_choice",
      promptText: `ئەم وشەیە دروست بکەرەوە: ${word}`,
      distractors: [],
      solutionData: {
        subtype: "tile_assembly",
        instruction: "سندوقی پیتەکان (Letter Box Builder)",
        tiles: word.toLowerCase().split(""),
        correctOrder: word.toLowerCase().split(""),
        timerSeconds: 25,
        visualCue: word,
      },
      order: order++,
    });
  });

  chunk(words, 3)
    .map((group) => uniqBy(group, (x) => x.emoji))
    .filter((group) => group.length >= 2)
    .forEach((group) => {
      exercises.push({
        type: "multiple_choice",
        promptText: "وشەکە بە وێنەکەی ببەستەوە",
        distractors: [],
        solutionData: {
          subtype: "pair_match",
          instruction: "جووتبەندکردنی سەرەتا (Split-Column Match)",
          correct: "matched",
          pairs: group.map((x) => ({ id: x.english, word: x.english, emoji: x.emoji, imageUrl: x.image })),
        },
        order: order++,
      });
    });

  phonics.slice(0, 4).forEach((word) => {
    const gapIndex = Math.floor(word.length / 2);
    const missing = word[gapIndex];
    // Skip words whose midpoint is a space/apostrophe — not a letter to choose.
    if (word.length < 3 || !/[a-zA-Z]/.test(missing)) return;
    const shown = word.slice(0, gapIndex) + "_" + word.slice(gapIndex + 1);
    const alphabet = "abcdefghijklmnopqrstuvwxyz".replace(missing.toLowerCase(), "");
    const decoys = [0, 1, 2]
      .map((i) => alphabet[(gapIndex * 3 + i * 5) % alphabet.length])
      .filter((c) => c !== missing.toLowerCase());
    exercises.push({
      type: "multiple_choice",
      promptText: `پیتی ونبوو بدۆزەرەوە: ${shown}`,
      distractors: decoys,
      solutionData: {
        subtype: "image_mcq",
        instruction: "ڕاوکەری پیتی ونبوو (Missing Letter)",
        icon: "❓",
        correct: missing,
        isSpeaking: true,
        type: "speak",
        spokenText: word,
      },
      order: order++,
    });
  });

  phonics.slice(0, 3).forEach((word) => {
    const letters = Array.from(new Set(word.toLowerCase().split("")));
    const decoys = ["z", "q", "x"].filter((c) => !letters.includes(c)).slice(0, 2);
    exercises.push({
      type: "word_bank",
      promptText: `ئەم وشەیە بە پیتەکان بنووسە: ${word}`,
      distractors: decoys,
      solutionData: {
        subtype: "word_bank",
        instruction: "پیتەکان ڕێز بدە (Spell)",
        tokens: word.toLowerCase().split(""),
      },
      order: order++,
    });
  });

  return exercises;
}

// ===========================================================================
// Practice 5 — Phonics & Sound Discrimination
//   1. Blind sound catcher (blind_audio_scramble)
//   2. Letter hunter (multiple_choice)
//   3. Sound sorting bins (pair_match: word ↔ sound)
// ===========================================================================
export function buildPractice5Exercises(unit: UnitData): ExerciseInput[] {
  const { phonics } = unit;
  const exercises: ExerciseInput[] = [];
  let order = 1;

  const three = phonics.slice(0, 3);
  if (three.length === 3) {
    exercises.push({
      type: "multiple_choice",
      promptText: "گوێ بگرە و ڕیزبەندی دەنگەکان دروست بکە",
      distractors: [],
      solutionData: {
        subtype: "blind_audio_scramble",
        instruction: "ڕاوکەری دەنگ (Sound Catcher)",
        clips: three.map((word, i) => ({ id: `c${i}`, label: `${i + 1}`, text: word })),
        correctOrder: ["c0", "c1", "c2"],
      },
      order: order++,
    });
  }

  const target = phonics.find((word) => word.length >= 3) ?? phonics[0];
  const sound = leadingSound(target);
  const shown = "▢" + target.slice(sound.length);
  const pool = sound.length === 2 ? DIGRAPHS : "abcdefghijklmnopqrstuvwxyz".split("");
  exercises.push({
    type: "multiple_choice",
    promptText: `ئەم دەنگە بدۆزەرەوە: ${shown}`,
    distractors: pool.filter((d) => d !== sound).slice(0, 3),
    solutionData: {
      subtype: "image_mcq",
      instruction: "ڕاوکەری پیت (Letter Hunter)",
      icon: "🔎",
      correct: sound,
      isSpeaking: true,
      type: "speak",
      spokenText: target,
    },
    order: order++,
  });

  chunk(phonics, 3)
    .map((group) => uniqBy(group, (word) => leadingSound(word)))
    .filter((group) => group.length >= 2)
    .forEach((group) => {
      exercises.push({
        type: "multiple_choice",
        promptText: "وشەکە بخە سندوقی دەنگی گونجاو",
        distractors: [],
        solutionData: {
          subtype: "pair_match",
          instruction: "پۆلێنکردنی دەنگ (Sound Sorting)",
          correct: "matched",
          pairs: group.map((word) => ({
            id: word,
            left: word,
            right: leadingSound(word).toUpperCase(),
          })),
        },
        order: order++,
      });
    });

  return exercises;
}

// ===========================================================================
// Practice 6 — Punctuation & Mechanics
//   1. Sentence Doctor (tile_assembly with punctuation)
//   2. Contraction magnet (word_bank)
//   3. Punctuation trap (multiple_choice)
//   4. Q & A punctuation match (pair_match)
// ===========================================================================
export function buildPractice6Exercises(unit: UnitData): ExerciseInput[] {
  const sentences = unit.punctuation ?? [];
  if (sentences.length === 0) return [];
  const exercises: ExerciseInput[] = [];
  let order = 1;

  sentences
    .slice(0, 3)
    .filter((sentence) => hasUniqueTokens(tokenize(sentence)))
    .forEach((sentence) => {
      const tokens = tokenize(sentence);
      exercises.push({
        type: "multiple_choice",
        promptText: "ڕستەکە بە خاڵ و نیشانەی دروست ڕێک بخە",
        distractors: [],
        solutionData: {
          subtype: "tile_assembly",
          instruction: "دکتۆری ڕستە (Sentence Doctor)",
          tiles: tokens,
          correctOrder: tokens,
          timerSeconds: 30,
          visualCue: sentence,
        },
        order: order++,
      });
    });

  // Contraction magnet: transform the sentence in whichever direction has a
  // real counterpart. tokenize() would split the apostrophe, so use plain
  // word-splitting for the contracted form.
  const CONTRACT: [RegExp, string][] = [
    [/\bis not\b/g, "isn't"],
    [/\bare not\b/g, "aren't"],
    [/\bI am\b/g, "I'm"],
    [/\bit is\b/g, "it's"],
    [/\bthat is\b/g, "that's"],
    [/\bthey are\b/g, "they're"],
    [/\bwe are\b/g, "we're"],
    [/\byou are\b/g, "you're"],
    [/\bcannot\b/g, "can't"],
    [/\bdo not\b/g, "don't"],
  ];
  const EXPAND: [RegExp, string][] = [
    [/\bisn't\b/g, "is not"],
    [/\baren't\b/g, "are not"],
    [/\bI'm\b/g, "I am"],
    [/\bit's\b/g, "it is"],
    [/\bthat's\b/g, "that is"],
    [/\bthey're\b/g, "they are"],
    [/\bwe're\b/g, "we are"],
    [/\byou're\b/g, "you are"],
    [/\bcan't\b/g, "can not"],
    [/\bdon't\b/g, "do not"],
  ];
  const source = sentences[0];
  const contracted = CONTRACT.reduce((s, [re, to]) => s.replace(re, to), source);
  const expanded = EXPAND.reduce((s, [re, to]) => s.replace(re, to), source);
  const asContract = contracted !== source;
  if (asContract || expanded !== source) {
    const targetSentence = asContract ? contracted : expanded;
    const cTokens = targetSentence.split(/\s+/).filter(Boolean);
    exercises.push({
      type: "word_bank",
      promptText: asContract
        ? "ڕستەکە بنووسە بە شێوەی کورتکراوە"
        : "شێوەی درێژکراوی ڕستەکە بنووسە",
      distractors: ["not", "is"].filter(
        (d) => !cTokens.some((t) => t.toLowerCase() === d),
      ),
      solutionData: {
        subtype: "word_bank",
        instruction: "مەغناطیسی کورتکراوە (Contraction Magnet)",
        tokens: cTokens,
      },
      order: order++,
    });
  }

  // One-Tap Error Hunter: tap the single mis-spelled word.
  const plainWords = tokenize(sentences[0]).filter((t) => /^[a-zA-Z]{4,}$/.test(t));
  if (plainWords.length >= 2) {
    const good = plainWords[0];
    const broken = good[1] + good[0] + good.slice(2);
    exercises.push({
      type: "multiple_choice",
      promptText: "کام وشە هەڵەیە؟ دەستی لێبدە",
      distractors: plainWords.slice(1),
      solutionData: {
        subtype: "image_mcq",
        instruction: "ڕاوکەری هەڵە (One-Tap Error Hunter)",
        icon: "🔧",
        correct: broken,
        isSpeaking: true,
        type: "speak",
        spokenText: sentences[0],
      },
      order: order++,
    });
  }

  const correctSentence = sentences[0];
  const noEnd = correctSentence.replace(/[.?!]$/, "");
  const lowerFirst = correctSentence.charAt(0).toLowerCase() + correctSentence.slice(1);
  const trapDecoys = Array.from(new Set([noEnd, lowerFirst])).filter((d) => d !== correctSentence);
  exercises.push({
    type: "multiple_choice",
    promptText: "کام ڕستە بە دروستی خاڵ و نیشانەی هەیە؟",
    distractors: trapDecoys,
    solutionData: {
      subtype: "image_mcq",
      instruction: "تەڵەی نیشانە (Punctuation Trap)",
      icon: "✍️",
      correct: correctSentence,
      isSpeaking: true,
      type: "speak",
      spokenText: correctSentence,
    },
    order: order++,
  });

  // Pair by trailing punctuation; keep at most one pair per punctuation mark
  // so the right column has no two identical tiles.
  const qa = uniqBy(sentences.slice(0, 3), (s) => (s.endsWith("?") ? "?" : "."));
  if (qa.length >= 2) {
    exercises.push({
      type: "multiple_choice",
      promptText: "پرسیارەکان بە وەڵامەکان ببەستەوە",
      distractors: [],
      solutionData: {
        subtype: "pair_match",
        instruction: "پرسیار و وەڵام (Q & A Match)",
        correct: "matched",
        pairs: qa.map((s) => ({
          id: s,
          left: s,
          right: s.endsWith("?") ? "?" : ".",
        })),
      },
      order: order++,
    });
  }

  return exercises;
}

// ===========================================================================
// Practice 7 — Tangled-Line Syntax Builders
//   1. Wire tracer (pair_match pronoun ↔ verb form)
//   2. Syntax train (tile_assembly Subject → Verb → Object)
//   3. Tangled riddle (multiple_choice is/are)
// ===========================================================================
export function buildPractice7Exercises(unit: UnitData, rows: { left: string; right: string }[], copula: { prompt: string; correct: string; options: string[] }): ExerciseInput[] {
  const exercises: ExerciseInput[] = [];
  let order = 1;

  // Two pronouns can share a verb form ("You are" / "They are"); keep one pair
  // per right-hand tile so the column has no identical tiles.
  const wireRows = uniqBy(rows, (r) => r.right);
  if (wireRows.length >= 2) {
    exercises.push({
      type: "multiple_choice",
      promptText: "جیندەکان بە هێڵ ببەستەوە",
      distractors: [],
      solutionData: {
        subtype: "pair_match",
        instruction: "تەلپیچاوی ڕووناک (Wire Tracer)",
        correct: "matched",
        pairs: wireRows.map((r) => ({ id: r.left, left: r.left, right: r.right })),
      },
      order: order++,
    });
  }

  const sentence = pickSentence(unit.punctuation ?? unit.story);
  if (sentence) {
    const tokens = tokenize(sentence);
    exercises.push({
      type: "multiple_choice",
      promptText: "قەتارەکە ڕێک بخە: کارەکتەر ← کردار ← شت",
      distractors: [],
      solutionData: {
        subtype: "tile_assembly",
        instruction: "قەتاری ڕێزمان (Syntax Train)",
        tiles: tokens,
        correctOrder: tokens,
        timerSeconds: 30,
        visualCue: sentence,
      },
      order: order++,
    });
  }

  exercises.push({
    type: "multiple_choice",
    promptText: copula.prompt,
    distractors: copula.options.filter((o) => o !== copula.correct),
    solutionData: {
      subtype: "image_mcq",
      instruction: "مەتەڵی تەلپیچاو (Tangled Riddle)",
      icon: "🎒",
      correct: copula.correct,
      isSpeaking: true,
      type: "speak",
      spokenText: `${copula.correct} a ${unit.words[0].english}.`,
    },
    order: order++,
  });

  return exercises;
}

// ===========================================================================
// Practice 8 — Grammatical Cloze & Pronoun Selection
//   1. Inline capsule snap (multiple_choice is/are)
//   2. Possessive avatar match (pair_match)
//   3. Visual action binary toggle (multiple_choice)
// ===========================================================================
export function buildPractice8Exercises(clozes: { prompt: string; correct: string; options: string[] }[], possessives: { left: string; right: string }[]): ExerciseInput[] {
  const exercises: ExerciseInput[] = [];
  let order = 1;

  clozes.forEach((c) => {
    exercises.push({
      type: "multiple_choice",
      promptText: c.prompt,
      distractors: c.options.filter((o) => o !== c.correct),
      solutionData: {
        subtype: "image_mcq",
        instruction: "کپسوولی ژێرەوە (Capsule Cloze)",
        icon: "💊",
        correct: c.correct,
        isSpeaking: true,
        type: "speak",
        spokenText: c.prompt.replace("[ ___ ]", c.correct),
      },
      order: order++,
    });
  });

  exercises.push({
    type: "multiple_choice",
    promptText: "خاوەندارێتی دروست هەڵبژێرە",
    distractors: [],
    solutionData: {
      subtype: "pair_match",
      instruction: "جووتبەندکردنی خاوەندارێتی (Possessives)",
      correct: "matched",
      pairs: possessives.map((p) => ({ id: p.left, left: p.left, right: p.right })),
    },
    order: order++,
  });

  const affirm = clozes[0];
  exercises.push({
    type: "multiple_choice",
    promptText: `ئایا ڕاستە یان هەڵە: «${affirm.prompt.replace("[ ___ ]", affirm.correct)}»؟`,
    distractors: ["No, it isn't."],
    solutionData: {
      subtype: "image_mcq",
      instruction: "گۆڕەپانی کردار (Action Toggle)",
      icon: "✅",
      correct: "Yes, it is.",
      isSpeaking: true,
      type: "speak",
      spokenText: affirm.prompt.replace("[ ___ ]", affirm.correct),
    },
    order: order++,
  });

  return exercises;
}

// ===========================================================================
// Practice 9 — Split-Column Conversational Matching
//   1. Visual action inspector (multiple_choice yes/no)
//   2. Wardrobe detective (multiple_choice)
//   3. Question matcher (multiple_choice: given answer, pick question)
// ===========================================================================
export function buildPractice9Exercises(items: { imageCue: string; question: string; correct: string; decoys: string[] }[]): ExerciseInput[] {
  const exercises: ExerciseInput[] = [];
  let order = 1;

  items.slice(0, 2).forEach((it) => {
    exercises.push({
      type: "multiple_choice",
      promptText: `${it.imageCue}  ${it.question}`,
      distractors: it.decoys,
      solutionData: {
        subtype: "image_mcq",
        instruction: "پشکنەری کردار (Action Inspector)",
        icon: it.imageCue,
        correct: it.correct,
        isSpeaking: true,
        type: "speak",
        spokenText: it.question,
      },
      order: order++,
    });
  });

  if (items[2]) {
    const it = items[2];
    exercises.push({
      type: "multiple_choice",
      promptText: `${it.imageCue}  ${it.question}`,
      distractors: it.decoys,
      solutionData: {
        subtype: "image_mcq",
        instruction: "دۆزەرەوەی جلوبەرگ (Wardrobe Detective)",
        icon: it.imageCue,
        correct: it.correct,
        isSpeaking: true,
        type: "speak",
        spokenText: it.correct,
      },
      order: order++,
    });
  }

  if (items[3]) {
    const it = items[3];
    exercises.push({
      type: "multiple_choice",
      promptText: `${it.imageCue}  ${it.question}`,
      distractors: it.decoys,
      solutionData: {
        subtype: "image_mcq",
        instruction: "جووتبەندەری پرسیار (Question Matcher)",
        icon: it.imageCue,
        correct: it.correct,
        isSpeaking: true,
        type: "speak",
        spokenText: it.correct,
      },
      order: order++,
    });
  }

  return exercises;
}

// ===========================================================================
// Practice 10 — Visual Counting & Quantity Matching
//   1. Interactive tap-to-tally (multiple_choice)
//   2. Tens-and-units bundler (multiple_choice)
//   3. Singular vs plural scale (pair_match)
// ===========================================================================
export function buildPractice10Exercises(item: string, emoji: string): ExerciseInput[] {
  const exercises: ExerciseInput[] = [];
  let order = 1;

  exercises.push({
    type: "multiple_choice",
    promptText: `${emoji}${emoji}${emoji}  چەند دانەیە؟ ژمارە بکە و بڵێ`,
    distractors: ["two", "four"],
    solutionData: {
      subtype: "image_mcq",
      instruction: "ژماردن (Count and say)",
      icon: emoji,
      correct: "three",
      isSpeaking: true,
      type: "speak",
      spokenText: `There are three ${item}s.`,
    },
    order: order++,
  });

  exercises.push({
    type: "multiple_choice",
    promptText: `${emoji}×20 + ${emoji}×2  ئەمە چەندە؟`,
    distractors: ["twelve", "twenty"],
    solutionData: {
      subtype: "image_mcq",
      instruction: "بیست و دوو (Tens and units)",
      icon: "🔢",
      correct: "twenty-two",
      isSpeaking: true,
      type: "speak",
      spokenText: `There are twenty-two ${item}s.`,
    },
    order: order++,
  });

  exercises.push({
    type: "multiple_choice",
    promptText: "«There is» یان «There are»؟",
    distractors: [],
    solutionData: {
      subtype: "pair_match",
      instruction: "تاک و کۆ (Singular vs plural)",
      correct: "matched",
      pairs: uniqBy(
        [
          { id: "one", left: `1 ${item}`, right: "There is" },
          { id: "two", left: `2 ${item}s`, right: "There are" },
          { id: "many", left: `25 ${item}s`, right: "There are" },
        ],
        (p) => p.right,
      ),
    },
    order: order++,
  });

  return exercises;
}

// ===========================================================================
// Practice 12 — Milestone Boss Battles & Secret Ciphers
//   1. Secret message cipher (tile_assembly)
//   2. 3-clue suspect lineup (multiple_choice)
//   3. Syntax slot machine (tile_assembly)
// ===========================================================================
export function buildPractice12Exercises(unit: UnitData): ExerciseInput[] {
  const exercises: ExerciseInput[] = [];
  let order = 1;

  const cipher =
    pickSentence(unit.story.filter((s) => s.includes("?"))) ?? pickSentence(unit.story);
  if (cipher) {
    const cTokens = tokenize(cipher);
    exercises.push({
      type: "multiple_choice",
      promptText: "پەیامی نهێنی ئاشکرا بکە: پرسیارەکە ڕێک بخە",
      distractors: [],
      solutionData: {
        subtype: "tile_assembly",
        instruction: "شفرەی پەیامی نهێنی (Secret Cipher)",
        tiles: cTokens,
        correctOrder: cTokens,
        timerSeconds: 30,
        visualCue: "H - E - L - L - O",
      },
      order: order++,
    });
  }

  const focus = unit.words[0];
  exercises.push({
    type: "multiple_choice",
    promptText: `سێ نیشانە: ئەمە ${focus.emoji}ە، بە «${focus.article}» دەست پێدەکات، و بە «${focus.english[focus.english.length - 1]}» کۆتایی دێت. کامەیە؟`,
    distractors: otherWords(unit.words, focus.english),
    solutionData: {
      subtype: "image_mcq",
      instruction: "ڕیزی گومانلێکراوەکان (Suspect Lineup)",
      icon: focus.emoji,
      correct: focus.english,
      isSpeaking: true,
      type: "speak",
      spokenText: `It's ${focus.article} ${focus.english}.`,
    },
    order: order++,
  });

  const broken = pickSentence(unit.punctuation ?? unit.story);
  if (broken) {
    const tokens = tokenize(broken);
    exercises.push({
      type: "multiple_choice",
      promptText: `ئامێری ڕێزمان: ڕستەکە چاک بکەرەوە — «${broken}»`,
      distractors: [],
      solutionData: {
        subtype: "tile_assembly",
        instruction: "ئامێری ڕێزمان (Syntax Slot Machine)",
        tiles: [...tokens].reverse(),
        correctOrder: tokens,
        timerSeconds: 30,
        visualCue: broken,
      },
      order: order++,
    });
  }

  return exercises;
}

// ---------------------------------------------------------------------------
// Where the specialised practices sit (per the book).
// ---------------------------------------------------------------------------
const SYNTAX_ROWS = [
  { left: "I", right: "am" },
  { left: "You", right: "are" },
  { left: "He", right: "is" },
  { left: "They", right: "are" },
];

const POSSESSIVES = [
  { left: "boy", right: "His" },
  { left: "girl", right: "Her" },
  { left: "group", right: "Their" },
];

/** Word name -> book image, ignoring the unit (lets review units reuse images). */
const BOOK_IMAGE_BY_WORD: Record<string, string> = Object.fromEntries(
  Object.entries(SUNRISE3_WORD_IMAGES).map(([k, v]) => [k.split(":")[1], v]),
);

/** Attach the cropped book picture to each word; falls back to an existing path. */
function withBookImages(unit: UnitData, order: number): UnitData {
  return {
    ...unit,
    words: unit.words.map((word) => ({
      ...word,
      image:
        SUNRISE3_WORD_IMAGES[`${order}:${word.english.toLowerCase()}`] ??
        BOOK_IMAGE_BY_WORD[word.english.toLowerCase()] ??
        word.image,
    })),
  };
}

function buildUnits(): UnitInput[] {
  return UNIT_TOPICS.map((u, idx) => {
    const order = idx + 1;
    const unit = withBookImages(UNIT_DATA[idx], order);

    const lessons: LessonInput[] = [1, 2, 3].map((ln) => ({
      title: `${order}.${ln} ${u.topic} — ${LESSON_ACTIVITY[ln]}`,
      order: ln,
      xpReward: ln === 3 ? 15 : 10,
      exercises: [],
    }));

    // Lesson 1 — Practice 1 (vocabulary) for every unit.
    lessons[0].exercises = buildPractice1Exercises(unit.words);

    // Lesson 2 — Practice 2 (story) for every unit.
    lessons[1].exercises = buildPractice2Exercises(unit);

    // Lesson 3 — Practice 4 (spelling) + Practice 5 (phonics) + Practice 6 (punctuation).
    lessons[2].exercises = [
      ...buildPractice4Exercises(unit),
      ...buildPractice5Exercises(unit),
      ...buildPractice6Exercises(unit),
    ];

    // Unit 1 Lesson 1 also carries Practice 3 (Visual Prompt Q&A).
    if (order === 1) lessons[0].exercises.push(...buildPractice3Exercises(unit));

    // Practice 10 (counting) — Units 2 & 6.
    if (order === 2) lessons[0].exercises.push(...buildPractice10Exercises("banana", "🍌"));
    if (order === 6) lessons[2].exercises.push(...buildPractice10Exercises("pencil", "✏️"));

    // Practice 7 (syntax) — Units 4, 6, 8.
    if (order === 4 || order === 6 || order === 8) {
      lessons[2].exercises.push(
        ...buildPractice7Exercises(unit, SYNTAX_ROWS, {
          prompt: "«There is» یان «There are»؟",
          correct: "There are",
          options: ["There is", "There are"],
        })
      );
    }

    // Practice 8 (cloze & possessives) — Units 6, 11, 13, 15, 16.
    if ([6, 11, 13, 15, 16].includes(order)) {
      lessons[2].exercises.push(
        ...buildPractice8Exercises(
          [
            { prompt: "There [ ___ ] a pen.", correct: "is", options: ["is", "are"] },
            { prompt: "There [ ___ ] two pencils.", correct: "are", options: ["is", "are"] },
            { prompt: "She [ ___ ] a nurse.", correct: "is", options: ["is", "are"] },
            { prompt: "They [ ___ ] doctors.", correct: "are", options: ["is", "are"] },
          ],
          POSSESSIVES
        )
      );
    }

    // Practice 9 (conversational matching) — Units 12 & 14.
    if (order === 12 || order === 14) {
      lessons[2].exercises.push(
        ...buildPractice9Exercises([
          { imageCue: "🎸", question: "Is he playing the guitar?", correct: "Yes, he is.", decoys: ["No, he isn't.", "Yes, she is."] },
          { imageCue: "📖", question: "Is she reading a book?", correct: "No, she isn't.", decoys: ["Yes, she is.", "No, he isn't."] },
          { imageCue: "👕", question: "What is she wearing?", correct: "She's wearing a T-shirt.", decoys: ["She's wearing a cap.", "He's wearing a T-shirt."] },
          { imageCue: "👟", question: "She's wearing trainers. → What's the question?", correct: "What is she wearing?", decoys: ["Is she wearing trousers?", "What is he wearing?"] },
        ])
      );
    }

    // Practice 12 (boss battle) — the revision units (5, 8, 11, 14, 17) get a 4th lesson.
    if ([5, 8, 11, 14, 17].includes(order)) {
      lessons.push({
        title: `${order}.4 ${u.topic} — ${LESSON_ACTIVITY[4]}`,
        order: 4,
        xpReward: 25,
        exercises: buildPractice12Exercises(unit),
      });
    }

    // Each practice builder restarts its own order counter, so a lesson that
    // concatenates several practices (e.g. Unit 1 Lesson 1 = Practice 1 + 3)
    // would otherwise have colliding orders and the server's order sort would
    // interleave them. Renumber every lesson into one gap-free sequence.
    for (const lesson of lessons) {
      lesson.exercises.forEach((exercise, i) => {
        exercise.order = i + 1;
      });
    }

    return { title: u.title, order, lessons };
  });
}

export const SUNRISE3_UNITS: UnitInput[] = buildUnits();

export async function runSunriseSeed() {
  console.log("=== Seeding Sunrise 3 (English for Kurdish Schools) — full course ===");

  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL || "https://qualified-egret-206.convex.cloud";
  const adminSecret = process.env.ADMIN_SEED_SECRET || "ferbe-secret-2026";

  const totalLessons = SUNRISE3_UNITS.reduce((a, u) => a + u.lessons.length, 0);
  const totalExercises = SUNRISE3_UNITS.reduce(
    (a, u) => a + u.lessons.reduce((l, x) => l + x.exercises.length, 0),
    0
  );

  console.log(
    `Prepared ${SUNRISE3_UNITS.length} units, ${totalLessons} lessons, ${totalExercises} interactive exercises (Practices 1–12).`
  );

  const client = new ConvexHttpClient(convexUrl);
  try {
    console.log(`Connecting to Convex at: ${convexUrl}...`);
    const result = await client.mutation(api.admin.seedCurriculum, {
      adminSecret,
      course: COURSE,
      units: SUNRISE3_UNITS,
      deleteOtherCourses: false,
    });
    console.log("\nSunrise 3 course seeded.");
    console.log(`- Course slug: ${result.courseSlug}`);
    console.log(`- Lessons upserted: ${result.lessonsUpserted}`);
    console.log(`- Exercises written: ${result.exercisesWritten}`);
    return result;
  } catch (err) {
    console.error("Failed to seed Sunrise 3 course:", err);
    throw err;
  }
}

if (typeof require !== "undefined" && require.main === module) {
  runSunriseSeed().catch(() => process.exit(1));
} else if (process.argv[1]?.includes("seed-sunrise3-course")) {
  runSunriseSeed().catch(() => process.exit(1));
}
