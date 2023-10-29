import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to ok-scoring-web!</title>
      </Head>
      <div className="app">
        <header className="flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-adaptive.png" alt="OK Scoring logo" width="75" height="75" />
          <h1>Welcome to ok-scoring-web!</h1>
        </header>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default CustomApp;
