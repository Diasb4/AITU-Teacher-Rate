import { ProfessorRating, Review } from '../types';
import initialProfessorsData from '../data/professors_rating.json';

const STORAGE_KEYS = {
  USER_REVIEWS: 'aitu_prepod_reviews_v1',
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
  // Load professors merged with user-added local reviews
  getProfessors: (): ProfessorRating[] => {
    const baseList: ProfessorRating[] = JSON.parse(JSON.stringify(initialProfessorsData));
    try {
      const savedReviewsRaw = safeStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
      if (savedReviewsRaw) {
        const userReviews: Record<string, Review[]> = JSON.parse(savedReviewsRaw);
        
        // Merge user reviews into professors
        return baseList.map(prof => {
          const added = userReviews[prof.id];
          if (added && added.length > 0) {
            const allReviews = [...added, ...prof.reviews];
            const totalScore = allReviews.reduce((acc, r) => acc + r.rating, 0);
            const newTeachingRating = Number((totalScore / allReviews.length).toFixed(1));
            
            // Collect new tags
            const allTags = Array.from(new Set([...prof.top_tags, ...added.flatMap(a => a.tags)]));

            return {
              ...prof,
              teaching_rating: newTeachingRating,
              teaching_count: prof.teaching_count + added.length,
              top_tags: allTags,
              reviews: allReviews
            };
          }
          return prof;
        });
      }
    } catch (e) {
      console.error('Failed to load user reviews from storage', e);
    }
    return baseList;
  },

  addReview: (professorId: string, review: Review): void => {
    try {
      const savedRaw = safeStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
      const userReviews: Record<string, Review[]> = savedRaw ? JSON.parse(savedRaw) : {};
      if (!userReviews[professorId]) {
        userReviews[professorId] = [];
      }
      userReviews[professorId] = [review, ...userReviews[professorId]];
      safeStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(userReviews));
    } catch (e) {
      console.error('Failed to save review', e);
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
      favorites: storage.getFavorites(),
      compare: storage.getCompareList()
    };
    return JSON.stringify(payload, null, 2);
  },

  importBackup: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.userReviews) safeStorage.setItem(STORAGE_KEYS.USER_REVIEWS, data.userReviews);
      if (data.favorites) safeStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(data.favorites));
      if (data.compare) safeStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(data.compare));
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  }
};
