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
  title: "Sunrise 3 — English for Kurdish Schools (ئینگلیزی پۆلی ٣)",
  slug: "sunrise-3",
  sourceLanguage: "ckb",
  targetLanguage: "en",
};

// ---------------------------------------------------------------------------
// Book structure — from the "Map of the book" (18 units, 3 lessons each).
// Lessons follow the recurring Sunrise 3 pattern:
//   Lesson 1 = vocabulary intake ("Listen and say")      -> Practice 1
//   Lesson 2 = story dialogue ("Listen and read. Say.")  -> Practice 2
//   Lesson 3 = phonics & spelling ("Listen and repeat")  -> Practice 4
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
  3: "Listen and repeat. Then circle and say. (Practice 4 — Phonics)",
};

// ---------------------------------------------------------------------------
// Practice 1 — Vocabulary Audio-Visual Drill (revised per
// docs/sunrise3-practice-1-rules.md): chunked word anchors (3 cards/screen),
// word↔image matching, image multiple-choice, then the echo mic at the end.
// First instance in the book = Unit 3 Jobs (p.10):
// doctor, nurse, teacher, policeman, chef, firefighter.
// ---------------------------------------------------------------------------
interface JobWord {
  english: string;
  pronunciationKurdish: string;
  meaningKurdish: string;
  article: string;
  emoji: string;
}

const JOB_WORDS: JobWord[] = [
  { english: "doctor", pronunciationKurdish: "دۆکتەر", meaningKurdish: "پزیشک", article: "a", emoji: "👨‍⚕️" },
  { english: "nurse", pronunciationKurdish: "نێرس", meaningKurdish: "پەرستار", article: "a", emoji: "👩‍⚕️" },
  { english: "teacher", pronunciationKurdish: "تیچەر", meaningKurdish: "مامۆستا", article: "a", emoji: "👩‍🏫" },
  { english: "policeman", pronunciationKurdish: "پۆلیسمەن", meaningKurdish: "پۆلیس", article: "a", emoji: "👮" },
  { english: "chef", pronunciationKurdish: "شێف", meaningKurdish: "چێشتلێنەر", article: "a", emoji: "👨‍🍳" },
  { english: "firefighter", pronunciationKurdish: "فایەرفایتەر", meaningKurdish: "ئاگرکوژێنەرەوە", article: "a", emoji: "👨‍🚒" },
];

/** Split an array into consecutive groups of at most `size` items. */
function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

/**
 * Practice 1 — Vocabulary Audio-Visual Drill, revised build rules.
 * Max 3 items per screen (never 6 at once); a 6-word set becomes multiple
 * screens. Trainings, in order:
 *   1. Visual Word Anchors (chunked 3 + 3) — tap every card to hear it.
 *   2. Matching (3 word labels ↔ 3 images per screen).
 *   3. Image multiple-choice (one screen per word, repeat across the set).
 *   4. Isolated Echo Mic at the end (one screen per word).
 */
export function buildPractice1Exercises(words: JobWord[]): ExerciseInput[] {
  const exercises: ExerciseInput[] = [];
  let order = 1;

  // Training 1 — Visual Word Anchors, chunked to 3 cards per screen.
  chunk(words, 3).forEach((group, idx) => {
    exercises.push({
      type: "multiple_choice",
      promptText: "گوێ لە وێنەکان بگرە و دەست لێیان بدە",
      distractors: [],
      solutionData: {
        subtype: "word_anchors",
        instruction: "پێناسەی وشە (Word Anchors)",
        title: idx === 0 ? "پیشەکان" : "پیشەکان (بەشی دووەم)",
        correct: "completed",
        words: group.map((w) => ({
          english: w.english,
          pronunciationKurdish: w.pronunciationKurdish,
          meaningKurdish: w.meaningKurdish,
          note: `${w.article} ${w.english}`,
          emoji: w.emoji,
        })),
      },
      order: order++,
    });
  });

  // Training 2 — Matching: 3 word labels ↔ 3 images per screen.
  chunk(words, 3).forEach((group) => {
    exercises.push({
      type: "multiple_choice",
      promptText: "وشەکە بە وێنەکەی ببەستەوە",
      distractors: [],
      solutionData: {
        subtype: "pair_match",
        instruction: "جووتبەندکردن (Matching)",
        correct: "matched",
        pairs: group.map((w) => ({ id: w.english, word: w.english, emoji: w.emoji })),
      },
      order: order++,
    });
  });

  // Training 3 — Image multiple-choice: one screen per word.
  words.forEach((w) => {
    exercises.push({
      type: "multiple_choice",
      promptText: "ئەمە چییە؟",
      distractors: words.filter((x) => x.english !== w.english).map((x) => x.english),
      solutionData: {
        subtype: "image_mcq",
        instruction: "هەڵبژاردنی وێنە (Choose the word)",
        icon: w.emoji,
        correct: w.english,
      },
      order: order++,
    });
  });

  // Training 4 — Isolated Echo Mic at the end: one screen per word.
  words.forEach((w) => {
    exercises.push({
      type: "multiple_choice",
      promptText: "گوێ بگرە و بە دەنگ دووبارەی بکەرەوە",
      distractors: [],
      solutionData: {
        subtype: "echo_mic",
        instruction: "ڕاهێنانی دەنگدانەوە (The Echo Mic)",
        correct: w.english,
        spokenText: w.english,
        subTextGuide: w.pronunciationKurdish,
        visualScaffold: `${w.article} ${w.english} — ${w.meaningKurdish}`,
      },
      order: order++,
    });
  });

  return exercises;
}

function buildUnits(): UnitInput[] {
  return UNIT_TOPICS.map((u, idx) => {
    const order = idx + 1;
    const lessons: LessonInput[] = [1, 2, 3].map((ln) => ({
      title: `${order}.${ln} ${u.topic} — ${LESSON_ACTIVITY[ln]}`,
      order: ln,
      xpReward: ln === 3 ? 15 : 10,
      exercises: [],
    }));

    // Unit 3 (index 2) Lesson 1 — the first Practice 1 instance in the book.
    if (u.topic === "Jobs") {
      lessons[0].exercises = buildPractice1Exercises(JOB_WORDS);
    }

    return { title: u.title, order, lessons };
  });
}

export const SUNRISE3_UNITS: UnitInput[] = buildUnits();

export async function runSunriseSeed() {
  console.log("=== Seeding Sunrise 3 (English for Kurdish Schools) ===");

  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL || "https://qualified-egret-206.convex.cloud";
  const adminSecret = process.env.ADMIN_SEED_SECRET || "ferbe-secret-2026";

  const totalLessons = SUNRISE3_UNITS.reduce((a, u) => a + u.lessons.length, 0);
  const totalExercises = SUNRISE3_UNITS.reduce(
    (a, u) => a + u.lessons.reduce((l, x) => l + x.exercises.length, 0),
    0
  );

  console.log(
    `Prepared ${SUNRISE3_UNITS.length} units, ${totalLessons} lessons, ${totalExercises} interactive exercises (Practice 1).`
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
