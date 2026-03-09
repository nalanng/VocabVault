import type { Word, WordProgress } from '../../types';
import { getLanguageFlag } from '../../utils/languages';

interface Props {
  words: (Word & { progress: WordProgress })[];
}

export default function WordStats({ words }: Props) {
  if (words.length === 0) {
    return (
      <p className="text-gray-4 text-center py-8">Henüz istatistik yok.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-ink mb-2">Kelime Performansı</h3>
      {words.map((word) => {
        const accuracy =
          word.progress.total_attempts > 0
            ? Math.round(
                (word.progress.total_correct / word.progress.total_attempts) * 100
              )
            : -1;

        const accentColor =
          accuracy < 0
            ? 'text-gray-4'
            : accuracy >= 70
              ? 'text-success'
              : accuracy >= 40
                ? 'text-orange-400'
                : 'text-danger';

        return (
          <div
            key={word.id}
            className="flex items-center justify-between bg-white border border-primary/20 rounded px-4 py-3"
          >
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-sm">
                <span>{getLanguageFlag(word.source_lang)}</span>
                <span className="text-ink truncate">{word.source_word}</span>
                <span className="text-gray-4 mx-1">→</span>
                <span>{getLanguageFlag(word.target_lang)}</span>
                <span className="text-gray-4 truncate">{word.target_word}</span>
              </div>
              {word.progress.last_reviewed && (
                <span className="text-xs text-gray-4">
                  Son: {word.progress.last_reviewed}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 ml-3 shrink-0">
              <span className="text-xs text-gray-4">
                {word.progress.total_correct}/{word.progress.total_attempts}
              </span>
              <span className={`text-sm font-semibold ${accentColor} min-w-[3rem] text-right`}>
                {accuracy < 0 ? '—' : `%${accuracy}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
