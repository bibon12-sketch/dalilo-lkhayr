
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, Bell, Volume2, Settings2, Compass, MapPin, ChevronRight, Share2, Info, MapPinOff, RefreshCw, AlertCircle, Play } from 'lucide-react';
import { PrayerService, PrayerTime, Coordinates, CalcMethod } from '../services/prayerService';
import { Language } from '../types';
import { TRANSLATIONS, COLORS } from '../constants';

interface PrayerScreenProps {
  onBack: () => void;
  language?: Language;
  onSimulateAdhan?: (prayer: PrayerTime) => void;
}

const PrayerScreen: React.FC<PrayerScreenProps> = ({ onBack, language = 'ar', onSimulateAdhan }) => {
  const [now, setNow] = useState(new Date());
  const [heading, setHeading] = useState(0);
  const [showQibla, setShowQibla] = useState(false);
  const [cityName, setCityName] = useState('Eysines');
  const [calcMethod, setCalcMethod] = useState<CalcMethod>('UOIF');
  const [locationError, setLocationError] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  
  const [coords, setCoords] = useState<Coordinates>(() => {
    const saved = localStorage.getItem('last_known_location');
    return saved ? JSON.parse(saved) : PrayerService.DEFAULT_COORDS;
  });

  const lastUpdateCoords = useRef<Coordinates>(coords);
  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  const updateLocationInfo = async (newCoords: Coordinates) => {
    const info = await PrayerService.getLocationInfo(newCoords);
    setCityName(info.city);
    setCalcMethod(info.method);
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newCoords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          const distance = PrayerService.calculateDistance(lastUpdateCoords.current, newCoords);
          if (distance > 5 || cityName === 'Eysines') {
            await updateLocationInfo(newCoords);
            lastUpdateCoords.current = newCoords;
          }
          setCoords(newCoords);
          setLocationError(false);
          localStorage.setItem('last_known_location', JSON.stringify(newCoords));
        },
        () => setLocationError(true),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocationError(true);
    }
  };

  useEffect(() => {
    requestLocation();
    const locInterval = setInterval(requestLocation, 600000);
    return () => clearInterval(locInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const qiblaAngle = useMemo(() => PrayerService.calculateQibla(coords), [coords]);
  const isAligned = useMemo(() => {
    const diff = Math.abs(heading - qiblaAngle);
    return Math.min(diff, 360 - diff) < 3;
  }, [heading, qiblaAngle]);

  useEffect(() => {
    if (isAligned && navigator.vibrate) navigator.vibrate(50);
  }, [isAligned]);

  const handleToggleQibla = async () => {
    if (!showQibla && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        await (DeviceOrientationEvent as any).requestPermission();
      } catch (e) { console.error(e); }
    }
    setShowQibla(!showQibla);
  };

  useEffect(() => {
    if (showQibla) {
      const handler = (e: any) => {
        if (e.webkitCompassHeading !== undefined) setHeading(e.webkitCompassHeading);
        else if (e.alpha !== null) setHeading(360 - e.alpha);
      };
      const win = window as any;
      const evt = 'ondeviceorientationabsolute' in win ? 'deviceorientationabsolute' : 'deviceorientation';
      win.addEventListener(evt, handler);
      return () => win.removeEventListener(evt, handler);
    }
  }, [showQibla]);

  const prayers = useMemo(() => PrayerService.getPrayerTimes(now, coords, calcMethod), [now.toDateString(), coords, calcMethod]);
  const currentPrayer = useMemo(() => PrayerService.getCurrentPrayer(prayers, now), [prayers, now]);
  const nextPrayer = useMemo(() => PrayerService.getNextPrayer(prayers, now, coords, calcMethod), [prayers, now, coords, calcMethod]);

  const adjustedDiff = useMemo(() => {
    const diff = nextPrayer.date.getTime() - now.getTime();
    return diff > 0 ? diff : diff + 24 * 60 * 60 * 1000;
  }, [nextPrayer.date, now]);

  const h = Math.floor(adjustedDiff / 3600000);
  const m = Math.floor((adjustedDiff % 3600000) / 60000);
  const s = Math.floor((adjustedDiff % 60000) / 1000);
  const countdownStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  const progress = (1 - (adjustedDiff / (24 * 60 * 60 * 1000))) * 100;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-44 animate-8k relative overflow-y-auto">
      <header className="px-8 py-8 flex items-center justify-between sticky top-0 bg-[#F5F5F5]/80 backdrop-blur-xl z-30">
        <button onClick={onBack} className="w-11 h-11 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-black shadow-sm active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-amiri font-bold text-[#2E3B23]">{t('prayer_times')}</h2>
          <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest opacity-60">{cityName}</p>
        </div>
        <button className="w-11 h-11 bg-[#2E3B23] rounded-2xl flex items-center justify-center text-[#C5A059] shadow-lg border border-[#C5A059]/20">
          <Settings2 className="w-5 h-5" />
        </button>
      </header>

      {locationError && (
        <div className="mx-8 mb-6 p-4 bg-[#FDF5E6] border border-[#C5A059]/20 rounded-3xl animate-fade flex items-start gap-4 shadow-sm">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#C5A059] flex-shrink-0 shadow-sm"><MapPinOff size={16} /></div>
          <div className="flex-1">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-1">{t('location_denied')}</h3>
             <p className="text-[10px] font-amiri text-[#2E3B23]/60 leading-tight mb-2">{t('enable_location_prompt')}</p>
             <button onClick={requestLocation} className="flex items-center gap-2 px-3 py-1.5 bg-[#C5A059] text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all"><RefreshCw size={10} />{t('retry')}</button>
          </div>
        </div>
      )}

      {/* Main Countdown - 20% Smaller with refined ring */}
      <div className="px-8 py-4 flex flex-col items-center justify-center relative">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-black/5 scale-[1.08]"></div>
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="112" cy="112" r="104" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-black/5" />
            <circle cx="112" cy="112" r="104" stroke="currentColor" strokeWidth="4" strokeDasharray={2 * Math.PI * 104} strokeDashoffset={(2 * Math.PI * 104) * (1 - progress / 100)} strokeLinecap="round" fill="transparent" className="text-[#C5A059] drop-shadow-[0_0_8px_rgba(197,160,89,0.4)] transition-all duration-1000" />
          </svg>
          <div className="text-center z-10 flex flex-col items-center p-4">
            <h3 className="text-xl font-amiri font-bold text-[#2E3B23] leading-none mb-1">{t(nextPrayer.nameKey)}</h3>
            <span className="text-[8px] font-black text-[#C5A059] tracking-[0.2em] uppercase opacity-70 mb-2">{t('in')} {h}H {m}M</span>
            <h1 className="text-4xl font-montserrat font-black text-[#2E3B23] tracking-tighter leading-none">{countdownStr}</h1>
            <div className="mt-4 bg-[#2E3B23] px-4 py-1.5 rounded-full shadow-lg border border-[#C5A059]/30 flex items-center gap-2">
               <Bell size={10} className="text-[#C5A059]" />
               <span className="text-[10px] font-bold text-white font-amiri">{nextPrayer.time}</span>
            </div>
          </div>
        </div>

        {/* Qibla / Method Area - Increased symmetric padding */}
        <div className="mt-14 flex items-center gap-8 px-6 py-2">
           <button onClick={handleToggleQibla} className={`px-6 py-3 rounded-full flex items-center gap-3 border transition-all duration-500 ${showQibla ? 'bg-[#2E3B23] border-[#2E3B23] text-[#C5A059] shadow-xl' : 'bg-white border-black/5 text-black'}`}>
              <Compass size={16} className={showQibla ? 'animate-spin-slow' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('qibla')}</span>
           </button>
           <div className="w-[1px] h-6 bg-black/10"></div>
           <div className="text-start">
              <p className="text-[8px] font-black text-black/30 uppercase tracking-widest mb-0.5">{t('calc_method')}</p>
              <p className="text-[10px] font-bold text-[#2E3B23]">{cityName} • {calcMethod === 'UOIF' ? 'UOIF (12°)' : calcMethod === 'Morocco' ? 'Awqaf (19°)' : 'MWL (18°)'}</p>
           </div>
        </div>
      </div>

      {showQibla && (
        <div className="px-8 mt-4 mb-8 animate-fade">
           <div className="bg-[#2E3B23] rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col items-center justify-center border border-[#C5A059]/20 shadow-2xl zellij-pattern">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l15 15-15 15-15-15L30 0zm0 60l15-15-15-15-15 15 15 15zM0 30l15 15 15-15-15-15L0 30zm60 0l-15 15-15-15 15-15 15 15z\' fill=\'%23C5A059\' fill-opacity=\'1\'/%3E%3C/svg%3E")'}}></div>
              <div className="absolute top-4 start-8"><button onClick={() => setShowCalibration(!showCalibration)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A059]"><Info size={14} /></button></div>
              {showCalibration && <div className="absolute top-16 left-8 right-8 z-20 bg-white rounded-xl p-3 shadow-2xl animate-fade flex items-center gap-3"><AlertCircle size={16} className="text-[#C5A059]" /><p className="text-[9px] font-bold text-[#2E3B23]">{t('calibrate_info')}</p></div>}
              <div className="relative w-44 h-44 rounded-full border-2 border-white/5 flex items-center justify-center shadow-inner bg-black/5">
                 <div className="absolute inset-0 transition-transform duration-500 ease-out" style={{ transform: `rotate(${-heading}deg)` }}>
                    {[0, 90, 180, 270].map(deg => (<div key={deg} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${deg}deg)` }}><span className={`text-[8px] font-black mb-36 ${deg === 0 ? 'text-[#C5A059]' : 'text-white/20'}`}>{deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}</span></div>))}
                 </div>
                 <div className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${isAligned ? 'border-[#4ADE80] scale-105 shadow-[0_0_20px_rgba(74,222,128,0.2)]' : 'border-transparent'}`}></div>
                 <div className="w-40 h-40 relative transition-transform duration-500 ease-out" style={{ transform: `rotate(${qiblaAngle - heading}deg)` }}>
                    <div className="absolute inset-0 flex items-center justify-center"><div className={`w-1 h-full rounded-full transition-colors duration-700 ${isAligned ? 'bg-gradient-to-b from-[#4ADE80] to-transparent' : 'bg-gradient-to-b from-[#C5A059] to-transparent'}`}></div></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#2E3B23] shadow-lg transition-all duration-700 ${isAligned ? 'bg-[#4ADE80]' : 'bg-[#C5A059]'}`}><Compass size={14} className={isAligned ? 'text-black' : 'text-white'} /></div></div>
                 </div>
              </div>
              <div className="mt-8 text-center">{isAligned ? (<p className="text-[10px] font-amiri font-bold text-[#4ADE80] tracking-widest animate-pulse">{t('facing_qibla')}</p>) : (<p className="text-[9px] font-amiri text-white/40 tracking-widest">{t('qibla')} : {Math.round(qiblaAngle)}°</p>)}</div>
           </div>
        </div>
      )}

      <div className="px-8 mt-10 space-y-3">
        {prayers.map((prayer) => {
          const isActive = prayer.id === currentPrayer.id;
          return (
            <div 
              key={prayer.id} 
              onClick={() => onSimulateAdhan?.(prayer)}
              className={`group relative flex items-center justify-between p-6 transition-all duration-700 rounded-[2rem] border cursor-pointer ${isActive ? 'bg-[#FDF5E6] border-[#C5A059]/40 shadow-xl z-20 scale-105' : 'bg-white border-black/5 shadow-sm active:bg-gray-50'}`}
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-[#2E3B23] text-[#C5A059] shadow-lg' : 'bg-gray-50 text-black/10 group-hover:bg-[#2E3B23] group-hover:text-[#C5A059]'}`}>
                  {isActive ? <Volume2 size={20} /> : <Play size={18} fill="currentColor" className="opacity-40" />}
                </div>
                <div>
                  <h4 className={`text-xl font-amiri font-bold ${isActive ? 'text-[#2E3B23]' : 'text-black/30'}`}>{t(prayer.nameKey)}</h4>
                  <p className="text-[7px] font-black tracking-widest opacity-20 uppercase">{language === 'en' ? prayer.nameKey : 'Salat'}</p>
                </div>
              </div>
              <div className="text-end relative z-10"><p className={`text-2xl font-montserrat font-black tracking-tighter ${isActive ? 'text-[#2E3B23]' : 'text-black/10'}`}>{prayer.time}</p></div>
            </div>
          );
        })}
      </div>

      <div className="px-8 mt-10 grid grid-cols-3 gap-4">
        {[{ icon: <Volume2 size={18} />, label: 'Athan' }, { icon: <Share2 size={18} />, label: 'Share' }, { icon: <Info size={18} />, label: 'Info' }].map((action, idx) => (
          <button key={idx} className="bg-white border border-black/5 p-4 rounded-3xl flex flex-col items-center gap-2 shadow-sm hover:shadow-lg hover:bg-gray-50 transition-all group">
            <div className="text-[#C5A059] group-hover:scale-110 transition-transform">{action.icon}</div>
            <span className="text-[8px] font-black uppercase tracking-widest text-black/40">{action.label}</span>
          </button>
        ))}
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default PrayerScreen;
