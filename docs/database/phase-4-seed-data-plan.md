# Phase 4 Seed Data Plan

Status: **PLANNED** — scripts in Module 1+.

## Dependencies

Requires Phase 3 seeds:

- Catalog, `STORE-000001`, store products, inventory stocks
- Customer `9999999999` (Phase 2 auth seed)

## Planned Seed Functions

| Function | Module | Data |
|----------|--------|------|
| `seedCustomerAddresses()` | 1 | 1–2 addresses for seed customer near seeded store |
| `seedDemoCart()` | 3 | Optional active cart with 2–3 variants (dev only) |

## Idempotency

Upsert by natural keys (`customerId` + `label` for addresses).

## Not Seeded in Phase 4

- Real Razorpay payments
- Production checkout sessions
- Orders (created via E2E tests only)

## Runner Integration (Module 1+)

Add to `backend/api/src/database/seeds/index.ts` behind `APP_ENV=development` guard.

## Module 0

No changes to `seed-runner` or seed scripts.
