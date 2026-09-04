export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number; // 1 to 5
  proctoring?: number; // 1 to 5
  grade: string; // 'A' | 'B+' | 'B' | 'C' | 'D' | 'Retake'
  discipline: string;
  text: string;
  tags: string[];
  likes: number;
}

export interface ProfessorRating {
  id: string;
  name: string;
  initials: string;
  avatar_bg: string;
  department: string;
  teaching_rating: number;
  teaching_count: number;
  proctoring_rating: number;
  proctoring_count: number;
  top_tags: string[];
  disciplines: string[];
  groups: string[];
  reviews: Review[];
}

export interface DisciplineInfo {
  name: string;
  professorsCount: number;
  professorIds: string[];
}

export interface TagMeta {
  category: 'positive' | 'neutral' | 'warning' | 'danger';
  emoji: string;
  desc: string;
}

export type SortOption = 
  | 'rating-desc' 
  | 'rating-asc' 
  | 'proctoring-desc' 
  | 'proctoring-asc' 
  | 'reviews-desc' 
  | 'name-asc';
