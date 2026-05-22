# Customer Cart Pricing Calculation

## Module

Phase 4 Module 5 — Pricing & Cart Calculation.

## Goal

Compute full cart totals (subtotal, tax, delivery, grand total), refresh price snapshots from store products, and detect stale snapshots via `CART_PRICE_CHANGED`.

## Pricing formula (MVP)

```text
lineTotal = quantity * unitPriceSnapshot
subtotal = sum(lineTotal)
discountAmount = 0  (promotions deferred)
taxAmount = subtotal * (CART_TAX_RATE_PERCENT / 100)
deliveryFeeAmount = CART_DELIVERY_FEE_AMOUNT (flat)
grandTotal = subtotal - discountAmount + taxAmount + deliveryFeeAmount
```

Amounts use the same numeric units as `store_products.finalPrice` (catalog paise).

## Snapshot source

`unitPriceSnapshot` = `store_products.finalPrice` at add, update, or recalculate.

## API behavior

| Action | Behavior |
|--------|----------|
| POST/PATCH cart items | Refresh snapshot + full pricing |
| GET cart (default) | Return stored cart; recompute line totals from snapshots only |
| GET `?validatePrices=true` | If snapshot ≠ current price → `409 CART_PRICE_CHANGED` |
| POST `/cart/recalculate` | Refresh all snapshots + totals, persist |

## Module layout

`backend/api/src/modules/pricing/` — calculation, drift detection.

Cart module calls pricing service via `cart-totals.util` wrapper.

## Module 6

Checkout will reuse `cart-pricing.service` for `CHECKOUT_PRICE_CHANGED`.

## Out of scope

- Coupons / promotions
- Per-SKU tax categories
- Checkout sessions (Module 6)

## QA

Change `store_products.finalPrice` in MongoDB → `GET ?validatePrices=true` → `POST /recalculate`.
