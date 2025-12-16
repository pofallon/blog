# Next.js Site Shell

Persistent header, navigation, footer, and placeholder routes for the Get2Know migration program. The app lives under `apps/site-shell` inside this monorepo.

## Stack

- **Framework:** Next.js 14 App Router + React 18
- **Styling:** Tailwind CSS with custom CSS tokens
- **Tooling:** TypeScript (strict), ESLint flat config, Prettier (with Tailwind plugin)
- **Testing:** Jest + Testing Library, Playwright (Chromium/Firefox/WebKit)
- **APIs:** `/api/navigation`, `/api/metadata`, `/api/placeholders/[slug]`

## Scripts

| Command                                         | Description                                     |
| ----------------------------------------------- | ----------------------------------------------- |
| `npm run dev --workspace apps/site-shell`       | Start the dev server on `http://localhost:3000` |
| `npm run build --workspace apps/site-shell`     | Production build (emits `.next/`)               |
| `npm run start --workspace apps/site-shell`     | Serve the production build                      |
| `npm run lint --workspace apps/site-shell`      | ESLint via flat config                          |
| `npm run typecheck --workspace apps/site-shell` | `tsc --noEmit`                                  |
| `npm run test --workspace apps/site-shell`      | Jest unit tests                                 |
| `npm run test:e2e --workspace apps/site-shell`  | Playwright navigation suite                     |
| `npm run format --workspace apps/site-shell`    | Format with Prettier                            |

> ℹ️ This repo uses `install-strategy=nested` to avoid React 16/18 conflicts. Each workspace keeps its own `node_modules`.

## Getting Started

```bash
npm install
npm run dev --workspace apps/site-shell
```

Optional env vars:

| Name                   | Purpose                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Used to populate `metadataBase` for social sharing (defaults to `https://get2know.io`). |

## Testing & E2E

1. Install Playwright browsers & system deps once:

   ```bash
   npx playwright install
   sudo /home/vscode/.nvm/versions/node/v24.12.0/bin/npx playwright install-deps
   ```

2. Run unit tests:

   ```bash
   npm run test --workspace apps/site-shell
   ```

3. Run e2e navigation smoke:

   ```bash
   npm run test:e2e --workspace apps/site-shell
   ```

Playwright start-up automatically boots `npm run dev`; it expects port `3000` unless `PLAYWRIGHT_BASE_URL` is set.

## API Contracts

| Route                      | Method | Response                                       |
| -------------------------- | ------ | ---------------------------------------------- |
| `/api/navigation`          | GET    | `{ links: NavigationLink[] }`                  |
| `/api/metadata`            | GET    | `SiteMetadata`                                 |
| `/api/placeholders/[slug]` | GET    | `PlaceholderPage` (200) or `{ message }` (404) |

Schemas are defined in `specs/002-nextjs-app-shell/contracts/site-shell.openapi.yaml`.

## Placeholder Routes

| Path         | Purpose                                       |
| ------------ | --------------------------------------------- |
| `/`          | Home migration hub summary                    |
| `/blog`      | Editorial feed placeholder                    |
| `/projects`  | Build tracker placeholder                     |
| `/merch`     | Commerce experiment placeholder               |
| `/not-found` | Branded fallback linking back to valid routes |

All placeholder copy is sourced from `lib/placeholders.ts` and rendered via `PlaceholderShowcase`.

## MDX Content

The site supports MDX content at `/posts/[slug]`. Files are placed in `/content/posts/` at the monorepo root.

### Adding MDX Posts

1. Create an `.mdx` file in `content/posts/`:
   ```
   content/posts/my-new-post.mdx
   ```

2. Add required frontmatter:
   ```yaml
   ---
   title: "My Post Title"
   date: "2025-12-15"
   description: "Brief description (max 200 chars)"
   ---
   ```

3. Write your content in Markdown/MDX after the frontmatter.

4. The file will be available at `/posts/my-new-post` after build.

See [quickstart.md](../../specs/003-add-mdx-support/quickstart.md) for full documentation.

### MDX File Structure

```
content/posts/           # MDX content directory
├── demo-mdx.mdx        # Demo entry

apps/site-shell/
├── lib/mdx/            # MDX utilities
│   ├── types.ts        # Type definitions
│   ├── parser.ts       # Frontmatter parsing
│   ├── loader.ts       # File loading
│   └── validator.ts    # Zod schema validation
├── components/mdx/     # MDX components
│   ├── index.ts        # Component whitelist
│   └── MDXContent.tsx  # MDX renderer
└── app/posts/[slug]/   # Dynamic route
    └── page.tsx        # Post page component
```

## Known Warnings

- `next` prints `lockfile missing swc dependencies` in this workspace because the repo mixes Gatsby + Next. SWC binaries are installed, and builds succeed despite the warning.
- Playwright may log GTK dependency messages until `playwright install-deps` runs.

## Deployment (AWS Amplify)

| Step                 | Command / Notes                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Install dependencies | `npm ci` at repo root (Amplify build container)                                                                       |
| Build                | `npm run build --workspace apps/site-shell` (Amplify’s Next preset automatically runs `next build`)                   |
| Start                | `npm run start --workspace apps/site-shell`                                                                           |
| Environment          | Set `NEXT_PUBLIC_SITE_URL` to the Amplify preview or production domain so `metadataBase` emits correct absolute URLs. |
| Artifacts            | Deploy the `.next/` directory produced within `apps/site-shell`; Amplify maps it to the SSR handler.                  |

Post-deploy verification: run `npm run test:e2e --workspace apps/site-shell -- --project=chromium --headed` locally, then smoke `/`, `/blog`, `/projects`, and `/merch` on the deployed branch to confirm navigation parity.

## Monitoring & Operational TODOs

- [ ] Connect the Amplify app to CloudWatch alarms that page on sustained 5xx errors from the SSR Lambda.
- [ ] Schedule the Playwright navigation suite via GitHub Actions (daily) and surface failures in Slack.
- [ ] Add Route 53 health checks for `/` and `/blog` once the Amplify branch is publicly reachable.
- [ ] Record error budget dashboards (Core Web Vitals + uptime) once traffic is available.

## Maintenance

| Command                                        | When (UTC)       | Notes                                              |
| ---------------------------------------------- | ---------------- | -------------------------------------------------- |
| `npm run format --workspace apps/site-shell`   | 2025-12-15 20:16 | ✅ Prettier (`--write .`) - no files modified      |
| `npm run lint --workspace apps/site-shell`     | 2025-12-15 20:16 | ✅ ESLint clean (0 errors / 0 warnings)            |

## Verification Log

| Command                                        | When (UTC)       | Result                                     |
| ---------------------------------------------- | ---------------- | ------------------------------------------ |
| `npm run dev --workspace apps/site-shell`      | 2025-12-15 19:55 | ✅ Ready in ~1.7 s (SWC warning expected)  |
| `npm run test --workspace apps/site-shell`     | 2025-12-15 19:44 | ✅ Jest (6 tests, ~1.8 s)                  |
| `npm run test:e2e --workspace apps/site-shell` | 2025-12-15 19:49 | ✅ Playwright (15 tests, ~9.2 s)           |
| `npm run build --workspace apps/site-shell`    | 2025-12-15 19:53 | ✅ Production build (SWC warning expected) |

Add new entries here when re-running the workflow.
