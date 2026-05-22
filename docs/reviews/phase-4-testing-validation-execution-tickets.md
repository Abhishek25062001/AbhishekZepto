# Phase 4 Testing & Validation — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 14 — Phase 4 Testing & Validation  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 14 tasks, pages 64–66)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 14 micro-tasks, pages 30–32)

**Architecture references (Modules 0–13):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-module-dependencies.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/architecture/phase-4-customer-app-file-structure.md`, `docs/contracts/backend-route-registry.md`, `docs/contracts/phase-4-route-mounting-plan.md`, `docs/security/phase-4-permissions.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/database/phase-4-index-plan.md`, `docs/database/phase-4-seed-data-plan.md`, `docs/handoffs/phase-4-customer-app-search-browsing-complete.md`, per-module handoffs under `docs/handoffs/phase-4-*`

**Prerequisites:**  
Phase 4 **Modules 1–13 complete** (location → home → cart → checkout → payment → orders → profile → browse improvements). Phase 3 catalog/inventory APIs remain consumed, not re-owned.

**PDF vs Module 0 alignment (validation only):**

| PDF / legacy | Implementation |
|--------------|----------------|
| API tests | Run existing `test:customer-*` scripts on `backend/api`; record PASS/FAIL |
| Cart / checkout / payment / order tests | Aggregate in `test:phase-4` (Ticket 24) |
| Customer app tests | Aggregate `test:phase-4-customer` (Ticket 25) |
| E2E journey | Manual checklist: login → address → store → browse → cart → checkout → pay → order |
| New features | **Out of scope** — document gaps only |
| Phase 5 order lifecycle | **Out of scope** |

**Out of scope for this module:**
- New product features or API endpoints
- Repository & Codebase Setup (Phase 1)
- Phase 4 Integration & Review (Module 15) — follows this module
- Admin Dashboard / Vendor Panel Phase 4 features (none in PDF)
- Delivery agent app
- Live Razorpay production keys (use test/sandbox or mocked verify in smoke notes)
- Fixing implementation bugs (record in review docs; fix in owning module or Module 15)

**Execution order notes:**
- Run **Ticket 1** (master plan) before all review docs.
- Run **Tickets 2–5** (structure, schema, indexes) before route/permission reviews.
- Run **Tickets 6–7** (routes, permissions) before API smoke tickets.
- Run **Tickets 8–14** (API smoke) with running API + MongoDB + seed (live or documented GAP).
- Run **Tickets 15–18** (customer app reviews) in parallel with smoke where possible.
- Run **Tickets 19–22** (domain validations) after relevant smoke passes.
- Run **Tickets 23–25** (OpenAPI, quality gates) before manual checklist.
- Run **Tickets 26–27** (manual checklist, risks) then **Ticket 28** (final summary).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Phase 4 testing & validation master plan

**Ticket:** 1 — Phase 4 testing & validation master plan

**Objective:** Create the module master plan listing Phase 4 modules 1–13, validation scopes, review artifact index, and command index (docs only).

**Files to create/update:**
- `docs/reviews/phase-4-testing-validation-plan.md` (create)
- `docs/testing/phase-4-testing-validation-verification.md` (create)

**API endpoints:** Document verification scope for Phase 4 customer routes per `docs/contracts/backend-route-registry.md` (addresses, home, cart, checkout, payments, orders, profile, webhooks); Phase 3 catalog routes referenced as dependency only.

**DB fields:** Reference Phase 4 collections: `customer_addresses`, `customer_store_selections`, `carts`, `checkout_sessions`, `payments`, `orders`; Phase 2 `user_identities` (profile); Phase 3 `inventory_locks`, `inventory_stocks`, `store_products` (checkout/order integration).

**Implementation steps:**
1. List modules 0–13 covered by this validation pass (implementation modules 1–13).
2. Define validation categories: backend structure, DB schema, indexes, route mount, permissions, per-domain API smoke, customer app UI, checkout↔lock, payment idempotency, order placement, seed, OpenAPI, quality gates, manual E2E, production risks.
3. Link each category to review doc (Tickets 2–28).
4. Add verification command index (`test:customer-addresses` through `test:customer-profile`, customer-app module tests).
5. Note live-environment requirement (MongoDB, seed, customer OTP `9999999999` / `123456`).

**Acceptance criteria:**
- Plan doc exists; lists all review outputs; no application code changes.

**Test commands:**
```bash
test -f docs/reviews/phase-4-testing-validation-plan.md && \
test -f docs/testing/phase-4-testing-validation-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Module 13 complete.

