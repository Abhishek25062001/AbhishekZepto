# Phase 4 Module 9 — Customer App Payment Flow — Complete

**Date:** 2026-05-19

## Summary

Module 9 enables **Pay now** on `CheckoutScreen`: create-order → Razorpay SDK → verify → interim success UI. No order screens yet (Modules 10–11).

## Customer app module

`apps/customer-app/src/modules/payment/`

| Area | Purpose |
|------|---------|
| `customer-payment.api` | create-order, verify |
| `razorpay-checkout.service` | Open Razorpay SDK |
| `useCheckoutPayment` | Orchestrate full pay flow |
| `PaymentProcessingOverlay` | Loading during payment |
| `PaymentErrorState` | Retry on failure |
| `PaymentSuccessBanner` | Success with `paymentId` |

## Checkout integration

`CheckoutScreen` — live Pay button; guards for expired session and in-flight payment.

## APIs consumed (Module 8)

| Method | Path |
|--------|------|
| POST | `/api/v1/customer/payments/create-order` |
| POST | `/api/v1/customer/payments/verify` |

## Env

| Variable | App |
|----------|-----|
| `RAZORPAY_KEY_ID` | Optional fallback; prefer `keyId` from create-order |

## Dependency

`react-native-razorpay` — requires native rebuild.

## Tests

```bash
npm run typecheck -w apps/customer-app
npm run test:customer-payment -w apps/customer-app
```

## Known limitations

- `orderId` null after verify until Module 10
- No `OrderSuccess` / history screens (Module 11)
- Device smoke PENDING operator run with Razorpay test mode

## Next

**Module 10 — Order Creation Backend**
