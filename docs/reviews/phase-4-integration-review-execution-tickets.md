# Phase 4 Integration & Review — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 15 — Phase 4 Integration & Review  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 15 tasks, pages 66–68)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 15 micro-tasks, pages 32–34)

**Architecture references (Modules 0–14):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-module-dependencies.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/architecture/phase-4-customer-app-file-structure.md`, `docs/architecture/phase-4-inventory-lock-integration.md`, `docs/contracts/backend-route-registry.md`, `docs/contracts/phase-4-route-mounting-plan.md`, `docs/security/phase-4-permissions.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/handoffs/phase-4-testing-validation-complete.md`, `docs/reviews/phase-4-final-validation-summary.md`, `docs/reviews/phase-4-production-readiness-risks.md`, per-module handoffs under `docs/handoffs/phase-4-*`

**Prerequisites:**  
Phase 4 **Module 14 complete** (Testing & Validation — automated tests PASS; review docs under `docs/reviews/phase-4-*`). Phase 3 catalog/inventory/media remain upstream dependencies.

**PDF vs Module 0 alignment (integration & closeout only):**

| PDF / legacy | Implementation |
|--------------|----------------|
| E2E customer journey | Document + verify: login → address → store → browse → cart → checkout → pay → order → profile |
| Cross-module integration | Reviews linking modules 1–13 + Phase 3 catalog/locks |
| Phase 4 handoff | `phase-4-integration-review-complete.md` |
| Phase 5 gate | Document boundary; do not implement Phase 5 |
| Code fixes | Record blockers only; fix in follow-up if outside ticket scope |
| New features | **Out of scope** |

**Out of scope for this module:**
- New product features, API endpoints, or Mongoose models
- Repository & Codebase Setup (Phase 1)
- Phase 5 Order Lifecycle (starts after Module 15 closeout)
- Admin Dashboard / Vendor Panel Phase 4 features (none in PDF)
- Delivery agent app
- Implementing deferred OpenAPI paths (document GAP only)
- Re-running full Phase 3 `test:phase-3` (reference Module 14/Phase 3 results only)

**Execution order notes:**
- Run **Ticket 1** (master plan) before all review docs.
- Run **Tickets 2–5** (scope, file reviews, contracts) before route/database reviews.
- Run **Tickets 6–8** (routes, DB relationships, permissions) before domain integration reviews.
- Run **Tickets 9–15** (journey + domain integrations) after Ticket 8; Tickets 10–14 can parallelize after Ticket 9.
- Run **Tickets 16–21** (seed, env, errors, security, docs, module 14 cross-check) before Postman/release.
- Run **Tickets 22–25** (Postman, release notes, handoff, architecture closeout).
- Run **Tickets 26–28** (quality re-verify, E2E checklist, final approval & closeout) last.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (completed 2026-05-19)

---

## Ticket 1 — Phase 4 integration & review master plan

**Ticket:** 1 — Phase 4 integration & review master plan

**Objective:** Create the module master plan listing integration review artifacts, dependencies on Module 14 outputs, and execution index (docs only).

**Files to create/update:**
- `docs/reviews/phase-4-integration-review-plan.md` (create)
- `docs/testing/phase-4-integration-review-verification.md` (create)

**API endpoints:** Index Phase 4 customer routes + webhook per `docs/contracts/backend-route-registry.md`; Phase 3 catalog routes as upstream dependency.

**DB fields:** Index Phase 4 collections (`customer_addresses`, `customer_store_selections`, `carts`, `checkout_sessions`, `payments`, `orders`) + Phase 3 integration collections used at checkout/order (`inventory_locks`, `inventory_stocks`, `store_products`).

**Implementation steps:**
1. List modules 0–14 in scope; link Module 14 `phase-4-final-validation-summary.md`.
2. Map tickets 2–28 to review docs and prerequisites.
3. Define PASS/FAIL/GAP rules (live E2E vs automated).
4. Add command index: `test:phase-4`, `test:phase-4-customer`, `check:secrets`, module 14 review doc paths.
5. State this module closes Phase 4 and gates Phase 5 planning.

**Acceptance criteria:**
- Plan and verification tracker exist; no application code.

**Test commands:**
```bash
test -f docs/reviews/phase-4-integration-review-plan.md && \
test -f docs/testing/phase-4-integration-review-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Module 14 complete.

---

## Ticket 2 — Phase 4 integration scope document

**Ticket:** 2 — Phase 4 integration scope document

**Objective:** Create authoritative Phase 4 integration scope with goals, backend/frontend scope, API surface, and DB inventory.

**Files to create/update:**
- `docs/architecture/phase-4-integration-scope.md` (create)
- `docs/testing/phase-4-integration-review-verification.md` (update — link scope doc)

