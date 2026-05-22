# Phase 4 Order Creation Backend — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 10 — Order Creation Backend  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Module 10 tasks, pages 56–58)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Module 10 micro-tasks, pages 22–24)

**Architecture references (Module 0–9):**  
`docs/architecture/phase-4-customer-shopping-architecture.md`, `docs/architecture/phase-4-backend-file-structure.md`, `docs/architecture/phase-4-inventory-lock-integration.md`, `docs/architecture/phase-4-audit-logging.md`, `docs/contracts/order-customer-api.md`, `docs/contracts/payment-api.md`, `docs/contracts/checkout-api.md`, `docs/database/order-schema.md`, `docs/database/checkout-session-schema.md`, `docs/database/payment-schema.md`, `docs/errors/phase-4-error-codes.md`, `docs/validation/phase-4-validation-rules.md`, `docs/contracts/phase-4-route-mounting-plan.md`, `docs/handoffs/phase-4-checkout-preparation-backend-complete.md`, `docs/handoffs/phase-4-payment-gateway-foundation-complete.md`, `docs/handoffs/phase-4-customer-app-payment-flow-complete.md`

**Prerequisites:**  
Phase 4 **Module 6** (checkout sessions + `lockTokens`); **Module 8** (paid + verified payments); **Module 9** optional for E2E (client already calls verify).

**PDF vs Module 0 alignment (implement using existing contracts):**

| PDF / legacy | Implementation |
|--------------|----------------|
| Place order after payment | `placeOrderFromPayment` — primary on verify success + webhook captured |
| Idempotent order | Same `paymentId` → existing order (`ORDER_ALREADY_EXISTS` or 200 with same `orderId`) |
| Confirm inventory locks | `confirmInventoryLock` per `checkout_sessions.lockTokens` with `orderId` |
| Clear cart | `clearCartItems` for session `cartId` |
| Complete checkout | `checkout_sessions.status=completed`, set `orderId` |
| Order history | `GET /customer/orders`, `GET /customer/orders/:orderId` |
| Retry placement | `POST /customer/orders` with `paymentId` + `idempotencyKey` |
| Verify response | Populate `orderId` on `POST /payments/verify` after placement |
| Status beyond `placed` | **Phase 5** — read-only `placed` in Phase 4 |
| Customer order UI | **Module 11** — no customer-app files |
| Refunds / cancel order | **Out of scope** |

**Out of scope for this module:**
- Customer app order confirmation / history screens (Module 11)
- Order status transitions (picking, delivery) — Phase 5
- Admin/vendor order dashboards
- Changing checkout initiate/cancel behavior (except `completed` + `orderId`)
- Payment gateway changes beyond calling order placement hook
- `packages/shared` order types unless one ticket adds minimal mirrors
- Repository & Codebase Setup (Phase 1)

**Execution order notes:**
- Run **Tickets 1–2** (docs/contracts) before backend code.
- Run **Tickets 3–8** (scaffold, constants, model, repo) before **Tickets 9–15** (utils, placement service).
- Run **Tickets 16–18** (payment verify/webhook integration, read APIs) after placement service.
- Run **Tickets 19–20** (errors, validators, HTTP) after services.
- Run **Tickets 21–23** (tests) after HTTP layer.
- Run **Tickets 21–23** (docs/registry/verification) then handoff (Ticket 23).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Module 10 implementation alignment docs

**Ticket:** 1 — Module 10 implementation alignment docs

**Objective:** Document order placement scope, post-payment sequence, lock confirm, cart clear, idempotency, and failure compensation before coding.

**Files to create/update:**
- `docs/architecture/order-creation-backend.md` (create)
- `docs/testing/order-creation-backend-verification.md` (create)

**API endpoints:** Document:
- `POST /api/v1/customer/orders` (idempotent retry)
- `GET /api/v1/customer/orders`
- `GET /api/v1/customer/orders/:orderId`
- Hook from `POST /payments/verify` and webhook `payment.captured`

**DB fields:** `orders` per `order-schema.md`; updates to `payments.orderId`, `checkout_sessions.orderId` + `status=completed`.

