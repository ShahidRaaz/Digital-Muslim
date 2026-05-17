import { useState, useEffect } from "react";

const WEATHER_CACHE_KEY = "digital-muslim-weather";

interface CachedWeather {
  key: string;
  weather: any;
}

function buildWeatherCacheKey(latitude: number, longitude: number) {
  return `${latitude.toFixed(3)}|${longitude.toFixed(3)}`;
}

function readCachedWeather(cacheKey: string) {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedWeather;
    if (parsed.key === cacheKey) {
      return parsed.weather;
    }
  } catch {}

  return null;
}

function writeCachedWeather(cacheKey: string, weather: any) {
  try {
    localStorage.setItem(
      WEATHER_CACHE_KEY,
      JSON.stringify({ key: cacheKey, weather })
    );
  } catch {}
}

export function useWeather(
  latitude: number | null,
  longitude: number | null
) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;
    const cacheKey = buildWeatherCacheKey(latitude, longitude);
    const cachedWeather = readCachedWeather(cacheKey);

    if (cachedWeather) {
      setWeather(cachedWeather);
    }

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        const data = await res.json();

        setWeather(data.current_weather);
        writeCachedWeather(cacheKey, data.current_weather);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    const timerId = window.setTimeout(() => {
      void fetchWeather();
    }, 500);

    return () => window.clearTimeout(timerId);
  }, [latitude, longitude]);

  return { weather };
}
