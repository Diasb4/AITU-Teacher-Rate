import { ProfessorRating, Review } from '../types';
import initialProfessorsData from '../data/professors_rating.json';

const STORAGE_KEYS = {
  USER_REVIEWS: 'aitu_prepod_reviews_v1',
  SUGGESTED_PROFESSORS: 'aitu_prepod_suggested_v1',
  FAVORITES: 'aitu_prepod_favorites_v1',
  COMPARE: 'aitu_prepod_compare_v1',
  THEME: 'aitu_prepod_theme_v1'
};

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const memoryStore: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser) return localStorage.getItem(key);
    return memoryStore[key] || null;
  },
  setItem: (key: string, value: string): void => {
    if (isBrowser) localStorage.setItem(key, value);
    else memoryStore[key] = value;
  }
};

export const storage = {
  // Load professors merged with both local and remote reviews + suggested professors
  getProfessors: (remoteReviews: Record<string, Review[]> = {}, remoteSuggested: any[] = []): ProfessorRating[] => {
    const baseList: ProfessorRating[] = JSON.parse(JSON.stringify(initialProfessorsData));
    
    // Load locally suggested professors
    let localSuggested: any[] = [];
    try {
      const savedSuggested = safeStorage.getItem(STORAGE_KEYS.SUGGESTED_PROFESSORS);
      if (savedSuggested) {
        localSuggested = JSON.parse(savedSuggested);
      }
    } catch (e) {
      console.error('Failed to load suggested professors', e);
    }

    // Merge suggested professors (deduplicate by id)
    const allSuggestedMap = new Map<string, any>();
    for (const p of [...localSuggested, ...remoteSuggested]) {
      if (p && p.id) allSuggestedMap.set(p.id, p);
    }

    const convertedSuggested: ProfessorRating[] = Array.from(allSuggestedMap.values()).map(sp => ({
      id: sp.id,
      name: sp.name,
      department: sp.department || 'Astana IT University',
      disciplines: Array.isArray(sp.disciplines) ? sp.disciplines : [],
      teaching_rating: 5.0,
      proctoring_rating: 3.0,
      teaching_count: 0,
      proctoring_count: 0,
      top_tags: ['Новый преподаватель'],
      reviews: [],
      initials: sp.initials || sp.name.slice(0, 2).toUpperCase(),
      avatar_bg: sp.avatar_bg || '#E11D48',
      groups: []
    }));

    const combinedList = [...baseList, ...convertedSuggested];

    try {
      const savedReviewsRaw = safeStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
      const localReviews: Record<string, Review[]> = savedReviewsRaw ? JSON.parse(savedReviewsRaw) : {};

      return combinedList.map(prof => {
        const localAdded = localReviews[prof.id] || [];
        const remoteAdded = remoteReviews[prof.id] || [];

        // Deduplicate reviews by id
        const reviewMap = new Map<string, Review>();
        // Add new reviews first so they take precedence
        for (const r of [...remoteAdded, ...localAdded]) {
          if (r && r.id) reviewMap.set(r.id, r);
        }
        for (const r of prof.reviews) {
          if (r && r.id && !reviewMap.has(r.id)) reviewMap.set(r.id, r);
        }

        const allReviews = Array.from(reviewMap.values());
        const userAddedCount = allReviews.length - prof.reviews.length;

        if (userAddedCount > 0 && allReviews.length > 0) {
          const totalTeachingScore = allReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
          const newTeachingRating = Number((totalTeachingScore / allReviews.length).toFixed(1));

          const totalProctoringScore = allReviews.reduce((acc, r) => acc + (r.proctoring || 3), 0);
          const newProctoringRating = Number((totalProctoringScore / allReviews.length).toFixed(1));

          // Collect tags
          const allTags = Array.from(
            new Set([...prof.top_tags, ...allReviews.flatMap(a => a.tags || [])])
          );

          return {
            ...prof,
            teaching_rating: newTeachingRating,
            proctoring_rating: newProctoringRating,
            teaching_count: allReviews.length,
            proctoring_count: allReviews.length,
            top_tags: allTags,
            reviews: allReviews
          };
        }

        return prof;
      });
    } catch (e) {
      console.error('Failed to merge reviews from storage', e);
      return combinedList;
    }
  },

  addReview: (professorId: string, review: Review): void => {
    try {
      const savedRaw = safeStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
      const userReviews: Record<string, Review[]> = savedRaw ? JSON.parse(savedRaw) : {};
      if (!userReviews[professorId]) {
        userReviews[professorId] = [];
      }
      // Deduplicate
      userReviews[professorId] = [
        review,
        ...userReviews[professorId].filter(r => r.id !== review.id)
      ];
      safeStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(userReviews));
    } catch (e) {
      console.error('Failed to save review locally', e);
    }
  },

  addSuggestedProfessor: (prof: any): void => {
    try {
      const savedRaw = safeStorage.getItem(STORAGE_KEYS.SUGGESTED_PROFESSORS);
      const list = savedRaw ? JSON.parse(savedRaw) : [];
      const updated = [prof, ...list.filter((p: any) => p.id !== prof.id)];
      safeStorage.setItem(STORAGE_KEYS.SUGGESTED_PROFESSORS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save suggested professor locally', e);
    }
  },

  getFavorites: (): string[] => {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse favorites', e);
    }
    return [];
  },

  toggleFavorite: (professorId: string): string[] => {
    const favs = storage.getFavorites();
    const exists = favs.includes(professorId);
    const updated = exists ? favs.filter(id => id !== professorId) : [...favs, professorId];
    safeStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return updated;
  },

  getCompareList: (): string[] => {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.COMPARE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse compare list', e);
    }
    return [];
  },

  saveCompareList: (ids: string[]): void => {
    safeStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(ids));
  },

  exportBackup: (): string => {
    const payload = {
      app: 'aitu_prepod_rating',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      userReviews: safeStorage.getItem(STORAGE_KEYS.USER_REVIEWS),
      suggestedProfessors: safeStorage.getItem(STORAGE_KEYS.SUGGESTED_PROFESSORS),
      favorites: storage.getFavorites(),
      compare: storage.getCompareList()
    };
    return JSON.stringify(payload, null, 2);
  },

  importBackup: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.userReviews) safeStorage.setItem(STORAGE_KEYS.USER_REVIEWS, data.userReviews);
      if (data.suggestedProfessors) safeStorage.setItem(STORAGE_KEYS.SUGGESTED_PROFESSORS, data.suggestedProfessors);
      if (data.favorites) safeStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(data.favorites));
      if (data.compare) safeStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(data.compare));
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  }
};
