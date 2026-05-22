# Customer App Checkout Flow Verification

## Typecheck

- [x] `npm run typecheck -w apps/customer-app`

## Unit tests

- [x] Checkout error message util tests
- [x] Reservation timer util tests
- [x] `npm run test:customer-checkout -w apps/customer-app` (7 tests)

## Device / manual

- [ ] Cart → Proceed to checkout navigates to CheckoutScreen
- [ ] Address shown; change opens address list
- [ ] Initiate shows summary totals and reservation timer
- [ ] Back with confirm cancels checkout
- [ ] Pay button disabled (“Payment — coming soon”)
- [ ] `CHECKOUT_PRICE_CHANGED` shows go-to-cart action

## Prerequisites

- Backend Module 6 running
- Cart with items, customer address in service area

See `docs/testing/phase-4-module-7-smoke-results.md` for operator checklist.
