import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSystemTimeFormat } from '../hooks/useTimeFormat';

export type Theme = 'light' | 'dark' | 'auto';
export type LocationMode = 'auto' | 'manual';
export type CalculationMethod = 'ISNA' | 'MUSLIM_WORLD_LEAGUE' | 'UMM_AL_QURA' | 'EGYPTIAN';
export type Madhab = 'SHAFI' | 'HANAFI';
export type HighLatitudeRule = 'MIDDLE_OF_NIGHT' | 'ANGLE_BASED' | 'ONE_SEVENTH';
export type TimeFormat = '12h' | '24h';

interface SettingsState {
  windowMode: 'sidebar' | 'fullscreen';
  setWindowMode: (mode: 'sidebar' | 'fullscreen') => void;

  // Appearance
  theme: Theme;
  setTheme: (theme: Theme) => void;
  timeFormat: TimeFormat;
  setTimeFormat: (timeFormat: TimeFormat) => void;

  // Location
  locationMode: LocationMode;
  setLocationMode: (mode: LocationMode) => void;
  manualCity: string;
  setManualCity: (city: string) => void;
  manualCityLat: number | null;
  manualCityLon: number | null;
  manualCityTimezone: string;
  setManualCityFull: (city: string, lat: number, lon: number, timezone: string) => void;
  manualCountry: string;
  setManualCountry: (country: string) => void;

  // Hijri
  hijriAdjustment: number;
  setHijriAdjustment: (adjustment: number) => void;

  // Prayer Settings
  calculationMethod: CalculationMethod;
  setCalculationMethod: (method: CalculationMethod) => void;
  madhab: Madhab;
  setMadhab: (madhab: Madhab) => void;
  highLatitudeRule: HighLatitudeRule;
  setHighLatitudeRule: (rule: HighLatitudeRule) => void;

  // Notifications
  enableAdhanNotification: boolean;
  setEnableAdhanNotification: (enabled: boolean) => void;

  // Startup
  autoStartEnabled: boolean;
  setAutoStartEnabled: (enabled: boolean) => void;

  // Get effective theme based on auto/manual
  getEffectiveTheme: () => 'light' | 'dark';
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Appearance defaults
      windowMode: 'sidebar',
      setWindowMode: (mode) => set({ windowMode: mode }),
      theme: 'auto',
      setTheme: (theme) => set({ theme }),
      timeFormat: getSystemTimeFormat(),
      setTimeFormat: (timeFormat) => set({ timeFormat }),

      // Location defaults
      locationMode: 'auto',
      setLocationMode: (mode) => set({ locationMode: mode }),
      manualCity: 'Mecca',
      setManualCity: (city) => set({ manualCity: city }),
      manualCityLat: 21.4225,
      manualCityLon: 39.8261,
      manualCityTimezone: 'Asia/Riyadh',
      setManualCityFull: (city, lat, lon, timezone) =>
        set({ manualCity: city, manualCityLat: lat, manualCityLon: lon, manualCityTimezone: timezone }),
      manualCountry: 'Saudi Arabia',
      setManualCountry: (country) => set({ manualCountry: country }),

      // Hijri defaults
      hijriAdjustment: 0,
      setHijriAdjustment: (adjustment) => set({ hijriAdjustment: adjustment }),

      // Prayer Settings defaults
      calculationMethod: 'ISNA',
      setCalculationMethod: (method) => set({ calculationMethod: method }),
      madhab: 'HANAFI',
      setMadhab: (madhab) => set({ madhab }),
      highLatitudeRule: 'MIDDLE_OF_NIGHT',
      setHighLatitudeRule: (rule) => set({ highLatitudeRule: rule }),

      // Notifications defaults
      enableAdhanNotification: true,
      setEnableAdhanNotification: (enabled) => set({ enableAdhanNotification: enabled }),

      // Startup defaults
      autoStartEnabled: false,
      setAutoStartEnabled: (enabled) => set({ autoStartEnabled: enabled }),

      // Compute effective theme
      getEffectiveTheme: () => {
        const theme = get().theme;
        if (theme === 'auto') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
      },
    }),
    {
      name: 'digital-muslim-settings',
    }
  )
);

export default useSettingsStore;
