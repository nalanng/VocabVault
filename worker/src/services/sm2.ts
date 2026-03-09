export interface SM2Input {
  quality: number; // 0-5
  repetitions: number;
  easeFactor: number;
  interval: number;
}

export interface SM2Output {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string; // YYYY-MM-DD
}

export function calculateSM2(input: SM2Input): SM2Output {
  let { quality, repetitions, easeFactor, interval } = input;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReview: nextReview.toISOString().split('T')[0],
  };
}
