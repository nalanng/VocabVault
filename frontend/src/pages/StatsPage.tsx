import { useStatsOverview, useWordStats } from '../hooks/useStats';
import StatsOverview from '../components/stats/StatsOverview';
import WordStats from '../components/stats/WordStats';
import AccuracyChart from '../components/stats/AccuracyChart';

export default function StatsPage() {
  const { stats, loading: statsLoading } = useStatsOverview();
  const { words, loading: wordsLoading } = useWordStats();

  if (statsLoading || wordsLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold text-white">Istatistikler</h1>

      {stats && <StatsOverview stats={stats} />}

      <AccuracyChart words={words} />

      <WordStats words={words} />
    </div>
  );
}
