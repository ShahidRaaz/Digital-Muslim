import { DateCard } from './DateCard';
import { LocationIcon, WeatherIcon } from '../icons';
import './Header.css';

interface HeaderProps {
  hijriDate: string;
  currentTime: Date;
  location: { name: string; latitude: number; longitude: number } | null;
  weather: { temperature: number; condition: string } | null;
}

export function Header({ hijriDate, currentTime, location, weather }: HeaderProps) {
  return (
    <div className="header-section" data-tauri-drag-region>
      <DateCard hijriDate={hijriDate} currentTime={currentTime} />

      <div className="location-weather-row" data-tauri-drag-region>
        <div className="location-info">
          <LocationIcon width={14} height={16} fill="var(--accent-primary)" />
          <div>{location?.name}</div>
        </div>

        <div className="weather-badge">
          {weather ? (
            <>
              <div>{Math.round(weather.temperature)}°C</div>
            </>
          ) : (
            <div>Loading...</div>
          )}
          <WeatherIcon width={18} height={16} fill="var(--accent-primary)" />
        </div>
      </div>
    </div>
  );
}
