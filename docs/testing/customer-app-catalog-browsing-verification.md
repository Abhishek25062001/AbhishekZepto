# Customer App Catalog Browsing Verification

Phase 4 Module 13 — Search & Browsing Improvements.

## Unit tests

- [x] `catalog-pagination.util` — merge pages, hasNextPage
- [x] `availability.util` — low stock helper
- [x] `catalog-query.util` — storeId, availability mapping
- [x] `product-card` — OOS/unavailable badge state
- [x] `product-detail-screen` — availability helpers
- [x] `npm run test:customer-catalog-browsing -w apps/customer-app` (32 tests)

## Customer app typecheck

- [x] `npm run typecheck -w apps/customer-app`

## Manual / device (operator)

1. Login as customer (`9999999999` / OTP `123456`).
2. Set delivery location so a store is selected.
3. **Category:** Open a category with many products; scroll to bottom; confirm more products load; pull-to-refresh resets list.
4. **Brand:** Same on brand listing.
5. **Search:** Query with many results; scroll load-more; change query resets list.
6. **OOS:** Open OOS product on listing — badge visible, card dimmed, no quick-add; detail shows unavailable/OOS and disabled add-to-cart.
7. **Low stock:** If seed data has `availableQuantity` ≤ 5, detail shows low-stock hint.

## Out of scope

- Backend catalog API changes
- Home feed pagination
- `out_of_stock` server filter across pages
