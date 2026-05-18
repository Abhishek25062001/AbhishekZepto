# Phase 3 Brand & Unit Management Backend — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Brand & Unit Management Backend  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 35–52  
**Architecture references:** `docs/database/catalog-brand-schema.md`, `docs/database/catalog-unit-tax-schema.md`, `docs/contracts/catalog-admin-api-contract.md`, `docs/validation/catalog-validation-rules.md`, `docs/errors/catalog-error-codes.md`, `docs/security/catalog-permissions.md`, `docs/security/catalog-audit-logging.md`

**Prerequisites (already in repo):** Catalog Architecture docs; Category Management Backend (`/api/v1/admin/catalog/categories`).

**Out of scope for this module:** Product Management Backend, Variant Management, `tax_categories` admin CRUD, `seed-catalog.ts`, vendor/customer catalog routes, `packages/shared` TypeScript files, Repository & Codebase Setup.

**Execution order note:** Run **Ticket 15** (permissions / collection constants) before **Tickets 16–17** (routes and mount), same pattern as Category module.

**Status legend:** `PENDING` | `DONE`

**Module status:** Tickets 1–25 **DONE** (2026-05-18)

---

## Ticket 1 — Brand and unit module scaffold and constants

**Ticket:** 1 — Brand and unit module scaffold and constants

**Objective:** Create folder layout and shared constants for `brands` and `product_units` submodules under `catalog/`.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/` — `controllers/`, `routes/`, `services/`, `repositories/`, `models/`, `validators/`, `types/`, `constants/`, `utils/` (`.gitkeep` or empty placeholders as needed)
- `backend/api/src/modules/catalog/units/` — same subfolders
- `backend/api/src/modules/catalog/brands/constants/brand-status.constant.ts`
- `backend/api/src/modules/catalog/brands/constants/brand-error-codes.constant.ts`
- `backend/api/src/modules/catalog/brands/constants/brand-audit-events.constant.ts`
- `backend/api/src/modules/catalog/units/constants/product-unit-status.constant.ts`
- `backend/api/src/modules/catalog/units/constants/base-unit.constant.ts`
- `backend/api/src/modules/catalog/units/constants/product-unit-error-codes.constant.ts`
- `backend/api/src/modules/catalog/units/constants/product-unit-audit-events.constant.ts`

**API endpoints:** None.

**DB fields:** None (constants only). Document enums: `brands.status` → `active`, `inactive`, `archived`; `product_units.status` → same; `product_units.baseUnit` → `piece`, `pack`, `kg`, `g`, `litre`, `ml`, `dozen`.

**Implementation steps:**
1. Mirror `categories/` folder convention from `docs/architecture/catalog-backend-file-structure.md`.
2. Add brand status and error/audit constant files per `docs/errors/catalog-error-codes.md` and `docs/security/catalog-audit-logging.md`.
3. Add unit status, `baseUnit`, error, and audit constant files per PDF micro-tasks (include `PRODUCT_UNIT_IN_USE`, `INVALID_CONVERSION_FACTOR`, `INVALID_BASE_UNIT` where applicable).

**Acceptance criteria:**
- Both submodule trees exist with no business logic yet.
- Constants export typed values; no routes or models in this ticket.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Category Management Backend complete.

---

## Ticket 2 — Brand Mongoose model and indexes

**Ticket:** 2 — Brand Mongoose model and indexes

**Objective:** Implement `BrandModel` for collection `brands` per schema doc.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/models/brand.model.ts`

**API endpoints:** None.

**DB fields:**
- `name`, `slug`, `description`, `logoUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`, `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`

**Implementation steps:**
1. Use `COLLECTION_NAMES.BRANDS`.
2. Partial unique index: `{ slug: 1 }` where `isDeleted: false`.
3. Indexes: `status`, `isVisible`, `isFeatured` per `docs/database/catalog-index-plan.md`.
4. Reuse `isDeleted` / `deletedAt` pattern from category model (category-specific `status` enum, not full `baseSchemaFields.status` duplicate).

