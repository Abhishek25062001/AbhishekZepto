# Payment Schema

## Collection

`payments`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `customerId` | ObjectId | yes | Payer |
| `checkoutSessionId` | ObjectId | yes | Source checkout |
| `orderId` | ObjectId | no | Set after order creation |
| `gateway` | enum | yes | `razorpay` (Phase 4) |
| `gatewayOrderId` | string | yes | Razorpay order id |
| `gatewayPaymentId` | string | no | Set after customer pays |
| `amount` | number | yes | **Paise** (integer). e.g. ₹250.00 → `25000`. Source: `checkout_sessions.summarySnapshot.grandTotal` (rupees) × 100 at create-order |
| `currency` | string | yes | `INR` |
| `status` | enum | yes | `created`, `pending`, `paid`, `failed`, `cancelled` |
| `idempotencyKey` | string | yes | Unique per payment attempt |
| `signatureVerified` | boolean | yes | Default false until verify |
| `webhookReceivedAt` | Date | no | Last webhook processed |
| `failureCode` | string | no | Gateway or internal code |
| `metadata` | object | no | Opaque gateway payload refs |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Business Rules

- `amount` must match `checkout_sessions.summarySnapshot.grandTotal` at create time.
- Duplicate verify/webhook with same `idempotencyKey` must not double-create orders (Module 10).
- Failed payment triggers checkout session cancel + lock release (Module 8).

## Indexes

See `docs/database/phase-4-index-plan.md`.

## API Endpoints

`docs/contracts/payment-api.md` — Module 8 implementation in progress.

## Implementation status

| Area | Status |
|------|--------|
| Mongoose model | **IMPLEMENTED** (Module 8) |
| Customer routes | **IMPLEMENTED** (Module 8) |
| Webhook route | **IMPLEMENTED** (Module 8) |

## Environment

See `docs/setup/phase-4-env-config.md` for `RAZORPAY_*` variables.
