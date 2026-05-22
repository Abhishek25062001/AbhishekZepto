# Phase 4 Release Notes — Customer Shopping Experience

**Date:** 2026-05-19

## Completed modules (0–13)

Customer location, home, cart, pricing, checkout, payment, orders, profile, and catalog browse improvements.

## Backend APIs

- Customer addresses, serviceability, store selection
- Home shopping entry feed
- Cart CRUD and recalculate
- Checkout with inventory reservation (Phase 3 locks)
- Razorpay payment create/verify and webhook
- Order placement and history
- Customer profile GET/PATCH

## Customer app

- Full shopping journey screens from address selection through order confirmation
- Razorpay payment integration
- Paginated catalog browse and OOS UX (Module 13)

## Dependencies

Phase 3 catalog read, store products, inventory stocks, and inventory locks.

## Validation

- `npm run test:phase-4 -w backend/api` (81 tests)
- `npm run test:phase-4-customer -w apps/customer-app` (65 tests)
- Integration review docs under `docs/reviews/phase-4-*-integration-review.md`

## Known pending

- Manual device E2E (`docs/reviews/phase-4-e2e-journey-checklist.md`)
- OpenAPI partial coverage for Phase 4 paths
- Phase 5 order lifecycle (fulfillment, cancel, etc.)
- Production Razorpay keys and webhook URL

## Next

Phase 5 — Order Lifecycle Architecture
