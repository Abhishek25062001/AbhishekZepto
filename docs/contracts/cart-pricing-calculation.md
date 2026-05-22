# Cart Pricing Calculation Contract

Status: **IMPLEMENTED** — Module 5 (2026-05-19).

See also: `docs/architecture/customer-cart-pricing-calculation.md`, `docs/testing/customer-cart-pricing-calculation-verification.md`.

## Formula

```text
lineTotal = quantity * unitPriceSnapshot
subtotal = sum(items[].lineTotal)
discountAmount = 0
taxAmount = round(subtotal * CART_TAX_RATE_PERCENT / 100)
deliveryFeeAmount = CART_DELIVERY_FEE_AMOUNT
grandTotal = subtotal - discountAmount + taxAmount + deliveryFeeAmount
```

## Configuration

| Env | Default | Description |
|-----|---------|-------------|
| `CART_TAX_RATE_PERCENT` | `0` | Flat tax rate on subtotal |
| `CART_DELIVERY_FEE_AMOUNT` | `0` | Flat delivery fee per cart |

## Snapshot refresh

`unitPriceSnapshot` = `store_products.finalPrice` at mutation or `POST /cart/recalculate`.

## Price drift

When `items[].unitPriceSnapshot !== store_products.finalPrice`:

- `GET ?validatePrices=true` → `409 CART_PRICE_CHANGED`
- `POST /cart/recalculate` → refresh snapshots and recalculate

## Module 6

Checkout reuses the same calculation service for `CHECKOUT_PRICE_CHANGED`.
