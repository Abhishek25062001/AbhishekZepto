# Phase 4 Module 3 — Cart Backend Foundation — Complete

**Date:** 2026-05-19

## Summary

Module 3 delivers store-scoped customer cart persistence and five REST endpoints. Carts use embedded line items with price snapshots and stock validation on mutations. No inventory locks; basic totals only (Module 5 extends pricing).

## API (IMPLEMENTED)

| Method | Path |
|--------|------|
| GET | `/api/v1/customer/cart?storeId=` |
| POST | `/api/v1/customer/cart/items` |
| PATCH | `/api/v1/customer/cart/items/:itemId?storeId=` |
| DELETE | `/api/v1/customer/cart/items/:itemId?storeId=` |
| DELETE | `/api/v1/customer/cart?storeId=` |

**Policy:** GET returns `CART_NOT_FOUND` until first add; POST creates active cart.

## Backend module

`backend/api/src/modules/cart/` — model, repository, service, controller, routes, validators, utils.

**Collection:** `carts` (`COLLECTION_NAMES.CARTS`)

**Mount:** `customer.routes.ts` → `/cart`

## Seed

- `seedDemoCart()` — dev customer `9999999999`, store `STORE-000001`, 3 lines (idempotent)

## Tests

```bash
npm run test:customer-cart -w backend/api
npm run typecheck -w backend/api
npm run build -w backend/api
```

## Known limitations

- No `POST /cart/merge`
- No customer app UI (Module 4)
- No inventory locks on cart mutations (Module 6 checkout)
- `discountAmount`, `taxAmount`, `deliveryFeeAmount` = 0; no `CART_PRICE_CHANGED` (Module 5)
- Live curl smoke PENDING — see `docs/testing/phase-4-module-3-smoke-results.md`

## Next

**Module 4 — Customer App Cart Experience**
