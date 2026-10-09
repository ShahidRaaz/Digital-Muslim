import { useTimeFormat } from '../hooks/useTimeFormat';
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
          <span className="timer-label">hrs</span>
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
            <svg
              width="17"
              height="16"
              viewBox="0 0 19 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.93002 0.355247C8.33102 0.122556 8.7864 0 9.25002 0C9.71364 0 10.169 0.122556 10.57 0.355247L10.571 0.356247L17.182 4.15625C17.5834 4.38964 17.9165 4.7244 18.1478 5.127C18.3791 5.52961 18.5006 5.98592 18.5 6.45025V14.0532C18.499 14.5169 18.3769 14.9722 18.1457 15.374C17.9145 15.7759 17.5823 16.1103 17.182 16.3442L17.179 16.3462L10.571 20.1452H10.569C10.1681 20.3778 9.71294 20.5002 9.24952 20.5002C8.78609 20.5002 8.3309 20.3778 7.93002 20.1452H7.92902L1.32102 16.3452H1.31802C0.91578 16.1126 0.582091 15.7778 0.350667 15.3748C0.119244 14.9719 -0.0017134 14.5149 1.83367e-05 14.0502V6.44825C0.00100502 5.98463 0.123147 5.52932 0.354335 5.12746C0.585523 4.7256 0.917729 4.39115 1.31802 4.15725L1.32102 4.15525L7.93002 0.355247ZM10 4.25025C10 4.05133 9.921 3.86057 9.78035 3.71992C9.6397 3.57926 9.44893 3.50025 9.25002 3.50025C9.05111 3.50025 8.86034 3.57926 8.71969 3.71992C8.57904 3.86057 8.50002 4.05133 8.50002 4.25025V10.2502C8.50002 10.5342 8.66002 10.7942 8.91502 10.9202L12.915 12.9202C13.0035 12.9701 13.1013 13.0015 13.2023 13.0125C13.3033 13.0234 13.4055 13.0137 13.5027 12.984C13.5999 12.9543 13.69 12.9051 13.7675 12.8395C13.8451 12.7738 13.9086 12.6931 13.954 12.6022C13.9994 12.5114 14.0259 12.4122 14.0319 12.3107C14.0378 12.2093 14.0231 12.1077 13.9886 12.0121C13.9541 11.9166 13.9005 11.829 13.8312 11.7548C13.7618 11.6805 13.678 11.6211 13.585 11.5802L10 9.78725V4.25025Z"
                fill="var(--accent-primary)"
              />
            </svg>
            {ampm}
          </div>
        )}
        <div className="day-badge">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.68555 0C5.33348 0 5.85694 0.523464 5.85694 1.17139V2.34278H10.5425V1.17139C10.5425 0.523464 11.066 0 11.7139 0C12.3618 0 12.8853 0.523464 12.8853 1.17139V2.34278H14.0567C15.3489 2.34278 16.3994 3.39337 16.3994 4.68556V15.2281C16.3994 16.5202 15.3489 17.5708 14.0567 17.5708H2.34278C1.05059 17.5708 0 16.5202 0 15.2281V4.68556C0 3.39337 1.05059 2.34278 2.34278 2.34278H3.51417V1.17139C3.51417 0.523464 4.03763 0 4.68555 0ZM4.68555 9.37111C4.03763 9.37111 3.51417 9.89458 3.51417 10.5425V12.8853C3.51417 13.5332 4.03763 14.0567 4.68555 14.0567H7.02833C7.67626 14.0567 8.19972 13.5332 8.19972 12.8853V10.5425C8.19972 9.89458 7.67626 9.37111 7.02833 9.37111H4.68555Z"
              fill="var(--accent-primary)"
            />
          </svg>
          {dayName}
        </div>
      </div>
    </div>
  );
}