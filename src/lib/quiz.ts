export const FALLBACK_VOCABULARY_TRANSLATIONS = [
  "Hello",
  "Thank you",
  "Good morning",
  "Water",
  "Bread",
  "Home",
  "Book",
  "Table",
  "Door",
  "Cat",
  "Dog",
  "Sun",
  "Moon",
  "Tea",
  "Coffee",
  "Apple",
  "Friend",
  "School",
];

/**
 * Generates 4 unique multiple-choice options:
 * 1 correct answer + 3 random distinct distractors from current vocabulary.
 */
export function generateQuizOptions(
  correctTranslation: string,
  availableWords: Array<{ englishText: string }>
): string[] {
  const correct = correctTranslation.trim();

  // Collect potential distractors from available vocabulary
  const potentialDistractors = new Set<string>();

  for (const w of availableWords) {
    const candidate = w.englishText.trim();
    if (candidate.toLowerCase() !== correct.toLowerCase()) {
      potentialDistractors.add(candidate);
    }
  }

  // Supplement from fallback pool if needed
  for (const fallback of FALLBACK_VOCABULARY_TRANSLATIONS) {
    if (potentialDistractors.size >= 3) break;
    if (fallback.toLowerCase() !== correct.toLowerCase()) {
      potentialDistractors.add(fallback);
    }
  }

  // Shuffle distractors and take 3
  const distractorsArray = Array.from(potentialDistractors);
  for (let i = distractorsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distractorsArray[i], distractorsArray[j]] = [
      distractorsArray[j],
      distractorsArray[i],
    ];
  }

  const selectedDistractors = distractorsArray.slice(0, 3);
  const options = [correct, ...selectedDistractors];

  // Final shuffle of the 4 options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options;
}
