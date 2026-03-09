import { useState, useCallback, useRef } from 'react';
import type { Word, PracticeConfig } from '../types';
import { practice as practiceApi, words as wordsApi } from '../services/api';
import { flashcardQuality, quizQuality } from '../services/sm2';

interface PracticeState {
  words: Word[];
  currentIndex: number;
  results: { word: Word; correct: boolean }[];
  finished: boolean;
  loading: boolean;
}

export function usePractice(config: PracticeConfig) {
  const [state, setState] = useState<PracticeState>({
    words: [],
    currentIndex: 0,
    results: [],
    finished: false,
    loading: true,
  });
  const startTimeRef = useRef<number>(Date.now());

  const loadWords = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    startTimeRef.current = Date.now();

    let fetched: Word[];
    switch (config.filter) {
      case 'due':
        fetched = (await wordsApi.due()).words;
        break;
      case 'weak':
        fetched = (await wordsApi.weak()).words;
        break;
      case 'new':
        fetched = (await wordsApi.list()).words.filter(
          (w) => !w.progress || w.progress.total_attempts === 0
        );
        break;
      default:
        fetched = (await wordsApi.list()).words;
    }

    // Shuffle
    const shuffled = fetched.sort(() => Math.random() - 0.5);
    const selected = config.count > 0 ? shuffled.slice(0, config.count) : shuffled;

    setState({
      words: selected,
      currentIndex: 0,
      results: [],
      finished: selected.length === 0,
      loading: false,
    });
  }, [config.filter, config.count]);

  const currentWord = state.words[state.currentIndex] ?? null;

  const submitFlashcard = useCallback(
    async (response: 'again' | 'hard' | 'good' | 'easy') => {
      if (!currentWord) return;
      const quality = flashcardQuality(response);
      const correct = quality >= 3;

      await practiceApi.submitResult({ word_id: currentWord.id, quality });

      setState((s) => {
        const newResults = [...s.results, { word: currentWord, correct }];
        const nextIndex = s.currentIndex + 1;
        const finished = nextIndex >= s.words.length;
        return { ...s, results: newResults, currentIndex: nextIndex, finished };
      });
    },
    [currentWord]
  );

  const submitQuiz = useCallback(
    async (selectedWordId: string) => {
      if (!currentWord) return;
      const correct = selectedWordId === currentWord.id;
      const quality = quizQuality(correct);

      await practiceApi.submitResult({ word_id: currentWord.id, quality });

      setState((s) => {
        const newResults = [...s.results, { word: currentWord, correct }];
        const nextIndex = s.currentIndex + 1;
        const finished = nextIndex >= s.words.length;
        return { ...s, results: newResults, currentIndex: nextIndex, finished };
      });

      return correct;
    },
    [currentWord]
  );

  const saveSession = useCallback(async () => {
    const correctCount = state.results.filter((r) => r.correct).length;
    const totalWords = state.results.length;
    const accuracy = totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0;
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    await practiceApi.saveSession({
      mode: config.mode,
      total_words: totalWords,
      correct_count: correctCount,
      accuracy,
      duration_seconds: durationSeconds,
    });

    return { totalWords, correctCount, accuracy, durationSeconds };
  }, [state.results, config.mode]);

  return {
    ...state,
    currentWord,
    totalWords: state.words.length,
    loadWords,
    submitFlashcard,
    submitQuiz,
    saveSession,
  };
}
