import { seededShuffle } from "./seededShuffle";

export interface QuizWord {
  englishText: string;
}

/**
 * Generates 4 multiple-choice options: 1 correct answer + 3 distinct
 * distractors drawn from the available vocabulary. When a seed is provided the
 * shuffle is deterministic (stable across re-renders); otherwise Math.random
 * is used.
 */
export function generateQuizOptions(
  correctTranslation: string,
  availableWords: QuizWord[],
  seed?: number
): string[] {
  const correct = correctTranslation.trim();

  const potentialDistractors = new Set<string>();
  for (const w of availableWords) {
    const candidate = w.englishText.trim();
    if (candidate && candidate.toLowerCase() !== correct.toLowerCase()) {
      potentialDistractors.add(candidate);
    }
  }

  const distractors = seededShuffle(
    Array.from(potentialDistractors),
    seed ?? Math.floor(Math.random() * 2 ** 31)
  ).slice(0, 3);

  const options = [correct, ...distractors];
  return seededShuffle(
    options,
    seed ?? Math.floor(Math.random() * 2 ** 31)
  );
}
