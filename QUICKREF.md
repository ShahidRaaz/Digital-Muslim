# 🕌 Digital Muslim Prayer Widget - Quick Reference

## 🎮 How to Use

### Launch the Widget
```bash
npm run dev
```
The widget opens in a desktop window with hot reload enabled.

### Access Settings
1. Click the **⚙️ Settings** button (top-right)
2. Customize:
   - **Theme**: Choose Light or Dark mode
   - **Location**: Enter your city name
   - **Hijri Adjustment**: Fine-tune Islamic date (±1, ±2, etc.)
3. Click **Save Changes**

### Build for Distribution
```bash
npm run build
```
Creates installers in: `src-tauri/target/release/bundle/`

---

## 📱 Widget Interface

```
┌─────────────────────────┐
│ 30 January, 2025    Mon │ ← Gregorian date
│ 5 Rabi' Al-Thaani, 1447 │ ← Hijri date
│         ⚙️ Settings      │ ← Settings button
├─────────────────────────┤
│                         │
│      12:35:00           │ ← Current time (updates every second)
│                         │
├─────────────────────────┤
│ AM/PM | Hyderabad       │ ← Time period & location
│         28°C • Cloudy   │ ← Weather
├─────────────────────────┤
│  "Indeed, with hardship │ ← Islamic quote
│    there is ease."      │
│        Surah Ashrah     │ ← Source
├─────────────────────────┤
│ Fajr     │ Sunrise 🌅  │ ← Prayer times
│ 04:35 AM │ 06:30 AM    │
├─────────────────────────┤
│ Dhuhr    │ A'sr        │
│ 12:15 PM │ 04:15 PM    │
├─────────────────────────┤
│ Maghrib  │ I'sha 🌙    │
│ 05:35 PM │ 06:45 PM    │
├─────────────────────────┤
│ Widget  │ Digital │ Powered by
│ Settings│ Muslim  │  Sadayah
└─────────────────────────┘
```

---

## 🎨 Theme Modes

