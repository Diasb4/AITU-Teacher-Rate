import React from 'react';
import { useApp } from '../../context/AppContext';
import { TagBadge } from '../common/TagBadge';
import { 
  X, 
  Star, 
  ShieldAlert, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Plus, 
  ThumbsUp, 
  CheckCircle2, 
  Scale 
} from 'lucide-react';

export const ProfessorModal: React.FC = () => {
  const { 
    activeProfessorModal, 
    setActiveProfessorModal, 
    setRateProfessorModal, 
    favorites, 
    toggleFavorite,
    compareIds,
    toggleCompare 
  } = useApp();

  if (!activeProfessorModal) return null;

  const prof = activeProfessorModal;
  const isFav = favorites.includes(prof.id);
  const isCompared = compareIds.includes(prof.id);

  const reviews = prof.reviews || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-white font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-md"
              style={{ backgroundColor: prof.avatar_bg || '#E11D48' }}
            >
              {prof.initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {prof.department}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {prof.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {prof.disciplines.length} предметов • {prof.teaching_count} оценок студентов
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleCompare(prof.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isCompared
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-500'
              }`}
              title={isCompared ? 'Удалить из сравнения' : 'Добавить к сравнению'}
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(prof.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isFav 
                  ? 'border-amber-400 bg-amber-50 text-amber-500 dark:bg-amber-950/40' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
              }`}
              title={isFav ? 'В избранном' : 'В избранное'}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => setActiveProfessorModal(null)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300">
          
          {/* Dual Score Cards: Teaching & Proctoring */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Teaching Rating Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                  Рейтинг преподавания
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    {prof.teaching_rating}
                  </span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  На основе <strong>{prof.teaching_count}</strong> проверенных отзывов
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-8 h-8 fill-amber-400" />
              </div>
            </div>

            {/* Proctoring Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-purple-50/40 dark:from-rose-950/20 dark:to-purple-950/10 border border-rose-200/80 dark:border-rose-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1">
                  Сложность прокторинга на сессии
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    {prof.proctoring_rating}
                  </span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {prof.proctoring_rating >= 4.2 ? '🔥 Жесткий контроль, не списать' : prof.proctoring_rating >= 3.5 ? '⚖️ Умеренный прокторинг' : '😎 Лояльный прокторинг'}
                </p>
              </div>
              <div className="text-rose-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Tags cloud */}
          {prof.top_tags && prof.top_tags.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Ключевые теги студентов
              </span>
              <div className="flex flex-wrap gap-2">
                {prof.top_tags.map((tag, i) => (
                  <TagBadge key={i} tag={tag} />
                ))}
              </div>
            </div>
          )}

          {/* Disciplines & Groups */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
                <BookOpen className="w-4 h-4" />
                Преподаваемые дисциплины ({prof.disciplines.length})
              </h4>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {prof.disciplines.map((d, i) => (
                  <p key={i} className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    • {d}
                  </p>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Users className="w-4 h-4" />
                Группы студентов ({prof.groups.length})
              </h4>
              <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                {prof.groups.map((g, i) => (
                  <span 
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Stream */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-rose-500" />
                <span>Отзывы студентов ({reviews.length})</span>
              </h3>
              <button
                onClick={() => setRateProfessorModal(prof)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Написать отзыв</span>
              </button>
            </div>

            <div className="space-y-3">
              {reviews.map((rev, idx) => (
                <div
                  key={rev.id || idx}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="ml-1 text-slate-900 dark:text-white">{rev.rating}.0</span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{rev.author}</span>
                      <span className="text-slate-400">({rev.date})</span>
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                      Оценка: {rev.grade}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                    {rev.text}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="italic">Предмет: {rev.discipline}</span>
                    <div className="flex items-center gap-1.5">
                      {rev.tags?.map((t, ti) => (
                        <span key={ti} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-medium border border-slate-200 dark:border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveProfessorModal(null)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Закрыть
          </button>
          <button
            onClick={() => setRateProfessorModal(prof)}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Оценить этого преподавателя</span>
          </button>
        </div>
      </div>
    </div>
  );
};
