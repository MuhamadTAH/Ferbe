import * as fs from "fs";
import * as path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

interface WordEntry {
  kurdishText: string;
  englishText: string;
  transliteration: string;
  imageUrl: string;
  kurdishAudioUrl?: string | null;
  englishAudioUrl?: string | null;
  order?: number;
}

interface SentenceEntry {
  english: string;
  kurdish: string;
}

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

const WORDS_PER_LESSON = 10;
const XP_PER_LESSON = 10;
const COURSE = {
  title: "Sorani Basics",
  slug: "sorani-basics",
  sourceLanguage: "en",
  targetLanguage: "ckb",
};

function cyclicDistractors(
  pool: string[],
  exclude: string,
  count: number
): string[] {
  const distractors: string[] = [];
  for (const candidate of pool) {
    if (distractors.length >= count) break;
    if (candidate !== exclude && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
  }
  return distractors;
}

function buildExercises(
  lessonWords: WordEntry[],
  allEnglish: string[],
  allKurdish: string[],
  lessonSentences: SentenceEntry[]
): ExerciseInput[] {
  const exercises: ExerciseInput[] = [];
  let order = 0;

  for (const word of lessonWords) {
    // 1) multiple_choice: Kurdish prompt -> pick the English translation.
    order += 1;
    exercises.push({
      type: "multiple_choice",
      promptText: word.kurdishText,
      solutionData: { correct: word.englishText },
      distractors: cyclicDistractors(allEnglish, word.englishText, 3),
      order,
    });

    // 2) audio_match: play available audio -> pick the matching text.
    //    Kurdish audio is preferred (pick Kurdish text); otherwise the English
    //    pronunciation drives an English-text recognition exercise.
    const kurdishAudio = word.kurdishAudioUrl ?? null;
    const englishAudio = word.englishAudioUrl ?? null;
    if (kurdishAudio || englishAudio) {
      order += 1;
      const useKurdish = Boolean(kurdishAudio);
      exercises.push({
        type: "audio_match",
        promptText: "Tap what you hear",
        solutionData: {
          audioUrl: useKurdish ? kurdishAudio : englishAudio,
          audioLang: useKurdish ? "kurdish" : "english",
          correct: useKurdish ? word.kurdishText : word.englishText,
        },
        distractors: useKurdish
          ? cyclicDistractors(allKurdish, word.kurdishText, 3)
          : cyclicDistractors(allEnglish, word.englishText, 3),
        order,
      });
    }
  }

  // 3) word_bank: assemble the Kurdish sentence from shuffled tokens.
  for (const sentence of lessonSentences) {
    const tokens = sentence.kurdish.split(/\s+/).filter(Boolean);
    const distractorPool: string[] = [];
    for (const other of lessonSentences) {
      if (other.kurdish === sentence.kurdish) continue;
      for (const token of other.kurdish.split(/\s+/).filter(Boolean)) {
        if (!tokens.includes(token) && !distractorPool.includes(token)) {
          distractorPool.push(token);
        }
      }
    }
    order += 1;
    exercises.push({
      type: "word_bank",
      promptText: sentence.english,
      solutionData: { tokens },
      distractors: distractorPool.slice(0, 3),
      order,
    });
  }

  return exercises;
}

async function runSeed() {
  console.log("=== Fêrbe curriculum seeding ===");

  const wordsPath = path.resolve(__dirname, "../data/sorani_basics_50.json");
  const sentencesPath = path.resolve(
    __dirname,
    "../data/sorani_sentences_draft.json"
  );

  if (!fs.existsSync(wordsPath)) {
    console.error(`Error: dataset not found at ${wordsPath}`);
    process.exit(1);
  }

  const words: WordEntry[] = JSON.parse(fs.readFileSync(wordsPath, "utf-8"));
  if (!Array.isArray(words) || words.length === 0) {
    console.error("Error: word dataset must be a non-empty array.");
    process.exit(1);
  }

  let sentences: SentenceEntry[] = [];
  if (fs.existsSync(sentencesPath)) {
    const parsed = JSON.parse(fs.readFileSync(sentencesPath, "utf-8")) as {
      sentences?: SentenceEntry[];
    };
    sentences = parsed.sentences ?? [];
  }

  const valid = words.every(
    (w) =>
      w.kurdishText &&
      w.englishText &&
      w.transliteration &&
      w.imageUrl
  );
  if (!valid) {
    console.error(
      "Error: every word needs kurdishText, englishText, transliteration, imageUrl."
    );
    process.exit(1);
  }

  const allEnglish = words.map((w) => w.englishText);
  const allKurdish = words.map((w) => w.kurdishText);

  // Group words into lessons of WORDS_PER_LESSON.
  const lessonCount = Math.ceil(words.length / WORDS_PER_LESSON);
  const units = [
    {
      title: "Basics",
      order: 1,
      lessons: Array.from({ length: lessonCount }, (_, i) => {
        const lessonWords = words.slice(
          i * WORDS_PER_LESSON,
          (i + 1) * WORDS_PER_LESSON
        );
        const lessonSentences = sentences.filter(
          (_, j) => j % lessonCount === i
        );
        const first = lessonWords[0]?.transliteration ?? `Lesson ${i + 1}`;
        return {
          title: `Lesson ${i + 1}: ${first}`,
          order: i + 1,
          xpReward: XP_PER_LESSON,
          exercises: buildExercises(
            lessonWords,
            allEnglish,
            allKurdish,
            lessonSentences
          ),
        } satisfies LessonInput;
      }),
    },
  ];

  const exerciseCount = units[0].lessons.reduce(
    (sum, l) => sum + l.exercises.length,
    0
  );
  console.log(
    `Prepared ${lessonCount} lessons, ${words.length} words, ${sentences.length} draft sentences, ${exerciseCount} exercises.`
  );

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const adminSecret = process.env.ADMIN_SEED_SECRET;

  if (!convexUrl || convexUrl.includes("dummy-preview")) {
    console.log(
      "\n[DRY RUN] NEXT_PUBLIC_CONVEX_URL is not configured. Validated the dataset successfully; set NEXT_PUBLIC_CONVEX_URL + ADMIN_SEED_SECRET to seed a live deployment."
    );
    return;
  }

  if (!adminSecret) {
    console.error(
      "\nError: ADMIN_SEED_SECRET is required to seed a live deployment (and must match the Convex deployment environment variable). No default exists."
    );
    process.exit(1);
  }

  try {
    console.log(`\nConnecting to Convex at: ${convexUrl}...`);
    const client = new ConvexHttpClient(convexUrl);
    const result = await client.mutation(api.admin.seedCurriculum, {
      adminSecret,
      course: COURSE,
      units,
    });
    console.log("\nSeeding result:");
    console.log(`- Course: ${result.courseSlug}`);
    console.log(`- Lessons upserted: ${result.lessonsUpserted}`);
    console.log(`- Exercises written: ${result.exercisesWritten}`);
    console.log("Done!");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error seeding curriculum:", message);
    process.exit(1);
  }
}

runSeed().catch((err: unknown) => {
  console.error("Unexpected error in seed script:", err);
  process.exit(1);
});
