import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';

type Variables = { userId: string };

export const statsRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

statsRoutes.use('/*', authMiddleware);

// Overview stats
statsRoutes.get('/overview', async (c) => {
  const userId = c.get('userId');
  const today = new Date().toISOString().split('T')[0];

  const [totalWords, wordsReviewed, avgAccuracy, dueToday, weakWords, totalSessions] =
    await Promise.all([
      c.env.DB.prepare('SELECT COUNT(*) as count FROM words WHERE user_id = ?')
        .bind(userId).first<{ count: number }>(),
      c.env.DB.prepare('SELECT COUNT(*) as count FROM word_progress WHERE user_id = ? AND total_attempts > 0')
        .bind(userId).first<{ count: number }>(),
      c.env.DB.prepare(`
        SELECT COALESCE(AVG(CAST(total_correct AS REAL) / NULLIF(total_attempts, 0) * 100), 0) as avg
        FROM word_progress WHERE user_id = ? AND total_attempts > 0
      `).bind(userId).first<{ avg: number }>(),
      c.env.DB.prepare(`
        SELECT COUNT(*) as count FROM words w
        LEFT JOIN word_progress wp ON w.id = wp.word_id
        WHERE w.user_id = ? AND (wp.next_review IS NULL OR wp.next_review <= ?)
      `).bind(userId, today).first<{ count: number }>(),
      c.env.DB.prepare(`
        SELECT COUNT(*) as count FROM word_progress
        WHERE user_id = ? AND total_attempts > 0
          AND (CAST(total_correct AS REAL) / total_attempts) < 0.6
      `).bind(userId).first<{ count: number }>(),
      c.env.DB.prepare('SELECT COUNT(*) as count FROM practice_sessions WHERE user_id = ?')
        .bind(userId).first<{ count: number }>(),
    ]);

  return c.json({
    total_words: totalWords?.count ?? 0,
    words_reviewed: wordsReviewed?.count ?? 0,
    average_accuracy: Math.round(avgAccuracy?.avg ?? 0),
    due_today: dueToday?.count ?? 0,
    weak_words: weakWords?.count ?? 0,
    total_sessions: totalSessions?.count ?? 0,
  });
});

// Word-level stats
statsRoutes.get('/words', async (c) => {
  const userId = c.get('userId');

  const result = await c.env.DB.prepare(`
    SELECT w.*,
      wp.id as progress_id, wp.ease_factor, wp.interval, wp.repetitions,
      wp.next_review, wp.total_correct, wp.total_attempts, wp.last_reviewed
    FROM words w
    LEFT JOIN word_progress wp ON w.id = wp.word_id
    WHERE w.user_id = ?
    ORDER BY CASE
      WHEN wp.total_attempts > 0
      THEN CAST(wp.total_correct AS REAL) / wp.total_attempts
      ELSE 2
    END ASC
  `).bind(userId).all();

  const words = (result.results || []).map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    source_word: row.source_word,
    target_word: row.target_word,
    source_lang: row.source_lang,
    target_lang: row.target_lang,
    example_sentence: row.example_sentence,
    notes: row.notes,
    created_at: row.created_at,
    progress: {
      id: row.progress_id || '',
      word_id: row.id,
      user_id: row.user_id,
      ease_factor: row.ease_factor ?? 2.5,
      interval: row.interval ?? 0,
      repetitions: row.repetitions ?? 0,
      next_review: row.next_review,
      total_correct: row.total_correct ?? 0,
      total_attempts: row.total_attempts ?? 0,
      last_reviewed: row.last_reviewed,
    },
  }));

  return c.json({ words });
});
