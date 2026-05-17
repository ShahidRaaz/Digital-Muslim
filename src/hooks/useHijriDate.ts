import { useState, useEffect } from "react";
import useSettingsStore from "../store/settingsStore";

interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
}

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

/**
 * Convert Gregorian date to Hijri using built-in Islamic calendar
 */
function gregorianToHijri(date: Date): HijriDate {
  const formatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const parts = formatter.formatToParts(date);

  const day = Number(parts.find((p) => p.type === "day")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const monthName = HIJRI_MONTHS[month - 1];

  return { day, month, year, monthName };
}

export function useHijriDate(currentDate: Date, timezone?: string) {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");

  const hijriAdjustment = useSettingsStore((state) => state.hijriAdjustment);

  useEffect(() => {
    // apply adjustment (+1 / -1 days)
    const adjustedDate = timezone
  ? new Date(new Date().toLocaleString("en-US",{timeZone:timezone}))
  : new Date(currentDate);
    adjustedDate.setDate(adjustedDate.getDate() + hijriAdjustment);

    const hijri = gregorianToHijri(adjustedDate);

    setHijriDate(hijri);

    const formatted = `${hijri.day} ${HIJRI_MONTHS[hijri.month - 1]} ${hijri.year} AH`;

    setFormattedDate(formatted);
  }, [currentDate, hijriAdjustment]);

  return { hijriDate, formattedDate };
}