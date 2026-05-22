# Phase 4 Shared Contracts Plan

Status: **PLANNED** — TypeScript files created in Module 1+, not Module 0.

## Goal

Centralize DTO types in `packages/shared/api/` for customer-app and backend alignment.

## Planned Files (Module 1+)

| File | Contents |
|------|----------|
| `customer-address.types.ts` | Address DTOs, serviceability response |
| `cart.types.ts` | Cart, CartItem, CartTotals |
| `checkout.types.ts` | CheckoutSession, CheckoutSummary |
| `payment.types.ts` | PaymentOrderCreate, PaymentVerify |
| `order.types.ts` | Order, OrderItem, OrderSummary |
| `customer-profile.types.ts` | Profile GET/PATCH |

## Export Plan

Add to `packages/shared/api/index.ts`:

```text
export type * from './customer-address.types';
export type * from './cart.types';
// ...
```

## Phase 3 Strategy

Catalog types may remain app-local until migration — Phase 4 types should use `packages/shared` from first implementation module to avoid drift.

## Module 0 Deliverable

This document only. **No** `.ts` files under `packages/shared/api/` for Phase 4 in Module 0.

## Contract Sources

| Types | Doc |
|-------|-----|
| Address | `docs/contracts/customer-address-api.md` |
| Cart | `docs/contracts/cart-api.md` |
| Checkout | `docs/contracts/checkout-api.md` |
| Payment | `docs/contracts/payment-api.md` |
| Order | `docs/contracts/order-customer-api.md` |
