import sunrise from '../assets/pricons/sunrise.png';
import dhuhr from '../assets/pricons/dhuhr.png';
import asr from '../assets/pricons/asr.png';
import maghrib from '../assets/pricons/maghrib.png';
import { FajrIcon, IshaIcon } from '../icons';
import './PrayerTimes.css';

interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface NextPrayerInfo {
  name: string;
  time: string;
  countdownSeconds: number;
}

interface CurrentPrayerInfo {
  name: string;
  time: string;
}

interface PrayerTimesProps {
  prayerTimes: PrayerTimesData | null;
  currentPrayer: CurrentPrayerInfo | null;
  nextPrayer: NextPrayerInfo | null;
}

export function PrayerTimes({ prayerTimes, currentPrayer, nextPrayer }: PrayerTimesProps) {
  if (!prayerTimes || !currentPrayer || !nextPrayer) return null;

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: String(hrs).padStart(2, '0'),
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
    };
  };

  const countdownFormatted = formatCountdown(nextPrayer.countdownSeconds);

  return (
    <>
      {/* Prayer Times Grid */}
      <div className="prayer-grid-section">
        {/* Prayer Status */}
        <div className="prayer-status-section">
          <div className="status-column">
            <div className="status-label">Now</div>
            <div className="prayer-time-now">{currentPrayer.name}</div>
          </div>

          <div className="status-column">
            <div className="status-label">Next</div>
            <div className="status-prayer">{nextPrayer.name}</div>
          </div>

          <div className="status-column">
            <div className="status-label">In</div>
            <div className="status-prayer">
              {`${countdownFormatted.hours}h ${countdownFormatted.minutes}m`}
            </div>
          </div>
        </div>

        <div className="prayer-row">
          <div className={`prayer-time-item ${currentPrayer.name === 'Fajr' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">Fajr</span>
              <span className="prayer-time-value">{prayerTimes.fajr}</span>
            </div>
            <FajrIcon width={38} height={29} fill="var(--text-primary)" />
          </div>

          <div className={`prayer-time-item ${currentPrayer.name === 'Sunrise' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">Sunrise</span>
              <span className="prayer-time-value">{prayerTimes.sunrise}</span>
            </div>
            <img src={sunrise} alt="Sunrise" className="prayer-icon" />
          </div>
        </div>

        <div className="prayer-row">
          <div className={`prayer-time-item ${currentPrayer.name === 'Dhuhr' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">Dhuhr</span>
              <span className="prayer-time-value">{prayerTimes.dhuhr}</span>
            </div>
            <img src={dhuhr} alt="Dhuhr" className="prayer-icon" />
          </div>

          <div className={`prayer-time-item ${currentPrayer.name === 'Asr' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">A'sr</span>
              <span className="prayer-time-value">{prayerTimes.asr}</span>
            </div>
            <img src={asr} alt="Asr" className="prayer-icon" />
          </div>
        </div>

        <div className="prayer-row">
          <div className={`prayer-time-item ${currentPrayer.name === 'Maghrib' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">Maghrib</span>
              <span className="prayer-time-value">{prayerTimes.maghrib}</span>
            </div>
            <img src={maghrib} alt="Maghrib" className="prayer-icon" />
          </div>

          <div className={`prayer-time-item ${currentPrayer.name === 'Isha' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">Isha</span>
              <span className="prayer-time-value">{prayerTimes.isha}</span>
            </div>
            <IshaIcon width={35} height={33} fill="var(--text-primary)" />
          </div>
        </div>
      </div>
    </>
  );
}
