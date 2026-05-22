# Customer App Cart UI Contract

Status: **IMPLEMENTED** — Module 4 (2026-05-19); pricing UX Module 5 (2026-05-19); checkout CTA Module 7.

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Cart | `Cart` | View/edit cart lines and totals |

## API Client (`modules/cart/api/customer-cart.api.ts`)

| Function | HTTP |
|----------|------|
| `getCustomerCart` | GET `/api/v1/customer/cart` (optional `validatePrices`) |
| `recalculateCustomerCart` | POST `/api/v1/customer/cart/recalculate` |
| `addCartItem` | POST `/api/v1/customer/cart/items` |
| `updateCartItem` | PATCH `/api/v1/customer/cart/items/:itemId` |
| `removeCartItem` | DELETE `/api/v1/customer/cart/items/:itemId` |
| `clearCustomerCart` | DELETE `/api/v1/customer/cart` |

All mutations require `storeId` (query or body per `cart-api.md`).

## Hooks

| Hook | Purpose |
|------|---------|
| `useCustomerCart` | Query cart; optional `validateOnFocus`; `CART_NOT_FOUND` → empty cart |
| `useRecalculateCart` | POST recalculate; invalidate cart query |
| `useAddToCart` | POST add line |
| `useUpdateCartItem` | PATCH quantity |
| `useRemoveCartItem` | DELETE line |
| `useClearCart` | DELETE clear items |

Query key: `['customer-cart', storeId]`

## Components

| Component | Purpose |
|-----------|---------|
| `AddToCartButton` | Add variant to cart |
| `CartBottomBar` | Mini-cart bar (count + `grandTotal` → Cart); "incl. tax & delivery" when fees > 0 |
| `CartLineItem` | Single line with stepper + remove |
| `CartQuantityStepper` | Increment/decrement quantity |
| `CartSummaryFooter` | Subtotal, tax, delivery, discount (when > 0), grand total |
| `CartPriceChangedBanner` | Stale price banner + refresh action |
| `CartEmptyState` / `CartErrorState` | Empty or API error |

## Navigation

```text
Home / Catalog stacks → CartBottomBar (when itemCount > 0)
CartBottomBar → Cart
ProductDetail → AddToCartButton
```

**Bottom bar:** Shown on `CustomerHomeScreen` and catalog stack entry screens. Hidden on `CartScreen`.

## Error UX

| Code | User message |
|------|----------------|
| `CART_NOT_FOUND` | Empty cart (no error UI on GET) |
| `CART_ITEM_NOT_FOUND` | Item no longer in cart |
| `CART_PRODUCT_UNAVAILABLE` | Product unavailable at this store |
| `CART_INSUFFICIENT_STOCK` | Not enough stock |
| `CART_MAX_QUANTITY_EXCEEDED` | Maximum quantity per item reached |
| `CART_STORE_MISMATCH` | Store changed — refresh or reselect store |
| `CART_PRICE_CHANGED` | Prices changed — tap refresh to update cart |
| `STORE_NOT_FOUND` | Store not found |

## UX rules

- Block cart fetch until `selectedStoreId` set.
- `CartSummaryFooter`: “Proceed to checkout” navigates to `Checkout` when cart has items (Module 7 — see `customer-app-checkout-ui-contract.md`).
- `CartSummaryFooter`: hide tax/delivery/discount rows when amount is `0`.
- `CartScreen` validates prices on focus; shows `CartPriceChangedBanner` on drift.
- Bottom bar displays `grandTotal` (includes tax and delivery when configured).
- Listing quick-add only when `product.variantId` is set.

## Permissions

Customer JWT only.
