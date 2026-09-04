import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProfessorCard } from '../catalog/ProfessorCard';
import { 
  BookOpen, 
  Search, 
  Users, 
  Star, 
  ShieldAlert, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';

export const DisciplinesView: React.FC = () => {
  const { disciplines, professors, setActiveProfessorModal, setRateProfessorModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('Design and Analysis of Algorithms');

  // Filter disciplines list
  const filteredDisciplines = useMemo(() => {
    if (!searchQuery.trim()) return disciplines;
    const q = searchQuery.toLowerCase();
    return disciplines.filter(d => d.name.toLowerCase().includes(q));
  }, [disciplines, searchQuery]);

  // Teachers who teach the selected discipline
  const teachersForDiscipline = useMemo(() => {
    return professors
      .filter(p => p.disciplines.includes(selectedDiscipline))
      .sort((a, b) => b.teaching_rating - a.teaching_rating);
  }, [professors, selectedDiscipline]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Гид по регистрации на дисциплины (Add/Drop)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            К кому записаться на предмет?
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Выберите интересующий вас курс и посмотрите рейтинг всех преподавателей, которые его ведут, со сравнением строгости и советами студентов.
          </p>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Disciplines List */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0F172A] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск курса (Calculus, Java, Algorithms)..."
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredDisciplines.map(d => {
              const isSelected = selectedDiscipline === d.name;
              return (
                <button
                  key={d.name}
                  onClick={() => setSelectedDiscipline(d.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="line-clamp-1 pr-2">{d.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                    isSelected 
                      ? 'bg-indigo-800 text-indigo-100' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {d.professorsCount} преп.
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Ranked Professors for Chosen Discipline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-[#0F172A] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Преподаватели курса
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedDiscipline}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ведут <strong>{teachersForDiscipline.length}</strong> преподавателей (отсортированы по оценке студентов)
              </p>
            </div>
          </div>

          {/* List of Teachers */}
          {teachersForDiscipline.length === 0 ? (
            <div className="p-10 text-center bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-500">Нет данных о преподавателях по этой дисциплине</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {teachersForDiscipline.map(prof => (
                <ProfessorCard key={prof.id} professor={prof} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
