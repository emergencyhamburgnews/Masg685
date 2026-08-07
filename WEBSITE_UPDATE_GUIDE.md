# Masg685 Website Update Package

This package contains the editable source for the Masg685 personal website,
including the React frontend and the API server that fetches the live Roblox
avatar.

## Included applications

- `artifacts/personal-website` — React/Vite website
- `artifacts/api-server` — Express API for Roblox profile data
- `lib/api-client-react`, `lib/api-spec`, `lib/api-zod`, `lib/db` — shared
  workspace packages required by the applications
- `site` — legacy static website files
- `attached_assets` — project assets used by the source and legacy site

## Run locally

Requirements:

- Node.js 24 or newer
- pnpm

From the extracted project directory:

```bash
pnpm install
```

Start the API server in one terminal:

```bash
PORT=8080 pnpm --filter @workspace/api-server run dev
```

Start the website in another terminal:

```bash
PORT=19147 BASE_PATH=/ pnpm --filter @workspace/personal-website run dev
```

The website uses `/api/roblox/avatar` to load the current full-body Roblox
avatar for the configured Roblox user. The API server fetches that data
directly from Roblox and does not require a Roblox API key.

## Checks and production build

```bash
pnpm run typecheck
pnpm --filter @workspace/personal-website run build
pnpm --filter @workspace/api-server run build
```

The included `.replit` and artifact manifests preserve the Replit workflow and
deployment configuration. Do not upload or commit any `.env` files or secret
values.