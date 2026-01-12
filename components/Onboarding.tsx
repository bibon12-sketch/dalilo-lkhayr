
import React from 'react';
import { User, UserCheck } from 'lucide-react';
import { Gender, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface OnboardingProps {
  language: Language;
  onSelect: (gender: Gender) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ language, onSelect }) => {
  const t = (key: string) => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-8 text-[#1B3022] animate-fade">
      <div className="max-w-md w-full text-center space-y-16">
        <div className="space-y-6">
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full opacity-30"></div>
          <h2 className="text-4xl font-amiri font-bold">{t('onboarding_welcome')}</h2>
          <p className="text-base text-[#1B3022]/60 font-medium max-w-[280px] mx-auto">{t('onboarding_sub')}</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <button 
            onClick={() => onSelect('brother')}
            className="group flex flex-col items-center gap-6 p-10 rounded-[3rem] bg-white hover:bg-[#1B3022] transition-all duration-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-[#1B3022]/20 border border-white hover:border-[#1B3022]"
          >
            <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1B3022] group-hover:bg-[#D4AF37] group-hover:text-[#1B3022] transition-all duration-500 shadow-inner">
              <User className="w-11 h-11" />
            </div>
            <span className="text-xl font-amiri font-bold group-hover:text-white transition-colors">{t('onboarding_brother')}</span>
          </button>

          <button 
            onClick={() => onSelect('sister')}
            className="group flex flex-col items-center gap-6 p-10 rounded-[3rem] bg-white hover:bg-[#1B3022] transition-all duration-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-[#1B3022]/20 border border-white hover:border-[#1B3022]"
          >
            <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1B3022] group-hover:bg-[#D4AF37] group-hover:text-[#1B3022] transition-all duration-500 shadow-inner">
              <UserCheck className="w-11 h-11" />
            </div>
            <span className="text-xl font-amiri font-bold group-hover:text-white transition-colors">{t('onboarding_sister')}</span>
          </button>
        </div>

        <p className="text-[10px] text-[#1B3022]/30 uppercase tracking-[0.5em] font-montserrat font-bold">{t('excellence_simplicity')}</p>
      </div>
    </div>
  );
};

export default Onboarding;