**Implementation steps:**
1. Placement sequence: load paid payment → idempotent order by `paymentId` → build from checkout session snapshots → persist order → confirm locks → clear cart → complete session → link payment.
2. `orderNumber` generation strategy (e.g. `ORD-{timestamp}-{random}`).
3. On placement failure after pay: `ORDER_CREATION_FAILED`; release locks; audit; document manual refund path.
4. Idempotency: duplicate `paymentId` returns same order.
5. Phase 4 `orderStatus=placed`, `paymentStatus=paid`, `inventoryConfirmed=true`.
6. QA: paid payment + initiated checkout session with locks.

**Acceptance criteria:**
- Docs match AllPhase Module 10 + PDF pages 22–24; no application code.

**Test commands:**
```bash
test -f docs/architecture/order-creation-backend.md && \
test -f docs/testing/order-creation-backend-verification.md && \
echo PASS
```

**Depends on:** Phase 4 Modules 6–8 complete.

---

## Ticket 2 — Order customer API contract and validation expansion

**Ticket:** 2 — Order customer API contract and validation expansion

**Objective:** Expand `order-customer-api.md` with request/response JSON, verify integration, and validation rules.

**Files to create/update:**
- `docs/contracts/order-customer-api.md` (update — examples, IMPLEMENTED placeholder)
- `docs/database/order-schema.md` (update — implementation status note)
- `docs/validation/phase-4-validation-rules.md` (update — expand Order section)
- `docs/contracts/payment-api.md` (update — verify response includes `orderId` after Module 10)

**API endpoints:**
- `POST /api/v1/customer/orders`
- `GET /api/v1/customer/orders`
- `GET /api/v1/customer/orders/:orderId`

**DB fields:** Document all `orders` fields; linkage fields on payment and checkout session.

**Implementation steps:**
1. POST body: `paymentId`, optional `idempotencyKey`.
2. POST response: `orderId`, `orderNumber`, `orderStatus`, `grandTotal`, `placedAt`.
3. Verify response after Module 10: `{ paymentId, status: 'paid', orderId }`.
4. GET list: pagination `page`, `limit`, optional `status`.
5. GET detail: full snapshot + items.
6. Idempotency: `ORDER_ALREADY_EXISTS` or 200 with existing order per contract choice.

**Acceptance criteria:**
- Contract implementable without guessing placement behavior.

**Test commands:**
```bash
grep -q "POST /api/v1/customer/orders" docs/contracts/order-customer-api.md && \
grep -q "orderId" docs/contracts/payment-api.md && \
grep -q "Order" docs/validation/phase-4-validation-rules.md && \
echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Orders module scaffold

**Ticket:** 3 — Orders module scaffold

**Objective:** Replace `orders/` gitkeep placeholders with real folder layout per `phase-4-backend-file-structure.md`.

**Files to create/update:**
- `backend/api/src/modules/orders/` (create dirs: `models/`, `repositories/`, `services/`, `controllers/`, `routes/`, `validators/`, `types/`, `constants/`, `utils/` — remove `.gitkeep` as files added)

**API endpoints:** None.

**DB fields:** Collection `orders` (constant already exists).

**Implementation steps:**
1. Scaffold per backend file structure doc.
2. No business logic in this ticket.

**Acceptance criteria:**
- Folder tree exists; typecheck passes.

**Test commands:**
```bash
test -d backend/api/src/modules/orders/services && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 2.

---

## Ticket 4 — Order status and payment status constants

**Ticket:** 4 — Order status and payment status constants

**Objective:** Define Phase 4 order and payment status enums for orders collection.

**Files to create/update:**
- `backend/api/src/modules/orders/constants/order-status.constant.ts` (create — `placed` for Phase 4)
- `backend/api/src/modules/orders/constants/order-payment-status.constant.ts` (create — `paid`)

**API endpoints:** None.

**DB fields:** `orderStatus`, `paymentStatus` enums.

**Implementation steps:**
1. `ORDER_STATUS.PLACED` only for Phase 4 write path.
2. `ORDER_PAYMENT_STATUS.PAID` at placement.
3. Export value arrays for Mongoose enum.

**Acceptance criteria:**
- Constants compile.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 3.

---

## Ticket 5 — Order number generator util

**Ticket:** 5 — Order number generator util

**Objective:** Pure util to generate unique human-readable `orderNumber` strings.

**Files to create/update:**
- `backend/api/src/modules/orders/utils/order-number.util.ts` (create)
- `backend/api/src/modules/orders/utils/order-number.util.test.ts` (create)

**API endpoints:** N/A.

