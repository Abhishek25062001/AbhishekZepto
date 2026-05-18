# Phase 3 Inventory Locking Preparation — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Inventory Locking Preparation  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 157–175  

**Architecture references:**  
`docs/database/inventory-stock-schema.md`, `docs/database/inventory-movement-schema.md`, `docs/contracts/inventory-foundation-api.md`, `project-context/DATABASE_STANDARDS.md`, `docs/contracts/role-permission-contract.md`, `docs/security/audit-log-fields.md`, `docs/standards/api-conventions.md`

**Prerequisites (already in repo):**  
Phase 2 auth/RBAC; Inventory Foundation Backend complete (`inventory_stocks`, `inventory_movements`, reservation movement types in enums); internal route group at `/api/v1/internal`; `inventory:read` and `inventory:adjust` seeded on `operations_admin`.

**Out of scope for this module:**  
Media & File Upload Foundation, customer/cart/checkout/order runtime (future modules call internal lock APIs), frontend UIs, Order Management full checkout flow, `packages/shared` TypeScript files, Repository & Codebase Setup, Redis-only locking layer (PDF uses `inventory_locks` MongoDB collection + TTL index + expiry job; no separate Redis micro-tasks in PDF).

**Execution order notes:**
- Run **Ticket 12** (error/audit global registration) before **Tickets 16–17** (routes and mount).
- Run **Tickets 14–15** (controllers) before **Tickets 16–17** (route files).
- Run **Ticket 6** (repository) before **Tickets 8–10** (lock services).
- Run **Ticket 8** (create lock + `reservation_created` movement) before **Tickets 9–10** (release/confirm/expire).
- Run **Ticket 22** (expiry job) after **Ticket 10** (`expireDueInventoryLocks` service).
- Use co-located `*.test.ts` files (repo convention), not PDF `__tests__/` paths.

**Status legend:** `DONE` | `DONE`

**Module status:** All tickets `DONE` (2026-05-18)

---

## Ticket 1 — Inventory locking schema and contract docs

**Ticket:** 1 — Inventory locking schema and contract docs

**Objective:** Add planning docs for `inventory_locks` and locking behavior (no runtime code).

**Files to create/update:**
- `docs/database/inventory-lock-schema.md` (create)
- `docs/validation/inventory-locking-validation-rules.md` (create)
- `docs/security/inventory-locking-permissions.md` (create)
- `docs/errors/inventory-locking-error-codes.md` (create)

**API endpoints:** Document planned internal and admin routes only (no implementation).

**DB fields:** Document `inventory_locks.*`: `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `customerId`, `cartId`, `orderId`, `lockToken`, `lockType`, `quantity`, `status`, `expiresAt`, `releasedAt`, `confirmedAt`, `releaseReason`, `confirmationReason`, `metadata`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`. Document stock fields mutated: `availableQuantity`, `reservedQuantity`, `totalQuantity`, `isLowStock`, `isOutOfStock`, `lastStockUpdatedAt`, `lastStockMovementId`. Document movements: `reservation_created`, `reservation_released`, `reservation_confirmed`.

**Implementation steps:**
1. Schema doc: partial unique `{ lockToken: 1 }` where `status = active`.
2. TTL index on `expiresAt` (supplements explicit release/confirm/expire-due job; does not replace service logic per PDF page 159).
3. `lockType` enum: `cart`, `checkout`, `order`, `manual`, `system`.
4. `status` enum: `active`, `released`, `confirmed`, `expired`, `cancelled`, `failed`.
5. Default expiry rules: cart 10m, checkout 15m, order/manual/system 30m.
6. Permissions doc: internal routes use internal API auth; admin uses existing `inventory:read`, `inventory:adjust`.
7. Error codes doc: all codes from PDF page 169.

**Acceptance criteria:**
- Docs match PDF micro-tasks; no Mongoose or route files created.

**Test commands:**
- `test -f docs/database/inventory-lock-schema.md && test -f docs/errors/inventory-locking-error-codes.md && echo PASS`

**Depends on:** Inventory Foundation Backend complete.

---

