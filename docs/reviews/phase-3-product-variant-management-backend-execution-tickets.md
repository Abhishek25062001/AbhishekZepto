# Phase 3 Product Variant Management Backend — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Product Variant Management Backend  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 71–88  

**Architecture references:**  
`docs/database/catalog-product-variant-schema.md`, `docs/contracts/catalog-admin-api-contract.md`, `docs/validation/catalog-validation-rules.md`, `docs/errors/catalog-error-codes.md`, `docs/security/catalog-permissions.md`, `docs/security/catalog-audit-logging.md`, `docs/database/catalog-index-plan.md`, `docs/architecture/catalog-backend-file-structure.md`

**Prerequisites (already in repo):**  
Catalog Architecture docs; Category, Brand & Unit, and Product Management Backend complete (`products`, `product_units` mounted; product delete variant-count stub present).

**Out of scope for this module:**  
Store Foundation Backend, Store Product Mapping, Inventory, Media upload, vendor/customer catalog routes, `tax_categories` admin CRUD, `seed-catalog.ts`, `packages/shared` TypeScript files, Repository & Codebase Setup, frontend UIs.

**Execution order notes:**
- Run **Ticket 14** (global variant error/audit registration) before **Tickets 15–16** (routes and nested mount).
- Run **Ticket 8** (unit reference validation) after product + unit repositories exist (prerequisites met).
- Run **Tickets 24–25** after Ticket 5 (count methods) and Ticket 12 (delete service).

**Status legend:** `PENDING` | `DONE`

**Module status:** Tickets 1–26 **DONE** (2026-05-18).

---

## Ticket 1 — Variant module scaffold and constants

**Ticket:** 1 — Variant module scaffold and constants

**Objective:** Create `variants/` submodule folder layout and enum/error/audit constant files per PDF micro-tasks.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/` — `controllers/`, `routes/`, `services/`, `repositories/`, `models/`, `validators/`, `types/`, `constants/`, `utils/`
- `backend/api/src/modules/catalog/variants/constants/variant-status.constant.ts` — `active`, `inactive`, `archived`
- `backend/api/src/modules/catalog/variants/constants/variant-error-codes.constant.ts`
- `backend/api/src/modules/catalog/variants/constants/variant-audit-events.constant.ts`

**API endpoints:** None.

**DB fields:** Constants only (no persistence yet).

**Implementation steps:**
1. Mirror `products/` / `brands/` folder convention from `docs/architecture/catalog-backend-file-structure.md`.
2. Variant error codes per `docs/errors/catalog-error-codes.md`: `VARIANT_NOT_FOUND`, `SKU_ALREADY_EXISTS`, `BARCODE_ALREADY_EXISTS`, `DEFAULT_VARIANT_REQUIRED`, `INVALID_VARIANT_UNIT`.
3. Audit events per `docs/security/catalog-audit-logging.md`: `catalog.variant_created`, `catalog.variant_updated`, `catalog.variant_deleted`.

**Acceptance criteria:**
- Folder tree exists; no models, routes, or services yet.
- All enums export typed values.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Product Management Backend complete.

---

## Ticket 2 — Product variant Mongoose model and indexes

**Ticket:** 2 — Product variant Mongoose model and indexes

**Objective:** Implement `ProductVariantModel` for collection `product_variants` per schema doc.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/models/product-variant.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — confirm `PRODUCT_VARIANTS: 'product_variants'` exists

**API endpoints:** None.

**DB fields:**
- `productId`, `variantName`, `sku`, `barcode`, `unit`, `unitValue`, `mrp`, `defaultSellingPrice`, `weightInGrams`, `lengthCm`, `widthCm`, `heightCm`, `imageUrl`, `attributeValues`, `isDefault`, `isVisible`, `status`, `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`

**Implementation steps:**
1. Partial unique index: `{ sku: 1 }` where `isDeleted: false` (per `catalog-product-variant-schema.md`).
2. Indexes per `catalog-index-plan.md`: `productId`, sparse `barcode`, `status`, `isVisible`.
3. Use `isDeleted` / `deletedAt` from `baseSchemaFields` pattern (variant-specific `status` enum, not duplicate global status field).
4. `productId` ref: `Product`.

**Acceptance criteria:**
- Model compiles; enums match Ticket 1 constants.
- No service or route code.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 3 — Variant types and response mapper

**Ticket:** 3 — Variant types and response mapper

**Objective:** TypeScript contracts and API mapping for variant admin layer.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/types/product-variant.types.ts`
- `backend/api/src/modules/catalog/variants/utils/product-variant-response.mapper.ts`