**Acceptance criteria:**
- Model compiles; slug uniqueness rule matches `catalog-brand-schema.md`.
- No service or route code.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 3 — Product unit Mongoose model, indexes, and collection name

**Ticket:** 3 — Product unit Mongoose model, indexes, and collection name

**Objective:** Implement `ProductUnitModel` for collection `product_units`.

**Files to create/update:**
- `backend/api/src/modules/catalog/units/models/product-unit.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — add `PRODUCT_UNITS: 'product_units'`

**API endpoints:** None.

**DB fields:**
- `code`, `name`, `baseUnit`, `conversionFactor`, `status`, `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`

**Implementation steps:**
1. Partial unique index: `{ code: 1 }` where `isDeleted: false`.
2. Indexes: `status`, `baseUnit`, `isDeleted`, `createdAt` per PDF micro-tasks.
3. `conversionFactor` required number with schema `min` validation (> 0 at service/validator layer).

**Acceptance criteria:**
- `PRODUCT_UNITS` registered in collection constants.
- Model matches `catalog-unit-tax-schema.md` (units only; no `tax_categories` model in this module).

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 4 — Brand types, slug utility, and response mapper

**Ticket:** 4 — Brand types, slug utility, and response mapper

**Objective:** TypeScript contracts and mapping for brand API layer.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/types/brand.types.ts`
- `backend/api/src/modules/catalog/brands/utils/brand-slug.util.ts`
- `backend/api/src/modules/catalog/brands/utils/brand-response.mapper.ts`

**API endpoints:** None (response shape only).

**DB fields:** Maps all brand fields; excludes `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `__v` from API response.

**Implementation steps:**
1. Define `BrandStatus`, `BrandDocument`, `CreateBrandInput`, `UpdateBrandInput`, `BrandListQuery`, `BrandResponse`.
2. Slug util: URL-safe slug from name (same approach as category slug util).
3. Mapper: `_id` → `id` string.

**Acceptance criteria:**
- Types align with `catalog-validation-rules.md` brand section.
- Mapper returns stable public shape for list/detail/create/update/delete.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 1–2.

---

## Ticket 5 — Product unit types, code utility, and response mapper

**Ticket:** 5 — Product unit types, code utility, and response mapper

**Objective:** TypeScript contracts and mapping for product unit API layer.

**Files to create/update:**
- `backend/api/src/modules/catalog/units/types/product-unit.types.ts`
- `backend/api/src/modules/catalog/units/utils/product-unit-code.util.ts`
- `backend/api/src/modules/catalog/units/utils/product-unit-response.mapper.ts`

**API endpoints:** None.

**DB fields:** Maps `code`, `name`, `baseUnit`, `conversionFactor`, `status`, timestamps; excludes internal soft-delete and actor fields from response.

**Implementation steps:**
1. Define `ProductUnitStatus`, `BaseUnit`, `CreateProductUnitInput`, `UpdateProductUnitInput`, `ProductUnitListQuery`, `ProductUnitResponse`.
2. Code util: normalize to lowercase stable format (PDF: lowercase / snake_case / hyphen-free).
3. Mapper: `_id` → `id`.

**Acceptance criteria:**
- `BaseUnit` enum matches Ticket 1 constants.
- No brand or product code in this ticket.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 1, 3.

---

## Ticket 6 — Brand repository

**Ticket:** 6 — Brand repository

**Objective:** Data access layer for brands (soft-delete aware).

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/repositories/brand.repository.ts`

**API endpoints:** None.

**DB fields:** Read/write all brand fields from Ticket 2.

**Implementation steps:**
1. `createBrand`, `findBrandById`, `findBrandBySlug` (optional `excludeId`), `updateBrandById`, `softDeleteBrandById`, `listBrands`.
2. Default filter: `isDeleted: false`.
3. List filters: `status`, `isVisible`, `isFeatured`, `search` (name/slug), pagination, `sortBy`, `sortOrder`.

