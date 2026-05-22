# Customer Checkout Preparation Backend

## Module

Phase 4 Module 6 — Checkout Preparation Backend.

## Goal

Validate the customer's cart, delivery address, and store; re-validate pricing; reserve inventory via Phase 3 locks; persist a `checkout_sessions` document; and expose initiate, summary, and cancel APIs for Module 7+ (payment, orders).

## Checkout lifecycle

```text
POST /checkout/initiate  → validate + create session + checkout locks
GET  /checkout/summary   → read active session snapshot
POST /checkout/cancel    → release locks + session cancelled
```

Background: expiry job marks `expired` and releases locks when `reservationExpiresAt` passes.

## Initiate sequence

1. Resolve customer from JWT.
2. If `idempotencyKey` matches existing non-expired `initiated` session → return it.
3. If another `initiated` session exists for customer → cancel it (release locks) before proceeding.
4. Load **active** cart for `storeId` (body or cart default).
5. Validate cart non-empty → `CHECKOUT_CART_EMPTY`.
6. Load address; verify ownership → `ADDRESS_NOT_FOUND` / `ADDRESS_NOT_OWNED`.
7. Run store serviceability for address coordinates + store → `CHECKOUT_ADDRESS_UNSERVICEABLE`.
8. Validate store `active`, `isOpen`, `isAcceptingOrders` → `CHECKOUT_STORE_CLOSED`.
9. Refresh cart pricing via Module 5 pricing service (strict snapshot match) → `CHECKOUT_PRICE_CHANGED`.
10. Soft stock check per line → `CHECKOUT_STOCK_UNAVAILABLE`.
11. Build `addressSnapshot` and `summarySnapshot` from cart.
12. Persist `checkout_sessions` with `status=initiated`, `reservationExpiresAt` from env TTL.
13. For each line: `createInventoryLock` with `lockType: checkout`, `cartId`, matching `expiresAt`.
14. On partial lock failure: release created tokens, delete or fail session, throw `CHECKOUT_STOCK_UNAVAILABLE`.
15. Audit `checkout.initiated`.
16. Return `checkoutSessionId`, `reservationExpiresAt`, `summary`, `lockTokens[]`.

## Cancel sequence

1. Load session by id (or reject if missing).
2. Verify `customerId` matches JWT.
3. If already `cancelled` / `expired` / `completed` → idempotent success or 404 per contract.
4. Release each `lockToken` via inventory lock service.
5. Set `status=cancelled`; audit `checkout.cancelled`.

## Summary GET

- Query optional `checkoutSessionId`; default latest `initiated` for customer.
- If `reservationExpiresAt` in the past → `CHECKOUT_SESSION_EXPIRED`.
- If no session → `CHECKOUT_SESSION_NOT_FOUND`.
- Return `summarySnapshot` + metadata (no lock changes).

## Session policy

- **One active `initiated` session per customer** — new initiate cancels the previous session and releases its locks.
- Cart remains `active` until order placement (Module 10).
- Lock **confirm** is **not** called in Module 6 (Module 10 order creation).

## Inventory integration

Uses `inventory-lock.service` in-process (same as internal HTTP contract):

| Action | When |
|--------|------|
| Create (`CHECKOUT`) | Initiate, per cart line |
| Release | Cancel, expiry job, initiate rollback |
| Confirm | Module 10 only |

See `docs/architecture/phase-4-inventory-lock-integration.md`.

## Pricing integration

- Reuse `cart-pricing.service` to refresh snapshots before snapshot persist.
- `CHECKOUT_PRICE_CHANGED` when drift detected (409, optional `changedItems`).

## Env

| Variable | Default | Purpose |
|----------|---------|---------|
| `CHECKOUT_RESERVATION_TTL_SECONDS` | `900` | Session + lock expiry |
| `CHECKOUT_RESERVATION_CRON_ENABLED` | `false` | Background expiry job |

## Out of scope

- Customer app checkout UI (Module 7)
- Razorpay / payments (Module 8)
- Order creation / lock confirm (Module 10)
- Coupons (`discountAmount` from Module 5 MVP = 0)

## API

`docs/contracts/checkout-api.md`

## DB

`checkout_sessions` — `docs/database/checkout-session-schema.md`

## Tests

`docs/testing/customer-checkout-preparation-verification.md`
