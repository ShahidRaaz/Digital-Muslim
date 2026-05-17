import { useState, useEffect } from 'react';
import useSettingsStore from '../store/settingsStore';
import { formatPrayerTime } from '../timeFormatter';
import { TimeFormat } from '../store/settingsStore';

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface NextPrayerInfo {
  name: string;
  time: string;
  countdownSeconds: number;
}

interface CurrentPrayerInfo {
  name: string;
  time: string;
}

interface HijriDateInfo {
  day: number;
  month: number;
  monthName: string;
  year: number;
}

const METHOD_MAP: Record<string, number> = {
  'ISNA': 2,
  'MUSLIM_WORLD_LEAGUE': 3,
  'UMM_AL_QURA': 4,
  'EGYPTIAN': 5,
};

const MADHAB_MAP: Record<string, number> = {
  'HANAFI': 1,
  'SHAFI': 0,
};

const HIGHLATITUDE_MAP: Record<string, string> = {
  'MIDDLE_OF_NIGHT': 'middle',
  'ANGLE_BASED': 'angle',
  'ONE_SEVENTH': '1/7',
};

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi\' al-Awwal',
  'Rabi\' al-Thani',
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  'Sha\'ban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qi\'dah',
  'Dhu al-Hijjah',
];

const PRAYER_TIMES_CACHE_KEY = 'digital-muslim-prayer-times';

interface PrayerTimesCache {
  key: string;
  prayerTimes: PrayerTimes;
}

function buildPrayerTimesCacheKey(
  latitude: number,
  longitude: number,
  dateString: string,
  calculationMethod: string,
  madhab: string,
  highLatitudeRule: string
) {
  return [
    latitude.toFixed(3),
    longitude.toFixed(3),
    dateString,
    calculationMethod,
    madhab,
    highLatitudeRule,
  ].join('|');
}