---

## Ticket 2 — Phase 4 backend module structure review

**Ticket:** 2 — Phase 4 backend module structure review

**Objective:** Verify Phase 4 backend module folders exist per `phase-4-backend-file-structure.md`.

**Files to create/update:**
- `docs/reviews/phase-4-backend-module-structure-review.md` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Confirm folders: `customer-addresses`, `home`, `cart`, `pricing`, `checkout`, `payment`, `orders`, `profile`.
2. For each, confirm subfolders: `controllers`, `routes`, `services`, `repositories`, `models`, `validators`, `types`, `utils` (where applicable).
3. Record PASS/FAIL vs architecture doc and handoffs (modules 1–12).
4. Note webhook mount under `payment` or `routes/v1`.

**Acceptance criteria:**
- Review doc lists each module with PASS/FAIL; no code changes in this ticket.

**Test commands:**
```bash
test -f docs/reviews/phase-4-backend-module-structure-review.md && \
find backend/api/src/modules/customer-addresses backend/api/src/modules/home backend/api/src/modules/cart backend/api/src/modules/checkout backend/api/src/modules/payment backend/api/src/modules/orders backend/api/src/modules/profile backend/api/src/modules/pricing -type d -maxdepth 2 2>/dev/null | head -40 && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Database schema review (addresses, store selection, carts)

**Ticket:** 3 — Database schema review (addresses, store selection, carts)

**Objective:** Validate Mongoose models and schema docs for location and cart collections.

**Files to create/update:**
- `docs/reviews/phase-4-database-schema-review.md` (create — addresses/carts section)

**API endpoints:** None.

**DB fields:**
- `customer_addresses`: `customerId`, label, address lines, `cityId`, coordinates, `isDefault`, soft-delete, audit fields
- `customer_store_selections`: `customerId`, `storeId`, `addressId`, `isSelected`, timestamps
- `carts`: `customerId`, `storeId`, `status`, `items[]` (variantId, quantity, price snapshots), totals fields, `updatedAt`

**Implementation steps:**
1. Compare models in `customer-addresses`, `cart` modules against `docs/database/customer-address-schema.md`, `customer-store-selection-schema.md`, `cart-schema.md`.
2. Mark each field present/missing/type mismatch.
3. Document gaps only — do not alter models in this ticket.

**Acceptance criteria:**
- Addresses/carts section complete with per-collection PASS/FAIL table.

**Test commands:**
```bash
test -f docs/reviews/phase-4-database-schema-review.md && echo PASS
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Database schema review (checkout, payments, orders)

**Ticket:** 4 — Database schema review (checkout, payments, orders)

**Objective:** Validate checkout, payment, and order collections against schema docs.

**Files to create/update:**
- `docs/reviews/phase-4-database-schema-review.md` (update — commerce section)

**API endpoints:** None.

**DB fields:**
- `checkout_sessions`: `customerId`, `storeId`, `cartId`, `status`, line snapshots, `inventoryLockId` / reservation refs, `reservationExpiresAt`, totals
- `payments`: `checkoutSessionId`, `gatewayOrderId`, `idempotencyKey`, amount, status, Razorpay refs, verify metadata
- `orders`: `orderNumber`, `customerId`, `storeId`, `paymentId`, `status` (`placed`), line items snapshot, totals, `placedAt`

**Implementation steps:**
1. Review models under `checkout`, `payment`, `orders`.
2. Cross-reference `checkout-session-schema.md`, `payment-schema.md`, `order-schema.md`.
3. Note Phase 4 scope: `placed` status only; no fulfillment fields required.

**Acceptance criteria:**
- Commerce section added; full schema review covers all Phase 4 owned collections.

**Test commands:**
```bash
grep -l "checkoutSessionId" backend/api/src/modules/checkout backend/api/src/modules/payment backend/api/src/modules/orders 2>/dev/null | head -5
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Phase 4 database index review

**Ticket:** 5 — Phase 4 database index review

**Objective:** Verify indexes in models match `docs/database/phase-4-index-plan.md`.

**Files to create/update:**
- `docs/reviews/phase-4-database-index-review.md` (create)

**API endpoints:** None.

**DB fields:** Index keys on `customer_addresses`, `carts`, `customer_store_selections`, `checkout_sessions`, `payments`, `orders` per index plan.

**Implementation steps:**
1. For each collection, compare model `schema.index()` / compound indexes to plan table.
2. Mark PASS/FAIL for unique partials (`carts_active_unique`, `payments_gateway_order`, `orders_number`, etc.).
3. Note TTL on `checkout_sessions` if implemented vs job-based expiry.

**Acceptance criteria:**
- Index review doc complete with PASS/FAIL per planned index.

**Test commands:**
```bash
test -f docs/reviews/phase-4-database-index-review.md && echo PASS
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Phase 4 route mounting review

