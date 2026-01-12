
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, MoreVertical, Plus } from 'lucide-react';
import { Gender, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface DailyPlanProps {
  gender: Gender;
  language: Language;
  onBack: () => void;
}

const DailyPlan: React.FC<DailyPlanProps> = ({ gender, language, onBack }) => {
  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  const [tasks, setTasks] = useState([
    { id: 1, textKey: 'task_fajr', completed: true },
    { id: 2, textKey: 'task_mulk', completed: false },
    { id: 3, textKey: 'task_istighfar', completed: true },
    { id: 4, textKey: 'task_witr', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-white p-8 pb-32 animate-8k text-start">
      <header className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <ArrowLeft className="w-6 h-6 rtl:-scale-x-100" />
        </button>
        <h2 className="text-2xl font-black font-amiri">{t('daily_plan')}</h2>
        <button className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <MoreVertical className="w-6 h-6" />
        </button>
      </header>

      {/* Progress Section */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div className="text-start">
            <p className="text-xs text-[#D4AF37] font-black uppercase tracking-widest mb-1">{t('daily_progress')}</p>
            <h3 className="text-3xl font-black">{completedCount} {t('out_of')} {tasks.length}</h3>
          </div>
          <span className="text-3xl font-montserrat font-black opacity-20">{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#1B3022] transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <button 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`w-full flex items-center justify-between p-8 rounded-[2.5rem] border transition-all ${task.completed ? 'bg-gray-50 border-transparent opacity-50' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <span className={`text-xl font-bold font-amiri ${task.completed ? 'line-through text-gray-400' : 'text-[#1B3022]'}`}>{t(task.textKey)}</span>
            <div className={`transition-all ${task.completed ? 'text-[#D4AF37]' : 'text-gray-200'}`}>
              {task.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
            </div>
          </button>
        ))}
      </div>

      <button className="fixed bottom-32 start-1/2 -translate-x-1/2 w-16 h-16 bg-[#D4AF37] text-[#1B3022] rounded-full flex items-center justify-center shadow-2xl shadow-[#D4AF37]/30 border-4 border-white">
        <Plus size={32} />
      </button>
    </div>
  );
};

export default DailyPlan;
