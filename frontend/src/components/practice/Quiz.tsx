import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Word } from '../../types';
import { getLanguageFlag } from '../../utils/languages';

interface QuizProps {
  word: Word;
  allWords: Word[];
  direction: 'source-to-target' | 'target-to-source';
  onAnswer: (selectedWordId: string) => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const Quiz: React.FC<QuizProps> = ({ word, allWords, direction, onAnswer }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questionWord =
    direction === 'source-to-target' ? word.source_word : word.target_word;
  const questionLang =
    direction === 'source-to-target' ? word.source_lang : word.target_lang;

  const options = useMemo(() => {
    const wrongWords = allWords
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return shuffleArray([word, ...wrongWords]);
  }, [word.id, allWords]);

  const getAnswerText = useCallback(
    (w: Word) => {
      return direction === 'source-to-target' ? w.target_word : w.source_word;
    },
    [direction]
  );

  useEffect(() => {
    setSelectedId(null);
    setShowFeedback(false);
  }, [word.id]);

  const handleSelect = (optionId: string) => {
    if (selectedId !== null) return;

    setSelectedId(optionId);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(optionId);
    }, 1500);
  };

  const getOptionClasses = (optionId: string): string => {
    const base =
      'w-full rounded border-2 px-4 py-4 text-left text-base font-medium transition-all';

    if (!showFeedback) {
      return `${base} border-gray-2 bg-white text-ink hover:border-gray-3 hover:bg-gray-1`;
    }

    if (optionId === word.id) {
      return `${base} border-success bg-success/15 text-success`;
    }

    if (optionId === selectedId && optionId !== word.id) {
      return `${base} border-danger bg-danger/15 text-danger-soft`;
    }

    return `${base} border-gray-2 bg-white text-gray-4`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Question */}
      <div className="flex w-full flex-col items-center rounded bg-gray-1 border border-gray-2 p-8">
        <span className="mb-3 text-2xl">{getLanguageFlag(questionLang)}</span>
        <p className="text-center text-3xl font-bold text-ink">{questionWord}</p>
      </div>

      {/* Answer Options */}
      <div className="w-full space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option.id)}
            disabled={selectedId !== null}
            className={getOptionClasses(option.id)}
          >
            <div className="flex items-center gap-3">
              {showFeedback && option.id === word.id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0 text-success"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {showFeedback && option.id === selectedId && option.id !== word.id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0 text-danger-soft"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{getAnswerText(option)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
