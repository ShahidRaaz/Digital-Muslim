import { useEffect, useState } from 'react';

interface QuranQuote {
  arabic: string;
  text: string;
  source: string;
}

const QURAN_QUOTE_CACHE_KEY = 'digital-muslim-quran-quote-v4';

const SHORT_QURAN_QUOTES: QuranQuote[] = [
  {
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    text: 'Indeed, with hardship comes ease.',
    source: 'Surah Ash-Sharh 94:6',
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    text: 'So remember Me; I will remember you.',
    source: 'Surah Al-Baqarah 2:152',
  },
  {
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    text: 'And say: My Lord, increase me in knowledge.',
    source: 'Surah Ta-Ha 20:114',
  },
  {
    arabic: 'وَتَوَكَّلْ عَلَى اللَّهِ',
    text: 'And rely upon Allah.',
    source: 'Surah Al-Ahzab 33:3',
  },
  {
    arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    text: 'And your Lord is going to give you, and you will be satisfied.',
    source: 'Surah Ad-Duha 93:5',
  },
  {
    arabic: 'إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ',
    text: 'Indeed, my Lord is near and responsive.',
    source: 'Surah Hud 11:61',
  },
  {
    arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
    text: 'And He is with you wherever you are.',
    source: 'Surah Al-Hadid 57:4',
  },
  {
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    text: 'Indeed, Allah is with the patient.',
    source: 'Surah Al-Baqarah 2:153',
  },
  {
    arabic: 'إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ',
    text: 'Indeed, my Lord is with me; He will guide me.',
    source: 'Surah Ash-Shu\'ara 26:62',
  },
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    text: 'And whoever relies upon Allah, then He is sufficient for him.',
    source: 'Surah At-Talaq 65:3',
  },
];

const FALLBACK_QUOTE: QuranQuote = SHORT_QURAN_QUOTES[0];

function readCachedQuote(): QuranQuote | null {
  try {
    const raw = localStorage.getItem(QURAN_QUOTE_CACHE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<QuranQuote>;

    if (
      typeof parsed.arabic === 'string' &&
      typeof parsed.text === 'string' &&
      typeof parsed.source === 'string'
    ) {
      return { arabic: parsed.arabic, text: parsed.text, source: parsed.source };
    }
  } catch {}

  return null;
}

function writeCachedQuote(quote: QuranQuote) {
  try {
    localStorage.setItem(QURAN_QUOTE_CACHE_KEY, JSON.stringify(quote));
  } catch {}
}

function getRandomShortQuote() {
  const randomIndex = Math.floor(Math.random() * SHORT_QURAN_QUOTES.length);
  return SHORT_QURAN_QUOTES[randomIndex];
}

export function useQuranQuote() {
  const [quote, setQuote] = useState<QuranQuote>(() => {
    return readCachedQuote() ?? FALLBACK_QUOTE;
  });

  useEffect(() => {
    const nextQuote = getRandomShortQuote();
    writeCachedQuote(nextQuote);
    setQuote(nextQuote);
  }, []);

  return { quote };
}
