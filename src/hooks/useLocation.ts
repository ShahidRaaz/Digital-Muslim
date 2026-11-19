import { useState, useEffect } from 'react';
import useSettingsStore from '../store/settingsStore';

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
  timezone: string;
}

const AUTO_LOCATION_CACHE_KEY = 'digital-muslim-last-location';
const FALLBACK_LOCATION: Location = {
  latitude: 21.4225,
  longitude: 39.8261,
  name: 'Mecca (Default)',
  timezone: 'Asia/Riyadh',
};

function readCachedLocation(): Location | null {
  try {
    const raw = localStorage.getItem(AUTO_LOCATION_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<Location>;
    if (
      typeof parsed.latitude === 'number' &&
      typeof parsed.longitude === 'number' &&
      typeof parsed.name === 'string' &&
      typeof parsed.timezone === 'string'
    ) {
      return {
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        name: parsed.name,
        timezone: parsed.timezone,
      };
    }
  } catch {}
  return null;
}

function writeCachedLocation(location: Location) {
  try {
    localStorage.setItem(AUTO_LOCATION_CACHE_KEY, JSON.stringify(location));
  } catch {}
}

/**
 * Attempts to retrieve browser/OS coordinates via navigator.geolocation.
 * Uses enableHighAccuracy: false so Windows doesn't stall waiting for hardware GPS.
 */
function getBrowserPosition(timeoutMs = 4000): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation not supported'));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: false,
        timeout: timeoutMs,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Reverse geocodes coordinates to a human-friendly city name and timezone.
 */
async function getLocationName(
  latitude: number,
  longitude: number
): Promise<{ name: string; timezone: string }> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();

    const cityName =
      data.city ||
      data.locality ||
      data.principalSubdivision ||
      data.countryName ||
      'Current Location';
    const country = data.countryName ? `, ${data.countryName}` : '';
    const name = data.city ? `${data.city}${country}` : cityName;

    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      const tzResp = await fetch(
        `https://timeapi.io/api/timezone/coordinate?latitude=${latitude}&longitude=${longitude}`
      );
      if (tzResp.ok) {
        const tzData = await tzResp.json();
        if (tzData.timeZone) timezone = tzData.timeZone;
      }
    } catch {
      // Fall back to system timezone
    }

    return { name, timezone };
  } catch (error) {
    console.error('Error fetching location name:', error);
    return {
      name: 'Current Location',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }
}

/**
 * Fallback IP-based geolocation. Works instantly across all desktop platforms without requiring GPS.
 */
async function fetchIpLocation(): Promise<Location | null> {
  // Strategy 1: BigDataCloud reverse geocode client without lat/lon uses caller IP
  try {
    const resp = await fetch(
      'https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en'
    );
    if (resp.ok) {
      const data = await resp.json();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const cityName =
          data.city ||
          data.locality ||
          data.principalSubdivision ||
          data.countryName ||
          'Current Location';
        const country = data.countryName ? `, ${data.countryName}` : '';
        const name = data.city ? `${data.city}${country}` : cityName;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          name,
          timezone,
        };
      }
    }
  } catch (e) {
    console.warn('BigDataCloud IP detection failed:', e);
  }

  // Strategy 2: freeipapi.com
  try {
    const resp = await fetch('https://freeipapi.com/api/json');
    if (resp.ok) {
      const data = await resp.json();
      if (data.latitude && data.longitude) {
        const name = data.cityName
          ? `${data.cityName}, ${data.countryName}`
          : data.countryName || 'Current Location';
        const timezone = data.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          name,
          timezone,
        };
      }
    }
  } catch (e) {
    console.warn('freeipapi failed:', e);
  }

  // Strategy 3: ipwho.is
  try {
    const resp = await fetch('https://ipwho.is/');
    if (resp.ok) {
      const data = await resp.json();
      if (data.success && data.latitude && data.longitude) {
        const name = data.city
          ? `${data.city}, ${data.country}`
          : data.country || 'Current Location';
        const timezone = data.timezone?.id || Intl.DateTimeFormat().resolvedOptions().timeZone;
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          name,
          timezone,
        };
      }
    }
  } catch (e) {
    console.warn('ipwho.is failed:', e);
  }

  return null;
}

export function useLocation() {
  const {
    locationMode,
    manualCity,
    manualCityLat,
    manualCityLon,
    manualCityTimezone,
    autoCity,
    autoCityLat,
    autoCityLon,
    autoCityTimezone,
    setAutoLocation,
    locationRefreshTrigger,
  } = useSettingsStore();

  const buildManualLocation = (): Location => ({
    latitude: manualCityLat ?? FALLBACK_LOCATION.latitude,
    longitude: manualCityLon ?? FALLBACK_LOCATION.longitude,
    name: manualCity || 'Mecca',
    timezone: manualCityTimezone || FALLBACK_LOCATION.timezone,
  });

  const [location, setLocation] = useState<Location | null>(() => {
    if (locationMode === 'manual') {
      return buildManualLocation();
    }
    if (autoCity && autoCityLat && autoCityLon) {
      return {
        name: autoCity,
        latitude: autoCityLat,
        longitude: autoCityLon,
        timezone: autoCityTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }
    return readCachedLocation();
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      setError(null);

      if (locationMode === 'manual') {
        if (isMounted) {
          setLocation(buildManualLocation());
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
      }

      let coords: { latitude: number; longitude: number } | null = null;

      // 1. Try browser/OS geolocation with a brief 3.5s timeout
      try {
        coords = await getBrowserPosition(3500);
      } catch (err) {
        console.warn('Browser geolocation unavailable/timed out, attempting IP location...', err);
      }

      // 2. If browser geolocation succeeded, reverse geocode it
      if (coords && isMounted) {
        try {
          const { name, timezone } = await getLocationName(coords.latitude, coords.longitude);
          const resolvedLocation: Location = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            name,
            timezone,
          };
          writeCachedLocation(resolvedLocation);
          setAutoLocation(name, resolvedLocation.latitude, resolvedLocation.longitude, timezone);
          if (isMounted) {
            setLocation(resolvedLocation);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Reverse geocoding failed:', err);
        }
      }

      // 3. Fallback: IP-based geolocation (reliable on desktop without GPS)
      if (isMounted) {
        try {
          const ipLoc = await fetchIpLocation();
          if (ipLoc && isMounted) {
            writeCachedLocation(ipLoc);
            setAutoLocation(ipLoc.name, ipLoc.latitude, ipLoc.longitude, ipLoc.timezone);
            setLocation(ipLoc);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('IP geolocation fallback failed:', err);
        }
      }

      // 4. Fallback: cached or default
      if (isMounted) {
        const cached = readCachedLocation();
        if (cached) {
          setLocation(cached);
          setAutoLocation(cached.name, cached.latitude, cached.longitude, cached.timezone);
        } else {
          setError('Could not detect location. Using default.');
          setLocation(FALLBACK_LOCATION);
        }
        setLoading(false);
      }
    };

    void fetchLocation();

    return () => {
      isMounted = false;
    };
  }, [
    locationMode,
    manualCity,
    manualCityLat,
    manualCityLon,
    manualCityTimezone,
    locationRefreshTrigger,
  ]);

  return { location, loading, error };
}
