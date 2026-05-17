// src/hooks/useTimeFormat.ts

import useSettingsStore from '../store/settingsStore';

/**
 * Returns the default time format of the system.
 * @returns '12h' or '24h'
 */
export function getSystemTimeFormat(): '12h' | '24h' {
  const options = new Intl.DateTimeFormat().resolvedOptions();
  return options.hour12 ? '12h' : '24h';
}

/**
 * A hook to get the current time format and a function to format a date object.
 * @returns An object containing the time format and a formatTime function.
 */
export function useTimeFormat() {
  const timeFormat = useSettingsStore((state) => state.timeFormat);

  const formatTimeParts = (date: Date, timezone?: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: timeFormat === '12h',
      timeZone: timezone,
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);

    const getPart = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value || '';

    return {
      hours: getPart('hour'),
      minutes: getPart('minute'),
      seconds: getPart('second'),
      ampm: getPart('dayPeriod'), // AM/PM
    };
  };

  const formatTimeString = (date: Date, timezone?: string) => {
    const { hours, minutes, ampm } = formatTimeParts(date, timezone);
    if (timeFormat === '12h') {
      return `${hours}:${minutes} ${ampm}`;
    }
    return `${hours}:${minutes}`;
  };

  return { timeFormat, formatTimeParts, formatTimeString };
}
