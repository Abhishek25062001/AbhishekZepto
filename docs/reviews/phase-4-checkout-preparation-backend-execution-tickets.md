# Phase 4 Checkout Preparation Backend — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 6 — Checkout Preparation Backend  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 6 tasks, pages 48–50)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 6 micro-tasks, pages 14–16)

**Architecture references (Module 0–5):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/architecture/phase-4-inventory-lock-integration.md`, `docs/contracts/checkout-api.md`, `docs/database/checkout-session-schema.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/contracts/inventory-locking-api.md`, `docs/handoffs/phase-4-cart-backend-foundation-complete.md`, `docs/handoffs/phase-4-pricing-cart-calculation-complete.md`

**Prerequisites:**  
Phase 4 **Modules 3–5 complete** (cart APIs, pricing service); Module 1 (addresses, serviceability, store selection); Phase 3 inventory locks (`inventory-lock.service` + internal routes).

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Checkout validate + reserve stock | `POST /checkout/initiate` — validate cart/address/store/pricing; create `checkout_sessions`; `INVENTORY_LOCK_TYPE.CHECKOUT` per line |
| Checkout summary | `GET /checkout/summary` — active session + `summarySnapshot` |
| Cancel / abandon checkout | `POST /checkout/cancel` — release locks; session `cancelled` |
| Reservation TTL | `CHECKOUT_RESERVATION_TTL_SECONDS` → `reservationExpiresAt` + lock `expiresAt` |
| Price re-validation at checkout | Reuse `pricing` module + `CHECKOUT_PRICE_CHANGED` (stricter than cart `CART_PRICE_CHANGED`) |
| Payment / Razorpay | **Module 8** — only persist nullable `paymentId` on session |
| Order placement | **Module 10** — lock **confirm** deferred to order module |
| Customer checkout UI | **Module 7** — no customer-app files in this module |
| Coupons / promotions | **Out of scope** — totals from Module 5 MVP |

**Out of scope for this module:**
- Customer app checkout screens, timers, Razorpay SDK (Modules 7, 9)
- Payment create/verify, webhooks (Module 8)
- Order creation, lock confirm on success (Module 10)
- Cart CRUD changes (Module 3/5 paths unchanged)
- Admin/vendor checkout routes
- `packages/shared` checkout types unless one ticket adds minimal mirrors
- Repository & Codebase Setup (Phase 1)
- Changing inventory lock HTTP contract (consume existing service)

**Execution order notes:**
- Run **Tickets 1–2** (docs/contracts) before backend code.
- Run **Tickets 3–7** (env, scaffold, model, repo) before **Tickets 8–14** (validation, locks, services).
- Run **Tickets 15–17** (errors, validators, HTTP) after core services.
- Run **Tickets 18–20** (tests, expiry job) after HTTP layer.
- Run **Tickets 21–23** (docs/registry/verification) then **Ticket 24** (handoff).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 6 implementation alignment docs

**Ticket:** 1 — Module 6 implementation alignment docs

**Objective:** Document checkout scope, initiate/cancel flows, lock integration, and failure compensation before coding.

**Files to create/update:**
- `docs/architecture/customer-checkout-preparation-backend.md` (create)
- `docs/testing/customer-checkout-preparation-verification.md` (create)

**API endpoints:** Document consumer usage:
- `POST /api/v1/customer/checkout/initiate`
- `GET /api/v1/customer/checkout/summary`
- `POST /api/v1/customer/checkout/cancel`

**DB fields:** `checkout_sessions` per `checkout-session-schema.md`; link `lockTokens[]` to Phase 3 `inventory_locks`.

**Implementation steps:**
1. Initiate sequence: load active cart → validate non-empty → validate address ownership + serviceability → validate store open/active → refresh pricing (strict) → create session + snapshot → create checkout lock per line → return session id + `reservationExpiresAt` + summary.
2. Cancel sequence: load session → verify owner → release each `lockToken` → set `cancelled`.
3. One active `initiated` session per customer (cancel or expire prior on new initiate — document decision).
4. Expiry: job or lazy check sets `expired`, releases locks (align `phase-4-inventory-lock-integration.md`).
5. Confirm locks **not** called here (Module 10).
6. QA: seeded cart + address + initiate → MongoDB session + locks; cancel releases stock.

**Acceptance criteria:**
- Docs match AllPhase Module 6 + PDF pages 14–16; no application code.

**Test commands:**
```bash
test -f docs/architecture/customer-checkout-preparation-backend.md && \
test -f docs/testing/customer-checkout-preparation-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Modules 3–5 complete.

