import { PrayerIcon, HourglassIcon } from '../icons';
import './SalahInfo.css';

interface SalahInfoProps {
  currentPrayer: { name: string; time: string } | null;
  nextPrayer: { name: string; time: string; countdownSeconds: number } | null;
  countdown: string;
  variant?: 'row' | 'col' | 'column';
  className?: string;
}

export function SalahInfo({
  currentPrayer,
  nextPrayer,
  countdown,
  variant = 'row',
  className = '',
}: SalahInfoProps) {
  const isCol = variant === 'col' || variant === 'column';
  const nextPrayerName = nextPrayer?.name || 'Loading';

  return (
    <div
      className={`fullscreen-prayer-info ${isCol ? 'salah-info-col' : 'salah-info-row'} ${className}`}
    >
      <div className="fullscreen-prayer-current">
        <span className="title">Now</span>
        {currentPrayer && currentPrayer.name ? (
          <>
            <span>{currentPrayer.name} {currentPrayer.time}</span>
            <PrayerIcon name={currentPrayer.name} size={isCol ? 22 : 24} />
          </>
        ) : (
          <span>Waiting for Next Prayer</span>
        )}
      </div>

      {!isCol && <div className="fullscreen-separator" />}

      <div className="fullscreen-prayer-next">
        <span className="title">Next</span>
        <span>{nextPrayerName} {nextPrayer?.time ? `${nextPrayer.time} ` : ''}</span>
        <PrayerIcon name={nextPrayerName} size={isCol ? 22 : 24} />
      </div>

      {!isCol && <div className="fullscreen-separator" />}

      <div className="fullscreen-prayer-countdown">
        <span className="title">In</span>
        <span className="countdown">{countdown}</span>
        <HourglassIcon
          width={isCol ? 16 : 18}
          height={isCol ? 22 : 26}
          fill="var(--accent-primary)"
        />
      </div>
    </div>
  );
}
