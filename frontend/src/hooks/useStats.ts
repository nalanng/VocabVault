import { useState, useEffect } from 'react';
import type { StatsOverview, Word, WordProgress, PracticeSession } from '../types';
import { stats as statsApi, practice as practiceApi } from '../services/api';

export function useStatsOverview() {
  const [data, setData] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi
      .overview()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats: data, loading };
}

export function useWordStats() {
  const [words, setWords] = useState<(Word & { progress: WordProgress })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi
      .words()
      .then((r) => setWords(r.words))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { words, loading };
}

export function useSessions() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    practiceApi
      .sessions()
      .then((r) => setSessions(r.sessions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { sessions, loading };
}