---

## Ticket 2 — Checkout API contract and validation expansion

**Ticket:** 2 — Checkout API contract and validation expansion

**Objective:** Expand `checkout-api.md` with request/response JSON, error shapes, and validation rules.

**Files to create/update:**
- `docs/contracts/checkout-api.md` (update — examples, status IMPLEMENTED note placeholder)
- `docs/database/checkout-session-schema.md` (update — `addressSnapshot` shape, status IMPLEMENTED note)
- `docs/validation/phase-4-validation-rules.md` (update — expand Checkout section with field rules)

**API endpoints:**
- `POST /api/v1/customer/checkout/initiate`
- `GET /api/v1/customer/checkout/summary`
- `POST /api/v1/customer/checkout/cancel`

**DB fields:** All fields from `checkout-session-schema.md`; document `summarySnapshot` item list shape.

**Implementation steps:**
1. Initiate body: `addressId` (required), optional `storeId`, optional `idempotencyKey`.
2. Success response: `checkoutSessionId`, `reservationExpiresAt`, `summary` (totals + lines), `lockTokens[]`.
3. Map all `CHECKOUT_*` errors from `phase-4-error-codes.md` with HTTP status.
4. Summary GET: query `checkoutSessionId` optional (default latest `initiated` for customer).
5. Cross-link pricing: initiate calls pricing refresh before snapshot; `CHECKOUT_PRICE_CHANGED` details.
6. Idempotency: same `idempotencyKey` + customer returns existing `initiated` session if not expired.

**Acceptance criteria:**
- Contract implementable without guessing session or summary fields.

**Test commands:**
```bash
grep -q "CHECKOUT_PRICE_CHANGED" docs/contracts/checkout-api.md && \
grep -q "initiate" docs/contracts/checkout-api.md && \
grep -q "Checkout" docs/validation/phase-4-validation-rules.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Checkout reservation env configuration

**Ticket:** 3 — Checkout reservation env configuration

**Objective:** Add env-backed reservation TTL and optional expiry job flag for checkout sessions.

**Files to create/update:**
- `backend/api/src/config/env.ts` (update — `CHECKOUT_RESERVATION_TTL_SECONDS`, `CHECKOUT_RESERVATION_CRON_ENABLED`)
- `backend/api/.env.example` (update — document vars)
- `docs/setup/phase-4-env-config.md` (update — Module 6 vars)

**API endpoints:** None.

**DB fields:** `checkout_sessions.reservationExpiresAt` derived from TTL.

**Implementation steps:**
1. `CHECKOUT_RESERVATION_TTL_SECONDS`: positive integer, default `900`.
2. `CHECKOUT_RESERVATION_CRON_ENABLED`: boolean, default `false` (wire job in Ticket 20).
3. Export `getCheckoutReservationTtlSeconds()` in checkout constants (Ticket 5).

**Acceptance criteria:**
- Env parses; defaults documented.

**Test commands:**
```bash
grep CHECKOUT_RESERVATION_TTL_SECONDS backend/api/.env.example && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Checkout collection constant and module scaffold

**Ticket:** 4 — Checkout collection constant and module scaffold

**Objective:** Add `CHECKOUT_SESSIONS` collection constant and `backend/api/src/modules/checkout/` folder layout.

**Files to create/update:**
- `backend/api/src/database/constants/collection-names.constants.ts` (update — `CHECKOUT_SESSIONS: 'checkout_sessions'`)
- `backend/api/src/modules/checkout/` (create dirs: `models/`, `repositories/`, `services/`, `controllers/`, `routes/`, `validators/`, `types/`, `constants/`, `utils/`)

