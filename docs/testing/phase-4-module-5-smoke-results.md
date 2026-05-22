# Phase 4 Module 5 — Pricing & Cart Calculation — Smoke Results

**Date:** 2026-05-19  
**Environment:** local dev (automated unit tests PASS; manual API/device PENDING)

## Automated verification (PASS)

| Check | Command | Result |
|-------|---------|--------|
| Backend typecheck | `npm run typecheck -w backend/api` | PASS |
| Backend cart + pricing tests | `npm run test:customer-cart -w backend/api` | PASS (17 tests) |
| Customer app typecheck | `npm run typecheck -w apps/customer-app` | PASS |
| Customer app cart tests | `npm run test:customer-cart -w apps/customer-app` | PASS (7 tests) |

## Manual scenarios (operator checklist)

### 1. Priced cart with tax and delivery

1. Set `CART_TAX_RATE_PERCENT=5` and `CART_DELIVERY_FEE_AMOUNT=40` in `backend/api/.env`.
2. Restart API. Add item to cart via customer app or curl.
3. **Expected:** Response includes non-zero `taxAmount`, `deliveryFeeAmount`, and `grandTotal` > `subtotal`.

### 2. Price drift and recalculate

1. Note cart line `storeProductId` and `unitPriceSnapshot`.
2. Change `store_products.finalPrice` in MongoDB for that mapping.
3. `GET /api/v1/customer/cart?storeId=...&validatePrices=true` with customer JWT.
4. **Expected:** `409` with `CART_PRICE_CHANGED`.
5. `POST /api/v1/customer/cart/recalculate` with `{ "storeId": "..." }`.
6. **Expected:** `200` with updated snapshots and totals.

### 3. Customer app UX

1. Open Cart screen with priced cart (env fees set).
2. **Expected:** Tax and delivery rows visible in summary footer.
3. Trigger price drift (step 2). Return to Cart.
4. **Expected:** Banner with "Refresh prices"; tap updates cart without leaving screen.

## Notes

- Promotions/coupons not implemented (`discountAmount` always `0`).
- Checkout strict validation deferred to Module 6.
