
/**
 * Assas Smart Prayer Engine
 * Dynamic astronomical calculations strictly following Maliki Madhab (Asr 1:1).
 * Features: Auto-Country detection, High Latitude Handling (MiddleOfTheNight),
 * and Salat First synced offsets (-2 Fajr, +3 Maghrib).
 */

export interface PrayerTime {
  id: string;
  nameKey: string;
  time: string;
  date: Date;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type CalcMethod = 'UOIF' | 'Morocco' | 'MWL';

export interface LocationInfo {
  city: string;
  country: string;
  countryCode: string;
  method: CalcMethod;
}

export class PrayerService {
  // Base: Eysines (Lat: 44.88, Lng: -0.63)
  static readonly DEFAULT_COORDS: Coordinates = { latitude: 44.88, longitude: -0.63 };

  static async getLocationInfo(coords: Coordinates): Promise<LocationInfo> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      const countryCode = (data.address.country_code || 'fr').toLowerCase();
      const city = data.address.city || data.address.town || data.address.village || 'Eysines';
      const country = data.address.country || 'France';

      let method: CalcMethod = 'MWL';
      if (countryCode === 'fr') method = 'UOIF';
      else if (countryCode === 'ma') method = 'Morocco';

      return { city, country, countryCode, method };
    } catch (error) {
      return { city: 'Eysines', country: 'France', countryCode: 'fr', method: 'UOIF' };
    }
  }

  static getPrayerTimes(date: Date, coords: Coordinates, method: CalcMethod): PrayerTime[] {
    const { latitude, longitude } = coords;
    
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const declination = 0.409 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));
    const equationOfTime = 0.165 * Math.sin(4 * Math.PI * (dayOfYear - 81) / 365) - 0.126 * Math.cos(2 * Math.PI * (dayOfYear - 81) / 365) - 0.05 * Math.sin(2 * Math.PI * (dayOfYear - 81) / 365);
    
    const timezone = -date.getTimezoneOffset() / 60;
    const noon = 12 + timezone - (longitude / 15) - equationOfTime;

    const calculateTime = (angle: number, direction: 'rise' | 'set') => {
      const phi = (latitude * Math.PI) / 180;
      const delta = declination;
      const cosH = (Math.sin((angle * Math.PI) / 180) - Math.sin(phi) * Math.sin(delta)) / (Math.cos(phi) * Math.cos(delta));
      if (cosH > 1 || cosH < -1) return null;
      const H = Math.acos(cosH) * (180 / Math.PI) / 15;
      return direction === 'rise' ? noon - H : noon + H;
    };

    const calculateAsr = () => {
      const phi = (latitude * Math.PI) / 180;
      const delta = declination;
      const acot = (x: number) => Math.atan(1 / x);
      const angle = acot(1 + Math.tan(Math.abs(phi - delta))) * (180 / Math.PI);
      const cosH = (Math.sin((angle * Math.PI) / 180) - Math.sin(phi) * Math.sin(delta)) / (Math.cos(phi) * Math.cos(delta));
      if (cosH > 1 || cosH < -1) return noon + 3; 
      return noon + (Math.acos(cosH) * (180 / Math.PI) / 15);
    };

    let fajrAngle = -18;
    let ishaAngle = -18;

    if (method === 'UOIF') {
      fajrAngle = -12;
      ishaAngle = -12;
    } else if (method === 'Morocco') {
      fajrAngle = -19;
      ishaAngle = -17;
    }

    const sunriseDec = calculateTime(-0.833, 'rise');
    const sunsetDec = calculateTime(-0.833, 'set');
    let fajrDec = calculateTime(fajrAngle, 'rise');
    let ishaDec = calculateTime(ishaAngle, 'set');

    if (sunriseDec !== null && sunsetDec !== null) {
      const nightDuration = 24 - (sunsetDec - sunriseDec);
      const halfNight = nightDuration / 2;
      if (fajrDec === null || (sunriseDec - fajrDec) > halfNight) fajrDec = sunriseDec - halfNight;
      if (ishaDec === null || (ishaDec - sunsetDec) > halfNight) ishaDec = sunsetDec + halfNight;
    }

    const timesRaw = [
      { id: 'fajr', nameKey: 'fajr', decimal: fajrDec, offset: -2, rounding: 'floor' },
      { id: 'sunrise', nameKey: 'sunrise', decimal: sunriseDec, offset: 0, rounding: 'round' },
      { id: 'dhuhr', nameKey: 'dhuhr', decimal: noon, offset: 2, rounding: 'round' },
      { id: 'asr', nameKey: 'asr', decimal: calculateAsr(), offset: 0, rounding: 'round' },
      { id: 'maghrib', nameKey: 'maghrib', decimal: sunsetDec, offset: 3, rounding: 'ceil' },
      { id: 'isha', nameKey: 'isha', decimal: ishaDec, offset: 2, rounding: 'round' },
    ];

    return timesRaw.map(t => {
      const d = new Date(date);
      if (t.decimal === null) {
        d.setHours(0, 0, 0, 0);
      } else {
        const baseMinutes = t.decimal * 60;
        let finalMinutes: number;
        if (t.rounding === 'floor') finalMinutes = Math.floor(baseMinutes) + t.offset;
        else if (t.rounding === 'ceil') finalMinutes = Math.ceil(baseMinutes) + t.offset;
        else finalMinutes = Math.round(baseMinutes) + t.offset;

        const hours = Math.floor(finalMinutes / 60) % 24;
        const minutes = Math.floor(finalMinutes % 60);
        d.setHours(hours, minutes, 0, 0);
      }
      return { id: t.id, nameKey: t.nameKey, time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`, date: d };
    });
  }

  static calculateDistance(c1: Coordinates, c2: Coordinates): number {
    const R = 6371; 
    const dLat = (c2.latitude - c1.latitude) * Math.PI / 180;
    const dLon = (c2.longitude - c1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(c1.latitude * Math.PI / 180) * Math.cos(c2.latitude * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  static getNextPrayer(prayers: PrayerTime[], now: Date, coords: Coordinates, method: CalcMethod): PrayerTime {
    const next = prayers.find(p => p.date > now && p.id !== 'sunrise');
    if (next) return next;
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowPrayers = this.getPrayerTimes(tomorrow, coords, method);
    return tomorrowPrayers[0];
  }

  static getCurrentPrayer(prayers: PrayerTime[], now: Date): PrayerTime {
    const reversed = [...prayers].reverse();
    return reversed.find(p => p.date <= now && p.id !== 'sunrise') || prayers[prayers.length - 1];
  }

  static calculateQibla(coords: Coordinates): number {
    const mLat = 21.4225, mLng = 39.8262;
    const { latitude, longitude } = coords;
    const phi1 = (latitude * Math.PI) / 180, phi2 = (mLat * Math.PI) / 180;
    const lam1 = (longitude * Math.PI) / 180, lam2 = (mLng * Math.PI) / 180;
    const y = Math.sin(lam2 - lam1), x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(lam2 - lam1);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }
}
