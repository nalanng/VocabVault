import { useState, useMemo } from 'react';
import { useWords } from '../hooks/useWords';
import WordList from '../components/words/WordList';
import WordForm from '../components/words/WordForm';
import WordSearch from '../components/words/WordSearch';
import type { Word } from '../types';
import { getLanguageFlag, getLanguageName } from '../utils/languages';

export default function WordsPage() {
  const [search, setSearch] = useState('');
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [sort, setSort] = useState('date');
  const [showForm, setShowForm] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      source_lang: sourceLang || undefined,
      target_lang: targetLang || undefined,
      sort,
    }),
    [search, sourceLang, targetLang, sort]
  );

  const { words, loading, addWord, updateWord, deleteWord } = useWords(filters);

  const handleSave = async (data: any) => {
    if (editingWord) {
      await updateWord(editingWord.id, data);
    } else {
      await addWord(data);
    }
    setShowForm(false);
    setEditingWord(null);
  };

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu kelimeyi silmek istediğinize emin misiniz?')) {
      await deleteWord(id);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1 className="text-lg font-bold text-ink">Kelime Kütüphanesi</h1>

      <WordSearch
        sourceLang={sourceLang}
        targetLang={targetLang}
        sort={sort}
        onSearch={setSearch}
        onSourceLangChange={setSourceLang}
        onTargetLangChange={setTargetLang}
        onSortChange={setSort}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <WordList words={words} onClick={setSelectedWord} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {showForm && (
        <WordForm
          word={editingWord ?? undefined}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingWord(null);
          }}
        />
      )}

      {/* Word Detail Popup */}
      {selectedWord && (() => {
        const w = selectedWord;
        const accuracy =
          w.progress && w.progress.total_attempts > 0
            ? Math.round((w.progress.total_correct / w.progress.total_attempts) * 100)
            : null;
        const getAccColor = (acc: number) => {
          if (acc >= 70) return 'text-success';
          if (acc >= 40) return 'text-orange-400';
          return 'text-danger';
        };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSelectedWord(null)}
            />
            <div className="relative mx-4 w-full max-w-sm rounded-md bg-white p-6 animate-slide-up">
              {/* Close */}
              <button
                onClick={() => setSelectedWord(null)}
                className="absolute top-3 right-3 rounded p-1 text-gray-4 hover:text-ink transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Source Word */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getLanguageFlag(w.source_lang)}</span>
                <span className="text-xs text-neutral-400">{getLanguageName(w.source_lang)}</span>
              </div>
              <p className="text-2xl font-bold text-ink mb-4">{w.source_word}</p>

              {/* Divider with arrow */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-gray-2" />
                <svg className="w-4 h-4 text-gray-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div className="flex-1 h-px bg-gray-2" />
              </div>

              {/* Target Word */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getLanguageFlag(w.target_lang)}</span>
                <span className="text-xs text-neutral-400">{getLanguageName(w.target_lang)}</span>
              </div>
              <p className="text-2xl font-bold text-primary mb-4">{w.target_word}</p>

              {/* Example Sentence */}
              {w.example_sentence && (
                <div className="mb-4 rounded border border-gray-2 bg-gray-1 px-4 py-3">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Örnek Cümle</p>
                  <p className="text-sm italic text-ink">&ldquo;{w.example_sentence}&rdquo;</p>
                </div>
              )}

              {/* Notes */}
              {w.notes && (
                <div className="mb-4 rounded border border-gray-2 bg-gray-1 px-4 py-3">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Not</p>
                  <p className="text-sm text-ink">{w.notes}</p>
                </div>
              )}

              {/* Stats */}
              {w.progress && w.progress.total_attempts > 0 && (
                <div className="mb-5 flex gap-3">
                  <div className="flex-1 rounded border border-gray-2 bg-gray-1 px-3 py-2 text-center">
                    <p className="text-xs text-neutral-500">Doğruluk</p>
                    <p className={`text-lg font-bold ${accuracy !== null ? getAccColor(accuracy) : 'text-ink'}`}>
                      %{accuracy}
                    </p>
                  </div>
                  <div className="flex-1 rounded border border-gray-2 bg-gray-1 px-3 py-2 text-center">
                    <p className="text-xs text-neutral-500">Tekrar</p>
                    <p className="text-lg font-bold text-ink">{w.progress.total_attempts}</p>
                  </div>
                  <div className="flex-1 rounded border border-gray-2 bg-gray-1 px-3 py-2 text-center">
                    <p className="text-xs text-neutral-500">Doğru</p>
                    <p className="text-lg font-bold text-success">{w.progress.total_correct}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedWord(null);
                    handleEdit(w);
                  }}
                  className="flex-1 rounded border border-primary bg-white py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => {
                    setSelectedWord(null);
                    handleDelete(w.id);
                  }}
                  className="flex-1 rounded border border-danger/30 bg-white py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* FAB Button */}
      <button
        onClick={() => {
          setEditingWord(null);
          setShowForm(true);
        }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary hover:bg-primary-dark rounded-full shadow-lg flex items-center justify-center text-white transition-colors z-40"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
        </svg>
      </button>
    </div>
  );
}