**Ticket:** 6 — Phase 4 route mounting review

**Objective:** Verify all Phase 4 customer routes and Razorpay webhook are mounted per registry and mounting plan.

**Files to create/update:**
- `docs/reviews/phase-4-backend-route-mount-review.md` (create)
- `docs/contracts/backend-route-registry.md` (update — mark modules 1–12 IMPLEMENTED; module 13 client-only note)

**API endpoints:** Verify mounted paths:
- `/api/v1/customer/addresses*`, `/serviceability`, `/store-selection`
- `/api/v1/customer/home`
- `/api/v1/customer/cart*`, `/cart/recalculate`
- `/api/v1/customer/checkout/*`
- `/api/v1/customer/payments/*`
- `/api/v1/customer/orders*`
- `/api/v1/customer/profile`
- `POST /api/v1/webhooks/razorpay`

**DB fields:** N/A.

**Implementation steps:**
1. Trace `customer.routes.ts` (or equivalent) mount chain.
2. Compare to `phase-4-route-mounting-plan.md` and registry tables.
3. Record any PLANNED vs IMPLEMENTED mismatches.

**Acceptance criteria:**
- Route mount review lists every Phase 4 path with PASS/FAIL.

**Test commands:**
```bash
test -f docs/reviews/phase-4-backend-route-mount-review.md && \
grep -q "customer/checkout" docs/contracts/backend-route-registry.md && \
echo PASS
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Phase 4 permissions and auth review

**Ticket:** 7 — Phase 4 permissions and auth review

**Objective:** Validate CUSTOMER role access on Phase 4 routes; no cross-customer data leaks documented.

**Files to create/update:**
- `docs/reviews/phase-4-permission-review.md` (create)

**API endpoints:** All Phase 4 customer routes require `authenticate` + `CUSTOMER` role.

**DB fields:** `customerId` scoping on addresses, carts, checkout, payments, orders.

**Implementation steps:**
1. Review middleware on each route group.
2. Confirm services filter by `req.user.userId` / `customerId`.
3. Cross-reference `docs/security/phase-4-permissions.md`.
4. Note optional fine-grained permissions deferred in Phase 4.

**Acceptance criteria:**
- Permission review doc complete; tenant isolation PASS/FAIL per domain.

**Test commands:**
```bash
test -f docs/reviews/phase-4-permission-review.md && echo PASS
```

**Depends on:** Ticket 6.

---

## Ticket 8 — Address and serviceability API smoke review

**Ticket:** 8 — Address and serviceability API smoke review

**Objective:** Document live or unit-test validation results for Module 1 APIs.

**Files to create/update:**
- `docs/reviews/phase-4-address-api-smoke-review.md` (create)

**API endpoints:**
- `GET/POST/PATCH/DELETE /api/v1/customer/addresses`
- `POST /api/v1/customer/addresses/:addressId/set-default`
- `POST /api/v1/customer/serviceability`
- `POST /api/v1/customer/store-selection`

**DB fields:** `customer_addresses`, `customer_store_selections`, `stores` (serviceability lookup).

**Implementation steps:**
1. Run `npm run test:customer-addresses -w backend/api`; record pass count.
2. Optional live smoke: create address, check serviceability, select store (document commands/responses).
3. Map errors to `phase-4-error-codes.md` (e.g. unserviceable area).

**Acceptance criteria:**
- Smoke review doc with automated PASS + live/GAP columns.

**Test commands:**
```bash
npm run test:customer-addresses -w backend/api
```

**Depends on:** Ticket 7.

---

## Ticket 9 — Home shopping entry API smoke review

**Ticket:** 9 — Home shopping entry API smoke review

**Objective:** Validate Module 2 home feed API tests and optional live response shape.

**Files to create/update:**
- `docs/reviews/phase-4-home-api-smoke-review.md` (create)

**API endpoints:**
- `GET /api/v1/customer/home` (`storeId`, `cityId` query params)

**DB fields:** Read-only joins on catalog featured data; no new collection.

**Implementation steps:**
1. Run `npm run test:customer-home -w backend/api`.
2. Verify response sections: categories, featured products, store context per contract.
3. Record GAP if live seed missing featured data.

**Acceptance criteria:**
- Home smoke review doc exists; unit tests PASS recorded.

**Test commands:**
```bash
npm run test:customer-home -w backend/api
```

**Depends on:** Ticket 8 (store selection prerequisite for meaningful home).

---

## Ticket 10 — Cart and pricing API smoke review

**Ticket:** 10 — Cart and pricing API smoke review

**Objective:** Validate Modules 3 and 5 cart CRUD, recalculate, and pricing integration tests.

**Files to create/update:**
- `docs/reviews/phase-4-cart-api-smoke-review.md` (create)

**API endpoints:**
- `GET/POST/PATCH/DELETE /api/v1/customer/cart*`
- `POST /api/v1/customer/cart/recalculate`
- `GET /api/v1/customer/cart?validatePrices=` (if implemented)

**DB fields:** `carts.items`, price snapshot fields, `store_products` pricing join.

**Implementation steps:**
1. Run `npm run test:customer-cart -w backend/api` (includes pricing utils tests).
2. Document add/update/remove/clear flows and recalculate behavior.
3. Note price-change detection expectations per Module 5 handoff.

**Acceptance criteria:**
- Cart smoke review lists each endpoint with test PASS/FAIL.

**Test commands:**
```bash
npm run test:customer-cart -w backend/api
```

**Depends on:** Ticket 9.

---

## Ticket 11 — Checkout preparation API smoke review

**Ticket:** 11 — Checkout preparation API smoke review

**Objective:** Validate Module 6 checkout initiate, summary, cancel and inventory lock linkage.

**Files to create/update:**
- `docs/reviews/phase-4-checkout-api-smoke-review.md` (create)

**API endpoints:**
- `POST /api/v1/customer/checkout/initiate`
- `GET /api/v1/customer/checkout/summary`
- `POST /api/v1/customer/checkout/cancel`

**DB fields:** `checkout_sessions`, `inventory_locks` (Phase 3), `inventory_stocks.reservedQuantity`.

**Implementation steps:**
1. Run `npm run test:customer-checkout -w backend/api`.
2. Confirm initiate creates lock; cancel releases; summary returns TTL/expiry fields.
3. Cross-reference checkout handoff and `checkout-session-schema.md`.

**Acceptance criteria:**
- Checkout smoke review complete with lock integration noted PASS/FAIL.

**Test commands:**
```bash
npm run test:customer-checkout -w backend/api
```

**Depends on:** Ticket 10.

---

## Ticket 12 — Payment and webhook API smoke review

**Ticket:** 12 — Payment and webhook API smoke review

**Objective:** Validate Module 8 payment create-verify and webhook idempotency tests.

**Files to create/update:**
- `docs/reviews/phase-4-payment-api-smoke-review.md` (create)

**API endpoints:**
- `POST /api/v1/customer/payments/create-order`
- `POST /api/v1/customer/payments/verify`
- `POST /api/v1/webhooks/razorpay`

**DB fields:** `payments` (`gatewayOrderId`, `idempotencyKey`, status transitions).

**Implementation steps:**
1. Run `npm run test:customer-payment -w backend/api`.
2. Document verify returns `orderId` when placement succeeds (Module 10 integration).
3. Note sandbox vs mock for live smoke.

**Acceptance criteria:**
- Payment smoke review records unit test PASS and webhook handler coverage.

**Test commands:**
```bash
npm run test:customer-payment -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Order creation API smoke review

