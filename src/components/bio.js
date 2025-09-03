/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-transparent.png/" }) {
        childImageSharp {
          gatsbyImageData(width: 50, height: 50, layout: FIXED)
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            github
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  const image = getImage(data.avatar)
  return (
    <div class="flex items-center">
      <GatsbyImage
        image={image}
        alt={author.name}
      />
      <span class="pl-2">
        Brought to you with <span role="img" aria-label="heart">❤</span> and <span role="img" aria-label="coffee">☕</span> by <strong>{author.name}</strong>
        <nav>
          © {new Date().getFullYear()}, Built with{` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>,{` `}
          <a href="">TailwindCSS</a>, and deployed with{` `}
          <a href="https://aws.amazon.com/amplify/">Amplify</a>
        </nav>
      </span>
    </div>
  )
}

export default Bio
