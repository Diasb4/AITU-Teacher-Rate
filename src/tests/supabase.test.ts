import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection 
} from '../services/supabase';
import { storage } from '../services/storage';
import { Review } from '../types';

describe('Supabase Free Tier Integration', () => {
  beforeEach(() => {
    clearSupabaseConfig();
  });

  it('has production Supabase configured by default and allows overrides', () => {
    const defaultConf = getSupabaseConfig();
    expect(defaultConf.isConfigured).toBe(true);
    expect(defaultConf.url).toContain('eexyrygatojgxmwhfgka.supabase.co');

    saveSupabaseConfig('https://testproject.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey');
    const customConf = getSupabaseConfig();
    expect(customConf.url).toBe('https://testproject.supabase.co');
    expect(customConf.key).toContain('eyJhbGciOiJIUzI1Ni');

    clearSupabaseConfig();
    const resetConf = getSupabaseConfig();
    expect(resetConf.url).toContain('eexyrygatojgxmwhfgka.supabase.co');
  });

  it('fails safely when checking connection without keys', async () => {
    const res = await testSupabaseConnection('', '');
    expect(res.success).toBe(false);
    expect(res.message).toContain('не указаны');
  });

  it('merges remote Supabase reviews into professors catalogue', () => {
    const baseProfs = storage.getProfessors();
    const targetProf = baseProfs[0];
    const initialReviewsCount = targetProf.reviews.length;

    const mockRemoteReview: Review = {
      id: 'supa-rev-999',
      author: 'Supabase Remote Student',
      rating: 5,
      proctoring: 4,
      discipline: 'Database Systems',
      grade: 'A',
      tags: ['+swag +rep', 'Chill vibes'],
      text: 'Отзыв, загруженный из базы данных Supabase.',
      likes: 5,
      date: '2026-09-04'
    };

    const remoteMap = {
      [targetProf.id]: [mockRemoteReview]
    };

    const merged = storage.getProfessors(remoteMap, []);
    const updated = merged.find(p => p.id === targetProf.id);

    expect(updated).toBeDefined();
    expect(updated?.reviews.length).toBe(initialReviewsCount + 1);
    expect(updated?.reviews.some(r => r.id === 'supa-rev-999')).toBe(true);
  });

  it('supports student-suggested professors in catalogue', () => {
    const mockSuggested = [
      {
        id: 'prof-sugg-12345',
        name: 'Нурланов Асет Болатович',
        department: 'Department of Software Engineering',
        disciplines: ['DevOps & CI/CD', 'Cloud Architecture'],
        initials: 'НА',
        avatar_bg: '#2563EB',
        suggested_by: 'Студент SE-2401'
      }
    ];

    const merged = storage.getProfessors({}, mockSuggested);
    const added = merged.find(p => p.id === 'prof-sugg-12345');

    expect(added).toBeDefined();
    expect(added?.name).toBe('Нурланов Асет Болатович');
    expect(added?.disciplines).toContain('Cloud Architecture');
    expect(added?.teaching_rating).toBe(5.0);
  });
});
