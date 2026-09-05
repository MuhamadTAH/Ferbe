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

async function runSeed() {
  console.log("=== Fêrbe Bulk Ingestion Pipeline ===");

  const jsonPath = path.resolve(__dirname, "../data/sorani_basics_50.json");
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: Dataset file not found at ${jsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, "utf-8");
  let words: WordEntry[];

  try {
    words = JSON.parse(rawData);
  } catch (err) {
    console.error("Error: Failed to parse JSON file:", err);
    process.exit(1);
  }

  if (!Array.isArray(words) || words.length === 0) {
    console.error("Error: Dataset must contain a non-empty array of words.");
    process.exit(1);
  }

  console.log(`Loaded ${words.length} words from ${path.basename(jsonPath)}`);

  // Validate fields for each word
  const kurdishTextSet = new Set<string>();
  let duplicates = 0;
  let withPhysicalAudio = 0;
  let withNullAudio = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!w.kurdishText || !w.englishText || !w.transliteration || !w.imageUrl) {
      console.error(
        `Validation error at index ${i}: Missing required schema field (kurdishText, englishText, transliteration, imageUrl).`
      );
      process.exit(1);
    }

    const trimmedKurdish = w.kurdishText.trim();
    if (kurdishTextSet.has(trimmedKurdish)) {
      duplicates++;
    } else {
      kurdishTextSet.add(trimmedKurdish);
    }

    if (w.kurdishAudioUrl || w.englishAudioUrl) {
      withPhysicalAudio++;
    } else {
      withNullAudio++;
    }
  }

  console.log(`- Total records: ${words.length}`);
  console.log(`- Unique Kurdish words: ${kurdishTextSet.size}`);
  console.log(`- Duplicates found in dataset: ${duplicates}`);
  console.log(`- Words with active physical audio: ${withPhysicalAudio}`);
  console.log(`- Words with null/graceful audio fallback: ${withNullAudio}`);

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const adminSecret = process.env.ADMIN_SEED_SECRET || "ferbe_admin_secret";

  if (!convexUrl || convexUrl.includes("dummy-preview")) {
    console.log("\n[INFO] NEXT_PUBLIC_CONVEX_URL is not configured for a live deployment.");
    console.log("Verified dataset validity successfully (dry-run mode).");
    console.log("When Convex is configured, this script will push directly to the live database.");
    return;
  }

  try {
    console.log(`\nConnecting to Convex at: ${convexUrl}...`);
    const client = new ConvexHttpClient(convexUrl);
    const result = await client.mutation(api.words.seedCategoryWordsAdmin, {
      adminSecret,
      categorySlug: "basics",
      categoryName: "Basics",
      words,
    });

    console.log("\nSeeding result from Convex:");
    console.log(`- Category: ${result.categorySlug} (${result.categoryId})`);
    console.log(`- Inserted: ${result.inserted} words`);
    console.log(`- Skipped: ${result.skipped} words (already exist)`);
    console.log(`- Total processed: ${result.total}`);
    console.log("Successfully completed bulk ingestion!");
  } catch (err: any) {
    console.error("Error communicating with Convex backend:", err?.message || err);
    process.exit(1);
  }
}

runSeed().catch((err) => {
  console.error("Unexpected error in seed script:", err);
  process.exit(1);
});
