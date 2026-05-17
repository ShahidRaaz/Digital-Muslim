import fajr from '../assets/pricons/fajr.png';
import sunrise from '../assets/pricons/sunrise.png';
import dhuhr from '../assets/pricons/dhuhr.png';
import asr from '../assets/pricons/asr.png';
import maghrib from '../assets/pricons/maghrib.png';
import isha from '../assets/pricons/isha.png';
import './PrayerTimes.css';

interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface NextPrayerInfo {
  name: string;
  time: string;
  countdownSeconds: number;
}

interface CurrentPrayerInfo {
  name: string;
  time: string;
}

interface PrayerTimesProps {
  prayerTimes: PrayerTimesData | null;
  currentPrayer: CurrentPrayerInfo | null;
  nextPrayer: NextPrayerInfo | null;
}

const PRAYER_ICONS = {
  fajr,
  sunrise,
  dhuhr,
  asr,
  maghrib,
  isha,
};

export function PrayerTimes({ prayerTimes, currentPrayer, nextPrayer }: PrayerTimesProps) {
  if (!prayerTimes || !currentPrayer || !nextPrayer) return null;

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: String(hrs).padStart(2, '0'),
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
    };
  };

  const countdownFormatted = formatCountdown(nextPrayer.countdownSeconds);

  return (
    <>

      {/* Prayer Times Grid */}
      <div className="prayer-grid-section">
        {/* Prayer Status */}
      <div className="prayer-status-section">
        <div className="status-column">
          <div className="status-label">Now</div>
          <div className="prayer-time-now">{currentPrayer.name}</div>
        </div>

        <div className="status-column">
          <div className="status-label">Next</div>
          <div className="status-prayer">{nextPrayer.name}</div>
        </div>

        <div className="status-column">
          <div className="status-label">In</div>
          <div className="status-prayer">
            {`${countdownFormatted.hours}h ${countdownFormatted.minutes}m`}
          </div>
        </div>
      </div>

        <div className="prayer-row">
          <div className={`prayer-time-item ${currentPrayer.name === 'Fajr' ? 'current' : ''}`}>

            <div className="prayer-time-info">
              <span className="prayer-time-name">Fajr</span>
              <span className="prayer-time-value">{prayerTimes.fajr}</span>
            </div>

            <svg width="38" height="29" viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.7982 8.40275C20.2404 8.40246 19.6835 8.44752 19.1331 8.53747C18.9373 6.51449 18.1104 4.60429 16.7693 3.07709C15.4283 1.54988 13.641 0.482998 11.6603 0.0273631C11.4824 -0.0135036 11.2971 -0.00852513 11.1216 0.0418316C10.9462 0.0921884 10.7864 0.186274 10.6573 0.315265C10.5282 0.444257 10.4339 0.603929 10.3834 0.779309C10.3328 0.954689 10.3277 1.14003 10.3684 1.31796C10.6222 2.42381 10.6236 3.57264 10.3724 4.67909C10.1212 5.78555 9.62385 6.82116 8.91737 7.70898C8.21089 8.59681 7.31342 9.314 6.29165 9.80728C5.26988 10.3006 4.15008 10.5572 3.01547 10.5582C2.44472 10.5583 1.87578 10.4941 1.31938 10.3669C1.14136 10.326 0.955854 10.3309 0.78028 10.3814C0.604707 10.4318 0.444829 10.526 0.315663 10.6552C0.186496 10.7843 0.0922803 10.9442 0.0418631 11.1198C-0.00855407 11.2953 -0.0135179 11.4809 0.027438 11.6589C0.316969 12.9073 0.850308 14.0863 1.59682 15.1281C2.34333 16.1698 3.28831 17.0538 4.37747 17.7292C3.61146 18.7728 3.1496 20.0082 3.04312 21.2983C2.93665 22.5884 3.18973 23.8828 3.77428 25.0378C4.35884 26.1929 5.252 27.1633 6.35464 27.8415C7.45728 28.5197 8.72627 28.8791 10.0208 28.8798H20.7982C23.5136 28.8798 26.1178 27.8011 28.0379 25.881C29.958 23.9609 31.0367 21.3567 31.0367 18.6413C31.0367 15.9259 29.958 13.3216 28.0379 11.4015C26.1178 9.48145 23.5136 8.40275 20.7982 8.40275ZM2.66117 12.7137H3.01547C5.58711 12.7109 8.0526 11.688 9.87102 9.8696C11.6894 8.05118 12.7123 5.58569 12.7151 3.01405V2.65436C13.9571 3.23577 15.0157 4.14674 15.7758 5.28809C16.5359 6.42945 16.9684 7.75745 17.0261 9.12753C15.7102 9.65111 14.5166 10.4406 13.5198 11.4467C12.523 12.4527 11.7446 13.6536 11.2332 14.9743C10.8329 14.9044 10.4272 14.8693 10.0208 14.8692C8.57203 14.869 7.15928 15.3206 5.97926 16.1611C4.52976 15.4007 3.36561 14.1912 2.66117 12.7137Z" fill="var(--text-primary)"/>
            </svg>


          </div>

          <div className={`prayer-time-item ${currentPrayer.name === 'Sunrise' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">Sunrise</span>
              <span className="prayer-time-value">{prayerTimes.sunrise}</span>
            </div>
            <img src={PRAYER_ICONS.sunrise} alt="Sunrise" className="prayer-icon" />
          </div>
        </div>

        <div className="prayer-row">
          <div className={`prayer-time-item ${currentPrayer.name === 'Dhuhr' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">Dhuhr</span>
              <span className="prayer-time-value">{prayerTimes.dhuhr}</span>
            </div>
            <img src={PRAYER_ICONS.dhuhr} alt="Dhuhr" className="prayer-icon" />
          </div>

          <div className={`prayer-time-item ${currentPrayer.name === 'Asr' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">A'sr</span>
              <span className="prayer-time-value">{prayerTimes.asr}</span>
            </div>
            <img src={PRAYER_ICONS.asr} alt="Asr" className="prayer-icon" />
          </div>
        </div>

        <div className="prayer-row">
          <div className={`prayer-time-item ${currentPrayer.name === 'Maghrib' ? 'current' : ''}`}>
            <div className="prayer-time-info">
              <span className="prayer-time-name">Maghrib</span>
              <span className="prayer-time-value">{prayerTimes.maghrib}</span>
            </div>
            <img src={PRAYER_ICONS.maghrib} alt="Maghrib" className="prayer-icon" />
          </div>

          <div className={`prayer-time-item ${currentPrayer.name === 'Isha' ? 'current' : ''}`}>

            
            <div className="prayer-time-info" >
              <span className="prayer-time-name">Isha</span>
              <span className="prayer-time-value">{prayerTimes.isha}</span>
            </div>
            <svg width="35" height="33" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.89534 15.6153C7.07441 15.6153 8.15522 15.9346 9.13778 16.5733C10.1203 17.2119 10.845 18.084 11.3117 19.1893L11.6801 20.0368H12.6013C13.633 20.0368 14.4927 20.3994 15.1805 21.1245C15.8683 21.8496 16.2122 22.7153 16.2122 23.7214C16.2122 24.7531 15.856 25.6251 15.1437 26.3374C14.4313 27.0498 13.5593 27.406 12.5276 27.406H5.89534C4.27412 27.406 2.88626 26.8287 1.73176 25.6742C0.577252 24.5197 0 23.1319 0 21.5106C0 19.8649 0.577252 18.4706 1.73176 17.3279C2.88626 16.1852 4.27412 15.6143 5.89534 15.6153ZM17.7229 12.6308C19.1967 14.1046 20.898 15.2164 22.8268 15.9661C24.7555 16.7158 26.7634 17.0164 28.8503 16.8681C29.1205 16.8435 29.3603 16.8803 29.5696 16.9786C29.7789 17.0768 29.9567 17.2242 30.1031 17.4207C30.2495 17.6173 30.3478 17.826 30.3979 18.0471C30.448 18.2682 30.4357 18.5016 30.361 18.7472C29.5013 21.7194 27.7759 24.139 25.1849 26.0058C22.5939 27.8727 19.7627 28.8307 16.6912 28.8798C17.4772 28.2412 18.0854 27.4738 18.5158 26.5777C18.9462 25.6816 19.1608 24.7295 19.1599 23.7214C19.1599 22.051 18.6381 20.6082 17.5947 19.3927C16.5512 18.1773 15.2183 17.4463 13.5961 17.1997C12.8101 15.7995 11.7357 14.6941 10.3729 13.8835C9.01005 13.0729 7.51755 12.6676 5.89534 12.6676C5.1093 12.6676 4.34192 12.7659 3.59321 12.9624C2.8445 13.1589 2.13804 13.4537 1.47384 13.8467C1.52296 10.6288 2.46278 7.7794 4.29328 5.29844C6.12379 2.81748 8.54923 1.07344 11.5696 0.0663227C11.8153 -0.00736909 12.055 -0.0196512 12.2888 0.0294767C12.5227 0.0786045 12.7374 0.17686 12.9329 0.324244C13.1284 0.471628 13.2822 0.649962 13.3942 0.859246C13.5062 1.06853 13.549 1.30778 13.5224 1.577C13.3996 3.6895 13.6944 5.68557 14.4067 7.5652C15.1191 9.44483 16.2245 11.1334 17.7229 12.6308Z" fill="var(--text-primary)"/>
            </svg>
          </div>
          </div>
      </div>
    </>
  );
}
