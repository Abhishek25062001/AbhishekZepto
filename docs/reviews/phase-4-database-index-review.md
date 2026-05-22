# Phase 4 Database Index Review

**Date:** 2026-05-19  
**Reference:** `docs/database/phase-4-index-plan.md`

| Collection | Planned index | Model | Status |
|------------|---------------|-------|--------|
| customer_addresses | `customer_addresses_customer` | `{ customerId: 1, isDeleted: 1 }` | **PASS** |
| customer_addresses | `customer_addresses_default` | partial `isDefault: true` | **PASS** |
| customer_store_selections | `customer_store_selections_customer_selected` | partial unique selected | **PASS** |
| carts | `carts_active_unique` | unique partial `status: active` | **PASS** |
| carts | `carts_customer` | `{ customerId: 1, updatedAt: -1 }` | **PASS** |
| checkout_sessions | `checkout_customer_status` | `{ customerId: 1, status: 1 }` | **PASS** |
| checkout_sessions | `checkout_expires` | `{ reservationExpiresAt: 1 }` | **PASS** |
| checkout_sessions | idempotency | `{ customerId: 1, idempotencyKey: 1 }` sparse unique | **PASS** (extra) |
| payments | `payments_gateway_order` | unique `gatewayOrderId` | **PASS** |
| payments | `payments_idempotency` | unique sparse `idempotencyKey` | **PASS** |
| payments | `payments_checkout` | `{ checkoutSessionId: 1 }` | **PASS** |
| orders | `orders_number` | unique `orderNumber` | **PASS** |
| orders | `orders_customer_placed` | `{ customerId: 1, placedAt: -1 }` | **PASS** |
| orders | `orders_payment` | unique `paymentId` | **PASS** |

## Notes

- Checkout `reservationExpiresAt` index present; TTL auto-delete **not** enabled — expiry handled in service layer (**documented GAP** vs optional TTL in index plan).
- Overall index coverage: **PASS**.
