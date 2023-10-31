import styles from './index.module.css';
import { FeaturesWebLanding } from '@ok-scoring/features/web-landing';
export function Index() {
  return (
    <div className={styles.page}>
      <FeaturesWebLanding></FeaturesWebLanding>
    </div>
  );
}

export default Index;
