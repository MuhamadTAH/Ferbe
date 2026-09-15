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
  title: "English for Kurdish Speakers (ئینگلیزی بۆ کورد)",
  slug: "english-from-kurdish",
  sourceLanguage: "ckb",
  targetLanguage: "en",
};

/**
 * Level 0 Curriculum: Foundations, Phonics, Blends, and Basic Conversational Frames.
 * Structured into Orientation + 9 Core Sections (10 Units, 58 Lessons).
 * All exercises are left empty initially as requested.
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
      {
        title: "0.4 Ready to Begin: Start Section 1",
        order: 4,
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
      {
        title: "1.1 Sound & Blend: First Letters (S, A, T, P, I, N)",
        order: 1,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "1.2 Word Builder: Build Real Words (Pan, Tin, Pin, Ant, Tap)",
        order: 2,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "1.3 Sentence Frame: 'I see a...'",
        order: 3,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "1.4 Ear Training: Catch the Sound (Pan vs. Pin)",
        order: 4,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "1.5 Rapid Speaking: Say What You See",
        order: 5,
        xpReward: 10,
        exercises: [],
      },
      {
        title: "1.6 Checkpoint 1: Unlock the Next Step",
        order: 6,
        xpReward: 20,
        exercises: [],
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

export async function runEnglishSeed() {
  console.log("=== Seeding English for Kurdish Speakers (ئینگلیزی بۆ کورد) ===");

  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL || "https://qualified-egret-206.convex.cloud";
  const adminSecret = process.env.ADMIN_SEED_SECRET || "ferbe-secret-2026";

  const totalExercises = LEVEL_0_UNITS.reduce(
    (acc, u) => acc + u.lessons.reduce((lAcc, l) => lAcc + l.exercises.length, 0),
    0
  );
  const totalLessons = LEVEL_0_UNITS.reduce((acc, u) => acc + u.lessons.length, 0);

  console.log(
    `Prepared ${LEVEL_0_UNITS.length} units, ${totalLessons} lessons, ${totalExercises} interactive exercises.`
  );

  const client = new ConvexHttpClient(convexUrl);

  try {
    console.log(`Connecting to Convex at: ${convexUrl}...`);
    const result = await client.mutation(api.admin.seedCurriculum, {
      adminSecret,
      course: COURSE,
      units: LEVEL_0_UNITS,
      deleteOtherCourses: true,
    });

    console.log("\nCourse successfully seeded & old courses replaced!");
    console.log(`- Course slug: ${result.courseSlug}`);
    console.log(`- Lessons upserted: ${result.lessonsUpserted}`);
    console.log(`- Exercises written: ${result.exercisesWritten}`);
    return result;
  } catch (err) {
    console.error("Failed to seed course:", err);
    throw err;
  }
}

// Only execute if called directly via CLI
if (typeof require !== "undefined" && require.main === module) {
  runEnglishSeed().catch(() => process.exit(1));
} else if (process.argv[1]?.includes("seed-english-course")) {
  runEnglishSeed().catch(() => process.exit(1));
}
