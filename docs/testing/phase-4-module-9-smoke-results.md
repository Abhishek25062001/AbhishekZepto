# Phase 4 Module 9 — Customer App Payment Flow — Smoke Results

**Date:** 2026-05-19  
**Environment:** local / automated tests

## Automated

| Check | Result |
|-------|--------|
| `npm run typecheck -w apps/customer-app` | PASS |
| `npm run test:customer-payment -w apps/customer-app` | PASS (8 tests) |
| `npm run test:customer-checkout -w apps/customer-app` | PASS (7 tests) |

## Manual / device (operator — PENDING)

Prerequisites: Module 8 API running, Razorpay test keys in backend + app `.env`, native rebuild after SDK install.

1. Cart → Checkout → reservation timer visible.
2. Tap **Pay now** → Razorpay sheet opens.
3. Complete test payment → success banner with `paymentId`.
4. Dismiss Razorpay → error + retry.
5. Expired reservation → pay disabled.
6. MongoDB: `payments.status=paid`; `orderId` null until Module 10.

## Notes

- Order screens not implemented (Module 11).
- Native app rebuild required: `npm run android` or `npm run ios` in `apps/customer-app`.