**API endpoints:** Document (reference only):
- **Module 1:** `GET|POST|PATCH|DELETE /customer/addresses`, `POST /serviceability`, `POST /store-selection`
- **Module 2:** `GET /customer/home`
- **Modules 3, 5:** `GET|POST|PATCH|DELETE /customer/cart*`, `POST /cart/recalculate`
- **Module 6:** `POST|GET /checkout/initiate|summary`, `POST /checkout/cancel`
- **Module 8:** `POST /payments/create-order|verify`, `POST /webhooks/razorpay`
- **Module 10:** `POST|GET /customer/orders*`
- **Module 12:** `GET|PATCH /customer/profile`
- **Phase 3 (consumed):** `GET /customer/catalog/*` (products, search, categories, brands, detail, variants)

**DB fields:** Document Phase 4 owned fields per schema docs; cross-ref Phase 3 `store_products`, `inventory_stocks`, `inventory_locks` for checkout/order.

**Implementation steps:**
1. Add Phase 4 goal and completed systems list (modules 1–13).
2. Backend scope: addresses through orders + pricing module.
3. Frontend scope: customer-app modules only (no Phase 4 admin/vendor).
4. API surface tables by module.
5. DB collections and critical cross-collection relationships.
6. Phase 5 boundary note.

**Acceptance criteria:**
- Scope doc complete; matches architecture and registry.

**Test commands:**
```bash
test -f docs/architecture/phase-4-integration-scope.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Backend Phase 4 file integration review

**Ticket:** 3 — Backend Phase 4 file integration review

**Objective:** Verify Phase 4 backend modules and cross-links to Phase 3 inventory locks; record PASS/GAP.

**Files to create/update:**
- `docs/reviews/phase-4-backend-file-review.md` (create)

**API endpoints:** Reference routes mounted from each module folder.

**DB fields:** Reference models: `customer-address`, `customer-store-selection`, `cart`, `checkout-session`, `payment`, `order`; profile uses `user_identities` repository.

**Implementation steps:**
1. Review folders: `customer-addresses`, `home`, `cart`, `pricing`, `checkout`, `payment`, `orders`, `profile`.
2. Confirm checkout → `checkout-inventory-lock.util.ts` and Phase 3 lock client usage.
3. Confirm payment → webhook controller/middleware.
4. Confirm orders → payment service integration for placement.
5. Record GAPs only; no code in this ticket.

**Acceptance criteria:**
- Backend file review doc lists each module PASS/GAP.

**Test commands:**
```bash
test -f docs/reviews/phase-4-backend-file-review.md && \
find backend/api/src/modules/customer-addresses backend/api/src/modules/checkout backend/api/src/modules/payment backend/api/src/modules/orders -type f -name '*.ts' 2>/dev/null | head -20 && \
echo PASS
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Customer app Phase 4 file integration review

**Ticket:** 4 — Customer app Phase 4 file integration review

**Objective:** Verify customer-app Phase 4 modules and navigation wiring for full shopping journey.

**Files to create/update:**
- `docs/reviews/phase-4-customer-app-file-review.md` (create)

**API endpoints:** Map each module `api/` client to backend paths per UI contracts.

**DB fields:** N/A (client).

**Implementation steps:**
1. Review: `addresses`, `home`, `cart`, `checkout`, `payment`, `orders`, `profile`, `catalog` (Module 13).
2. Confirm `MainNavigator` / stack registers Catalog, Addresses, Checkout, Orders, Profile.
3. Confirm `useLocationContext` used by catalog/cart flows.
4. Confirm payment success → `OrderSuccess` navigation.
5. Record PASS/GAP per module folder.

**Acceptance criteria:**
- Customer app file review doc complete.

**Test commands:**
```bash
test -f docs/reviews/phase-4-customer-app-file-review.md && \
find apps/customer-app/src/modules/addresses apps/customer-app/src/modules/checkout apps/customer-app/src/modules/orders -maxdepth 2 -type d 2>/dev/null && \
echo PASS
```

**Depends on:** Ticket 2.

---

## Ticket 5 — Phase 4 contract integration review

**Ticket:** 5 — Phase 4 contract integration review

**Objective:** Cross-check all Phase 4 API/UI contracts for consistency with implementation and registry.

**Files to create/update:**
- `docs/reviews/phase-4-contract-integration-review.md` (create)

**API endpoints:** All paths in `docs/contracts/customer-*-api.md`, `cart-api.md`, `checkout-api.md`, `payment-api.md`, `order-customer-api.md`, UI contracts under `docs/contracts/customer-app-*`.

**DB fields:** Contract field names vs model/DTO names (e.g. `orderNumber`, `placedAt`, cart snapshots).

