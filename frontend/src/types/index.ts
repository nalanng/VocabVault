export interface User {
  id: string;
  email: string;
  source_lang: string;
  target_lang: string;
  created_at: string;
}

export interface Word {
  id: string;
  user_id: string;
  source_word: string;
  target_word: string;
  source_lang: string;
  target_lang: string;
  example_sentence?: string;
  notes?: string;
  created_at: string;
  progress?: WordProgress;
}

export interface WordProgress {
  id: string;
  word_id: string;
  user_id: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string | null;
  total_correct: number;
  total_attempts: number;
  last_reviewed: string | null;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  mode: 'flashcard' | 'quiz';
  total_words: number;
  correct_count: number;
  accuracy: number;
  duration_seconds: number | null;
  completed_at: string;
}

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
}

export interface PracticeConfig {
  mode: 'flashcard' | 'quiz';
  filter: 'all' | 'due' | 'weak' | 'new';
  count: number;
  direction: 'source-to-target' | 'target-to-source';
}

export interface StatsOverview {
  total_words: number;
  words_reviewed: number;
  average_accuracy: number;
  due_today: number;
  weak_words: number;
  total_sessions: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}

export type Language = {
  code: string;
  name: string;
  flag: string;
};
