import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { useClock } from './useClock';
import { useLocation } from './useLocation';
import { usePrayerTimes } from './usePrayerTimes';
import { useWeather } from './useWeather';
import { useHijriDate } from './useHijriDate';
import { useNotifications } from './useNotifications';
import { useQuranQuote } from './useQuranQuote';
import useSettingsStore from '../store/settingsStore';

export function formatCountdown(countdownSeconds?: number): string {
  if (countdownSeconds === undefined || countdownSeconds === null) return '--h --m --s';
  const h = Math.floor(countdownSeconds / 3600);
  const m = Math.floor((countdownSeconds % 3600) / 60);
  const s = countdownSeconds % 60;
  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  }
  return `${m}m ${s}s`;
}

export function useWidgetData() {
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

  const hijriDateStr = hijriDate
    ? `${hijriDate.day} ${hijriDate.monthName}\n${hijriDate.year} AH`
    : '';

  const countdown = formatCountdown(nextPrayer?.countdownSeconds);

  return {
    timeFormat,
    currentTime,
    location,
    locationLoading,
    locationError,
    weather,
    prayerTimes,
    currentPrayer,
    nextPrayer,
    countdown,
    hijriDate,
    hijriDateStr,
    quote,
    showSettings,
    setShowSettings,
  };
}
