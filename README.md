# Paul's Blog

A personal blog built with Next.js featuring blog posts, projects, and merchandise.

## 🚀 Quick Start

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

## 📁 Project Structure

This is a monorepo using npm workspaces:

```
blog/
├── apps/
│   └── site-shell/          # Main Next.js application
├── content/                 # Content files
│   ├── blog/               # Blog posts (Markdown/MDX)
│   ├── images/             # Image assets
│   ├── merch/              # Merchandise data
│   └── projects.json       # Projects information
├── docs/                    # Documentation
│   ├── authoring-images.md
│   ├── content-structure.md
│   └── mdx-components.md
└── static/                  # Static assets
```

## 📖 Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Setup and development guidelines
- **[docs/content-structure.md](docs/content-structure.md)** - Blog post structure and conventions
- **[docs/authoring-images.md](docs/authoring-images.md)** - Image handling guidelines
- **[docs/mdx-components.md](docs/mdx-components.md)** - Available MDX components

## 📝 Content Management

### Adding Blog Posts

Blog posts are stored in `content/blog/` with deterministic URL slugs. See the [Content Structure Documentation](docs/content-structure.md) for:

- Folder naming conventions
- How slugs are generated from folder names
- Preview and verification commands

Quick commands:

```bash
# Preview a slug before publishing
npm run slug:preview -- "content/blog/my-post/index.md"

# Verify all slugs match the manifest
npm run verify-slugs

# Update manifest after adding new posts
npm run slug:update-manifest
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed information on:

- Setting up the development environment
- Project structure and architecture
- Testing and code quality guidelines
- Troubleshooting common issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
