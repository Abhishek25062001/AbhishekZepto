# Phase 4 Error Codes

Status: **PARTIAL** — Module 1 address/serviceability codes implemented in `backend/api/src/errors/error-codes.ts`.

HTTP mapping follows `project-context/API_STANDARDS.md`.

## Address & Serviceability

| Code | HTTP | Description |
|------|------|-------------|
| `ADDRESS_NOT_FOUND` | 404 | Unknown address id |
| `ADDRESS_NOT_OWNED` | 403 | Address belongs to another customer |
| `ADDRESS_DEFAULT_REQUIRED` | 400 | Cannot unset only default without replacement |
| `SERVICEABILITY_AREA_UNAVAILABLE` | 422 | No store serves coordinates |
| `STORE_NOT_SERVICEABLE` | 422 | Store cannot fulfill address |
| `STORE_NOT_FOUND` | 404 | Unknown store id (reuse global) |
| `STORE_ALREADY_SELECTED` | 409 | Reserved for idempotent re-select (not thrown in MVP) |
| `LOCATION_INVALID` | 422 | Invalid coordinates |

## Cart

| Code | HTTP | Description |
|------|------|-------------|
| `CART_NOT_FOUND` | 404 | No active cart — **implemented Module 3** |
| `CART_ITEM_NOT_FOUND` | 404 | Unknown line id |
| `CART_EMPTY` | 400 | Operation requires items |
| `CART_PRODUCT_UNAVAILABLE` | 409 | Product/variant inactive or delisted |
| `CART_INSUFFICIENT_STOCK` | 409 | Not enough stock |
| `CART_MAX_QUANTITY_EXCEEDED` | 400 | Above max per line |
| `CART_PRICE_CHANGED` | 409 | Snapshot stale; client must refresh |
| `CART_STORE_MISMATCH` | 400 | Item store differs from cart store |

## Checkout

| Code | HTTP | Description |
|------|------|-------------|
| `CHECKOUT_SESSION_NOT_FOUND` | 404 | Unknown session — **implemented Module 6** |
| `CHECKOUT_SESSION_EXPIRED` | 409 | Reservation TTL passed — **implemented Module 6** |
| `CHECKOUT_CART_EMPTY` | 400 | — **implemented Module 6** |
| `CHECKOUT_STOCK_UNAVAILABLE` | 409 | Lock or stock failure — **implemented Module 6** |
| `CHECKOUT_PRICE_CHANGED` | 409 | Totals changed since cart — **implemented Module 6** |
| `CHECKOUT_ADDRESS_UNSERVICEABLE` | 422 | — **implemented Module 6** |
| `CHECKOUT_STORE_CLOSED` | 409 | — **implemented Module 6** |

## Payment

| Code | HTTP | Description |
|------|------|-------------|
| `PAYMENT_NOT_FOUND` | 404 | Implemented Module 8 |
| `PAYMENT_ALREADY_PAID` | 409 | Duplicate verify |
| `PAYMENT_VERIFICATION_FAILED` | 400 | Invalid signature |
| `PAYMENT_AMOUNT_MISMATCH` | 409 | Razorpay amount ≠ checkout |
| `PAYMENT_GATEWAY_ERROR` | 502 | Upstream Razorpay failure |

## Order

**Implemented** — Module 10 (`backend/api/src/modules/orders/`).

| Code | HTTP | Description |
|------|------|-------------|
| `ORDER_NOT_FOUND` | 404 | |
| `ORDER_NOT_OWNED` | 403 | |
| `ORDER_ALREADY_EXISTS` | 409 | Idempotent duplicate |
| `ORDER_CREATION_FAILED` | 500 | Post-payment failure (compensating release required) |

## Profile

**Implemented** — Module 12 (`backend/api/src/modules/profile/`).

| Code | HTTP | Description |
|------|------|-------------|
| `PROFILE_VALIDATION_FAILED` | 422 | Invalid name/email |

## PDF Alignment

`STORE_ALREADY_SELECTED` from source PDF mapped to client-state validation or `CART_STORE_MISMATCH` at API layer.
