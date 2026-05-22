# Phase 4 Integration Scope

**Phase:** Phase 4 — Customer Shopping Experience  
**Status:** **IMPLEMENTED** (modules 1–13); integration sign-off in Module 15

## Phase 4 goal

Enable the authenticated customer journey:

```text
login → address → serviceable store → home/catalog browse → cart
  → checkout (inventory lock) → Razorpay payment → order placed → profile/orders
```

Backend is system of record for cart totals, stock reservation, payment, and order placement.

## Completed systems (modules 1–13)

| Module | Backend | Customer app |
|--------|---------|--------------|
| 1 Location | addresses, serviceability, store-selection | Address stack |
| 2 Home | `GET /customer/home` | CustomerHomeScreen |
| 3–5 Cart | cart CRUD, recalculate, pricing | Cart UI, bottom bar |
| 6–7 Checkout | initiate, summary, cancel | CheckoutScreen |
| 8–9 Payment | create-order, verify, webhook | Razorpay flow |
| 10–11 Orders | place, list, detail | Order screens |
| 12 Profile | GET/PATCH profile | CustomerProfileScreen |
| 13 Browse | (Phase 3 APIs) | Pagination, OOS |

## Phase 4 API surface

### Module 1 — Location

| Method | Path |
|--------|------|
| GET/POST/PATCH/DELETE | `/api/v1/customer/addresses` |
| POST | `/api/v1/customer/addresses/:id/set-default` |
| POST | `/api/v1/customer/serviceability` |
| POST | `/api/v1/customer/store-selection` |

### Module 2 — Home

| Method | Path |
|--------|------|
| GET | `/api/v1/customer/home` |

### Modules 3, 5 — Cart

| Method | Path |
|--------|------|
| GET/POST/PATCH/DELETE | `/api/v1/customer/cart`, `/cart/items`, `/cart/items/:itemId` |
| POST | `/api/v1/customer/cart/recalculate` |

### Module 6 — Checkout

| Method | Path |
|--------|------|
| POST | `/api/v1/customer/checkout/initiate` |
| GET | `/api/v1/customer/checkout/summary` |
| POST | `/api/v1/customer/checkout/cancel` |

### Module 8 — Payment

| Method | Path |
|--------|------|
| POST | `/api/v1/customer/payments/create-order` |
| POST | `/api/v1/customer/payments/verify` |
| POST | `/api/v1/webhooks/razorpay` |

### Module 10 — Orders

| Method | Path |
|--------|------|
| POST | `/api/v1/customer/orders` |
| GET | `/api/v1/customer/orders` |
| GET | `/api/v1/customer/orders/:orderId` |

### Module 12 — Profile

| Method | Path |
|--------|------|
| GET/PATCH | `/api/v1/customer/profile` |

### Phase 3 dependency — Catalog

| Method | Path |
|--------|------|
| GET | `/api/v1/customer/catalog/*` (categories, brands, products, search, detail, variants) |

## DB collections

### Phase 4 owned

- `customer_addresses`
- `customer_store_selections`
- `carts`
- `checkout_sessions`
- `payments`
- `orders`
- `user_identities` (profile — Phase 2, Module 12)

### Phase 3 integration

- `stores`, `store_products`, `inventory_stocks`, `inventory_locks`
- Catalog entities for browse and line-item resolution

## Critical relationships

```text
customer → address → store selection → cart (per store)
  → checkout_session (lockTokens[]) → payment → order (snapshot)
```

## Phase 5 boundary

Order lifecycle (picking, delivery, cancel) — **not** Phase 4. See `AllPhase&Modules.pdf` page 58+.

## Related

- `docs/reviews/phase-4-customer-journey-integration-review.md`
- `docs/contracts/backend-route-registry.md`