**Acceptance criteria:**
- Repository methods return lean documents; invalid ObjectIds handled safely.
- No HTTP or permission logic.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 2, 4.

---

## Ticket 7 — Product unit repository

**Ticket:** 7 — Product unit repository

**Objective:** Data access layer for `product_units`.

**Files to create/update:**
- `backend/api/src/modules/catalog/units/repositories/product-unit.repository.ts`

**API endpoints:** None.

**DB fields:** All unit fields from Ticket 3.

**Implementation steps:**
1. `createProductUnit`, `findProductUnitById`, `findProductUnitByCode` (optional `excludeId`), `updateProductUnitById`, `softDeleteProductUnitById`, `listProductUnits`.
2. List filters: `status`, `baseUnit`, `search` (code/name), pagination, sort.

**Acceptance criteria:**
- Code lookup respects soft-delete filter.
- No HTTP layer.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 3, 5.

---

## Ticket 8 — Brand request validators

**Ticket:** 8 — Brand request validators

**Objective:** Zod schemas for brand admin endpoints.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/validators/brand.validators.ts`

**API endpoints:** Validates bodies/queries for:
- `POST /api/v1/admin/catalog/brands`
- `PATCH /api/v1/admin/catalog/brands/:brandId`
- `GET /api/v1/admin/catalog/brands`
- `GET /api/v1/admin/catalog/brands/:brandId` (params)

**DB fields:** Validates input fields per `catalog-validation-rules.md`: `name`, `slug`, `description`, `logoUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`; list: `page`, `limit`, `search`, `status`, `isVisible`, `isFeatured`, `sortBy`, `sortOrder`.

**Implementation steps:**
1. Reuse `paginationValidator`, `mongoObjectIdValidator` from `common.validators.ts`.
2. Strict object schemas for create/update/list/params.

**Acceptance criteria:**
- Invalid payloads fail with `VALIDATION_ERROR` via `validateRequest` middleware.
- No controllers yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 4.

---

## Ticket 9 — Product unit request validators

**Ticket:** 9 — Product unit request validators

**Objective:** Zod schemas for product unit admin endpoints.

**Files to create/update:**
- `backend/api/src/modules/catalog/units/validators/product-unit.validators.ts`

**API endpoints:** Validates:
- `POST /api/v1/admin/catalog/units`
- `PATCH /api/v1/admin/catalog/units/:unitId`
- `GET /api/v1/admin/catalog/units`
- `GET /api/v1/admin/catalog/units/:unitId`

**DB fields:** `code`, `name`, `baseUnit`, `conversionFactor`, `status`; list filters: `status`, `baseUnit`, `search`, pagination, sort.

**Implementation steps:**
1. `conversionFactor` must be number > 0 (`INVALID_CONVERSION_FACTOR` at service layer).
2. `baseUnit` enum from constants.

**Acceptance criteria:**
- Create requires `code`, `name`, `baseUnit`, `conversionFactor`.
- Update allows partial fields.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 5.

---

## Ticket 10 — Brand service: create and getById

**Ticket:** 10 — Brand service: create and getById

**Objective:** Brand creation and detail read with slug rules and audit hook placeholder.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/services/brand.service.ts` (partial)

**API endpoints:** Business logic for:
- `POST /api/v1/admin/catalog/brands`
- `GET /api/v1/admin/catalog/brands/:brandId`

**DB fields:** Writes `createdBy`, `updatedBy`; sets defaults for `isFeatured`, `isVisible`, `status`.

**Implementation steps:**
1. Auto-generate/normalize slug; block duplicates → `BRAND_SLUG_ALREADY_EXISTS`.
2. `getBrandById` → `BRAND_NOT_FOUND` when missing/deleted.
3. Stub `countActiveProductsByBrand(brandId)` returning `0` until Product module (document TODO).

**Acceptance criteria:**
- Create/get methods return `BrandResponse` via mapper.
- No list/update/delete yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 4, 6, 8.

---

## Ticket 11 — Brand service: list, update, and delete

