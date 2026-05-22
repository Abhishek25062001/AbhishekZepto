# Phase 4 Module 4 — Customer App Cart Experience — Complete

**Date:** 2026-05-19

## Summary

Module 4 wires the customer app to Module 3 cart APIs: add-to-cart on product detail and listings, cart screen with quantity management, and a persistent cart bottom bar on home and catalog.

## Customer app module

`apps/customer-app/src/modules/cart/`

| Area | Files |
|------|-------|
| API | `customer-cart.api.ts` |
| Hooks | `useCustomerCart`, `useAddToCart`, `useUpdateCartItem`, `useRemoveCartItem`, `useClearCart` |
| Screens | `CartScreen` |
| Components | `AddToCartButton`, `CartBottomBar`, `CartLineItem`, `CartSummaryFooter`, `CatalogWithCartBar` |

## Navigation

- Main stack: `Cart` → `CartScreen`
- `Catalog` uses `CatalogWithCartBar` (catalog + bottom bar)
- `CustomerHomeScreen` includes `CartBottomBar`

## API consumed (Module 3)

All five `/api/v1/customer/cart` endpoints.

## Tests

```bash
npm run typecheck -w apps/customer-app
npm run test:customer-cart -w apps/customer-app
```

## Known limitations

- Checkout CTA disabled (Module 7)
- No tax/discount breakdown (Module 5)
- Listing quick-add requires `variantId` on catalog product DTO
- Live device smoke PENDING — `docs/testing/phase-4-module-4-smoke-results.md`

## Next

**Module 5 — Pricing & Cart Calculation**
