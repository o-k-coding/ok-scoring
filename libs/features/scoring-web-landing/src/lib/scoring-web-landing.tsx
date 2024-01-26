import PrivacyPolicy from './privacy-policy/privacy-policy';
import styles from './scoring-web-landing.module.css';

/* eslint-disable-next-line */
export interface ScoringWebLandingProps { }

export function ScoringWebLanding(props: ScoringWebLandingProps) {
  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>
        <img className={styles.logoImage} src={logo} alt='OK Enterprises Mountain Logo'></img> OK Scoring
      </h1> */}
      <p style={{ marginBottom: '50px' }}>
        Check out our app on the <a href="https://apps.apple.com/us/app/ok-scoring/id1534520395">iOS App Store</a> for all of your game scoring needs!
      </p>
      <div>
        <iframe
          className={styles.videoPlayer}
          width="700"
          height="550"
          src="https://www.youtube.com/embed/wouTGmPmTpg"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>
      </div>
      <PrivacyPolicy />
    </div>
  );
}

export default ScoringWebLanding;
