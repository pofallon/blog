import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMdx.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <div class="grid lg:grid-cols-3 gap-6">
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          const image = getImage(node.frontmatter.image)
          return (
            <Link className="no-underline text-black" to={node.fields.slug} key={node.fields.slug}>
              <div class="bg-white rounded overflow-hidden shadow" >
                <GatsbyImage className="w-full h-32 sm:h-48 object-cover" image={image} alt={title} />
                <span class="font-bold pl-2">{title}</span>
                {/* <small class="block">{node.frontmatter.date}</small> */}
                <p class="text-sm pl-2 pb-2"
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: {order: DESC, fields: [frontmatter___date]}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            image {
              childImageSharp {
                gatsbyImageData(width: 500)
              }
            }
          }
        }
      }
    }
  }
`
