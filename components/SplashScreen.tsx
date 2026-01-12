
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#1A2421] flex flex-col items-center justify-center z-50 animate-fade">
      <div className="relative">
        {/* Subtle Moroccan Geometric Frame */}
        <div className="absolute -top-16 -left-16 w-32 h-32 border-t border-l border-[#D4AF37]/20 rounded-tl-[4rem]"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 border-b border-r border-[#D4AF37]/20 rounded-br-[4rem]"></div>
        
        <div className="w-40 h-40 flex items-center justify-center bg-[#D4AF37]/5 rounded-full backdrop-blur-md border border-[#D4AF37]/10 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="currentColor" opacity="0.8" />
                <circle cx="50" cy="50" r="3" fill="#1A2421" />
            </svg>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <h1 className="text-5xl font-amiri font-bold text-[#D4AF37] tracking-tight mb-2">دليل الخير</h1>
        <p className="text-[10px] text-white/40 font-montserrat uppercase tracking-[0.6em]">Premium Muslim Identity</p>
      </div>
      
      <div className="absolute bottom-24 flex flex-col items-center">
        <div className="w-20 h-[1.5px] bg-[#D4AF37]/10 rounded-full mb-4 overflow-hidden">
          <div className="w-1/2 h-full bg-[#D4AF37] animate-[loading_2.5s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-[9px] text-[#D4AF37]/30 font-montserrat uppercase tracking-[0.4em]">Refining Experience</p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;