**Implementation steps:**
1. List each contract doc with IMPLEMENTED vs GAP status.
2. Cross-check error codes in `phase-4-error-codes.md` appear in contracts.
3. Cross-check validation rules in `phase-4-validation-rules.md`.
4. Note OpenAPI partial coverage (defer to Ticket 22).
5. Link Module 0 bootstrap contracts.

**Acceptance criteria:**
- Contract review table complete; no contradictions between registry and contracts.

**Test commands:**
```bash
test -f docs/reviews/phase-4-contract-integration-review.md && \
ls docs/contracts/customer-*.md docs/contracts/cart-api.md docs/contracts/checkout-api.md 2>/dev/null | head -10 && \
echo PASS
```

**Depends on:** Ticket 3.

---

## Ticket 6 — Route registry integration review

**Ticket:** 6 — Route registry integration review

**Objective:** Finalize `backend-route-registry.md` for Phase 4; confirm all modules 1–12 IMPLEMENTED; Module 13 client-only.

**Files to create/update:**
- `docs/reviews/phase-4-route-registry-integration-review.md` (create)
- `docs/contracts/backend-route-registry.md` (update — remove stale PLANNED rows; modules 1–13 status)

**API endpoints:** Full Phase 4 customer + webhook table audit.

**DB fields:** N/A.

**Implementation steps:**
1. Trace `customer.routes.ts` and `webhooks.routes.ts` vs registry.
2. Mark each path IMPLEMENTED or GAP.
3. Document catalog routes as Phase 3 dependency still mounted under `/customer/catalog`.
4. Sync with `phase-4-route-mounting-plan.md`.

**Acceptance criteria:**
- Route integration review PASS; registry updated.

