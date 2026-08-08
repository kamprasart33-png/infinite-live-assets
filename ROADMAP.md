# Infinite Audio Archive — Product Roadmap

Brand: **Infinite Audio Archive** (unchanged). **Astra** is the AI business-intelligence/agent layer inside the platform.

## Current state (verified working)
- Public store (`/store`) with 12 tracks, search, genre filters
- Track detail with 5 Stripe license tiers ($39–$299), customer form
- Stripe Checkout (Replit integration; user's own key auto-used once a valid `sk_` key is saved)
- Success page: order fulfillment (idempotent), invoice display, track + license download
- Dashboard with revenue/metrics/transactions, 30s auto-refresh, PostgreSQL-backed
- Tables: `tracks`, `orders`, `transactions` (+ dashboard tables), Stripe `orders` linked by session ID

## Phase 1 — Foundation (build next, in order)
1. **Connected business data model** — first-class `customers`, `licenses`, `invoices` tables linked to `orders`, `tracks`, and `transactions`. Checkout fulfillment creates/updates all of them. One customer record across repeat purchases.
2. **Licensing automation** — license records with unique license IDs, status (active/expired/revoked), generated certificate stored per order; invoice records with numbering and line items.
3. **Astra Command Router** — `/api/astra/command` endpoint: parses natural-language business questions, routes to data queries (revenue, top tracks, customers, licenses), returns structured answers. UI: Astra panel in the dashboard.
4. **AI business recommendations** — Astra analyzes live sales data (trends, best-selling genres/licenses, pricing signals) and surfaces actionable recommendations in the dashboard.
5. **Sales/revenue analytics deepening** — analytics driven entirely from the connected data model (per-track, per-license-type, per-customer revenue).

Each phase-1 item ships production-ready and tested before the next starts.

## Phase 2 — Advanced (after foundation is stable)
- AI track intelligence (auto-tagging, similarity, metadata enrichment)
- Royalty management (splits, statements, payout tracking)
- Copyright tracking / protection workflows
- Customer CRM (profiles, purchase history, segments, outreach)
- YouTube analytics integration
- Marketing automation (campaigns, abandoned-checkout follow-ups)
- Revenue forecasting
- Enterprise tools (multi-user, roles, API access)

## Standing rules
- Never rebuild or duplicate existing functionality; extend it.
- Review the live store/dashboard/DB/Stripe flow before changing anything.
- Keep existing tasks in mind: email delivery (#4), audio previews (#5), dashboard auth (#9), user avatar (#10).
