# Order Customer API Contract

Status: **IMPLEMENTED** — Module 10 (2026-05-19).

Architecture: `docs/architecture/order-creation-backend.md`  
Verification: `docs/testing/order-creation-backend-verification.md`

Authentication: `authenticate` + `CUSTOMER` role.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/customer/orders` | Place order from verified payment (idempotent) |
| GET | `/api/v1/customer/orders` | Paginated order history |
| GET | `/api/v1/customer/orders/:orderId` | Order detail |

## Placement triggers

| Path | Use |
|------|-----|
| `POST /payments/verify` | Primary — places order after payment marked paid |
| Webhook `payment.captured` | Places order if not already placed |
| `POST /orders` | Idempotent retry with `paymentId` |

## POST `/api/v1/customer/orders`

**Body:**

```json
{
  "paymentId": "65f0b0000000000000000001",
  "idempotencyKey": "client-uuid-optional"
}
```

**Success (200):**

```json
{
  "orderId": "65f0c0000000000000000001",
  "orderNumber": "ORD-20260519120000-abc123",
  "orderStatus": "placed",
  "grandTotal": 250,
  "currency": "INR",
  "placedAt": "2026-05-19T12:00:00.000Z"
}
```

**Idempotency:** Same `paymentId` returns existing order (200).

**Failures:**

| Code | HTTP | When |
|------|------|------|
| `PAYMENT_NOT_FOUND` | 404 | Unknown payment |
| `PAYMENT_VERIFICATION_FAILED` | 400 | Payment not paid/verified |
| `ORDER_CREATION_FAILED` | 500 | Placement failed after pay |

## GET `/api/v1/customer/orders`

**Query:** `page` (default 1), `limit` (default 20, max 50), optional `status` (`placed` in Phase 4)

**Success (200):** Paginated list of order summaries.

## GET `/api/v1/customer/orders/:orderId`

**Success (200):** Full order with `items`, `addressSnapshot`, totals, `paymentStatus`, `orderStatus`.

**Failures:** `ORDER_NOT_FOUND` (404)

## Payment verify integration

`POST /payments/verify` success response (Module 10):

```json
{
  "paymentId": "65f0b0000000000000000001",
  "status": "paid",
  "orderId": "65f0c0000000000000000001"
}
```

## Side effects on create

1. Confirm inventory locks (`confirmInventoryLock` per `lockToken`)
2. `orders.orderStatus = placed`
3. Clear cart items for session `cartId`
4. `checkout_sessions.status = completed`

## DB Fields

`docs/database/order-schema.md`

## Phase 5 Note

Status transitions beyond `placed` are Phase 5 — customer read-only in Phase 4.
