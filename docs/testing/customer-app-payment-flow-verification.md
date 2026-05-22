# Customer App Payment Flow Verification

## Unit tests

- [x] `payment-idempotency.util` — unique keys, max length
- [x] `customer-payment-error-message.util` — `PAYMENT_*` mappings
- [x] `npm run test:customer-payment -w apps/customer-app` (8 tests)

## Typecheck

- [x] `npm run typecheck -w apps/customer-app`

## Manual / device (operator)

See `docs/testing/phase-4-module-9-smoke-results.md` — PENDING operator run.

### Suggested flow

1. Cart → Checkout → initiate succeeds.
2. Tap **Pay now** → Razorpay sheet opens.
3. Complete test payment → verify succeeds → success banner with `paymentId`.
4. Cancel Razorpay → error + retry works.
5. Let reservation expire → pay disabled.
6. MongoDB: `payments.status=paid`; `orderId` null until Module 10.

## Out of scope

- Order confirmation screens (Module 11)
- Order creation API (Module 10)
