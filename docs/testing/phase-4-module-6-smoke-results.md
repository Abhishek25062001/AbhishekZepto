# Phase 4 Module 6 — Checkout Preparation Backend — Smoke Results

**Date:** 2026-05-19  
**Environment:** local dev (automated unit tests PASS; manual API/Mongo PENDING)

## Automated verification (PASS)

| Check | Command | Result |
|-------|---------|--------|
| Backend typecheck | `npm run typecheck -w backend/api` | PASS |
| Checkout tests | `npm run test:customer-checkout -w backend/api` | PASS (9 tests) |

## Manual scenarios (operator checklist)

### 1. Initiate checkout

1. Customer JWT + active cart + default address in service area.
2. `POST /api/v1/customer/checkout/initiate` with `{ "addressId": "..." }`.
3. **Expected:** `200`, `checkoutSessionId`, `lockTokens[]`, `summary.grandTotal` matches cart.

### 2. Summary

1. `GET /api/v1/customer/checkout/summary?checkoutSessionId=...`
2. **Expected:** Totals match initiate snapshot.

### 3. Cancel

1. `POST /api/v1/customer/checkout/cancel` with `{ "checkoutSessionId": "..." }`.
2. **Expected:** Session `cancelled`; inventory locks released in MongoDB.

### 4. Price drift

1. Change `store_products.finalPrice` for a cart line.
2. Initiate without cart recalculate.
3. **Expected:** `409 CHECKOUT_PRICE_CHANGED`.

### 5. Expiry (optional)

1. Set `CHECKOUT_RESERVATION_TTL_SECONDS=60` and `CHECKOUT_RESERVATION_CRON_ENABLED=true`.
2. Wait for expiry job.
3. **Expected:** Session `expired`; locks released.

## Notes

- Lock confirm deferred to Module 10 (order placement).
- Payment flows deferred to Module 8.
