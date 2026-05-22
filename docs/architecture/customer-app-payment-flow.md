# Customer App Payment Flow

## Module

Phase 4 Module 9 — Customer App Payment Flow.

## Goal

Wire **Pay now** on `CheckoutScreen` to Module 8 payment APIs and the Razorpay React Native SDK: create-order → checkout → verify → interim success UI.

## Prerequisites

- Module 7: checkout initiated, `checkoutSessionId` in session storage.
- Module 8: `POST /payments/create-order`, `POST /payments/verify` live.
- Razorpay test keys in backend `.env` and optional `RAZORPAY_KEY_ID` in customer-app `.env`.

## Flow

```text
CheckoutScreen (active session, timer running)
  → user taps Pay now
  → generate idempotencyKey (new per attempt)
  → POST /payments/create-order { checkoutSessionId, idempotencyKey }
  → open Razorpay SDK (keyId, order_id, amount paise, currency)
  → SDK success → POST /payments/verify { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
  → navigation.replace('OrderSuccess', { orderId }) when verify returns orderId (Module 11)
```

## API consumption

| Step | Endpoint |
|------|----------|
| Create order | `POST /api/v1/customer/payments/create-order` |
| Verify | `POST /api/v1/customer/payments/verify` |

## Amount rule

Use **only** `amount` and `currency` from create-order response (paise). Do not recompute from cart/checkout summary on the client.

## Session and idempotency

- `checkoutSessionId`: `getActiveCheckoutSessionId()` after initiate.
- `idempotencyKey`: new UUID per user pay tap (retry after failure uses new key).
- Do **not** call `POST /checkout/cancel` when starting payment.

## Pay guards

| Condition | Pay button |
|-----------|------------|
| No checkout session / not initiated | Disabled |
| Reservation expired | Disabled |
| Payment in progress | Disabled + overlay |
| After verify success | Hidden or disabled; show success banner |

## Failure and retry

| Case | UX |
|------|-----|
| User closes Razorpay | “Payment cancelled” + retry |
| `PAYMENT_VERIFICATION_FAILED` | Error + retry (new idempotency key) |
| `PAYMENT_GATEWAY_ERROR` | Error + retry |
| `CHECKOUT_SESSION_EXPIRED` on create-order | Match checkout expired UX |

## Module boundaries

| In scope | Deferred |
|----------|----------|
| Razorpay SDK + verify | Order APIs (Module 10) |
| Navigate to `OrderSuccess` on verify | `OrderSuccess` screen (Module 11) |
| Error/retry UI | Cart clear after order (Module 10) |

## Module layout

`apps/customer-app/src/modules/payment/` — api, hooks, services, components, types, utils.

Payment UI is **embedded** in `CheckoutScreen` (no separate Payment route in Module 9).

## SDK

Package: `react-native-razorpay` (pinned in `apps/customer-app/package.json`)  
Service: `services/razorpay-checkout.service.ts`

**Native rebuild required** after `npm install` (run `npm run android` / `npm run ios` from customer-app).

## QA

- Customer `9999999999`, OTP `123456`
- Checkout with items + address; Module 8 API + Razorpay test mode
- Razorpay test card per dashboard docs

## Contract

`docs/contracts/customer-app-payment-ui-contract.md`
