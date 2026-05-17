import { TimeFormat } from './store/settingsStore';

/**
 * Formats a Date object into a time string based on the specified format.
 * @param date The Date object to format.
 * @param format The desired time format ('12h' or '24h').
 * @returns A formatted time string (e.g., "03:30:00 PM" or "15:30:00").
 */
export function formatTime(date: Date, format: TimeFormat): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  if (format === '12h') {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  } else { // 24h format
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Formats a 24-hour time string (HH:mm) into a 12-hour or 24-hour format.
 * @param time24 The 24-hour time string (e.g., "17:45").
 * @param format The desired time format ('12h' or '24h').
 * @returns A formatted time string (e.g., "05:45 PM" or "17:45").
 */
export function formatPrayerTime(time24: string, format: TimeFormat): string {
  if (!time24) return '';

  const [hours, minutes] = time24.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return '';


  if (format === '12h') {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } else { // 24h format
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