**Ticket:** 11 — Brand service: list, update, and delete

**Objective:** Complete brand service CRUD behaviors.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/services/brand.service.ts` (complete)

**API endpoints:**
- `GET /api/v1/admin/catalog/brands`
- `PATCH /api/v1/admin/catalog/brands/:brandId`
- `DELETE /api/v1/admin/catalog/brands/:brandId`

**DB fields:** Soft delete sets `isDeleted`, `deletedAt`, `status: archived`, `updatedBy`.

**Implementation steps:**
1. Paginated `listBrands` with standard pagination metadata.
2. Update: duplicate slug check; preserve slug when only name changes without explicit slug (match category pattern).
3. Delete: block if stub product count > 0 → `BRAND_HAS_ACTIVE_PRODUCTS`.
4. Write audit logs: `catalog.brand_created`, `catalog.brand_updated`, `catalog.brand_deleted`.

**Acceptance criteria:**
- All five brand operations implemented in service.
- Audit metadata excludes tokens/secrets/raw binary.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 10.

---

## Ticket 12 — Product unit service (full CRUD)

**Ticket:** 12 — Product unit service (full CRUD)

**Objective:** Full product unit business logic.

**Files to create/update:**
- `backend/api/src/modules/catalog/units/services/product-unit.service.ts`

**API endpoints:**
- `POST|GET /api/v1/admin/catalog/units`
- `GET|PATCH|DELETE /api/v1/admin/catalog/units/:unitId`

**DB fields:** Normalize `code` on create/update; soft delete sets archived status.

**Implementation steps:**
1. Duplicate code → `PRODUCT_UNIT_CODE_ALREADY_EXISTS`.
2. `conversionFactor <= 0` → `INVALID_CONVERSION_FACTOR`.
3. Stub `countVariantsUsingUnit(code)` returning `0` until Variant module → delete blocked with `PRODUCT_UNIT_IN_USE` when > 0.
4. Audit: `catalog.unit_created`, `catalog.unit_updated`, `catalog.unit_deleted` (per PDF micro-tasks).

**Acceptance criteria:**
- All five unit operations implemented.
- Invalid `baseUnit` → `INVALID_BASE_UNIT` when applicable.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 5, 7, 9.

---

## Ticket 13 — Brand controller

**Ticket:** 13 — Brand controller

**Objective:** HTTP handlers for brand admin APIs using standard response helpers.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/controllers/brand.controller.ts`

**API endpoints:** Wire controllers for all five brand routes (service calls only).

**DB fields:** Pass `req.user.userId` as actor for mutations.

**Implementation steps:**
1. Use `asyncHandler`, `sendPaginatedResponse`, `sendCreatedResponse`, `sendSuccessResponse`.
2. Parse list query from validated `req.query`.

**Acceptance criteria:**
- Controllers contain no direct Mongoose calls.
- Standard API envelope for success/error.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 11.

---

## Ticket 14 — Product unit controller

**Ticket:** 14 — Product unit controller

**Objective:** HTTP handlers for product unit admin APIs.

**Files to create/update:**
- `backend/api/src/modules/catalog/units/controllers/product-unit.controller.ts`

**API endpoints:** All five unit admin endpoints.

**DB fields:** Actor id on create/update/delete.

**Implementation steps:** Mirror brand controller patterns.

**Acceptance criteria:**
- No Mongoose in controller.
- Consistent response format.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 12.

---

## Ticket 15 — Catalog permissions and collection constants verification

**Ticket:** 15 — Catalog permissions and collection constants verification

**Objective:** Confirm `catalog:*` permissions and role seeds are sufficient before mounting brand/unit routes. Add any missing global registrations.

