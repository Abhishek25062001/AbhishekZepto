# Phase 4 Foundation & Bootstrap — CURSOR Execution Tickets

**Phase:** Phase 4 — Customer Shopping Experience  
**Module:** 0 — Phase 4 Foundation & Bootstrap  
**Sources:**
- `projectin micro/docone/AllPhase&Modules.pdf` (Phase 4 objective and module list, pages 43–57)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (micro-task detail for Modules 1–15, pages 1–54)

**Prerequisites (already in repo):**
- Phase 1 foundation (monorepo, backend core, DB, auth skeleton) — **do not re-run Repository & Codebase Setup**
- Phase 2 customer OTP auth, RBAC, tenant scope
- Phase 3 catalog, stores, store-products, inventory, inventory locks, customer catalog read UI (Add to Cart placeholder)

**Scope rules:**
- Documentation, contracts, schema plans, route/permission/error/index plans, env matrix, and handoff updates **only**.
- **No** runtime backend code (models, services, controllers, routes).
- **No** customer-app screen or hook implementation.
- **No** `packages/shared` Phase 4 `.ts` files (documentation plan only).
- **No** Repository & Codebase Setup (Phase 1 Module 2).
- **No** Phase 4 feature modules (Location, Cart, Checkout, Payment, Order, etc.) — those start at Module 1+.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-19)

---

## Ticket 1 — Phase 4 customer shopping architecture

**Ticket:** 1 — Phase 4 customer shopping architecture

**Objective:** Define Phase 4 domain boundaries, surfaces, data flows, and explicit out-of-scope list per `AllPhase&Modules.pdf` (Customer Shopping Experience).

**Files to create/update:**
- `docs/architecture/phase-4-customer-shopping-architecture.md` (create)

**API endpoints:** Document planned route families only (no implementation):
- Customer: `/api/v1/customer/addresses/*`, `/api/v1/customer/home`, `/api/v1/customer/cart/*`, `/api/v1/customer/checkout/*`, `/api/v1/customer/payments/*`, `/api/v1/customer/orders/*`, `/api/v1/customer/profile/*`
- Reference existing: `/api/v1/customer/catalog/*` (Phase 3)

**DB fields:** List planned collections at summary level: `customer_addresses`, `carts`, `checkout_sessions` (or equivalent), `payments`, `orders` — detail in Tickets 3–7.

**Implementation steps:**
1. State Phase 4 objective: location → browse → cart → checkout → payment → order placement.
2. Diagram customer journey and backend authority (pricing, stock, reservations on server).
3. List Phase 4 modules 1–15 in PDF order with one-line purpose each.
4. **Out of scope:** Phase 5 order lifecycle, picking/packing, vendor order ops, delivery, promotions/coupons, admin order ops UI.
5. Note dependency on Phase 3 `inventory_locks` for checkout reservation (reference `docs/contracts/inventory-locking-api.md`).
6. Note customer-app vs web panels scope (Phase 4 is customer-app + backend heavy).

**Acceptance criteria:**
- Doc exists; matches PDF Phase 4 boundary; no application code added.

**Test commands:**
```bash
test -f docs/architecture/phase-4-customer-shopping-architecture.md && echo PASS
```

**Depends on:** Phase 3 Integration & Review complete.

---

## Ticket 2 — Phase 4 module dependencies map

**Ticket:** 2 — Phase 4 module dependencies map

**Objective:** Record module execution order and cross-module dependencies for tickets Modules 1–15 (planning reference for all Phase 4 work).

**Files to create/update:**
- `docs/architecture/phase-4-module-dependencies.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — module list + status table, still “Module 0 in progress”)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Table: Module number, name, depends on, blocks.
2. Include Module 0 → Module 1 gate (“bootstrap complete before Location & Store Selection”).
3. Align with `AllPhase&Modules.pdf` pages 43–57 task dependency chains (e.g. Cart Backend before Cart Experience; Checkout before Payment; Payment before Order Creation).
4. Mark Phase 5 boundary after Module 15 Integration.

**Acceptance criteria:**
- Dependency doc matches roadmap; `PHASE_4_HANDOFF.md` lists all Phase 4 modules with “not started” except Module 0.

**Test commands:**
```bash
test -f docs/architecture/phase-4-module-dependencies.md && grep -q "Customer Location" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 3 — Customer address database schema

**Ticket:** 3 — Customer address database schema

