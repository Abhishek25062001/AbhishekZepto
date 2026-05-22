# Payment Gateway Foundation Verification

## Backend unit tests

- [x] `payment-amount.util` — rupees to paise rounding
- [x] `razorpay-signature.util` — valid/invalid HMAC
- [x] `razorpay.gateway` — gateway error mapping
- [x] `payment.service` — create-order, verify, idempotency, failure compensation
- [x] `payment-webhook.service` — captured/failed idempotent paths
- [x] Route tests expose create-order, verify
- [x] `npm run test:customer-payment -w backend/api` (16 tests)

## Backend typecheck

- [x] `npm run typecheck -w backend/api`

## Manual / integration (operator)

See `docs/testing/phase-4-module-8-smoke-results.md` — curl/Mongo steps PENDING operator run.

### Suggested flow

1. Initiate checkout (`POST /customer/checkout/initiate`).
2. Create payment order (`POST /customer/payments/create-order` with `checkoutSessionId`, `idempotencyKey`).
3. Complete payment in Razorpay test mode; call verify with returned ids + signature.
4. Confirm MongoDB: `payments.status=paid`, `signatureVerified=true`, `checkout_sessions.paymentId` set.
5. Invalid signature → locks released, payment `failed`, checkout `failed`.

## Out of scope

- Customer app Razorpay UI (Module 9)
- Order document after verify (Module 10)
