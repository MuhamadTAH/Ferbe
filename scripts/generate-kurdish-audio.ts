import * as fs from "fs";
import * as path from "path";

interface WordItem {
  kurdishText: string;
  englishText: string;
  transliteration: string;
  kurdishAudioUrl?: string | null;
  englishAudioUrl?: string | null;
}

/**
 * Creates a clean safe audio filename from transliteration or English text.
 */
function getKurdishAudioFilename(word: WordItem): string {
  if (word.kurdishAudioUrl && word.kurdishAudioUrl.startsWith("/audio/")) {
    return path.basename(word.kurdishAudioUrl);
  }
  const cleanName = word.transliteration
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return `${cleanName || "word"}.mp3`;
}

async function generateKurdishAudio() {
  console.log("=== Fêrbe Kurdish TTS Batch Generator ===");

  const ttsServiceUrl =
    process.env.TTS_SERVICE_URL || "http://localhost:8000/api/tts";
  const isDryRun = process.argv.includes("--dry-run");

  const jsonPath = path.resolve(__dirname, "../data/sorani_basics_50.json");
  const audioDir = path.resolve(__dirname, "../public/audio");

  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: Dataset file not found at ${jsonPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const raw = fs.readFileSync(jsonPath, "utf-8");
  const words: WordItem[] = JSON.parse(raw);

  const missingWords: Array<{ word: WordItem; filename: string }> = [];

  for (const word of words) {
    const filename = getKurdishAudioFilename(word);
    const destPath = path.join(audioDir, filename);

    if (!fs.existsSync(destPath)) {
      missingWords.push({ word, filename });
    }
  }

  console.log(`- Total vocabulary words: ${words.length}`);
  console.log(`- Audio files existing in /public/audio/: ${words.length - missingWords.length}`);
  console.log(`- Missing audio files: ${missingWords.length}`);
  console.log(`- Target TTS Service: ${ttsServiceUrl}`);

  if (missingWords.length === 0) {
    console.log("All audio files are physically present in /public/audio/!");
    return;
  }

  if (isDryRun) {
    console.log("\n[DRY RUN] Missing audio files to generate:");
    missingWords.slice(0, 10).forEach(({ word, filename }, idx) => {
      console.log(`  ${idx + 1}. [${word.kurdishText}] -> ${filename}`);
    });
    if (missingWords.length > 10) {
      console.log(`  ... and ${missingWords.length - 10} more.`);
    }
    console.log("\nRun without --dry-run to send requests to TTS_SERVICE_URL.");
    return;
  }

  console.log(`\nDispatching TTS requests to ${ttsServiceUrl}...`);
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < missingWords.length; i++) {
    const { word, filename } = missingWords[i];
    const payload = {
      text: word.kurdishText,
      filename,
    };

    try {
      console.log(`[${i + 1}/${missingWords.length}] Requesting audio for '${word.kurdishText}' (${filename})...`);

      const response = await fetch(ttsServiceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const destPath = path.join(audioDir, filename);
      fs.writeFileSync(destPath, buffer);

      console.log(`✓ Saved ${filename} (${buffer.length} bytes)`);
      successCount++;
    } catch (err: any) {
      console.warn(`⚠ Failed to generate audio for '${word.kurdishText}':`, err?.message || err);
      failureCount++;
    }
  }

  console.log("\n=== Generation Summary ===");
  console.log(`- Successfully generated: ${successCount}`);
  console.log(`- Failed / Skipped: ${failureCount}`);
}

generateKurdishAudio().catch((err) => {
  console.error("Fatal error during audio generation:", err);
  process.exit(1);
});
