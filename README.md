# Sight Tech

Full-stack monorepo for Sight Tech: phone & laptop repairs, laptop sales, and software development services.

- Backend: Node.js, Express, TypeScript
- Frontend: React, Vite, Tailwind CSS, TypeScript
- Dark theme, API-driven dynamic content

## Dev

1. Install dependencies at the root (pnpm workspaces):

```powershell
pnpm install
```

2. Run both servers (API on :4000, web on :5173 with /api proxy):

```powershell
pnpm run dev
```

Or run individually in the correct directories:

```powershell
# Backend (server)
pnpm -C server run dev

# Frontend (web)
pnpm -C web run dev
```

Open http://localhost:5173

## Build

```powershell
pnpm run build
```

Environment variables:

- Copy `server/.env.example` to `server/.env` and set `DATABASE_URL` to your Neon connection string.

## Project Structure

- server: Express API (TypeScript)
- web: React + Vite frontend (Tailwind CSS)
