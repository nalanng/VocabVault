import { useState, useEffect, useCallback } from 'react';
import type { Word } from '../types';
import { words as wordsApi } from '../services/api';

export function useWords(filters?: {
  search?: string;
  source_lang?: string;
  target_lang?: string;
  sort?: string;
}) {
  const [wordList, setWordList] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await wordsApi.list(filters);
      setWordList(res.words);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch words');
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.source_lang, filters?.target_lang, filters?.sort]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const addWord = useCallback(async (data: Parameters<typeof wordsApi.create>[0]) => {
    const res = await wordsApi.create(data);
    setWordList((prev) => [res.word, ...prev]);
    return res.word;
  }, []);

  const updateWord = useCallback(async (id: string, data: Parameters<typeof wordsApi.update>[1]) => {
    const res = await wordsApi.update(id, data);
    setWordList((prev) => prev.map((w) => (w.id === id ? res.word : w)));
    return res.word;
  }, []);

  const deleteWord = useCallback(async (id: string) => {
    await wordsApi.delete(id);
    setWordList((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return { words: wordList, loading, error, refetch: fetchWords, addWord, updateWord, deleteWord };
}

export function useDueWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wordsApi.due().then((r) => setWords(r.words)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { words, loading };
}

export function useWeakWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wordsApi.weak().then((r) => setWords(r.words)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { words, loading };
}
