import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TagBadge } from '../common/TagBadge';
import { 
  Trophy, 
  Flame, 
  ShieldAlert, 
  Star, 
  MessageSquare, 
  Skull, 
  Award, 
  Smile, 
  ArrowUpRight 
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { professors, setActiveProfessorModal, setRateProfessorModal } = useApp();

  const [activeCategory, setActiveCategory] = useState<'favourites' | 'hardcore' | 'chill' | 'popular'>('favourites');

  // 1. Favourites: highest teaching rating with at least 3 reviews
  const topFavourites = [...professors]
    .sort((a, b) => b.teaching_rating - a.teaching_rating || b.teaching_count - a.teaching_count)
    .slice(0, 10);

  // 2. Hardcore bosses: teachers with tags like "Psychological Horror", "You are cooked lil bro", "Pray for your Scholorship", or high proctoring rating
  const hardcoreBosses = [...professors]
    .filter(p => p.top_tags?.some(t => ['Psychological Horror', 'You are cooked lil bro', 'Pray for your Scholorship', 'Hard grader', 'Retake'].includes(t)) || p.proctoring_rating >= 4.3)
    .sort((a, b) => b.proctoring_rating - a.proctoring_rating || a.teaching_rating - b.teaching_rating)
    .slice(0, 10);

  // 3. Chill proctoring: high teaching rating + lowest proctoring rating
  const chillProctoring = [...professors]
    .filter(p => p.top_tags?.some(t => ['Chill vibes', '+swag +rep', 'Fair game'].includes(t)) || p.proctoring_rating <= 3.8)
    .sort((a, b) => a.proctoring_rating - b.proctoring_rating || b.teaching_rating - a.teaching_rating)
    .slice(0, 10);

  // 4. Most discussed: highest review count
  const mostPopular = [...professors]
    .sort((a, b) => b.teaching_count - a.teaching_count)
    .slice(0, 10);

  let currentList = topFavourites;
  if (activeCategory === 'hardcore') currentList = hardcoreBosses;
  else if (activeCategory === 'chill') currentList = chillProctoring;
  else if (activeCategory === 'popular') currentList = mostPopular;

  return (
    <div className="space-y-6">
      
      {/* Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>Зал славы и антирейтинги</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Лидерборд преподавателей AITU
          </h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
            Самые любимые наставники потока, главные боссы сессии с жестоким прокторингом и самые комфортные преподаватели по мнению студентов.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveCategory('favourites')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeCategory === 'favourites'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-[1.02]'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Trophy className="w-5 h-5" />
            <span className="font-black text-sm">Топ любимых</span>
          </div>
          <p className={`text-xs ${activeCategory === 'favourites' ? 'text-amber-100' : 'text-slate-500 dark:text-slate-400'}`}>
            Максимальный рейтинг преподавания (+swag +rep)
          </p>
        </button>

        <button
          onClick={() => setActiveCategory('hardcore')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeCategory === 'hardcore'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-[1.02]'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Skull className="w-5 h-5" />
            <span className="font-black text-sm">Хардкор боссы</span>
          </div>
          <p className={`text-xs ${activeCategory === 'hardcore' ? 'text-rose-100' : 'text-slate-500 dark:text-slate-400'}`}>
            Psychological Horror и жесткий прокторинг
          </p>
        </button>

        <button
          onClick={() => setActiveCategory('chill')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeCategory === 'chill'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Smile className="w-5 h-5" />
            <span className="font-black text-sm">Chill прокторинг</span>
          </div>
          <p className={`text-xs ${activeCategory === 'chill' ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
            Спокойная атмосфера на экзаменах без духоты
          </p>
        </button>

        <button
          onClick={() => setActiveCategory('popular')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeCategory === 'popular'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Flame className="w-5 h-5" />
            <span className="font-black text-sm">Самые обсуждаемые</span>
          </div>
          <p className={`text-xs ${activeCategory === 'popular' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
            Лидеры по количеству отзывов студентов
          </p>
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {currentList.map((prof, rank) => {
            let rankBadge = (
              <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center">
                {rank + 1}
              </span>
            );

            if (rank === 0) {
              rankBadge = (
                <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
                  🥇
                </span>
              );
            } else if (rank === 1) {
              rankBadge = (
                <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center shadow-xs">
                  🥈
                </span>
              );
            } else if (rank === 2) {
              rankBadge = (
                <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  🥉
                </span>
              );
            }

            return (
              <div
                key={prof.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  {rankBadge}
                  <div 
                    className="w-11 h-11 rounded-2xl text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: prof.avatar_bg || '#E11D48' }}
                  >
                    {prof.initials}
                  </div>
                  <div>
                    <h3 
                      onClick={() => setActiveProfessorModal(prof)}
                      className="font-black text-slate-900 dark:text-white text-base hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors leading-tight"
                    >
                      {prof.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {prof.department} • {prof.disciplines.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  {/* Tags */}
                  <div className="hidden md:flex items-center gap-1.5">
                    {prof.top_tags?.slice(0, 2).map((t, ti) => (
                      <TagBadge key={ti} tag={t} size="sm" />
                    ))}
                  </div>

                  {/* Ratings */}
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 font-black text-base justify-end">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{prof.teaching_rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {prof.teaching_count} отзывов
                      </span>
                    </div>

                    <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
                      <div className="flex items-center gap-1 text-rose-500 font-black text-base justify-end">
                        <ShieldAlert className="w-4 h-4" />
                        <span>{prof.proctoring_rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        прокторинг
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => setActiveProfessorModal(prof)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Открыть профиль и отзывы"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