## Ticket 2 — Inventory locks module scaffold and constants

**Ticket:** 2 — Inventory locks module scaffold and constants

**Objective:** Create `inventory/locks/` folder layout and enum/error/audit constant files.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/` — `controllers/`, `routes/`, `services/`, `repositories/`, `models/`, `validators/`, `types/`, `constants/`, `utils/`
- `backend/api/src/modules/inventory/locks/constants/inventory-lock-type.constant.ts` — `cart`, `checkout`, `order`, `manual`, `system`
- `backend/api/src/modules/inventory/locks/constants/inventory-lock-status.constant.ts` — `active`, `released`, `confirmed`, `expired`, `cancelled`, `failed`
- `backend/api/src/modules/inventory/locks/constants/inventory-lock-error-codes.constant.ts`
- `backend/api/src/modules/inventory/locks/constants/inventory-lock-audit-events.constant.ts`

**API endpoints:** None.

**DB fields:** Constants only.

**Implementation steps:**
1. Error codes per PDF: `INVENTORY_LOCK_NOT_FOUND`, `INVENTORY_LOCK_ALREADY_CONFIRMED`, `INVENTORY_LOCK_ALREADY_RELEASED`, `INVENTORY_LOCK_EXPIRED`, `INVENTORY_LOCK_NOT_ACTIVE`, `INVENTORY_LOCK_RELEASE_BLOCKED`, `INVENTORY_LOCK_CONFIRM_BLOCKED`, `INVENTORY_LOCK_TOKEN_COLLISION`, `INVENTORY_LOCK_QUANTITY_INVALID`, `INVENTORY_LOCK_STOCK_MISMATCH`, `INVENTORY_LOCK_INSUFFICIENT_STOCK`, `INVENTORY_LOCK_EXPIRY_INVALID`.
2. Audit events per PDF: `inventory_lock.created`, `inventory_lock.released`, `inventory_lock.confirmed`, `inventory_lock.expired`, `inventory_lock.expire_due_ran`.

**Acceptance criteria:**
- Folder tree exists; no models, routes, or services yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 3 — Inventory lock Mongoose model and indexes

**Ticket:** 3 — Inventory lock Mongoose model and indexes

**Objective:** Implement `InventoryLockModel` for collection `inventory_locks`.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/models/inventory-lock.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — add `INVENTORY_LOCKS: 'inventory_locks'`

**API endpoints:** None.

**DB fields:** All fields from Ticket 1; ObjectId refs for store/stock/product/variant/customer/cart/order as applicable.

**Implementation steps:**
1. Partial unique: `{ lockToken: 1 }` with `partialFilterExpression: { status: 'active' }`.
2. Indexes per PDF: `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `customerId`, `cartId`, `orderId`, `status`, `expiresAt`, `createdAt`.
3. TTL index on `expiresAt` per PDF page 158 (document in model; expiry job still processes explicitly per page 159).

**Acceptance criteria:**
- Model compiles; enums match Ticket 2.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 4 — Inventory lock types and utility helpers

**Ticket:** 4 — Inventory lock types and utility helpers

**Objective:** TypeScript contracts, lock token generation, and expiry calculation utilities.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/types/inventory-lock.types.ts`
- `backend/api/src/modules/inventory/locks/utils/inventory-lock-token.util.ts` — `generateInventoryLockToken()` → `lock_<random-safe-id>`
- `backend/api/src/modules/inventory/locks/utils/inventory-lock-expiry.util.ts` — `calculateLockExpiry(lockType)` with defaults from Ticket 1

**API endpoints:** None.

**DB fields:** Types for `InventoryLockType`, `InventoryLockStatus`, `CreateInventoryLockInput`, `ReleaseInventoryLockInput`, `ConfirmInventoryLockInput`, `InventoryLockListQuery`, `InventoryLockSummary`, `ExpireDueLocksSummary`.

**Implementation steps:**
1. Token format collision-resistant (retry on rare collision in service layer).
2. Expiry defaults: cart 10 min, checkout 15 min, order/manual/system 30 min.
3. Optional `expiresAt` override on create when provided in input.

**Acceptance criteria:**
- Utils are pure and unit-testable.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 5 — Inventory lock response mapper

**Ticket:** 5 — Inventory lock response mapper

**Objective:** Map lock DB documents to API response DTOs; exclude internal fields.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/utils/inventory-lock-response.mapper.ts`

