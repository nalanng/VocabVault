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
  const totalWords = stats?.total_words ?? 0;

  return (
    <div className="pb-6 pt-4">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-ink">Hoş Geldin!</h1>
        <p className="text-neutral-500 mt-1 text-sm">
          Bugün kelime pratiği yapmaya hazır mısın?
        </p>
      </div>

      {/* Due Words Card - Always show */}
      {!isLoading && (
        <Link to="/practice" className="block mb-6">
          <div className={`rounded border p-4 ${
            dueCount > 0
              ? 'bg-white border-primary/30'
              : totalWords > 0
                ? 'bg-white border-success/30'
                : 'bg-white border-primary/20'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                dueCount > 0 ? 'bg-primary/10' : totalWords > 0 ? 'bg-success/10' : 'bg-primary/5'
              }`}>
                {dueCount > 0 ? (
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : totalWords > 0 ? (
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                {dueCount > 0 ? (
                  <>
                    <p className="text-primary font-semibold text-sm">
                      Bugün {dueCount} kelime tekrarın var!
                    </p>
                    <p className="text-neutral-500 text-xs mt-0.5">
                      Hemen pratik yapmaya başla
                    </p>
                  </>
                ) : totalWords > 0 ? (
                  <>
                    <p className="text-success font-semibold text-sm">
                      Tüm tekrarlar tamamlandı!
                    </p>
                    <p className="text-neutral-500 text-xs mt-0.5">
                      Harika iş, yeni kelimelerle devam edebilirsin
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-ink font-semibold text-sm">
                      Henüz kelime eklenmedi
                    </p>
                    <p className="text-neutral-500 text-xs mt-0.5">
                      Kelime ekleyerek pratik yapmaya başla
                    </p>
                  </>
                )}
              </div>
              <svg
                className={`w-5 h-5 ${dueCount > 0 ? 'text-primary' : totalWords > 0 ? 'text-success' : 'text-neutral-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      )}

      {/* Quick Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-primary-soft/20 rounded border border-primary/20 p-4 animate-pulse"
            >
              <div className="h-3 bg-gray-1 rounded w-20 mb-3" />
              <div className="h-7 bg-gray-1 rounded w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-primary-soft/20 rounded border border-primary/20 p-4">
            <p className="text-primary-dark text-xs font-bold uppercase tracking-wider">
              Toplam Kelime
            </p>
            <p className="text-2xl font-bold text-primary-dark mt-1">
              {totalWords}
            </p>
          </div>

          <div className="bg-primary-soft/20 rounded border border-primary/20 p-4">
            <p className="text-primary-dark text-xs font-bold uppercase tracking-wider">
              Bugün Tekrar
            </p>
            <p className="text-2xl font-bold text-primary-dark mt-1">
              {dueCount}
            </p>
          </div>

          <div className="bg-primary-soft/20 rounded border border-primary/20 p-4">
            <p className="text-primary-dark text-xs font-bold uppercase tracking-wider">
              Zayıf Kelimeler
            </p>
            <p className="text-2xl font-bold text-primary-dark mt-1">
              {weakCount}
            </p>
          </div>

          <div className="bg-primary-soft/20 rounded border border-primary/20 p-4">
            <p className="text-primary-dark text-xs font-bold uppercase tracking-wider">
              Ort. Doğruluk
            </p>
            <p className="text-2xl font-bold text-primary-dark mt-1">
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
          className="flex-1 bg-white border border-primary text-primary hover:bg-primary/5 font-normal py-3 px-4 rounded text-center transition-colors"
        >
          Pratik Yap
        </Link>
        <Link
          to="/words"
          className="flex-1 bg-white border border-primary text-primary hover:bg-primary/5 font-normal py-3 px-4 rounded text-center transition-colors"
        >
          Kelime Ekle
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
