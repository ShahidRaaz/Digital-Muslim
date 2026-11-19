import { DigitalMuslimLogo, SettingsGearIcon, HidayahLogo } from '../icons';
import './Footer.css';

interface FooterProps {
  onSettingsClick: () => void;
}

export function Footer({ onSettingsClick }: FooterProps) {
  return (
    <div className="footer-section">
      <div className="footer-col">
        <DigitalMuslimLogo width={16} height={25} fill="var(--accent-primary)" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="footer-text">Digital</div>
          <div className="footer-text">Muslim</div>
        </div>
      </div>

      <button className="footer-col wsb" onClick={onSettingsClick} title="Open Settings" aria-label="Open Settings">
        <SettingsGearIcon width={22} height={25} fill="var(--accent-primary)" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="footer-text">Widget</div>
          <div className="footer-text">Settings</div>
        </div>
      </button>

      <div className="footer-col">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="footer-text">Powered</div>
          <div className="footer-text">by Hidayah</div>
        </div>
        <HidayahLogo width={13} height={28} fill="var(--accent-primary)" />
      </div>
    </div>
  );
}