**API endpoints:** None.

**DB fields:** Response includes: `id`, `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `customerId`, `cartId`, `orderId`, `lockToken`, `lockType`, `quantity`, `status`, `expiresAt`, `releasedAt`, `confirmedAt`, `releaseReason`, `confirmationReason`, `metadata`, `createdAt`, `updatedAt`. Exclude: `createdBy`, `updatedBy`, `__v`.

**Implementation steps:**
1. Mirror `inventory-stock-response.mapper.ts` pattern.

**Acceptance criteria:**
- Mapper compiles; no service logic.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 4.

---

## Ticket 6 — Inventory lock repository

**Ticket:** 6 — Inventory lock repository

**Objective:** Data access layer for inventory lock records and query helpers.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/repositories/inventory-lock.repository.ts`

**API endpoints:** None.

**DB fields:** CRUD and status transitions on `inventory_locks.*`.

**Implementation steps:**
1. Methods: `createInventoryLock`, `findInventoryLockById`, `findInventoryLockByToken`, `updateInventoryLockById`, `updateInventoryLockByToken`, `listInventoryLocks` (filters per PDF page 160–161).
2. `findActiveLocksByCartId`, `findActiveLocksByOrderId`, `findExpiredActiveLocks(now)`.
3. `markLockReleased`, `markLockConfirmed`, `markLockExpired`.
4. `sumActiveLockedQuantityByStockId` for validation helpers.

**Acceptance criteria:**
- No service or route code in this ticket.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 7 — Inventory lock Zod validators

**Ticket:** 7 — Inventory lock Zod validators

**Objective:** Request validation for internal and admin lock endpoints.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/validators/inventory-lock.validators.ts`

**API endpoints:** Validators for:
- `POST /api/v1/internal/inventory/locks`
- `POST /api/v1/internal/inventory/locks/:lockToken/release`
- `POST /api/v1/internal/inventory/locks/:lockToken/confirm`
- `GET /api/v1/admin/inventory/locks`
- `GET /api/v1/admin/inventory/locks/:lockId`
- `POST /api/v1/admin/inventory/locks/expire-due`
- Params: `lockToken`, `lockId` as ObjectId

**DB fields:** Validated request fields per PDF pages 161–162.

**Implementation steps:**
1. Create lock: `inventoryStockId`, `storeProductId` required; `quantity` > 0; `lockType` required; optional `customerId`, `cartId`, `orderId`, `expiresAt`, `metadata`.
2. Release: `releaseReason` required; optional `metadata`.
3. Confirm: `confirmationReason` required; optional `orderId`, `metadata`.
4. Admin list query: filters + pagination + sort per PDF page 162.

**Acceptance criteria:**
- Validators export Zod schemas; no controllers yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 8 — Inventory lock service: create lock

**Ticket:** 8 — Inventory lock service: create lock

**Objective:** Create lock with stock reservation and `reservation_created` movement.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/services/inventory-lock.service.ts` (partial)
- `backend/api/src/modules/inventory/locks/services/inventory-lock-reference.service.ts` (create — stock eligibility checks)

**API endpoints:**
- `POST /api/v1/internal/inventory/locks`

**DB fields:** On create: decrease `availableQuantity`, increase `reservedQuantity`; recalculate totals/flags; set `lastStockUpdatedAt`, `lastStockMovementId`; lock `status: active`, generated `lockToken`, `expiresAt`.

**Implementation steps:**
1. Verify `inventoryStockId` exists, active, not deleted; `storeProductId` matches stock.
2. Reject when `quantity > availableQuantity` → `INVENTORY_LOCK_INSUFFICIENT_STOCK`.
3. Use transactional update (Mongo session) for stock + lock + movement atomicity where possible.
4. Copy denormalized fields from stock record onto lock.
5. Create movement `movementType: reservation_created`, `referenceType: cart|order`, `referenceId` from cartId/orderId.
6. Generate `lockToken`; calculate `expiresAt` if not provided.
7. Write audit `inventory_lock.created`.

