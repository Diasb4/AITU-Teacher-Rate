import React, { useState } from 'react';
import { useApp, ViewType } from '../../context/AppContext';
import { 
  Flame, 
  Users, 
  BookOpen, 
  Trophy, 
  Scale, 
  Star, 
  Sun, 
  Moon, 
  Menu, 
  X,
  GraduationCap
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    theme, 
    toggleTheme, 
    compareIds, 
    favorites 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ViewType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'catalog', label: 'Преподаватели', icon: Users },
    { id: 'disciplines', label: 'Поиск по предметам', icon: BookOpen },
    { id: 'leaderboard', label: 'Зал славы (Топы)', icon: Trophy },
    { id: 'compare', label: 'Сравнение', icon: Scale, badge: compareIds.length },
    { id: 'favorites', label: 'Избранное', icon: Star, badge: favorites.length },
  ];

  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div 
          className="flex items-center gap-3 shrink-0 cursor-pointer" 
          onClick={() => handleNavClick('catalog')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                AITU Prepod
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                Rate My Prof
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Честный рейтинг преподавателей Astana IT University
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-xs font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Сменить тему"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Quick Stats Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            <GraduationCap className="w-4 h-4 text-rose-500" />
            <span>578 преподавателей</span>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
