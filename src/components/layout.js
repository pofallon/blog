import React from 'react'
import { Link } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import * as Processors from '../components/processors'
import Playlist from '../components/playlist'
import Bio from "../components/bio"

const components = { Playlist, ...Processors }

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1 class="font-header text-4xl lg:text-6xl font-black">
        <Link className="no-underline text-black" to={`/`}>{title}</Link>
      </h1>
    )
  } else {
    header = (
      <h3 class="font-header text-4xl font-black">
        <Link className="no-underline text-black" to={`/`}>{title}</Link>
      </h3>
    )
  }
  return (
    <div class="flex flex-col px-6 max-w-4xl">
      <header>{header}</header>
      <MDXProvider components={components}>
        <main className="">{children}</main>
      </MDXProvider>
      <div class="lg:flex justify-between items-end mt-4">
        <Bio />
        <nav>
          © {new Date().getFullYear()}, Built with{` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>{` `}
          and deployed with <a href="https://aws.amazon.com/amplify/">Amplify</a>
        </nav>
      </div>
    </div>
  )
}

export default Layout
