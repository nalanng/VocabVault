import { useState, useEffect, useCallback } from 'react';
import { words as wordsApi } from '../services/api';
import { getLanguageFlag } from '../utils/languages';
import type { Word } from '../types';

const wordTypeLabels: Record<string, string> = {
  noun: 'İsim',
  verb: 'Fiil',
  adjective: 'Sıfat',
  adverb: 'Zarf',
};

type DateFilter = 'today' | 'last5days' | 'all';

const filterOptions: { value: DateFilter; label: string }[] = [
  { value: 'today', label: 'Bugün' },
  { value: 'last5days', label: 'Son 5 Gün' },
  { value: 'all', label: 'Tümü' },
];

export default function ReadingPage() {
  const [filter, setFilter] = useState<DateFilter>('today');
  const [wordList, setWordList] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = useCallback(async () => {
    setLoading(true);
    const params = filter !== 'all' ? { date_filter: filter } : undefined;
    const res = await wordsApi.list(params);
    setWordList(res.words);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1 className="text-lg font-bold text-ink">Kelime Okuma</h1>

      {/* Filter Tabs */}
      <div className="relative bg-white rounded-md border border-gray-2 p-1">
        <div className="relative flex">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`flex-1 py-2.5 text-sm font-medium rounded transition-colors duration-200 ${
                filter === opt.value
                  ? 'bg-primary text-white'
                  : 'text-neutral-500 hover:text-ink'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : wordList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <svg className="w-12 h-12 text-gray-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="text-gray-4 text-sm text-center">
            {filter === 'today'
              ? 'Bugün eklenen kelime yok.'
              : filter === 'last5days'
                ? 'Son 5 günde eklenen kelime yok.'
                : 'Henüz kelime eklenmemiş.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-24">
          <p className="text-xs text-neutral-400">{wordList.length} kelime</p>
          {wordList.map((word) => (
            <div
              key={word.id}
              className="rounded border border-primary/20 bg-white px-4 py-4 space-y-2"
            >
              {/* Source */}
              <div className="flex items-center gap-2">
                <span className="text-lg shrink-0">{getLanguageFlag(word.source_lang)}</span>
                <span className="text-base font-semibold text-ink">{word.source_word}</span>
                {word.word_type && (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {wordTypeLabels[word.word_type] ?? word.word_type}
                  </span>
                )}
              </div>

              {/* Target */}
              <div className="flex items-center gap-2">
                <span className="text-lg shrink-0">{getLanguageFlag(word.target_lang)}</span>
                <span className="text-base font-semibold text-primary-soft">{word.target_word}</span>
              </div>

              {/* Example Sentence */}
              {word.example_sentence && (
                <p className="text-sm italic text-neutral-400 pl-8">
                  &ldquo;{word.example_sentence}&rdquo;
                </p>
              )}

              {/* Notes */}
              {word.notes && (
                <p className="text-xs text-neutral-400 pl-8">{word.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
