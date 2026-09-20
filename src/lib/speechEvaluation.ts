/**
 * Speech Evaluation and Fuzzy Matching Utility
 * Accurately evaluates speech-to-text transcripts against target exercise phrases.
 * Tolerates normal speech recognition variations (contractions, missing punctuation, casing),
 * while strictly catching wrong words, missing clauses, or unrelated speech.
 */

export interface SpeechEvaluationResult {
  isMatch: boolean;
  score: number; // 0.0 to 1.0
  matchedWords: string[];
  missingWords: string[];
  spokenNormalized: string;
  targetNormalized: string;
}

/**
 * Expand standard English contractions to canonical words.
 */
export function expandContractions(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\b(i'm|im)\b/g, "i am")
    .replace(/\b(you're|youre)\b/g, "you are")
    .replace(/\b(he's|hes)\b/g, "he is")
    .replace(/\b(she's|shes)\b/g, "she is")
    .replace(/\b(it's|its)\b/g, "it is")
    .replace(/\b(we're|were)\b/g, "we are")
    .replace(/\b(they're|theyre)\b/g, "they are")
    .replace(/\b(what's|whats)\b/g, "what is")
    .replace(/\b(where's|wheres)\b/g, "where is")
    .replace(/\b(how's|hows)\b/g, "how is")
    .replace(/\b(that's|thats)\b/g, "that is")
    .replace(/\b(don't|dont)\b/g, "do not")
    .replace(/\b(can't|cant)\b/g, "cannot")
    .replace(/\b(thanks)\b/g, "thank you");
}

/**
 * Normalize text for spoken speech matching:
 * lowercase, expand contractions, strip all punctuation, collapse whitespace.
 */
export function normalizeSpeech(text: string): string {
  const expanded = expandContractions(text);
  return expanded
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generate candidate target sentences from visual scaffold options like "I'm [good / cool], thank you."
 */
export function extractCandidateTargets(target: string, scaffold?: string): string[] {
  const candidates = new Set<string>();
  if (target.trim().length > 0) {
    candidates.add(target.trim());
  }

  if (scaffold && scaffold.includes("[") && scaffold.includes("]")) {
    const match = scaffold.match(/\[([^\]]+)\]/);
    if (match && match[1]) {
      const options = match[1].split("/").map((o) => o.trim()).filter(Boolean);
      for (const opt of options) {
        const variant = scaffold.replace(/\[([^\]]+)\]/, opt);
        candidates.add(variant);
      }
    }
  }

  return Array.from(candidates);
}

/**
 * Calculate Longest Common Subsequence of word tokens.
 */
function longestCommonSubsequence(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result;
}

/**
 * Compute Levenshtein distance between two strings.
 */
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Evaluate spoken answer against single target string.
 */
function evaluateSingleTarget(spoken: string, target: string): SpeechEvaluationResult {
  const normSpoken = normalizeSpeech(spoken);
  const normTarget = normalizeSpeech(target);

  if (normSpoken.length === 0 || normTarget.length === 0) {
    return {
      isMatch: false,
      score: 0,
      matchedWords: [],
      missingWords: normTarget.split(" ").filter(Boolean),
      spokenNormalized: normSpoken,
      targetNormalized: normTarget,
    };
  }

  // Exact normalized match
  if (normSpoken === normTarget) {
    const targetWords = normTarget.split(" ");
    return {
      isMatch: true,
      score: 1.0,
      matchedWords: targetWords,
      missingWords: [],
      spokenNormalized: normSpoken,
      targetNormalized: normTarget,
    };
  }

  const spokenWords = normSpoken.split(" ").filter(Boolean);
  const targetWords = normTarget.split(" ").filter(Boolean);

  // Longest common sequence of words
  const lcsWords = longestCommonSubsequence(spokenWords, targetWords);
  const wordScore = targetWords.length > 0 ? lcsWords.length / targetWords.length : 0;

  // Character-level Levenshtein similarity
  const maxLen = Math.max(normSpoken.length, normTarget.length);
  const dist = levenshteinDistance(normSpoken, normTarget);
  const charScore = maxLen > 0 ? Math.max(0, 1 - dist / maxLen) : 0;

  // Blended score (70% word sequence + 30% character similarity)
  const score = Math.round((wordScore * 0.7 + charScore * 0.3) * 100) / 100;

  const missingWords = targetWords.filter((w) => !lcsWords.includes(w));

  // Determine if it passes:
  // - For 1-3 word targets: needs >= 67% match (e.g. 2 of 3 words, or 1 of 1, 2 of 2)
  // - For 4+ word targets: needs >= 70% match and not vastly wrong length
  const lengthRatio = spokenWords.length / targetWords.length;
  const isReasonableLength = lengthRatio >= 0.5 && lengthRatio <= 1.8;

  let isMatch = false;
  if (targetWords.length <= 3) {
    isMatch = wordScore >= 0.66 && charScore >= 0.65;
  } else {
    isMatch = wordScore >= 0.70 && charScore >= 0.65 && isReasonableLength;
  }

  return {
    isMatch,
    score,
    matchedWords: lcsWords,
    missingWords,
    spokenNormalized: normSpoken,
    targetNormalized: normTarget,
  };
}

/**
 * Main evaluation function:
 * Evaluates spoken speech against target text and any scaffold options.
 * Returns the best result across all candidate targets.
 */
export function evaluateSpokenAnswer(
  spokenText: string,
  targetText: string,
  scaffoldText?: string
): SpeechEvaluationResult {
  const candidates = extractCandidateTargets(targetText, scaffoldText);
  if (candidates.length === 0) {
    candidates.push(targetText);
  }

  let bestResult: SpeechEvaluationResult = {
    isMatch: false,
    score: 0,
    matchedWords: [],
    missingWords: [],
    spokenNormalized: "",
    targetNormalized: "",
  };

  for (const candidate of candidates) {
    const res = evaluateSingleTarget(spokenText, candidate);
    if (res.score > bestResult.score || (!bestResult.isMatch && res.isMatch)) {
      bestResult = res;
    }
    if (bestResult.isMatch && bestResult.score >= 0.95) {
      break;
    }
  }

  return bestResult;
}
