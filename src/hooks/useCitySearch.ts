import { useState } from "react";

export function useCitySearch() {

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  let timer: any;

  const searchCity = async (query: string) => {

    clearTimeout(timer);

    timer = setTimeout(async () => {

      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {

        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`
        );

        const data = await res.json();

        setResults(data.results || []);

      } catch (err) {
        console.error("City search error:", err);
      }

      setLoading(false);

    }, 300);
  };

  return { results, searchCity, loading };
}