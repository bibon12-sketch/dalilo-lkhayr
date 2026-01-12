
/**
 * Supabase Service for Assas Al Muslim
 * Optimized for local-first discovery
 */

import { Recitation, LocationData, AdhanVoice } from '../types';

export interface PrayerTimeData {
  name: string;
  time: string;
}

export interface ReaderContent {
  id: string;
  title: string;
  content: string;
}

export interface FiqhItem {
  id: string;
  question: string;
  answer: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

class SupabaseService {
  async getAdhanVoices(): Promise<AdhanVoice[]> {
    return [
      { 
        id: '1', 
        name: 'Abdelaziz es-Smahri', 
        url: 'https://www.islamcan.com/audio/adhan/azan1.mp3', // Placeholder URL for demonstration
        style: 'Moroccan Style' 
      },
      { 
        id: '2', 
        name: 'Hassan II Mosque', 
        url: 'https://www.islamcan.com/audio/adhan/azan3.mp3', // Placeholder URL
        style: 'Casablanca Traditional' 
      },
      { 
        id: '3', 
        name: 'Makkah Al-Mukarramah', 
        url: 'https://www.islamcan.com/audio/adhan/azan16.mp3', // Placeholder URL
        style: 'Haram Style' 
      }
    ];
  }

  async getPrayerTimes(): Promise<PrayerTimeData[]> {
    return [
      { name: 'الفجر', time: '05:12' },
      { name: 'الظهر', time: '12:20' },
      { name: 'العصر', time: '15:45' },
      { name: 'المغرب', time: '18:10' },
      { name: 'العشاء', time: '19:40' },
    ];
  }

  async getLocations(): Promise<LocationData[]> {
    return [
      { 
        id: '1', 
        name_en: 'Mosquée 1 (Bordeaux Center)', 
        name_ar: 'مسجد بوردو 1', 
        name_fr: 'Mosquée de Bordeaux 1',
        type: 'mosque', 
        lat: 44.83, 
        lng: -0.57, 
        rating: 4.8, 
        address_ar: 'وسط مدينة بوردو',
        address_en: 'Bordeaux City Center',
        address_fr: 'Centre-ville de Bordeaux',
        distance: '0.2 km'
      },
      { 
        id: '2', 
        name_en: 'Halal Shop 1 (Chartrons)', 
        name_ar: 'متجر حلال 1', 
        name_fr: 'Boutique Halal 1',
        type: 'halal', 
        lat: 44.84, 
        lng: -0.58, 
        rating: 4.6, 
        address_ar: 'حي شارتون، بوردو',
        address_en: 'Chartrons District, Bordeaux',
        address_fr: 'Quartier des Chartrons, Bordeaux',
        distance: '0.9 km'
      },
      { 
        id: '3', 
        name_en: 'Mosquée 2 (Bastide)', 
        name_ar: 'مسجد بوردو 2', 
        name_fr: 'Mosquée de Bordeaux 2',
        type: 'mosque', 
        lat: 44.85, 
        lng: -0.56, 
        rating: 4.7, 
        address_ar: 'حي لا باستيد، بوردو',
        address_en: 'La Bastide, Bordeaux',
        address_fr: 'La Bastide, Bordeaux',
        distance: '2.5 km'
      }
    ];
  }

  async getRecitations(): Promise<Recitation[]> {
    return [
      {
        id: '1',
        reciter_ar: 'ياسر الدوسري',
        reciter_en: 'Yasser Al-Dosari',
        surah_ar: 'سورة الفرقان',
        surah_en: 'Surah Al-Furqan',
        video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' // Using placeholder for now
      },
      {
        id: '2',
        reciter_ar: 'هزاع البلوشي',
        reciter_en: 'Hazza Al-Balushi',
        surah_ar: 'سورة مريم',
        surah_en: 'Surah Maryam',
        video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      {
        id: '3',
        reciter_ar: 'عبدالرحمن مسعد',
        reciter_en: 'Abdul Rahman Mossad',
        surah_ar: 'سورة النبأ',
        surah_en: 'Surah An-Naba',
        video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      }
    ];
  }
}

export const supabaseService = new SupabaseService();