**Ticket:** 13 — Order creation API smoke review

**Objective:** Validate Module 10 order placement and history APIs.

**Files to create/update:**
- `docs/reviews/phase-4-order-api-smoke-review.md` (create)

**API endpoints:**
- `POST /api/v1/customer/orders`
- `GET /api/v1/customer/orders`
- `GET /api/v1/customer/orders/:orderId`

**DB fields:** `orders` (snapshot fields, `status: placed`), cart cleared on success.

**Implementation steps:**
1. Run `npm run test:customer-orders -w backend/api`.
2. Confirm list pagination meta; detail matches placed snapshot.
3. Link payment verify → order creation path from tests.

**Acceptance criteria:**
- Order smoke review doc complete with PASS/FAIL per endpoint.

**Test commands:**
```bash
npm run test:customer-orders -w backend/api
```

**Depends on:** Ticket 12.

---

## Ticket 14 — Profile API smoke review

**Ticket:** 14 — Profile API smoke review

**Objective:** Validate Module 12 profile GET/PATCH.

**Files to create/update:**
- `docs/reviews/phase-4-profile-api-smoke-review.md` (create)

**API endpoints:**
- `GET /api/v1/customer/profile`
- `PATCH /api/v1/customer/profile`

**DB fields:** `user_identities` (`name`, `email` writable; `phone` read-only).