**API endpoints:** None (response shape only).

**DB fields:** Maps public fields; excludes `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `__v` from list/detail responses.

**Implementation steps:**
1. Types: `VariantStatus`, `ProductVariantDocument`, `CreateProductVariantInput`, `UpdateProductVariantInput`, `ProductVariantListQuery`, `ProductVariantResponse`.
2. Mapper: `_id` → `id`; stringify `productId`; include nested-route `productId` in response when useful for clients.

**Acceptance criteria:**
- Types align with `catalog-validation-rules.md` variant section and `catalog-product-variant-schema.md`.
- Mapper stable for CRUD responses.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 4 — Variant repository: CRUD methods

**Ticket:** 4 — Variant repository: CRUD methods

**Objective:** Data access for create, find, update, soft delete (soft-delete aware).

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/repositories/product-variant.repository.ts` (partial)

**API endpoints:** None.

**DB fields:** Read/write all variant fields from Ticket 2.

**Implementation steps:**
1. `createProductVariant`, `findProductVariantById`, `findProductVariantBySku` (optional `excludeId`), `findProductVariantByBarcode` (optional `excludeId`, only when barcode provided), `updateProductVariantById`, `softDeleteProductVariantById`.
2. Default filter: `isDeleted: false`.
3. `findProductVariantsByProductId(productId, variantId)` — ensure variant belongs to product for nested routes.

**Acceptance criteria:**
- Invalid ObjectIds handled safely.
- No HTTP or cross-module logic.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 5 — Variant repository: list and dependency count methods

**Ticket:** 5 — Variant repository: list and dependency count methods

**Objective:** Paginated list per product and count helpers for product/unit delete guards.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/repositories/product-variant.repository.ts` (complete)

**API endpoints:** None.

**DB fields:** Query filters: `productId` (required scope), `status`, `isVisible`, `isDefault`; pagination `page`, `limit`; sort `sortBy`, `sortOrder` (default `createdAt` desc).

**Implementation steps:**
1. `listProductVariantsByProductId(productId, query)` with pagination.
2. `countActiveVariantsByProduct(productId)` — non-deleted variants for product (for product delete guard).
3. `countVariantsUsingUnit(unitCode)` — non-deleted variants where `unit` matches active unit code (for unit delete guard).
4. `clearDefaultVariantForProduct(productId, excludeVariantId?)` — unset `isDefault` on siblings when promoting a new default.
5. `findDefaultVariantForProduct(productId)` — fetch current default variant.

**Acceptance criteria:**
- List scoped to single `productId`.
- Count methods return numbers for dependency checks.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 4.

---

## Ticket 6 — Variant request validators (create, update, list)

**Ticket:** 6 — Variant request validators (create, update, list)

**Objective:** Zod schemas for variant CRUD bodies, list query, and nested route params.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/validators/product-variant.validators.ts`

**API endpoints:** Validates:
- `POST /api/v1/admin/catalog/products/:productId/variants`
- `PATCH /api/v1/admin/catalog/products/:productId/variants/:variantId`
- `GET /api/v1/admin/catalog/products/:productId/variants`
- `DELETE /api/v1/admin/catalog/products/:productId/variants/:variantId`

**DB fields:** Validates:
- Required: `variantName`, `sku`, `unit`, `unitValue`, `mrp` (create); optional on update per partial schema.
- Optional: `barcode`, `defaultSellingPrice`, `weightInGrams`, `lengthCm`, `widthCm`, `heightCm`, `imageUrl`, `attributeValues`, `isDefault`, `isVisible`, `status`.
- Params: `productId`, `variantId`; list: `page`, `limit`, `status`, `isVisible`, `isDefault`, `sortBy`, `sortOrder`.
- Numeric guards: `unitValue > 0`, `mrp >= 0`, `defaultSellingPrice >= 0` when provided.

**Implementation steps:**
1. Reuse `paginationValidator`, `mongoObjectIdValidator`.
2. `productId` + `variantId` params validators.
3. Do not accept `productId` in body (path is source of truth).

**Acceptance criteria:**
- Validators match `catalog-validation-rules.md` variant section.
- No service imports.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 7 — Variant product reference validation service

**Ticket:** 7 — Variant product reference validation service

