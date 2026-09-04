import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProfessorCard } from './ProfessorCard';
import { SortOption } from '../../types';
import { 
  Search, 
  Flame, 
  Filter, 
  Trophy, 
  Sparkles, 
  ChevronDown, 
  Star, 
  ShieldAlert, 
  SlidersHorizontal 
} from 'lucide-react';

export const ProfessorList: React.FC = () => {
  const { 
    professors, 
    searchQuery, 
    setSearchQuery, 
    selectedTag, 
    setSelectedTag, 
    minRating, 
    setMinRating, 
    sortBy, 
    setSortBy,
    tagsMeta 
  } = useApp();

  const [visibleCount, setVisibleCount] = useState(24);

  // Filter & Sort
  const filteredAndSorted = useMemo(() => {
    let result = professors.filter(prof => {
      // 1. Tag filter
      if (selectedTag !== 'ALL' && (!prof.top_tags || !prof.top_tags.includes(selectedTag))) {
        return false;
      }

      // 2. Rating filter
      if (minRating > 0 && prof.teaching_rating < minRating) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = prof.name.toLowerCase().includes(q);
        const inDept = prof.department.toLowerCase().includes(q);
        const inDisc = prof.disciplines?.some(d => d.toLowerCase().includes(q));
        const inTag = prof.top_tags?.some(t => t.toLowerCase().includes(q));
        if (!inName && !inDept && !inDisc && !inTag) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return b.teaching_rating - a.teaching_rating;
        case 'rating-asc':
          return a.teaching_rating - b.teaching_rating;
        case 'proctoring-desc':
          return b.proctoring_rating - a.proctoring_rating;
        case 'proctoring-asc':
          return a.proctoring_rating - b.proctoring_rating;
        case 'reviews-desc':
          return b.teaching_count - a.teaching_count;
        case 'name-asc':
          return a.name.localeCompare(b.name, 'ru');
        default:
          return b.teaching_rating - a.teaching_rating;
      }
    });

    return result;
  }, [professors, searchQuery, selectedTag, minRating, sortBy]);

  const displayed = filteredAndSorted.slice(0, visibleCount);

  const topTagsForFilter = [
    'ALL',
    'Best teacher',
    'Chill vibes',
    '+swag +rep',
    'Favourite teacher',
    'Psychological Horror',
    'You are cooked lil bro',
    'AI Strict',
    'Hard grader',
    'Tough but fair',
    'Fair game'
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-600 via-amber-600 to-red-700 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Flame className="w-80 h-80 fill-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>Студенческий рейтинг Astana IT University</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Найди и оцени своего преподавателя
          </h1>
          <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
            Честные отзывы студентов о парах, строгости прокторинга на сессии, оценках и подводных камнях каждого курса AITU.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0F172A] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Поиск по ФИО преподавателя, предмету (Algorithms, Calculus, Python) или студенческим тегам..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Сброс
            </button>
          )}
        </div>

        {/* Quick Tag Pills Filter */}
        <div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {topTagsForFilter.map(tag => {
              const isSelected = selectedTag === tag;
              const meta = tag !== 'ALL' ? tagsMeta[tag] : null;

              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tag === 'ALL' ? (
                    <span>Все теги</span>
                  ) : (
                    <>
                      <span>{meta?.emoji || '💬'}</span>
                      <span>{tag}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sorting and Threshold Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-500 dark:text-slate-400">Сортировка:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="rating-desc">По рейтингу (Лучшие)</option>
                <option value="rating-asc">По рейтингу (Низкие)</option>
                <option value="proctoring-desc">Самый жесткий прокторинг</option>
                <option value="proctoring-asc">Самый лояльный прокторинг</option>
                <option value="reviews-desc">По числу отзывов</option>
                <option value="name-asc">По алфавиту (А-Я)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-slate-500 dark:text-slate-400">Мин. оценка:</span>
              <select
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold outline-none"
              >
                <option value={0}>Все оценки</option>
                <option value={4.0}>4.0 ★ и выше</option>
                <option value={4.5}>4.5 ★ и выше</option>
                <option value={4.8}>4.8 ★ (Топ)</option>
              </select>
            </div>
          </div>

          <div className="font-semibold text-slate-500 dark:text-slate-400">
            Найдено: <strong className="text-slate-900 dark:text-white font-black">{filteredAndSorted.length}</strong> преподавателей
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredAndSorted.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800">
          <Flame className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Преподаватели не найдены</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Попробуйте сбросить выбранные теги или изменить строку поиска.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedTag('ALL'); setMinRating(0); setSortBy('rating-desc'); }}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayed.map(prof => (
              <ProfessorCard key={prof.id} professor={prof} />
            ))}
          </div>

          {visibleCount < filteredAndSorted.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 24)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>Показать еще ({filteredAndSorted.length - visibleCount} преподавателей)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