**Implementation steps:**
1. Run `npm run test:customer-profile -w backend/api`.
2. Confirm validation errors map to `PROFILE_VALIDATION_FAILED`.

**Acceptance criteria:**
- Profile smoke review doc exists; tests PASS recorded.

**Test commands:**
```bash
npm run test:customer-profile -w backend/api
```

**Depends on:** Ticket 7.

---

## Ticket 15 — Customer app module structure review

**Ticket:** 15 — Customer app module structure review

**Objective:** Verify Phase 4 customer-app modules exist per `phase-4-customer-app-file-structure.md`.

**Files to create/update:**
- `docs/reviews/phase-4-customer-app-module-structure-review.md` (create)

**API endpoints:** N/A (maps to client modules calling documented APIs).

**DB fields:** N/A.

**Implementation steps:**
1. Confirm folders: `addresses`, `home`, `cart`, `checkout`, `payment`, `orders`, `profile`; catalog updates from Module 13.
2. Each module: `api`, `components`, `hooks`, `screens`, `types`, `utils`, `navigation` where applicable.
3. Record PASS/FAIL vs file structure doc.

**Acceptance criteria:**
- Structure review doc lists all Phase 4 app modules.

**Test commands:**
```bash
test -f docs/reviews/phase-4-customer-app-module-structure-review.md && \
find apps/customer-app/src/modules/addresses apps/customer-app/src/modules/home apps/customer-app/src/modules/cart apps/customer-app/src/modules/checkout apps/customer-app/src/modules/payment apps/customer-app/src/modules/orders apps/customer-app/src/modules/profile -type d -maxdepth 1 2>/dev/null && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 16 — Customer app UI review (location, home, catalog browse)

**Ticket:** 16 — Customer app UI review (location, home, catalog browse)

**Objective:** Review Modules 1–2 and 13 customer-app surfaces against UI contracts.

**Files to create/update:**
- `docs/reviews/phase-4-customer-app-ui-review-location-home-browse.md` (create)

**API endpoints:** Client consumes address, home, catalog list/search APIs (Phase 3 + 4).

**DB fields:** N/A.

**Implementation steps:**
1. Review: address list/form, serviceability banner, home screen, catalog stack, paginated category/brand/search (Module 13).
2. Check `useLocationContext` wires `storeId` on catalog queries.
3. Run `npm run test:customer-catalog-browsing -w apps/customer-app`; record count.
4. Mark manual device steps PENDING in checklist reference.

**Acceptance criteria:**
- UI review doc with PASS/FAIL per screen; automated catalog-browsing tests noted.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app && \
npm run test:customer-catalog-browsing -w apps/customer-app
```

**Depends on:** Tickets 8–9, 15.

---

## Ticket 17 — Customer app UI review (cart experience)

**Ticket:** 17 — Customer app UI review (cart experience)

**Objective:** Review Module 4 cart UI: bottom bar, add-to-cart, cart screen.

**Files to create/update:**
- `docs/reviews/phase-4-customer-app-ui-review-cart.md` (create)

**API endpoints:** Cart CRUD client paths per `customer-app-cart-ui-contract.md`.

**DB fields:** N/A.

**Implementation steps:**
1. Review `CartBottomBar`, `AddToCartButton`, cart screen/list items.
2. Confirm OOS disables quick-add (Module 13 + Module 4).
3. Run `npm run test:customer-cart -w apps/customer-app`.

**Acceptance criteria:**
- Cart UI review doc complete; unit tests PASS recorded.

**Test commands:**
```bash
npm run test:customer-cart -w apps/customer-app
```

**Depends on:** Ticket 10, 16.

---

## Ticket 18 — Customer app UI review (checkout, payment, orders, profile)

**Ticket:** 18 — Customer app UI review (checkout, payment, orders, profile)

**Objective:** Review Modules 7, 9, 11, 12 customer-app flows.

**Files to create/update:**
- `docs/reviews/phase-4-customer-app-ui-review-checkout-orders.md` (create)

**API endpoints:** Checkout, payment verify, orders list/detail, profile GET/PATCH (client).

**DB fields:** N/A.

