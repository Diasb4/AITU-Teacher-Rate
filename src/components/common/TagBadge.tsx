import React from 'react';
import { useApp } from '../../context/AppContext';

export const TagBadge: React.FC<{ 
  tag: string; 
  onClick?: () => void; 
  active?: boolean;
  size?: 'sm' | 'md' 
}> = ({ tag, onClick, active, size = 'md' }) => {
  const { tagsMeta } = useApp();
  const meta = tagsMeta[tag] || { category: 'neutral', emoji: '💬', desc: '' };

  let colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  if (meta.category === 'positive') {
    colorClasses = active 
      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
  } else if (meta.category === 'danger') {
    colorClasses = active 
      ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
  } else if (meta.category === 'warning') {
    colorClasses = active 
      ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
  } else {
    colorClasses = active 
      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
      : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      title={meta.desc || tag}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border transition-all ${colorClasses} ${sizeClasses} ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}`}
    >
      <span>{meta.emoji}</span>
      <span>{tag}</span>
    </button>
  );
};
