
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X, Play, Pause, BookOpen } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { PrayerTime } from '../services/prayerService';

interface AdhanScreenProps {
  prayer: PrayerTime;
  language: Language;
  onDismiss: () => void;
}

const AdhanScreen: React.FC<AdhanScreenProps> = ({ prayer, language, onDismiss }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDua, setShowDua] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = (key: string) => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  };

  useEffect(() => {
    // Moroccan Adhan - Muadhin: Abdelaziz es-Smahri
    const audio = new Audio('https://www.islamcan.com/audio/adhan/azan1.mp3');
    audioRef.current = audio;
    audio.loop = false;
    
    // Attempt auto-play, handle browser policy
    audio.play()
      .then(() => setIsPlaying(true))
      .catch((e) => {
        console.warn("Auto-play blocked, waiting for user gesture", e);
        setIsPlaying(false);
      });

    audio.onended = () => {
      setIsPlaying(false);
      setShowDua(true);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#2E3B23] flex flex-col items-center justify-between py-12 animate-fade overflow-hidden">
      {/* 1. STATIC BACKGROUND (MAKKAH) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Holy Kaaba Makkah" 
        />
        {/* Dark Green Premium Overlay (#2E3B23 at 0.6 opacity) */}
        <div className="absolute inset-0 bg-[#2E3B23]/60 backdrop-blur-[1px]" />
      </div>

      {/* Subtle Branding at Top */}
      <div className="relative z-10 flex flex-col items-center opacity-40">
        <div className="w-6 h-6 mb-2">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#C5A059]">
            <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="currentColor" />
          </svg>
        </div>
        <span className="text-[6px] font-black uppercase tracking-[0.6em] text-white">Dalil Al Khair</span>
      </div>

      {/* 2. CENTRAL UI CLEAN-UP */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-sm px-8">
        {!showDua ? (
          <div className="flex flex-col items-center animate-8k">
            <div className="text-center mb-12">
              <p className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-80">
                {t('adhan_call')}
              </p>
              <h1 className="text-7xl font-amiri font-bold text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                {t(prayer.nameKey)}
              </h1>
              <div className="w-12 h-[1px] bg-[#C5A059]/40 mx-auto mt-6" />
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] mt-4">
                Muadhin: <span className="text-[#C5A059]">Abdelaziz es-Smahri</span>
              </p>
            </div>

            <button 
              onClick={togglePlay}
              className="w-32 h-32 rounded-full border-[5px] border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-[0_0_50px_rgba(197,160,89,0.3)] bg-[#2E3B23]/40 backdrop-blur-xl transition-all active:scale-95 group relative"
            >
              {/* Pulsing Aura when playing */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-[#C5A059]/20 animate-ping -z-10" />
              )}
              <div className="w-full h-full rounded-full border border-[#C5A059]/20 flex items-center justify-center">
                {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} className="ms-2" fill="currentColor" />}
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-[#FDF5E6]/95 backdrop-blur-2xl rounded-[3rem] p-10 border border-[#C5A059]/40 shadow-2xl animate-fade text-center">
            <div className="flex items-center justify-center gap-3 mb-6 text-[#C5A059]">
              <BookOpen size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('dua_after_adhan')}</span>
            </div>
            <p className="text-2xl font-amiri font-bold text-[#2E3B23] leading-relaxed mb-6">
              {t('dua_content')}
            </p>
            <div className="w-8 h-[1px] bg-[#C5A059]/20 mx-auto" />
          </div>
        )}
      </div>

      {/* 3. SECONDARY CONTROLS AT BOTTOM */}
      <div className="relative z-10 w-full flex flex-col items-center gap-8">
        <div className="flex items-center gap-12">
          <button onClick={toggleMute} className="flex flex-col items-center gap-2 group">
            <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white transition-all ${isMuted ? 'bg-white text-[#2E3B23]' : 'bg-white/5 hover:bg-white/10'}`}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </div>
            <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">{t('mute')}</span>
          </button>

          <button onClick={() => setShowDua(!showDua)} className="flex flex-col items-center gap-2 group">
            <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white transition-all ${showDua ? 'bg-[#C5A059] text-[#2E3B23]' : 'bg-white/5 hover:bg-[#C5A059] hover:text-[#2E3B23]'}`}>
              <BookOpen size={18} />
            </div>
            <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">Du'a</span>
          </button>
        </div>

        {/* 4. DISMISS BUTTON */}
        <div className="w-full px-12">
          <button 
            onClick={onDismiss}
            className="w-full py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-[#2E3B23] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <X size={14} />
            {t('dismiss')}
          </button>
        </div>
      </div>

      <style>{`
        .animate-fade { animation: fade-in 1s ease-out forwards; }
        .animate-8k { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdhanScreen;