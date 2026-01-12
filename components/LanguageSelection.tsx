
import React from 'react';
import { Language } from '../types';
import { Globe } from 'lucide-react';

interface LanguageSelectionProps {
  onSelect: (lang: Language) => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onSelect }) => {
  const languages = [
    { id: 'ar' as Language, name: 'العربية', sub: 'Arabic', flag: '🇲🇦' },
    { id: 'fr' as Language, name: 'Français', sub: 'French', flag: '🇫🇷' },
    { id: 'en' as Language, name: 'English', sub: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-8 animate-fade">
      <div className="w-full max-w-md text-center">
        {/* Header Section */}
        <div className="mb-16 space-y-4">
          <div className="w-20 h-20 bg-[#1B3022] rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-[#1B3022]/20 border border-[#D4AF37]/30">
            <Globe className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-amiri font-bold text-[#1B3022]">اختر اللغة</h2>
            <h2 className="text-xl font-montserrat font-bold text-[#1B3022]/60 uppercase tracking-widest">Choose Language</h2>
            <h2 className="text-lg font-montserrat font-medium text-[#1B3022]/40 italic">Choisir la Langue</h2>
          </div>
        </div>

        {/* Buttons List */}
        <div className="space-y-6">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className="w-full group relative flex items-center justify-between p-6 bg-white border border-[#D4AF37]/20 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all duration-500 overflow-hidden"
            >
              {/* Subtle background zellij on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm20 20h20v20H20V20z\' fill=\'%23D4AF37\' fill-opacity=\'1\'/%3E%3C/svg%3E")'}}></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <span className="text-3xl filter grayscale-[0.2] group-hover:grayscale-0 transition-all">{lang.flag}</span>
                <div className="text-right">
                  <span className={`block text-2xl font-bold transition-colors ${lang.id === 'ar' ? 'font-amiri text-right' : 'font-montserrat'} text-[#1B3022]`}>
                    {lang.name}
                  </span>
                  <span className="block text-[10px] font-montserrat font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-60">
                    {lang.sub}
                  </span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#1B3022] group-hover:border-[#1B3022] transition-all duration-500">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
              </div>
            </button>
          ))}
        </div>

        {/* Decorative element */}
        <div className="mt-20">
          <p className="text-[9px] text-[#1B3022]/30 font-montserrat font-bold uppercase tracking-[0.6em]">Premium Muslim Companion</p>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-4 opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
