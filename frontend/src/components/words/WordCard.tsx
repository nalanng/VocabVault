import React from 'react';
import type { Word } from '../../types';
import { getLanguageFlag } from '../../utils/languages';

interface WordCardProps {
  word: Word;
  onClick: (word: Word) => void;
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, onClick, onEdit, onDelete }) => {
  const accuracy =
    word.progress && word.progress.total_attempts > 0
      ? Math.round((word.progress.total_correct / word.progress.total_attempts) * 100)
      : null;

  const getAccuracyColor = (acc: number): string => {
    if (acc >= 70) return 'bg-success/20 text-success border-success/30';
    if (acc >= 40) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-danger/20 text-danger-soft border-danger/30';
  };

  const sourceFlag = getLanguageFlag(word.source_lang);
  const targetFlag = getLanguageFlag(word.target_lang);

  return (
    <div
      className="flex items-start justify-between rounded border border-primary/20 bg-white px-4 py-3 transition-colors hover:border-primary/40 cursor-pointer"
      onClick={() => onClick(word)}
    >
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        {/* Source Word */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base shrink-0" title={word.source_lang}>{sourceFlag}</span>
          <span className="font-medium text-ink break-words">{word.source_word}</span>
        </div>

        {/* Target Word */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base shrink-0" title={word.target_lang}>{targetFlag}</span>
          <span className="font-medium text-primary-soft break-words">{word.target_word}</span>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-1">
        {accuracy !== null && (
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${getAccuracyColor(accuracy)}`}
          >
            %{accuracy}
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onEdit(word); }}
          className="rounded p-2 text-gray-4 hover:bg-gray-2 hover:text-primary-soft transition-colors"
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
          onClick={(e) => { e.stopPropagation(); onDelete(word.id); }}
          className="rounded p-2 text-gray-4 hover:bg-gray-2 hover:text-danger-soft transition-colors"
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
