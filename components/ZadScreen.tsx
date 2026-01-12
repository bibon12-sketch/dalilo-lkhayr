
import React, { useState, useEffect, useRef } from 'react';
import { Share2, Bookmark, Volume2, VolumeX, Play, Pause, Heart } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { Recitation, Language } from '../types';
import { TRANSLATIONS, COLORS } from '../constants';

const ZadScreen: React.FC<{ language: Language }> = ({ language }) => {
  const [recitations, setRecitations] = useState<Recitation[]>([]);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  useEffect(() => {
    supabaseService.getRecitations().then(setRecitations);
  }, []);

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative">
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {recitations.map((rec) => (
          <VideoItem 
            key={rec.id} 
            recitation={rec} 
            language={language} 
            muted={muted}
            onToggleMute={() => setMuted(!muted)}
          />
        ))}
      </div>
      
      {muted && (
        <button 
          onClick={() => setMuted(false)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full text-white/90 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse z-[100] border border-white/10"
        >
          <VolumeX size={14} /> Tap to Unmute
        </button>
      )}
    </div>
  );
};

const VideoItem: React.FC<{ 
  recitation: Recitation; 
  language: Language; 
  muted: boolean;
  onToggleMute: () => void;
}> = ({ recitation, language, muted, onToggleMute }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.6 });
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) { videoRef.current.play().catch(() => {}); setPlaying(true); } 
      else { videoRef.current.pause(); setPlaying(false); }
    }
  }, [isVisible]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
      setPlaying(!playing);
    }
  };

  return (
    <div className="h-screen w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
      <video ref={videoRef} src={recitation.video_url} className="h-full w-full object-cover" loop muted={muted} playsInline onClick={togglePlay} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute bottom-44 left-8 right-24 text-start z-10 pointer-events-none animate-fade">
        <h3 className="text-3xl font-amiri font-bold text-white mb-2 drop-shadow-xl">
          {language === 'ar' ? recitation.reciter_ar : recitation.reciter_en}
        </h3>
        <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em] drop-shadow-md">
          {language === 'ar' ? recitation.surah_ar : recitation.surah_en}
        </p>
      </div>

      {/* Action Buttons Right Side */}
      <div className="absolute bottom-44 right-6 flex flex-col items-center gap-8 z-20">
        <button onClick={onToggleMute} className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform">
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/20 group-hover:bg-[#C5A059] group-hover:text-[#2E3B23] transition-all">
            <Heart size={24} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Like</span>
        </button>
        <button className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center text-white border border-white/20 group-hover:bg-[#C5A059] group-hover:text-[#2E3B23] transition-all">
            <Share2 size={24} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Share</span>
        </button>
      </div>

      {!playing && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30"><Play size={100} fill="white" className="text-white" /></div>}
    </div>
  );
};

export default ZadScreen;