**DB fields:** `orders.orderNumber` — unique index.

**Implementation steps:**
1. Format e.g. `ORD-{yyyyMMdd}-{random}` or similar; document in architecture doc.
2. Unit test: non-empty, reasonable length, uniqueness across calls.

**Acceptance criteria:**
- Util tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/orders/utils/order-number.util.test.js
```

**Depends on:** Ticket 3.

---

## Ticket 6 — Order Mongoose model and types

**Ticket:** 6 — Order Mongoose model and types

**Objective:** Implement `orders` model per `order-schema.md`.

**Files to create/update:**
- `backend/api/src/modules/orders/models/order.model.ts` (create)
- `backend/api/src/modules/orders/types/order.types.ts` (create — `OrderRecord`, DTOs)

**API endpoints:** None.

**DB fields:** All Phase 4 schema fields including `items[]`, snapshots, totals, `inventoryConfirmed`.

**Implementation steps:**
1. Indexes: unique `orderNumber`, `{ customerId, placedAt }`, unique sparse `paymentId`.
2. Embed order line item sub-schema matching checkout summary items.
3. Reuse address snapshot shape from checkout types or duplicate inline sub-schema.

**Acceptance criteria:**
- Model compiles; enums match schema.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 4.

---

## Ticket 7 — Order repository

**Ticket:** 7 — Order repository

**Objective:** CRUD helpers for order records.

**Files to create/update:**
- `backend/api/src/modules/orders/repositories/order.repository.ts` (create)

**API endpoints:** N/A (data layer).

**DB fields:** Read/write all order fields.

**Implementation steps:**
1. `findOrderByIdForCustomer(orderId, customerId)`.
2. `findOrderByPaymentId(paymentId)`.
3. `createOrder`, `updateOrderById`.
4. `listOrdersByCustomer(customerId, { page, limit, status? })` with pagination.

**Acceptance criteria:**
- Repository compiles.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 6.

---

## Ticket 8 — Order snapshot builder util

**Ticket:** 8 — Order snapshot builder util

**Objective:** Build order document payload from checkout session + payment.

**Files to create/update:**
- `backend/api/src/modules/orders/utils/order-snapshot.util.ts` (create)
- `backend/api/src/modules/orders/utils/order-snapshot.util.test.ts` (create)

**API endpoints:** N/A.

**DB fields:** Maps `summarySnapshot` + `addressSnapshot` → `orders.items`, totals, `addressSnapshot`.

**Implementation steps:**
1. `buildOrderPayloadFromCheckoutSession({ session, payment, orderNumber })`.
2. Validate grand totals align with payment amount (rupees vs paise conversion documented).
3. Unit test mapping line items and totals.

**Acceptance criteria:**
- Util tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/orders/utils/order-snapshot.util.test.js
```

**Depends on:** Ticket 6.

---

## Ticket 9 — Order inventory lock confirm util

**Ticket:** 9 — Order inventory lock confirm util

**Objective:** Confirm all checkout `lockTokens` after order creation.

**Files to create/update:**
- `backend/api/src/modules/orders/utils/order-inventory-lock.util.ts` (create)

**API endpoints:** N/A (calls `confirmInventoryLock` in-process).

**DB fields:** Sets `orders.inventoryConfirmed=true` after all confirms succeed.

**Implementation steps:**
1. `confirmCheckoutLocksForOrder({ lockTokens, orderId, actorUserId })`.
2. Use `inventory-lock.service` `confirmInventoryLock` with `confirmationReason: 'order_placed'`.
3. On partial failure: throw `ORDER_CREATION_FAILED`; document rollback strategy in service layer.

**Acceptance criteria:**
- Util compiles; idempotent if lock already confirmed.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 3; Module 6 checkout locks.

---

## Ticket 10 — Order cart clear util

**Ticket:** 10 — Order cart clear util

**Objective:** Clear customer cart items after successful order placement.

**Files to create/update:**
- `backend/api/src/modules/orders/utils/order-cart-clear.util.ts` (create)

**API endpoints:** N/A (calls `clearCartItems` repository).

**DB fields:** Clears `carts.items` for session `cartId`; cart remains `active`.

**Implementation steps:**
1. `clearCartAfterOrderPlacement({ cartId, customerId })`.
2. Reuse `cart.repository` `clearCartItems`.
3. No-op safe if cart already empty.

