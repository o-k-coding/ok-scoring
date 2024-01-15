import styles from './components-react-web.module.css';

/* eslint-disable-next-line */
export interface ComponentsReactWebProps {}

export function ComponentsReactWeb(props: ComponentsReactWebProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ComponentsReactWeb!</h1>
    </div>
  );
}

export default ComponentsReactWeb;
