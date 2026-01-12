
import React from 'react';
import { 
  Clock, 
  BookOpen, 
  Search, 
  CheckSquare, 
  ShoppingBag, 
  MapPin,
  PlayCircle,
  Heart
} from 'lucide-react';
import { CardItem, Language } from './types';

export const COLORS = {
  white: '#FBFCF8',
  midnight: '#1B3022',
  olive: '#2E3B23', // Dark Olive Green
  beige: '#FDF5E6', // Creamy Beige
  gold: '#C5A059',  // Matte Gold
  pearl: '#F5F5F5',
  active_highlight: '#FDF5E6',
  qibla_success: '#4ADE80'
};

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation
  home: { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },
  prayer: { ar: 'الصلاة', en: 'Salat', fr: 'Prière' },
  discover: { ar: 'اكتشف', en: 'Discover', fr: 'Découvrir' },
  store: { ar: 'المتجر', en: 'Store', fr: 'Boutique' },
  zad: { ar: 'زاد', en: 'Zad', fr: 'Zad' },
  
  // Onboarding
  onboarding_welcome: { 
    ar: 'مرحباً بك في دليل الخير', 
    en: 'Welcome to Dalil Al Khair', 
    fr: 'Bienvenue sur Dalil Al Khair' 
  },
  onboarding_sub: { 
    ar: 'رفيقك في رحلتك الإيمانية بخصوصية تامة وهدوء ملكي', 
    en: 'Your spiritual companion with royal serenity', 
    fr: 'Votre compagnon spirituel avec une sérénité royale' 
  },
  onboarding_brother: { 
    ar: 'أخي المسلم', 
    en: 'My Muslim Brother', 
    fr: 'Mon frère Musulman' 
  },
  onboarding_sister: { 
    ar: 'أختي المسلمة', 
    en: 'My Muslim Sister', 
    fr: 'Ma sœur Musulmane' 
  },
  excellence_simplicity: {
    ar: 'التميز في البساطة',
    en: 'Excellence in Simplicity',
    fr: 'L\'excellence dans la simplicité'
  },

  // Home Screen
  greeting_brother: { ar: 'أهلاً بك يا أخي المسلم', en: 'Welcome, brother', fr: 'Bienvenue, mon frère' },
  greeting_sister: { ar: 'أهلاً بكِ يا أختي المسلمة', en: 'Welcome, sister', fr: 'Bienvenue, ma sœur' },
  daily_wisdom: { ar: 'الحكمة اليومية', en: 'Daily Wisdom', fr: 'Sagesse Quotidienne' },
  spiritual_heritage: { ar: 'التراث الإيماني', en: 'Spiritual Heritage', fr: 'Héritage Spirituel' },
  essential_services: { ar: 'الخدمات الأساسية', en: 'Essential Services', fr: 'Services Essentiels' },
  shop_featured: { ar: 'منتجات مختارة', en: 'Featured Products', fr: 'Produits Vedettes' },
  
  // Discover Screen
  discover_title: { ar: 'اكتشف القريب', en: 'Find Nearby', fr: 'À Proximité' },
  discover_sub: { ar: 'المساجد والخدمات', en: 'Mosques & Services', fr: 'Mosquées & Services' },
  all: { ar: 'الكل', en: 'All', fr: 'Tout' },
  mosques: { ar: 'مساجد', en: 'Mosques', fr: 'Mosquées' },
  halal: { ar: 'حلال', en: 'Halal', fr: 'Halal' },
  rating: { ar: 'التقييم', en: 'Rating', fr: 'Note' },
  distance: { ar: 'المسافة', en: 'Distance', fr: 'Distance' },
  directions: { ar: 'الاتجاهات', en: 'Directions', fr: 'Itinéraire' },
  call: { ar: 'اتصال', en: 'Call', fr: 'Appeler' },
  share: { ar: 'مشاركة', en: 'Share', fr: 'Partager' },
  save: { ar: 'حفظ', en: 'Save', fr: 'Enregistrer' },
  jumuah: { ar: 'الجمعة', en: 'JUMU\'AH', fr: 'JUMU\'AH' },
  next_prayer: { ar: 'الصلاة القادمة', en: 'Next Prayer', fr: 'Prochaine Prière' },

  // Prayer Screen
  fajr: { ar: 'الفجر', en: 'Fajr', fr: 'Fajr' },
  sunrise: { ar: 'الشروق', en: 'Sunrise', fr: 'Chourouk' },
  dhuhr: { ar: 'الظهر', en: 'Dhuhr', fr: 'Dohr' },
  asr: { ar: 'العصر', en: 'Asr', fr: 'Asr' },
  maghrib: { ar: 'المغرب', en: 'Maghrib', fr: 'Maghrib' },
  isha: { ar: 'العشاء', en: 'Isha', fr: 'Icha' },
  prayer_times: { ar: 'مواقيت الصلاة', en: 'Prayer Times', fr: 'Horaires' },
  qibla: { ar: 'القبلة', en: 'Qibla', fr: 'Qibla' },
  in: { ar: 'خلال', en: 'in', fr: 'dans' },
  calc_method: { ar: 'طريقة الحساب', en: 'Method', fr: 'Méثode' },
  location_denied: { ar: 'الموقع غير مفعل', en: 'Location Disabled', fr: 'Localisation désactivée' },
  enable_location_prompt: { 
    ar: 'يرجى تفعيل الموقع للحصول على مواقيت دقيقة لمدينتك الحالية.', 
    en: 'Please enable location for accurate times in your city.', 
    fr: 'Veuillez activer la localisation pour des horaires précis.' 
  },
  retry: { ar: 'إعادة المحاولة', en: 'Retry', fr: 'Réessayer' },
  facing_qibla: { ar: 'أنت تواجه القبلة', en: 'You are facing the Qibla', fr: 'Vous faites face à la Qibla' },
  calibrate_info: { ar: 'قم بتحريك هاتفك بحركة رقم 8 لمعايرة البوصلة', en: 'Move your phone in an 8-figure motion to calibrate', fr: 'Bougez votre téléphone en forme de 8 pour calibrer' },

  // Adhan Page
  adhan_call: { ar: 'أذان', en: 'Call to Prayer', fr: 'Appel à la prière' },
  dismiss: { ar: 'إغلاق', en: 'Dismiss', fr: 'Fermer' },
  mute: { ar: 'كتم', en: 'Mute', fr: 'Muet' },
  dua_after_adhan: { ar: 'دعاء بعد الأذان', en: 'Dua After Adhan', fr: 'Doua après l\'Adhan' },
  dua_content: { 
    ar: 'اللهم رب هذه الدعوة التامة، والصلاة القائمة، آت محمداً الوسيلة والفضيلة، وابعثه مقاماً محموداً الذي وعدته', 
    en: 'O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favor, and raise him to the honored station that You have promised him.', 
    fr: 'Ô Allah, Seigneur de cet appel parfait et de la prière accomplie, accorde à Muhammad l\'intercession et l\'excellence, et élève-le au rang louable que Tu lui as promis.' 
  },

  // Daily Plan
  daily_progress: { ar: 'الإنجاز اليومي', en: 'Daily Progress', fr: 'Proغrès Quotidien' },
  out_of: { ar: 'من', en: 'out of', fr: 'sur' },
  task_fajr: { ar: 'صلاة الفجر في المسجد', en: 'Fajr at Mosque', fr: 'Fajr à la Mosquée' },
  task_mulk: { ar: 'قراءة سورة الملك', en: 'Read Surah Al-Mulk', fr: 'Lire la Sourate Al-Mulk' },
  task_istighfar: { ar: 'ورد الاستغفار (100 مرة)', en: 'Istighfar (100x)', fr: 'Istighfar (100x)' },
  task_witr: { ar: 'صلاة الوتر', en: 'Witr Prayer', fr: 'Prière de Witr' },

  // Store
  royal_store: { ar: 'المتجر الملكي', en: 'Royal Store', fr: 'Boutique Royale' },
  artisanat: { ar: 'صناعة تقليدية', en: 'Artisanat', fr: 'Artisanat' },
  order_whatsapp: { ar: 'اطلب عبر واتساب', en: 'Order via WhatsApp', fr: 'Commander via WhatsApp' },
  product_mat: { ar: 'سجادة صلاة ملكية', en: 'Royal Prayer Mat', fr: 'Tapis de Prière Royal' },
  product_quran: { ar: 'مصحف مذهب فاخر', en: 'Luxury Gilded Quran', fr: 'Coran Doré de Luxe' },
  product_oud: { ar: 'عطر العود المغربي', en: 'Moroccan Oud Perfume', fr: 'Parfum d\'Oud Marocain' },
  product_tasbih: { ar: 'سبحة العقيق الطبيعي', en: 'Natural Agate Tasbih', fr: 'Tasbih en Agate Naturelle' }
};

export const HOME_CARDS: CardItem[] = [
  { id: 'PRAYER', titleKey: 'prayer_times', subtitleKey: 'prayer', icon: <Clock /> },
  { id: 'MUTOON', titleKey: 'mutooon', subtitleKey: 'mutooon', icon: <BookOpen /> },
  { id: 'FIQH', titleKey: 'fiqh_search', subtitleKey: 'fiqh_search', icon: <Search /> },
  { id: 'ZAD', titleKey: 'zad', subtitleKey: 'zad_recitations', icon: <PlayCircle /> },
  { id: 'STORE', titleKey: 'royal_store', subtitleKey: 'store', icon: <ShoppingBag /> },
  { id: 'NEARBY', titleKey: 'nearby', subtitleKey: 'discover', icon: <MapPin /> }
];