import React, { useState, useEffect } from 'react';
import type { Word } from '../../types';
import { languages } from '../../utils/languages';

interface WordFormProps {
  word?: Word;
  onSave: (data: {
    source_lang: string;
    target_lang: string;
    source_word: string;
    target_word: string;
    example_sentence?: string;
    notes?: string;
  }) => void;
  onClose: () => void;
}

const WordForm: React.FC<WordFormProps> = ({ word, onSave, onClose }) => {
  const [sourceLang, setSourceLang] = useState(word?.source_lang ?? 'tr');
  const [targetLang, setTargetLang] = useState(word?.target_lang ?? 'en');
  const [sourceWord, setSourceWord] = useState(word?.source_word ?? '');
  const [targetWord, setTargetWord] = useState(word?.target_word ?? '');
  const [exampleSentence, setExampleSentence] = useState(word?.example_sentence ?? '');
  const [notes, setNotes] = useState(word?.notes ?? '');

  useEffect(() => {
    if (word) {
      setSourceLang(word.source_lang);
      setTargetLang(word.target_lang);
      setSourceWord(word.source_word);
      setTargetWord(word.target_word);
      setExampleSentence(word.example_sentence ?? '');
      setNotes(word.notes ?? '');
    }
  }, [word]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: {
      source_lang: string;
      target_lang: string;
      source_word: string;
      target_word: string;
      example_sentence?: string;
      notes?: string;
    } = {
      source_lang: sourceLang,
      target_lang: targetLang,
      source_word: sourceWord.trim(),
      target_word: targetWord.trim(),
    };

    if (exampleSentence.trim()) {
      data.example_sentence = exampleSentence.trim();
    }
    if (notes.trim()) {
      data.notes = notes.trim();
    }

    onSave(data);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-xl bg-slate-800 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {word ? 'Kelime Düzenle' : 'Yeni Kelime Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Kaynak Dil
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Hedef Dil
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Kaynak Kelime
              </label>
              <input
                type="text"
                value={sourceWord}
                onChange={(e) => setSourceWord(e.target.value)}
                placeholder="Kelime"
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Hedef Kelime
              </label>
              <input
                type="text"
                value={targetWord}
                onChange={(e) => setTargetWord(e.target.value)}
                placeholder="Çeviri"
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Örnek Cümle
            </label>
            <textarea
              value={exampleSentence}
              onChange={(e) => setExampleSentence(e.target.value)}
              placeholder="Örnek cümle"
              rows={2}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Notlar
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notlar"
              rows={2}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WordForm;
