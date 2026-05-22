# Phase 4 Module 8 — Payment Gateway Foundation — Smoke Results

**Date:** 2026-05-19  
**Environment:** local / automated tests

## Automated

| Check | Result |
|-------|--------|
| `npm run typecheck -w backend/api` | PASS |
| `npm run test:customer-payment -w backend/api` | PASS (16 tests) |

## Manual (operator — PENDING)

Prerequisites: Razorpay test keys in `backend/api/.env`, active checkout session.

1. `POST /api/v1/customer/checkout/initiate` → `checkoutSessionId`
2. `POST /api/v1/customer/payments/create-order` → `paymentId`, `razorpayOrderId`, `keyId`
3. Complete Razorpay test payment; `POST /api/v1/customer/payments/verify` with signature
4. MongoDB: `payments.status=paid`, `checkout_sessions.paymentId` set
5. Invalid signature → payment `failed`, checkout `failed`, locks released
6. Webhook: Razorpay dashboard test event to `POST /api/v1/webhooks/razorpay`

## Notes

- Verify returns `orderId: null` until Module 10.
- Customer app pay UI is Module 9.
