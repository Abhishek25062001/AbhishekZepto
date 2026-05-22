# Phase 4 Module 3 — Cart Backend Smoke Results

**Date:** 2026-05-19  
**Environment:** local dev (template)

## Prerequisites

- MongoDB running; seeds applied (`npm run seed -w backend/api`)
- Customer JWT: phone `9999999999`, OTP `123456`
- Store `STORE-000001` selected via Module 1 seeds

## Automated tests

| Command | Result |
|---------|--------|
| `npm run test:customer-cart -w backend/api` | PASS (10 tests) |
| `npm run typecheck -w backend/api` | PASS |
| `npm run build -w backend/api` | PASS |

## Manual curl checklist

| Step | Endpoint | Expected | Result |
|------|----------|----------|--------|
| 1 | `GET /cart?storeId=` before add | `CART_NOT_FOUND` | PENDING |
| 2 | `POST /cart/items` | 200 + cart with line | PENDING |
| 3 | `GET /cart?storeId=` | 200 + items | PENDING |
| 4 | `PATCH /cart/items/:itemId` | 200 updated qty | PENDING |
| 5 | `DELETE /cart/items/:itemId` | 200 empty/partial | PENDING |
| 6 | `DELETE /cart?storeId=` | 200 `items: []` | PENDING |
| 7 | Quantity > stock | `CART_INSUFFICIENT_STOCK` | PENDING |

## Notes

- Live curl not executed in automated closeout; mark PENDING until QA runs against running API.