**Implementation steps:**
1. Review: `CheckoutScreen`, payment SDK flow, `OrderSuccess`, `OrderDetail`, `OrderHistory`, `CustomerProfileScreen`.
2. Confirm verify navigates to `OrderSuccess` with `orderId`.
3. Run: `test:customer-checkout`, `test:customer-payment`, `test:customer-orders`, `test:customer-profile` on customer-app.

**Acceptance criteria:**
- Combined UI review doc; all four test scripts PASS recorded.

**Test commands:**
```bash
npm run test:customer-checkout -w apps/customer-app && \
npm run test:customer-payment -w apps/customer-app && \
npm run test:customer-orders -w apps/customer-app && \
npm run test:customer-profile -w apps/customer-app
```

**Depends on:** Tickets 11–14, 15.

---

## Ticket 19 — Checkout and inventory lock validation

**Ticket:** 19 — Checkout and inventory lock validation

**Objective:** Document end-to-end reservation behavior: initiate → lock → cancel/expiry → payment success release/confirm.

**Files to create/update:**
- `docs/reviews/phase-4-checkout-inventory-lock-validation.md` (create)

**API endpoints:** `checkout/initiate`, `checkout/cancel`; internal lock APIs (Phase 3).

**DB fields:** `inventory_locks.status`, `expiresAt`, `checkout_sessions.inventoryLockId`, `inventory_stocks.availableQuantity`, `reservedQuantity`.

**Implementation steps:**
1. Trace code path from `checkout.service` to `inventory-lock.service`.
2. Confirm TTL/expiry handling matches Module 6 handoff.
3. Record PASS/FAIL for: double initiate, cancel releases stock, expired session blocks payment.

**Acceptance criteria:**
- Validation doc with scenario table; no new features.

**Test commands:**
```bash
npm run test:customer-checkout -w backend/api && \
test -f docs/reviews/phase-4-checkout-inventory-lock-validation.md && \
echo PASS
```

**Depends on:** Tickets 11, 12.

---

## Ticket 20 — Payment idempotency and webhook validation

**Ticket:** 20 — Payment idempotency and webhook validation

**Objective:** Document duplicate verify/webhook handling and signature checks.

**Files to create/update:**
- `docs/reviews/phase-4-payment-idempotency-validation.md` (create)

**API endpoints:** `payments/verify`, `webhooks/razorpay`.

**DB fields:** `payments.idempotencyKey`, `gatewayOrderId`, status enum.

**Implementation steps:**
1. Review `payment.service` and `payment-webhook.service` tests for duplicate events.
2. Confirm Razorpay signature util covered in unit tests.
3. Note env vars required (`RAZORPAY_*`) for live smoke.

**Acceptance criteria:**
- Idempotency validation doc complete; references test file names.

**Test commands:**
```bash
npm run test:customer-payment -w backend/api && \
test -f docs/reviews/phase-4-payment-idempotency-validation.md && \
echo PASS
```

**Depends on:** Ticket 12.

---

## Ticket 21 — Order placement and cart clear validation

**Ticket:** 21 — Order placement and cart clear validation

**Objective:** Document order creation side effects: stock confirm, cart clear, checkout session complete.

**Files to create/update:**
- `docs/reviews/phase-4-order-placement-validation.md` (create)

**API endpoints:** `payments/verify`, `POST /customer/orders`, order read APIs.

**DB fields:** `orders` snapshot fields; `carts.status`; lock `confirmed` state.

**Implementation steps:**
1. Trace verify → order service → inventory confirm from tests.
2. Confirm idempotent re-verify does not duplicate orders.
3. Align with Module 10 handoff acceptance criteria.

**Acceptance criteria:**
- Placement validation doc lists side effects with PASS/FAIL.

**Test commands:**
```bash
npm run test:customer-orders -w backend/api && \
test -f docs/reviews/phase-4-order-placement-validation.md && \
echo PASS
```

**Depends on:** Tickets 13, 20.

---

## Ticket 22 — Phase 4 seed data validation

**Ticket:** 22 — Phase 4 seed data validation

**Objective:** Validate demo seed supports full customer journey per `phase-4-seed-data-plan.md`.

**Files to create/update:**
- `docs/reviews/phase-4-seed-data-validation.md` (create)

**API endpoints:** N/A (seed enables smoke).

**DB fields:** Seeded customer, address, store, products with stock, demo cart optional.

**Implementation steps:**
1. Review seed scripts: demo customer phone, store assignment, cart seed test if present.
2. Run `npm run test:customer-cart -w backend/api` (includes `seed-demo-cart.test.js` if listed).
3. Document idempotent re-run behavior.

