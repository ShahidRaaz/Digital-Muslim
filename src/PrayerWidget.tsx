import { SettingsModal } from './SettingsModal';
import { Header } from './components/Header';
import { Clock } from './components/Clock';
import { Quote } from './components/Quote';
import { PrayerTimes } from './components/PrayerTimes';
import { Footer } from './components/Footer';
import { useWidgetData } from './hooks/useWidgetData';
import './PrayerWidget.css';

export function PrayerWidget() {
  const {
    currentTime,
    location,
    locationError,
    weather,
    prayerTimes,
    currentPrayer,
    nextPrayer,
    hijriDateStr,
    quote,
    showSettings,
    setShowSettings,
  } = useWidgetData();

  if (!location) {
    return (
      <div className="prayer-widget" data-tauri-drag-region>
        <div className="loading-state">
          {locationError ? (
            <div className="error-state">
              <p>{locationError}</p>
              <p className="error-message">Using default location</p>
            </div>
          ) : (
            <>
              <div className="spinner"></div>
              <p>Loading Widget...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="prayer-widget" data-tauri-drag-region>
      <Header
        hijriDate={hijriDateStr}
        currentTime={currentTime}
        location={location}
        weather={weather}
      />

      <Clock currentTime={currentTime} timezone={location.timezone} />

      <Quote quote={quote} />

      <div className="prayer-footer-container">
        <PrayerTimes
          prayerTimes={prayerTimes}
          currentPrayer={currentPrayer}
          nextPrayer={nextPrayer}
        />
        <Footer onSettingsClick={() => setShowSettings(true)} />
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
