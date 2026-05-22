# Customer App Payment UI Contract

Status: **IMPLEMENTED** — Module 9 (2026-05-19).

## Integration point

Payment runs on **`CheckoutScreen`** (`Checkout` route). No separate Payment stack screen in Module 9.

## API Client (`modules/payment/api/customer-payment.api.ts`)

| Function | HTTP |
|----------|------|
| `createPaymentOrder` | POST `/api/v1/customer/payments/create-order` |
| `verifyPayment` | POST `/api/v1/customer/payments/verify` |

## Service (`modules/payment/services/razorpay-checkout.service.ts`)

| Function | Purpose |
|----------|---------|
| `openRazorpayCheckout` | Open Razorpay SDK; return payment ids + signature for verify |

## Hooks

| Hook | Purpose |
|------|---------|
| `useCreatePaymentOrder` | Mutation: create-order |
| `useVerifyPayment` | Mutation: verify |
| `useCheckoutPayment` | Orchestrate create-order → SDK → verify |

## Components

| Component | Purpose |
|-----------|---------|
| `PaymentProcessingOverlay` | Block UI during payment |
| `PaymentErrorState` | Failure + retry |
| `PaymentSuccessBanner` | Interim success (`paymentId`; `orderId` optional/null) |

## Checkout wiring

- Replace disabled **Pay now — coming soon** with `useCheckoutPayment().pay()`.
- Pass `checkoutSessionId` from `getActiveCheckoutSessionId()`.
- Do not cancel checkout when payment starts.

## Error UX

| Code | User message / action |
|------|------------------------|
| `PAYMENT_VERIFICATION_FAILED` | Verification failed — retry |
| `PAYMENT_GATEWAY_ERROR` | Payment service unavailable — retry |
| `PAYMENT_NOT_FOUND` | Payment not found |
| `CHECKOUT_SESSION_EXPIRED` | Reservation expired — start again |
| `CHECKOUT_SESSION_NOT_FOUND` | Session not found |
| SDK user dismiss | Payment cancelled — retry |

## Success UX (Module 11)

- On verify success with `orderId`: `navigation.replace('OrderSuccess', { orderId })` from `CheckoutScreen`.
- Clear active checkout session storage before navigation.
- If `paid` without `orderId`: show error on checkout (no `OrderSuccess` navigation).
- `PaymentSuccessBanner` remains for edge cases; primary path is `OrderSuccess` screen.

## Env

| Variable | Purpose |
|----------|---------|
| `RAZORPAY_KEY_ID` | Optional SDK fallback; prefer `keyId` from create-order |

Never use secret key in the app.

## Permissions

Customer JWT only (via `apiClient`).

## Related

- `docs/contracts/customer-app-checkout-ui-contract.md`
- `docs/contracts/payment-api.md`
