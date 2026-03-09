import React, { useState } from 'react';
import type { Word } from '../../types';
import { getLanguageFlag } from '../../utils/languages';

interface FlashcardProps {
  word: Word;
  direction: 'source-to-target' | 'target-to-source';
  onResponse: (response: 'again' | 'hard' | 'good' | 'easy') => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, direction, onResponse }) => {
  const [flipped, setFlipped] = useState(false);

  const questionWord =
    direction === 'source-to-target' ? word.source_word : word.target_word;
  const questionLang =
    direction === 'source-to-target' ? word.source_lang : word.target_lang;
  const answerWord =
    direction === 'source-to-target' ? word.target_word : word.source_word;
  const answerLang =
    direction === 'source-to-target' ? word.target_lang : word.source_lang;

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
    }
  };

  const handleResponse = (response: 'again' | 'hard' | 'good' | 'easy') => {
    setFlipped(false);
    onResponse(response);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card Container with Perspective */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleFlip}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front Face */}
          <div
            className="flex min-h-[300px] w-full flex-col items-center justify-center rounded bg-white border border-gray-2 p-8"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="mb-3 text-2xl">{getLanguageFlag(questionLang)}</span>
            <p className="text-center text-3xl font-bold text-ink">{questionWord}</p>
            <p className="mt-4 text-sm text-neutral-400">Cevabı görmek için dokun</p>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 flex min-h-[300px] w-full flex-col items-center justify-center rounded bg-white border border-gray-2 p-8"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="mb-3 text-2xl">{getLanguageFlag(answerLang)}</span>
            <p className="text-center text-3xl font-bold text-ink">{answerWord}</p>
            {word.example_sentence && (
              <p className="mt-4 text-center text-sm italic text-neutral-400">
                &ldquo;{word.example_sentence}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Response Buttons - 3 clear options */}
      <div
        className={`grid w-full grid-cols-3 gap-3 transition-all duration-300 ${
          flipped ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => handleResponse('again')}
          className="flex flex-col items-center gap-1.5 rounded bg-danger/10 border border-danger/30 px-2 py-3 transition-colors hover:bg-danger/20"
        >
          <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-xs font-medium text-danger">Bilmiyorum</span>
        </button>
        <button
          type="button"
          onClick={() => handleResponse('good')}
          className="flex flex-col items-center gap-1.5 rounded bg-success/10 border border-success/30 px-2 py-3 transition-colors hover:bg-success/20"
        >
          <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-medium text-success">Biliyorum</span>
        </button>
        <button
          type="button"
          onClick={() => handleResponse('easy')}
          className="flex flex-col items-center gap-1.5 rounded bg-primary/10 border border-primary/30 px-2 py-3 transition-colors hover:bg-primary/20"
        >
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xs font-medium text-primary">Çok Kolay</span>
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
