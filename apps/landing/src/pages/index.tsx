import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';


import styles from './index.module.scss';
import PrivacyPolicy from './privacy-policy/PrivacyPolicy';

export function Index({ data }) {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./landing.scss file.
   */
  return (
    <div className={styles.page}>
      <header>
        <div>
          <Img fixed={data.splashImage.childImageSharp.fixed} alt='ok scoring logo' />
        </div>
        <h1>OK Scoring</h1>
      </header>
      <main>
        <p style={{ margin: '50px' }}>
          Check out our app on the <a href="https://apps.apple.com/us/app/ok-scoring/id1534520395">iOS App Store</a> for all of your game scoring needs!
        </p>
        <div>
          <iframe
            width="700"
            height="550"
            src="https://www.youtube.com/embed/wouTGmPmTpg"
            title="YouTube video player"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen>
          </iframe>
        </div>
        <PrivacyPolicy />
      </main>
    </div>
  );
}

export default Index;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    splashImage: file(relativePath: { eq: "splash.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
