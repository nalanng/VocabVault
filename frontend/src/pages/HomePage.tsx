import { Link } from 'react-router-dom';
import { useStatsOverview } from '../hooks/useStats';
import { useDueWords, useWeakWords } from '../hooks/useWords';

const HomePage = () => {
  const { stats, loading: statsLoading } = useStatsOverview();
  const { words: dueWords, loading: dueLoading } = useDueWords();
  const { words: weakWords, loading: weakLoading } = useWeakWords();

  const isLoading = statsLoading || dueLoading || weakLoading;

  const dueCount = dueWords?.length ?? 0;
  const weakCount = weakWords?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-900 pb-24 px-4 pt-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Hoş Geldin!</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Bugün kelime pratiği yapmaya hazır mısın?
        </p>
      </div>

      {/* Due Words Highlight Card */}
      {!isLoading && dueCount > 0 && (
        <Link to="/practice" className="block mb-6">
          <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-indigo-300 font-semibold text-sm">
                  Bugün {dueCount} kelime tekrarın var!
                </p>
                <p className="text-indigo-400/70 text-xs mt-0.5">
                  Hemen pratik yapmaya başla
                </p>
              </div>
              <svg
                className="w-5 h-5 text-indigo-400 ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>
      )}

      {/* Quick Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-xl p-4 animate-pulse"
            >
              <div className="h-3 bg-slate-700 rounded w-20 mb-3" />
              <div className="h-7 bg-slate-700 rounded w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Toplam Kelime
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              {stats?.total_words ?? 0}
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Bugün Tekrar
            </p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">
              {dueCount}
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Zayıf Kelimeler
            </p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {weakCount}
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Ort. Doğruluk
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {stats?.average_accuracy != null
                ? `%${Math.round(stats.average_accuracy)}`
                : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          to="/practice"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl text-center transition-colors"
        >
          Pratik Yap
        </Link>
        <Link
          to="/words"
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl text-center transition-colors"
        >
          Kelime Ekle
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
