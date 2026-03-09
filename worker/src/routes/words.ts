import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';

type Variables = { userId: string };

export const wordRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

wordRoutes.use('/*', authMiddleware);

// List words
wordRoutes.get('/', async (c) => {
  const userId = c.get('userId');
  const search = c.req.query('search');
  const sourceLang = c.req.query('source_lang');
  const targetLang = c.req.query('target_lang');
  const sort = c.req.query('sort') || 'date';

  let query = `
    SELECT w.*,
      wp.ease_factor, wp.interval, wp.repetitions, wp.next_review,
      wp.total_correct, wp.total_attempts, wp.last_reviewed
    FROM words w
    LEFT JOIN word_progress wp ON w.id = wp.word_id
    WHERE w.user_id = ?
  `;
  const params: string[] = [userId];

  if (search) {
    query += ` AND (w.source_word LIKE ? OR w.target_word LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }
  if (sourceLang) {
    query += ` AND w.source_lang = ?`;
    params.push(sourceLang);
  }
  if (targetLang) {
    query += ` AND w.target_lang = ?`;
    params.push(targetLang);
  }

  switch (sort) {
    case 'alpha':
      query += ` ORDER BY w.source_word ASC`;
      break;
    case 'accuracy':
      query += ` ORDER BY CASE WHEN wp.total_attempts > 0 THEN CAST(wp.total_correct AS REAL) / wp.total_attempts ELSE -1 END ASC`;
      break;
    default:
      query += ` ORDER BY w.created_at DESC`;
  }

  const stmt = c.env.DB.prepare(query);
  const result = await stmt.bind(...params).all();

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
    progress: row.total_attempts !== null ? {
      ease_factor: row.ease_factor,
      interval: row.interval,
      repetitions: row.repetitions,
      next_review: row.next_review,
      total_correct: row.total_correct,
      total_attempts: row.total_attempts,
      last_reviewed: row.last_reviewed,
    } : null,
  }));

  return c.json({ words });
});

// Get due words (SM-2 next_review <= today)
wordRoutes.get('/due', async (c) => {
  const userId = c.get('userId');
  const today = new Date().toISOString().split('T')[0];

  const result = await c.env.DB.prepare(`
    SELECT w.*,
      wp.ease_factor, wp.interval, wp.repetitions, wp.next_review,
      wp.total_correct, wp.total_attempts, wp.last_reviewed
    FROM words w
    LEFT JOIN word_progress wp ON w.id = wp.word_id
    WHERE w.user_id = ? AND (wp.next_review IS NULL OR wp.next_review <= ?)
    ORDER BY wp.next_review ASC
  `).bind(userId, today).all();

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
    progress: row.total_attempts !== null ? {
      ease_factor: row.ease_factor,
      interval: row.interval,
      repetitions: row.repetitions,
      next_review: row.next_review,
      total_correct: row.total_correct,
      total_attempts: row.total_attempts,
      last_reviewed: row.last_reviewed,
    } : null,
  }));

  return c.json({ words });
});

// Get weak words (accuracy < 60%)
wordRoutes.get('/weak', async (c) => {
  const userId = c.get('userId');

  const result = await c.env.DB.prepare(`
    SELECT w.*,
      wp.ease_factor, wp.interval, wp.repetitions, wp.next_review,
      wp.total_correct, wp.total_attempts, wp.last_reviewed
    FROM words w
    INNER JOIN word_progress wp ON w.id = wp.word_id
    WHERE w.user_id = ? AND wp.total_attempts > 0
      AND (CAST(wp.total_correct AS REAL) / wp.total_attempts) < 0.6
    ORDER BY (CAST(wp.total_correct AS REAL) / wp.total_attempts) ASC
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
      ease_factor: row.ease_factor,
      interval: row.interval,
      repetitions: row.repetitions,
      next_review: row.next_review,
      total_correct: row.total_correct,
      total_attempts: row.total_attempts,
      last_reviewed: row.last_reviewed,
    },
  }));

  return c.json({ words });
});