**Test commands:**
```bash
test -f docs/reviews/phase-4-route-registry-integration-review.md && \
grep -q "IMPLEMENTED" docs/contracts/backend-route-registry.md && \
echo PASS
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Database relationship integration review

**Ticket:** 7 — Database relationship integration review

**Objective:** Document cross-collection relationships for the shopping journey (Phase 4 ↔ Phase 3).

**Files to create/update:**
- `docs/reviews/phase-4-database-integration-review.md` (create)

**API endpoints:** N/A.

**DB fields:**
- `customer_addresses.customerId` → auth user
- `customer_store_selections` → `stores`, `customer_addresses`
- `carts` → `customerId`, `storeId`, line `variantId` / `storeProductId`
- `checkout_sessions` → `cartId`, `lockTokens[]`, `addressId`
- `payments` → `checkoutSessionId`, `gatewayOrderId`
- `orders` → `paymentId`, `customerId`, `storeId`, line snapshots
- `inventory_locks` → checkout reservation (Phase 3)
- `inventory_stocks` → confirm on order (Phase 3)

**Implementation steps:**
1. Diagram or table: entity relationships for happy-path order flow.
2. Compare to `phase-4-database-schema-review.md` (Module 14).
3. Note orphan/TTL cleanup paths (checkout expiry).
4. Record PASS/GAP for referential integrity enforced in services.

**Acceptance criteria:**
- Database integration review doc complete with relationship table.

**Test commands:**
```bash
test -f docs/reviews/phase-4-database-integration-review.md && echo PASS
```

**Depends on:** Ticket 6.

---

## Ticket 8 — Permission integration review

**Ticket:** 8 — Permission integration review

**Objective:** Consolidate Phase 4 permission model: CUSTOMER role, data isolation, webhook auth.

**Files to create/update:**
- `docs/reviews/phase-4-permission-integration-review.md` (create)

**API endpoints:** All `/customer/*` Phase 4 routes; `POST /webhooks/razorpay`.

**DB fields:** `customerId` scoping on all mutable Phase 4 collections.

**Implementation steps:**
1. Merge findings from Module 14 `phase-4-permission-review.md`.
2. Add integration checks: customer A cannot read customer B cart/order/profile.
3. Webhook: signature middleware, no JWT.
4. Cross-ref `docs/security/phase-4-permissions.md`.
5. Note deferred fine-grained profile permissions.

**Acceptance criteria:**
- Permission integration review PASS with cross-customer isolation documented.

**Test commands:**
```bash
test -f docs/reviews/phase-4-permission-integration-review.md && echo PASS
```

**Depends on:** Ticket 7.

---

## Ticket 9 — Customer shopping journey integration (E2E flow)

**Ticket:** 9 — Customer shopping journey integration (E2E flow)

**Objective:** Document the integrated happy-path and failure-path customer journey across modules 1–13.

**Files to create/update:**
- `docs/reviews/phase-4-customer-journey-integration-review.md` (create)
- `docs/architecture/phase-4-integration-scope.md` (update — link journey doc)

**API endpoints:** Sequence:
1. Auth OTP (Phase 2)
2. Addresses → serviceability → store-selection
3. Home
4. Catalog browse/search (Phase 3 + 13)
5. Cart CRUD
6. Checkout initiate → summary
7. Payment create → verify
8. Order read
9. Profile

**DB fields:** State transitions per step (`carts.status`, `checkout_sessions.status`, `payments.status`, `orders.status`).

**Implementation steps:**
1. Mermaid or numbered flow for happy path.
2. Branch flows: unserviceable address, OOS product, checkout cancel, payment fail, verify without orderId, expired reservation.
3. Map each step to backend module + customer-app screen.
4. List backend authority rules (no client-side final totals).
5. Reference Module 14 manual checklist for device verification.

**Acceptance criteria:**
- Journey doc is the Phase 4 integration centerpiece; all modules 1–13 referenced.

**Test commands:**
```bash
test -f docs/reviews/phase-4-customer-journey-integration-review.md && \
grep -q "checkout" docs/reviews/phase-4-customer-journey-integration-review.md && \
echo PASS
```

**Depends on:** Ticket 8.

---

## Ticket 10 — Cart and pricing integration review

**Ticket:** 10 — Cart and pricing integration review

**Objective:** Integrate review of Modules 3, 4, 5: cart API, pricing recalculate, customer-app cart UI.

**Files to create/update:**
- `docs/reviews/phase-4-cart-pricing-integration-review.md` (create)

**API endpoints:** `/customer/cart*`, `/customer/cart/recalculate`.

**DB fields:** `carts.items`, price snapshots, `grandTotal`, `lastCalculatedAt`; `store_products` pricing join.

**Implementation steps:**
1. Link Module 14 `phase-4-cart-api-smoke-review.md` and cart UI review.
2. Document per-store active cart uniqueness index.
3. Document price drift detection path to checkout.
4. Confirm quick-add uses `variantId` from listing DTO.
5. Overall PASS/FAIL.

**Acceptance criteria:**
- Cart/pricing integration review complete.

**Test commands:**
```bash
test -f docs/reviews/phase-4-cart-pricing-integration-review.md && \
npm run test:customer-cart -w backend/api 2>&1 | tail -3
```

**Depends on:** Ticket 9.

---

## Ticket 11 — Checkout and inventory lock integration review

**Ticket:** 11 — Checkout and inventory lock integration review

**Objective:** Integrate Module 6 + 7 with Phase 3 locks per `phase-4-inventory-lock-integration.md`.

**Files to create/update:**
- `docs/reviews/phase-4-checkout-integration-review.md` (create)

**API endpoints:** `/checkout/initiate`, `/summary`, `/cancel`; internal lock APIs.

**DB fields:** `checkout_sessions.lockTokens`, `reservationExpiresAt`; `inventory_locks`, `inventory_stocks.reservedQuantity`.

**Implementation steps:**
1. Consolidate Module 14 `phase-4-checkout-inventory-lock-validation.md`.
2. Map checkout UI timer to `reservationExpiresAt`.
3. Document cancel and expiry release paths.
4. Document initiate rollback on partial lock failure.
5. PASS/FAIL integration sign-off.

**Acceptance criteria:**
- Checkout integration review links backend, Phase 3 locks, and checkout UI.

**Test commands:**
```bash
test -f docs/reviews/phase-4-checkout-integration-review.md && \
npm run test:customer-checkout -w backend/api 2>&1 | tail -3
```

**Depends on:** Ticket 10.

---

## Ticket 12 — Payment and webhook integration review

**Ticket:** 12 — Payment and webhook integration review

**Objective:** Integrate Modules 8–9: Razorpay create/verify, webhook, customer-app payment flow.

**Files to create/update:**
- `docs/reviews/phase-4-payment-integration-review.md` (create)

**API endpoints:** `/payments/create-order`, `/payments/verify`, `/webhooks/razorpay`.

**DB fields:** `payments.gatewayOrderId`, `idempotencyKey`, status; link to `checkoutSessionId`.

**Implementation steps:**
1. Consolidate Module 14 payment idempotency validation.
2. Document verify → `orderId` response for app navigation.
3. Document env vars: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, webhook secret.
4. Map customer-app Razorpay SDK entry from CheckoutScreen.
5. PASS/FAIL.

**Acceptance criteria:**
- Payment integration review complete.

**Test commands:**
```bash
test -f docs/reviews/phase-4-payment-integration-review.md && \
npm run test:customer-payment -w backend/api 2>&1 | tail -3
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Order placement integration review

**Ticket:** 13 — Order placement integration review

**Objective:** Integrate Modules 10–11: order APIs, placement side effects, order UI.

**Files to create/update:**
- `docs/reviews/phase-4-order-integration-review.md` (create)

**API endpoints:** `POST|GET /customer/orders`, `GET /orders/:orderId`.

**DB fields:** `orders` snapshot fields; cart cleared; checkout completed; locks confirmed.

**Implementation steps:**
1. Consolidate Module 14 order placement validation.
2. Link order UI: success, detail, history screens.
3. Document status `placed` only (Phase 4).
4. Idempotent placement per `paymentId`.
5. PASS/FAIL.

**Acceptance criteria:**
- Order integration review complete.

**Test commands:**
```bash
test -f docs/reviews/phase-4-order-integration-review.md && \
npm run test:customer-orders -w backend/api 2>&1 | tail -3
```

**Depends on:** Ticket 12.

---

## Ticket 14 — Profile integration review

**Ticket:** 14 — Profile integration review

**Objective:** Integrate Module 12 profile API and customer-app screen with journey entry points.

**Files to create/update:**
- `docs/reviews/phase-4-profile-integration-review.md` (create)

**API endpoints:** `GET|PATCH /customer/profile`.

**DB fields:** `user_identities.name`, `email` (writable); `phone` read-only.

**Implementation steps:**
1. Link Module 14 profile smoke + UI review.
2. Confirm links: My orders, Manage addresses, sessions, logout.
3. Confirm profile does not break auth session.
4. PASS/FAIL.

**Acceptance criteria:**
- Profile integration review complete.

**Test commands:**
```bash
test -f docs/reviews/phase-4-profile-integration-review.md && \
npm run test:customer-profile -w backend/api 2>&1 | tail -3
```

**Depends on:** Ticket 9.

---

## Ticket 15 — Catalog browse and Phase 3 integration review

**Ticket:** 15 — Catalog browse and Phase 3 integration review

**Objective:** Integrate Phase 3 catalog read + Module 13 browse improvements into shopping journey.

**Files to create/update:**
- `docs/reviews/phase-4-catalog-browse-integration-review.md` (create)

**API endpoints:** `GET /customer/catalog/products`, `/search`, `/products/:id`, categories, brands.

**DB fields:** Product visibility rules; `isOutOfStock`, `isAvailable`, `availableQuantity` with `storeId`.

**Implementation steps:**
1. Link Module 13 handoff and Module 14 browse UI review.
2. Document `storeId`/`cityId` on catalog queries via `useLocationContext`.
3. Document pagination reset rules (Module 13).
4. Document Phase 3 approval/visibility filters still apply.
5. PASS/FAIL.

**Acceptance criteria:**
- Catalog integration review ties Phase 3 + Module 13 to Phase 4 journey.

**Test commands:**
```bash
test -f docs/reviews/phase-4-catalog-browse-integration-review.md && \
npm run test:customer-catalog-browsing -w apps/customer-app 2>&1 | tail -3
```

**Depends on:** Ticket 9.

---

## Ticket 16 — Seed integration review

**Ticket:** 16 — Seed integration review

**Objective:** Verify Phase 4 demo seed supports full journey integration testing.

**Files to create/update:**
- `docs/reviews/phase-4-seed-integration-review.md` (create)

**API endpoints:** N/A (seed enables E2E).

**DB fields:** Seeded customer, address, store, products, stock, optional demo cart.

**Implementation steps:**
1. Consolidate Module 14 `phase-4-seed-data-validation.md`.
2. List minimum seed entities for journey doc (Ticket 9).
3. Cross-ref `phase-4-seed-data-plan.md`.
4. Document `seed-customer-addresses`, `seed-demo-cart` idempotency.
5. LIVE seed run: PENDING operator or PASS if documented in plan.

**Acceptance criteria:**
- Seed integration review lists required entities for E2E.

**Test commands:**
```bash
test -f docs/reviews/phase-4-seed-integration-review.md && \
test -f backend/api/src/database/seeds/seed-customer-addresses.ts && \
echo PASS
```

**Depends on:** Ticket 9.

---

## Ticket 17 — Environment and configuration integration review

**Ticket:** 17 — Environment and configuration integration review

**Objective:** Review Phase 4 env vars across backend and customer-app for payment, checkout, and serviceability.

**Files to create/update:**
- `docs/reviews/phase-4-env-config-integration-review.md` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. List backend `.env.example` vars: MongoDB, JWT, Razorpay, checkout TTL, etc.
2. List customer-app env: API base URL, Razorpay key (if client-side).
3. Cross-ref Module 3 `phase-3-env-config-review.md` for shared vars.
4. Mark missing example entries GAP.
5. No secret values in docs.

**Acceptance criteria:**
- Env integration review doc complete.

**Test commands:**
```bash
test -f docs/reviews/phase-4-env-config-integration-review.md && \
test -f backend/api/.env.example && \
echo PASS
```

**Depends on:** Ticket 12.

---

## Ticket 18 — Error handling integration review

**Ticket:** 18 — Error handling integration review

**Objective:** Cross-check Phase 4 error codes across API responses and customer-app error mappers.

**Files to create/update:**
- `docs/reviews/phase-4-error-handling-integration-review.md` (create)

**API endpoints:** Error responses on cart, checkout, payment, order, address routes.

**DB fields:** N/A.

**Implementation steps:**
1. Sample error codes from `phase-4-error-codes.md` per domain.
2. Verify customer-app utils map codes to user messages (cart, checkout, payment, order, profile).
3. Document checkout/payment failure UX paths.
4. PASS/GAP per domain.
5. Link Phase 3 catalog errors as separate.

**Acceptance criteria:**
- Error handling integration review complete.

**Test commands:**
```bash
test -f docs/reviews/phase-4-error-handling-integration-review.md && \
grep -q "phase-4-error-codes" docs/errors/phase-4-error-codes.md && \
echo PASS
```

**Depends on:** Ticket 5.

---

## Ticket 19 — Security integration review

**Ticket:** 19 — Security integration review

**Objective:** Review Phase 4 commerce security: auth, scoping, payment webhook, PII on profile/addresses.

**Files to create/update:**
- `docs/reviews/phase-4-security-integration-review.md` (create)

**API endpoints:** Customer routes + webhook.

**DB fields:** Address coordinates, profile email; payment ids.

**Implementation steps:**
1. Auth required on all customer commerce routes.
2. Webhook signature validation.
3. No payment secrets in client bundles (verify).
4. Address/profile PII handling notes.
5. Dev OTP bypass documented as non-production.
6. Link `phase-4-production-readiness-risks.md`.

**Acceptance criteria:**
- Security integration review PASS with risk references.

**Test commands:**
```bash
test -f docs/reviews/phase-4-security-integration-review.md && echo PASS
```

**Depends on:** Tickets 8, 12.

---

## Ticket 20 — Documentation coverage review

**Ticket:** 20 — Documentation coverage review

**Objective:** Verify every Phase 4 module 0–13 has architecture, contract, handoff, and execution ticket doc.

**Files to create/update:**
- `docs/reviews/phase-4-documentation-coverage.md` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Matrix: Module # → architecture → contract → handoff → execution tickets (DONE).
2. List missing docs as GAP.
3. Link Module 14 validation artifacts.
4. Link integration docs from this module (Tickets 2–19).
5. Overall coverage PASS/FAIL.

**Acceptance criteria:**
- Documentation coverage matrix complete for modules 0–14.

**Test commands:**
```bash
test -f docs/reviews/phase-4-documentation-coverage.md && \
ls docs/handoffs/phase-4-*.md 2>/dev/null | wc -l
```

**Depends on:** Tickets 2–19.

---

## Ticket 21 — Module 14 validation cross-check

**Ticket:** 21 — Module 14 validation cross-check

**Objective:** Confirm Module 14 outputs are incorporated; no contradictions with integration reviews.

**Files to create/update:**
- `docs/reviews/phase-4-module-14-cross-check.md` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Checklist against all `phase-4-*-review.md` from Module 14.
2. Resolve or document any PASS in Module 14 vs GAP in integration review.
3. Carry forward blockers: manual E2E PENDING, OpenAPI GAP.
4. Confirm `test:phase-4` and `test:phase-4-customer` still PASS (reference dates).
5. Sign-off: Module 14 accepted as input to Module 15.

**Acceptance criteria:**
- Cross-check doc exists; no unresolved contradictions without notes.

**Test commands:**
```bash
test -f docs/reviews/phase-4-module-14-cross-check.md && \
test -f docs/reviews/phase-4-final-validation-summary.md && \
echo PASS
```

**Depends on:** Tickets 9–20.

---

## Ticket 22 — Phase 4 Postman collection

**Ticket:** 22 — Phase 4 Postman collection

**Objective:** Create Phase 4 Postman collection for customer shopping journey APIs + webhook sample.

**Files to create/update:**
- `docs/contracts/postman/zepto-like-phase-4.postman_collection.json` (create)
- `docs/contracts/postman/README.md` (update — Phase 4 section)
- `package.json` (update root — `validate:postman:phase-4` script)
- `docs/testing/phase-4-integration-review-verification.md` (update)

**API endpoints:** Folders:
- **Auth** (public OTP — prerequisite)
- **Customer — Addresses & store**
- **Customer — Home**
- **Customer — Catalog** (sample list/search/detail)
- **Customer — Cart**
- **Customer — Checkout**
- **Customer — Payments**
- **Customer — Orders**
- **Customer — Profile**
- **Webhooks — Razorpay** (sample payload placeholder)

Env vars: `baseUrl`, `customerAccessToken`, `storeId`, `addressId`, `cartItemId`, `checkoutSessionId`, `paymentId`, `orderId`.

**DB fields:** N/A.

**Implementation steps:**
1. Create JSON collection with folder structure from journey (Ticket 9).
2. Add representative requests with auth header placeholders.
3. Add `validate:postman:phase-4` npm script (JSON parse).
4. Document manual execution requirement.

**Acceptance criteria:**
- Postman collection exists; `npm run validate:postman:phase-4` passes.

**Test commands:**
```bash
npm run validate:postman:phase-4
```

**Depends on:** Ticket 6, 9.

---

## Ticket 23 — Phase 4 release notes

**Ticket:** 23 — Phase 4 release notes

**Objective:** Prepare Phase 4 release notes summarizing customer shopping experience delivery.

**Files to create/update:**
- `docs/releases/phase-4-release-notes.md` (create)

**API endpoints:** Summarize Phase 4 endpoint groups (no new endpoints in this ticket).

**DB fields:** Reference collections in prose.

**Implementation steps:**
1. Completed modules 0–13 list.
2. Backend APIs by domain (location, home, cart, checkout, payment, orders, profile).
3. Customer app screens delivered.
4. Phase 3 dependencies (catalog, locks, inventory).
5. Security and validation highlights.
6. Known pending: manual E2E, OpenAPI gaps, Phase 5 lifecycle, production Razorpay.

**Acceptance criteria:**
- Release notes accurate vs integration scope.

**Test commands:**
```bash
test -f docs/releases/phase-4-release-notes.md && echo PASS
```

**Depends on:** Tickets 2, 20.

---

## Ticket 24 — Phase 4 integration handoff

**Ticket:** 24 — Phase 4 integration handoff

**Objective:** Create Phase 4 integration handoff — closes customer shopping experience phase.

**Files to create/update:**
- `docs/handoffs/phase-4-integration-review-complete.md` (create)

**API endpoints:** List all Phase 4 customer + webhook groups.

**DB fields:** Phase 4 collections + critical Phase 3 integration collections.

**Implementation steps:**
1. Completed backend and customer-app systems (modules 1–13).
2. Critical integration rules (backend authority, store context, lock lifecycle, idempotent payment/order).
3. Link all integration review docs and Module 14 validation.
4. Known pending items for Phase 5 / production.
5. State live device E2E still required for production confidence.

**Acceptance criteria:**
- Handoff doc complete; suitable Phase 4 closeout artifact.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-integration-review-complete.md && echo PASS
```

**Depends on:** Tickets 2–23.

---

## Ticket 25 — Phase 4 architecture closeout and completion matrix

**Ticket:** 25 — Phase 4 architecture closeout and completion matrix

**Objective:** Architecture-level integration closeout and module 0–15 completion matrix.

**Files to create/update:**
- `docs/architecture/phase-4-integration-review.md` (create)
- `docs/contracts/phase-4-module-completion-matrix.md` (create)

**API endpoints:** Reference `phase-4-integration-scope.md`.

**DB fields:** Reference final Phase 4 collection inventory.

**Implementation steps:**
1. Goal, modules 0–15, review areas checklist.
2. Closeout: static/docs vs live verification.
3. Completion matrix: module → status → handoff link.
4. Phase 5 boundary: Order Lifecycle Architecture (planning reference only).
5. Deviations: OpenAPI GAP, manual smoke PENDING.

**Acceptance criteria:**
- Architecture integration doc and completion matrix exist.

**Test commands:**
```bash
test -f docs/architecture/phase-4-integration-review.md && \
test -f docs/contracts/phase-4-module-completion-matrix.md && \
echo PASS
```

**Depends on:** Ticket 24.

---

## Ticket 26 — Automated quality gate re-verification

**Ticket:** 26 — Automated quality gate re-verification

**Objective:** Re-run Phase 4 automated gates for integration sign-off; record results.

**Files to create/update:**
- `docs/reviews/phase-4-integration-quality-results.md` (create)
- `docs/testing/phase-4-integration-review-verification.md` (update)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Backend: `typecheck`, `test:phase-4` on `backend/api`.
2. Customer app: `typecheck`, `test:phase-4-customer`.
3. Optional: `npm run check:secrets`, `check:frontend-secrets` at repo root if scripts exist.
4. Record PASS/FAIL with timestamp.
5. Do not fix failures in this module unless blocking — record as blocker.

**Acceptance criteria:**
- Integration quality results doc shows all gates PASS (or lists blockers).

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run test:phase-4 -w backend/api && \
npm run typecheck -w apps/customer-app && npm run test:phase-4-customer -w apps/customer-app
```

**Depends on:** Tickets 1–25.

---

## Ticket 27 — E2E journey checklist and final approval

**Ticket:** 27 — E2E journey checklist and final approval

**Objective:** Consolidate manual E2E checklist for full journey; complete final approval checklist with sign-off.

**Files to create/update:**
- `docs/reviews/phase-4-e2e-journey-checklist.md` (create — may merge/update `phase-4-manual-smoke-checklist.md`)
- `docs/reviews/phase-4-final-approval-checklist.md` (create)
- `docs/testing/phase-4-integration-review-verification.md` (update)

**API endpoints:** Full journey per Ticket 9.

**DB fields:** Key fields to verify at each step (totals, orderId, placed status).

**Implementation steps:**
1. Create/update E2E checklist with Executed/PASS/Notes/Tester/Date columns.
2. Include Razorpay sandbox steps or mock-verify note.
3. Final approval: automated (Ticket 26) + integration reviews + Postman JSON valid + docs coverage.
4. Sign-off fields: Reviewer, Date, Approved, Notes.
5. LIVE PENDING acceptable for device steps if automated PASS.

**Acceptance criteria:**
- E2E checklist and final approval checklist complete.

**Test commands:**
```bash
test -f docs/reviews/phase-4-e2e-journey-checklist.md && \
test -f docs/reviews/phase-4-final-approval-checklist.md && \
echo PASS
```

**Depends on:** Tickets 9, 22, 26.

---

## Ticket 28 — Module closeout and Phase 4 phase gate

**Ticket:** 28 — Module closeout and Phase 4 phase gate

**Objective:** Mark Module 15 complete; close Phase 4 in project context; document Phase 5 entry gate.

**Files to create/update:**
- `docs/reviews/phase-4-integration-review-execution-tickets.md` (update — all tickets DONE)
- `docs/testing/phase-4-integration-review-verification.md` (update — VERIFIED)
- `docs/reviews/phase-4-integration-module-review.md` (create — full module review summary)
- `project-context/CURRENT_PROGRESS.md` (update — Phase 4 COMPLETE)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — all modules DONE, Phase 4 closed)
- `docs/architecture/phase-4-customer-shopping-architecture.md` (update — link integration closeout)

**API endpoints:** Sign-off: all Phase 4 endpoints integrated per checklist.

**DB fields:** Sign-off per integration and validation reviews.

**Implementation steps:**
1. Ensure Tickets 1–27 artifacts exist.
2. Write module review: tickets completed, files created, commands run, blockers, ready for Phase 5.
3. Update `PHASE_4_HANDOFF.md` modules 13–15 DONE; Phase 4 status **CLOSED**.
4. Set `CURRENT_PROGRESS` next: Phase 5 Module 1 (Order Lifecycle) — planning only in closeout text.
5. Do not implement Phase 5.

**Acceptance criteria:**
- Phase 4 closed in trackers; integration tickets all DONE; module review published.

**Test commands:**
```bash
npm run test:phase-4 -w backend/api && \
npm run test:phase-4-customer -w apps/customer-app && \
npm run validate:postman:phase-4 && \
test -f docs/reviews/phase-4-integration-module-review.md && \
grep -q "COMPLETE" project-context/CURRENT_PROGRESS.md && \
echo PASS
```

**Depends on:** Tickets 1–27.

---

## Module 15 summary

| Item | Value |
|------|--------|
| Total tickets | 28 |
| New feature tickets | 0 |
| Integration review docs | ~22 |
| Postman + release + closeout | Tickets 22–28 |
| Closes | Phase 4 Customer Shopping Experience |
| Gates | Phase 5 Order Lifecycle (do not implement in this module) |

**Next phase (planning only):** **Phase 5 — Order Lifecycle** per `AllPhase&Modules.pdf` page 58+

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9
9 → 10 → 11 → 12 → 13
9 → 14, 15
9 → 16 | 12 → 17 | 5 → 18 | 8,12 → 19
2–19 → 20 → 21
6,9 → 22 | 2,20 → 23 | 2–23 → 24 → 25
1–25 → 26 | 9,22,26 → 27
1–27 → 28
```

**Critical path:** 1 → 2 → 8 → 9 → 12 → 13 → 24 → 26 → 28  
**Parallel:** 10–15 domain integrations; 16–21 cross-cutting; 22–23

**Cross-module order:** Module 14 complete. This module integrates modules 1–13 and closes Phase 4. Phase 5 begins after Ticket 28.
