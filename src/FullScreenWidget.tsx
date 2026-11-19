import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { format } from 'date-fns';
import { SettingsModal } from './SettingsModal';
import { Clock } from './components/Clock';
import { Quote } from './components/Quote';
import { SalahInfo } from './components/SalahInfo';
import { useWidgetData } from './hooks/useWidgetData';
import {
  DigitalMuslimLogo,
  HidayahLogo,
  MoonIcon,
  SunIcon,
  LocationIcon,
  WeatherIcon,
} from './icons';
import './FullScreenWidget.css';

export function FullScreenWidget() {
  const {
    currentTime,
    location,
    locationLoading,
    locationError,
    weather,
    currentPrayer,
    nextPrayer,
    countdown,
    hijriDateStr,
    quote,
    showSettings,
    setShowSettings,
  } = useWidgetData();

  useEffect(() => {
    if (showSettings) {
      // If settings are open, make the whole screen interactive
      invoke('set_interactive_regions', {
        regions: [{ x: 0, y: 0, width: 99999, height: 99999 }]
      }).catch(console.error);
      return;
    }

    const updateRegions = () => {
      const elements = document.querySelectorAll('.interactive-region');
      const dpr = window.devicePixelRatio || 1;
      const regions = Array.from(elements).map(el => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left * dpr,
          y: rect.top * dpr,
          width: rect.width * dpr,
          height: rect.height * dpr,
        };
      });

      invoke('set_interactive_regions', { regions }).catch(console.error);
    };

    updateRegions();
    window.addEventListener('resize', updateRegions);
    const observer = new MutationObserver(updateRegions);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener('resize', updateRegions);
      observer.disconnect();
    };
  }, [showSettings]);

  if (locationLoading && !location) {
    return (
      <div className="fullscreen-layout loading-state">
        <div className="spinner"></div>
        <p>Loading Widget...</p>
      </div>
    );
  }

  if (locationError && !location) {
    return (
      <div className="fullscreen-layout error-state">
        <p>{locationError}</p>
        <p className="error-message">Using default location</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="fullscreen-layout loading-state">
        <div className="spinner"></div>
        <p>Initializing...</p>
      </div>
    );
  }

  return (
    <div className="fullscreen-layout">
      {/* HEADER (1 Row) */}
      <div className="fullscreen-header">
        <div className="fullscreen-dates">
          <SunIcon width={24} height={24} fill="var(--accent-primary)" />
          {format(currentTime, 'dd MMMM yyyy')} CE
        </div>

        <div className="fullscreen-header-center">
          <div className="fullscreen-location-primary">
            <LocationIcon width={20} height={22} fill="var(--accent-primary)" />
            {location.name || 'Unknown'}
          </div>
          <div className="fullscreen-weather">
            <WeatherIcon width={22} height={20} fill="var(--accent-primary)" />
            {weather && typeof weather.temperature === 'number' ? `${Math.round(weather.temperature)}°C` : 'Weather unavailable'}
          </div>
        </div>

        <div className="fullscreen-dates">
          {hijriDateStr.replace('\n', ' ')}
          <MoonIcon width={20} height={20} fill="var(--accent-primary)" />
        </div>
      </div>

      {/* CENTER (Clock & Quote slightly bigger) */}
      <div className="fullscreen-center">
        <div className="fullscreen-clock-wrapper">
          <Clock currentTime={currentTime} timezone={location.timezone} />
        </div>
        <div className="fullscreen-quote-wrapper">
          <Quote quote={quote} />
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="fullscreen-bottom interactive-region">
        {/* Left: Digital muslim tag */}
        <div
          className="fullscreen-brand"
          onClick={() => setShowSettings(true)}
          title="Open Settings"
        >
          <DigitalMuslimLogo width={20} height={30} fill="var(--accent-primary)" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
            <span>Digital</span>
            <span>Muslim</span>
          </div>
        </div>

        {/* Center: current next prayer countdown with icons */}
        <SalahInfo
          currentPrayer={currentPrayer}
          nextPrayer={nextPrayer}
          countdown={countdown}
          variant="row"
        />

        {/* Right: powered by hidayah tag */}
        <div className="fullscreen-powered-by">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
            <span>Powered by</span>
            <span>Hidayah</span>
          </div>
          <HidayahLogo width={13} height={32} fill="var(--accent-primary)" />
        </div>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
