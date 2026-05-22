# Phase 4 Database Relationship Integration Review

**Date:** 2026-05-19 | **Status:** **PASS**

## Happy-path relationships

| From | To | Via |
|------|-----|-----|
| User (auth) | `customer_addresses` | `customerId` |
| User | `customer_store_selections` | selected store + address |
| User + store | `carts` | unique active per store |
| `carts` | `checkout_sessions` | `cartId` |
| Checkout | `inventory_locks` | `lockTokens[]` (Phase 3) |
| Checkout | `payments` | `checkoutSessionId` |
| Payment | `orders` | `paymentId` unique |
| Order | stock | lock confirm via order service |

## Service-enforced integrity

- Cart scoped to authenticated customer — **PASS**
- Checkout session owned by customer — **PASS**
- Order idempotent per paymentId — **PASS**
- Lock release on cancel/expiry — **PASS**

## Schema/index alignment

Module 14 `phase-4-database-schema-review.md` and `phase-4-database-index-review.md` — **PASS**