**Acceptance criteria:**
- Successful create returns lock response with token; stock quantities updated.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 5–6; Inventory Foundation stock/movement services.

---

## Ticket 9 — Inventory lock service: release and confirm

**Ticket:** 9 — Inventory lock service: release and confirm

**Objective:** Release and confirm locks with stock mutations and reservation movements.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/services/inventory-lock.service.ts` (extend)

**API endpoints:**
- `POST /api/v1/internal/inventory/locks/:lockToken/release`
- `POST /api/v1/internal/inventory/locks/:lockToken/confirm`

**DB fields:** Release: increase `availableQuantity`, decrease `reservedQuantity`; movement `reservation_released`; lock `status: released`. Confirm: decrease `reservedQuantity` only (no available increase); movement `reservation_confirmed`; lock `status: confirmed`; set `orderId` from payload when provided.

**Implementation steps:**
1. `releaseInventoryLock`: find by token; idempotent success if already `released`/`expired`/`cancelled`; block if `confirmed`; transactional stock update.
2. `confirmInventoryLock`: only from `active`; block if already released; set `confirmedAt`, `confirmationReason`.
3. Audit: `inventory_lock.released`, `inventory_lock.confirmed`.

**Acceptance criteria:**
- Release/confirm paths update stock and movements per PDF pages 164–165.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 8.

---

## Ticket 10 — Inventory lock service: expire, expire-due, list, and get

**Ticket:** 10 — Inventory lock service: expire, expire-due, list, and get

**Objective:** Single-lock expiry, batch expire-due, admin list/detail.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/services/inventory-lock.service.ts` (extend)

**API endpoints:**
- `GET /api/v1/admin/inventory/locks`
- `GET /api/v1/admin/inventory/locks/:lockId`
- `POST /api/v1/admin/inventory/locks/expire-due` (calls `expireDueInventoryLocks`)

**DB fields:** Expire: `status: expired`, release reserved back to available; movement `reservation_released` with `referenceType: system`, reason `Lock expired`. Expire-due returns `{ processedCount, expiredCount, failedCount, errors }`.

**Implementation steps:**
1. `expireInventoryLock(lockId)`: only `status: active` and `expiresAt < now`.
2. `expireDueInventoryLocks()`: batch via `findExpiredActiveLocks`; process in batches; audit `inventory_lock.expire_due_ran`.
3. `listInventoryLocks` paginated, default sort `createdAt desc`.
4. `getInventoryLockById` → `INVENTORY_LOCK_NOT_FOUND`.

**Acceptance criteria:**
- Expire paths mirror release stock logic; expire-due summary returned.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 9.

---

## Ticket 11 — Inventory lock internal controllers

**Ticket:** 11 — Inventory lock internal controllers

**Objective:** HTTP handlers for internal create/release/confirm lock endpoints.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/controllers/inventory-lock-internal.controller.ts`

**API endpoints:**
- `POST /api/v1/internal/inventory/locks`
- `POST /api/v1/internal/inventory/locks/:lockToken/release`
- `POST /api/v1/internal/inventory/locks/:lockToken/confirm`

**DB fields:** None (delegate to service).

**Implementation steps:**
1. Use `asyncHandler`, standard success/created responses.
2. Pass actor from internal auth context (same pattern as other internal routes).

**Acceptance criteria:**
- Controllers compile; no route mount yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 8–10.

---

## Ticket 12 — Global error codes, audit events, and permission confirmation

**Ticket:** 12 — Global error codes, audit events, and permission confirmation

**Objective:** Register lock error codes globally; confirm admin permissions (no new permission namespace per PDF).

**Files to create/update:**
- `backend/api/src/errors/error-codes.ts` — register all `INVENTORY_LOCK_*` codes
- `docs/security/inventory-locking-permissions.md` — mark IMPLEMENTED when done
- `backend/api/src/database/seeds/seed-roles.ts` — confirm `operations_admin` has `inventory:read` and `inventory:adjust` (add if any missing after Ticket 15 route mapping)

**API endpoints:** Permission gates documented:
- Internal: internal API authentication (existing pattern)
- Admin GET: `inventory:read`; POST expire-due: `inventory:adjust`

**DB fields:** None.

**Implementation steps:**
1. Map lock error constants to `ERROR_CODES`.
2. Verify `super_admin` retains `*:*`.
3. No new `inventory_lock:*` permission resource in PDF — reuse `inventory:*`.

**Acceptance criteria:**
- Error codes resolvable from services; seed matrix still passes.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 13 — Inventory lock admin controllers

**Ticket:** 13 — Inventory lock admin controllers

**Objective:** HTTP handlers for admin list, detail, and expire-due endpoints.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/controllers/inventory-lock-admin.controller.ts`

