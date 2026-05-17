import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { isEnabled, enable, disable } from "@tauri-apps/plugin-autostart";
import useSettingsStore from "./store/settingsStore";
import { CitySearch } from "./components/CitySearch";
import "./SettingsModal.css";

interface SettingsModalProps {
  isOpen: boolean; // Indicates if the modal is currently open
  onClose: () => void; // Callback function to close the modal
}

// Declare the missing module to satisfy TypeScript.
// Ideally, this should be in a global declaration file or the @tauri-apps/api types should be correctly installed.
declare module "@tauri-apps/plugin-autostart" {
  export function isEnabled(): Promise<boolean>;
  export function enable(): Promise<void>;
  export function disable(): Promise<void>;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isStartupEnabled, setIsStartupEnabled] = useState(false); // State to track if autostart is enabled
  const [isProcessing, setIsProcessing] = useState(false); // State to prevent multiple clicks during processing
  const { timeFormat, setTimeFormat } = useSettingsStore();

  const notify = (title: string, body: string) => {
    invoke('show_notification', { title, body }).catch(console.error);
  };

  // 2. Handle the toggle
  const handleToggle = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    const newState = !isStartupEnabled;

    try {
      if (newState) {
        await enable();
      } else {
        await disable();
      }
      setIsStartupEnabled(newState); // Update state on success
      notify("Settings Applied", `Run on System Startup has been ${newState ? 'enabled' : 'disabled'}.`);
    } catch (error) {
      console.error("Failed to change startup settings:", error);
      alert(`Permission Denied: Please run the app as Administrator to change startup settings.`);
      notify("Settings Error", "Failed to change startup settings. Please run as Administrator.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 1. Check current status on mount
  useEffect(() => {
    isEnabled()
      .then((status: boolean) => setIsStartupEnabled(status)) // Explicitly type 'status'
      .catch((err: unknown) => console.error("Failed to check startup status:", err)); // Explicitly type 'err'
  }, []);

  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const settings = useSettingsStore(); 

  if (!shouldRender) return null;

  const handleThemeChange = (value: string) => {
    settings.setTheme(value as any);
  };

  const handleWindowModeChange = (val: string) => {
    settings.setWindowMode(val as 'sidebar' | 'fullscreen');
    localStorage.setItem('windowMode', val);
    invoke('set_window_mode', { mode: val }).catch(console.error);
    window.dispatchEvent(new Event('windowModeChanged'));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`settings-backdrop ${isOpen ? 'is-open fade-in' : 'fade-out'}`} 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`settings-modal ${isOpen ? 'is-open slide-up' : 'slide-down'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="settings-content">

          {/* Appearance */}

          <div className="settings-section">
            <label>Theme Appearance</label>
            <div className="switcher-group">
              {[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "auto", label: "Auto" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`switcher-btn ${settings.theme === opt.value ? "active" : ""}`}
                  onClick={() => handleThemeChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-section">
              <label>Display Mode</label>
              <div className="switcher-group">
                {[
                  { value: "sidebar", label: "Sidebar" },
                  { value: "fullscreen", label: "Full Screen" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`switcher-btn ${
                      (localStorage.getItem('windowMode') || "sidebar") === opt.value ? "active" : ""
                    }`}
                    onClick={() => handleWindowModeChange(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          {/* Time Display */}
            <div className="settings-section">
              <label>Time Format</label>
              <div className="switcher-group">
                <button
                  className={`switcher-btn ${timeFormat === '12h' ? 'active' : ''}`}
                  onClick={() => {
                    setTimeFormat('12h');
                  }}
                >
                  12-Hour
                </button>
                <button
                  className={`switcher-btn ${timeFormat === '24h' ? 'active' : ''}`}
                  onClick={() => {
                    setTimeFormat('24h');
                  }}
                >
                  24-Hour
                </button>
              </div>
            </div>

          {/* Location */}
          <div className="settings-section">
            <label>Location Mode</label>
            <div className="switcher-group">
              {[
                { value: "auto", label: "Automatic (GPS)" },
                { value: "manual", label: "Manual City" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`switcher-btn ${settings.locationMode === opt.value ? "active" : ""}`}
                  onClick={() => {
                    settings.setLocationMode(opt.value as 'auto' | 'manual');
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

                      
            {settings.locationMode === "manual" && (
              <div className="settings-section csearch">
                <label> Search City</label>
                <CitySearch />
              </div>
            )}
          </div>

          {/* Hijri */}
          <div className="settings-section">
            <label>Hijri Date Adjustment</label>
             <div className="adjustment-controls">
                <button
                  className="adj-btn"
                  onClick={() => {
                    const newVal = Math.max(-2, settings.hijriAdjustment - 1);
                    settings.setHijriAdjustment(newVal);
                  }}
                >
                  −
                </button>

                <input
                  type="text"
                  className="adjustment-input"
                  min="-2"
                  max="2"
                  value={settings.hijriAdjustment}
                  onChange={(e) => {
                    const newVal = Number(e.target.value);
                    settings.setHijriAdjustment(newVal);
                  }}
                />

                <button
                  className="adj-btn"
                  onClick={() => {
                    const newVal = Math.min(2, settings.hijriAdjustment + 1);
                    settings.setHijriAdjustment(newVal);
                  }}
                >
                  +
                </button>
                <small> Adjust by +/- 2 days</small>
              </div>
              
          </div>

          {/* Prayer Settings */}
          <div className="settings-group">
            <div className="settings-section">
              <label>Salah Time Calculation Method</label>
              <div className="switcher-group grid">
                {[
                  { value: "ISNA", label: "ISNA" },
                  { value: "MUSLIM_WORLD_LEAGUE", label: "Muslim World League" },
                  { value: "UMM_AL_QURA", label: "Umm Al-Qura" },
                  { value: "EGYPTIAN", label: "Egyptian" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`switcher-btn ${settings.calculationMethod === opt.value ? "active" : ""}`}
                    onClick={() => {
                      settings.setCalculationMethod(opt.value as any);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <label>Madhab for Salah Time</label>
              <div className="switcher-group">
                {[
                  { value: "SHAFI", label: "Shafi" },
                  { value: "HANAFI", label: "Hanafi" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`switcher-btn ${settings.madhab === opt.value ? "active" : ""}`}
                    onClick={() => {
                      settings.setMadhab(opt.value as any);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <label>Salah High Latitude Rule</label>
              <div className="switcher-group">
                {[
                  { value: "MIDDLE_OF_NIGHT", label: "Midnight" },
                  { value: "ANGLE_BASED", label: "Angle" },
                  { value: "ONE_SEVENTH", label: "1/7th" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`switcher-btn ${settings.highLatitudeRule === opt.value ? "active" : ""}`}
                    onClick={() => {
                      settings.setHighLatitudeRule(opt.value as any);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

            <div className="settings-group switch-group">
              <label>Salah Time Notification</label>
              <button
                type="button"
                className={`switch ${settings.enableAdhanNotification ? "is-on" : "is-off"}`}
                onClick={() => {
                  const newState = !settings.enableAdhanNotification;
                  settings.setEnableAdhanNotification(newState);
                  notify("Settings Applied", `Salah notifications ${newState ? 'enabled' : 'disabled'}.`);
                }}
                aria-pressed={settings.enableAdhanNotification}
                aria-label="Toggle Adhan Notification"
              >
                <span className="switch-thumb" />
              </button>
            </div>

            <div className="settings-section switch-group">
            <label>Run on System Startup</label>
            <button
              type="button"
              className={`switch ${isStartupEnabled ? "is-on" : "is-off"} ${isProcessing ? "opacity-50" : ""}`}
              onClick={handleToggle}
              disabled={isProcessing}
              aria-pressed={isStartupEnabled}
              aria-label="Toggle Startup Task"
            >
              <span className="switch-thumb" />
            </button>
            </div>

          </div>

        <div className="settings-footer">
          <button
            className="settings-done-btn"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