**Objective:** Document `customer_addresses` collection per Module 1 PDF tasks (label, full address, coordinates, landmark, default flag).

**Files to create/update:**
- `docs/database/customer-address-schema.md` (create)

**API endpoints:** None (schema only).

**DB fields:** Document at minimum:
- `_id`, `customerId`, `label`, `fullAddress` (or structured lines), `latitude`, `longitude`, `landmark`, `isDefault`, `cityId` (optional link to Phase 3 cities), `createdAt`, `updatedAt`, `isDeleted` / `deletedAt` per project DB conventions.

**Implementation steps:**
1. Field types, required/optional, indexes (`customerId` + `isDefault`).
2. Validation rules summary (coordinates range, one default per customer).
3. Relationship to store serviceability lookup (Module 1 Task 3).

**Acceptance criteria:**
- Schema doc complete; no Mongoose model file created.

**Test commands:**
```bash
test -f docs/database/customer-address-schema.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 4 — Cart database schema

**Ticket:** 4 — Cart database schema

**Objective:** Document `carts` collection per Cart Backend Foundation (`AllPhase&Modules.pdf` page 45–46, `PhaesDetail4&5.pdf` cart model tasks).

**Files to create/update:**
- `docs/database/cart-schema.md` (create)

**API endpoints:** None.

**DB fields:** Document at minimum:
- `_id`, `customerId`, `storeId`, `status` (active/abandoned/converted), `items[]` with `productId`, `variantId`, `quantity`, `unitPriceSnapshot`, `lineTotal`, `storeProductId`, `addedAt`, `updatedAt`
- Pricing snapshot fields for Module 5: `subtotal`, `discountPlaceholder`, `taxPlaceholder`, `deliveryFeePlaceholder`, `grandTotal` (nullable until calculated)
- `createdAt`, `updatedAt`

**Implementation steps:**
1. One active cart per customer per store rule.
2. Max quantity and validation references (defer rules to Ticket 14).
3. Link to `store_products` and `inventory_stocks` (Phase 3).

**Acceptance criteria:**
- Schema doc aligns with PDF cart model fields; no runtime code.

**Test commands:**
```bash
test -f docs/database/cart-schema.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 5 — Checkout session database schema

**Ticket:** 5 — Checkout session database schema

**Objective:** Document checkout/reservation persistence for Checkout Preparation Backend (reservation TTL, link to inventory locks).

**Files to create/update:**
- `docs/database/checkout-session-schema.md` (create)

**API endpoints:** None.

**DB fields:** Document at minimum:
- `_id`, `customerId`, `cartId`, `storeId`, `addressId`, `reservationToken` / lock references, `status` (initiated/expired/completed/failed), `expiresAt`, `summarySnapshot` (totals, item count), `paymentOrderId` (nullable), `createdAt`, `updatedAt`

**Implementation steps:**
1. Map to Phase 3 `inventory_locks` internal APIs (create/release/confirm) — reference only.
2. TTL and expiry job note (Module 6).
3. Idempotency key field for checkout retries (Module 8/10).

**Acceptance criteria:**
- Schema doc references inventory locking; no checkout service code.

**Test commands:**
```bash
test -f docs/database/checkout-session-schema.md && echo PASS
```

**Depends on:** Tickets 4, 18 (inventory integration — may be drafted after Ticket 18; if Ticket 18 is later, add cross-reference placeholder in this doc).

**Depends on:** Ticket 4.

---

## Ticket 6 — Payment database schema

**Ticket:** 6 — Payment database schema

**Objective:** Document payment records for Payment Gateway Foundation (Razorpay order id, status, idempotency).

**Files to create/update:**
- `docs/database/payment-schema.md` (create)

**API endpoints:** None.

**DB fields:** Document at minimum:
- `_id`, `customerId`, `checkoutSessionId`, `orderId` (nullable until order created), `gateway` (`razorpay`), `gatewayOrderId`, `gatewayPaymentId`, `amount`, `currency`, `status` (created/pending/paid/failed/cancelled/refunded placeholder), `idempotencyKey`, `signatureVerified`, `webhookReceivedAt`, `metadata`, `createdAt`, `updatedAt`

**Implementation steps:**
1. Razorpay-specific field naming from PDF Module 8.
2. Webhook event correlation fields.
3. Link to checkout session and order (one-to-one rules).

