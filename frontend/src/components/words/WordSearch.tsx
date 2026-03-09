import React from 'react';
import { languages } from '../../utils/languages';

interface WordSearchProps {
  onSearch: (q: string) => void;
  onSourceLangChange: (lang: string) => void;
  onTargetLangChange: (lang: string) => void;
  onSortChange: (sort: string) => void;
}

const WordSearch: React.FC<WordSearchProps> = ({
  onSearch,
  onSourceLangChange,
  onTargetLangChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Kelime ara..."
          className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pl-10 pr-3 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-3">
        <select
          onChange={(e) => onSourceLangChange(e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Kaynak: Tümü</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => onTargetLangChange(e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          defaultValue=""
        >
          <option value="">Hedef: Tümü</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          defaultValue="date"
        >
          <option value="alphabetical">Alfabetik</option>
          <option value="accuracy">Doğruluk</option>
          <option value="date">Tarih</option>
        </select>
      </div>
    </div>
  );
};

export default WordSearch;
