# Payment Gateway API Contract

Status: **IMPLEMENTED** — Module 8 (2026-05-19); verify `orderId` placement Module 10 (2026-05-19).

Gateway: **Razorpay** (development and production).

## Customer Endpoints

Authentication: `authenticate` + `CUSTOMER` role.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/customer/payments/create-order` | Create Razorpay order from checkout session |
| POST | `/api/v1/customer/payments/verify` | Verify payment signature after client checkout |

## POST `/api/v1/customer/payments/create-order`

Requires an active checkout session (`status=initiated`, not expired). See `docs/contracts/checkout-api.md`.

**Body:**

```json
{
  "checkoutSessionId": "65f0a0000000000000000001",
  "idempotencyKey": "client-uuid-required"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `checkoutSessionId` | yes | Valid ObjectId; session must belong to customer |
| `idempotencyKey` | yes | Max 128 chars; duplicate returns same payment |

**Success (200):**

```json
{
  "paymentId": "65f0b0000000000000000001",
  "razorpayOrderId": "order_xxx",
  "amount": 25000,
  "currency": "INR",
  "keyId": "rzp_test_xxx"
}
```

| Field | Notes |
|-------|-------|
| `amount` | Integer **paise** (e.g. ₹250.00 → `25000`) |
| `keyId` | Public Razorpay key only — never return secret |

**Failures:**

| Code | HTTP | When |
|------|------|------|
| `CHECKOUT_SESSION_NOT_FOUND` | 404 | Unknown session |
| `CHECKOUT_SESSION_EXPIRED` | 409 | `reservationExpiresAt` passed |
| `PAYMENT_AMOUNT_MISMATCH` | 409 | Gateway amount ≠ checkout grand total |
| `PAYMENT_GATEWAY_ERROR` | 502 | Razorpay API failure |

**Idempotency:** Same `idempotencyKey` + customer returns existing non-`failed` payment.

**Side effect:** Sets `checkout_sessions.paymentId` to created payment id.

## POST `/api/v1/customer/payments/verify`

**Body:**

```json
{
  "paymentId": "65f0b0000000000000000001",
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "hex_hmac"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `paymentId` | yes | Internal payment document id |
| `razorpayOrderId` | yes | Must match stored `gatewayOrderId` |
| `razorpayPaymentId` | yes | Razorpay payment id from client |
| `razorpaySignature` | yes | HMAC from Razorpay checkout |

**Success (200) — Module 10:**

```json
{
  "paymentId": "65f0b0000000000000000001",
  "status": "paid",
  "orderId": "65f0c0000000000000000001"
}
```

`orderId` is populated by order placement on verify success (Module 10). May be `null` only if placement fails (`ORDER_CREATION_FAILED`).

**Idempotent success:** If payment already `paid` and `signatureVerified=true`, return same payload (200).

**Failures:**

| Code | HTTP | When |
|------|------|------|
| `PAYMENT_NOT_FOUND` | 404 | Unknown payment |
| `PAYMENT_VERIFICATION_FAILED` | 400 | Invalid signature (locks released, payment failed) |
| `PAYMENT_ALREADY_PAID` | 409 | Optional if strict duplicate; prefer idempotent 200 |
| `CHECKOUT_SESSION_EXPIRED` | 409 | Session expired before verify |

On verify failure: release checkout locks, `payments.status=failed`, `checkout_sessions.status=failed`.

## Webhook

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/webhooks/razorpay` | HMAC signature (`X-Razorpay-Signature` + `RAZORPAY_WEBHOOK_SECRET`) |

**Headers:**

| Header | Required |
|--------|----------|
| `X-Razorpay-Signature` | yes |

**Body:** Razorpay event envelope (`event`, `payload`).

**Minimum events:**

| Event | Action |
|-------|--------|
| `payment.captured` | Mark payment `paid` if not already (idempotent) |
| `payment.failed` | Compensate: release locks, failed statuses |

**Success:** `200` with `{ "received": true }` (idempotent replays OK).

**Failures:** `401` invalid signature; `400` malformed payload.

## Idempotency

`idempotencyKey` on create-order — duplicate create must not double-charge.

Verify and webhook handlers must not apply paid/failed transitions twice for the same `gatewayPaymentId`.

## Failure Handling

On verify failure or webhook `payment.failed`:

1. Release checkout `lockTokens`
2. Set `payments.status=failed`
3. Set `checkout_sessions.status=failed`
4. Return or log `PAYMENT_VERIFICATION_FAILED` as appropriate

## DB Fields

`docs/database/payment-schema.md`

## Environment

`docs/setup/phase-4-env-config.md` — `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

## Architecture

`docs/architecture/payment-gateway-foundation.md`