**Acceptance criteria:**
- Schema doc complete; env vars listed in Ticket 22 only (no `.env` secrets committed).

**Test commands:**
```bash
test -f docs/database/payment-schema.md && echo PASS
```

**Depends on:** Ticket 5.

---

## Ticket 7 — Order database schema (customer placement)

**Ticket:** 7 — Order database schema (customer placement)

**Objective:** Document `orders` collection for Order Creation Backend (placement only; lifecycle states expanded in Phase 5).

**Files to create/update:**
- `docs/database/order-schema.md` (create)

**API endpoints:** None.

**DB fields:** Document at minimum:
- `_id`, `orderNumber`, `customerId`, `storeId`, `addressSnapshot`, `items[]` (product/variant/qty/price snapshots), `subtotal`, `tax`, `deliveryFee`, `discount`, `grandTotal`, `paymentId`, `paymentStatus`, `orderStatus` (initial: `placed` / `pending` per PDF), `inventoryConfirmed`, `cartId`, `placedAt`, `createdAt`, `updatedAt`
- Note Phase 5 extensions: picker status, cancellation, timeline — **out of scope** for Phase 4 schema detail beyond placement.

**Implementation steps:**
1. Address and price immutability (snapshots).
2. Order idempotency key relation to payment.
3. Customer-facing vs internal fields.

**Acceptance criteria:**
- Schema doc scoped to Phase 4 placement; Phase 5 fields marked deferred.

**Test commands:**
```bash
test -f docs/database/order-schema.md && echo PASS
```

**Depends on:** Tickets 5, 6.

---

## Ticket 8 — Customer address API contract

**Ticket:** 8 — Customer address API contract

**Objective:** Document customer address CRUD and default-selection APIs (Module 1).

**Files to create/update:**
- `docs/contracts/customer-address-api.md` (create)

**API endpoints:** Document planned (status PLANNED):
- `GET /api/v1/customer/addresses`
- `POST /api/v1/customer/addresses`
- `PATCH /api/v1/customer/addresses/:addressId`
- `DELETE /api/v1/customer/addresses/:addressId`
- `POST /api/v1/customer/addresses/:addressId/set-default`
- `GET /api/v1/customer/stores/nearby` or `POST /api/v1/customer/serviceability` (serviceable store lookup — align naming with Ticket 17 route plan)

**DB fields:** Reference `docs/database/customer-address-schema.md`.

**Implementation steps:**
1. Request/response envelopes per `API_STANDARDS.md`.
2. Auth: customer JWT + `CUSTOMER` role.
3. Error codes cross-ref Ticket 15.
4. Unserviceable area response shape (Module 1 Task 4).

**Acceptance criteria:**
- Contract lists all Module 1 backend endpoints; no route files created.

**Test commands:**
```bash
test -f docs/contracts/customer-address-api.md && echo PASS
```

**Depends on:** Tickets 3, 15.

---

## Ticket 9 — Customer home and shopping entry API contract

**Ticket:** 9 — Customer home and shopping entry API contract

**Objective:** Document home feed and shopping-entry APIs (Module 2).

**Files to create/update:**
- `docs/contracts/customer-home-shopping-entry-api.md` (create)

**API endpoints:** Document planned:
- `GET /api/v1/customer/home` (selected store, categories, banners placeholder, featured blocks)
- `GET /api/v1/customer/shopping-entry` (if separate from home per PDF — or merge into home with query flag; document decision)

**DB fields:** Reference optional `customer_home` config collection if PDF mentions banners/offers — mark **optional/deferred** unless required for MVP; prefer composing from Phase 3 catalog + store context.

**Implementation steps:**
1. Query params: `storeId`, `cityId`, pagination for sections.
2. Compose from Phase 3 catalog search/read endpoints (reference, do not duplicate).
3. Serviceability states in response.

**Acceptance criteria:**
- Contract aligns with `AllPhase&Modules.pdf` Module 2 tasks; no implementation.

**Test commands:**
```bash
test -f docs/contracts/customer-home-shopping-entry-api.md && echo PASS
```

**Depends on:** Tickets 1, 8.

---

## Ticket 10 — Cart API contract

**Ticket:** 10 — Cart API contract

**Objective:** Document cart CRUD APIs (Module 3).

**Files to create/update:**
- `docs/contracts/cart-api.md` (create)

