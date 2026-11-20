import { useTimeFormat } from '../hooks/useTimeFormat';
import { ClockAmPmIcon, CalendarDayIcon } from '../icons';
import './Clock.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ClockProps {
  currentTime: Date;
  timezone?: string;
}

export function Clock({ currentTime, timezone }: ClockProps) {
  const { timeFormat, formatTimeParts } = useTimeFormat();
  const { hours, minutes, seconds, ampm } = formatTimeParts(currentTime, timezone);
  const dayName = DAYS[currentTime.getDay()];

  return (
    <div className="timer-section">
      <div className="timer-display">
        <div className="timer-unit">
          <span className="timer-value">{hours}</span>
          <span className="timer-label">hr</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-unit">
          <span className="timer-value">{minutes}</span>
          <span className="timer-label">min</span>
        </div>
        <span className="timer-separator">:</span>
        <div className="timer-unit">
          <span className="timer-value">{seconds}</span>
          <span className="timer-label">sec</span>
        </div>
      </div>

      <div className="timer-info">
        {timeFormat === '12h' && (
          <div className="ampm-badge">
            <ClockAmPmIcon width={18} height={19} fill="var(--accent-primary)" />
            {ampm}
          </div>
        )}
        <div className="day-badge">
          <CalendarDayIcon width={18} height={19} fill="var(--accent-primary)" />
          {dayName}
        </div>
      </div>
    </div>
  );
}
