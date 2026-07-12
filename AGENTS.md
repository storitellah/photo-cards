# photo-cards

Full-stack app for creating, customizing, and collecting personalized photo cards.

## Structure

- `client/` — Vite + React + TypeScript single-page app (`@photo-cards/client`).
- `server/` — Express + TypeScript REST API (`@photo-cards/server`).
- pnpm workspaces; root scripts orchestrate both packages.

## Common commands (run from repo root)

- `pnpm dev` — run API + client together (client on `5173`, API on `4000`).
- `pnpm build` — type-check + build both packages.
- `pnpm lint` — ESLint across the workspace.
- `pnpm typecheck` — `tsc --noEmit` for both packages.

## Cursor Cloud specific instructions

- Dependencies are installed via the startup update script (`pnpm install`); no extra setup is needed to start services.
- Run everything with `pnpm dev` from the repo root. The client dev server proxies `/api` and `/uploads` to the API at `http://localhost:4000` (see `client/vite.config.ts`), so use the client origin (`http://localhost:5173`) in the browser.
- The API persists data to `server/data/cards.json` and stores uploaded images under `server/uploads/`. Both directories are git-ignored and created automatically on server startup; deleting them resets all saved cards.
- `esbuild` (used by `tsx` and `vite`) has a native postinstall build step. It is whitelisted via `pnpm.onlyBuiltDependencies` in the root `package.json`; if you see esbuild "Ignored build scripts" warnings, run `pnpm install` again rather than the interactive `pnpm approve-builds`.
- TypeScript is intentionally pinned to the 5.x line: `typescript-eslint` requires TypeScript `<6.1.0`, so do not bump it to 6/7 without also upgrading the ESLint TypeScript tooling.
