
import React from 'react';

export type Gender = 'brother' | 'sister' | null;
export type Language = 'ar' | 'fr' | 'en';

export enum AppState {
  SPLASH = 'SPLASH',
  LANGUAGE_SELECTION = 'LANGUAGE_SELECTION',
  ONBOARDING = 'ONBOARDING',
  HOME = 'HOME',
  PRAYER = 'PRAYER',
  MUTOON = 'MUTOON',
  FIQH = 'FIQH',
  STORE = 'STORE',
  ZAD = 'ZAD',
  NEARBY = 'NEARBY',
  ADHAN = 'ADHAN'
}

export interface AdhanVoice {
  id: string;
  name: string;
  url: string;
  style: string;
}

export interface CardItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  icon: React.ReactNode;
}

export interface LocationData {
  id: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  type: 'mosque' | 'halal';
  lat: number;
  lng: number;
  rating: number;
  address_ar: string;
  address_en: string;
  address_fr: string;
  distance: string;
}

export interface Recitation {
  id: string;
  reciter_ar: string;
  reciter_en: string;
  surah_ar: string;
  surah_en: string;
  video_url: string;
}