**Files to create/update:**
- `backend/api/src/database/seeds/seed-roles.ts` — verify only (update if `operations_admin` missing any `catalog:*` action)
- `backend/api/src/database/seeds/seed-role-permission-matrix.test.ts` — assert catalog permissions for `operations_admin`
- `backend/api/src/database/constants/collection-names.constants.ts` — confirm `BRANDS`, `PRODUCT_UNITS` (Ticket 3 may have added `PRODUCT_UNITS`)
- `backend/api/src/errors/error-codes.ts` — add brand/unit error code keys (prep for Ticket 17)
- `backend/api/src/modules/audit/constants/audit-event.constants.ts` — add brand/unit audit event keys (prep for Ticket 17)

**API endpoints:** None mounted in this ticket.

**DB fields:** None.

**Implementation steps:**
1. Reuse existing `catalog:read|create|update|delete` from Category module (no new permission namespace).
2. Do **not** mount routes yet.
3. Extend global `ERROR_CODES` and `AUDIT_EVENTS` with brand/unit entries from PDF micro-tasks.

**Acceptance criteria:**
- `operations_admin` and `super_admin` can pass permission checks for planned brand/unit routes.
- Seed matrix test passes.

**Test commands:**
- `npm run test:seed-matrix -w backend/api`
- `npm run typecheck -w backend/api`

**Depends on:** Category Management Backend (Ticket 11 permissions). Blocks Tickets 16–17.

---

## Ticket 16 — Brand admin routes

**Ticket:** 16 — Brand admin routes

**Objective:** Express router for brand CRUD with auth and permission middleware.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/routes/brand-admin.routes.ts`

**API endpoints:**
- `GET|POST /api/v1/admin/catalog/brands`
- `GET|PATCH|DELETE /api/v1/admin/catalog/brands/:brandId`

**DB fields:** None.

**Implementation steps:**
1. `requirePermission` with `catalog:read|create|update|delete`.
2. `validateRequest` for body/query/params.
3. Do not mount in `admin.routes.ts` until Ticket 17 (or mount both in 17).

**Acceptance criteria:**
- Router exports default; mirrors `category-admin.routes.ts` patterns.
- Authentication applied at mount level in Ticket 17.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 8, 13, 15.

---

## Ticket 17 — Product unit admin routes and admin mount

**Ticket:** 17 — Product unit admin routes and admin mount

**Objective:** Unit router plus mount brand and unit routers under admin catalog prefix.

**Files to create/update:**
- `backend/api/src/modules/catalog/units/routes/product-unit-admin.routes.ts`
- `backend/api/src/routes/v1/admin.routes.ts`

**API endpoints:** Mount:
- `/api/v1/admin/catalog/brands` → `brand-admin.routes.ts`
- `/api/v1/admin/catalog/units` → `product-unit-admin.routes.ts`

**DB fields:** None.

**Implementation steps:**
1. Apply `authenticate()` + `requireRole` admin roles (same as categories).
2. Permission middleware on each route.
3. Verify no Product or Variant module routes added.

**Acceptance criteria:**
- All ten admin endpoints reachable in route tree.
- Category routes unchanged.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run build -w backend/api`

**Depends on:** Tickets 14–16.

---

## Ticket 18 — Brand and unit error mapping and audit integration

**Ticket:** 18 — Brand and unit error mapping and audit integration