**Objective:** Ensure parent product exists and is eligible for variant mutations (read-only product repository).

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/services/variant-product-reference.service.ts`

**API endpoints:** Used by all nested variant write/list operations.

**DB fields:** Reads `products._id`, `products.isDeleted`, `products.status` (reject archived/deleted parent).

**Implementation steps:**
1. Import `findProductById` from `products/repositories/product.repository.ts` — **do not modify** product module files.
2. Missing product → `PRODUCT_NOT_FOUND` (reuse product error code via `ERROR_CODES` or map to variant flow with consistent HTTP 404).
3. Soft-deleted product → not found.

**Acceptance criteria:**
- No writes to `products` collection.
- Callable from variant service only.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Product Management Backend (product repository). Blocks Tickets 9–12.

---

## Ticket 8 — Variant unit reference validation service

**Ticket:** 8 — Variant unit reference validation service

**Objective:** Validate `unit` field against active `product_units.code` (read-only unit repository).

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/services/variant-unit-reference.service.ts`

**API endpoints:** Used by variant create/update.

**DB fields:** Reads `product_units.code`, `product_units.status`, `product_units.isDeleted`.

**Implementation steps:**
1. Import `findProductUnitByCode` from `units/repositories/product-unit.repository.ts` — **do not modify** unit module files.
2. Missing/inactive/archived unit → `INVALID_VARIANT_UNIT`.

**Acceptance criteria:**
- No writes to `product_units` collection.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Brand & Unit Management Backend. Blocks Tickets 9–11.

---

## Ticket 9 — Variant service: createProductVariant

**Ticket:** 9 — Variant service: createProductVariant

**Objective:** Create variant with SKU/barcode uniqueness and default-variant rules.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/services/product-variant.service.ts` (partial)

**API endpoints:**
- `POST /api/v1/admin/catalog/products/:productId/variants`

**DB fields:** Persist all create fields; defaults: `status: active`, `isVisible: true`, `isDefault: false` unless first variant or body sets default.
- Enforce **one** `isDefault: true` per `productId` (clear siblings when setting default).

**Implementation steps:**
1. Validate product (Ticket 7) and unit (Ticket 8).
2. Duplicate `sku` → `SKU_ALREADY_EXISTS`; duplicate `barcode` (when provided) → `BARCODE_ALREADY_EXISTS`.
3. If first variant for product, force `isDefault: true`; if `isDefault: true`, call `clearDefaultVariantForProduct`.
4. Set `createdBy` / `updatedBy` from actor.
5. Audit: `catalog.variant_created`.

**Acceptance criteria:**
- SKU uniqueness enforced globally among non-deleted variants.
- Default-variant rule satisfied after create.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 5–8.

---

## Ticket 10 — Variant service: listProductVariants

**Ticket:** 10 — Variant service: listProductVariants

**Objective:** Paginated list of variants for a product.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/services/product-variant.service.ts`

**API endpoints:**
- `GET /api/v1/admin/catalog/products/:productId/variants`

**DB fields:** Returns mapped list items; filters per Ticket 5.

**Implementation steps:**
1. Validate product exists (Ticket 7).
2. Delegate to `listProductVariantsByProductId`.
3. Return paginated `ProductVariantResponse[]`.

**Acceptance criteria:**
- Empty list allowed for product with no variants.
- Variants from other products never returned.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 9.

---

## Ticket 11 — Variant service: updateProductVariant

**Ticket:** 11 — Variant service: updateProductVariant

**Objective:** Update variant with SKU/barcode/default-variant handling.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/services/product-variant.service.ts`

**API endpoints:**
- `PATCH /api/v1/admin/catalog/products/:productId/variants/:variantId`

**DB fields:** Partial update; `updatedBy` set on success.

**Implementation steps:**
1. Resolve variant by `productId` + `variantId` → else `VARIANT_NOT_FOUND`.
2. Re-validate unit when `unit` changes.
3. SKU/barcode uniqueness with `excludeId`.
4. When `isDefault: true`, clear other defaults for same `productId`.
5. Audit: `catalog.variant_updated` with `changedFields` metadata.

**Acceptance criteria:**
- Cannot update variant belonging to another product.
- Default swap atomic at repository level (clear then update).

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 10.

---

## Ticket 12 — Variant service: deleteProductVariant

**Ticket:** 12 — Variant service: deleteProductVariant

**Objective:** Soft delete with default-variant safeguard.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/services/product-variant.service.ts` (complete)

**API endpoints:**
- `DELETE /api/v1/admin/catalog/products/:productId/variants/:variantId`

**DB fields:** Soft delete: `isDeleted`, `deletedAt`, `status: archived`, `updatedBy`.

