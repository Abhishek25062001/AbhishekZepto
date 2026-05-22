# Phase 4 Testing & Validation Plan

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 14 — Phase 4 Testing & Validation  
**Source:** `projectin micro/docone/AllPhase&Modules.pdf` (Module 14, pages 64–66); `projectin micro/docfour/PhaesDetail4&5.pdf` (pages 30–32)  
**Status:** **COMPLETE** (2026-05-19)

## Modules covered (implementation 1–13)

| # | Module | Validation focus |
|---|--------|------------------|
| 0 | Foundation & Bootstrap | Docs, contracts, schemas |
| 1 | Customer Location & Store Selection | Addresses, serviceability, store selection |
| 2 | Customer Home & Shopping Entry | `GET /customer/home` |
| 3 | Cart Backend Foundation | Cart CRUD |
| 4 | Customer App Cart Experience | Cart UI, quick-add |
| 5 | Pricing & Cart Calculation | Recalculate, price snapshots |
| 6 | Checkout Preparation Backend | Initiate, summary, cancel, locks |
| 7 | Customer App Checkout Flow | Checkout screen, timer |
| 8 | Payment Gateway Foundation | Razorpay create/verify, webhook |
| 9 | Customer App Payment Flow | SDK, verify navigation |
| 10 | Order Creation Backend | Place order, history APIs |
| 11 | Customer App Order Confirmation | Success, detail, history |
| 12 | Basic Customer Profile | GET/PATCH profile |
| 13 | Search & Browsing Improvements | Pagination, OOS UX (client) |

## Validation categories → review artifacts

| Category | Ticket | Review document |
|----------|--------|-----------------|
| Master plan | 1 | This document |
| Backend module structure | 2 | `phase-4-backend-module-structure-review.md` |
| Database schema | 3–4 | `phase-4-database-schema-review.md` |
| Database indexes | 5 | `phase-4-database-index-review.md` |
| Route mounting | 6 | `phase-4-backend-route-mount-review.md` |
| Permissions | 7 | `phase-4-permission-review.md` |
| Address API smoke | 8 | `phase-4-address-api-smoke-review.md` |
| Home API smoke | 9 | `phase-4-home-api-smoke-review.md` |
| Cart API smoke | 10 | `phase-4-cart-api-smoke-review.md` |
| Checkout API smoke | 11 | `phase-4-checkout-api-smoke-review.md` |
| Payment API smoke | 12 | `phase-4-payment-api-smoke-review.md` |
| Order API smoke | 13 | `phase-4-order-api-smoke-review.md` |
| Profile API smoke | 14 | `phase-4-profile-api-smoke-review.md` |
| Customer app structure | 15 | `phase-4-customer-app-module-structure-review.md` |
| Customer UI (location/home/browse) | 16 | `phase-4-customer-app-ui-review-location-home-browse.md` |
| Customer UI (cart) | 17 | `phase-4-customer-app-ui-review-cart.md` |
| Customer UI (checkout/orders) | 18 | `phase-4-customer-app-ui-review-checkout-orders.md` |
| Checkout ↔ inventory lock | 19 | `phase-4-checkout-inventory-lock-validation.md` |
| Payment idempotency | 20 | `phase-4-payment-idempotency-validation.md` |
| Order placement | 21 | `phase-4-order-placement-validation.md` |
| Seed data | 22 | `phase-4-seed-data-validation.md` |
| OpenAPI vs registry | 23 | `phase-4-openapi-contract-review.md` |
| Backend quality gates | 24 | `phase-4-backend-quality-results.md` |
| Customer app quality gates | 25 | `phase-4-customer-app-quality-results.md` |
| Manual E2E checklist | 26 | `phase-4-manual-smoke-checklist.md` |
| Production risks | 27 | `phase-4-production-readiness-risks.md` |
| Final sign-off | 28 | `phase-4-final-validation-summary.md` |

## API verification scope

Phase 4 customer routes per `docs/contracts/backend-route-registry.md`:

- Addresses, serviceability, store-selection (Module 1)
- Home (Module 2)
- Cart + recalculate (Modules 3, 5)
- Checkout initiate/summary/cancel (Module 6)
- Payments create-order/verify (Module 8)
- Orders POST/GET (Module 10)
- Profile GET/PATCH (Module 12)
- Webhook `POST /api/v1/webhooks/razorpay`
- Phase 3 catalog routes (dependency — not re-validated in depth)

## DB collections validated

`customer_addresses`, `customer_store_selections`, `carts`, `checkout_sessions`, `payments`, `orders`, `user_identities` (profile); integration: `inventory_locks`, `inventory_stocks`, `store_products`

## Verification command index

### Backend (`backend/api`)

```bash
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run build -w backend/api
npm run test:phase-4 -w backend/api
npm run test:customer-addresses -w backend/api
npm run test:customer-home -w backend/api
npm run test:customer-cart -w backend/api
npm run test:customer-checkout -w backend/api
npm run test:customer-payment -w backend/api
npm run test:customer-orders -w backend/api
npm run test:customer-profile -w backend/api
```

### Customer app (`apps/customer-app`)

```bash
npm run typecheck -w apps/customer-app
npm run test:phase-4-customer -w apps/customer-app
npm run test:customer-cart -w apps/customer-app
npm run test:customer-checkout -w apps/customer-app
npm run test:customer-payment -w apps/customer-app
npm run test:customer-orders -w apps/customer-app
npm run test:customer-profile -w apps/customer-app
npm run test:customer-catalog-browsing -w apps/customer-app
```

### Live environment

- MongoDB running; `npm run seed -w backend/api` (or documented seed)
- Customer OTP: phone `9999999999`, OTP `123456`
- Optional: Razorpay test keys for device payment smoke

## Next module

**Module 15 — Phase 4 Integration & Review**
