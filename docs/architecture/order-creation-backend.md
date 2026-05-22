# Order Creation Backend

## Module

Phase 4 Module 10 — Order Creation Backend.

## Goal

After payment is verified, create an `orders` document from the checkout session snapshot, confirm inventory locks, clear the cart, complete the checkout session, and expose customer order read APIs.

## Prerequisites

- Module 6: `checkout_sessions` with `lockTokens`, `summarySnapshot`, `addressSnapshot`.
- Module 8: `payments` with `status=paid`, `signatureVerified=true`.
- Module 9: client calls verify (triggers placement).

## Placement sequence

```text
placeOrderFromPayment(paymentId, customerId)
  → load payment (paid + verified)
  → idempotent: return existing order if paymentId already placed
  → load checkout session
  → build order from snapshots + generate orderNumber
  → persist orders
  → confirm each lockToken (inventory-lock.service)
  → clearCartItems(cartId)
  → checkout_sessions.status=completed, orderId set
  → payments.orderId set
  → audit order.placed
```

## Entry points

| Trigger | When |
|---------|------|
| `POST /payments/verify` success | Primary — after mark paid |
| Webhook `payment.captured` | After mark paid (idempotent) |
| `POST /customer/orders` | Retry with `paymentId` |

## orderNumber

Format: `ORD-{yyyyMMddHHmmss}-{6 char random}` (see `order-number.util.ts`).

## Amount alignment

- Checkout `summarySnapshot.grandTotal` — **rupees**
- Payment `amount` — **paise**
- Order `grandTotal` — **rupees** (from snapshot)

## Idempotency

Same `paymentId` → same order document (200 with existing payload).

## Failure after payment

`ORDER_CREATION_FAILED` — release checkout locks (best-effort); audit failure; manual refund path documented for operators.

## Phase 4 order state

- `orderStatus`: `placed` only
- `paymentStatus`: `paid`
- `inventoryConfirmed`: `true` after lock confirm

## API

`docs/contracts/order-customer-api.md`

## DB

`orders` — `docs/database/order-schema.md`

## Tests

`docs/testing/order-creation-backend-verification.md`

## Out of scope

- Order lifecycle beyond `placed` (Phase 5)
- Customer app order screens (Module 11)
- Refunds / cancellations
