# Customer App Cart Experience

## Module

Phase 4 Module 4 — Customer App Cart Experience.

## Goal

Wire customer-app UI to Module 3 cart APIs: add-to-cart, cart screen, bottom bar, and quantity management.

## Flow

```text
selectedStoreId (Module 1)
  → AddToCartButton (detail / listing / home featured)
  → POST /cart/items
  → React Query invalidates cart
  → CartBottomBar shows count + grandTotal
  → CartScreen: GET cart, PATCH qty, DELETE line, clear cart
```

## API consumption

| Action | Endpoint |
|--------|----------|
| Load cart | `GET /api/v1/customer/cart?storeId=` |
| Add | `POST /api/v1/customer/cart/items` |
| Update qty | `PATCH /api/v1/customer/cart/items/:itemId?storeId=` |
| Remove line | `DELETE /api/v1/customer/cart/items/:itemId?storeId=` |
| Clear | `DELETE /api/v1/customer/cart?storeId=` |

**GET policy:** `CART_NOT_FOUND` → treat as empty cart in UI (0 items).

## Store scoping

All calls use `selectedStoreId` from `useLocationContext`.

## Add-to-cart surfaces

| Surface | variantId source |
|---------|------------------|
| Product detail | `ProductVariantSelector` selection |
| Category / brand / search listings | `CustomerProduct.variantId` (catalog default variant) |
| Home featured | `CustomerProduct.variantId` when present |

## Navigation

```text
CustomerHome / Catalog → CartBottomBar → Cart (CartScreen)
ProductDetail → AddToCartButton → bottom bar updates
```

```text
LocationGate → Home (CustomerHomeScreen + CartBottomBar)
Home → Catalog (CatalogWithCartBar wrapper)
CartBottomBar → Cart screen (Main stack)
ProductDetail → AddToCartButton (variant selector)
```

**Bottom bar:** `CustomerHomeScreen` and `CatalogWithCartBar` (all catalog screens). Not shown on `CartScreen`.

Checkout CTA on cart: **enabled** — navigates to `Checkout` screen (Module 7 — `customer-app-checkout-flow.md`).

## Module layout

`apps/customer-app/src/modules/cart/` — api, hooks, screens, components, types, utils.

## Out of scope

- Checkout, payment, orders
- Cart merge
- Tax/promo breakdown (Module 5)
- Backend changes

## QA

- Customer `9999999999`, OTP `123456`
- Store `STORE-000001`
- Optional seeded cart: `seedDemoCart`

## Related

- `docs/contracts/cart-api.md`
- `docs/contracts/customer-app-cart-ui-contract.md`
- `docs/architecture/customer-cart-backend-foundation.md`
