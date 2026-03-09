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
            className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 p-8"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="mb-3 text-2xl">{getLanguageFlag(questionLang)}</span>
            <p className="text-center text-3xl font-bold text-white">{questionWord}</p>
            <p className="mt-4 text-sm text-slate-400">Cevabı görmek için dokun</p>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 p-8"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="mb-3 text-2xl">{getLanguageFlag(answerLang)}</span>
            <p className="text-center text-3xl font-bold text-white">{answerWord}</p>
            {word.example_sentence && (
              <p className="mt-4 text-center text-sm italic text-slate-400">
                &ldquo;{word.example_sentence}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Response Buttons */}
      <div
        className={`grid w-full grid-cols-4 gap-2 transition-all duration-300 ${
          flipped ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => handleResponse('again')}
          className="rounded-xl bg-red-500/15 px-2 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/25"
        >
          Bilmedim
        </button>
        <button
          type="button"
          onClick={() => handleResponse('hard')}
          className="rounded-xl bg-orange-500/15 px-2 py-3 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-500/25"
        >
          Zor
        </button>
        <button
          type="button"
          onClick={() => handleResponse('good')}
          className="rounded-xl bg-green-500/15 px-2 py-3 text-sm font-semibold text-green-500 transition-colors hover:bg-green-500/25"
        >
          Bildim
        </button>
        <button
          type="button"
          onClick={() => handleResponse('easy')}
          className="rounded-xl bg-blue-500/15 px-2 py-3 text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-500/25"
        >
          Kolay
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