**API endpoints:** None.

**DB fields:** Collection name `checkout_sessions`.

**Implementation steps:**
1. Scaffold only; no business logic.
2. Mirror `cart/` module layout per `phase-4-backend-file-structure.md`.

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w backend/api` passes.

**Test commands:**
```bash
test -d backend/api/src/modules/checkout/services && \
grep -q CHECKOUT_SESSIONS backend/api/src/database/constants/collection-names.constants.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Tickets 1–3.

---

## Ticket 5 — Checkout status constants and reservation config accessors

**Ticket:** 5 — Checkout status constants and reservation config accessors

**Objective:** Define checkout session status enum and TTL accessor.

**Files to create/update:**
- `backend/api/src/modules/checkout/constants/checkout-session-status.constant.ts` (create)
- `backend/api/src/modules/checkout/constants/checkout-reservation-config.constant.ts` (create — TTL from env)

**API endpoints:** None.

**DB fields:** `status`: `initiated` | `expired` | `completed` | `cancelled` | `failed`.

**Implementation steps:**
1. Export status values for Mongoose enum.
2. Export `getCheckoutReservationExpiresAt(fromDate?: Date)` helper.

**Acceptance criteria:**
- Constants compile; TTL helper returns Date.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 6 — Checkout session Mongoose model and types

**Ticket:** 6 — Checkout session Mongoose model and types

**Objective:** Implement `checkout_sessions` model per `checkout-session-schema.md`.

**Files to create/update:**
- `backend/api/src/modules/checkout/models/checkout-session.model.ts` (create)
- `backend/api/src/modules/checkout/types/checkout.types.ts` (create — `CheckoutSessionRecord`, DTOs, `CheckoutSummarySnapshot`)

**API endpoints:** None.

**DB fields:** All schema fields including `addressSnapshot`, `summarySnapshot`, `lockTokens`, `idempotencyKey`, `paymentId`, `orderId`.

**Implementation steps:**
1. Indexes per `phase-4-index-plan.md`: `{ customerId: 1, status: 1 }`, `{ reservationExpiresAt: 1 }`.
2. `summarySnapshot` embeds totals + line summaries (product name, qty, unit price, line total).
3. Optional sparse unique index on `idempotencyKey` per customer (document in schema if used).

**Acceptance criteria:**
- Model compiles; enum matches contract.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Checkout session repository

**Ticket:** 7 — Checkout session repository

**Objective:** CRUD helpers for checkout sessions.

**Files to create/update:**
- `backend/api/src/modules/checkout/repositories/checkout-session.repository.ts` (create)

**API endpoints:** N/A (data layer).

**DB fields:** Read/write all session fields.

**Implementation steps:**
1. `findActiveCheckoutSessionByCustomer(customerId)` — `status: initiated`, not past `reservationExpiresAt`.
2. `findCheckoutSessionByIdForCustomer(sessionId, customerId)`.
3. `createCheckoutSession`, `updateCheckoutSessionStatus`, `setCheckoutSessionFailure`.
4. `findCheckoutSessionByIdempotencyKey(customerId, idempotencyKey)` for initiate retry.

**Acceptance criteria:**
- Repository methods compile; no service logic yet.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 6.

---

## Ticket 8 — Checkout summary snapshot builder

**Ticket:** 8 — Checkout summary snapshot builder

**Objective:** Build immutable `summarySnapshot` and API summary DTO from priced cart.

**Files to create/update:**
- `backend/api/src/modules/checkout/utils/checkout-summary.util.ts` (create)
- `backend/api/src/modules/checkout/utils/checkout-response.mapper.ts` (create — session → API envelope)

**API endpoints:** Used by initiate and summary GET.

**DB fields:** Writes `summarySnapshot` on initiate.

**Implementation steps:**
1. Map cart lines to summary items (ids, names, quantities, unit prices, line totals).
2. Include `subtotal`, `taxAmount`, `deliveryFeeAmount`, `discountAmount`, `grandTotal`, `currency`, `itemCount`.
3. Pure builder unit-testable with fixture cart.

