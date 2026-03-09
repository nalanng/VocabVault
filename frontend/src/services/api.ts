import { API_BASE, TOKEN_KEY } from '../utils/constants';
import type {
  AuthResponse,
  Word,
  WordProgress,
  PracticeSession,
  StatsOverview,
} from '../types';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const auth = {
  register: (email: string, password: string, first_name: string, last_name: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name, last_name }),
    }),
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<{ user: AuthResponse['user'] }>('/auth/me'),
};

// Words
export const words = {
  list: (params?: { search?: string; source_lang?: string; target_lang?: string; sort?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set('search', params.search);
    if (params?.source_lang) q.set('source_lang', params.source_lang);
    if (params?.target_lang) q.set('target_lang', params.target_lang);
    if (params?.sort) q.set('sort', params.sort);
    const qs = q.toString();
    return request<{ words: Word[] }>(`/words${qs ? `?${qs}` : ''}`);
  },
  create: (data: {
    source_word: string;
    target_word: string;
    source_lang: string;
    target_lang: string;
    example_sentence?: string;
    notes?: string;
  }) =>
    request<{ word: Word }>('/words', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<{
    source_word: string;
    target_word: string;
    example_sentence: string;
    notes: string;
  }>) =>
    request<{ word: Word }>(`/words/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/words/${id}`, { method: 'DELETE' }),
  due: () => request<{ words: Word[] }>('/words/due'),
  weak: () => request<{ words: Word[] }>('/words/weak'),
};

// Practice
export const practice = {
  submitResult: (data: {
    word_id: string;
    quality: number;
  }) =>
    request<{ progress: WordProgress }>('/practice/result', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  saveSession: (data: {
    mode: 'flashcard' | 'quiz';
    total_words: number;
    correct_count: number;
    accuracy: number;
    duration_seconds: number;
  }) =>
    request<{ session: PracticeSession }>('/practice/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sessions: () => request<{ sessions: PracticeSession[] }>('/practice/sessions'),
};

// Stats
export const stats = {
  overview: () => request<StatsOverview>('/stats/overview'),
  words: () => request<{ words: (Word & { progress: WordProgress })[] }>('/stats/words'),
};
