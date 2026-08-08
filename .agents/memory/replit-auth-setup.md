---
name: Replit Auth setup
description: How Replit Auth is wired in this project — key files, build gotcha for replit-auth-web, and auth flow.
---

## What was done
- `lib/replit-auth-web/` — browser auth hook library (`useAuth()`)
- `artifacts/api-server/src/lib/auth.ts` — session CRUD, OIDC config
- `artifacts/api-server/src/middlewares/authMiddleware.ts` — loads user from session cookie on every request
- `artifacts/api-server/src/routes/auth.ts` — /login, /callback, /logout, /auth/user, /mobile-auth/*
- `lib/db/src/schema/auth.ts` — `sessionsTable` and `usersTable` (already pushed to DB)
- `artifacts/infinite-audio/src/App.tsx` — uses `useAuth()` instead of localStorage

## Build gotcha for replit-auth-web
`lib/replit-auth-web/tsconfig.json` **must** have `"composite": true` (for TS project references) and `"types": ["vite/client"]` (for `import.meta.env`). Also needs `"vite": "catalog:"` as a devDependency so the vite types are resolvable during `tsc` compilation.

**Why:** `useAuth` uses `import.meta.env.BASE_URL` which requires the vite/client types. Without `composite: true`, the downstream web artifact's tsconfig references will fail with TS6306.

## Auth flow (web)
1. `Sign In` button → calls `login()` from `useAuth()` → redirects to `/api/login?returnTo=<base>`
2. OIDC redirect → Replit OIDC provider → `/api/callback`
3. Callback creates session in DB, sets `sid` cookie, redirects to `returnTo`
4. `useAuth()` calls `GET /api/auth/user` with `credentials: "include"` on mount to get current user

## How to apply
- Always use `useAuth()` from `@workspace/replit-auth-web` for browser auth (never call /api/auth/* directly from app code)
- Use `req.isAuthenticated()` in Express route handlers to guard server routes
- `cookieParser()` must be mounted before `authMiddleware` in `app.ts`
- CORS must be `{ credentials: true, origin: true }` for cookie auth to work through the proxy