**API endpoints:**
- `GET /api/v1/admin/inventory/locks`
- `GET /api/v1/admin/inventory/locks/:lockId`
- `POST /api/v1/admin/inventory/locks/expire-due`

**DB fields:** None.

**Implementation steps:**
1. `expire-due` returns summary payload from `expireDueInventoryLocks`.
2. Paginated list/detail use standard response helpers.

**Acceptance criteria:**
- Three admin controller methods implemented.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 10.

---

## Ticket 14 — Internal inventory lock routes

**Ticket:** 14 — Internal inventory lock routes

**Objective:** Register internal lock routes with validation and internal auth middleware.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/routes/inventory-lock-internal.routes.ts`

**API endpoints:** All three internal endpoints under `/api/v1/internal/inventory/locks`.

**DB fields:** None.

**Implementation steps:**
1. Apply internal API authentication middleware (match `tenant-access-test` / internal route pattern in repo).
2. Wire validators from Ticket 7.
3. Mount order: static paths before `:lockToken` param routes.

**Acceptance criteria:**
- Router exports; not mounted until Ticket 16.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 7, 11–12.

---

## Ticket 15 — Admin inventory lock routes

**Ticket:** 15 — Admin inventory lock routes

**Objective:** Register admin lock routes with auth and permission middleware.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/routes/inventory-lock-admin.routes.ts`

**API endpoints:** Admin list/detail/expire-due per Ticket 13.

**DB fields:** None.

**Implementation steps:**
1. `inventory:read` on GET routes.
2. `inventory:adjust` on POST expire-due.
3. Admin role guards same as inventory admin routes.

**Acceptance criteria:**
- Router exports; not mounted until Ticket 16.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 7, 12–13.

---

## Ticket 16 — Mount internal and admin inventory lock routes

**Ticket:** 16 — Mount internal and admin inventory lock routes

**Objective:** Mount lock routers under internal and admin API prefixes.

**Files to create/update:**
- `backend/api/src/routes/v1/internal.routes.ts` — mount at `/inventory/locks`
- `backend/api/src/routes/v1/admin.routes.ts` — mount at `/inventory/locks` (nested under admin inventory path: `/api/v1/admin/inventory/locks` per PDF)

**API endpoints:**
- `/api/v1/internal/inventory/locks` → internal router
- `/api/v1/admin/inventory/locks` → admin router (mount on existing `/inventory` admin prefix or as sub-router per PDF paths)

**DB fields:** None.

**Implementation steps:**
1. PDF paths use `/api/v1/admin/inventory/locks` — nest `inventory-lock-admin.routes.ts` under `inventory-admin.routes.ts` OR mount separately at `/inventory/locks` on admin router; match PDF URL exactly.
2. Internal mount at `/inventory/locks` on `internal.routes.ts`.

