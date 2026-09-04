import React from 'react';
import { ProfessorRating } from '../../types';
import { useApp } from '../../context/AppContext';
import { TagBadge } from '../common/TagBadge';
import { 
  Star, 
  ShieldAlert, 
  BookOpen, 
  MessageSquare, 
  Scale, 
  Plus 
} from 'lucide-react';

export const ProfessorCard: React.FC<{ professor: ProfessorRating }> = ({ professor }) => {
  const { 
    setActiveProfessorModal, 
    setRateProfessorModal, 
    favorites, 
    toggleFavorite,
    compareIds,
    toggleCompare 
  } = useApp();

  const isFav = favorites.includes(professor.id);
  const isCompared = compareIds.includes(professor.id);

  // Proctoring color indicator
  let proctoringBadgeColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
  let proctoringLabel = 'Лояльный прокторинг';
  if (professor.proctoring_rating >= 4.2) {
    proctoringBadgeColor = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
    proctoringLabel = 'Жесткий контроль';
  } else if (professor.proctoring_rating >= 3.6) {
    proctoringBadgeColor = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    proctoringLabel = 'Умеренная строгость';
  }

  return (
    <div className="group bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-rose-500/40 dark:hover:border-rose-500/40 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header with Avatar, Name & Favorite/Compare */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: professor.avatar_bg || '#E11D48' }}
            >
              {professor.initials}
            </div>
            <div>
              <h3 
                onClick={() => setActiveProfessorModal(professor)}
                className="font-black text-slate-900 dark:text-white text-base leading-tight hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors line-clamp-1"
              >
                {professor.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {professor.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toggleCompare(professor.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isCompared
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-500'
              }`}
              title={isCompared ? 'Удалить из сравнения' : 'Сравнить'}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(professor.id)}
              className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-amber-500 transition-colors"
              title={isFav ? 'В избранном' : 'В избранное'}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dual Ratings: Teaching & Proctoring Badges */}
        <div className="grid grid-cols-2 gap-2 mb-3.5">
          {/* Teaching Score */}
          <div className="p-2.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                Преподавание
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {professor.teaching_rating}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">({professor.teaching_count})</span>
              </div>
            </div>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>

          {/* Proctoring Score */}
          <div className="p-2.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 block">
                Прокторинг
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {professor.proctoring_rating}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">/ 5.0</span>
              </div>
            </div>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
        </div>

        {/* Tags Row */}
        {professor.top_tags && professor.top_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {professor.top_tags.slice(0, 3).map((tag, i) => (
              <TagBadge key={i} tag={tag} size="sm" />
            ))}
            {professor.top_tags.length > 3 && (
              <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5 self-center">
                +{professor.top_tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Disciplines snippet */}
        {professor.disciplines && professor.disciplines.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Дисциплины ({professor.disciplines.length}):</span>
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
              {professor.disciplines.slice(0, 2).join(', ')}
              {professor.disciplines.length > 2 && ` (+${professor.disciplines.length - 2})`}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setActiveProfessorModal(professor)}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Отзывы ({professor.reviews?.length || 0})</span>
        </button>
        <button
          onClick={() => setRateProfessorModal(professor)}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-bold shadow-xs shadow-rose-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Оценить</span>
        </button>
      </div>
    </div>
  );
};