**API endpoints:** Document planned:
- `GET /api/v1/customer/cart`
- `POST /api/v1/customer/cart/items` (add)
- `PATCH /api/v1/customer/cart/items/:itemId` (quantity)
- `DELETE /api/v1/customer/cart/items/:itemId`
- `DELETE /api/v1/customer/cart` (clear)
- Optional: `POST /api/v1/customer/cart/merge` — mark NEEDS VERIFICATION if not in PDF

**DB fields:** Reference `docs/database/cart-schema.md`.

**Implementation steps:**
1. Store-scoped cart; headers or body `storeId`.
2. Stock/availability error responses (link inventory).
3. Price snapshot on add/update (Module 5).

**Acceptance criteria:**
- All Cart Backend Foundation tasks mapped to endpoints.

**Test commands:**
```bash
test -f docs/contracts/cart-api.md && echo PASS
```

**Depends on:** Tickets 4, 14, 15.

---

## Ticket 11 — Checkout preparation API contract

**Ticket:** 11 — Checkout preparation API contract

**Objective:** Document checkout validation, reservation, summary, and expiry APIs (Module 6).

**Files to create/update:**
- `docs/contracts/checkout-api.md` (create)

**API endpoints:** Document planned:
- `POST /api/v1/customer/checkout/initiate` (validate + reserve inventory)
- `GET /api/v1/customer/checkout/summary`
- `POST /api/v1/customer/checkout/cancel` (release reservation)
- Optional expiry: internal job documented, not public API

**DB fields:** Reference `docs/database/checkout-session-schema.md`.

**Implementation steps:**
1. Request body: `addressId`, `cartId` or implicit active cart.
2. Failure codes: stock unavailable, price changed, store closed, empty cart, unserviceable address, reservation expired (Ticket 15).
3. Response includes `expiresAt`, `reservationId` / lock tokens (internal shape).

**Acceptance criteria:**
- Contract references Phase 3 inventory lock internal routes; no controllers.

**Test commands:**
```bash
test -f docs/contracts/checkout-api.md && echo PASS
```

**Depends on:** Tickets 5, 10, 18.

---

## Ticket 12 — Payment gateway API contract

**Ticket:** 12 — Payment gateway API contract

**Objective:** Document Razorpay payment order, verify, and webhook APIs (Module 8).

**Files to create/update:**
- `docs/contracts/payment-api.md` (create)

**API endpoints:** Document planned:
- `POST /api/v1/customer/payments/create-order` (Razorpay order from checkout session)
- `POST /api/v1/customer/payments/verify`
- `POST /api/v1/webhooks/razorpay` (or `/api/v1/internal/webhooks/razorpay` — document mount per security standards)

**DB fields:** Reference `docs/database/payment-schema.md`.

**Implementation steps:**
1. Idempotency header/body field.
2. Webhook signature verification note.
3. Failure → release reservation (cross-ref checkout).
4. Dev vs prod key usage (cross-ref Ticket 22).

**Acceptance criteria:**
- Razorpay named as gateway; webhook and verify flows documented.

**Test commands:**
```bash
test -f docs/contracts/payment-api.md && echo PASS
```

**Depends on:** Tickets 6, 11, 15, 22.

---

## Ticket 13 — Order customer API contract

**Ticket:** 13 — Order customer API contract

**Objective:** Document order creation trigger, detail, and history APIs (Module 10).

**Files to create/update:**
- `docs/contracts/order-customer-api.md` (create)

**API endpoints:** Document planned:
- `POST /api/v1/customer/orders` (create from verified payment + checkout session — or internal-only after verify; document chosen flow)
- `GET /api/v1/customer/orders/:orderId`
- `GET /api/v1/customer/orders` (paginated history)

**DB fields:** Reference `docs/database/order-schema.md`.

**Implementation steps:**
1. Create order only after payment verify (sequencing diagram).
2. Confirm inventory + clear cart side effects documented.
3. Order idempotency (duplicate callback protection).
4. Basic `orderStatus` values for Phase 4 only.

**Acceptance criteria:**
- Contract covers Module 10 PDF tasks; Phase 5 status transitions marked deferred.

**Test commands:**
```bash
test -f docs/contracts/order-customer-api.md && echo PASS
```

**Depends on:** Tickets 7, 11, 12.

---

## Ticket 14 — Phase 4 validation rules

**Ticket:** 14 — Phase 4 validation rules

**Objective:** Centralize validation rules for address, cart, checkout, payment, and order domains.

