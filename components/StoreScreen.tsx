
import React from 'react';
import { ArrowLeft, ShoppingBag, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, COLORS } from '../constants';

const products = [
  { id: 1, nameKey: 'product_mat', price: '450 DH', image: 'https://picsum.photos/seed/prayer/400/500' },
  { id: 2, nameKey: 'product_quran', price: '320 DH', image: 'https://picsum.photos/seed/quran/400/500' },
  { id: 3, nameKey: 'product_oud', price: '180 DH', image: 'https://picsum.photos/seed/oud/400/500' },
  { id: 4, nameKey: 'product_tasbih', price: '120 DH', image: 'https://picsum.photos/seed/tasbih/400/500' },
];

const StoreScreen: React.FC<{ language: Language, onBack: () => void }> = ({ language, onBack }) => {
  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-44 animate-8k text-start overflow-y-auto">
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 bg-[#F5F5F5]/80 backdrop-blur-xl z-30">
        <button onClick={onBack} className="w-11 h-11 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-[#2E3B23] shadow-sm">
          <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
        </button>
        <h2 className="text-xl font-amiri font-bold text-[#2E3B23]">{t('royal_store')}</h2>
        <div className="w-11 h-11 bg-[#2E3B23] text-[#C5A059] rounded-2xl flex items-center justify-center shadow-lg border border-[#C5A059]/20">
          <ShoppingBag size={18} />
        </div>
      </header>

      <div className="px-8 grid grid-cols-2 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="h-44 bg-gray-50 relative overflow-hidden">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={t(p.nameKey)} />
              <div className="absolute top-3 start-3 bg-[#C5A059] text-white px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest shadow-md">
                {t('artisanat')}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-base font-amiri font-bold text-[#2E3B23] mb-1 leading-tight">{t(p.nameKey)}</h3>
              <p className="text-xs font-montserrat font-black text-[#C5A059] mb-4">{p.price}</p>
              <a 
                href={`https://wa.me/212000000?text=I would like to order ${t(p.nameKey)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#2E3B23] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest shadow-lg hover:bg-[#C5A059] transition-colors"
              >
                <MessageCircle size={12} />
                {t('order_whatsapp')}
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 px-8 flex flex-col items-center">
         <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-3">
            <span className="text-[#C5A059] font-amiri font-bold">ص</span>
         </div>
         <p className="text-[8px] font-black text-black/10 uppercase tracking-[0.4em]">Dalil Al Khair Boutique Royale</p>
      </div>
    </div>
  );
};

export default StoreScreen;