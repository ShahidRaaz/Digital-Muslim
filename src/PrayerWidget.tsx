import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { SettingsModal } from './SettingsModal';
import { Header } from './components/Header';
import { Clock } from './components/Clock';
import { Quote } from './components/Quote';
import { PrayerTimes } from './components/PrayerTimes';
import { Footer } from './components/Footer';

import { useClock } from './hooks/useClock';
import { useLocation } from './hooks/useLocation';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { useWeather } from './hooks/useWeather';
import { useHijriDate } from './hooks/useHijriDate';
import { useNotifications } from './hooks/useNotifications';
import { useQuranQuote } from './hooks/useQuranQuote';

import useSettingsStore from './store/settingsStore';

import './PrayerWidget.css';

export function PrayerWidget() {
  const timeFormat = useSettingsStore((state) => state.timeFormat);
  const currentTime = useClock();

  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useLocation();

  const { weather } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null
  );

  const { prayerTimes, currentPrayer, nextPrayer } = usePrayerTimes(
    location?.latitude ?? null,
    location?.longitude ?? null,
    currentTime,
    timeFormat
  );

  const { hijriDate } = useHijriDate(currentTime, location?.timezone);
  const { quote } = useQuranQuote();

  useNotifications(currentPrayer);

  const [showSettings, setShowSettings] = useState(false);

  const theme = useSettingsStore((state) => state.theme);
  const getEffectiveTheme = useSettingsStore((state) => state.getEffectiveTheme);

  const hijriDateStr = hijriDate
    ? `${hijriDate.day} ${hijriDate.monthName}\n${hijriDate.year} AH`
    : '';

  useEffect(() => {
    const applyTheme = () => {
      const effectiveTheme = getEffectiveTheme();

      document.documentElement.setAttribute('data-theme', effectiveTheme);
      document.documentElement.style.colorScheme = effectiveTheme;
    };

    applyTheme();

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    darkModeQuery.addEventListener('change', applyTheme);

    return () => darkModeQuery.removeEventListener('change', applyTheme);
  }, [theme, getEffectiveTheme]);

  useEffect(() => {
    let unlistenFn: (() => void) | undefined;

    const setupListener = async () => {
      unlistenFn = await listen('open-settings', () => {
        setShowSettings(true);
      });
    };

    setupListener();

    return () => {
      if (unlistenFn) unlistenFn();
    };
  }, []);

  if (locationLoading && !location) {
    return (
      <div className="prayer-widget">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Widget...</p>
        </div>
      </div>
    );
  }

  if (locationError && !location) {
    return (
      <div className="prayer-widget">
        <div className="error-state">
          <p>{locationError}</p>
          <p className="error-message">Using default location</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="prayer-widget">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prayer-widget" data-drag-region>
      <Header
        hijriDate={hijriDateStr}
        currentTime={currentTime}
        location={location}
        weather={weather}
      />

      <Clock currentTime={currentTime} timezone={location.timezone} />

      <Quote quote={quote} />

      <div className="prayer-footer-container">
        <PrayerTimes
          prayerTimes={prayerTimes}
          currentPrayer={currentPrayer}
          nextPrayer={nextPrayer}
        />
        <Footer onSettingsClick={() => setShowSettings(true)} />
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
