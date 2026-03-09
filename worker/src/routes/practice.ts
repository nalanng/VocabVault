import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import { calculateSM2 } from '../services/sm2';

type Variables = { userId: string };

export const practiceRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

practiceRoutes.use('/*', authMiddleware);

// Submit a practice result for a single word
practiceRoutes.post('/result', async (c) => {
  const userId = c.get('userId');
  const { word_id, quality } = await c.req.json<{ word_id: string; quality: number }>();

  if (!word_id || quality === undefined || quality < 0 || quality > 5) {
    return c.json({ error: 'word_id ve quality (0-5) gerekli' }, 400);
  }

  // Verify word belongs to user
  const word = await c.env.DB.prepare(
    'SELECT id FROM words WHERE id = ? AND user_id = ?'
  ).bind(word_id, userId).first();

  if (!word) {
    return c.json({ error: 'Kelime bulunamadı' }, 404);
  }

  // Get or create progress record
  let progress = await c.env.DB.prepare(
    'SELECT * FROM word_progress WHERE word_id = ?'
  ).bind(word_id).first<{
    id: string;
    ease_factor: number;
    interval: number;
    repetitions: number;
    total_correct: number;
    total_attempts: number;
  }>();

  const isCorrect = quality >= 3;
  const today = new Date().toISOString().split('T')[0];

  if (!progress) {
    // Create new progress record
    const sm2 = calculateSM2({
      quality,
      repetitions: 0,
      easeFactor: 2.5,
      interval: 0,
    });

    const id = crypto.randomUUID();
    await c.env.DB.prepare(`
      INSERT INTO word_progress (id, word_id, user_id, ease_factor, interval, repetitions, next_review, total_correct, total_attempts, last_reviewed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, word_id, userId,
      sm2.easeFactor, sm2.interval, sm2.repetitions, sm2.nextReview,
      isCorrect ? 1 : 0, 1, today
    ).run();

    return c.json({
      progress: {
        id,
        word_id,
        user_id: userId,
        ease_factor: sm2.easeFactor,
        interval: sm2.interval,
        repetitions: sm2.repetitions,
        next_review: sm2.nextReview,
        total_correct: isCorrect ? 1 : 0,
        total_attempts: 1,
        last_reviewed: today,
      },
    });
  }

  // Update existing progress
  const sm2 = calculateSM2({
    quality,
    repetitions: progress.repetitions,
    easeFactor: progress.ease_factor,
    interval: progress.interval,
  });

  const newCorrect = progress.total_correct + (isCorrect ? 1 : 0);
  const newAttempts = progress.total_attempts + 1;

  await c.env.DB.prepare(`
    UPDATE word_progress
    SET ease_factor = ?, interval = ?, repetitions = ?, next_review = ?,
        total_correct = ?, total_attempts = ?, last_reviewed = ?
    WHERE word_id = ?
  `).bind(
    sm2.easeFactor, sm2.interval, sm2.repetitions, sm2.nextReview,
    newCorrect, newAttempts, today, word_id
  ).run();

  return c.json({
    progress: {
      id: progress.id,
      word_id,
      user_id: userId,
      ease_factor: sm2.easeFactor,
      interval: sm2.interval,
      repetitions: sm2.repetitions,
      next_review: sm2.nextReview,
      total_correct: newCorrect,
      total_attempts: newAttempts,
      last_reviewed: today,
    },
  });
});

// Save practice session
practiceRoutes.post('/sessions', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{
    mode: string;
    total_words: number;
    correct_count: number;
    accuracy: number;
    duration_seconds: number;
  }>();

  const id = crypto.randomUUID();

  await c.env.DB.prepare(`
    INSERT INTO practice_sessions (id, user_id, mode, total_words, correct_count, accuracy, duration_seconds)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, userId, body.mode, body.total_words,
    body.correct_count, body.accuracy, body.duration_seconds
  ).run();

  return c.json({
    session: {
      id,
      user_id: userId,
      mode: body.mode,
      total_words: body.total_words,
      correct_count: body.correct_count,
      accuracy: body.accuracy,
      duration_seconds: body.duration_seconds,
      completed_at: new Date().toISOString(),
    },
  }, 201);
});

// Get practice sessions
practiceRoutes.get('/sessions', async (c) => {
  const userId = c.get('userId');

  const result = await c.env.DB.prepare(
    'SELECT * FROM practice_sessions WHERE user_id = ? ORDER BY completed_at DESC LIMIT 50'
  ).bind(userId).all();

  return c.json({ sessions: result.results || [] });
});
