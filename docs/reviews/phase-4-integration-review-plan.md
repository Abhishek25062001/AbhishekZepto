# Phase 4 Integration & Review Plan

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 15 — Phase 4 Integration & Review  
**Status:** **IN PROGRESS**

## Goal

Integrate and sign off Phase 4 modules 0–14: customer shopping journey from location through order placement, cross-cutting with Phase 3 catalog and inventory locks. Close Phase 4 and gate Phase 5 planning.

## Modules in scope

| # | Module | Integration focus |
|---|--------|-------------------|
| 0 | Foundation & Bootstrap | Contracts, schemas, route plan |
| 1 | Customer Location & Store Selection | Addresses, serviceability, store |
| 2 | Customer Home & Shopping Entry | Home feed |
| 3 | Cart Backend | Cart CRUD |
| 4 | Customer App Cart Experience | Cart UI, quick-add |
| 5 | Pricing & Cart Calculation | Recalculate, snapshots |
| 6 | Checkout Preparation Backend | Locks, TTL |
| 7 | Customer App Checkout Flow | Checkout UI |
| 8 | Payment Gateway Foundation | Razorpay, webhook |
| 9 | Customer App Payment Flow | SDK, verify |
| 10 | Order Creation Backend | Placement APIs |
| 11 | Customer App Order Confirmation | Order screens |
| 12 | Basic Customer Profile | Profile API/UI |
| 13 | Search & Browsing Improvements | Pagination, OOS (client) |
| 14 | Testing & Validation | Input to this module |

**Module 14 reference:** `docs/reviews/phase-4-final-validation-summary.md`

## Validation categories → artifacts

| Category | Ticket | Document |
|----------|--------|----------|
| Master plan | 1 | This document |
| Integration scope | 2 | `phase-4-integration-scope.md` |
| Backend files | 3 | `phase-4-backend-file-review.md` |
| Customer app files | 4 | `phase-4-customer-app-file-review.md` |
| Contracts | 5 | `phase-4-contract-integration-review.md` |
| Route registry | 6 | `phase-4-route-registry-integration-review.md` |
| DB relationships | 7 | `phase-4-database-integration-review.md` |
| Permissions | 8 | `phase-4-permission-integration-review.md` |
| Customer journey | 9 | `phase-4-customer-journey-integration-review.md` |
| Cart/pricing | 10 | `phase-4-cart-pricing-integration-review.md` |
| Checkout | 11 | `phase-4-checkout-integration-review.md` |
| Payment | 12 | `phase-4-payment-integration-review.md` |
| Orders | 13 | `phase-4-order-integration-review.md` |
| Profile | 14 | `phase-4-profile-integration-review.md` |
| Catalog browse | 15 | `phase-4-catalog-browse-integration-review.md` |
| Seed | 16 | `phase-4-seed-integration-review.md` |
| Env config | 17 | `phase-4-env-config-integration-review.md` |
| Errors | 18 | `phase-4-error-handling-integration-review.md` |
| Security | 19 | `phase-4-security-integration-review.md` |
| Doc coverage | 20 | `phase-4-documentation-coverage.md` |
| Module 14 cross-check | 21 | `phase-4-module-14-cross-check.md` |
| Postman | 22 | `zepto-like-phase-4.postman_collection.json` |
| Release notes | 23 | `phase-4-release-notes.md` |
| Handoff | 24 | `phase-4-integration-review-complete.md` |
| Architecture closeout | 25 | `phase-4-integration-review.md`, completion matrix |
| Quality gates | 26 | `phase-4-integration-quality-results.md` |
| E2E + approval | 27 | E2E checklist, final approval |
| Module closeout | 28 | Module review, progress, Phase 4 closed |

## PASS / FAIL / GAP rules

- **PASS:** Automated tests green or doc requirement met with evidence.
- **GAP:** Documented limitation (OpenAPI partial, manual E2E pending) — non-blocking unless marked blocker.
- **FAIL:** Contradiction or test failure — record in module review; fix only if in ticket scope.

## Command index

```bash
npm run test:phase-4 -w backend/api
npm run test:phase-4-customer -w apps/customer-app
npm run validate:postman:phase-4
npm run typecheck -w backend/api
npm run typecheck -w apps/customer-app
```

## Next

**Phase 5 — Order Lifecycle** (planning only after Module 15 Ticket 28).
