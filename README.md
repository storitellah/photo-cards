# photo-cards

Create, customize, and collect personalized photo cards. A full-stack starter
built with a **Vite + React + TypeScript** client and an **Express + TypeScript**
API, managed as pnpm workspaces.

## Features

- Create a photo card with a title, recipient, message, template, and photo upload.
- Browse a gallery of saved cards and delete them.
- Cards persist to disk (`server/data/cards.json`); uploads are stored in `server/uploads/`.

## Prerequisites

- Node.js >= 20
- pnpm (used as the package manager)

## Getting started

```bash
pnpm install
pnpm dev
```

- Client: http://localhost:5173
- API: http://localhost:4000

The client dev server proxies `/api` and `/uploads` requests to the API.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the API and client together |
| `pnpm build` | Type-check and build both packages |
| `pnpm lint` | Lint the whole workspace with ESLint |
| `pnpm typecheck` | Type-check both packages |

## Project layout

```
client/   Vite + React + TypeScript app
server/   Express + TypeScript REST API
```

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/templates` | List available card templates |
| `GET` | `/api/cards` | List saved cards |
| `POST` | `/api/cards` | Create a card (multipart form, optional `photo`) |
| `GET` | `/api/cards/:id` | Fetch a single card |
| `DELETE` | `/api/cards/:id` | Delete a card |
