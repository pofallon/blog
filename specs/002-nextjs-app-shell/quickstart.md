# Quickstart — Next.js Site Shell

## Prerequisites
1. Node.js 18 LTS (matching Amplify runtime) — confirm via `node -v`.
2. npm 10+ (ships with Node 18).
3. Repo cloned locally with the `002-nextjs-app-shell` branch checked out.

## Install & bootstrap

All commands run from repo root:

```bash
npm install
```

> ℹ️ `.npmrc` pins `install-strategy=nested`, so each workspace keeps its own `node_modules` to avoid React 16/18 conflicts.

## Workspace commands

| Task | Command |
| --- | --- |
| Dev server | `npm run dev --workspace apps/site-shell` (http://localhost:3000) |
| Unit tests | `npm run test --workspace apps/site-shell` |
| Playwright | `npm run test:e2e --workspace apps/site-shell` |
| TypeScript | `npm run typecheck --workspace apps/site-shell` |
| Lint | `npm run lint --workspace apps/site-shell` |
| Build | `npm run build --workspace apps/site-shell` |

## Playwright prerequisites

```bash
npx playwright install
sudo /home/vscode/.nvm/versions/node/v24.12.0/bin/npx playwright install-deps
```

The second command installs GTK/WebKit packages the containers lack by default.

## Environment

- `NEXT_PUBLIC_SITE_URL` (optional) — controls `metadataBase` so OG/Twitter previews resolve to the correct hostname. Defaults to `https://get2know.io`.
- The dev server binds to `0.0.0.0`, so VS Code port forwarding works without extra flags.

## Common troubleshooting

| Symptom | Fix |
| --- | --- |
| `lockfile missing swc dependencies` during `dev`/`build` | Expected with the current workspaces layout. Binaries are already installed; no action required. |
| Playwright can’t launch browsers (GTK libs missing) | Re-run `playwright install-deps` as shown above. |
| Styles missing | Ensure Tailwind `content` globs cover new files and `globals.css` stays imported from `app/layout.tsx`. |
| Navigation link not highlighted | All routes must use the registry in `lib/navigation.ts`; update it before adding new pages. |
