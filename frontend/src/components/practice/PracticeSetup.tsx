import React, { useState } from 'react';
import type { PracticeConfig } from '../../types';

interface PracticeSetupProps {
  onStart: (config: PracticeConfig) => void;
}

const PracticeSetup: React.FC<PracticeSetupProps> = ({ onStart }) => {
  const [mode, setMode] = useState<PracticeConfig['mode']>('flashcard');
  const [filter, setFilter] = useState<PracticeConfig['filter']>('all');
  const [count, setCount] = useState<number>(20);
  const [direction, setDirection] = useState<PracticeConfig['direction']>('source-to-target');

  const handleStart = () => {
    onStart({ mode, filter, count, direction });
  };

  const filters: { value: PracticeConfig['filter']; label: string }[] = [
    { value: 'all', label: 'Tüm Kelimeler' },
    { value: 'due', label: 'Bugün Tekrarı Gelenler' },
    { value: 'weak', label: 'Zayıf Kelimeler (<%60)' },
    { value: 'new', label: 'Yeni Kelimeler' },
  ];

  const counts: { value: number; label: string }[] = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 0, label: 'Tümü' },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      <h2 className="text-center text-2xl font-bold text-white">Pratik Ayarları</h2>

      {/* Mode Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Mod</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('flashcard')}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 transition-all ${
              mode === 'flashcard'
                ? 'border-indigo-500 bg-indigo-500/10 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-sm font-semibold">Flashcard</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 transition-all ${
              mode === 'quiz'
                ? 'border-indigo-500 bg-indigo-500/10 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold">Quiz</span>
          </button>
        </div>
      </div>

      {/* Filter Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Filtre</label>
        <div className="space-y-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all ${
                filter === f.value
                  ? 'bg-indigo-500/10 text-white ring-1 ring-indigo-500'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  filter === f.value ? 'border-indigo-500' : 'border-slate-600'
                }`}
              >
                {filter === f.value && (
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                )}
              </div>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Word Count */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Kelime Sayısı</label>
        <div className="flex gap-2">
          {counts.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCount(c.value)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                count === c.value
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Direction Toggle */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Yön</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDirection('source-to-target')}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              direction === 'source-to-target'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Kaynak &rarr; Hedef
          </button>
          <button
            type="button"
            onClick={() => setDirection('target-to-source')}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              direction === 'target-to-source'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Hedef &rarr; Kaynak
          </button>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={handleStart}
        className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Başla
      </button>
    </div>
  );
};

export default PracticeSetup;
