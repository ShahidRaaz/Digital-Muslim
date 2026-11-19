import { format } from 'date-fns';
import { MoonIcon, SunIcon } from '../icons';
import './Header.css';

interface DateCardProps {
  hijriDate: string;
  currentTime: Date;
  asCard?: boolean;
  className?: string;
}

export function DateCard({ hijriDate, currentTime, asCard = false, className = '' }: DateCardProps) {
  const content = (
    <div className="date-columns">
      <div className="date-column hijri-column">
        <div className="date-label">
          <MoonIcon width={16} height={16} fill="var(--accent-primary)" />
          Hijri Date
        </div>
        <div className="date-value">{hijriDate}</div>
      </div>

      <div className="date-column gregorian-column">
        <div className="date-label">
          Gregorian Date
          <SunIcon width={16} height={16} fill="var(--accent-primary)" />
        </div>
        <div className="date-value">
          <div>{format(currentTime, 'd MMMM')}</div>
          <div>{format(currentTime, 'yyyy')} AD</div>
        </div>
      </div>
    </div>
  );

  if (asCard) {
    return (
      <div className={`header-section ${className}`}>
        {content}
      </div>
    );
  }

  return content;
}
