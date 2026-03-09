import React from 'react';
import type { Word } from '../../types';
import WordCard from './WordCard';

interface WordListProps {
  words: Word[];
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
}

const WordList: React.FC<WordListProps> = ({ words, onEdit, onDelete }) => {
  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-800 py-16 px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4 h-12 w-12 text-slate-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <p className="text-lg font-medium text-slate-400">Henüz kelime eklenmedi</p>
        <p className="mt-1 text-sm text-slate-500">
          Yeni kelime eklemek için yukarıdaki butonu kullanın.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {words.map((word) => (
        <WordCard key={word.id} word={word} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default WordList;