// Create word
wordRoutes.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{
    source_word: string;
    target_word: string;
    source_lang: string;
    target_lang: string;
    example_sentence?: string;
    notes?: string;
  }>();

  if (!body.source_word || !body.target_word || !body.source_lang || !body.target_lang) {
    return c.json({ error: 'Kelime ve dil bilgileri gerekli' }, 400);
  }

  const id = crypto.randomUUID();

  await c.env.DB.prepare(`
    INSERT INTO words (id, user_id, source_word, target_word, source_lang, target_lang, example_sentence, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, userId,
    body.source_word.trim(),
    body.target_word.trim(),
    body.source_lang,
    body.target_lang,
    body.example_sentence?.trim() || null,
    body.notes?.trim() || null
  ).run();

  return c.json({
    word: {
      id,
      user_id: userId,
      source_word: body.source_word.trim(),
      target_word: body.target_word.trim(),
      source_lang: body.source_lang,
      target_lang: body.target_lang,
      example_sentence: body.example_sentence?.trim() || null,
      notes: body.notes?.trim() || null,
      created_at: new Date().toISOString(),
      progress: null,
    },
  }, 201);
});

// Update word
wordRoutes.put('/:id', async (c) => {
  const userId = c.get('userId');
  const wordId = c.req.param('id');
  const body = await c.req.json<{
    source_word?: string;
    target_word?: string;
    example_sentence?: string;
    notes?: string;
  }>();

  const existing = await c.env.DB.prepare(
    'SELECT id FROM words WHERE id = ? AND user_id = ?'
  ).bind(wordId, userId).first();

  if (!existing) {
    return c.json({ error: 'Kelime bulunamadı' }, 404);
  }

  const updates: string[] = [];
  const values: (string | null)[] = [];

  if (body.source_word !== undefined) {
    updates.push('source_word = ?');
    values.push(body.source_word.trim());
  }
  if (body.target_word !== undefined) {
    updates.push('target_word = ?');
    values.push(body.target_word.trim());
  }
  if (body.example_sentence !== undefined) {
    updates.push('example_sentence = ?');
    values.push(body.example_sentence.trim() || null);
  }
  if (body.notes !== undefined) {
    updates.push('notes = ?');
    values.push(body.notes.trim() || null);
  }

  if (updates.length > 0) {
    await c.env.DB.prepare(
      `UPDATE words SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`
    ).bind(...values, wordId, userId).run();
  }

  const word = await c.env.DB.prepare(`
    SELECT w.*,
      wp.ease_factor, wp.interval, wp.repetitions, wp.next_review,
      wp.total_correct, wp.total_attempts, wp.last_reviewed
    FROM words w
    LEFT JOIN word_progress wp ON w.id = wp.word_id
    WHERE w.id = ?
  `).bind(wordId).first<any>();

  return c.json({
    word: {
      id: word.id,
      user_id: word.user_id,
      source_word: word.source_word,
      target_word: word.target_word,
      source_lang: word.source_lang,
      target_lang: word.target_lang,
      example_sentence: word.example_sentence,
      notes: word.notes,
      created_at: word.created_at,
      progress: word.total_attempts !== null ? {
        ease_factor: word.ease_factor,
        interval: word.interval,
        repetitions: word.repetitions,
        next_review: word.next_review,
        total_correct: word.total_correct,
        total_attempts: word.total_attempts,
        last_reviewed: word.last_reviewed,
      } : null,
    },
  });
});

// Delete word
wordRoutes.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const wordId = c.req.param('id');

  const existing = await c.env.DB.prepare(
    'SELECT id FROM words WHERE id = ? AND user_id = ?'
  ).bind(wordId, userId).first();

  if (!existing) {
    return c.json({ error: 'Kelime bulunamadı' }, 404);
  }

  await c.env.DB.prepare('DELETE FROM word_progress WHERE word_id = ?').bind(wordId).run();
  await c.env.DB.prepare('DELETE FROM words WHERE id = ? AND user_id = ?').bind(wordId, userId).run();

  return c.json({ success: true });
});