**Acceptance criteria:**
- Six endpoints reachable in route tree (3 internal + 3 admin).

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run build -w backend/api`

**Depends on:** Tickets 14–15.

---

## Ticket 17 — OpenAPI, contract docs, and route registry

**Ticket:** 17 — OpenAPI, contract docs, and route registry

**Objective:** Document implemented inventory locking internal and admin APIs.

**Files to create/update:**
- `backend/api/src/docs/openapi/inventory-lock.paths.ts` (create)
- `backend/api/src/docs/openapi/index.ts` — merge `inventoryLockPaths`
- `docs/contracts/inventory-locking-api.md` (create)
- `docs/contracts/backend-route-registry.md`
- `docs/errors/inventory-locking-error-codes.md` — status IMPLEMENTED

**API endpoints:** Document all six endpoints with request/response field lists per PDF pages 170–171.

**DB fields:** Document lock and mutated stock fields in contract doc.

**Implementation steps:**
1. OpenAPI placeholder responses (inventory foundation pattern).
2. Registry lists internal and admin lock routes separately.
3. Note pending: Checkout/cart modules will consume internal APIs later (PDF page 176).

**Acceptance criteria:**
- Contracts match validators and response mapper.

**Test commands:**
- `npm run build -w backend/api`

**Depends on:** Ticket 16.

---

## Ticket 18 — Inventory lock utility unit tests

**Ticket:** 18 — Inventory lock utility unit tests

**Objective:** Unit tests for token and expiry utilities.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/utils/inventory-lock-token.util.test.ts`
- `backend/api/src/modules/inventory/locks/utils/inventory-lock-expiry.util.test.ts`

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Token format matches `lock_` prefix; uniqueness across many generations.
2. Expiry per lockType matches PDF defaults.

**Acceptance criteria:**
- Tests pass without MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/inventory/locks/utils/inventory-lock-token.util.test.js dist/modules/inventory/locks/utils/inventory-lock-expiry.util.test.js`

**Depends on:** Ticket 4.

---

## Ticket 19 — Inventory lock service unit tests

**Ticket:** 19 — Inventory lock service unit tests

**Objective:** Service tests for create, release, confirm, expire, expire-due (mocked repos and stock service).

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/services/inventory-lock.service.test.ts`
- `backend/api/src/modules/inventory/locks/services/inventory-lock.test-fixtures.ts` (optional co-located fixtures)

**API endpoints:** None.

**DB fields:** Fixtures for stock with available qty, active/expired locks.

**Implementation steps:**
1. Tests per PDF pages 172–173: create success/failures; quantity > available; release/confirm idempotency and blocks; expire active lock; expire-due summary; movement types created.
2. Mock `writeAuditLog`, lock repo, stock repo, movement service.

**Acceptance criteria:**
- Tests pass without live MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/inventory/locks/services/inventory-lock.service.test.js`

**Depends on:** Tickets 8–10.

---

## Ticket 20 — Inventory lock controller unit tests

**Ticket:** 20 — Inventory lock controller unit tests

**Objective:** Controller smoke tests with mocked services.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/controllers/inventory-lock-internal.controller.test.ts`
- `backend/api/src/modules/inventory/locks/controllers/inventory-lock-admin.controller.test.ts`

**API endpoints:** Smoke-test internal create/release/confirm and admin list/detail/expire-due.

**DB fields:** None.

**Implementation steps:**
1. Mirror `inventory-stock.controller.test.ts` mock pattern.
2. Assert `{ success, data }` and status codes.

