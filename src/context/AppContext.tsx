import React, { createContext, useContext, useEffect, useState } from 'react';
import { DisciplineInfo, ProfessorRating, Review, SortOption, TagMeta } from '../types';
import { storage } from '../services/storage';
import disciplinesData from '../data/disciplines.json';
import tagsData from '../data/tags.json';

export type ViewType = 'catalog' | 'disciplines' | 'leaderboard' | 'compare' | 'favorites';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedDiscipline: string;
  setSelectedDiscipline: (disc: string) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  professors: ProfessorRating[];
  disciplines: DisciplineInfo[];
  tagsMeta: Record<string, TagMeta>;

  favorites: string[];
  toggleFavorite: (id: string) => void;

  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  activeProfessorModal: ProfessorRating | null;
  setActiveProfessorModal: (p: ProfessorRating | null) => void;

  rateProfessorModal: ProfessorRating | null;
  setRateProfessorModal: (p: ProfessorRating | null) => void;

  submitReview: (professorId: string, reviewData: Omit<Review, 'id' | 'date' | 'likes'>) => void;

  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [selectedDiscipline, setSelectedDiscipline] = useState('ALL');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('aitu_prepod_theme_v1');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('aitu_prepod_theme_v1', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // State
  const [professors, setProfessors] = useState<ProfessorRating[]>(storage.getProfessors());
  const disciplines: DisciplineInfo[] = disciplinesData as DisciplineInfo[];
  const tagsMeta: Record<string, TagMeta> = tagsData as Record<string, TagMeta>;

  const [favorites, setFavorites] = useState<string[]>(storage.getFavorites());
  const [compareIds, setCompareIds] = useState<string[]>(storage.getCompareList());

  const [activeProfessorModal, setActiveProfessorModal] = useState<ProfessorRating | null>(null);
  const [rateProfessorModal, setRateProfessorModal] = useState<ProfessorRating | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleFavorite = (id: string) => {
    const updated = storage.toggleFavorite(id);
    setFavorites(updated);
    const exists = updated.includes(id);
    addToast(exists ? 'Преподаватель добавлен в избранное' : 'Преподаватель удален из избранного', 'info');
  };

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(x => x !== id);
        addToast('Преподаватель удален из сравнения', 'info');
      } else {
        if (prev.length >= 3) {
          addToast('Можно сравнивать максимум 3 преподавателей одновременно', 'warning');
          return prev;
        }
        next = [...prev, id];
        addToast('Преподаватель добавлен к сравнению', 'success');
      }
      storage.saveCompareList(next);
      return next;
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
    storage.saveCompareList([]);
    addToast('Список сравнения очищен', 'info');
  };

  const submitReview = (professorId: string, reviewData: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      likes: 1
    };

    storage.addReview(professorId, newReview);
    const reloaded = storage.getProfessors();
    setProfessors(reloaded);

    // Update open modal if looking at this professor
    if (activeProfessorModal && activeProfessorModal.id === professorId) {
      const updatedProf = reloaded.find(p => p.id === professorId);
      if (updatedProf) setActiveProfessorModal(updatedProf);
    }

    addToast('Спасибо! Ваш отзыв успешно опубликован и сохранен.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        selectedDiscipline,
        setSelectedDiscipline,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,

        theme,
        toggleTheme,

        professors,
        disciplines,
        tagsMeta,

        favorites,
        toggleFavorite,

        compareIds,
        toggleCompare,
        clearCompare,

        activeProfessorModal,
        setActiveProfessorModal,

        rateProfessorModal,
        setRateProfessorModal,

        submitReview,

        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
