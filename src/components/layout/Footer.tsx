import React from 'react';
import { Flame, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-[#0B0F17]/60 py-8 px-4 sm:px-6 transition-colors text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>AITU Prepod Rating</span>
          </div>
          <span>•</span>
          <span>Создано студентами для студентов Astana IT University</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% Static SPA • Ready for Free Hostings (GitHub Pages / Cloudflare)</span>
          </div>
          <span>База: 578 преподавателей и 282 дисциплины</span>
        </div>
      </div>
    </footer>
  );
};
