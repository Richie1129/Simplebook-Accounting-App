import React from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

type ActiveView = 'dashboard' | 'transactions' | 'categories' | 'settings';

interface AppLayoutProps {
  children: React.ReactNode;
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeView, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Navigation activeView={activeView} onNavigate={onNavigate} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
