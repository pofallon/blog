# get2know.io

Paul's personal website — a Next.js 14 application featuring blog posts, project showcases, and a merchandise section.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/pofallon/blog.git
cd blog

# Install dependencies
npm install

# Run the development server
npm run dev
```

The site will be available at http://localhost:3000

### Other Commands

```bash
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run linting
npm test          # Run tests
npm run format    # Format code with Prettier
```

## Project Structure

This is a monorepo using npm workspaces:

```
blog/
├── apps/
│   └── site-shell/          # Main Next.js application
├── content/                 # Content files
│   ├── blog/               # Blog posts (Markdown/MDX)
│   ├── images/             # Image assets
│   ├── merch/              # Merchandise data
│   └── projects/           # Project pages (Markdown)
├── docs/                    # Content authoring documentation
├── specs/                   # Architecture decision records
└── static/                  # Static assets
```

### Content Sections

- **Blog** — MDX-powered posts in `content/blog/{slug}/index.md`, rendered at `/blog/{slug}`
- **Projects** — Showcases for personal projects (Deacon, Maverick, Newcleus, Remo) in `content/projects/`
- **Merch** — Merchandise catalog defined in `content/merch/products.json`

## Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Setup and development guidelines
- **[docs/content-structure.md](docs/content-structure.md)** - Blog post structure and conventions
- **[docs/authoring-images.md](docs/authoring-images.md)** - Image handling guidelines
- **[docs/mdx-components.md](docs/mdx-components.md)** - Available MDX components

## Content Management

### Adding Blog Posts

Blog posts are stored in `content/blog/` with deterministic URL slugs. See the [Content Structure Documentation](docs/content-structure.md) for folder naming conventions and how slugs are generated.

```bash
# Preview a slug before publishing
npm run slug:preview -- "content/blog/my-post/index.md"

# Verify all slugs match the manifest
npm run verify-slugs

# Update manifest after adding new posts
npm run slug:update-manifest
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