**Acceptance criteria:**
- Builder produces stable snapshot from cart record.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 7; Module 5 pricing service.

---

## Ticket 9 — Checkout validation helpers (cart, address, store, pricing)

**Ticket:** 9 — Checkout validation helpers (cart, address, store, pricing)

**Objective:** Pre-flight validators for initiate flow (no locks yet).

**Files to create/update:**
- `backend/api/src/modules/checkout/utils/checkout-validation.util.ts` (create)
- Reuse: `cart` service/repo, `customer-addresses` repo, `store-serviceability.service`, `stores` repo, `cart-pricing.service` / `cart-price-drift.util`

**API endpoints:** Used by `POST /checkout/initiate`.

**DB fields:** Reads `carts`, `customer_addresses`, `stores`.

**Implementation steps:**
1. Cart: must exist, `status=active`, `items.length > 0` → else `CHECKOUT_CART_EMPTY`.
2. `storeId`: from body or cart; store `active`, `isOpen`, `isAcceptingOrders` → else `CHECKOUT_STORE_CLOSED`.
3. Address: owned by customer; run serviceability for address coordinates + store → else `CHECKOUT_ADDRESS_UNSERVICEABLE`.
4. Pricing: refresh snapshots via pricing service; if drift → `CHECKOUT_PRICE_CHANGED` with `changedItems` details.
5. Re-validate stock availability (soft) before locks — insufficient → `CHECKOUT_STOCK_UNAVAILABLE`.

**Acceptance criteria:**
- Each failure path maps to documented error code.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 8; Modules 1, 3, 5.

---

## Ticket 10 — Checkout inventory lock orchestration

**Ticket:** 10 — Checkout inventory lock orchestration

**Objective:** Create and release checkout inventory locks per cart line via Phase 3 lock service.

**Files to create/update:**
- `backend/api/src/modules/checkout/utils/checkout-inventory-lock.util.ts` (create)
- Call `createInventoryLock`, `releaseInventoryLock` from `inventory/locks/services/inventory-lock.service.ts`

**API endpoints:** N/A (internal service calls).

**DB fields:** Stores returned `lockToken` strings on session.

**Implementation steps:**
1. Per cart line: resolve `inventoryStockId` via `findInventoryStockByStoreProduct` (same as cart validation).
2. `createInventoryLock` with `lockType: CHECKOUT`, `customerId`, `cartId`, `expiresAt` = session expiry.
3. `releaseCheckoutLocks(lockTokens[], reason)` — release all; swallow/log partial failures for compensation.
4. On any lock create failure after partial success: release already-created tokens before throw `CHECKOUT_STOCK_UNAVAILABLE`.

**Acceptance criteria:**
- Util creates N locks for N lines; releases all on rollback.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 9; Phase 3 inventory locks.

---

## Ticket 11 — Checkout initiate service

**Ticket:** 11 — Checkout initiate service

**Objective:** Orchestrate full initiate flow: validate → cancel prior active session → persist session → create locks.

**Files to create/update:**
- `backend/api/src/modules/checkout/services/checkout.service.ts` (create — `initiateCheckoutForCustomer`)
- `backend/api/src/modules/checkout/constants/checkout-audit-events.constant.ts` (create)

**API endpoints:**
- `POST /api/v1/customer/checkout/initiate`

**DB fields:** Creates `checkout_sessions` document; sets `lockTokens`, `addressSnapshot`, `summarySnapshot`, `reservationExpiresAt`.

**Implementation steps:**
1. If `idempotencyKey` matches existing non-expired `initiated` session → return it.
2. If another `initiated` session exists → cancel it (release locks) before new initiate.
3. Run Ticket 9 validators; build address snapshot from address record.
4. Run Ticket 10 lock creation; persist session `initiated`.
5. Audit: `checkout.initiated` per `phase-4-audit-logging.md`.
6. Do **not** mark cart `converted` (Module 10).

**Acceptance criteria:**
- Initiate returns session + summary + expiry; locks created in DB.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 9–10.

---

## Ticket 12 — Checkout cancel and summary services