**Acceptance criteria:**
- Seed validation doc lists required entities for E2E; PASS/FAIL for idempotency.

**Test commands:**
```bash
grep -l "seed" backend/api/src/database/seeds/*.ts 2>/dev/null | head -10 && \
test -f docs/reviews/phase-4-seed-data-validation.md && \
echo PASS
```

**Depends on:** Ticket 10.

---

## Ticket 23 — OpenAPI and route registry alignment (Phase 4)

**Ticket:** 23 — OpenAPI and route registry alignment (Phase 4)

**Objective:** Compare OpenAPI spec / public docs to mounted Phase 4 routes.

**Files to create/update:**
- `docs/reviews/phase-4-openapi-contract-review.md` (create)
- `docs/contracts/backend-route-registry.md` (update — module 13 note, status sync)

**API endpoints:** All Phase 4 paths in registry vs `GET /api/v1/public/openapi.json` (if generated).

**DB fields:** N/A.

**Implementation steps:**
1. List Phase 4 paths in registry with IMPLEMENTED status.
2. Fetch or grep OpenAPI for same paths; record missing/extra.
3. Do not implement new routes — GAP list only.

**Acceptance criteria:**
- OpenAPI review doc with diff table.

**Test commands:**
```bash
test -f docs/reviews/phase-4-openapi-contract-review.md && echo PASS
```

**Depends on:** Ticket 6.

---

## Ticket 24 — Backend quality gates and test:phase-4 script

**Ticket:** 24 — Backend quality gates and test:phase-4 script

**Objective:** Add aggregate `test:phase-4` script; run all Phase 4 backend checks; record results.

**Files to create/update:**
- `docs/reviews/phase-4-backend-quality-results.md` (create)
- `backend/api/package.json` (update — add `test:phase-4` aggregating `test:customer-addresses` through `test:customer-profile`)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Add script:
   `test:customer-addresses && test:customer-home && test:customer-cart && test:customer-checkout && test:customer-payment && test:customer-orders && test:customer-profile`
2. Run: `typecheck`, `lint`, `build`, `test:phase-4`.
3. Run Phase 2/3 regression spot-check: `test:access-control-harness` (optional, document).
4. Save pass/fail counts and date in results doc.

**Acceptance criteria:**
- `test:phase-4` exists; results doc shows PASS/FAIL per command.

**Test commands:**
```bash
npm run typecheck -w backend/api && \
npm run test:phase-4 -w backend/api
```

**Depends on:** Tickets 8–14, 19–22.

---

## Ticket 25 — Customer app quality gates and test:phase-4-customer script

**Ticket:** 25 — Customer app quality gates and test:phase-4-customer script

**Objective:** Add aggregate customer-app test script; run typecheck and module tests; record results.

**Files to create/update:**
- `docs/reviews/phase-4-customer-app-quality-results.md` (create)
- `apps/customer-app/package.json` (update — add `test:phase-4-customer` chaining module test scripts)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Add `test:phase-4-customer` chaining: `test:customer-cart`, `test:customer-checkout`, `test:customer-payment`, `test:customer-orders`, `test:customer-profile`, `test:customer-catalog-browsing` (and `test:catalog` if needed for regression).
2. Run `npm run typecheck -w apps/customer-app`, `npm run test:phase-4-customer -w apps/customer-app`.
3. Record results in quality doc.

**Acceptance criteria:**
- Aggregate script exists; results doc complete.

**Test commands:**
```bash
npm run typecheck -w apps/customer-app && \
npm run test:phase-4-customer -w apps/customer-app
```

**Depends on:** Tickets 16–18.

---

## Ticket 26 — Manual smoke checklist (full customer journey)

**Ticket:** 26 — Manual smoke checklist (full customer journey)

**Objective:** Create consolidated manual E2E checklist for Phase 4 customer shopping journey.

**Files to create/update:**
- `docs/reviews/phase-4-manual-smoke-checklist.md` (create)
- `docs/testing/phase-4-testing-validation-verification.md` (update — link manual checklist)

**API endpoints:** Full journey: auth OTP → addresses → store → home → browse/search → cart → checkout → payment → order → profile.

**DB fields:** Key fields to verify in UI: cart totals, checkout timer, order `placed` status, profile name/email.

**Implementation steps:**
1. Add steps with checkboxes: Executed / PASS / Notes / Tester / Date.
2. Include OTP `9999999999` / `123456` and store selection prerequisite.
3. Include Module 13 pagination scroll and OOS card checks.
4. Note Razorpay sandbox/test card steps or “mock verify” if no keys.

