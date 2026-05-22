# Customer Cart Pricing Calculation Verification

## Backend

- [x] Add item returns `taxAmount` / `deliveryFeeAmount` when env set
- [x] `GET /cart?validatePrices=true` returns `CART_PRICE_CHANGED` after price drift (unit tests)
- [x] `POST /cart/recalculate` refreshes snapshots and totals (unit tests)
- [x] `npm run test:customer-cart -w backend/api` (17 tests)

## Customer app

- [x] Cart screen shows tax and delivery rows when non-zero
- [x] Price-changed banner + refresh (`useRecalculateCart`)
- [x] `npm run typecheck -w apps/customer-app`
- [x] `npm run test:customer-cart -w apps/customer-app` (7 tests)

## Env

- `CART_TAX_RATE_PERCENT` (e.g. `5`)
- `CART_DELIVERY_FEE_AMOUNT` (e.g. `40`)

## Live smoke

See `docs/testing/phase-4-module-5-smoke-results.md` — manual curl/device steps PENDING operator run.