**Ticket:** 12 — Checkout cancel and summary services

**Objective:** Implement cancel and get-summary service methods.

**Files to create/update:**
- `backend/api/src/modules/checkout/services/checkout.service.ts` (update — `cancelCheckoutForCustomer`, `getCheckoutSummaryForCustomer`)

**API endpoints:**
- `GET /api/v1/customer/checkout/summary`
- `POST /api/v1/customer/checkout/cancel`

**DB fields:** Updates `status`, `failureReason`; reads `summarySnapshot`.

**Implementation steps:**
1. Cancel: verify session belongs to customer; no-op or 404 if already terminal; release locks; `status=cancelled`; audit `checkout.cancelled`.
2. Summary: resolve session by id or latest active; if expired → `CHECKOUT_SESSION_EXPIRED`; if missing → `CHECKOUT_SESSION_NOT_FOUND`.
3. Return summary DTO via response mapper (no lock mutation on GET).

**Acceptance criteria:**
- Cancel releases locks; summary returns snapshot for active session.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Checkout session expiry utility

**Ticket:** 13 — Checkout session expiry utility

**Objective:** Expire stale `initiated` sessions and release associated locks.

**Files to create/update:**
- `backend/api/src/modules/checkout/utils/checkout-session-expiry.util.ts` (create)
- `backend/api/src/modules/checkout/services/checkout-expiry.service.ts` (create — `expireDueCheckoutSessions`)

**API endpoints:** N/A (job); optional admin reuse of Phase 3 expire-due for orphan locks only if needed.

**DB fields:** Sets `status=expired`; clears operational need for locks via release.

**Implementation steps:**
1. Query sessions `status=initiated` and `reservationExpiresAt < now`.
2. For each: release `lockTokens`; set `expired`; audit `checkout.expired`.
3. Idempotent: skip if already released.
4. Return summary `{ processedCount, expiredCount, failedCount }` for job logging.

**Acceptance criteria:**
- Expiry util processes overdue session fixture in unit test.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 12.

---

## Ticket 14 — Checkout error codes and mapper

**Ticket:** 14 — Checkout error codes and mapper

**Objective:** Register checkout codes in global error catalog and map domain errors.

**Files to create/update:**
- `backend/api/src/errors/error-codes.ts` (update — `CHECKOUT_*` codes)
- `backend/api/src/modules/checkout/utils/checkout-error.mapper.ts` (create)
- `backend/api/src/modules/checkout/constants/checkout-error-codes.constant.ts` (create)
- `docs/errors/phase-4-error-codes.md` (update — note implemented Module 6)

**API endpoints:** All checkout routes.

**DB fields:** N/A.

**Implementation steps:**
1. Map to `AppError` with stable codes from contract.
2. `CHECKOUT_PRICE_CHANGED` includes optional `details.changedItems`.
3. Distinguish `CHECKOUT_SESSION_EXPIRED` vs `CHECKOUT_SESSION_NOT_FOUND`.

**Acceptance criteria:**
- All checkout codes in `error-codes.ts`; mapper exports throw helpers.

**Test commands:**
```bash
grep CHECKOUT_CART_EMPTY backend/api/src/errors/error-codes.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 12.

---

## Ticket 15 — Checkout validators

**Ticket:** 15 — Checkout validators

**Objective:** Zod validators for initiate, summary query, and cancel body.

**Files to create/update:**
- `backend/api/src/modules/checkout/validators/checkout.validators.ts` (create)

**API endpoints:**
- `POST /initiate` body
- `GET /summary` query
- `POST /cancel` body

**DB fields:** N/A.

**Implementation steps:**
1. Initiate: `addressId` ObjectId string; optional `storeId`, `idempotencyKey` (max length).
2. Summary: optional `checkoutSessionId`.
3. Cancel: `checkoutSessionId` required; optional `reason` string.

**Acceptance criteria:**
- Invalid body rejected before service layer.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 14.

---

## Ticket 16 — Checkout controller, routes, and mount

**Ticket:** 16 — Checkout controller, routes, and mount

**Objective:** HTTP layer and mount on `customer.routes.ts`.

**Files to create/update:**
- `backend/api/src/modules/checkout/controllers/checkout.controller.ts` (create)
- `backend/api/src/modules/checkout/routes/checkout.routes.ts` (create)
- `backend/api/src/routes/v1/customer.routes.ts` (update — `router.use('/checkout', ...)`)

**API endpoints:**
- `POST /api/v1/customer/checkout/initiate`
- `GET /api/v1/customer/checkout/summary`
- `POST /api/v1/customer/checkout/cancel`

**DB fields:** Via service.

**Implementation steps:**
1. Chain: `authenticate` → `requireRole([CUSTOMER])` → validate → controller.
2. Standard API envelope via response mapper.
3. Register routes per `phase-4-route-mounting-plan.md`.

**Acceptance criteria:**
- Manual curl with customer JWT can initiate and read summary for seed cart + address.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run build -w backend/api
```