**Acceptance criteria:**
- Controller tests pass without HTTP server.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/inventory/locks/controllers/inventory-lock-internal.controller.test.js dist/modules/inventory/locks/controllers/inventory-lock-admin.controller.test.js`

**Depends on:** Tickets 11, 13.

---

## Ticket 21 — Route integration tests (optional)

**Ticket:** 21 — Route integration tests (optional)

**Objective:** HTTP route tests per PDF pages 173–174, or document deferral.

**Files to create/update:**
- `backend/api/src/modules/inventory/locks/routes/inventory-lock-internal.routes.test.ts` (optional)
- `backend/api/src/modules/inventory/locks/routes/inventory-lock-admin.routes.test.ts` (optional)
- `docs/reviews/inventory-locking-preparation-review.md` (note deferral if skipped)

**API endpoints:** 401 internal unauthenticated; 403 admin missing permission; success paths; `INVENTORY_LOCK_INSUFFICIENT_STOCK`; `INVENTORY_LOCK_CONFIRM_BLOCKED`.

**DB fields:** None.

**Implementation steps:**
1. If deferred: document in module review; service/controller tests sufficient for this module.
2. If implemented: follow PDF route test matrix pages 173–174.

**Acceptance criteria:**
- Either route tests pass or deferral documented.

**Test commands:**
- `npm run test:inventory-locks -w backend/api` OR documented N/A

**Depends on:** Ticket 16.

---

## Ticket 22 — Inventory lock expiry background job

**Ticket:** 22 — Inventory lock expiry background job

**Objective:** Scheduled job to run `expireDueInventoryLocks` with env configuration.

**Files to create/update:**
- `backend/api/src/jobs/inventory-lock-expiry.job.ts` (create)
- `backend/api/.env.example` — `INVENTORY_LOCK_EXPIRY_JOB_ENABLED`, `INVENTORY_LOCK_EXPIRY_JOB_INTERVAL_SECONDS`
- `backend/api/src/config/env.ts` — validate new env vars; disable job in test environment
- Job bootstrap registration file (create or extend existing server bootstrap if present)

**API endpoints:** None (background job).

**DB fields:** Job processes expired active locks via Ticket 10 service.

**Implementation steps:**
1. Job calls `expireDueInventoryLocks()` on interval when enabled.
2. `INVENTORY_LOCK_EXPIRY_JOB_ENABLED=false` in test env.
3. Document TTL index does not replace explicit expire logic (PDF page 159).

**Acceptance criteria:**
- Job compiles; disabled in tests; enabled via env in dev only.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 10.

---

## Ticket 23 — Quality gates and npm test entrypoints

**Ticket:** 23 — Quality gates and npm test entrypoints

**Objective:** Add `test:inventory-locks` script and run full quality gates.

**Files to create/update:**
- `backend/api/package.json` — `test:inventory-locks` aggregating Tickets 18–20 tests

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:inventory-locks`: util, service, controller tests.
2. Run regression: `test:inventory`, `test:store-products`, `test:seed-matrix`.

**Acceptance criteria:**
- `npm run typecheck`, `npm run lint`, `npm run test:inventory-locks` pass.
- Existing inventory tests still pass.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:inventory-locks -w backend/api`
- `npm run test:inventory -w backend/api`
- `npm run test:seed-matrix -w backend/api`

**Depends on:** Tickets 18–20, 22.

---

## Ticket 24 — Module review, handoff, and project-context closeout

**Ticket:** 24 — Module review, handoff, and project-context closeout

**Objective:** Close Inventory Locking Preparation with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/inventory-locking-preparation-review.md` (create)
- `docs/handoffs/inventory-locking-preparation-complete.md` (create)
- `docs/reviews/phase-3-inventory-locking-preparation-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`

**API endpoints:** Verify all six internal + admin endpoints in review doc.

**DB fields:** Verify `inventory_locks.*` and stock mutation fields per PDF pages 175–176.

**Implementation steps:**
1. Record verification table: endpoints, permissions, audit, error codes, stock mutations, movements, expiry job.
2. Note pending: cart/checkout modules will call internal lock APIs (PDF page 176); no Media module started.
3. Set next module: **Media & File Upload Foundation** per PDF order.

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- No `media_files` runtime started.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 23

**Depends on:** Ticket 23.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5
3 → 6 → 8 → 9 → 10
4 → 18
2 → 7
5,6,7,8 → 11
8,9,10 → 14
10,12 → 13
7,11,12 → 14
7,12,13 → 15
14,15 → 16 → 17
8–10 → 19 → 23
11,13 → 20 → 23
10 → 22 → 23
16 → 21
18,19,20 → 23
23 → 24
```

**Critical path:** 1 → 2 → 3 → 6 → 8 → 9 → 10 → 11 → 14 → 16 → 23 → 24  
(Parallel: 4–5 utils; 12–13 admin; 18 util tests; 22 expiry job)

**Cross-module order:** Inventory Foundation before locking; locking internal APIs before cart/checkout consumers (future); locking before Media per PDF module list.
