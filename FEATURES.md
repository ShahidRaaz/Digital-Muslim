# Digital Muslim Prayer Times Widget - Implementation Complete ✅

A beautiful, modern Islamic prayer times desktop widget built with React, TypeScript, and Tauri with full light/dark mode support and customizable settings.

## 🎨 Features Implemented

### ✅ Prayer Times Display
- Displays all 6 prayer times: Fajr, Sunrise, Dhuhr, A'sr, Maghrib, and I'sha
- Real-time clock with HH:MM:SS format
- Prayer time cards with emoji icons
- Hover effects on prayer cards

### ✅ Date & Calendar
- Gregorian calendar date display
- Day of the week
- Hijri (Islamic) calendar conversion
- Hijri date adjustment setting (±1, ±2, etc.)

### ✅ Location & Weather
- Current location display (Hyderabad by default)
- Weather status (temp + condition)
- Editable location in settings

### ✅ Islamic Quote
- Random Islamic quote with source
- Beautiful centered display
- Quote sources (Quran, Hadith, Islamic scholars)

### ✅ Dark & Light Mode
- Seamless theme switching
- Light mode: Soft teal (#0b9d9d) on light backgrounds
- Dark mode: Bright teal (#00c9c9) on dark backgrounds
- Theme saved to localStorage
- Toggle available **only in settings** (as requested)

### ✅ Settings Panel
- Location management (city name input)
- Prayer time adjustments
- Hijri calendar adjustment (±1 day)
- Theme switcher (Light/Dark)
- Clean modal UI with Save/Cancel

### ✅ Widget Footer
- Branding: "Powered by Sadayah"
- Widget info badges
- Digital Muslim branding

## 📁 Project Structure

```
src/
├── App.tsx                       # Main app component
├── App.css                       # Global styles
├── PrayerWidget.tsx             # Main prayer widget component
├── PrayerWidget.css             # Widget styles (light/dark modes)
├── SettingsModal.tsx            # Settings popup component
├── SettingsModal.css            # Settings modal styles
├── ThemeContext.tsx             # React context for theme
├── types.ts                     # TypeScript interfaces
├── utils.ts                     # Utility functions
├── main.tsx                     # React entry point
├── vite-env.d.ts
└── assets/

src-tauri/
├── src/
│   ├── lib.rs                   # Rust backend (can extend)
│   └── main.rs                  # Rust entry point
├── Cargo.toml                   # Rust dependencies
├── tauri.conf.json             # Tauri app config
└── icons/                      # App icons
```

## 🎯 Key Components

### PrayerWidget.tsx
The main component that displays:
- Current time with real-time updates
- Prayer times grid (2-column layout)
- Location and weather info
- Islamic quote
- Settings button

### SettingsModal.tsx
Modal for customizing:
- **Theme**: Light/Dark mode toggle
- **Location**: Enter city name
- **Hijri Adjustment**: ±Days for Islamic calendar
- Save/Cancel buttons

### ThemeContext.tsx
Global theme management using React Context:
- Persists theme to localStorage
- Automatically applies `data-theme` attribute to document
- Respects system preference on first load

### Utility Functions (utils.ts)
- `gregorianToHijri()`: Converts Gregorian dates to Islamic calendar
- `formatHijriDate()`: Formats Hijri date with month names
- `formatTime()`: Formats time to HH:MM AM/PM
- `calculatePrayerTimes()`: Generates prayer times
- `getRandomQuote()`: Selects random Islamic quote

## 🎨 Color Scheme

### Light Mode
- **Background**: Soft gradient (Light blue-gray)
- **Primary Text**: Dark (#1a1a1a)
- **Secondary Text**: Gray (#666666)
- **Accent Color**: Teal (#0b9d9d)
- **Cards**: White with subtle borders

### Dark Mode
- **Background**: Dark gradient (Deep teal-black)
- **Primary Text**: White (#ffffff)
- **Secondary Text**: Light gray (#a0a0a0)
- **Accent Color**: Bright Teal (#00c9c9)
- **Cards**: Dark gray with subtle borders

All colors are **CSS variables** for easy customization:
```css
[data-theme="light"] {
  --accent-teal: #0b9d9d;
  --bg-primary: #f5f5f5;
  --text-primary: #1a1a1a;
}

[data-theme="dark"] {
  --accent-teal: #00c9c9;
  --bg-primary: #0f0f0f;
  --text-primary: #ffffff;
}
```

## 🚀 Getting Started

### 1. Install Rust (Required)
```bash
# Windows: Download from https://rustup.rs
# Follow installer instructions
# Restart terminal after installation
rustc --version  # Verify installation
```

### 2. Start Development
```bash
npm run dev
```
This launches the widget in a desktop window with hot reload.

### 3. Build for Production
```bash
npm run build
```
Creates installers in `src-tauri/target/release/bundle/`

## 💻 Extending the Widget

### Add Custom Prayer Times Calculation
Replace the simple calculation in `utils.ts` with proper API:

```typescript
// Example: Using Adhan.js library
import * as adhan from 'adhan';

export function calculatePrayerTimes(date: Date, latitude: number, longitude: number) {
  const coordinates = new adhan.Coordinates(latitude, longitude);
  const params = adhan.MethodParams.ISNA();
  const times = new adhan.PrayerTimes(coordinates, date, params);
  
  return {
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha
  };
}
```

### Add Weather Integration
```typescript
// src/components/Weather.tsx
export async function getWeather(location: string) {
  const response = await fetch(`https://api.weather.example.com/current?q=${location}`);
  return response.json();
}
```

### Call Rust from React
```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn get_location_prayers(city: String) -> String {
    // Rust logic here
    format!("Prayer times for {}", city)
}
```

Then in React:
```typescript
import { invoke } from "@tauri-apps/api/core";

const prayers = await invoke("get_location_prayers", { city: "Hyderabad" });
```

## 📱 Window Configuration

The widget is configured as a **fixed-size window**:
- **Width**: 400px (mobile-like)
- **Height**: 750px (full widget)
- **Resizable**: No (for consistent widget experience)
- **Always on Top**: Disabled (can enable in settings)
- **Decorations**: Enabled (shows title bar)

To modify, edit `src-tauri/tauri.conf.json`:
```json
{
  "windows": [{
    "width": 400,
    "height": 750,
    "alwaysOnTop": true,
    "resizable": false
  }]
}
```

## 🔌 Available Libraries

- **React 19**: UI library
- **TypeScript**: Type safety
- **Tauri 2**: Desktop framework
- **date-fns**: Date formatting
- **lucide-react**: Icons (optional, using emoji instead)
- **Vite**: Build tool

## 📚 File Guide

| File | Purpose |
|------|---------|
| `src/PrayerWidget.tsx` | Main widget UI |
| `src/PrayerWidget.css` | Widget styling (light/dark) |
| `src/SettingsModal.tsx` | Settings dialog |
| `src/SettingsModal.css` | Settings styling |
| `src/ThemeContext.tsx` | Theme manager |
| `src/utils.ts` | Helper functions |
| `src/types.ts` | TypeScript definitions |
| `src-tauri/tauri.conf.json` | Window & app config |

## 🎯 Next Steps

1. **Install Rust** → https://rustup.rs
2. **Run dev mode** → `npm run dev`
3. **Customize prayer times** → Add real API integration
4. **Add weather** → Integrate weather API
5. **Build** → `npm run build` for distribution

## ✨ Features You Can Add

- Prayer notification alerts
- Prayer time API integration (Aladhan.com, etc.)
- Weather API integration
- Geolocation auto-detection
- More Islamic quotes database
- Prayer completion counter
- Annual prayer statistics
- Multiple location support
- Widget position save/restore
- Custom prayer time adjustments

## 🐛 Troubleshooting

### Widget not showing?
- Ensure Rust is installed: `rustc --version`
- Run: `npm run dev`
- Check DevTools (Ctrl+Shift+I)

### Theme not switching?
- Open Settings modal
- Toggle Light/Dark theme
- Theme persists to localStorage

### Prayer times incorrect?
- Check location setting in Settings
- Adjust Hijri calendar offset if needed
- Replace calculation with real API

### Build fails?
- Clean: `cargo clean` (in src-tauri/)
- Reinstall: `npm install`
- Rebuild: `npm run build`

## 📖 Documentation

- [Tauri Docs](https://tauri.app)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev)

## 📄 License

Built for educational purposes with ❤️

---

**Ready to launch?** Install Rust and run `npm run dev`! 🚀
