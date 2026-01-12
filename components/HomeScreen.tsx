
import React, { useState } from 'react';
import { HOME_CARDS, TRANSLATIONS, COLORS } from '../constants';
import { AppState, Gender, Language } from '../types';
import { Bell, User, Heart, ArrowUpRight, Settings, X, Globe, CheckCircle2, Circle, ShoppingBag, ChevronRight } from 'lucide-react';

interface HomeScreenProps {
  gender: Gender;
  language: Language;
  onNavigate: (state: AppState) => void;
  setGender: (g: Gender) => void;
  setLanguage: (l: Language) => void;
}

const FEATURED_PRODUCTS = [
  { id: 1, nameKey: 'product_mat', price: '450 DH', image: 'https://picsum.photos/seed/prayer/400/500' },
  { id: 2, nameKey: 'product_quran', price: '320 DH', image: 'https://picsum.photos/seed/quran/400/500' },
  { id: 3, nameKey: 'product_oud', price: '180 DH', image: 'https://picsum.photos/seed/oud/400/500' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ gender, language, onNavigate, setGender, setLanguage }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, textKey: 'task_fajr', completed: true },
    { id: 2, textKey: 'task_mulk', completed: false },
    { id: 3, textKey: 'task_istighfar', completed: true },
    { id: 4, textKey: 'task_witr', completed: false },
  ]);
  
  const t = (key: string) => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  };

  const greeting = t(gender === 'sister' ? 'greeting_sister' : 'greeting_brother');

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-32 animate-8k overflow-y-auto relative text-start">
      <header className="px-8 py-10 flex items-center justify-between">
        <button onClick={() => setShowProfile(true)} className="flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-black/5 shadow-sm active:scale-95 transition-transform">
            <User className="w-7 h-7 text-[#2E3B23]" />
          </div>
          <div>
            <h2 className="text-xl font-amiri font-bold text-[#2E3B23] mb-0.5">{greeting}</h2>
            <p className="text-[8px] text-[#C5A059] font-black uppercase tracking-widest opacity-80">15 Ramadan 1446 • Morocco</p>
          </div>
        </button>
        <button className="w-12 h-12 rounded-2xl bg-[#2E3B23] flex items-center justify-center text-[#C5A059] shadow-xl border border-[#C5A059]/20 transition-transform active:scale-90">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Daily Progress Checklist - High Prominence */}
      <div className="px-8 mb-10">
        <div className="bg-[#FDF5E6] border border-[#C5A059]/20 rounded-[2.5rem] p-7 shadow-sm">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[9px] text-[#C5A059] font-black uppercase tracking-widest mb-1">{t('daily_progress')}</p>
              <h3 className="text-2xl font-amiri font-bold text-[#2E3B23]">{completedCount} {t('out_of')} {tasks.length}</h3>
            </div>
            <span className="text-2xl font-montserrat font-black text-[#C5A059]/20">{percentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-[#2E3B23] transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="space-y-2">
            {tasks.map(task => (
              <button key={task.id} onClick={() => toggleTask(task.id)} className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${task.completed ? 'bg-white/30' : 'bg-white shadow-sm'}`}>
                <span className={`text-sm font-bold font-amiri ${task.completed ? 'line-through text-black/20' : 'text-[#2E3B23]'}`}>{t(task.textKey)}</span>
                <div className={`transition-all ${task.completed ? 'text-[#C5A059]' : 'text-black/5'}`}>
                  {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wisdom Card */}
      <div className="px-8 mb-10">
        <div className="bg-[#2E3B23] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-[#C5A059]/20 mihrab-arch">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">{t('daily_wisdom')}</span>
              <Heart className="w-3 h-3 text-[#C5A059]" />
            </div>
            <p className="text-2xl font-amiri font-bold leading-relaxed mb-8 border-s-2 border-[#C5A059]/40 ps-6">
              {language === 'ar' ? '"العلم صيدٌ والكتابة قيدُه، فقيِّد صيدك بالحبال الواثقة."' : language === 'fr' ? '"La science est un gibier et l\'écriture en est le lien, alors liez votre gibier avec des cordes solides."' : '"Knowledge is a hunt, and writing is its fetter, so tie your catch with strong ropes."'}
            </p>
            <div className="flex justify-between items-end">
              <span className="text-[8px] opacity-40 uppercase tracking-widest font-bold">{t('spiritual_heritage')}</span>
              <button className="w-12 h-12 rounded-xl bg-[#C5A059] text-[#2E3B23] flex items-center justify-center shadow-lg transform active:scale-95 transition-all"><ArrowUpRight className="w-6 h-6 rtl:-scale-x-100" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Essential Services Grid */}
      <div className="px-8 mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-black/20 mb-6">{t('essential_services')}</h3>
        <div className="grid grid-cols-2 gap-6">
          {HOME_CARDS.slice(0, 4).map((card) => (
            <button key={card.id} onClick={() => onNavigate(card.id as AppState)} className="bg-white border border-black/5 rounded-[2.2rem] p-8 text-start group shadow-sm hover:shadow-xl transition-all active:scale-95">
              {/* Added React.isValidElement and cast to React.ReactElement<any> to fix size prop error */}
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-[#2E3B23] group-hover:text-white transition-all duration-500">
                {React.isValidElement(card.icon) && React.cloneElement(card.icon as React.ReactElement<any>, { size: 22 })}
              </div>
              <h4 className="text-xl font-amiri font-bold text-[#2E3B23] mb-0.5">{t(card.titleKey)}</h4>
              <p className="text-[8px] font-bold text-[#C5A059] uppercase tracking-widest opacity-60">{t(card.subtitleKey)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Shop Slider (Featured Products) */}
      <div className="mb-10">
        <div className="px-8 flex justify-between items-center mb-6">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-black/20">{t('shop_featured')}</h3>
           <button onClick={() => onNavigate(AppState.STORE)} className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest flex items-center gap-1">
             {t('all')} <ChevronRight size={12} className="rtl:-scale-x-100" />
           </button>
        </div>
        <div className="flex overflow-x-auto gap-6 px-8 no-scrollbar pb-4">
          {FEATURED_PRODUCTS.map(p => (
            <button key={p.id} onClick={() => onNavigate(AppState.STORE)} className="min-w-[200px] bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm active:scale-95 transition-transform flex-shrink-0">
               <div className="h-32 bg-gray-50"><img src={p.image} className="w-full h-full object-cover opacity-80" alt="" /></div>
               <div className="p-5">
                  <h4 className="text-base font-amiri font-bold text-[#2E3B23]">{t(p.nameKey)}</h4>
                  <p className="text-xs font-bold text-[#C5A059]">{p.price}</p>
               </div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile/Settings Bottom Sheet */}
      {showProfile && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 animate-fade">
          <div className="absolute inset-0 bg-[#2E3B23]/40 backdrop-blur-sm" onClick={() => setShowProfile(false)}></div>
          <div className="w-full max-w-md bg-white rounded-[3rem] p-8 shadow-2xl relative z-10 animate-fade">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-amiri font-bold text-[#2E3B23]">{language === 'ar' ? 'الإعدادات' : 'Settings'}</h3>
              <button onClick={() => setShowProfile(false)} className="p-2 bg-gray-50 rounded-xl text-black/20 hover:text-black"><X size={20} /></button>
            </div>
            <div className="space-y-8">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-black/20 block mb-4">{t('home')}</span>
                <div className="flex gap-3">
                  {(['ar', 'fr', 'en'] as Language[]).map(l => (
                    <button key={l} onClick={() => setLanguage(l)} className={`flex-1 py-3 rounded-xl border transition-all font-bold text-[10px] uppercase tracking-widest ${language === l ? 'bg-[#2E3B23] text-white' : 'bg-white border-gray-100 text-black/40'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
