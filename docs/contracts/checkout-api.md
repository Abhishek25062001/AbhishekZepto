# Checkout Preparation API Contract

Status: **IMPLEMENTED** — Module 6 (2026-05-19).

Authentication: `authenticate` + `CUSTOMER` role.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/customer/checkout/initiate` | Validate cart, create session, reserve inventory |
| GET | `/api/v1/customer/checkout/summary` | Current session summary |
| POST | `/api/v1/customer/checkout/cancel` | Cancel session, release locks |

## POST `/api/v1/customer/checkout/initiate`

**Body:**

```json
{
  "addressId": "65f0a0000000000000000001",
  "storeId": "65f0a0000000000000000002",
  "idempotencyKey": "client-uuid-optional"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `addressId` | yes | Customer-owned delivery address |
| `storeId` | no | Defaults to active cart `storeId` |
| `idempotencyKey` | no | Retry key; returns existing non-expired session |

**Success (200):**

```json
{
  "checkoutSessionId": "...",
  "reservationExpiresAt": "2026-05-19T12:15:00.000Z",
  "lockTokens": ["lk_..."],
  "summary": {
    "currency": "INR",
    "itemCount": 2,
    "subtotal": 200,
    "discountAmount": 0,
    "taxAmount": 10,
    "deliveryFeeAmount": 40,
    "grandTotal": 250,
    "items": [
      {
        "itemId": "...",
        "productId": "...",
        "variantId": "...",
        "storeProductId": "...",
        "productName": "Milk 1L",
        "quantity": 2,
        "unitPrice": 100,
        "lineTotal": 200
      }
    ]
  }
}
```

**Failures:**

| Code | HTTP | When |
|------|------|------|
| `CHECKOUT_CART_EMPTY` | 400 | No active cart or empty items |
| `CHECKOUT_STORE_CLOSED` | 409 | Store inactive/closed/not accepting |
| `CHECKOUT_ADDRESS_UNSERVICEABLE` | 422 | Address outside store service radius |
| `CHECKOUT_PRICE_CHANGED` | 409 | Cart snapshot ≠ current `finalPrice`; optional `details.changedItems` |
| `CHECKOUT_STOCK_UNAVAILABLE` | 409 | Insufficient stock or lock create failed |
| `ADDRESS_NOT_FOUND` | 404 | Unknown address |
| `CART_NOT_FOUND` | 404 | No active cart for store |

**Idempotency:** Same `idempotencyKey` + customer returns existing `initiated` session if not expired.

**Policy:** New initiate cancels any other active `initiated` session for the customer (releases locks).

## GET `/api/v1/customer/checkout/summary`

**Query:** `checkoutSessionId` (optional — defaults to latest non-expired `initiated` session)

**Success (200):** Session metadata + `summary` (from `summarySnapshot`).

**Failures:** `CHECKOUT_SESSION_NOT_FOUND` (404), `CHECKOUT_SESSION_EXPIRED` (409).

## POST `/api/v1/customer/checkout/cancel`

**Body:**

```json
{
  "checkoutSessionId": "...",
  "reason": "user_abandoned"
}
```

Releases all `lockTokens` via inventory lock service; sets `status=cancelled`.

**Failures:** `CHECKOUT_SESSION_NOT_FOUND` (404).

## Inventory Integration

In-process calls to `inventory-lock.service` (`lockType: checkout`). See `docs/architecture/phase-4-inventory-lock-integration.md`.

## DB Fields

`docs/database/checkout-session-schema.md`

## Validation

`docs/validation/phase-4-validation-rules.md`

## Payment integration (Module 8)

`POST /api/v1/customer/payments/create-order` requires:

- Existing `checkoutSessionId` from initiate
- Session `status=initiated` and `reservationExpiresAt` in the future
- Sets `checkout_sessions.paymentId` when payment order is created

See `docs/contracts/payment-api.md`.
