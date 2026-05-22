# Phase 4 Cart Backend Foundation — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 3 — Cart Backend Foundation  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 3 tasks, pages 45–46)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 3 micro-tasks, pages 7–9)

**Architecture references (Module 0–2):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/contracts/cart-api.md`, `docs/database/cart-schema.md`, `docs/database/phase-4-index-plan.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/security/phase-4-permissions.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/architecture/phase-4-inventory-lock-integration.md`

**Prerequisites:**  
Phase 4 Modules 0–2 complete; Phase 3 store-products + `inventory_stocks`; Phase 2 customer auth; Module 1 store selection (`customer_store_selections`).

**PDF vs Module 0 alignment (implement using Module 0 contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Cart per store | One **active** cart per (`customerId`, `storeId`) |
| `POST /cart/merge` | **Out of scope** — not in Module 0 contract; mark deferred if PDF lacks it |
| Inventory reservation on add | **Out of scope** — stock **read** only; locks at checkout (Module 6) |
| Full pricing / tax / delivery | **Module 5** — Module 3 sets `unitPriceSnapshot`, `lineTotal`, basic `subtotal` |
| `CART_PRICE_CHANGED` detection | **Module 5** — not thrown in Module 3 |
| Customer cart UI | **Module 4** — no customer-app files in this module |

**Out of scope for this module:**
- Customer app cart screens, bottom bar, add-to-cart UI (Module 4)
- Checkout, payment, orders (Modules 6–11)
- Inventory lock create/release (Module 6 checkout)
- Promotions / coupons (Phase 9+)
- `packages/shared` cart types unless one ticket adds minimal mirrors
- Repository & Codebase Setup (Phase 1)
- Admin/vendor cart routes

**Execution order notes:**
- Run **Tickets 1–2** (docs) before implementation.
- Run **Tickets 3–8** (model, repo, validators, utils) before **Tickets 9–16** (services, HTTP).
- Run **Tickets 17–18** (tests) after services.
- Run **Tickets 19–22** (seed, registry, closeout) last.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 3 implementation alignment docs

**Ticket:** 1 — Module 3 implementation alignment docs

**Objective:** Document Module 3 scope, cart lifecycle, stock/price rules, and store-scoping before coding.

**Files to create/update:**
- `docs/architecture/customer-cart-backend-foundation.md` (create)
- `docs/testing/customer-cart-backend-foundation-verification.md` (create)

**API endpoints:** Document consumer usage:
- `GET|POST|PATCH|DELETE /api/v1/customer/cart/*`

**DB fields:** `carts` collection per `cart-schema.md`; indexes per `phase-4-index-plan.md`.

**Implementation steps:**
1. One active cart per (`customerId`, `storeId`); embedded `items[]` with subdocument `_id` as `itemId`.
2. Add item flow: resolve `storeProduct` by `storeId` + `variantId`; check stock via `findInventoryStockByStoreProduct`; snapshot price from store product.
3. Recommend validating `storeId` against `customer_store_selections` when row exists (align with Module 2 home).
4. Basic totals: `lineTotal = quantity * unitPriceSnapshot`; `subtotal = sum(lineTotal)`; `grandTotal = subtotal` for MVP (tax/delivery `0`).
5. No inventory locks on cart mutations.
6. QA: dev customer `9999999999`, store `STORE-000001`, seeded store products.

**Acceptance criteria:**
- Docs match AllPhase Module 3 + PDF pages 7–9; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-cart-backend-foundation.md && \
test -f docs/testing/customer-cart-backend-foundation-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Module 2 complete.

---

## Ticket 2 — Cart API contract and validation expansion

**Ticket:** 2 — Cart API contract and validation expansion

**Objective:** Expand `cart-api.md` with request/response examples; confirm schema and validation rules.

**Files to create/update:**
- `docs/contracts/cart-api.md` (update — JSON examples, item shape, totals fields)
- `docs/database/cart-schema.md` (update — `itemId` = subdocument `_id`, status IMPLEMENTED note)
- `docs/validation/phase-4-validation-rules.md` (update — confirm Cart section; add `storeId` on GET)

**API endpoints:**
- `GET /api/v1/customer/cart?storeId=`
- `POST /api/v1/customer/cart/items`
- `PATCH /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart?storeId=`

**DB fields:** All fields from `cart-schema.md`.

**Implementation steps:**
1. Document cart response: `id`, `storeId`, `status`, `items[]`, `subtotal`, `grandTotal`, `currency`.
2. Document add body: `storeId`, `variantId`, `quantity`.
3. Document PATCH body: `quantity` (absolute).
4. Map errors to `phase-4-error-codes.md` cart section.
5. Explicitly exclude `POST /cart/merge`.

**Acceptance criteria:**
- Contract implementable without guessing field names.

**Test commands:**
```bash
grep -q "CART_INSUFFICIENT_STOCK" docs/contracts/cart-api.md && \
grep -q "storeId" docs/validation/phase-4-validation-rules.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Collection name constant and cart module scaffold

**Ticket:** 3 — Collection name constant and cart module scaffold

**Objective:** Add `CARTS` collection constant and `backend/api/src/modules/cart/` folder layout.

**Files to create/update:**
- `backend/api/src/database/constants/collection-names.constants.ts` (update — `CARTS: 'carts'`)
- `backend/api/src/modules/cart/` (create dirs: `models/`, `repositories/`, `services/`, `controllers/`, `routes/`, `validators/`, `types/`, `constants/`, `utils/`)

**API endpoints:** None.

**DB fields:** Collection name `carts`.

**Implementation steps:**
1. Scaffold only; no business logic.

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w backend/api` passes.

**Test commands:**
```bash
test -d backend/api/src/modules/cart/models && \
grep -q CARTS backend/api/src/database/constants/collection-names.constants.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Tickets 1–2.

---

## Ticket 4 — Cart status constants and max quantity config

**Ticket:** 4 — Cart status constants and max quantity config

**Objective:** Define cart status enum and per-line max quantity (env with default).

**Files to create/update:**
- `backend/api/src/modules/cart/constants/cart-status.constant.ts` (create)
- `backend/api/src/modules/cart/constants/cart-limits.constant.ts` (create — read `CART_MAX_QUANTITY_PER_LINE` from env, default 10)
- `backend/api/src/config/env.ts` (update — optional `CART_MAX_QUANTITY_PER_LINE`)
- `backend/api/.env.example` (update — document env var)

**API endpoints:** None.

**DB fields:** `status`: `active` | `abandoned` | `converted`.

**Implementation steps:**
1. Export status values for Mongoose enum.
2. Export `getCartMaxQuantityPerLine()` helper.

**Acceptance criteria:**
- Constants compile; env example documents default.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Cart Mongoose model and indexes

**Ticket:** 5 — Cart Mongoose model and indexes

**Objective:** Implement `carts` model per `cart-schema.md` with embedded line items.

**Files to create/update:**
- `backend/api/src/modules/cart/models/cart.model.ts` (create)
- `backend/api/src/modules/cart/types/cart.types.ts` (create — `CartRecord`, `CartItemRecord`, DTO inputs)

**API endpoints:** None.

**DB fields:** All schema fields; indexes:
- `{ customerId: 1, storeId: 1, status: 1 }` partial unique `status: 'active'`
- `{ customerId: 1, updatedAt: -1 }`

**Implementation steps:**
1. Use `baseSchemaOptions`; embedded `items` sub-schema with required snapshots.
2. Subdocument `_id` auto-generated for `itemId` in API.
3. Default `currency: 'INR'`, `status: 'active'`, `items: []`.

**Acceptance criteria:**
- Model compiles; indexes declared.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Cart repository

**Ticket:** 6 — Cart repository

**Objective:** Persistence layer for active cart lookup and mutations.

**Files to create/update:**
- `backend/api/src/modules/cart/repositories/cart.repository.ts` (create)

**API endpoints:** None.

**DB fields:** `carts`.

**Implementation steps:**
1. `findActiveCartByCustomerAndStore(customerId, storeId)`.
2. `createCart`, `saveCart` (or atomic updates).
3. `addOrUpdateLineItem`, `updateLineItemQuantity`, `removeLineItem`, `clearCartItems`.
4. Use positional operators / `findOneAndUpdate` with ownership filter.

**Acceptance criteria:**
- Repository exports all methods; no HTTP layer.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Cart validators

**Ticket:** 7 — Cart validators

**Objective:** Zod validators for cart query/body/params.

**Files to create/update:**
- `backend/api/src/modules/cart/validators/cart.validators.ts` (create)

**API endpoints:** Validates all Module 3 cart routes.

**DB fields:** Enforce quantity min 1, max from `cart-limits`; ObjectIds for `storeId`, `variantId`, `itemId`.

**Implementation steps:**
1. `getCartQueryValidator` — `storeId` required.
2. `addCartItemBodyValidator` — `storeId`, `variantId`, `quantity`.
3. `updateCartItemBodyValidator` — `quantity`.
4. `cartItemIdParamsValidator`, `clearCartQueryValidator`.

**Acceptance criteria:**
- Validators export schemas for middleware.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 8 — Cart totals and line-item utilities

**Ticket:** 8 — Cart totals and line-item utilities

**Objective:** Pure helpers to recalculate line totals and cart subtotal/grandTotal (Module 3 baseline; Module 5 extends).

**Files to create/update:**
- `backend/api/src/modules/cart/utils/cart-totals.util.ts` (create)
- `backend/api/src/modules/cart/utils/cart-line-item.util.ts` (create — find line by itemId)

**API endpoints:** N/A.

**DB fields:** Updates `items[].lineTotal`, `subtotal`, `grandTotal`, `lastCalculatedAt`.

**Implementation steps:**
1. `recalculateCartTotals(cart)` — sum line totals; set `grandTotal = subtotal` (discount/tax/delivery `0`).
2. `findCartLineIndex(cart, itemId)`.
3. No promotion logic.

**Acceptance criteria:**
- Unit-testable pure functions.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 5.

---

## Ticket 9 — Cart product and stock validation helper

**Ticket:** 9 — Cart product and stock validation helper

**Objective:** Resolve store product + inventory for add/update; centralize availability checks.

**Files to create/update:**
- `backend/api/src/modules/cart/utils/cart-product-validation.util.ts` (create)
- Reuse `backend/api/src/modules/store-products/repositories/store-product.repository.ts`
- Reuse `backend/api/src/modules/inventory/repositories/inventory-stock.repository.ts` (`findInventoryStockByStoreProduct`)

**API endpoints:** Used by cart service mutations.

**DB fields:** Reads `store_products`, `inventory_stocks`, `product_variants` (if needed for visibility).

**Implementation steps:**
1. `resolveStoreProductForCart(storeId, variantId)` — active, visible mapping.
2. `assertStockAvailable(storeId, storeProductId, quantity)` — `availableQuantity >= quantity`.
3. Throw mapped errors: `CART_PRODUCT_UNAVAILABLE`, `CART_INSUFFICIENT_STOCK`.
4. Read selling price for snapshot (store product price fields).

**Acceptance criteria:**
- Helper returns store product + stock snapshot data for service.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 6, 8; Phase 3 store-products/inventory.

---

## Ticket 10 — Cart service: get and create active cart

**Ticket:** 10 — Cart service: get and create active cart

**Objective:** `getCartForCustomer` and lazy cart creation.

**Files to create/update:**
- `backend/api/src/modules/cart/services/cart.service.ts` (create — partial)
- `backend/api/src/modules/cart/constants/cart-audit-events.constant.ts` (create)
- `backend/api/src/modules/cart/constants/cart-error-codes.constant.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/cart`

**DB fields:** `carts` — create empty active cart on first GET if policy = auto-create, OR return 404 until first add (document in Ticket 1; **default: return empty cart structure without persisting until add**, or persist empty — prefer **GET returns existing or `{ items: [], ... }` without save until POST items** — align Ticket 1 doc: **GET returns 404 `CART_NOT_FOUND` until first add, POST creates cart**).

**Implementation steps:**
1. `getCart(customerId, storeId)` — find active; not found → `CART_NOT_FOUND`.
2. Optional: verify `storeId` matches `customer_store_selections`.
3. Map to response DTO.

**Acceptance criteria:**
- Service testable without HTTP.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 6–9.

---

## Ticket 11 — Cart service: add item

**Ticket:** 11 — Cart service: add item

**Objective:** Add line or increment quantity for same `variantId` in active cart.

**Files to create/update:**
- `backend/api/src/modules/cart/services/cart.service.ts` (update)
- `backend/api/src/modules/cart/utils/cart-response.mapper.ts` (create — start mapper)

**API endpoints:**
- `POST /api/v1/customer/cart/items`

**DB fields:** Push/update `items[]`; set snapshots; recalculate totals.

**Implementation steps:**
1. Get or create active cart for (`customerId`, `storeId`).
2. Validate product/stock (Ticket 9); enforce `CART_MAX_QUANTITY_EXCEEDED`.
3. If variant already in cart, increase quantity (re-validate stock).
4. Set `unitPriceSnapshot`, `productNameSnapshot`, timestamps.
5. Audit: `customer.cart.item_added`.

**Acceptance criteria:**
- Add creates cart when none exists.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 10.

---

## Ticket 12 — Cart service: update quantity, remove line, clear cart

**Ticket:** 12 — Cart service: update quantity, remove line, clear cart

**Objective:** Remaining cart mutations.

**Files to create/update:**
- `backend/api/src/modules/cart/services/cart.service.ts` (update)

**API endpoints:**
- `PATCH /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart`

**DB fields:** Mutate `items[]`, totals; clear sets `items: []`.

**Implementation steps:**
1. PATCH: set absolute `quantity`; stock check; `CART_ITEM_NOT_FOUND` if missing.
2. DELETE line: pull item; recalculate totals.
3. DELETE cart: clear items or soft-abandon per doc (prefer **clear items**, keep active cart document).
4. Audit events for update/remove/clear.

**Acceptance criteria:**
- Empty cart after clear; GET still returns cart with `items: []` OR 404 per Ticket 10 decision (document consistently).

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Cart error codes and mapper

**Ticket:** 13 — Cart error codes and mapper

**Objective:** Register cart codes in global error catalog and map domain errors.

**Files to create/update:**
- `backend/api/src/errors/error-codes.ts` (update — `CART_*` codes)
- `backend/api/src/modules/cart/utils/cart-error.mapper.ts` (create)
- `backend/api/src/modules/cart/constants/cart-error-codes.constant.ts` (update — align)
- `docs/errors/phase-4-error-codes.md` (update — note implemented in Module 3)

**API endpoints:** All cart routes.

**DB fields:** N/A.

**Implementation steps:**
1. Map to `AppError` with stable codes from contract.
2. Do not implement `CART_PRICE_CHANGED` throws in this module.

**Acceptance criteria:**
- Invalid variant returns `CART_PRODUCT_UNAVAILABLE`; over-stock returns `CART_INSUFFICIENT_STOCK`.

**Test commands:**
```bash
grep CART_NOT_FOUND backend/api/src/errors/error-codes.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 12.

---

## Ticket 14 — Cart controller, routes, and mount

**Ticket:** 14 — Cart controller, routes, and mount

**Objective:** HTTP layer and mount on `customer.routes.ts`.

**Files to create/update:**
- `backend/api/src/modules/cart/controllers/cart.controller.ts` (create)
- `backend/api/src/modules/cart/routes/cart.routes.ts` (create)
- `backend/api/src/modules/cart/utils/cart-response.mapper.ts` (update — complete DTO)
- `backend/api/src/routes/v1/customer.routes.ts` (update — `router.use('/cart', ...)`)

**API endpoints:** All five cart endpoints (see Ticket 2).

**DB fields:** Via service.

**Implementation steps:**
1. Chain: `authenticate` → `requireRole([CUSTOMER])` → validate → controller.
2. Standard API envelope.
3. Nested routes: `GET /`, `POST /items`, `PATCH /items/:itemId`, `DELETE /items/:itemId`, `DELETE /`.

**Acceptance criteria:**
- Manual curl with customer JWT can add/list cart for seed store.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run build -w backend/api
```

**Depends on:** Ticket 13.

---

## Ticket 15 — Cart totals utility unit tests

**Ticket:** 15 — Cart totals utility unit tests

**Objective:** Unit tests for totals and line lookup helpers.

**Files to create/update:**
- `backend/api/src/modules/cart/utils/cart-totals.util.test.ts` (create)

**API endpoints:** N/A.

**DB fields:** N/A.

**Implementation steps:**
1. Multiple lines sum to subtotal.
2. Single line quantity change updates lineTotal.

**Acceptance criteria:**
- `node --test dist/modules/cart/utils/cart-totals.util.test.js` passes.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/cart/utils/cart-totals.util.test.js
```

**Depends on:** Ticket 8.

---

## Ticket 16 — Cart service unit tests

**Ticket:** 16 — Cart service unit tests

**Objective:** Unit tests for cart service (mocked repo + product validation).

**Files to create/update:**
- `backend/api/src/modules/cart/services/cart.service.test.ts` (create)

**API endpoints:** N/A (service-level).

**DB fields:** Mocked.

**Implementation steps:**
1. Add item creates cart.
2. Add duplicate variant increments quantity.
3. Insufficient stock rejection.
4. Update/remove/clear flows.
5. `CART_NOT_FOUND` on GET when missing.

**Acceptance criteria:**
- Service tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/cart/services/cart.service.test.js
```

**Depends on:** Ticket 14.

---

## Ticket 17 — Cart route tests and package script

**Ticket:** 17 — Cart route tests and package script

**Objective:** Route smoke tests and `test:customer-cart` npm script.

**Files to create/update:**
- `backend/api/src/modules/cart/routes/cart.routes.test.ts` (create)
- `backend/api/package.json` (update — `test:customer-cart`)

**API endpoints:** Route registration for all cart paths.

**DB fields:** N/A.

**Implementation steps:**
1. Assert router exposes GET `/`, POST `/items`, PATCH/DELETE `/items/:itemId`, DELETE `/`.
2. Validator rejects invalid quantity.
3. Script runs util + service + route tests.

**Acceptance criteria:**
- `npm run test:customer-cart -w backend/api` passes.

**Test commands:**
```bash
npm run test:customer-cart -w backend/api
```

**Depends on:** Tickets 15–16.

---

## Ticket 18 — Development seed: demo cart

**Ticket:** 18 — Development seed: demo cart

**Objective:** Idempotent `seedDemoCart` for dev customer per `phase-4-seed-data-plan.md`.

**Files to create/update:**
- `backend/api/src/database/seeds/seed-demo-cart.ts` (create)
- `backend/api/src/database/seeds/index.ts` (update — call after store products/inventory)
- `backend/api/src/database/seeds/seed-demo-cart.test.ts` (create — dry-run)

**API endpoints:** N/A.

**DB fields:** Seeds `carts` with 2–3 lines for `9999999999` + `STORE-000001`.

**Implementation steps:**
1. Use seeded variant/store product IDs from Phase 3 seeds.
2. Idempotent by (`customerId`, `storeId`, `status: active`).
3. Guard with development env if repo pattern requires.

**Acceptance criteria:**
- Second seed run does not duplicate active cart.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/database/seeds/seed-demo-cart.test.js
```

**Depends on:** Ticket 14; Phase 3 inventory/store-product seeds.

---

## Ticket 19 — Contract, route registry, and env updates

**Ticket:** 19 — Contract, route registry, and env updates

**Objective:** Mark cart APIs IMPLEMENTED in docs; update registry and mounting plan.

**Files to create/update:**
- `docs/contracts/cart-api.md` (update — status IMPLEMENTED)
- `docs/contracts/backend-route-registry.md` (update — cart routes IMPLEMENTED)
- `docs/contracts/phase-4-route-mounting-plan.md` (update — cart PLANNED → IMPLEMENTED)
- `docs/database/cart-schema.md` (update — implementation note)

**API endpoints:** All Module 3 cart routes → **IMPLEMENTED**.

**DB fields:** `carts` live.

**Implementation steps:**
1. Copy example responses from mapper.
2. Link verification doc.

**Acceptance criteria:**
- Registry lists IMPLEMENTED for all five cart endpoints.

**Test commands:**
```bash
grep -q "IMPLEMENTED" docs/contracts/cart-api.md && \
grep "customer/cart" docs/contracts/backend-route-registry.md
```

**Depends on:** Tickets 17–18.

---

## Ticket 20 — Module 3 verification checklist and smoke results

**Ticket:** 20 — Module 3 verification checklist and smoke results

**Objective:** Verification doc with checklist and smoke results template.

**Files to create/update:**
- `docs/testing/customer-cart-backend-foundation-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-3-smoke-results.md` (create)

**API endpoints:** Checklist covers all cart routes.

**DB fields:** Verify `carts` in MongoDB after seed.

**Implementation steps:**
1. curl examples: add item, get cart, update qty, remove, clear.
2. Stock failure case (quantity > available).

**Acceptance criteria:**
- Smoke results file exists with PASS/FAIL template.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-3-smoke-results.md && echo PASS
```

**Depends on:** Ticket 19.

---

## Ticket 21 — Module 3 handoff and project context closeout

**Ticket:** 21 — Module 3 handoff and project context closeout

**Objective:** Close Module 3; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-cart-backend-foundation-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 3 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-cart-backend-foundation-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary of five cart endpoints.

**DB fields:** `carts` collection created.

**Implementation steps:**
1. List artifacts and test commands.
2. Known limitations: no locks, basic totals, no cart UI.
3. Next: Module 4 Customer App Cart Experience.

**Acceptance criteria:**
- Handoff complete; Module 4 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-cart-backend-foundation-complete.md && \
grep "Module 3" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 20.

---

## Module closeout

**Phase 4 Module 3 — Cart Backend Foundation:** `DONE` (Tickets 1–21, 2026-05-19)

**Next module to ticketize:** **Module 4 — Customer App Cart Experience** (after Ticket 21 DONE)

**Execution order summary:**
```text
1–2 docs → 3–8 foundation → 9–14 services/HTTP → 15–17 tests → 18 seed → 19–21 closeout
```
