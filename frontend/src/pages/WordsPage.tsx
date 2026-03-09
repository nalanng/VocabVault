import { useState, useMemo } from 'react';
import { useWords } from '../hooks/useWords';
import WordList from '../components/words/WordList';
import WordForm from '../components/words/WordForm';
import WordSearch from '../components/words/WordSearch';
import type { Word } from '../types';

export default function WordsPage() {
  const [search, setSearch] = useState('');
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [sort, setSort] = useState('date');
  const [showForm, setShowForm] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

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
    if (confirm('Bu kelimeyi silmek istediginize emin misiniz?')) {
      await deleteWord(id);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-white">Kelime Kutuphanesi</h1>

      <WordSearch
        onSearch={setSearch}
        onSourceLangChange={setSourceLang}
        onTargetLangChange={setTargetLang}
        onSortChange={setSort}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <WordList words={words} onEdit={handleEdit} onDelete={handleDelete} />
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

      {/* FAB Button */}
      <button
        onClick={() => {
          setEditingWord(null);
          setShowForm(true);
        }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg flex items-center justify-center text-white text-2xl font-light transition-colors z-40"
      >
        +
      </button>
    </div>
  );
}