**Objective:** Wire module error constants to `AppError` / global `ERROR_CODES`; finalize audit writes in services.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/services/brand.service.ts` — use global error codes
- `backend/api/src/modules/catalog/units/services/product-unit.service.ts` — use global error codes
- `backend/api/src/errors/error-codes.ts` — brand/unit codes if not done in Ticket 15
- `backend/api/src/modules/audit/constants/audit-event.constants.ts` — brand/unit events if not done in Ticket 15
- `docs/errors/catalog-error-codes.md` — mark brand/unit codes as implemented

**API endpoints:** All brand and unit mutation endpoints return documented error codes.

**DB fields:** None.

**Implementation steps:**
1. Map: `BRAND_NOT_FOUND`, `BRAND_SLUG_ALREADY_EXISTS`, `BRAND_HAS_ACTIVE_PRODUCTS`, `INVALID_BRAND_STATUS`.
2. Map: `PRODUCT_UNIT_NOT_FOUND`, `PRODUCT_UNIT_CODE_ALREADY_EXISTS`, `PRODUCT_UNIT_IN_USE`, `INVALID_PRODUCT_UNIT_STATUS`, `INVALID_BASE_UNIT`, `INVALID_CONVERSION_FACTOR`.
3. Ensure `writeAuditLog` uses `AUDIT_EVENTS` or module constants consistently.

**Acceptance criteria:**
- Error responses use stable `errorCode` values from `docs/errors/catalog-error-codes.md`.
- Audit events fire on successful create/update/delete.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 11–12, 15.

---

## Ticket 19 — OpenAPI, contract docs, and route registry

**Ticket:** 19 — OpenAPI, contract docs, and route registry

**Objective:** Document implemented brand and unit APIs.

**Files to create/update:**
- `backend/api/src/docs/openapi/catalog.paths.ts` — add brand and unit paths
- `docs/contracts/brand-management-api.md` (create)
- `docs/contracts/product-unit-management-api.md` (create)
- `docs/contracts/backend-route-registry.md` — mark brand/unit routes mounted
- `docs/contracts/catalog-admin-api-contract.md` — update brands/units status to implemented

**API endpoints:** Document all ten endpoints with request/response field lists per PDF page 48.

**DB fields:** Document `brands.*` and `product_units.*` field usage in contract docs.

**Implementation steps:**
1. OpenAPI placeholder responses (same pattern as category paths).
2. Registry lists mounted routes separately from still-planned product routes.

**Acceptance criteria:**
- Contract docs match actual validators and response mappers.
- OpenAPI document includes new paths.

**Test commands:**
- `npm run build -w backend/api`
- `curl -s http://localhost:5000/api/v1/public/openapi.json` (manual, when API running)

**Depends on:** Ticket 17.

---

## Ticket 20 — Brand service unit tests

**Ticket:** 20 — Brand service unit tests

**Objective:** Service-layer tests with mocked repository (and mocked audit).

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/services/brand.service.test.ts`

**API endpoints:** None (unit tests).

**DB fields:** Covered via fixtures: slug, soft delete, `createdBy`/`updatedBy`.

**Implementation steps:**
1. Tests: create with required `name`; slug auto-generate; slug normalize; duplicate slug blocked; update sets `updatedBy`; soft delete; delete blocked when mocked product count > 0.
2. Mock `writeAuditLog` to avoid Mongo timeout (category test pattern).

**Acceptance criteria:**
- All tests pass without live MongoDB.

**Test commands:**
- `npm run test:brands -w backend/api` (after Ticket 23 adds script; until then: `npm run build -w backend/api && node --test dist/modules/catalog/brands/services/brand.service.test.js`)

**Depends on:** Ticket 11.

---

## Ticket 21 — Product unit service unit tests

**Ticket:** 21 — Product unit service unit tests

**Objective:** Service tests for product unit CRUD rules.

**Files to create/update:**
- `backend/api/src/modules/catalog/units/services/product-unit.service.test.ts`

**API endpoints:** None.

**DB fields:** `code`, `conversionFactor`, soft delete flags.

**Implementation steps:**
1. Tests: create success; code normalization; duplicate code; `conversionFactor <= 0`; update `updatedBy`; soft delete; delete blocked when mocked variant usage > 0.
2. Mock audit writes.

**Acceptance criteria:**
- Tests pass without MongoDB.

**Test commands:**
- `npm run test:units -w backend/api` (after Ticket 23; or direct `node --test` on dist file)

**Depends on:** Ticket 12.

---

## Ticket 22 — Brand and product unit controller tests

**Ticket:** 22 — Brand and product unit controller tests

**Objective:** Controller tests with mocked services (category module pattern).

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/controllers/brand.controller.test.ts`
- `backend/api/src/modules/catalog/units/controllers/product-unit.controller.test.ts`

**API endpoints:** Exercise handlers for list/create/get/update/delete success paths.

**DB fields:** None.

