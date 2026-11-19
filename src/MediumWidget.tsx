import { useState, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { SettingsModal } from './SettingsModal';
import { DateCard } from './components/DateCard';
import { Clock } from './components/Clock';
import { SalahInfo } from './components/SalahInfo';
import { useWidgetData } from './hooks/useWidgetData';
import { DigitalMuslimLogo, HidayahFullLogo, LocationIcon, SettingsGearIcon } from './icons';
import './MediumWidget.css';

export function MediumWidget() {
  const {
    currentTime,
    location,
    locationError,
    currentPrayer,
    nextPrayer,
    countdown,
    hijriDateStr,
    showSettings,
    setShowSettings,
  } = useWidgetData();

  const [settingsView, setSettingsView] = useState<'all' | 'location'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ screenX: number; screenY: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingDeltaRef = useRef<{ deltaX: number; deltaY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastHeight = 0;
    let lastWidth = 0;

    const syncDimensions = () => {
      if (!containerRef.current) return;
      const appContainer = containerRef.current.closest('.app-container') as HTMLElement | null;
      const targetEl = appContainer || containerRef.current;
      const rect = targetEl.getBoundingClientRect();
      const w = Math.ceil(rect.width) || 375;
      const h = Math.ceil(
        Math.max(
          rect.height,
          targetEl.offsetHeight,
          targetEl.scrollHeight
        )
      );
      if (h > 100 && (Math.abs(h - lastHeight) > 1 || Math.abs(w - lastWidth) > 1)) {
        lastHeight = h;
        lastWidth = w;
        invoke('set_medium_window_size', { width: w, height: h }).catch(console.error);
      }
    };

    syncDimensions();
    timeoutId = setTimeout(syncDimensions, 100);

    document.fonts?.ready?.then(() => {
      syncDimensions();
    });

    const targetToObserve =
      (containerRef.current?.closest('.app-container') as HTMLElement | null) ||
      containerRef.current;

    let ro: ResizeObserver | null = null;
    if (targetToObserve) {
      ro = new ResizeObserver(() => {
        syncDimensions();
      });
      ro.observe(targetToObserve);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (ro) ro.disconnect();
    };
  }, [location]);

  const handlePointerDown = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      target.closest(
        'button, input, select, textarea, .medium-location-pill, .medium-options-btn, .settings-modal, .settings-backdrop'
      )
    ) {
      return;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsDragging(true);
    dragStartRef.current = { screenX: e.screenX, screenY: e.screenY };
    await invoke('start_medium_drag').catch(console.error);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const deltaX = e.screenX - dragStartRef.current.screenX;
    const deltaY = e.screenY - dragStartRef.current.screenY;

    pendingDeltaRef.current = { deltaX, deltaY };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(async () => {
        rafRef.current = null;
        if (pendingDeltaRef.current) {
          await invoke('move_medium_window', {
            deltaX: pendingDeltaRef.current.deltaX,
            deltaY: pendingDeltaRef.current.deltaY,
          }).catch(console.error);
        }
      });
    }
  };

  const handlePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (pendingDeltaRef.current) {
      await invoke('move_medium_window', {
        deltaX: pendingDeltaRef.current.deltaX,
        deltaY: pendingDeltaRef.current.deltaY,
      }).catch(console.error);
      pendingDeltaRef.current = null;
    }

    dragStartRef.current = null;
    setIsDragging(false);
    await invoke('end_medium_drag').catch(console.error);
  };

  if (!location) {
    return (
      <div
        ref={containerRef}
        className={`medium-widget ${isDragging ? 'dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="loading-state">
          {locationError ? (
            <div className="error-state">
              <p>{locationError}</p>
              <p className="error-message">Using default location</p>
            </div>
          ) : (
            <>
              <div className="spinner"></div>
              <p>Loading Widget...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`medium-widget ${isDragging ? 'dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 1. TOP HEADER */}
      <div className="medium-header">
        <div className="medium-brand">
          <div className="medium-logo-box">
            <DigitalMuslimLogo width={12} height={20} fill="var(--logo-text)" />
          </div>
          <div className="medium-brand-text">
            <span>Digital</span>
            <span>Muslim</span>
          </div>
        </div>

        <div className="medium-header-actions">
          <button
            type="button"
            className="medium-location-pill"
            onClick={(e) => {
              e.stopPropagation();
              setSettingsView('location');
              setShowSettings(true);
            }}
            title="Location Settings"
          >
            <span>{location.name}</span>
            <LocationIcon width={15} height={17} fill="var(--accent-primary)" />
          </button>

          <button
            type="button"
            className="medium-options-btn"
            onClick={(e) => {
              e.stopPropagation();
              setSettingsView('all');
              setShowSettings(true);
            }}
            title="Open Settings"
          >
            <SettingsGearIcon width={18} height={18} fill="var(--accent-primary)" />
          </button>
        </div>
      </div>

      {/* 2. DATES CARD (reused from long mode) */}
      <DateCard hijriDate={hijriDateStr} currentTime={currentTime} asCard />

      {/* 3. TIME & DAY CARD (reused from long mode) */}
      <Clock currentTime={currentTime} timezone={location.timezone} />

      {/* 4. SALAH INFO (reused from full mode) */}
      <SalahInfo
        currentPrayer={currentPrayer}
        nextPrayer={nextPrayer}
        countdown={countdown}
        variant="col"
      />

      {/* 5. FOOTER */}
      <div className="medium-footer">
        <span className="medium-footer-text">Powered by Hidayah</span>
        <div className="medium-hidayah-brand">
          <HidayahFullLogo width={68} height={20} fill="var(--accent-primary, #007575)" />
        </div>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        view={settingsView}
      />
    </div>
  );
}
