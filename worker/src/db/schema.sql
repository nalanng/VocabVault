CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  source_lang TEXT DEFAULT 'tr',
  target_lang TEXT DEFAULT 'en',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS words (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  source_word TEXT NOT NULL,
  target_word TEXT NOT NULL,
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  example_sentence TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS word_progress (
  id TEXT PRIMARY KEY,
  word_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  ease_factor REAL DEFAULT 2.5,
  interval INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review TEXT,
  total_correct INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  last_reviewed TEXT,
  FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS practice_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  total_words INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  accuracy REAL NOT NULL,
  duration_seconds INTEGER,
  completed_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_words_user ON words(user_id);
CREATE INDEX IF NOT EXISTS idx_word_progress_user ON word_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_word_progress_next_review ON word_progress(next_review);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user ON practice_sessions(user_id);
