import React from 'react';
import type { Word } from '../../types';
import { getLanguageFlag } from '../../utils/languages';

interface WordCardProps {
  word: Word;
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, onEdit, onDelete }) => {
  const accuracy =
    word.progress && word.progress.total_attempts > 0
      ? Math.round((word.progress.total_correct / word.progress.total_attempts) * 100)
      : null;

  const getAccuracyColor = (acc: number): string => {
    if (acc >= 70) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (acc >= 40) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const sourceFlag = getLanguageFlag(word.source_lang);
  const targetFlag = getLanguageFlag(word.target_lang);

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 transition-colors hover:border-slate-600">
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0" title={word.source_lang}>
            {sourceFlag}
          </span>
          <span className="truncate font-medium text-white">{word.source_word}</span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 shrink-0 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0" title={word.target_lang}>
            {targetFlag}
          </span>
          <span className="truncate font-medium text-indigo-300">{word.target_word}</span>
        </div>

        {accuracy !== null && (
          <span
            className={`ml-2 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getAccuracyColor(accuracy)}`}
          >
            %{accuracy}
          </span>
        )}
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-1">
        <button
          onClick={() => onEdit(word)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-indigo-400 transition-colors"
          title="Düzenle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          onClick={() => onDelete(word.id)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors"
          title="Sil"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WordCard;
