import React, { useState } from 'react';
import { ArrowLeft, Search, Sparkles, Send, Book } from 'lucide-react';
import { getFiqhGuidance } from '../services/geminiService';

const FiqhScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const result = await getFiqhGuidance(query);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-32 animate-8k">
      <header className="px-8 py-10 flex items-center justify-between">
        <button onClick={onBack} className="w-12 h-12 bg-white border border-[#1B3022]/10 rounded-2xl flex items-center justify-center text-[#1B3022]">
          <ArrowLeft className="w-6 h-6 rtl:-scale-x-100" />
        </button>
        <h2 className="text-2xl font-amiri font-bold text-[#1B3022]">البحث الفقهي</h2>
        <div className="w-12 h-12"></div>
      </header>

      <div className="px-8">
        <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-[#1B3022]/5 flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#1B3022] text-[#D4AF37] rounded-2xl">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="اسأل عن أي مسألة فقهية..." 
            className="flex-1 bg-transparent border-none outline-none font-amiri text-xl placeholder:text-[#1B3022]/20 text-start"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-[#1B3022] disabled:opacity-50"
          >
            <Send size={20} className="rtl:-scale-x-100" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#1B3022]/40">الذكاء الاصطناعي يبحث...</p>
          </div>
        ) : response ? (
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-[#D4AF37]/20 relative overflow-hidden animate-8k text-start">
            <div className="absolute top-0 end-0 p-6 opacity-5">
              <Sparkles size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg">
                  <Book size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">الجواب الشرعي</span>
              </div>
              <p className="text-xl font-amiri leading-loose text-[#1B3022] whitespace-pre-wrap">
                {response}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
             {['ما حكم صلاة المسافر؟', 'كيفية زكاة الذهب؟', 'مبطلات الوضوء؟'].map((hint, i) => (
               <button key={i} onClick={() => { setQuery(hint); }} className="p-6 bg-white border border-[#1B3022]/5 rounded-[1.5rem] text-start text-lg font-amiri text-[#1B3022]/60 hover:border-[#D4AF37]/30 transition-all">
                 {hint}
               </button>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FiqhScreen;