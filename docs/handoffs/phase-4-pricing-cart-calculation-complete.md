# Phase 4 Module 5 — Pricing & Cart Calculation — Complete

**Date:** 2026-05-19

## Summary

Module 5 adds full cart pricing (subtotal, tax, delivery, grand total), price snapshot refresh, drift detection (`CART_PRICE_CHANGED`), and customer-app breakdown + refresh UX.

## Backend

`backend/api/src/modules/pricing/`

| Area | Purpose |
|------|---------|
| `cart-pricing-math.util` | Line totals, tax, delivery, grand total |
| `cart-price-drift.util` | Compare snapshots vs `store_products.finalPrice` |
| `cart-line-price.util` | Resolve and apply current store prices |
| `cart-pricing.service` | `calculateCartPricing`, `refreshCartSnapshotsAndPricing` |

**Cart integration:** `cart-totals.util` delegates to pricing service; `cart.service` supports `validatePrices` on GET and `recalculateCartForCustomer`.

**Route:** `POST /api/v1/customer/cart/recalculate`

## Env

| Variable | Default |
|----------|---------|
| `CART_TAX_RATE_PERCENT` | `0` |
| `CART_DELIVERY_FEE_AMOUNT` | `0` |

## Customer app

- `recalculateCustomerCart`, `getCustomerCart({ validatePrices })`
- `CartSummaryFooter` breakdown rows
- `CartPriceChangedBanner`, `useRecalculateCart`, `validateOnFocus` on cart screen

## Tests

```bash
npm run typecheck -w backend/api
npm run test:customer-cart -w backend/api
npm run typecheck -w apps/customer-app
npm run test:customer-cart -w apps/customer-app
```

## Known limitations

- Flat tax rate and flat delivery fee only
- `discountAmount = 0` (no promotions)
- Checkout `CHECKOUT_PRICE_CHANGED` in Module 6

## Next

**Module 6 — Checkout Preparation Backend**
