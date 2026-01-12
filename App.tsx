
import React, { useState, useEffect } from 'react';
import { AppState, Gender, Language } from './types';
import SplashScreen from './components/SplashScreen';
import LanguageSelection from './components/LanguageSelection';
import Onboarding from './components/Onboarding';
import HomeScreen from './components/HomeScreen';
import ZadScreen from './components/ZadScreen';
import PrayerScreen from './components/PrayerScreen';
import DiscoverScreen from './components/DiscoverScreen';
import FiqhScreen from './components/FiqhScreen';
import StoreScreen from './components/StoreScreen';
import AdhanScreen from './components/AdhanScreen';
import { TRANSLATIONS, COLORS } from './constants';
import { Home, Clock, Compass, PlayCircle, ShoppingBag } from 'lucide-react';
import { PrayerService } from './services/prayerService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SPLASH);
  const [gender, setGender] = useState<Gender>(null);
  const [language, setLanguage] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<AppState>(AppState.HOME);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeAdhan, setActiveAdhan] = useState<any>(null);

  useEffect(() => {
    if (appState === AppState.SPLASH) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setAppState(AppState.LANGUAGE_SELECTION);
          setIsTransitioning(false);
        }, 600);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const t = (key: string) => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  };

  const triggerAdhan = (prayer: any) => {
    setActiveAdhan(prayer);
    setAppState(AppState.ADHAN);
  };

  const handleLanguageSelect = (lang: Language) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLanguage(lang);
      setAppState(AppState.ONBOARDING);
      setIsTransitioning(false);
    }, 400);
  };

  const handleOnboardingSelect = (g: Gender) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGender(g);
      setAppState(AppState.HOME);
      setActiveTab(AppState.HOME);
      setIsTransitioning(false);
    }, 600);
  };

  const renderMainContent = () => {
    if (appState === AppState.ADHAN && activeAdhan) {
      return (
        <AdhanScreen 
          prayer={activeAdhan} 
          language={language} 
          onDismiss={() => {
            setAppState(AppState.HOME);
            setActiveTab(AppState.PRAYER);
            setActiveAdhan(null);
          }} 
        />
      );
    }

    // Only render tabs when in HOME app state
    if (appState !== AppState.HOME && appState !== AppState.ADHAN) return null;

    switch (activeTab) {
      case AppState.HOME: 
        return <HomeScreen 
          gender={gender} 
          language={language} 
          onNavigate={setActiveTab} 
          setGender={setGender} 
          setLanguage={setLanguage} 
        />;
      case AppState.ZAD: return <ZadScreen language={language} />;
      case AppState.PRAYER: return (
        <PrayerScreen 
          onBack={() => setActiveTab(AppState.HOME)} 
          language={language} 
          onSimulateAdhan={triggerAdhan} 
        />
      );
      case AppState.NEARBY: return <DiscoverScreen language={language} />;
      case AppState.FIQH: return <FiqhScreen onBack={() => setActiveTab(AppState.HOME)} />;
      case AppState.STORE: return <StoreScreen language={language} onBack={() => setActiveTab(AppState.HOME)} />;
      default: return <HomeScreen gender={gender} language={language} onNavigate={setActiveTab} setGender={setGender} setLanguage={setLanguage} />;
    }
  };

  const showNav = appState === AppState.HOME;
  const isZadActive = activeTab === AppState.ZAD;
  const isRtl = language === 'ar';

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`max-w-md mx-auto min-h-screen bg-[#F5F5F5] relative shadow-2xl overflow-hidden transition-opacity duration-500 zellij-overlay ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
    >
      {appState === AppState.SPLASH && <SplashScreen />}
      {appState === AppState.LANGUAGE_SELECTION && <LanguageSelection onSelect={handleLanguageSelect} />}
      {appState === AppState.ONBOARDING && <Onboarding language={language} onSelect={handleOnboardingSelect} />}
      {renderMainContent()}

      {showNav && (
        <nav className={`fixed bottom-0 start-1/2 -translate-x-1/2 w-full max-w-md backdrop-blur-2xl border-t px-6 pb-10 pt-4 flex justify-between items-center z-50 transition-colors duration-500 ${isZadActive ? 'bg-black/40 border-white/10' : 'bg-[#F5F5F5]/90 border-black/5'}`}>
          <NavItem active={activeTab === AppState.HOME} onClick={() => setActiveTab(AppState.HOME)} icon={<Home />} label={t('home')} isZadActive={isZadActive} />
          <NavItem active={activeTab === AppState.PRAYER} onClick={() => setActiveTab(AppState.PRAYER)} icon={<Clock />} label={t('prayer')} isZadActive={isZadActive} />
          <NavItem active={activeTab === AppState.NEARBY} onClick={() => setActiveTab(AppState.NEARBY)} icon={<Compass />} label={t('discover')} isCenter isZadActive={isZadActive} />
          <NavItem active={activeTab === AppState.STORE} onClick={() => setActiveTab(AppState.STORE)} icon={<ShoppingBag />} label={t('store')} isZadActive={isZadActive} />
          <NavItem active={activeTab === AppState.ZAD} onClick={() => setActiveTab(AppState.ZAD)} icon={<PlayCircle />} label={t('zad')} isZadActive={isZadActive} />
        </nav>
      )}
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label, isCenter, isZadActive }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center transition-all duration-300 ${isCenter ? '-mt-16' : ''}`}>
    <div className={`p-3.5 rounded-full transition-all duration-300 ${
      isCenter 
        ? 'bg-[#2E3B23] text-[#C5A059] shadow-2xl scale-125 border border-[#C5A059]/20' 
        : active 
          ? 'text-[#C5A059]' 
          : isZadActive ? 'text-white/30' : 'text-[#2E3B23]/20'
    }`}>
      {React.cloneElement(icon, { size: 20, strokeWidth: active || isCenter ? 2.5 : 2 })}
    </div>
    {!isCenter && <span className={`text-[8px] font-black mt-1.5 uppercase tracking-widest transition-colors ${
      active 
        ? isZadActive ? 'text-white' : 'text-[#2E3B23]' 
        : isZadActive ? 'text-white/20' : 'text-[#2E3B23]/20'
    }`}>{label}</span>}
  </button>
);

export default App;