**Depends on:** Ticket 15.

---

## Ticket 17 — Checkout summary builder unit tests

**Ticket:** 17 — Checkout summary builder unit tests

**Objective:** Unit tests for summary builder and validation edge cases.

**Files to create/update:**
- `backend/api/src/modules/checkout/utils/checkout-summary.util.test.ts` (create)
- `backend/api/src/modules/checkout/utils/checkout-validation.util.test.ts` (create — pricing/store/empty cart)

**API endpoints:** N/A.

**DB fields:** N/A (fixtures).

**Implementation steps:**
1. Multi-line cart maps to correct `grandTotal` in snapshot.
2. Empty cart triggers `CHECKOUT_CART_EMPTY` path.
3. Closed store triggers `CHECKOUT_STORE_CLOSED`.

**Acceptance criteria:**
- Util tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/checkout/utils/checkout-summary.util.test.js && \
node --test dist/modules/checkout/utils/checkout-validation.util.test.js
```

**Depends on:** Tickets 8–9.

---

## Ticket 18 — Checkout service unit tests

**Ticket:** 18 — Checkout service unit tests

**Objective:** Service tests for initiate, cancel, summary, idempotency, and lock rollback.

**Files to create/update:**
- `backend/api/src/modules/checkout/services/checkout.service.test.ts` (create)

**API endpoints:** Service-level.

**DB fields:** Mocked.

**Implementation steps:**
1. Initiate creates session and returns lock tokens (mocked lock util).
2. Initiate rolls back on lock failure.
3. Cancel releases locks and updates status.
4. Summary returns 404/409 for missing/expired session.
5. Idempotency returns same session.

**Acceptance criteria:**
- Service tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/checkout/services/checkout.service.test.js
```

**Depends on:** Ticket 16.

---

## Ticket 19 — Checkout route tests and package script

**Ticket:** 19 — Checkout route tests and package script

**Objective:** Route smoke tests and `test:customer-checkout` npm script.

**Files to create/update:**
- `backend/api/src/modules/checkout/routes/checkout.routes.test.ts` (create)
- `backend/api/package.json` (update — add `test:customer-checkout` script)

**API endpoints:** Route registration for initiate, summary, cancel.

**DB fields:** N/A.

**Implementation steps:**
1. Assert router exposes POST `/initiate`, GET `/summary`, POST `/cancel`.
2. Validators reject missing `addressId` on initiate.
3. Script runs checkout util + service + route tests.

**Acceptance criteria:**
- `npm run test:customer-checkout -w backend/api` passes.

**Test commands:**
```bash
npm run test:customer-checkout -w backend/api
```

**Depends on:** Tickets 17–18.

---

## Ticket 20 — Checkout reservation expiry job wiring

**Ticket:** 20 — Checkout reservation expiry job wiring

**Objective:** Wire optional cron job to expire checkout sessions (mirror inventory lock expiry job pattern).

**Files to create/update:**
- `backend/api/src/jobs/checkout-session-expiry.job.ts` (create)
- `backend/api/src/server.ts` or job bootstrap file (update — register when `CHECKOUT_RESERVATION_CRON_ENABLED`)
- `docs/architecture/phase-4-inventory-lock-integration.md` (update — status note for checkout expiry)