**Acceptance criteria:**
- Checklist usable for QA sign-off; doc-only ticket.

**Test commands:**
```bash
test -f docs/reviews/phase-4-manual-smoke-checklist.md && echo PASS
```

**Depends on:** Tickets 8–18.

---

## Ticket 27 — Phase 4 production readiness risks

**Ticket:** 27 — Phase 4 production readiness risks

**Objective:** Document known Phase 4 production risks and mitigations.

**Files to create/update:**
- `docs/reviews/phase-4-production-readiness-risks.md` (create)

**API endpoints:** Risk context: payment webhook, checkout TTL, cart pricing drift.

**DB fields:** `checkout_sessions.reservationExpiresAt`, `payments.idempotencyKey`, `inventory_locks`, cart price snapshots.

**Implementation steps:**
1. Document risks: Razorpay live keys, webhook replay, lock TTL vs payment latency, price drift at checkout, OTP dev bypass, no order fulfillment UI, MongoDB transaction limits, seed vs production data.
2. Add mitigation per risk.
3. Link deferred items to Module 15 Integration & Review.

**Acceptance criteria:**
- Risks doc complete; no new features.

**Test commands:**
```bash
test -f docs/reviews/phase-4-production-readiness-risks.md && echo PASS
```

**Depends on:** Tickets 19–21.

---

## Ticket 28 — Final validation summary and module closeout

**Ticket:** 28 — Final validation summary and module closeout

**Objective:** Consolidate all review docs; sign off; update progress and handoff.

**Files to create/update:**
- `docs/reviews/phase-4-final-validation-summary.md` (create)
- `docs/reviews/phase-4-testing-validation-execution-tickets.md` (update — all tickets DONE)
- `docs/testing/phase-4-testing-validation-verification.md` (update — VERIFIED)
- `docs/handoffs/phase-4-testing-validation-complete.md` (create)
- `project-context/CURRENT_PROGRESS.md` (update — Module 14 DONE, Module 15 next)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — if present)

**API endpoints:** Sign-off: all Phase 4 customer + webhook routes validated per smoke reviews.

**DB fields:** Sign-off: schemas, indexes, seed journey validated.

**Implementation steps:**
1. Link all review docs from Tickets 2–27 in summary.
2. Add checklist: backend APIs, DB, indexes, permissions, cart/checkout/payment/order flows, customer UI, quality gates, manual smoke.
3. Add sign-off: Reviewer, Date, Approved, Notes, blockers.
4. Set next module: **15 — Phase 4 Integration & Review**.

**Acceptance criteria:**
- Final summary complete; handoff created; progress updated.

**Test commands:**
```bash
npm run test:phase-4 -w backend/api && \
npm run test:phase-4-customer -w apps/customer-app && \
test -f docs/reviews/phase-4-final-validation-summary.md && \
echo PASS
```

**Depends on:** Tickets 1–27.

---

## Module 14 summary

| Item | Value |
|------|--------|
| Total tickets | 28 |
| New feature tickets | 0 |
| Review / validation docs | 22 (Tickets 2–23, 26–27) |
| Quality gate tickets | 2 (Tickets 24–25) |
| Closeout tickets | 3 (Tickets 1, 26, 28) |
| Backend test aggregate | `test:phase-4` (Ticket 24) |
| Customer app test aggregate | `test:phase-4-customer` (Ticket 25) |
| Blocks | Module 15 — Phase 4 Integration & Review |

**Next module to implement:** **Module 15 — Phase 4 Integration & Review**

---

## Module 14 completion report (2026-05-19)

All 28 tickets complete. Backend `test:phase-4` (81 tests) and customer-app `test:phase-4-customer` (65 tests) pass. Manual E2E checklist pending operator.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5 → 6 → 7
7 → 8 → 9 → 10 → 11 → 12 → 13
7 → 14
1 → 15 → 16 → 17 → 18
11,12 → 19 | 12 → 20 | 13,20 → 21
10 → 22 | 6 → 23
8–14,19–22 → 24 | 16–18 → 25
8–18 → 26 | 19–21 → 27
1–27 → 28
```

**Critical path:** 1 → 2 → 5 → 6 → 7 → 10 → 11 → 12 → 13 → 24 → 28  
**Parallel:** 14–18 UI reviews; 19–22 domain validations; 26–27

**Cross-module order:** Module 13 complete. This module validates modules 1–13. Module 15 (Integration & Review) follows.
