import type { Word, WordProgress } from '../../types';

interface Props {
  words: (Word & { progress: WordProgress })[];
}

export default function AccuracyChart({ words }: Props) {
  const total = words.length;
  if (total === 0) return null;

  let red = 0;
  let orange = 0;
  let green = 0;
  let gray = 0;

  for (const w of words) {
    if (w.progress.total_attempts === 0) {
      gray++;
    } else {
      const acc = (w.progress.total_correct / w.progress.total_attempts) * 100;
      if (acc < 40) red++;
      else if (acc < 70) orange++;
      else green++;
    }
  }

  const segments = [
    { count: green, color: 'bg-green-500', label: 'Iyi (>%70)', textColor: 'text-green-400' },
    { count: orange, color: 'bg-orange-500', label: 'Orta (%40-70)', textColor: 'text-orange-400' },
    { count: red, color: 'bg-red-500', label: 'Zayif (<%40)', textColor: 'text-red-400' },
    { count: gray, color: 'bg-slate-600', label: 'Tekrar edilmedi', textColor: 'text-slate-400' },
  ].filter((s) => s.count > 0);

  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <h3 className="text-sm font-medium text-slate-400 mb-3">Kelime Dagilimi</h3>
      <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} transition-all`}
            style={{ width: `${(seg.count / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${seg.color}`} />
            <span className={seg.textColor}>
              {seg.label}: {seg.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
