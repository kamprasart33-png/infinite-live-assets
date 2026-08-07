---
name: Stripe Integration Quirks
description: Non-obvious issues with stripe-replit-sync in this esbuild-bundled monorepo, and how to work around them
---

# Stripe Integration Quirks

## 1. Credentials field is `secret`, not `secret_key`

The Replit connectors API returns `settings.secret` (not `settings.secret_key` as shown in the code template).

```typescript
// WRONG (template default)
if (!settings?.secret_key) ...
return { secretKey: settings.secret_key };

// CORRECT (actual field name)
if (!settings?.secret) ...
return { secretKey: settings.secret };
```

**Why:** The connector schema uses `secret` as the field name; the template was written for a different connector version.

## 2. `runMigrations()` cannot run from the esbuild bundle

`stripe-replit-sync`'s `runMigrations()` resolves migration SQL files via `path.resolve(__dirname, "./migrations")`. After esbuild bundles the API server, `__dirname` points to `dist/` and the migrations directory is not bundled — the call silently completes but creates no tables.

**Fix:** Run migrations once from the shell using tsx (not from the built server):
```bash
node_modules/.bin/tsx artifacts/api-server/src/scripts/run-stripe-migrations.ts
```

Also run after any `pnpm add stripe-replit-sync` upgrade that may add new migration files.

The `index.ts` `initStripe()` function intentionally skips `runMigrations()` for this reason.

## 3. `syncBackfill()` does not populate stripe.products/prices reliably

Even after a successful `syncBackfill()` call, `stripe.products` and `stripe.prices` remain empty. Root cause unknown (possibly account scoping or a bug in the sync version).

**Fix:** Query the Stripe API directly for license prices in `storage.ts` (`getUncachableStripeClient()` → `stripe.products.list()` + `stripe.prices.list()`), with an in-memory 5-minute cache. Do not rely on the stripe schema for product/price reads.

## 4. Correct startup sequence in index.ts

```typescript
// DO NOT call runMigrations() here — it fails in the bundle
const stripeSync = await getStripeSync();
await stripeSync.findOrCreateManagedWebhook(webhookUrl);
stripeSync.syncBackfill().catch(logger.error); // background, non-blocking
```

## 5. One-time setup steps (run from workspace root shell)

```bash
# 1. Create stripe schema tables (run once, or after stripe-replit-sync upgrade)
node_modules/.bin/tsx artifacts/api-server/src/scripts/run-stripe-migrations.ts

# 2. Create Stripe license products (idempotent)
node_modules/.bin/tsx artifacts/api-server/src/scripts/seed-products.ts
```

## 6. Purchase flow architecture

- `/store` → browse tracks (from our DB via `/api/store/tracks`)
- `/store/track/:id` → pick license + enter name/email → POST `/api/checkout/create-session` → redirect to Stripe
- Stripe redirects to `/success?session_id=cs_xxx`
- `/success` calls GET `/api/checkout/session/:sessionId` → `fulfillOrder()` creates order + transaction records (idempotent)
- Dashboard auto-refreshes every 30s via React Query `refetchInterval`

## 7. orders table

Added to `lib/db/src/schema/orders.ts` in public schema (not stripe schema). Stores fulfilled checkout sessions with invoice numbers. Created via `drizzle-kit push`.
