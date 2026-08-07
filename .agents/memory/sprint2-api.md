---
name: Sprint 2 API Architecture
description: Backend/frontend wiring for the Astra Command Center — DB schema, Express routes, Vite proxy, React Query hooks
---

# Sprint 2 API Architecture

## Stack
- DB: PostgreSQL via `@workspace/db` (lib/db), Drizzle ORM
- API: Express in `artifacts/api-server`, built with esbuild, restarts require `WorkflowsRestart`
- Frontend: React + Vite in `artifacts/infinite-audio`, proxies `/api` → `http://localhost:8080`

## Schema (lib/db/src/schema/)
- `tracks` — id, title, artist, genre, duration, price_cents, plays, created_at
- `customers` — id, name, email, status, total_spent_cents, created_at
- `transactions` — id, track_id, customer_id, track_title, customer_name, customer_email, license_type, amount_cents, status, created_at (denormalized for fast display)

Push schema: `pnpm --filter @workspace/db run push`
Seed: `DATABASE_URL="$DATABASE_URL" npx tsx lib/db/src/seed.ts`

## API routes (all under /api)
- GET /metrics/dashboard — all KPIs in one call
- GET /metrics/revenue-history — 12 months by month
- GET /metrics/daily-sales — 14 days
- GET /tracks — all tracks
- GET /tracks/top-selling?limit=N — ranked by revenue
- GET /customers?filter=active|newest — customer list
- GET /transactions/recent?limit=N — latest transactions
- GET /transactions/active-licenses — active only
- GET /transactions/by-type — grouped by license_type
- POST /astra/command — NL command router (body: { command: string })

## Vite proxy
Added in `artifacts/infinite-audio/vite.config.ts`:
```
server.proxy['/api'] = { target: process.env.API_URL ?? 'http://localhost:8080', changeOrigin: true }
```

## Frontend hooks (artifacts/infinite-audio/src/)
- `lib/api.ts` — typed fetch client + centsToDisplay() + timeAgo() helpers
- `hooks/use-dashboard-data.ts` — React Query hooks for all endpoints
- `pages/Dashboard.tsx` — 7 sections, each uses its own hooks, inline styles only

## AstraService
Keyword pattern matching in `artifacts/api-server/src/services/astra.service.ts`.
Returns `{ intent, label, data }`. Frontend renders data based on intent string.

**Why:** No AI integration required; patterns cover the 4 documented NL commands plus variations.
