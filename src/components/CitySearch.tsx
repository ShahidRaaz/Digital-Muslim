import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader } from "lucide-react";
import useSettingsStore from "../store/settingsStore";
import "./CitySearch.css";

interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    country_code?: string;
  };
}

async function fetchTimezone(lat: number, lon: number): Promise<string> {
  try {
    const resp = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`
    );
    if (resp.ok) {
      const data = await resp.json();
      if (data.timeZone) return data.timeZone;
    }
  } catch {}
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function CitySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { manualCity, setManualCityFull } = useSettingsStore();

  // Sync display with stored city on mount
  useEffect(() => {
    setQuery(manualCity);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6&featuretype=city`,
          { headers: { "User-Agent": "DigitalMuslimWidget/1.0" } }
        );
        const data: NominatimResult[] = await resp.json();
        setResults(data);
        setIsOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = async (result: NominatimResult) => {
    const cityName =
      result.address.city ||
      result.address.town ||
      result.address.village ||
      result.name;
    const country = result.address.country || "";
    const displayName = country ? `${cityName}, ${country}` : cityName;

    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    setQuery(displayName);
    setIsOpen(false);

    const timezone = await fetchTimezone(lat, lon);
    setManualCityFull(displayName, lat, lon, timezone);
  };

  return (
    <div className="city-search-container" ref={containerRef}>
      <div className="city-search-input-wrap">
        <Search size={14} className="city-search-icon" />
        <input
          type="text"
          className="city-search-input"
          placeholder="Search for a city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {loading && <Loader size={14} className="city-search-spinner" />}
      </div>

      {isOpen && results.length > 0 && (
        <div className="city-search-dropdown">
          {results.map((r) => {
            const city =
              r.address.city || r.address.town || r.address.village || r.name;
            const country = r.address.country || "";
            return (
              <div
                key={r.place_id}
                className="city-search-option"
                onClick={() => handleSelect(r)}
              >
                <MapPin size={13} className="city-search-pin" />
                <div>
                  <span className="city-search-city">{city}</span>
                  {country && (
                    <span className="city-search-country">, {country}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
