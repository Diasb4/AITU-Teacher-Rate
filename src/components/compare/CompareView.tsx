import React from 'react';
import { useApp } from '../../context/AppContext';
import { TagBadge } from '../common/TagBadge';
import { 
  Scale, 
  Trash2, 
  Star, 
  ShieldAlert, 
  BookOpen, 
  Check, 
  Plus, 
  Users 
} from 'lucide-react';

export const CompareView: React.FC = () => {
  const { 
    compareIds, 
    professors, 
    toggleCompare, 
    clearCompare, 
    setActiveProfessorModal, 
    setActiveView 
  } = useApp();

  const comparedProfs = professors.filter(p => compareIds.includes(p.id));

  if (comparedProfs.length === 0) {
    return (
      <div className="p-12 sm:p-16 text-center bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Сравнение преподавателей
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Вы еще не выбрали преподавателей для сравнения. Нажмите на иконку весов <Scale className="w-4 h-4 inline text-indigo-500" /> на карточке любого преподавателя (до 3 человек одновременно).
        </p>
        <button
          onClick={() => setActiveView('catalog')}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
        >
          Перейти в каталог преподавателей
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0F172A] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Инструмент сравнения
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Сравнение преподавателей ({comparedProfs.length} из 3)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('catalog')}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          >
            + Добавить еще
          </button>
          <button
            onClick={clearCompare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold"
          >
            <Trash2 className="w-4 h-4" />
            <span>Очистить</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={`grid gap-5 ${comparedProfs.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {comparedProfs.map(prof => (
          <div
            key={prof.id}
            className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: prof.avatar_bg || '#E11D48' }}
                  >
                    {prof.initials}
                  </div>
                  <div>
                    <h3 
                      onClick={() => setActiveProfessorModal(prof)}
                      className="font-black text-slate-900 dark:text-white text-base hover:text-indigo-600 cursor-pointer line-clamp-1"
                    >
                      {prof.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{prof.department}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleCompare(prof.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                  title="Удалить из сравнения"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Teaching Rating */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 my-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block mb-1">
                  Оценка преподавания
                </span>
                <div className="flex items-center justify-center gap-1.5 text-2xl font-black text-slate-900 dark:text-white">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <span>{prof.teaching_rating}</span>
                  <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {prof.teaching_count} проверенных отзывов
                </p>
              </div>

              {/* Proctoring Score */}
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 mb-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 block mb-1">
                  Сложность прокторинга
                </span>
                <div className="flex items-center justify-center gap-1.5 text-2xl font-black text-slate-900 dark:text-white">
                  <ShieldAlert className="w-6 h-6 text-rose-500" />
                  <span>{prof.proctoring_rating}</span>
                  <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {prof.proctoring_rating >= 4.2 ? '🔥 Списать невозможно' : '😎 Спокойно'}
                </p>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-400 block mb-2">Характеристики студентов:</span>
                <div className="flex flex-wrap gap-1.5">
                  {prof.top_tags?.map((t, ti) => (
                    <TagBadge key={ti} tag={t} size="sm" />
                  ))}
                </div>
              </div>

              {/* Disciplines */}
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1.5">Дисциплины:</span>
                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {prof.disciplines.slice(0, 3).map((d, di) => (
                    <p key={di}>• {d}</p>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveProfessorModal(prof)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              Смотреть все отзывы ({prof.reviews?.length || 0})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