**Acceptance criteria:**
- Util compiles.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 3; Module 3 cart.

---

## Ticket 11 — Order placement service (core)

**Ticket:** 11 — Order placement service (core)

**Objective:** Implement `placeOrderFromPayment` — idempotent order creation and side effects.

**Files to create/update:**
- `backend/api/src/modules/orders/services/order.service.ts` (create — placement method)
- `backend/api/src/modules/orders/constants/order-audit-events.constant.ts` (create)

**API endpoints:** Used by POST orders, verify hook, webhook hook.

**DB fields:** Creates `orders`; updates `payments.orderId`, `checkout_sessions.orderId` + `status=completed`.

**Implementation steps:**
1. Validate payment: `status=paid`, `signatureVerified=true`, owned by customer.
2. If `findOrderByPaymentId` exists → return existing (idempotent).
3. Load checkout session; must belong to payment; acceptable status `initiated` (or already linked).
4. Build payload via `order-snapshot.util`; `createOrder`.
5. `confirmCheckoutLocksForOrder`; set `inventoryConfirmed=true`.
6. `clearCartAfterOrderPlacement`.
7. Update checkout session `completed` + `orderId`; update payment `orderId`.
8. Audit `order.placed`.
9. On failure: `ORDER_CREATION_FAILED`; release remaining locks (best-effort); do not leave duplicate order.

**Acceptance criteria:**
- Service compiles; single order per `paymentId`.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Tickets 7–10.

---

## Ticket 12 — Order read service (list and detail)

**Ticket:** 12 — Order read service (list and detail)

**Objective:** Implement `getOrderForCustomer` and `listOrdersForCustomer`.

**Files to create/update:**
- `backend/api/src/modules/orders/services/order.service.ts` (update — read methods)
- `backend/api/src/modules/orders/utils/order-response.mapper.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/orders`
- `GET /api/v1/customer/orders/:orderId`

**DB fields:** Read `orders` with customer scope.

**Implementation steps:**
1. Detail: 404 `ORDER_NOT_FOUND` if missing or wrong customer.
2. List: paginate by `placedAt` desc; default `limit` 20.
3. Map to API response DTOs per contract.

**Acceptance criteria:**
- Read methods compile.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 13 — Integrate order placement into payment verify

**Ticket:** 13 — Integrate order placement into payment verify

**Objective:** After successful payment verify, call `placeOrderFromPayment` and return `orderId`.

**Files to create/update:**
- `backend/api/src/modules/payment/services/payment.service.ts` (update — verify success path)
- `backend/api/src/modules/payment/utils/payment-response.mapper.ts` (update — include `orderId`)

**API endpoints:**
- `POST /api/v1/customer/payments/verify` — response includes `orderId`

**DB fields:** Order created; verify response populated.

**Implementation steps:**
1. After payment marked `paid`, call `placeOrderFromPayment({ paymentId, customerId })`.
2. Idempotent verify: if order already exists, return same `orderId`.
3. Update `toVerifyPaymentResponse` to include non-null `orderId` when placement succeeds.
4. Do not break idempotent already-paid path.

**Acceptance criteria:**
- Verify returns `orderId` on success; typecheck passes.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 14 — Integrate order placement into payment webhook captured

**Ticket:** 14 — Integrate order placement into payment webhook captured

**Objective:** On webhook `payment.captured`, place order if not already placed.

**Files to create/update:**
- `backend/api/src/modules/payment/services/payment-webhook.service.ts` (update — captured handler)

**API endpoints:**
- `POST /api/v1/webhooks/razorpay` — side effect order placement

**DB fields:** Same as Ticket 11.

**Implementation steps:**
1. After marking payment paid, call `placeOrderFromPayment` with payment's `customerId`.
2. Idempotent if order exists.
3. Swallow/log placement errors without breaking webhook 200 if order already exists.

**Acceptance criteria:**
- Webhook path calls placement; compiles.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 15 — Order error codes and mapper

**Ticket:** 15 — Order error codes and mapper

**Objective:** Register order codes in global catalog and map domain errors.

**Files to create/update:**
- `backend/api/src/errors/error-codes.ts` (update — `ORDER_*` codes)
- `backend/api/src/modules/orders/utils/order-error.mapper.ts` (create)
- `backend/api/src/modules/orders/constants/order-error-codes.constant.ts` (create)
- `docs/errors/phase-4-error-codes.md` (update — note implemented Module 10)

