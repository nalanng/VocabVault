import React, { useState } from 'react';
import type { PracticeConfig } from '../../types';

interface PracticeSetupProps {
  onStart: (config: PracticeConfig) => void;
}

const filters: { value: PracticeConfig['filter']; label: string; desc: string }[] = [
  { value: 'all', label: 'Tüm Kelimeler', desc: 'Kütüphanedeki tüm kelimeler' },
  { value: 'due', label: 'Bugün Tekrarı Gelenler', desc: 'Tekrar zamanı gelen kelimeler' },
  { value: 'weak', label: 'Zayıf Kelimeler (<%60)', desc: 'Doğruluk oranı düşük kelimeler' },
  { value: 'new', label: 'Yeni Kelimeler', desc: 'Henüz hiç pratik yapılmamış kelimeler' },
];

const countOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 0, label: 'Tümü' },
];

const PracticeSetup: React.FC<PracticeSetupProps> = ({ onStart }) => {
  const [mode, setMode] = useState<PracticeConfig['mode']>('flashcard');
  const [filter, setFilter] = useState<PracticeConfig['filter']>('all');
  const [count, setCount] = useState<number>(20);
  const [customCount, setCustomCount] = useState('');
  const [useCustomCount, setUseCustomCount] = useState(false);
  const [direction, setDirection] = useState<PracticeConfig['direction']>('source-to-target');
  const [modalOpen, setModalOpen] = useState(false);

  // Temp state for modal (apply on confirm)
  const [tempFilter, setTempFilter] = useState<PracticeConfig['filter']>('all');
  const [tempCount, setTempCount] = useState<number>(20);
  const [tempCustomCount, setTempCustomCount] = useState('');
  const [tempUseCustom, setTempUseCustom] = useState(false);

  const handleStart = () => {
    const finalCount = useCustomCount ? (parseInt(customCount) || 20) : count;
    onStart({ mode, filter, count: finalCount, direction });
  };

  const openModal = () => {
    setTempFilter(filter);
    setTempCount(count);
    setTempCustomCount(customCount);
    setTempUseCustom(useCustomCount);
    setModalOpen(true);
  };

  const applyModal = () => {
    setFilter(tempFilter);
    setCount(tempCount);
    setCustomCount(tempCustomCount);
    setUseCustomCount(tempUseCustom);
    setModalOpen(false);
  };

  const selectedFilterLabel = filters.find((f) => f.value === filter)?.label ?? '';
  const countLabel = useCustomCount
    ? `${customCount || '?'} Kelime`
    : count === 0
      ? 'Tümü'
      : `${count} Kelime`;

  return (
    <>
      <div className="space-y-5">
        <h2 className="text-lg font-bold text-ink">Pratik Ayarları</h2>

        {/* Mode Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Mod</label>
          <div className="relative bg-white rounded-md border border-gray-2 p-1">
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded bg-primary transition-transform duration-300 ease-in-out"
              style={{
                transform: mode === 'flashcard' ? 'translateX(0)' : 'translateX(calc(100% + 8px))',
              }}
            />
            <div className="relative flex">
              <button
                type="button"
                onClick={() => setMode('flashcard')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded transition-colors duration-300 ${
                  mode === 'flashcard' ? 'text-white' : 'text-neutral-500'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Flashcard
              </button>
              <button
                type="button"
                onClick={() => setMode('quiz')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded transition-colors duration-300 ${
                  mode === 'quiz' ? 'text-white' : 'text-neutral-500'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Count - Trigger button */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Filtre & Kelime Sayısı</label>
          <button
            type="button"
            onClick={openModal}
            className="w-full flex items-center justify-between rounded border border-gray-2 bg-white px-4 py-2.5 text-sm text-ink"
          >
            <div className="flex items-center gap-2">
              <span>{selectedFilterLabel}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500">{countLabel}</span>
            </div>
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Direction Toggle */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">Yön</label>
          <div className="relative bg-white rounded-md border border-gray-2 p-1">
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded bg-primary transition-transform duration-300 ease-in-out"
              style={{
                transform: direction === 'source-to-target' ? 'translateX(0)' : 'translateX(calc(100% + 8px))',
              }}
            />
            <div className="relative flex">
              <button
                type="button"
                onClick={() => setDirection('source-to-target')}
                className={`flex-1 py-2.5 text-sm font-medium rounded transition-colors duration-300 ${
                  direction === 'source-to-target' ? 'text-white' : 'text-neutral-500'
                }`}
              >
                Kaynak &rarr; Hedef
              </button>
              <button
                type="button"
                onClick={() => setDirection('target-to-source')}
                className={`flex-1 py-2.5 text-sm font-medium rounded transition-colors duration-300 ${
                  direction === 'target-to-source' ? 'text-white' : 'text-neutral-500'
                }`}
              >
                Hedef &rarr; Kaynak
              </button>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full rounded bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-1"
        >
          Başla
        </button>
      </div>

      {/* Filter & Count Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div
            className="relative w-full max-w-lg bg-white rounded-t-md px-4 pb-24 pt-4 animate-slide-up max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-3" />

            {/* Filter Section */}
            <h3 className="text-sm font-bold text-primary-dark mb-3">Filtre</h3>
            <div className="space-y-2 mb-6">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setTempFilter(f.value)}
                  className={`w-full flex items-center gap-3 rounded px-4 py-3 text-left transition-all ${
                    tempFilter === f.value
                      ? 'bg-primary/10 ring-1 ring-primary'
                      : 'bg-gray-1 hover:bg-gray-2'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      tempFilter === f.value ? 'border-primary' : 'border-gray-3'
                    }`}
                  >
                    {tempFilter === f.value && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${tempFilter === f.value ? 'text-ink' : 'text-neutral-600'}`}>
                      {f.label}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">{f.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Count Section */}
            <h3 className="text-sm font-bold text-primary-dark mb-3">Kelime Sayısı</h3>
            <div className="flex gap-2 mb-3">
              {countOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => { setTempCount(c.value); setTempUseCustom(false); }}
                  className={`flex-1 rounded py-2 text-sm font-medium transition-all ${
                    !tempUseCustom && tempCount === c.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-1 text-neutral-500 hover:bg-gray-2'
                  }`}
                >
                  {c.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTempUseCustom(true)}
                className={`flex-1 rounded py-2 text-sm font-medium transition-all ${
                  tempUseCustom
                    ? 'bg-primary text-white'
                    : 'bg-gray-1 text-neutral-500 hover:bg-gray-2'
                }`}
              >
                Özel
              </button>
            </div>
            {tempUseCustom && (
              <input
                type="number"
                min="1"
                max="500"
                value={tempCustomCount}
                onChange={(e) => setTempCustomCount(e.target.value)}
                placeholder="Kelime sayısı girin"
                className="w-full rounded border border-gray-2 bg-gray-1 px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary mb-3"
                autoFocus
              />
            )}

            {/* Apply Button */}
            <button
              type="button"
              onClick={applyModal}
              className="w-full rounded bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark mt-2"
            >
              Uygula
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PracticeSetup;
