import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from 'gatsby-image';

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      bioImage: file(relativePath: { eq: "australasia.jpg" }) {
        childImageSharp {
          fixed(width: 300, height: 300, quality: 95) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `);

  console.log(data);

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author

  const bioImage = data?.bioImage?.childImageSharp?.fixed;

  return (
    <figure className="flex flex-row justify-center py-10">
      <div className="flex flex-col justify-center items-center mr-10">
        <Img fixed={bioImage} alt="dust and disquiet" />
      </div>
      <figcaption className="flex flex-col justify-evenly items-center ml-10">
        <h3 className="text-3xl">Some Cool Stuff About Michael</h3>
        {
          author?.summary?.map((paragraph, i) => (<p key={i}>{paragraph}</p>))
        }
      </figcaption>
    </figure>
  )
}

export default Bio