**API endpoints:** All order routes + placement failures.

**DB fields:** N/A.

**Implementation steps:**
1. Map `ORDER_NOT_FOUND`, `ORDER_NOT_OWNED`, `ORDER_ALREADY_EXISTS`, `ORDER_CREATION_FAILED`.
2. Map invalid payment state for placement (reuse or add `PAYMENT_NOT_PAID` if in catalog).

**Acceptance criteria:**
- All order codes in `error-codes.ts`.

**Test commands:**
```bash
grep ORDER_NOT_FOUND backend/api/src/errors/error-codes.ts && \
npm run typecheck -w backend/api
```

**Depends on:** Ticket 11.

---

## Ticket 16 — Order validators

**Ticket:** 16 — Order validators

**Objective:** Zod validators for create order and list query.

**Files to create/update:**
- `backend/api/src/modules/orders/validators/order.validators.ts` (create)

**API endpoints:**
- `POST /orders` body
- `GET /orders` query

**DB fields:** N/A.

**Implementation steps:**
1. Create body: `paymentId` (ObjectId), optional `idempotencyKey`.
2. List query: `page`, `limit`, optional `status` enum (`placed` only Phase 4).
3. Path param: `orderId` ObjectId for GET detail.

**Acceptance criteria:**
- Invalid bodies rejected before service.

**Test commands:**
```bash
npm run typecheck -w backend/api
```

**Depends on:** Ticket 15.

---

## Ticket 17 — Order customer controller, routes, and mount

**Ticket:** 17 — Order customer controller, routes, and mount

**Objective:** HTTP layer for customer order endpoints.

**Files to create/update:**
- `backend/api/src/modules/orders/controllers/order.controller.ts` (create)
- `backend/api/src/modules/orders/routes/customer-order.routes.ts` (create)
- `backend/api/src/routes/v1/customer.routes.ts` (update — `router.use('/orders', ...)`)

**API endpoints:**
- `POST /api/v1/customer/orders`
- `GET /api/v1/customer/orders`
- `GET /api/v1/customer/orders/:orderId`

**DB fields:** Via service.

**Implementation steps:**
1. Chain: `authenticate` → `requireRole([CUSTOMER])` → validate → controller.
2. POST delegates to `placeOrderFromPayment`.
3. Standard API envelope.

**Acceptance criteria:**
- Routes mounted per `phase-4-route-mounting-plan.md`.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run build -w backend/api
```

**Depends on:** Tickets 12, 16.

---

## Ticket 18 — Order placement service unit tests

**Ticket:** 18 — Order placement service unit tests

**Objective:** Service tests for placement idempotency, lock confirm, and failure paths (mocked deps).

**Files to create/update:**
- `backend/api/src/modules/orders/services/order.service.test.ts` (create)

**API endpoints:** Service-level.

**DB fields:** Mocked.

**Implementation steps:**
1. Happy path: creates order, confirms locks, clears cart, completes session.
2. Idempotent: same `paymentId` returns existing order.
3. Unpaid payment rejected.
4. Placement failure throws `ORDER_CREATION_FAILED`.

**Acceptance criteria:**
- Service tests pass.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/orders/services/order.service.test.js
```

**Depends on:** Ticket 17.

---

## Ticket 19 — Payment verify order integration test

**Ticket:** 19 — Payment verify order integration test

**Objective:** Update payment service tests to assert `orderId` returned after verify (mocked order service).

**Files to create/update:**
- `backend/api/src/modules/payment/services/payment.service.test.ts` (update)

**API endpoints:** Verify returns `orderId`.

**DB fields:** Mocked.

**Implementation steps:**
1. Mock `placeOrderFromPayment` to return `{ orderId }`.
2. Assert verify response includes `orderId`.

**Acceptance criteria:**
- Payment service tests still pass with order hook.

**Test commands:**
```bash
npm run build -w backend/api && \
node --test dist/modules/payment/services/payment.service.test.js
```

**Depends on:** Ticket 13.

---

## Ticket 20 — Order route tests and package script

**Ticket:** 20 — Order route tests and package script

**Objective:** Route smoke tests and `test:customer-orders` npm script.

**Files to create/update:**
- `backend/api/src/modules/orders/routes/customer-order.routes.test.ts` (create)
- `backend/api/package.json` (update — `test:customer-orders` script)

