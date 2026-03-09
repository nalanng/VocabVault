import React from 'react';
import type { StatsOverview as StatsOverviewType } from '../../types';

interface StatsOverviewProps {
  stats: StatsOverviewType;
}

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
}

const StatsOverviewComponent: React.FC<StatsOverviewProps> = ({ stats }) => {
  const cards: StatCard[] = [
    {
      label: 'Toplam Kelime',
      value: stats.total_words,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      colorClass: 'text-primary-soft',
    },
    {
      label: 'Tekrar Edilen',
      value: stats.words_reviewed,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      ),
      colorClass: 'text-primary-soft',
    },
    {
      label: 'Doğruluk',
      value: `${Math.round(stats.average_accuracy)}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      colorClass: 'text-primary-soft',
    },
    {
      label: 'Bugün Tekrar',
      value: stats.due_today,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      colorClass: stats.due_today > 0 ? 'text-amber-400' : 'text-primary-soft',
    },
    {
      label: 'Zayıf Kelimeler',
      value: stats.weak_words,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      colorClass: 'text-primary-soft',
    },
    {
      label: 'Toplam Oturum',
      value: stats.total_sessions,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-4" />
        </svg>
      ),
      colorClass: 'text-primary-soft',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded border border-primary/20 bg-white p-4 transition-colors hover:border-primary/40"
        >
          <div className={`flex items-center gap-2 ${card.colorClass ?? 'text-primary-soft'}`}>
            {card.icon}
            <span className="text-xs font-bold text-primary-dark uppercase tracking-wider">{card.label}</span>
          </div>
          <p className={`mt-2 text-2xl font-bold tracking-tight ${card.colorClass ?? 'text-ink'}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverviewComponent;
