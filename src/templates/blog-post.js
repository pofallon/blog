import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.mdx
  const siteTitle = data.site.siteMetadata.title
  const image = getImage(post.frontmatter.image)
  // const image = post.frontmatter.image

  const playlists = { }

  // Only process playlists if they exist (when YT_KEY is available)
  if (post.children) {
    post.children.forEach(p => {
      if (p.name && p.title && p.children) {
        playlists[p.name] = {
          title: p.title,
          videos: p.children
        }
      }
    })
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        // thumbnail={image}
      />
      <article class="prose md:prose-lg">
        <header class="flex flex-col items-center">
          <GatsbyImage className="w-full h-32 sm:h-48 object-cover" image={image} alt={post.frontmatter.title} />
          <h1 class="pt-4">{post.frontmatter.title}</h1>
          <span>{post.frontmatter.date}</span>
        </header>
        <MDXRenderer>{post.body}</MDXRenderer>
      </article>
      <hr />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        image {
          childImageSharp {
<<<<<<< HEAD
            gatsbyImageData(width: 500)
=======
            fluid(maxWidth: 500) {
              ...GatsbyImageSharpFluid
            }
>>>>>>> master
          }
        }
      }
    }
  }
`