**API endpoints:** Route registration for POST, GET list, GET detail.

**DB fields:** N/A.

**Implementation steps:**
1. Assert router exposes POST `/`, GET `/`, GET `/:orderId`.
2. Validators reject missing `paymentId` on POST.
3. Script runs order util + service + route tests (+ payment verify test if included).

**Acceptance criteria:**
- `npm run test:customer-orders -w backend/api` passes.

**Test commands:**
```bash
npm run test:customer-orders -w backend/api
```

**Depends on:** Tickets 18–19.

---

## Ticket 21 — Contract, registry, and architecture doc updates

**Ticket:** 21 — Contract, registry, and architecture doc updates

**Objective:** Mark order APIs IMPLEMENTED in docs and registry.

**Files to create/update:**
- `docs/contracts/order-customer-api.md` (update — status IMPLEMENTED)
- `docs/contracts/payment-api.md` (update — verify `orderId` IMPLEMENTED)
- `docs/contracts/backend-route-registry.md` (update — order routes IMPLEMENTED)
- `docs/contracts/phase-4-route-mounting-plan.md` (update — Orders IMPLEMENTED)
- `docs/architecture/phase-4-backend-file-structure.md` (update — `orders/` IMPLEMENTED)
- `docs/architecture/phase-4-inventory-lock-integration.md` (update — confirm on order IMPLEMENTED)

**API endpoints:** All three order routes + verify `orderId` → **IMPLEMENTED**

**DB fields:** Documented as live.

**Implementation steps:**
1. Link architecture + verification docs.
2. Note Phase 5 status transitions out of scope.

**Acceptance criteria:**
- Registry lists POST/GET orders.

**Test commands:**
```bash
grep -q "customer/orders" docs/contracts/backend-route-registry.md && \
grep -q "IMPLEMENTED" docs/contracts/order-customer-api.md && \
echo PASS
```

**Depends on:** Ticket 20.

---

## Ticket 22 — Module 10 verification checklist and smoke results

**Ticket:** 22 — Module 10 verification checklist and smoke results

**Objective:** Verification checklist and smoke template for order placement flow.

**Files to create/update:**
- `docs/testing/order-creation-backend-verification.md` (update — checkboxes)
- `docs/testing/phase-4-module-10-smoke-results.md` (create)

**API endpoints:** Checklist covers verify→order, POST orders retry, GET list/detail.

**DB fields:** Verify `orders`, `payments.orderId`, `checkout_sessions.completed`, cart empty.

**Implementation steps:**
1. curl: checkout initiate → pay verify → `orderId` in response.
2. MongoDB: order document, locks confirmed, cart cleared.
3. Duplicate POST orders with same `paymentId` → idempotent.
4. GET history returns placed order.

**Acceptance criteria:**
- Smoke results file exists.

**Test commands:**
```bash
test -f docs/testing/phase-4-module-10-smoke-results.md && echo PASS
```

**Depends on:** Ticket 21.

---

## Ticket 23 — Module 10 handoff and project context closeout

**Ticket:** 23 — Module 10 handoff and project context closeout

**Objective:** Close Module 10; update handoff files.

**Files to create/update:**
- `docs/handoffs/phase-4-order-creation-backend-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 10 DONE)
- `project-context/CURRENT_PROGRESS.md` (update)
- `docs/reviews/phase-4-order-creation-backend-execution-tickets.md` (update — all DONE)

**API endpoints:** Summary of placement + read APIs.

**DB fields:** `orders` collection live; payment/checkout linkage.

**Implementation steps:**
1. List artifacts, test commands.
2. Known limitations: `orderStatus=placed` only; no Module 11 UI.
3. Next: Module 11 Customer App Order Confirmation.

**Acceptance criteria:**
- Handoff complete; Module 11 not started.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-order-creation-backend-complete.md && \
grep "Module 10" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md
```

**Depends on:** Ticket 22.

---

## Module closeout

**Phase 4 Module 10 — Order Creation Backend:** `DONE` (Tickets 1–23)

**Next module to implement:** **Module 11 — Customer App Order Confirmation**

**Execution order summary:**
```text
1–2 docs → 3–8 scaffold/model/utils → 9–12 placement/read services
→ 13–14 payment hooks → 15–17 HTTP → 18–20 tests → 21–23 closeout
```
