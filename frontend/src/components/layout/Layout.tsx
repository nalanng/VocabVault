import type { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-1 text-ink">
      <Header />
      <main className="px-4 pb-20 pt-16">{children}</main>
      <BottomNav />
    </div>
  );
}
