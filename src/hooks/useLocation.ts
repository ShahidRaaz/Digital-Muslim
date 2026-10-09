import { useState, useEffect } from 'react';
import useSettingsStore from '../store/settingsStore';

interface Location {
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

// Stop early once a fix is at least this accurate (metres)
const TARGET_ACCURACY_M = 50;
// Maximum time to keep refining the position before using the best fix so far
const MAX_LOCATION_WAIT_MS = 20000;

function readCachedLocation(): Location | null {
  try {
    const raw = localStorage.getItem(AUTO_LOCATION_CACHE_KEY);

    if (!raw) {
      return null;
    }

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

// The first fix is often a coarse Wi-Fi/IP estimate, so watch for a few seconds
// and keep the most accurate reading instead of trusting the first one.
function getBestPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    let best: GeolocationPosition | null = null;
    let lastError: { code: number } | null = null;
    let done = false;
    let watchId = -1;

    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (watchId !== -1) navigator.geolocation.clearWatch(watchId);
      if (best) resolve(best);
      else reject(lastError ?? { code: 3 });
    };

    const timer = setTimeout(finish, MAX_LOCATION_WAIT_MS);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!best || position.coords.accuracy < best.coords.accuracy) {
          best = position;
        }
        if (position.coords.accuracy <= TARGET_ACCURACY_M) {
          finish();
        }
      },
      (err) => {
        lastError = err;
        // Permission denied will not recover; other errors may, so keep waiting
        if (err.code === 1) finish();
      },
      {
        enableHighAccuracy: true,
        timeout: MAX_LOCATION_WAIT_MS,
        maximumAge: 0, // Never reuse a cached (possibly coarse) position
      }
    );
  });
}

async function getLocationName(latitude: number, longitude: number): Promise<{ name: string; timezone: string }> {
  try {
    // Using BigDataCloud's free reverse geocoding API which is highly accurate for city names
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();

    // Priority: city > locality > principalSubdivision (state/province) > country
    const name = data.city || data.locality || data.principalSubdivision || data.countryName || 'Unknown Location';

    // Fetch timezone from timeapi.io
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      const tzResp = await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${latitude}&longitude=${longitude}`);
      if (tzResp.ok) {
        const tzData = await tzResp.json();
        if (tzData.timeZone) timezone = tzData.timeZone;
      }
    } catch { /* fall back to system timezone */ }
    
    return { name, timezone };
  } catch (error) {
    console.error('Error fetching location name:', error);
    return { name: 'Unknown Location', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  }

}

export function useLocation() {
  const locationMode = useSettingsStore((state) => state.locationMode);
  const manualCity = useSettingsStore((state) => state.manualCity);
  const manualCityLat = useSettingsStore((state) => state.manualCityLat);
  const manualCityLon = useSettingsStore((state) => state.manualCityLon);
  const manualCityTimezone = useSettingsStore((state) => state.manualCityTimezone);

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

    return readCachedLocation();
  });
  const [loading, setLoading] = useState(() => locationMode !== 'manual' && !readCachedLocation());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevents state updates after unmount

    // Setup a listener for permission changes
    let permissionStatus: PermissionStatus | null = null;
    const setupPermissionListener = async () => {
      if ('permissions' in navigator) {
        try {
          permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          permissionStatus.onchange = () => {
            if (isMounted && permissionStatus?.state === 'granted') {
              void fetchLocation();
            }
          };
        } catch (e) { /* Permissions API not supported for geolocation in this environment */ }
      }
    };

    const fetchLocation = async () => {
      setError(null);

      if (locationMode === 'manual') {
        if (isMounted) {
          setLocation(buildManualLocation());
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
      }

      if (!navigator.geolocation) {
        if (isMounted) {
          setError('Geolocation not supported by your browser.');
          setLocation(readCachedLocation() ?? FALLBACK_LOCATION);
          setLoading(false);
        }
        return;
      }

      try {
        const position = await getBestPosition();
        const { latitude, longitude } = position.coords;

        // Reverse geocode the coordinates and get timezone
        const { name, timezone } = await getLocationName(latitude, longitude);
        const resolvedLocation = { latitude, longitude, name, timezone };

        writeCachedLocation(resolvedLocation);

        if (isMounted) {
          setLocation(resolvedLocation);
          setLoading(false);
        }
      } catch (err) {
        console.error('Geolocation error:', err);
        if (isMounted) {
          const code = (err as { code?: number })?.code;
          setError(code === 1 ? 'Location access denied.' : 'Location request timed out.');
          setLocation(readCachedLocation() ?? FALLBACK_LOCATION);
          setLoading(false);
        }
      }
    };

    void setupPermissionListener();
    void fetchLocation();

    return () => {
      isMounted = false;
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, [locationMode, manualCity, manualCityLat, manualCityLon, manualCityTimezone]);

  return { location, loading, error };
}
