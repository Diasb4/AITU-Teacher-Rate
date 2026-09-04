import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, ShieldAlert, X, MessageSquare, Send, Check } from 'lucide-react';

export const RateModal: React.FC = () => {
  const { rateProfessorModal, setRateProfessorModal, submitReview, tagsMeta } = useApp();

  if (!rateProfessorModal) return null;

  const prof = rateProfessorModal;

  const [teachingRating, setTeachingRating] = useState(5);
  const [proctoringRating, setProctoringRating] = useState(4);
  const [selectedDiscipline, setSelectedDiscipline] = useState(
    prof.disciplines.length > 0 ? prof.disciplines[0] : 'Общий курс'
  );
  const [grade, setGrade] = useState('A');
  const [author, setAuthor] = useState('Студент AITU');
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = Object.keys(tagsMeta);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    submitReview(prof.id, {
      author: author.trim() || 'Анонимный студент',
      rating: teachingRating,
      proctoring: proctoringRating,
      discipline: selectedDiscipline,
      grade,
      tags: selectedTags.length > 0 ? selectedTags : ['Fair game'],
      text: text.trim()
    });

    setRateProfessorModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl text-white font-black flex items-center justify-center text-lg shadow-sm shrink-0"
              style={{ backgroundColor: prof.avatar_bg || '#E11D48' }}
            >
              {prof.initials}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Оставить отзыв и оценку
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                {prof.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{prof.department}</p>
            </div>
          </div>

          <button
            onClick={() => setRateProfessorModal(null)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm flex-1">
          
          {/* Dual Ratings: Teaching & Proctoring */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Teaching Rating */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Качество преподавания: <span className="text-amber-500 text-sm font-black">{teachingRating} / 5</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTeachingRating(star)}
                    className="p-1 text-slate-300 dark:text-slate-600 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-7 h-7 ${star <= teachingRating ? 'fill-amber-400 text-amber-400' : ''}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Proctoring Rating */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Строгость на сессии / Прокторинг: <span className="text-rose-500 text-sm font-black">{proctoringRating} / 5</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setProctoringRating(star)}
                    className="p-1 text-slate-300 dark:text-slate-600 hover:scale-110 transition-transform"
                  >
                    <ShieldAlert 
                      className={`w-7 h-7 ${star <= proctoringRating ? 'fill-rose-500 text-rose-500' : ''}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Discipline & Grade */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                По какому предмету вели?
              </label>
              <select
                value={selectedDiscipline}
                onChange={e => setSelectedDiscipline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                {prof.disciplines.length > 0 ? (
                  prof.disciplines.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))
                ) : (
                  <option value="Общая дисциплина">Общая дисциплина</option>
                )}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Какую оценку получили на экзамене?
              </label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'Retake (Ретейк)'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Author Name / Group */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Ваша группа или псевдоним (по желанию)
            </label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Например: Студент SE-2408 или Анонимный первокурсник"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Tag Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Выберите подходящие теги преподавателя:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                const meta = tagsMeta[tag];
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{meta?.emoji || '💬'}</span>
                    <span>{tag}</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Подробный отзыв и советы студентам *
            </label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Расскажите, как проходят пары, сложная ли рубежка, палит ли прокторинг, как лучше готовиться..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-rose-500 resize-none leading-relaxed"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRateProfessorModal(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Опубликовать отзыв</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