**Implementation steps:**
1. Resolve variant → `VARIANT_NOT_FOUND` if missing/wrong product.
2. If deleting the only remaining **default** variant and other active variants exist without a replacement default → `DEFAULT_VARIANT_REQUIRED` (per schema default rule).
3. If deleting default but another variant exists, optionally auto-promote oldest active variant to default (only if PDF micro-task specifies; otherwise block with `DEFAULT_VARIANT_REQUIRED` until admin sets new default).
4. Audit: `catalog.variant_deleted`.

**Acceptance criteria:**
- Soft-deleted variant excluded from list.
- Product always has at most one default among active variants when any active variants remain.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 11.

---

## Ticket 13 — Product variant controller

**Ticket:** 13 — Product variant controller

**Objective:** HTTP handlers for four nested variant admin operations.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/controllers/product-variant.controller.ts`

**API endpoints:** Controllers for list, create, update, delete (no standalone GET-by-id per contract).

**DB fields:** Pass `req.user.userId` as actor for mutations.

**Implementation steps:**
1. Use `asyncHandler`, `sendPaginatedResponse`, `sendCreatedResponse`, `sendSuccessResponse`.
2. Read `productId` from `req.params`; pass to service.

**Acceptance criteria:**
- No direct Mongoose calls in controller.
- Standard API envelope.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 12.

---

## Ticket 14 — Global variant error codes and audit prep

**Ticket:** 14 — Global variant error codes and audit prep

**Objective:** Register variant error/audit keys in global constants **before** mounting nested routes.

**Files to create/update:**
- `backend/api/src/errors/error-codes.ts` — variant error keys from Ticket 1
- `backend/api/src/modules/audit/constants/audit-event.constants.ts` — variant audit events

**API endpoints:** None mounted in this ticket.

**DB fields:** None.

**Implementation steps:**
1. Add all five variant codes to `ERROR_CODES`.
2. Add three variant audit event constants.
3. Do **not** mount variant routes yet.

**Acceptance criteria:**
- Global registry includes all variant error codes from `docs/errors/catalog-error-codes.md`.
- No new permissions required (`catalog:read|create|update|delete` already cover variants).

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1. Blocks Tickets 15–16.

---

## Ticket 15 — Product variant admin routes (unmounted)

**Ticket:** 15 — Product variant admin routes (unmounted)

**Objective:** Express router for nested variant CRUD with permission middleware.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/routes/product-variant-admin.routes.ts`

**API endpoints:**
- `GET|POST /` (relative to `/:productId/variants`)
- `PATCH|DELETE /:variantId`

**DB fields:** None.

**Implementation steps:**
1. `catalog:read` on GET; `catalog:create` on POST; `catalog:update` on PATCH; `catalog:delete` on DELETE.
2. `validateRequest` for body/query/params (`productId`, `variantId`).
3. Export router; do **not** mount on product router until Ticket 16.

**Acceptance criteria:**
- Router mirrors `brand-admin.routes.ts` patterns.
- No top-level `/catalog/variants` mount (nested only).

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 6, 13, 14.

---

## Ticket 16 — Mount nested variant routes on product router

**Ticket:** 16 — Mount nested variant routes on product router

**Objective:** Nest variant router under product admin routes.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/routes/product-admin.routes.ts` — `router.use('/:productId/variants', productVariantAdminRoutes)`

**API endpoints:** Full paths:
- `GET|POST /api/v1/admin/catalog/products/:productId/variants`
- `PATCH|DELETE /api/v1/admin/catalog/products/:productId/variants/:variantId`

**DB fields:** None.

**Implementation steps:**
1. Import variant router; mount after product `/:productId` routes or with correct Express ordering so `variants` is not captured as `productId`.
2. Keep existing six product endpoints unchanged.
3. Do **not** modify `admin.routes.ts` (product mount already exists).

**Acceptance criteria:**
- Four nested variant endpoints reachable in route tree.
- Product CRUD/approval routes still work.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run build -w backend/api`

**Depends on:** Ticket 15.

---

## Ticket 17 — Variant error mapping and audit integration

**Ticket:** 17 — Variant error mapping and audit integration

