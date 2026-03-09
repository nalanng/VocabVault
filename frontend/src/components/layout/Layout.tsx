import type { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />

      {/* Main content area with padding to clear the fixed header and bottom nav */}
      <main className="px-4 pb-20 pt-16">{children}</main>

      <BottomNav />
    </div>
  );
}