function readCachedPrayerTimes(cacheKey: string): PrayerTimes | null {
  try {
    const raw = localStorage.getItem(PRAYER_TIMES_CACHE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PrayerTimesCache>;

    if (parsed.key !== cacheKey || !parsed.prayerTimes) {
      return null;
    }

    const timings = parsed.prayerTimes;

    if (
      typeof timings.fajr === 'string' &&
      typeof timings.sunrise === 'string' &&
      typeof timings.dhuhr === 'string' &&
      typeof timings.asr === 'string' &&
      typeof timings.maghrib === 'string' &&
      typeof timings.isha === 'string'
    ) {
      return timings;
    }
  } catch {}

  return null;
}

function writeCachedPrayerTimes(cacheKey: string, prayerTimes: PrayerTimes) {
  try {
    localStorage.setItem(
      PRAYER_TIMES_CACHE_KEY,
      JSON.stringify({ key: cacheKey, prayerTimes })
    );
  } catch {}
}

export function usePrayerTimes(latitude: number | null, longitude: number | null, currentDate: Date, timeFormat: TimeFormat) {
  const calculationMethod = useSettingsStore((state) => state.calculationMethod);
  const madhab = useSettingsStore((state) => state.madhab);
  const highLatitudeRule = useSettingsStore((state) => state.highLatitudeRule);
  const dateString = currentDate.toISOString().split('T')[0];
  
  const cacheKey = latitude !== null && longitude !== null
    ? buildPrayerTimesCacheKey(
        latitude,
        longitude,
        dateString,
        calculationMethod,
        madhab,
        highLatitudeRule
      )
    : null;

  const [rawPrayerTimes, setRawPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<CurrentPrayerInfo | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cacheKey) {
      setRawPrayerTimes(null);
      return;
    }

    const cachedPrayerTimes = readCachedPrayerTimes(cacheKey);
    if (cachedPrayerTimes) {
      setRawPrayerTimes(cachedPrayerTimes);
    }
  }, [cacheKey]);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        setError(null);

        const methodId = METHOD_MAP[calculationMethod];
        const madhabhId = MADHAB_MAP[madhab];
        const latRule = HIGHLATITUDE_MAP[highLatitudeRule];

        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateString}?latitude=${latitude}&longitude=${longitude}&method=${methodId}&school=${madhabhId}&highLatitudeRule=${latRule}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch prayer times');
        }

        const data = await response.json();
        const timings = data.data.timings;
        const hijriData = data.data.date.hijri;

        const fetchedPrayerTimes = {
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha,
        };

        setRawPrayerTimes(fetchedPrayerTimes);
        if (cacheKey) {
            writeCachedPrayerTimes(cacheKey, fetchedPrayerTimes);
        }

        const monthNum = parseInt(hijriData.month.number);
        setHijriDate({
          day: parseInt(hijriData.day),
          month: monthNum,
          monthName: HIJRI_MONTHS[monthNum - 1],
          year: parseInt(hijriData.year),
        });

      } catch (err) {
        console.error('Error fetching prayer times:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch prayer times');
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
    const interval = setInterval(fetchPrayerTimes, 60000); // refetch every minute
    return () => clearInterval(interval);
  }, [latitude, longitude, dateString, calculationMethod, madhab, highLatitudeRule]);


  useEffect(() => {
    if (!rawPrayerTimes) {
        setPrayerTimes(null);
        setCurrentPrayer(null);
        setNextPrayer(null);
        return;
    }

    const formatted = {
        fajr: formatPrayerTime(rawPrayerTimes.fajr, timeFormat),
        sunrise: formatPrayerTime(rawPrayerTimes.sunrise, timeFormat),
        dhuhr: formatPrayerTime(rawPrayerTimes.dhuhr, timeFormat),
        asr: formatPrayerTime(rawPrayerTimes.asr, timeFormat),
        maghrib: formatPrayerTime(rawPrayerTimes.maghrib, timeFormat),
        isha: formatPrayerTime(rawPrayerTimes.isha, timeFormat),
    };
    setPrayerTimes(formatted);
    
    const prayerListRaw: [string, string][] = [
        ['Fajr', rawPrayerTimes.fajr],
        ['Sunrise', rawPrayerTimes.sunrise],
        ['Dhuhr', rawPrayerTimes.dhuhr],
        ['Asr', rawPrayerTimes.asr],
        ['Maghrib', rawPrayerTimes.maghrib],
        ['Isha', rawPrayerTimes.isha],
    ];

    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    let currentPrayerFound: CurrentPrayerInfo | null = null;
    let nextPrayerFound: NextPrayerInfo | null = null;

    for (let i = 0; i < prayerListRaw.length; i++) {
        const [name, timeStr] = prayerListRaw[i];
        const [hours, minutes] = timeStr.split(':').map(Number);
        const prayerTimeMinutes = hours * 60 + minutes;

        if (prayerTimeMinutes > currentTimeMinutes) {
            const prevPrayerIndex = i > 0 ? i - 1 : prayerListRaw.length - 1;
            const [prevName, prevTimeStr] = prayerListRaw[prevPrayerIndex];
            
            currentPrayerFound = { name: prevName, time: formatPrayerTime(prevTimeStr, timeFormat) };

            const nextDate = new Date();
            nextDate.setHours(hours, minutes, 0, 0);
            const diff = nextDate.getTime() - now.getTime();
            const countdownSeconds = Math.max(0, Math.floor(diff / 1000));

            nextPrayerFound = { name, time: formatPrayerTime(timeStr, timeFormat), countdownSeconds };
            break;
        }
    }
    
    if (!nextPrayerFound) {
        currentPrayerFound = { name: 'Isha', time: formatted.isha };
        const [fajrHours, fajrMinutes] = rawPrayerTimes.fajr.split(':').map(Number);
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate.setHours(fajrHours, fajrMinutes, 0, 0);
        const diff = nextDate.getTime() - now.getTime();
        const countdownSeconds = Math.max(0, Math.floor(diff / 1000));
        nextPrayerFound = { name: 'Fajr', time: formatted.fajr, countdownSeconds };
    }

    setCurrentPrayer(currentPrayerFound);
    setNextPrayer(nextPrayerFound);

  }, [rawPrayerTimes, timeFormat, currentDate]);

  return { prayerTimes, currentPrayer, nextPrayer, hijriDate, loading, error };
}
