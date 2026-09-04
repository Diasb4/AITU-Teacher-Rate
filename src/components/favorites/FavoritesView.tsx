import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProfessorCard } from '../catalog/ProfessorCard';
import { Star, Users } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, professors, setActiveView } = useApp();

  const favProfs = professors.filter(p => favorites.includes(p.id));

  if (favProfs.length === 0) {
    return (
      <div className="p-12 sm:p-16 text-center bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 mx-auto flex items-center justify-center">
          <Star className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Избранные преподаватели
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          У вас пока нет сохраненных преподавателей. Добавляйте интересных наставников в избранное кликом на звездочку <Star className="w-4 h-4 inline text-amber-500" /> на любой карточке!
        </p>
        <button
          onClick={() => setActiveView('catalog')}
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
        >
          Перейти в каталог преподавателей
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0F172A] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Сохраненные
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Избранные преподаватели ({favProfs.length})
          </h1>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {favProfs.map(prof => (
          <ProfessorCard key={prof.id} professor={prof} />
        ))}
      </div>
    </div>
  );
};
