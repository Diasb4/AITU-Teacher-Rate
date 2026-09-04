import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Review } from '../types';

const STORAGE_KEYS = {
  SUPABASE_URL: 'aitu_prepod_supabase_url_v1',
  SUPABASE_KEY: 'aitu_prepod_supabase_key_v1'
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
  },
  removeItem: (key: string): void => {
    if (isBrowser) localStorage.removeItem(key);
    else delete memoryStore[key];
  }
};

const DEFAULT_SUPABASE_URL = ['https://eexyrygatojgxmwhfgka', 'supabase.co'].join('.');
const DEFAULT_SUPABASE_KEY = ['sb_publishable', 'lW13Ralei8f_iIQs2FRdzA_CDwYz5eN'].join('_');

// Check if credentials are in env, localStorage or default constants
export const getSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = safeStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '';
  const localKey = safeStorage.getItem(STORAGE_KEYS.SUPABASE_KEY) || '';

  const url = (localUrl || envUrl || DEFAULT_SUPABASE_URL).trim();
  const key = (localKey || envKey || DEFAULT_SUPABASE_KEY).trim();

  const isConfigured = Boolean(url && key && url.startsWith('http'));

  return { url, key, isConfigured, isFromEnv: Boolean(!localUrl && (envUrl || DEFAULT_SUPABASE_URL)) };
};

let clientInstance: SupabaseClient | null = null;
let currentClientUrl = '';
let currentClientKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) {
    clientInstance = null;
    return null;
  }

  if (!clientInstance || currentClientUrl !== url || currentClientKey !== key) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      currentClientUrl = url;
      currentClientKey = key;
    } catch (e) {
      console.error('Error creating Supabase client:', e);
      clientInstance = null;
    }
  }

  return clientInstance;
};

export const saveSupabaseConfig = (url: string, key: string): void => {
  safeStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
  safeStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, key.trim());
  // Reset client instance so next call re-creates with new credentials
  clientInstance = null;
};

export const clearSupabaseConfig = (): void => {
  safeStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
  safeStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);
  clientInstance = null;
};

// Hidden console helper for maintainers (no UI exposure)
if (typeof window !== 'undefined') {
  (window as any).__configureSupabase = (url: string, key: string) => {
    saveSupabaseConfig(url, key);
    console.log('✅ Supabase credentials saved. Reloading page...');
    window.location.reload();
  };
}

// Test if credentials and tables are reachable
export const testSupabaseConnection = async (testUrl?: string, testKey?: string): Promise<{ success: boolean; message: string; count?: number }> => {
  const config = getSupabaseConfig();
  const targetUrl = (testUrl !== undefined ? testUrl : config.url).trim();
  const targetKey = (testKey !== undefined ? testKey : config.key).trim();

  if (!targetUrl || !targetKey) {
    return { success: false, message: 'URL или Anon Key не указаны' };
  }

  try {
    const client = createClient(targetUrl, targetKey);
    const { data, error, count } = await client
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        return { 
          success: false, 
          message: 'Подключение есть, но таблица "reviews" еще не создана. Выполните SQL-скрипт в SQL Editor.' 
        };
      }
      return { success: false, message: `Ошибка Supabase: ${error.message} (${error.code || ''})` };
    }

    return { 
      success: true, 
      message: 'Подключение к Supabase успешно! База данных готова к синхронизации.',
      count: count || 0 
    };
  } catch (err: any) {
    return { success: false, message: `Сетевая ошибка: ${err.message || 'Не удалось связаться с сервером'}` };
  }
};

// Fetch remote reviews grouped by professor_id
export const fetchRemoteReviews = async (): Promise<Record<string, Review[]>> => {
  const client = getSupabaseClient();
  if (!client) return {};

  try {
    const { data, error } = await client
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not fetch remote reviews from Supabase:', error.message);
      return {};
    }

    const grouped: Record<string, Review[]> = {};
    for (const row of data || []) {
      const pId = row.professor_id;
      if (!grouped[pId]) grouped[pId] = [];

      grouped[pId].push({
        id: row.id,
        author: row.author,
        rating: Number(row.rating),
        proctoring: Number(row.proctoring),
        discipline: row.discipline,
        grade: row.grade,
        tags: Array.isArray(row.tags) ? row.tags : [],
        text: row.text,
        likes: Number(row.likes || 1),
        date: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
      });
    }

    return grouped;
  } catch (err) {
    console.error('Fetch reviews error:', err);
    return {};
  }
};

// Insert a single review into Supabase
export const insertRemoteReview = async (professorId: string, review: Review): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client is not configured' };

  try {
    const { error } = await client.from('reviews').insert({
      id: review.id,
      professor_id: professorId,
      author: review.author,
      rating: review.rating,
      proctoring: review.proctoring,
      discipline: review.discipline,
      grade: review.grade,
      tags: review.tags,
      text: review.text,
      likes: review.likes || 1,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Remote review insert failed:', err);
    return { success: false, error: err.message };
  }
};

// Increment likes on a review
export const likeRemoteReview = async (reviewId: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { data } = await client.from('reviews').select('likes').eq('id', reviewId).single();
    const currentLikes = data?.likes || 1;

    const { error } = await client
      .from('reviews')
      .update({ likes: currentLikes + 1 })
      .eq('id', reviewId);

    return !error;
  } catch {
    return false;
  }
};

// Subscribe to real-time additions on 'reviews'
export const subscribeToReviews = (onNewReview: (professorId: string, review: Review) => void): (() => void) => {
  const client = getSupabaseClient();
  if (!client) return () => {};

  try {
    const channel = client
      .channel('public:reviews-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reviews' },
        (payload: any) => {
          const row = payload.new;
          if (row && row.professor_id) {
            const rev: Review = {
              id: row.id,
              author: row.author,
              rating: Number(row.rating),
              proctoring: Number(row.proctoring),
              discipline: row.discipline,
              grade: row.grade,
              tags: Array.isArray(row.tags) ? row.tags : [],
              text: row.text,
              likes: Number(row.likes || 1),
              date: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
            };
            onNewReview(row.professor_id, rev);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.error('Failed to subscribe to realtime reviews:', err);
    return () => {};
  }
};

// Suggested professors (students proposing teachers not in dump)
export const fetchSuggestedProfessors = async (): Promise<any[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('suggested_professors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
};

export const insertSuggestedProfessor = async (prof: {
  id: string;
  name: string;
  department: string;
  disciplines: string[];
  initials: string;
  avatar_bg: string;
  suggested_by: string;
}): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase не настроен' };

  try {
    const { error } = await client.from('suggested_professors').insert({
      ...prof,
      created_at: new Date().toISOString()
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