**Files to create/update:**
- `docs/validation/phase-4-validation-rules.md` (create)

**API endpoints:** Map rules to endpoints in Tickets 8–13 (reference only).

**DB fields:** Reference field constraints from Tickets 3–7.

**Implementation steps:**
1. Phone/customer ownership checks on all customer routes.
2. Cart: max quantity, min quantity 1, variant required, store match.
3. Checkout: non-empty cart, address in service area, reservation TTL.
4. Payment: amount match checkout summary.
5. Profile (Module 12 preview): name/email optional rules.

**Acceptance criteria:**
- Single validation doc; no zod/joi files created.

**Test commands:**
```bash
test -f docs/validation/phase-4-validation-rules.md && echo PASS
```

**Depends on:** Tickets 3–7.

---

## Ticket 15 — Phase 4 permissions and security matrix

**Ticket:** 15 — Phase 4 permissions and security matrix

**Objective:** Define permission codes and access rules for Phase 4 customer APIs.

**Files to create/update:**
- `docs/security/phase-4-permissions.md` (create)

**API endpoints:** All `/api/v1/customer/*` routes in Tickets 8–13 require `authenticate` + `CUSTOMER` role unless noted.

**DB fields:** None.

**Implementation steps:**
1. New permission codes if needed (e.g. `cart:read`, `cart:update`, `orders:read`) — or document reuse of wildcard/customer role only per Phase 2 pattern.
2. Customer can only access own `customerId` resources.
3. Webhook route: no customer JWT; signature secret.
4. Rate limits placeholder for OTP-adjacent flows (reference Phase 2).

**Acceptance criteria:**
- Matrix table: endpoint → auth → scope; no seed matrix changes yet (Module 1+ may add permissions).

**Test commands:**
```bash
test -f docs/security/phase-4-permissions.md && echo PASS
```

**Depends on:** Tickets 8–13.

---

## Ticket 16 — Phase 4 error codes

**Ticket:** 16 — Phase 4 error codes

**Objective:** Define stable error codes for cart, checkout, payment, order, and address flows.

**Files to create/update:**
- `docs/errors/phase-4-error-codes.md` (create)

**API endpoints:** Map codes to contracts Tickets 8–13.

**DB fields:** None.

**Implementation steps:**
1. Prefix convention: `CART_*`, `CHECKOUT_*`, `PAYMENT_*`, `ORDER_*`, `ADDRESS_*`, `SERVICEABILITY_*`.
2. Include PDF examples: `STORE_ALREADY_SELECTED`, stock unavailable, price changed, reservation expired, payment failed.
3. HTTP status mapping per `API_STANDARDS.md`.

**Acceptance criteria:**
- Error doc complete; no `errors/*.ts` implementation files.

**Test commands:**
```bash
test -f docs/errors/phase-4-error-codes.md && echo PASS
```

**Depends on:** Tickets 8–13, 14.

---

## Ticket 17 — Phase 4 route mounting plan

**Ticket:** 17 — Phase 4 route mounting plan

**Objective:** Plan how Phase 4 routers mount under existing `customer.routes.ts` and webhook routes.

**Files to create/update:**
- `docs/contracts/phase-4-route-mounting-plan.md` (create)

**API endpoints:** Table of all planned routes with mount file, middleware chain, status PLANNED.

**DB fields:** None.

**Implementation steps:**
1. Mount under `backend/api/src/routes/v1/customer.routes.ts` sub-routers: `addresses`, `cart`, `checkout`, `payments`, `orders`, `home`.
2. Webhook mount path (public vs internal).
3. Rule: do not mount until owning module implements controllers (mirror catalog plan).
4. List files to create in Module 1+ (paths only, no files in Module 0).

**Acceptance criteria:**
- Mount plan references existing customer catalog routes without conflict.

**Test commands:**
```bash
test -f docs/contracts/phase-4-route-mounting-plan.md && echo PASS
```

**Depends on:** Tickets 8–13.

---

## Ticket 18 — Phase 4 inventory lock integration

**Ticket:** 18 — Phase 4 inventory lock integration

**Objective:** Document how checkout uses Phase 3 inventory locking (reservation create/release/confirm).

**Files to create/update:**
- `docs/architecture/phase-4-inventory-lock-integration.md` (create)

**API endpoints:** Reference existing internal/customer-facing lock APIs from `docs/contracts/inventory-locking-api.md` — no new lock endpoints unless PDF requires.

