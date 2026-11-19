import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PrayerWidget } from './PrayerWidget';
import { FullScreenWidget } from './FullScreenWidget';
import { MediumWidget } from './MediumWidget';
import useSettingsStore, { WindowMode } from './store/settingsStore';
import './App.css';

function normalizeWindowMode(mode: string | null): WindowMode {
  if (mode === 'medium') return 'medium';
  if (mode === 'fullscreen' || mode === 'full') return 'full';
  return 'large';
}

function App() {
  const [windowMode, setWindowMode] = useState<WindowMode>(() => {
    return normalizeWindowMode(localStorage.getItem('windowMode'));
  });
  const settings = useSettingsStore();

  // Effect to persist timeFormat to localStorage
  useEffect(() => {
    const applyTheme = () => {
      if (settings.theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', settings.theme);
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [settings.theme]);

  useEffect(() => {
    // Ensure the window background is handled by the widget components
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.background = 'transparent';

    // Disable default right-click browser context menu
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', disableContextMenu);

    // Restore the saved window mode on boot
    const savedMode = normalizeWindowMode(localStorage.getItem('windowMode'));
    invoke('set_window_mode', { mode: savedMode }).catch(console.error);

    const handleModeChange = () => {
      setWindowMode(normalizeWindowMode(localStorage.getItem('windowMode')));
    };

    window.addEventListener('windowModeChanged', handleModeChange);
    return () => {
      window.removeEventListener('windowModeChanged', handleModeChange);
      document.removeEventListener('contextmenu', disableContextMenu);
    };
  }, []);

  return (
    <div className={`app-wrapper ${windowMode}`}>
      <div className={`app-container ${windowMode}`}>
        {windowMode === 'full' ? (
          <FullScreenWidget />
        ) : windowMode === 'medium' ? (
          <MediumWidget />
        ) : (
          <PrayerWidget />
        )}
      </div>
    </div>
  );
}

export default App;
