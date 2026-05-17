import { useState, useEffect } from 'react';

export function useClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update immediately
    setCurrentTime(new Date());

    // Update every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}
