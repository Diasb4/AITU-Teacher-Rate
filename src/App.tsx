import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ProfessorList } from './components/catalog/ProfessorList';
import { DisciplinesView } from './components/disciplines/DisciplinesView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { CompareView } from './components/compare/CompareView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { ProfessorModal } from './components/profile/ProfessorModal';
import { RateModal } from './components/profile/RateModal';
import { ToastRegion } from './components/common/ToastRegion';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
      {activeView === 'catalog' && <ProfessorList />}
      {activeView === 'disciplines' && <DisciplinesView />}
      {activeView === 'leaderboard' && <LeaderboardView />}
      {activeView === 'compare' && <CompareView />}
      {activeView === 'favorites' && <FavoritesView />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Header />
        <MainContent />
        <Footer />

        {/* Global Modals & Notifications */}
        <ProfessorModal />
        <RateModal />
        <ToastRegion />
      </div>
    </AppProvider>
  );
};

export default App;
