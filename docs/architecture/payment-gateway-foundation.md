# Payment Gateway Foundation

## Module

Phase 4 Module 8 — Payment Gateway Foundation.

## Goal

Integrate **Razorpay** on the backend: create a payment order from an active checkout session, verify the client payment signature, process webhooks, and compensate on failure (release checkout locks). **Order creation is deferred to Module 10.**

## Prerequisites

- Module 6: `checkout_sessions` with `status=initiated`, inventory `CHECKOUT` locks, `summarySnapshot.grandTotal`.
- Module 7 (optional): customer app reaches checkout screen; pay UI is Module 9.

## Payment lifecycle

```text
POST /payments/create-order  → validate session + Razorpay Orders API + persist payments
POST /payments/verify        → HMAC signature + mark paid (no order yet)
POST /webhooks/razorpay      → payment.captured / payment.failed (idempotent)
```

## Create-order sequence

1. Resolve customer from JWT.
2. If `idempotencyKey` matches existing non-failed payment for customer → return same payment payload.
3. Load `checkoutSessionId`; verify ownership and `status=initiated`.
4. If `reservationExpiresAt` in the past → `CHECKOUT_SESSION_EXPIRED`.
5. Read `summarySnapshot.grandTotal` (rupees); convert to **paise** for Razorpay (`amount * 100`, integer).
6. Call Razorpay Orders API via gateway adapter; receipt = `checkoutSessionId`.
7. Persist `payments` with `status=created`, `gateway=razorpay`, `signatureVerified=false`.
8. Set `checkout_sessions.paymentId` to new payment `_id`.
9. Audit `payment.order_created`.
10. Return `paymentId`, `razorpayOrderId`, `amount` (paise), `currency`, `keyId` (public env key only).

## Verify sequence

1. Load payment by `paymentId`; verify `customerId` matches JWT.
2. If `status=paid` and `signatureVerified=true` → idempotent 200 with same payload (`orderId: null` in Module 8).
3. Load linked checkout session; must still be valid or already tied to this payment.
4. Verify Razorpay HMAC: `razorpayOrderId|razorpayPaymentId` with `RAZORPAY_KEY_SECRET`.
5. On invalid signature → `compensateFailedPayment` (release locks, payment `failed`, checkout `failed`) → `PAYMENT_VERIFICATION_FAILED`.
6. On success → update `gatewayPaymentId`, `status=paid`, `signatureVerified=true`; audit `payment.verified`.
7. Return `{ paymentId, status: 'paid', orderId: null }` — Module 10 will create order and set `orderId`.

## Webhook sequence

1. No JWT; verify `X-Razorpay-Signature` with raw body + `RAZORPAY_WEBHOOK_SECRET`.
2. Parse event; minimum handlers: `payment.captured`, `payment.failed`.
3. Resolve payment by `gatewayOrderId` / payload payment id.
4. Idempotent: if already `paid` on capture, no-op; if already `failed` on fail, no-op.
5. `payment.captured` → align with verify success path (mark paid if not already).
6. `payment.failed` → compensate (release locks, failed statuses).
7. Set `webhookReceivedAt`.

## Failure compensation

| Trigger | Actions |
|---------|---------|
| Verify signature invalid | Release checkout `lockTokens`; `payments.status=failed`; `checkout_sessions.status=failed` |
| Webhook `payment.failed` | Same as above |
| Razorpay API error on create | No payment row or rollback; `PAYMENT_GATEWAY_ERROR` |

Uses `checkout-inventory-lock.util` release helpers from Module 6.

## Amount and currency

- **Currency:** `INR` only in Phase 4.
- **Storage:** `payments.amount` in **paise** (integer).
- **Checkout snapshot:** `summarySnapshot.grandTotal` in **rupees**; convert at create-order.
- Mismatch between Razorpay order amount and checkout grand total → `PAYMENT_AMOUNT_MISMATCH`.

## Idempotency

- `idempotencyKey` required on create-order (max 128 chars).
- Duplicate create with same key → return existing payment (not `failed`).
- Duplicate verify on already-paid payment → same success response, no double side effects.

## Environment

| Variable | Purpose |
|----------|---------|
| `RAZORPAY_KEY_ID` | Public key returned to client on create-order |
| `RAZORPAY_KEY_SECRET` | Server-side Orders API + payment signature verify |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook HMAC |

See `docs/setup/phase-4-env-config.md`.

## Module boundaries

| In scope (Module 8) | Deferred |
|---------------------|----------|
| Create Razorpay order | Customer Razorpay SDK UI (Module 9) |
| Verify signature | Order document + lock confirm (Module 10) |
| Webhook handlers | Refunds, partial capture |
| Link `checkout_sessions.paymentId` | Cart clear after order |

## Backend layout

`backend/api/src/modules/payment/` per `docs/architecture/phase-4-backend-file-structure.md`:

- `gateways/razorpay.gateway.ts` — Orders API
- `services/payment.service.ts` — create-order, verify
- `services/payment-webhook.service.ts` — webhook events
- `utils/` — amount, signature, checkout validation, failure compensation

## API

`docs/contracts/payment-api.md`

## DB

`payments` — `docs/database/payment-schema.md`

## Tests

- Unit: amount conversion, signature HMAC, mocked gateway.
- Service: create, verify, idempotency, compensation.
- Route: POST create-order, verify registered.
- `npm run test:customer-payment -w backend/api`

`docs/testing/payment-gateway-foundation-verification.md`

## Out of scope

- Customer app payment screen (Module 9)
- Order placement and inventory lock confirm (Module 10)
- Admin payment dashboards
- Refunds
