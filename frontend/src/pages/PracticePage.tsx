import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PracticeSetup from '../components/practice/PracticeSetup';
import Flashcard from '../components/practice/Flashcard';
import Quiz from '../components/practice/Quiz';
import PracticeResult from '../components/practice/PracticeResult';
import ProgressBar from '../components/practice/ProgressBar';
import { usePractice } from '../hooks/usePractice';
import type { PracticeConfig } from '../types';

type Phase = 'setup' | 'practicing' | 'result';

export default function PracticePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('setup');
  const [config, setConfig] = useState<PracticeConfig>({
    mode: 'flashcard',
    filter: 'all',
    count: 10,
    direction: 'source-to-target',
  });
  const [accuracy, setAccuracy] = useState(0);

  const {
    words: practiceWords,
    currentWord,
    currentIndex,
    totalWords,
    results,
    finished,
    loading,
    loadWords,
    submitFlashcard,
    submitQuiz,
    saveSession,
  } = usePractice(config);

  const handleStart = useCallback(
    async (cfg: PracticeConfig) => {
      setConfig(cfg);
      setPhase('practicing');
    },
    []
  );

  useEffect(() => {
    if (phase === 'practicing') {
      loadWords();
    }
  }, [phase, loadWords]);

  useEffect(() => {
    if (finished && phase === 'practicing' && results.length > 0) {
      saveSession().then((res) => {
        setAccuracy(res.accuracy);
        setPhase('result');
      });
    }
  }, [finished, phase, results.length, saveSession]);

  if (phase === 'setup') {
    return (
      <div className="pt-4">
        <PracticeSetup onStart={handleStart} />
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="pt-4">
        <PracticeResult
          results={results}
          accuracy={accuracy}
          onRestart={() => setPhase('setup')}
          onHome={() => navigate('/')}
        />
      </div>
    );
  }

  // practicing phase
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (totalWords === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-4 text-center">
          Bu filtreye uygun kelime bulunamadı.
        </p>
        <button
          onClick={() => setPhase('setup')}
          className="px-6 py-2 rounded bg-primary text-white"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <ProgressBar current={currentIndex + 1} total={totalWords} />

      {config.mode === 'flashcard' && currentWord && (
        <Flashcard
          word={currentWord}
          direction={config.direction}
          onResponse={submitFlashcard}
        />
      )}

      {config.mode === 'quiz' && currentWord && (
        <Quiz
          word={currentWord}
          allWords={practiceWords}
          direction={config.direction}
          onAnswer={submitQuiz}
        />
      )}
    </div>
  );
}
