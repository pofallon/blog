const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const PlaylistSummary = require('youtube-playlist-summary')
const ps = new PlaylistSummary({ GOOGLE_API_KEY: process.env.YT_KEY })

exports.createPages = async (props) => {

  // console.log(props.actions)
  await createBlogPosts(props)

}

createBlogPosts = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                playlists {
                  name
                  id
                }
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMdx.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

}

exports.onCreateNode = async ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  const { createNode, createNodeField, createParentChildLink } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })

    if (node.frontmatter.playlists) {
      // console.log(`Adding ${Object.keys(node.frontmatter.playlists).length} playlist children to node ${node.id}...`)
      const playlistChildren = await Promise.all(node.frontmatter.playlists.map(async (playlist) => {
        // console.log(`Fetching playlist ${playlist.id} as ${playlist.name}`)
        const results = await ps.getPlaylistItems(playlist.id)
        const videoChildren = results.items.map(item => {
          const videoNode = {
            id: item.videoId,
            title: item.title,
            description: item.description,
            date: item.publishedAt,
            url: item.videoUrl,
            parent: playlist.id,
            internal: {
              type: 'playlistVideo',
              contentDigest: createContentDigest(item.videoId)
            }
          }
          createNode(videoNode)
          return(item.videoId)
        })
        // console.log(videoChildren)
        const playlistNode = {
          id: playlist.id,
          title: results.playlistTitle,
          name: playlist.name,
          parent: createNodeId(`${node.id}-playlists`),
          children: videoChildren,
          internal: {
            type: 'playlist',
            contentDigest: createContentDigest(playlist.id)
          }
        }
        createNode(playlistNode)
        return(playlist.id)
      }))

      const playlistsParent = {
        id: createNodeId(`${node.id}-playlists`),
        children: playlistChildren,
        internal: {
          type: 'playlistCollection',
          contentDigest: createContentDigest(playlistChildren)
        }
      }

      createNode(playlistsParent)
      createParentChildLink({ parent: node, child: playlistsParent })
    }
  }
}