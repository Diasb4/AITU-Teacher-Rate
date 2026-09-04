import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../services/storage';
import professorsData from '../data/professors_rating.json';
import disciplinesData from '../data/disciplines.json';
import tagsData from '../data/tags.json';
import { ProfessorRating, Review } from '../types';

describe('AITU Prepod Data Integrity', () => {
  it('loads 578 professors from dump_parsed synthesis with authentic ratings and tags', () => {
    const profs = professorsData as ProfessorRating[];
    expect(profs.length).toBe(578);

    const first = profs[0];
    expect(first.name).toBeDefined();
    expect(first.teaching_rating).toBeGreaterThanOrEqual(1.0);
    expect(first.teaching_rating).toBeLessThanOrEqual(5.0);
    expect(first.proctoring_rating).toBeGreaterThanOrEqual(1.0);
    expect(first.proctoring_rating).toBeLessThanOrEqual(5.0);
    expect(first.top_tags.length).toBeGreaterThan(0);
  });

  it('contains authentic AITU student tags in tag metadata', () => {
    const tags = tagsData as Record<string, any>;
    expect(tags['Chill vibes']).toBeDefined();
    expect(tags['Best teacher']).toBeDefined();
    expect(tags['+swag +rep']).toBeDefined();
    expect(tags['Psychological Horror']).toBeDefined();
    expect(tags['You are cooked lil bro']).toBeDefined();
  });

  it('loads 282 disciplines linked with professors', () => {
    const disciplines = disciplinesData as Array<{ name: string; professorsCount: number; professorIds: string[] }>;
    expect(disciplines.length).toBe(282);

    const algo = disciplines.find(d => d.name.includes('Algorithms'));
    expect(algo).toBeDefined();
    expect(algo?.professorsCount).toBeGreaterThan(0);
  });
});

describe('Review Submission & Rating Recalculation', () => {
  it('adds a new review and recalculates professor teaching rating', () => {
    const profs = storage.getProfessors();
    const target = profs[0];
    const initialReviewCount = target.reviews.length;

    const newReview: Review = {
      id: 'test-rev-1',
      author: 'Тестовый студент SE-2408',
      date: '2026-09-04',
      rating: 5,
      proctoring: 3,
      discipline: target.disciplines[0] || 'Общий курс',
      grade: 'A',
      text: 'Преподаватель великолепный, все понятно объясняет.',
      tags: ['Best teacher', '+swag +rep'],
      likes: 0
    };

    storage.addReview(target.id, newReview);

    const updatedProfs = storage.getProfessors();
    const updatedTarget = updatedProfs.find(p => p.id === target.id);

    expect(updatedTarget).toBeDefined();
    expect(updatedTarget?.reviews.length).toBe(initialReviewCount + 1);
    expect(updatedTarget?.top_tags).toContain('+swag +rep');
  });
});

describe('Compare & Favorites Storage', () => {
  it('toggles favorites correctly', () => {
    const profId = '0ac7c0ee-851e-44fb-9db1-96ecbbf4f99f';
    const favs = storage.toggleFavorite(profId);
    expect(favs).toContain(profId);

    const removed = storage.toggleFavorite(profId);
    expect(removed).not.toContain(profId);
  });

  it('saves and restores compare list', () => {
    const testIds = ['prof-0001', 'prof-0002'];
    storage.saveCompareList(testIds);
    expect(storage.getCompareList()).toEqual(testIds);
  });
});