**DB fields:** Cross-ref `inventory_locks`, `inventory_stocks` reserved/available fields.

**Implementation steps:**
1. Sequence: add to cart (soft check) → checkout initiate (lock) → payment success (confirm) → failure/expiry (release).
2. TTL alignment with checkout session `expiresAt`.
3. Cart stock validation vs lock quantity rules.
4. Update Ticket 5 doc cross-reference if drafted before this ticket.

**Acceptance criteria:**
- Integration doc complete; no changes to `inventory-lock.service.ts`.

**Test commands:**
```bash
test -f docs/architecture/phase-4-inventory-lock-integration.md && echo PASS
```

**Depends on:** Tickets 5, 11; Phase 3 inventory locking docs.

---

## Ticket 19 — Phase 4 database index plan

**Ticket:** 19 — Phase 4 database index plan

**Objective:** Define MongoDB indexes for Phase 4 collections.

**Files to create/update:**
- `docs/database/phase-4-index-plan.md` (create)

**API endpoints:** None.

**DB fields:** Indexes for collections in Tickets 3–7:
- `customer_addresses`: `{ customerId: 1 }`, `{ customerId: 1, isDefault: 1 }`
- `carts`: `{ customerId: 1, storeId: 1, status: 1 }` unique partial for active
- `checkout_sessions`: `{ customerId: 1 }`, `{ expiresAt: 1 }` TTL
- `payments`: `{ gatewayOrderId: 1 }` unique, `{ idempotencyKey: 1 }` unique sparse
- `orders`: `{ customerId: 1, placedAt: -1 }`, `{ orderNumber: 1 }` unique

**Implementation steps:**
1. Note compound indexes for list/history queries.
2. TTL index for checkout expiry and optional cart abandonment (NEEDS VERIFICATION).

**Acceptance criteria:**
- Index plan doc only; no migration scripts.

**Test commands:**
```bash
test -f docs/database/phase-4-index-plan.md && echo PASS
```

**Depends on:** Tickets 3–7.

---

## Ticket 20 — Phase 4 audit logging specification

**Ticket:** 20 — Phase 4 audit logging specification

**Objective:** Define audit events for cart mutations, checkout, payment, and order placement.

**Files to create/update:**
- `docs/architecture/phase-4-audit-logging.md` (create)

**API endpoints:** Map events to triggering endpoints (Tickets 8–13).

**DB fields:** `audit_logs` fields per Phase 1/2 conventions (`actorId`, `action`, `resourceType`, `resourceId`, `metadata`).

**Implementation steps:**
1. Events: `cart.item_added`, `cart.cleared`, `checkout.initiated`, `checkout.expired`, `payment.verified`, `payment.failed`, `order.placed`.
2. Customer actor type; no PII in metadata beyond IDs.
3. Defer admin/vendor order audit to Phase 5.

**Acceptance criteria:**
- Audit spec doc only; no audit service changes.

**Test commands:**
```bash
test -f docs/architecture/phase-4-audit-logging.md && echo PASS
```

**Depends on:** Tickets 8–13.

---

## Ticket 21 — Phase 4 backend file structure plan

**Ticket:** 21 — Phase 4 backend file structure plan

**Objective:** Document planned backend folder layout for Phase 4 modules (no `.ts` files created).

**Files to create/update:**
- `docs/architecture/phase-4-backend-file-structure.md` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Planned paths (mirror catalog pattern):
   - `backend/api/src/modules/customer-addresses/` (or `locations/customer-addresses/`)
   - `backend/api/src/modules/cart/`
   - `backend/api/src/modules/checkout/`
   - `backend/api/src/modules/payment/`
   - `backend/api/src/modules/orders/` (customer placement subset)
   - `backend/api/src/modules/pricing/` (cart calculation — Module 5)
2. Each: `models/`, `repositories/`, `services/`, `controllers/`, `routes/`, `validators/`, `types/`, `constants/`
3. Note: **Module 0 does not create these folders** — Module 1+ creates when implementing.

**Acceptance criteria:**
- Structure doc exists; zero new files under `backend/api/src/modules/` for cart/checkout/etc.

