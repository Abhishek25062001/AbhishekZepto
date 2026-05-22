# Phase 4 Module 8 — Payment Gateway Foundation — Complete

**Date:** 2026-05-19

## Summary

Module 8 adds Razorpay payment order creation, client payment verification (HMAC), webhook handling, failure compensation (release checkout locks), and `payments` persistence. Order creation is deferred to Module 10.

## Backend module

`backend/api/src/modules/payment/`

| Area | Purpose |
|------|---------|
| `payment.service` | Create-order, verify |
| `payment-webhook.service` | `payment.captured`, `payment.failed` |
| `razorpay.gateway` | Razorpay Orders API |
| `payment-checkout-validation.util` | Payable checkout session checks |
| `payment-failure-compensation.util` | Release locks on failure |
| `razorpay-signature.util` | Payment + webhook HMAC |

## API routes

| Method | Path |
|--------|------|
| POST | `/api/v1/customer/payments/create-order` |
| POST | `/api/v1/customer/payments/verify` |
| POST | `/api/v1/webhooks/razorpay` |

## Env

| Variable | Required |
|----------|----------|
| `RAZORPAY_KEY_ID` | Production; optional in dev/test |
| `RAZORPAY_KEY_SECRET` | Production |
| `RAZORPAY_WEBHOOK_SECRET` | Production |

## Tests

```bash
npm run typecheck -w backend/api
npm run test:customer-payment -w backend/api
```

## Known limitations

- No order document on verify (`orderId: null`) — Module 10
- No customer Razorpay SDK UI — Module 9
- No refunds / partial capture
- Lock confirm still Module 10 only

## Docs

- Architecture: `docs/architecture/payment-gateway-foundation.md`
- Verification: `docs/testing/payment-gateway-foundation-verification.md`
- Tracker: `docs/reviews/phase-4-payment-gateway-foundation-execution-tickets.md`

## Next

**Module 9 — Customer App Payment Flow**
