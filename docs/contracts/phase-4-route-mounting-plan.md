# Phase 4 Route Mounting Plan

Status: **PLANNED** — mount when owning module implements controllers.

## Customer Router

**Mount file:** `backend/api/src/routes/v1/customer.routes.ts`

| Sub-router | Path prefix | Module | Status |
|------------|-------------|--------|--------|
| Existing catalog | `/catalog` | Phase 3 | IMPLEMENTED |
| Addresses | `/addresses` | 1 | IMPLEMENTED |
| Serviceability | `/serviceability` | 1 | IMPLEMENTED |
| Store selection | `/store-selection` | 1 | IMPLEMENTED |
| Home | `/home` | 2 | IMPLEMENTED |
| Cart | `/cart` | 3 | IMPLEMENTED |
| Checkout | `/checkout` | 6 | IMPLEMENTED |
| Payments | `/payments` | 8 | IMPLEMENTED |
| Orders | `/orders` | 10 | IMPLEMENTED |
| Profile | `/profile` | 12 | IMPLEMENTED |

## Webhook Router

**Mount file:** `backend/api/src/routes/v1/webhooks.routes.ts` — **IMPLEMENTED** Module 8.

| Route | Module | Status |
|-------|--------|--------|
| `POST /api/v1/webhooks/razorpay` | 8 | IMPLEMENTED |

## Middleware Chain (each customer route)

```text
authenticate → requireRole(CUSTOMER) → validate(schema) → controller
```

## Implementation Rule

Do not mount routers until service + tests exist for that module (mirror Phase 3 catalog rule).

## Planned File Paths (Module 1+)

```text
backend/api/src/modules/customer-addresses/routes/
backend/api/src/modules/cart/routes/
backend/api/src/modules/checkout/routes/
backend/api/src/modules/payment/routes/
backend/api/src/modules/orders/routes/customer-order.routes.ts
backend/api/src/modules/home/routes/
```

Module 0 does **not** create these files.