### Light Mode (Default)
- Soft blue-gray background gradient
- Dark text on light backgrounds
- Teal accent color (#0b9d9d)
- Professional, clean look

### Dark Mode
- Deep teal-black background gradient
- White text on dark backgrounds
- Bright teal accent color (#00c9c9)
- Eye-friendly for night use

**Theme persists** → Automatically saves to browser storage

---

## 🛠️ Settings Guide

### Location Setting
- Enter any city name (e.g., "Hyderabad", "New York", "London")
- Prayer times update based on location coordinates
- To get accurate times, ensure location latitude/longitude is correct

### Hijri Adjustment
- Fine-tune the Islamic calendar date
- Range: typically -2 to +2 days
- Some regions observe Hijri date 1 day earlier or later
- Default: 0 (no adjustment)

### Theme Toggle
- **Light**: Best for daytime use
- **Dark**: Better for night viewing
- Toggle only available in Settings (as requested)
- Theme preference saved to localStorage

---

## 📁 File Locations

| Component | File |
|-----------|------|
| Main Widget | `src/PrayerWidget.tsx` |
| Settings Modal | `src/SettingsModal.tsx` |
| Styling | `src/PrayerWidget.css` + `src/SettingsModal.css` |
| Theme Manager | `src/ThemeContext.tsx` |
| Utilities | `src/utils.ts` |
| App Config | `src-tauri/tauri.conf.json` |

---

## 🔧 Customization Examples

### Change Widget Size
Edit `src-tauri/tauri.conf.json`:
```json
{
  "windows": [{
    "width": 450,      // Wider
    "height": 800      // Taller
  }]
}
```

### Add Custom Quote
Edit `src/utils.ts`:
```typescript
export const islamicQuotes = [
  { text: 'Your custom quote', source: 'Your source' },
  // ... more quotes
];
```

### Modify Colors
Edit `src/PrayerWidget.css`:
```css
[data-theme="light"] {
  --accent-teal: #0b9d9d;      // Change to your color
  --bg-primary: #f5f5f5;       // Background color
  --text-primary: #1a1a1a;     // Text color
}
```

### Change Prayer Time Display Format
Edit `src/utils.ts` `formatTime()` function:
```typescript
export function formatTime(date: Date): string {
  // Modify to show 24-hour format or other variations
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
```

---

## 🚀 Development Workflow

### 1. Start Dev Server
```bash
npm run dev
```
- Opens widget in desktop window
- Live reload on file changes
- DevTools available (Ctrl+Shift+I)

### 2. Edit Code
- Modify React components in `src/`
- Changes appear instantly in running widget

### 3. Test Theme
- Click ⚙️ Settings
- Toggle Light/Dark mode
- Verify colors and visibility

### 4. Test Prayer Times
- Update location in Settings
- Verify prayer times display correctly
- Check Hijri date conversion

### 5. Build & Package
```bash
npm run build
```

---

## 📊 Component Architecture

```
App (ThemeProvider wrapped)
│
└── PrayerWidget
    ├── Header (Date, Hijri, Settings button)
    ├── Time Display (HH:MM:SS)
    ├── Prayer Info (AM/PM, Location, Weather)
    ├── Quote Section
    │   └── Random Islamic quote
    ├── Prayer Times Grid (2 columns)
    │   ├── Fajr card
    │   ├── Sunrise card
    │   ├── Dhuhr card
    │   ├── A'sr card
    │   ├── Maghrib card
    │   └── I'sha card
    ├── Footer (Branding)
    │
    └── SettingsModal (when opened)
        ├── Theme Switcher
        ├── Location Input
        ├── Hijri Adjustment
        └── Save/Cancel buttons
```

---

## 🎯 Current Prayer Time Data

The widget uses **placeholder prayer times** for Hyderabad, India:
- **Fajr**: 04:35 AM
- **Sunrise**: 06:30 AM
- **Dhuhr**: 12:15 PM
- **A'sr**: 04:15 PM (adjusted)
- **Maghrib**: 05:35 PM
- **I'sha**: 06:45 PM

To use **real prayer times**, integrate an API:

```typescript
// Example: Using Aladhan Prayer Times API
async function getRealPrayerTimes(city: string) {
  const response = await fetch(
    `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=IN`
  );
  return response.json();
}
```

---

## 🐛 Common Issues

### "Theme not changing"
**Solution**: Close Settings modal and reopen. Theme persists to localStorage.

### "Prayer times look wrong"
**Solution**: Update location in Settings. Current times are hardcoded placeholders.

### "Text too small"
**Solution**: Edit `src/PrayerWidget.css` and increase font-size values.

### "Widget window too small"
**Solution**: Edit `src-tauri/tauri.conf.json` and adjust width/height.

---

## 💾 Data Persistence

Settings are saved to **browser localStorage**:
- Theme preference
- Location name
- Hijri adjustment value

These persist across widget sessions automatically.

---

## 🌐 Prayer Times APIs

Popular free APIs for real prayer times:

1. **Aladhan** (Most popular)
   ```
   https://api.aladhan.com/v1/timingsByCity?city=London&country=UK
   ```

2. **Islamic.Finder**
   ```
   https://www.islamic-finder.org/prayer-times/
   ```

3. **PrayerTimesAPI**
   ```
   https://www.prayer-times.api/
   ```

---

## 📖 Next Steps

1. **Install Rust** → https://rustup.rs
2. **Run Dev** → `npm run dev`
3. **Customize** → Edit colors, quotes, settings
4. **Integrate API** → Add real prayer times
5. **Build** → `npm run build` (when Rust installed)
6. **Distribute** → Share `.msi` (Windows) or `.dmg` (Mac)

---

## ✨ Features Implemented

- ✅ Real-time clock
- ✅ Prayer times display
- ✅ Gregorian date
- ✅ Hijri calendar with adjustment
- ✅ Islamic quotes
- ✅ Dark/Light theme
- ✅ Settings modal
- ✅ Location management
- ✅ Responsive design
- ✅ localStorage persistence

---

**Created**: March 8, 2026  
**Widget Type**: Islamic Prayer Times Desktop App  
**Tech Stack**: React 19, TypeScript, Tauri 2, Vite