**Objective:** Wire module error constants to `AppError` / global `ERROR_CODES`; finalize audit writes in variant service.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/services/product-variant.service.ts`
- `docs/errors/catalog-error-codes.md` — mark variant codes implemented

**API endpoints:** All variant mutation endpoints return documented error codes.

**DB fields:** None.

**Implementation steps:**
1. Use `ERROR_CODES[VARIANT_ERROR_CODES.*]` pattern from product module.
2. Ensure audit metadata excludes tokens, secrets, raw image binary.
3. Reuse `PRODUCT_NOT_FOUND` only when resolving parent product (document in contract).

**Acceptance criteria:**
- Stable `errorCode` values per `docs/errors/catalog-error-codes.md`.
- All three variant audit events fire on success paths.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 9–12, 14.

---

## Ticket 18 — OpenAPI, contract doc, and route registry

**Ticket:** 18 — OpenAPI, contract doc, and route registry

**Objective:** Document implemented variant admin APIs.

**Files to create/update:**
- `backend/api/src/docs/openapi/catalog.paths.ts` — add four nested variant paths
- `docs/contracts/product-variant-management-api.md` (create)
- `docs/contracts/backend-route-registry.md` — mark variant nested routes mounted
- `docs/contracts/catalog-admin-api-contract.md` — update variants section to implemented

**API endpoints:** Document all four endpoints with request/response field lists per PDF.

**DB fields:** Document `product_variants.*` fields used in contract doc.

**Implementation steps:**
1. OpenAPI placeholder responses (same pattern as product paths).
2. Registry lists nested variant routes under products.

**Acceptance criteria:**
- Contract matches validators and response mapper.
- OpenAPI document includes variant paths.

**Test commands:**
- `npm run build -w backend/api`
- Manual when API running: `curl -s http://localhost:5000/api/v1/public/openapi.json`

**Depends on:** Ticket 16.

---

## Ticket 19 — Variant service unit tests: create, SKU, unit, default

**Ticket:** 19 — Variant service unit tests: create, SKU, unit, default

**Objective:** Service tests for create/list and reference validation (mocked repositories).

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/services/product-variant.service.test.ts` (partial)

**API endpoints:** None.

**DB fields:** Fixtures for SKU, default flag, unit code, product parent.

**Implementation steps:**
1. Mock variant, product, unit repositories and `writeAuditLog`.
2. Tests: create success; duplicate SKU blocked; invalid unit → `INVALID_VARIANT_UNIT`; missing product → `PRODUCT_NOT_FOUND`; first variant forced default; second variant `isDefault: true` clears prior default.

**Acceptance criteria:**
- Tests pass without live MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/catalog/variants/services/product-variant.service.test.js` (until Ticket 26 adds `test:variants`)

**Depends on:** Ticket 12.

---

## Ticket 20 — Variant service unit tests: update, barcode, delete

**Ticket:** 20 — Variant service unit tests: update, barcode, delete

**Objective:** Service tests for update, barcode uniqueness, delete, and default-variant rules.

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/services/product-variant.service.test.ts` (complete)

**API endpoints:** None.

**DB fields:** `isDefault`, `barcode`, soft-delete flags.

**Implementation steps:**
1. Update sets `updatedBy`; duplicate barcode blocked; wrong `productId` → `VARIANT_NOT_FOUND`.
2. Delete default without replacement → `DEFAULT_VARIANT_REQUIRED`.
3. Soft delete success path.

**Acceptance criteria:**
- All service tests pass without MongoDB.

**Test commands:**
- Same as Ticket 19 (partial file until Ticket 26).

**Depends on:** Ticket 19.

---

## Ticket 21 — Product variant controller tests

**Ticket:** 21 — Product variant controller tests

**Objective:** Controller tests with mocked variant service (category module pattern).

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/controllers/product-variant.controller.test.ts`

**API endpoints:** Exercise handlers for list, create, update, delete success paths.

**DB fields:** None.

**Implementation steps:**
1. Mock service module; assert status codes 200/201 and `success: true`.
2. Four tests minimum (one per handler).

**Acceptance criteria:**
- Controller tests pass without HTTP server.

**Test commands:**
- `npm run test:variants -w backend/api` (after Ticket 26)

**Depends on:** Ticket 13, Tickets 19–20.

---

## Ticket 22 — Variant route integration tests (deferred)

**Ticket:** 22 — Variant route integration tests (deferred)

**Objective:** Optional route-level auth/permission tests; align with prior catalog modules (controller coverage if no harness).

**Files to create/update:**
- `backend/api/src/modules/catalog/variants/routes/product-variant-admin.routes.test.ts` (optional)

**API endpoints:** Test 401 unauthenticated, 403 missing `catalog:create`, success paths, duplicate SKU, `DEFAULT_VARIANT_REQUIRED`.

