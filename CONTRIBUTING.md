# Contributing to Paul's Blog

Thank you for your interest in contributing! This document provides guidelines for setting up and working with this project locally.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pofallon/blog.git
   cd blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   The site will be available at:
   - Local: http://localhost:3000
   - Network: http://0.0.0.0:3000

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Start production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

This is a monorepo using npm workspaces with the following structure:

```
blog/
├── apps/
│   └── site-shell/          # Main Next.js application
│       ├── components/      # React components
│       ├── pages/           # Next.js pages and routing
│       ├── public/          # Static assets
│       ├── scripts/         # Build and validation scripts
│       └── styles/          # CSS/styling files
├── content/                 # Content files
│   ├── blog/               # Blog post markdown files
│   ├── images/             # Image assets
│   ├── merch/              # Merchandise data
│   └── projects.json       # Projects information
├── docs/                    # Documentation
│   ├── authoring-images.md
│   ├── content-structure.md
│   └── mdx-components.md
└── static/                  # Static assets
```

### Key Directories

- **`apps/site-shell/`**: The main Next.js application workspace
- **`content/blog/`**: Blog posts in Markdown/MDX format with deterministic URL slugs
- **`content/images/`**: Image assets used in blog posts
- **`docs/`**: Project documentation for content authoring and structure

## 🖼️ Image Guidelines

This section documents recommended dimensions, file locations, and formats for all image types used across the site.

### Blog Post Images

Blog post images are stored in `content/images/<post-slug>/` where `<post-slug>` matches your post's folder name in `content/blog/`.

| Image Type | Recommended Size | Aspect Ratio | Location |
|------------|-----------------|--------------|----------|
| Hero Image | 1920×1080px or larger | 16:9 | `content/images/<post-slug>/hero.jpg` |
| Inline Images | 1200px wide max | Any | `content/images/<post-slug>/<name>.<ext>` |

**Supported formats:** WebP (preferred), JPEG, PNG, GIF, AVIF, SVG

**File size limit:** Under 500KB (build warns if larger)

Example structure:
```
content/
├── blog/
│   └── my-post/
│       └── index.md
└── images/
    └── my-post/
        ├── hero.jpg          # Hero image (1920×1080+)
        ├── screenshot.png    # Inline image (1200px wide)
        └── diagram.svg       # Vector graphic
```

### Project Images

Project banner images are stored in `content/images/projects/<project-slug>/`.

| Image Type | Recommended Size | Aspect Ratio | Location |
|------------|-----------------|--------------|----------|
| Project Banner | 1920×1080px | 16:9 | `content/images/projects/<slug>/<name>_banner.jpg` |

Example:
```
content/images/projects/
├── maverick/
│   └── maverick_banner.jpg
└── deacon/
    └── deacon_banner.jpg
```

### Social Sharing / Open Graph Images

When sharing links on social media, the site uses hero images as Open Graph images.

| Platform | Recommended Size | Notes |
|----------|-----------------|-------|
| Open Graph (Facebook, LinkedIn) | 1200×630px | Hero images are auto-scaled |
| Twitter Card | 1200×630px | Uses `summary_large_image` card type |

**Note:** Blog hero images (16:9 ratio) work well for OG images. The system automatically uses the post's hero image for social sharing.

### Site Assets

Static site assets are stored in `apps/site-shell/public/`.

| Asset | Size | Location |
|-------|------|----------|
| Avatar | 160×160px (square) | `apps/site-shell/public/images/avatar.jpg` |
| Favicon | Standard .ico | `apps/site-shell/app/favicon.ico` |
| Default OG Image | 1200×630px | `apps/site-shell/public/assets/site-shell-og.svg` |

### Merch Product Images

Product images are referenced by URL in `content/merch/products.json`.

| Image Type | Recommended Size | Notes |
|------------|-----------------|-------|
| Hero Image | 1200×1200px | Square format works best for product display |
| Gallery Images | 1200×1200px | Up to 4 additional images per product |

### Image Best Practices

1. **Optimize before uploading** - Use tools like TinyPNG, Squoosh, or ImageOptim
2. **Use WebP when possible** - Better compression than JPEG with similar quality
3. **Provide meaningful alt text** - Required for accessibility
4. **Match slug names exactly** - Image directories must match post/project slugs (case-sensitive)

For detailed image authoring instructions, see [docs/authoring-images.md](docs/authoring-images.md).

---

## 📝 Working with Content

### Adding Blog Posts

Blog posts are stored in `content/blog/` with deterministic URL slugs. See [docs/content-structure.md](docs/content-structure.md) for detailed guidelines.

Quick reference:
```bash
# Preview a slug before publishing
npm run slug:preview -- "content/blog/my-post/index.md"

# Verify all slugs match the manifest
npm run verify-slugs

# Update manifest after adding new posts
npm run slug:update-manifest
```

### Documentation

- **Content Structure**: [docs/content-structure.md](docs/content-structure.md)
- **Authoring Images**: [docs/authoring-images.md](docs/authoring-images.md)
- **MDX Components**: [docs/mdx-components.md](docs/mdx-components.md)

## 🛠️ Available Scripts

All scripts can be run from the root directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run format` | Format code with Prettier |

### Workspace Scripts

Since this is a monorepo, you can also run scripts directly in the workspace:

```bash
# Run tests in the site-shell workspace
npm run test -w apps/site-shell

# Run type checking
npm run typecheck -w apps/site-shell

# Run E2E tests
npm run test:e2e -w apps/site-shell
```

## 🧪 Testing

- **Unit tests**: `npm test`
- **Watch mode**: `npm run test:watch -w apps/site-shell`
- **E2E tests**: `npm run test:e2e -w apps/site-shell`

## 📋 Code Quality

Before submitting changes:

1. **Format your code**
   ```bash
   npm run format
   ```

2. **Run linting**
   ```bash
   npm run lint
   ```

3. **Run type checking**
   ```bash
   npm run typecheck -w apps/site-shell
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 🐛 Troubleshooting

### Lockfile Issues / SWC Dependencies Warning

If you encounter Next.js lockfile errors or SWC dependency warnings:
```bash
# Remove yarn.lock to prevent yarn from interfering
rm -f yarn.lock

# Clean install with npm
rm -rf node_modules apps/*/node_modules
npm install
```

**Note**: This project uses npm, not yarn. Make sure `yarn.lock` doesn't exist, as Next.js may auto-detect it and cause installation conflicts.

### Port Already in Use

If port 3000 is already in use:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