**Implementation steps:**
1. Mock service module; assert status codes 200/201 and `success: true`.
2. Five tests per controller minimum.

**Acceptance criteria:**
- Controller tests pass in CI without HTTP server.

**Test commands:**
- `npm run test:brands -w backend/api`
- `npm run test:units -w backend/api`

**Depends on:** Tickets 13–14, 20–21.

---

## Ticket 23 — Brand and unit route integration tests (optional per PDF)

**Ticket:** 23 — Brand and unit route integration tests

**Objective:** Route-level auth and permission tests per PDF micro-tasks (pages 50–51).

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/routes/brand-admin.routes.test.ts`
- `backend/api/src/modules/catalog/units/routes/product-unit-admin.routes.test.ts`

**API endpoints:** Test 401 unauthenticated, 403 missing `catalog:create`, success paths, soft-deleted excluded from list, duplicate slug/code errors.

**DB fields:** None (mocked or in-memory DB if project pattern exists).

**Implementation steps:**
1. Follow existing auth route test patterns in `backend/api/src/modules/auth/routes/`.
2. If no established pattern, minimal supertest-style tests against router only.

**Acceptance criteria:**
- Unauthenticated and forbidden cases covered.
- Duplicate slug returns `BRAND_SLUG_ALREADY_EXISTS`; invalid conversion returns `INVALID_CONVERSION_FACTOR`.

**Test commands:**
- `npm run test:brands -w backend/api`
- `npm run test:units -w backend/api`

**Depends on:** Ticket 17.

---

## Ticket 24 — Quality gates and npm test entrypoints

**Ticket:** 24 — Quality gates and npm test entrypoints

**Objective:** Add focused test scripts and ensure lint/typecheck pass for module.

**Files to create/update:**
- `backend/api/package.json` — `test:brands`, `test:units`; include in `test:services` / `test:controllers` if appropriate

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:brands`: brand service + controller (+ route tests if Ticket 23 done).
2. `test:units`: unit service + controller (+ route tests).
3. Run full backend quality gates for touched files.

**Acceptance criteria:**
- `npm run typecheck -w backend/api` passes.
- `npm run lint -w backend/api` passes.
- `npm run test:brands` and `npm run test:units` pass.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:brands -w backend/api`
- `npm run test:units -w backend/api`

**Depends on:** Tickets 20–23.

---

## Ticket 25 — Module review, handoff, and project-context closeout

**Ticket:** 25 — Module review, handoff, and project-context closeout

**Objective:** Close Brand & Unit Management Backend module with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/brand-unit-management-backend-review.md` (create)
- `docs/handoffs/brand-unit-management-backend-complete.md` (create)
- `docs/reviews/phase-3-brand-unit-management-backend-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`

**API endpoints:** Verify all ten endpoints listed in review doc.

**DB fields:** Verify `brands.*` and `product_units.*` persisted fields match schema docs.

**Implementation steps:**
1. Record verification table for endpoints, permissions, audit events, error codes.
2. Note pending dependencies: product count for brand delete, variant count for unit delete (stubs until Product/Variant modules).
3. Set next module: **Product Management Backend** only (do not start Variant before Product per sequence).

**Acceptance criteria:**
- Handoff states module complete for static/code verification.
- No Product module code started.
- Tracker all DONE.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:brands -w backend/api`
- `npm run test:units -w backend/api`

**Depends on:** Ticket 24.

---

## Dependency graph (summary)

```text
1 → 2,3 → 4,5 → 6,7 → 8,9 → 10 → 11 → 13 → 16
              └→ 12 → 14 → 17
15 → 16,17 (before mount)
11,12 → 18 → 19
11 → 20; 12 → 21; 13,14 → 22; 17 → 23
20–23 → 24 → 25
```

**Critical path:** 1 → 2 → 4 → 6 → 8 → 10 → 11 → 15 → 16 → 17 → 24 → 25 (brand), parallel unit path: 1 → 3 → 5 → 7 → 9 → 12 → 14 → 17.
