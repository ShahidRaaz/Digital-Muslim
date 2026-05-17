import { useEffect, useRef } from 'react';
import useSettingsStore from '../store/settingsStore';

interface CurrentPrayer {
  name: string;
  time: string;
}

export function useNotifications(currentPrayer: CurrentPrayer | null) {
  const enableAdhanNotification = useSettingsStore((s) => s.enableAdhanNotification);
  const lastNotifiedPrayer = useRef<string | null>(null);

  useEffect(() => {
    async function checkPermission() {
      if (!enableAdhanNotification) return;

      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
    
    checkPermission();
  }, [enableAdhanNotification]);

  useEffect(() => {
    if (!enableAdhanNotification || !currentPrayer) return;

    // List of prayers to notify for (exclude Sunrise)
    const validPrayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    // Only notify if:
    // 1. It's a valid prayer time (not Sunrise)
    // 2. The prayer name changed
    // 3. It's not the very first time the hook runs (to avoid notifying on app open)
    if (validPrayers.includes(currentPrayer.name) && currentPrayer.name !== lastNotifiedPrayer.current) {
        
      if (lastNotifiedPrayer.current !== null) {
        const title = `Prayer Time: ${currentPrayer.name}`;
        const body = `It is now time for ${currentPrayer.name} prayer (${currentPrayer.time}).`;

        if (window.desktopWidget) {
          void window.desktopWidget.notify({ title, body });
        } else if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body });
        }
      }
      
      lastNotifiedPrayer.current = currentPrayer.name;
    }
  }, [currentPrayer, enableAdhanNotification]);
}
