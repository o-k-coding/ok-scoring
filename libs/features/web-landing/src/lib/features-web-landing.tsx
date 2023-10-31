import styles from './features-web-landing.module.css';
import PrivacyPolicy from './privacy-policy/privacy-policy';

/* eslint-disable-next-line */
export interface FeaturesWebLandingProps { }

export function FeaturesWebLanding(props: FeaturesWebLandingProps) {
  return (
    <div className={styles.container}>
      <p style={{ margin: '50px' }}>
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

export default FeaturesWebLanding;
