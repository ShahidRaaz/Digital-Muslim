export interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Settings {
  location: Location;
  theme: 'light' | 'dark';
  hijriAdjustment: number;
}

export interface Quote {
  arabic?: string;
  text: string;
  source?: string;
}
