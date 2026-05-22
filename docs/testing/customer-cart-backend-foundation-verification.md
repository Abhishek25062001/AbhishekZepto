# Customer Cart Backend Foundation Verification

## Backend

- [x] `POST /api/v1/customer/cart/items` — creates cart + line
- [x] `GET /api/v1/customer/cart?storeId=` — returns cart
- [x] `GET` before any add → `CART_NOT_FOUND` (unit tested)
- [x] `PATCH /cart/items/:itemId` — updates quantity
- [x] `DELETE /cart/items/:itemId` — removes line
- [x] `DELETE /cart?storeId=` — clears items; GET returns empty items
- [x] Quantity > stock → `CART_INSUFFICIENT_STOCK` (unit tested)
- [x] Invalid variant → `CART_PRODUCT_UNAVAILABLE` (validation path)
- [x] `npm run test:customer-cart -w backend/api`

## Seed

- [x] `seedDemoCart` idempotent for `9999999999` (dry-run test)

## Dev login

- Phone: `9999999999`, OTP `123456`

## Live smoke

See `docs/testing/phase-4-module-3-smoke-results.md` — curl steps PENDING QA.
