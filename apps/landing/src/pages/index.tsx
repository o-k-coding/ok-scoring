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
          Check out our app on the IOS App Store for all of your game scoring needs!
        </p>
        <div>
          <Img fixed={data.appHomeImage.childImageSharp.fixed} alt='ok scoring app home screen' />
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

    appHomeImage: file(relativePath: { eq: "app-home.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
