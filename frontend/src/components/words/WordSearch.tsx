import React, { useState } from 'react';
import { languages } from '../../utils/languages';

interface WordSearchProps {
  sourceLang: string;
  targetLang: string;
  sort: string;
  onSearch: (q: string) => void;
  onSourceLangChange: (lang: string) => void;
  onTargetLangChange: (lang: string) => void;
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: 'date', label: 'Eklenme Tarihi' },
  { value: 'alphabetical', label: 'Alfabetik' },
  { value: 'accuracy', label: 'Doğruluk Oranı' },
];

const WordSearch: React.FC<WordSearchProps> = ({
  sourceLang,
  targetLang,
  sort,
  onSearch,
  onSourceLangChange,
  onTargetLangChange,
  onSortChange,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tempSourceLang, setTempSourceLang] = useState(sourceLang);
  const [tempTargetLang, setTempTargetLang] = useState(targetLang);
  const [tempSort, setTempSort] = useState(sort);

  const openModal = () => {
    setTempSourceLang(sourceLang);
    setTempTargetLang(targetLang);
    setTempSort(sort);
    setModalOpen(true);
  };

  const applyFilters = () => {
    onSourceLangChange(tempSourceLang);
    onTargetLangChange(tempTargetLang);
    onSortChange(tempSort);
    setModalOpen(false);
  };

  const activeFilterCount =
    (sourceLang ? 1 : 0) + (targetLang ? 1 : 0) + (sort !== 'date' ? 1 : 0);

  return (
    <>
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-4"
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
            className="w-full rounded border border-gray-3 bg-white py-2 pl-10 pr-3 text-sm text-ink placeholder-gray-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={openModal}
          className="relative flex items-center gap-1.5 rounded border border-gray-3 bg-white px-3 py-2 text-sm text-ink transition-colors hover:border-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Filtre</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-md bg-white pb-24 animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-10 rounded-full bg-gray-3" />
            </div>

            <div className="px-4">
              <h3 className="text-base font-bold text-ink mb-4">Filtreler</h3>

              {/* Source Language */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Kaynak Dil
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTempSourceLang('')}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      tempSourceLang === ''
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-3 bg-white text-ink hover:border-primary'
                    }`}
                  >
                    Tümü
                  </button>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setTempSourceLang(lang.code)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        tempSourceLang === lang.code
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-3 bg-white text-ink hover:border-primary'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Language */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Hedef Dil
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTempTargetLang('')}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      tempTargetLang === ''
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-3 bg-white text-ink hover:border-primary'
                    }`}
                  >
                    Tümü
                  </button>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setTempTargetLang(lang.code)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        tempTargetLang === lang.code
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-3 bg-white text-ink hover:border-primary'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Sıralama
                </p>
                <div className="flex flex-col gap-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTempSort(opt.value)}
                      className={`flex items-center gap-3 rounded border px-4 py-3 text-sm transition-colors ${
                        tempSort === opt.value
                          ? 'border-primary bg-primary/5 text-primary font-medium'
                          : 'border-gray-3 bg-white text-ink hover:border-primary'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                          tempSort === opt.value
                            ? 'border-primary'
                            : 'border-gray-3'
                        }`}
                      >
                        {tempSort === opt.value && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={applyFilters}
                className="w-full rounded bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WordSearch;
