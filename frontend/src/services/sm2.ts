import type { SM2Result } from '../types';

/**
 * SM-2 spaced repetition algorithm.
 * @param quality 0-5 rating (0-2 = incorrect, 3-5 = correct)
 * @param repetitions current consecutive correct count
 * @param easeFactor current ease factor (min 1.3)
 * @param interval current interval in days
 */
export function sm2(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
): SM2Result {
  let newRepetitions = repetitions;
  let newInterval = interval;

  if (quality >= 3) {
    if (newRepetitions === 0) newInterval = 1;
    else if (newRepetitions === 1) newInterval = 6;
    else newInterval = Math.round(newInterval * easeFactor);
    newRepetitions += 1;
  } else {
    newRepetitions = 0;
    newInterval = 1;
  }

  let newEaseFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return {
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview: nextReview.toISOString().split('T')[0],
  };
}

/** Map flashcard button to SM-2 quality */
export function flashcardQuality(
  response: 'again' | 'hard' | 'good' | 'easy'
): number {
  switch (response) {
    case 'again': return 1;
    case 'hard': return 2;
    case 'good': return 4;
    case 'easy': return 5;
  }
}

/** Map quiz result to SM-2 quality */
export function quizQuality(correct: boolean): number {
  return correct ? 4 : 1;
}
