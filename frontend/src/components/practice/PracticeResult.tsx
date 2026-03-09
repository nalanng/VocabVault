import type { Word } from '../../types';

interface Props {
  results: { word: Word; correct: boolean }[];
  accuracy: number;
  onRestart: () => void;
  onHome: () => void;
}

export default function PracticeResult({ results, accuracy, onRestart, onHome }: Props) {
  const correctCount = results.filter((r) => r.correct).length;
  const wrongResults = results.filter((r) => !r.correct);

  const accentColor =
    accuracy >= 70 ? 'text-green-400' : accuracy >= 40 ? 'text-orange-400' : 'text-red-400';

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      <h2 className="text-xl font-semibold text-white">Pratik Tamamland!</h2>

      <div className="flex flex-col items-center gap-2">
        <span className={`text-6xl font-bold ${accentColor}`}>%{accuracy}</span>
        <span className="text-slate-400">
          {correctCount} / {results.length} dogru
        </span>
      </div>

      {wrongResults.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="text-sm font-medium text-slate-400 mb-3">
            Yanlis Bilinenler
          </h3>
          <div className="flex flex-col gap-2">
            {wrongResults.map((r) => (
              <div
                key={r.word.id}
                className="flex justify-between items-center bg-slate-800 rounded-lg px-4 py-3 border border-red-500/30"
              >
                <span className="text-white">{r.word.source_word}</span>
                <span className="text-slate-400">{r.word.target_word}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 w-full max-w-md mt-4">
        <button
          onClick={onRestart}
          className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
        >
          Tekrar Et
        </button>
        <button
          onClick={onHome}
          className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
        >
          Ana Sayfa
        </button>
      </div>
    </div>
  );
}