**DB fields:** None.

**Implementation steps:**
1. If project has supertest/router harness, implement PDF cases; otherwise document deferral in review with controller test coverage.

**Acceptance criteria:**
- Either route tests pass OR review documents deferral consistent with Category/Product modules.

**Test commands:**
- `npm run test:variants -w backend/api` (if route tests added)

**Depends on:** Ticket 16.

---

## Ticket 23 — Wire product delete dependency to variant repository

**Ticket:** 23 — Wire product delete dependency to variant repository

**Objective:** Replace product service variant-count stub with real `countActiveVariantsByProduct`.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.ts`

**API endpoints:** Affects `DELETE /api/v1/admin/catalog/products/:productId` behavior.

**DB fields:** Uses `product_variants.productId`.

**Implementation steps:**
1. Import and call `countActiveVariantsByProduct(productId)` from variant repository.
2. Block delete when count > 0 → existing `PRODUCT_HAS_ACTIVE_VARIANTS`.
3. Update product service delete test mock if needed.

**Acceptance criteria:**
- Product delete blocked when active variants exist.
- `npm run test:products` still passes.

**Test commands:**
- `npm run test:products -w backend/api`

**Depends on:** Ticket 5, Ticket 12.

---

## Ticket 24 — Wire unit delete dependency to variant repository

**Ticket:** 24 — Wire unit delete dependency to variant repository

**Objective:** Replace unit service variant-count stub with real `countVariantsUsingUnit`.

**Files to create/update:**
- `backend/api/src/modules/catalog/units/services/product-unit.service.ts`

**API endpoints:** Affects `DELETE /api/v1/admin/catalog/units/:unitId` behavior.

**DB fields:** Uses `product_variants.unit` matched to `product_units.code`.

**Implementation steps:**
1. Import and call `countVariantsUsingUnit(existing.code)`.
2. Block delete when count > 0 → `PRODUCT_UNIT_IN_USE`.
3. Update unit service delete test mock if needed.

**Acceptance criteria:**
- Unit delete blocked when variants reference unit code.
- `npm run test:units` still passes.

**Test commands:**
- `npm run test:units -w backend/api`

**Depends on:** Ticket 5, Ticket 12.

---

## Ticket 25 — Quality gates and npm test entrypoint

**Ticket:** 25 — Quality gates and npm test entrypoint

**Objective:** Add `test:variants` script and verify lint/typecheck; include variant tests in aggregate scripts.

**Files to create/update:**
- `backend/api/package.json` — `test:variants`; extend `test:services` / `test:controllers` if appropriate

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:variants`: variant service + controller tests (+ route tests if Ticket 22 done).
2. Run full quality gates for touched files.

**Acceptance criteria:**
- `npm run typecheck -w backend/api` passes.
- `npm run lint -w backend/api` passes.
- `npm run test:variants` passes.
- `npm run test:products` and `npm run test:units` pass after Tickets 23–24.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:variants -w backend/api`
- `npm run test:products -w backend/api`
- `npm run test:units -w backend/api`

**Depends on:** Tickets 19–24.

---

## Ticket 26 — Module review, handoff, and project-context closeout

**Ticket:** 26 — Module review, handoff, and project-context closeout

**Objective:** Close Product Variant Management Backend with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/product-variant-management-backend-review.md` (create)
- `docs/handoffs/product-variant-management-backend-complete.md` (create)
- `docs/reviews/phase-3-product-variant-management-backend-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`

**API endpoints:** Verify all four nested variant admin endpoints in review doc.

**DB fields:** Verify `product_variants.*` fields match schema + PDF default/SKU rules.

**Implementation steps:**
1. Record verification table: endpoints, permissions, audit, error codes, product/unit delete wiring.
2. Note deferred: route integration tests (Ticket 22) if applicable.
3. Set next module: **Store Foundation Backend** per PDF order (do not start Inventory/Media/frontend before store module sequence).

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- No Store, Inventory, or Media runtime code started.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 25

**Depends on:** Ticket 25.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5 → 6
              ↓
7 → 8 → 9 → 10 → 11 → 12 → 13
14 → 15 → 16 → 17 → 18
9–12 → 19 → 20 → 21
16 → 22 (optional)
5,12 → 23 → 25
5,12 → 24 → 25
19–25 → 26
```

**Critical path:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 25 → 26

**Cross-module closeout:** 23–24 after variant repository count methods (Ticket 5) and delete service (Ticket 12).