**Test commands:**
```bash
test -f docs/architecture/phase-4-backend-file-structure.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 22 — Phase 4 customer app file structure plan

**Ticket:** 22 — Phase 4 customer app file structure plan

**Objective:** Document planned React Native module layout for Phase 4 customer-app work (no screens implemented).

**Files to create/update:**
- `docs/architecture/phase-4-customer-app-file-structure.md` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Planned under `apps/customer-app/src/modules/`: `addresses/`, `home/`, `cart/`, `checkout/`, `payment/`, `orders/`, `profile/`
2. Subfolders: `api/`, `hooks/`, `screens/`, `components/`, `types/`, `store/` (zustand)
3. Navigation routes file names (plan only).
4. Razorpay SDK integration point (Module 9).

**Acceptance criteria:**
- Doc only; no new screens in `apps/customer-app`.

**Test commands:**
```bash
test -f docs/architecture/phase-4-customer-app-file-structure.md && echo PASS
```

**Depends on:** Ticket 1.

---

## Ticket 23 — Phase 4 shared types documentation plan

**Ticket:** 23 — Phase 4 shared types documentation plan

**Objective:** Plan `packages/shared` TypeScript types for Phase 4 (documentation only — no `.ts` files in Module 0).

**Files to create/update:**
- `docs/architecture/phase-4-shared-contracts.md` (create)

**API endpoints:** Map DTO names to contract docs Tickets 8–13.

**DB fields:** Map types to schema docs Tickets 3–7.

**Implementation steps:**
1. List planned files: `packages/shared/api/cart.types.ts`, `checkout.types.ts`, `payment.types.ts`, `order.types.ts`, `customer-address.types.ts` — **create in Module 1+**, not Module 0.
2. Export plan for `packages/shared/api/index.ts`.
3. Note Phase 3 gap: catalog types may remain app-local until migrated — document strategy.

**Acceptance criteria:**
- No new files under `packages/shared/api/` except this planning doc path under `docs/`.

**Test commands:**
```bash
test -f docs/architecture/phase-4-shared-contracts.md && echo PASS
```

**Depends on:** Tickets 3–13.

---

## Ticket 24 — Phase 4 environment and configuration matrix

**Ticket:** 24 — Phase 4 environment and configuration matrix

**Objective:** Document env vars for Razorpay, checkout TTL, and customer-app payment config.

**Files to create/update:**
- `docs/setup/phase-4-env-config.md` (create)
- `backend/api/.env.example` (update — add commented placeholders only)
- `apps/customer-app/.env.example` (update — Razorpay key placeholder if missing)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Backend: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `CHECKOUT_RESERVATION_TTL_SECONDS`, optional `CHECKOUT_RESERVATION_CRON`.
2. Customer app: `RAZORPAY_KEY_ID` (public), `API_BASE_URL` (existing).
3. Document dev/staging/prod differences; never commit secrets.
4. Cross-ref `docs/reviews/phase-3-env-config-review.md` patterns.

**Acceptance criteria:**
- Env doc + example placeholders only; no real secrets; no `env.ts` code changes in Module 0 (Module 8 implements validation).

**Test commands:**
```bash
test -f docs/setup/phase-4-env-config.md && grep -q RAZORPAY backend/api/.env.example && echo PASS
```

**Depends on:** Tickets 11, 12.

---

## Ticket 25 — Phase 4 seed data plan

**Ticket:** 25 — Phase 4 seed data plan

**Objective:** Plan dev seeds for addresses, sample cart, and test checkout (no seed scripts in Module 0).

**Files to create/update:**
- `docs/database/phase-4-seed-data-plan.md` (create)

**API endpoints:** None.

**DB fields:** Seed IDs for `customer_addresses`, optional demo cart tied to `STORE-000001` / seed customer `9999999999`.

**Implementation steps:**
1. Idempotent seed strategy (mirror Phase 3 catalog seeds).
2. Dependencies: Phase 3 catalog + store products + inventory.
3. Do not seed real Razorpay transactions.
4. List seed functions to add in Module 1+ (`seed-customer-addresses.ts`, etc.).

**Acceptance criteria:**
- Seed plan doc only; no changes to `backend/api/src/database/seeds/index.ts`.

**Test commands:**
```bash
test -f docs/database/phase-4-seed-data-plan.md && echo PASS
```

**Depends on:** Tickets 3–7, 25 (Phase 3 seeds exist).

---

## Ticket 26 — Backend route registry Phase 4 planned entries

**Ticket:** 26 — Backend route registry Phase 4 planned entries

**Objective:** Add PLANNED entries for all Phase 4 customer routes to the central registry.

**Files to create/update:**
- `docs/contracts/backend-route-registry.md` (update)

**API endpoints:** Register all routes from Tickets 8–13 with status `PLANNED` and owning module number.

**DB fields:** None.

**Implementation steps:**
1. Group by domain: addresses, home, cart, checkout, payments, orders, webhooks.
2. Do not mark IMPLEMENTED.
3. Link each entry to contract markdown file.

**Acceptance criteria:**
- Registry updated; no backend route files added.

**Test commands:**
```bash
grep -q "PLANNED" docs/contracts/backend-route-registry.md && grep -q "customer/cart" docs/contracts/backend-route-registry.md && echo PASS
```

**Depends on:** Tickets 8–13, 17.

---

## Ticket 27 — Phase 4 foundation verification checklist

**Ticket:** 27 — Phase 4 foundation verification checklist

**Objective:** Manual/doc verification checklist before starting Module 1 implementation.

**Files to create/update:**
- `docs/testing/phase-4-foundation-bootstrap-verification.md` (create)

**API endpoints:** Checklist references all contract docs exist and are internally consistent.

**DB fields:** Checklist confirms schema docs cover all collections in architecture doc.

**Implementation steps:**
1. Checklist items: architecture, dependencies, 5 schemas, 6 contracts, validation, permissions, errors, routes, indexes, audit, file structures, shared plan, env, seeds, registry.
2. Cross-link Phase 3 inventory lock docs reviewed.
3. Sign-off section: Module 0 complete → unlock Module 1 ticketization.

**Acceptance criteria:**
- Verification doc exists; all prior tickets 1–26 files listed with paths.

**Test commands:**
```bash
test -f docs/testing/phase-4-foundation-bootstrap-verification.md && echo PASS
```

**Depends on:** Tickets 1–26.

---

## Ticket 28 — Module 0 handoff and closeout

**Ticket:** 28 — Module 0 handoff and closeout

**Objective:** Close Module 0; update project context; record artifacts and next module gate.

**Files to create/update:**
- `docs/handoffs/phase-4-foundation-bootstrap-complete.md` (create)
- `project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md` (update — Module 0 DONE, Module 1 next)
- `project-context/CURRENT_PROGRESS.md` (update — Phase 4 Module 0 complete)
- `project-context/PHASE_STATUS.md` (update — Phase 4 in progress, Module 0 complete)
- `docs/reviews/phase-4-foundation-bootstrap-execution-tickets.md` (update — mark Tickets 1–28 DONE)

**API endpoints:** Summary table of PLANNED endpoints (count by domain); none IMPLEMENTED in Module 0.

**DB fields:** Summary table of documented collections (no live collections created in Module 0).

**Implementation steps:**
1. List all artifacts with paths.
2. Known risks: Razorpay credentials, reservation TTL tuning, shared types migration.
3. Explicit next step: **Ticketize Module 1 — Customer Location & Store Selection** (do not start implementation in same ticket).
4. Confirm Repository & Codebase Setup was **not** part of Module 0.

**Acceptance criteria:**
- Handoff complete; `CURRENT_PROGRESS.md` reflects Module 0 done; all tickets 1–28 marked DONE.

**Test commands:**
```bash
test -f docs/handoffs/phase-4-foundation-bootstrap-complete.md && \
grep -q "Module 0" project-context/PHASE_HANDOFFS/PHASE_4_HANDOFF.md && echo PASS
```

**Depends on:** Tickets 1–27.

---

## Module closeout

**Phase 4 Module 0 — Foundation & Bootstrap:** **COMPLETE** (Tickets 1–28 DONE, 2026-05-19)

**Next module to ticketize:** **Module 1 — Customer Location & Store Selection**

**Execution order summary:**
```text
Tickets 1–2 (architecture + dependencies)
  → 3–7 (schemas)
  → 14–16 (validation, permissions, errors) — can parallel after 3–7
  → 8–13 (API contracts)
  → 17–20 (routes, inventory integration, indexes, audit)
  → 21–23 (file structure + shared plan)
  → 24–26 (env, seeds, registry)
  → 27–28 (verification + handoff)
```

**Note on Ticket 5 / 18:** If Ticket 5 is completed before Ticket 18, add a “see inventory integration doc (pending)” note in checkout schema; update cross-links when Ticket 18 completes.