**API endpoints:** None (background).

**DB fields:** Expires sessions per Ticket 13.

**Implementation steps:**
1. Interval from env or reuse `INVENTORY_LOCK_EXPIRY_JOB_INTERVAL_SECONDS` pattern (document choice).
2. Call `expireDueCheckoutSessions` on tick.
3. Log summary counts; no crash on single-session failure.

**Acceptance criteria:**
- Job file compiles; disabled by default in dev.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 13.

---

## Ticket 21 — Contract, registry, and architecture doc updates

**Ticket:** 21 — Contract, registry, and architecture doc updates

**Objective:** Mark checkout behavior IMPLEMENTED in docs and registry.

**Files to create/update:**
- `docs/contracts/checkout-api.md` (update — status IMPLEMENTED)
- `docs/contracts/backend-route-registry.md` (update — checkout routes)
- `docs/contracts/phase-4-route-mounting-plan.md` (update — Checkout IMPLEMENTED)
- `docs/architecture/phase-4-inventory-lock-integration.md` (update — checkout consumer IMPLEMENTED)
- `docs/architecture/phase-4-backend-file-structure.md` (update — `checkout/` IMPLEMENTED)
- `docs/database/checkout-session-schema.md` (update — fields active)

**API endpoints:**
- All three checkout routes → **IMPLEMENTED**

**DB fields:** Documented as live.

**Implementation steps:**
1. Link architecture + verification docs.
2. Note lock confirm remains Module 10.

**Acceptance criteria:**
- Registry lists all three checkout endpoints.

**Test commands:**
```bash
grep -q "checkout/initiate" docs/contracts/backend-route-registry.md && \
grep -q "IMPLEMENTED" docs/contracts/checkout-api.md && \
echo PASS
```

**Depends on:** Tickets 19–20.

---

## Ticket 22 — Module 6 verification checklist and smoke results

**Ticket:** 22 — Module 6 verification checklist and smoke results

**Objective:** Verification checklist and smoke template for checkout scenarios.

**Files to create/update:**
- `docs/testing/customer-checkout-preparation-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-6-smoke-results.md` (create)

**API endpoints:** Checklist covers initiate, summary, cancel, expiry.

**DB fields:** Verify `checkout_sessions` + `inventory_locks` in MongoDB after initiate/cancel.

**Implementation steps:**
1. curl: initiate with seed cart + address → 200 + `lockTokens`.
2. GET summary → totals match cart pricing.
3. POST cancel → locks released, session `cancelled`.
4. Expire: lower TTL or wait → session `expired`, stock restored.
5. Price drift: change `finalPrice` → initiate → `CHECKOUT_PRICE_CHANGED`.

**Acceptance criteria:**
- Smoke results file exists.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-6-smoke-results.md && echo PASS
```

**Depends on:** Ticket 21.

---

## Ticket 23 — Module 6 handoff and project context closeout

**Ticket:** 23 — Module 6 handoff and project context closeout

**Objective:** Close Module 6; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-checkout-preparation-backend-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 6 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-checkout-preparation-backend-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary of initiate/summary/cancel.

**DB fields:** `checkout_sessions` populated; `inventory_locks` linked via `lockTokens`.

**Implementation steps:**
1. List artifacts, env vars, test commands.
2. Known limitations: no payment/order; lock confirm in Module 10; single-store MVP.
3. Next: Module 7 Customer App Checkout Flow.

**Acceptance criteria:**
- Handoff complete; Module 7 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-checkout-preparation-backend-complete.md && \
grep "Module 6" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 22.

---

## Module closeout

**Phase 4 Module 6 — Checkout Preparation Backend:** `COMPLETE` (Tickets 1–23 DONE)

**Next module to implement:** **Module 7 — Customer App Checkout Flow** (after Ticket 23 DONE)

**Execution order summary:**
```text
1–2 docs → 3–7 model/repo → 8–14 validation/locks/services → 15–16 HTTP
→ 17–19 tests → 20 expiry job → 21–23 closeout
```
