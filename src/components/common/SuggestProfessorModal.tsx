import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, GraduationCap, Check } from 'lucide-react';

interface SuggestProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTMENTS = [
  'Department of Software Engineering',
  'Department of Computer Engineering',
  'Department of Intelligent Technologies',
  'Department of Cybersecurity',
  'Department of Digital Media Technologies',
  'Department of General Education',
  'Department of Economics and Business'
];

const AVATAR_COLORS = [
  '#E11D48', '#2563EB', '#7C3AED', '#059669', 
  '#D97706', '#DB2777', '#4F46E5', '#0D9488'
];

export const SuggestProfessorModal: React.FC<SuggestProfessorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { suggestProfessor } = useApp();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [disciplinesInput, setDisciplinesInput] = useState('');
  const [author, setAuthor] = useState('Студент AITU');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const disciplines = disciplinesInput
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    // Compute initials (e.g. "Ахметов Данияр" -> "АД")
    const parts = name.trim().split(/\s+/);
    const initials = parts.length >= 2 
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.trim().slice(0, 2).toUpperCase();

    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    await suggestProfessor({
      name: name.trim(),
      department,
      disciplines: disciplines.length > 0 ? disciplines : ['Общий курс'],
      initials,
      avatar_bg: randomColor,
      suggested_by: author.trim() || 'Студент AITU'
    });

    setIsSubmitting(false);
    setName('');
    setDisciplinesInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Добавить преподавателя
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Если преподавателя еще нет в общем рейтинге AITU
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              ФИО Преподавателя *
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Касымов Руслан Серикович"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Кафедра / Департамент
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Преподаваемые дисциплины (через запятую)
            </label>
            <input
              type="text"
              value={disciplinesInput}
              onChange={e => setDisciplinesInput(e.target.value)}
              placeholder="Например: Algorithms and Data Structures, Python Basics"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Ваша группа / Автор предложения (по желанию)
            </label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Например: Студент IT-2311"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Добавление...' : 'Добавить в каталог'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
