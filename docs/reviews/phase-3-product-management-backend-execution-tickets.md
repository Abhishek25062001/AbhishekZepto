# Phase 3 Product Management Backend — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Product Management Backend  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 53–70  

**Architecture references:**  
`docs/database/catalog-product-schema.md`, `docs/contracts/catalog-admin-api-contract.md`, `docs/validation/catalog-validation-rules.md`, `docs/errors/catalog-error-codes.md`, `docs/security/catalog-permissions.md`, `docs/security/catalog-audit-logging.md`, `docs/database/catalog-index-plan.md`, `docs/architecture/catalog-backend-file-structure.md`

**Prerequisites (already in repo):**  
Catalog Architecture docs; Category Management Backend; Brand & Unit Management Backend (`categories`, `brands`, `product_units` mounted).

**Out of scope for this module:**  
Product Variant Management Backend (nested `/products/:productId/variants` routes), `tax_categories` admin CRUD, vendor/customer product routes, Media upload, `seed-catalog.ts`, `packages/shared` TypeScript files, Repository & Codebase Setup, Store Foundation.

**Execution order note:** Run **Ticket 15** (`catalog:approve` seeds + global error/audit prep) before **Tickets 16–17** (routes and mount).

**Status legend:** `PENDING` | `DONE`

**Module status:** Tickets 1–27 **DONE** (2026-05-18). Tickets 24–25 deferred (category/brand wiring) per execution constraint.

---

## Ticket 1 — Product module scaffold and constants

**Ticket:** 1 — Product module scaffold and constants

**Objective:** Create `products/` submodule folder layout and enum/error/audit constant files per PDF micro-tasks.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/` — `controllers/`, `routes/`, `services/`, `repositories/`, `models/`, `validators/`, `types/`, `constants/`, `utils/`
- `backend/api/src/modules/catalog/products/constants/product-type.constant.ts` — `simple`, `variant`, `bundle_placeholder`
- `backend/api/src/modules/catalog/products/constants/food-type.constant.ts` — `veg`, `non_veg`, `egg`, `not_applicable`
- `backend/api/src/modules/catalog/products/constants/product-approval-status.constant.ts` — `draft`, `pending_review`, `approved`, `rejected`, `archived`
- `backend/api/src/modules/catalog/products/constants/product-status.constant.ts` — `active`, `inactive`, `archived`
- `backend/api/src/modules/catalog/products/constants/product-error-codes.constant.ts`
- `backend/api/src/modules/catalog/products/constants/product-audit-events.constant.ts`

**API endpoints:** None.

**DB fields:** Constants only (no persistence yet).

**Implementation steps:**
1. Mirror `categories/` / `brands/` folder convention.
2. Product error codes per PDF page 64: `PRODUCT_NOT_FOUND`, `PRODUCT_SLUG_ALREADY_EXISTS`, `PRODUCT_NOT_APPROVED`, `PRODUCT_NOT_VISIBLE`, `INVALID_PRODUCT_STATUS`, `INVALID_PRODUCT_TYPE`, `INVALID_FOOD_TYPE`, `INVALID_PRODUCT_APPROVAL_STATUS`, `INVALID_PRODUCT_CATEGORY`, `INVALID_PRODUCT_SUBCATEGORY`, `INVALID_PRODUCT_BRAND`, `PRODUCT_HAS_ACTIVE_VARIANTS`, `REJECTION_REASON_REQUIRED`.
3. Audit events: `catalog.product_created`, `catalog.product_updated`, `catalog.product_deleted`, `catalog.product_approval_status_changed`.

**Acceptance criteria:**
- Folder tree exists; no models, routes, or services yet.
- All enums export typed values.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Brand & Unit Management Backend complete.

---

## Ticket 2 — Product Mongoose model and indexes

**Ticket:** 2 — Product Mongoose model and indexes

**Objective:** Implement `ProductModel` for collection `products` per schema doc and PDF approval metadata fields.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/models/product.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — confirm `PRODUCTS: 'products'` exists

**API endpoints:** None.

**DB fields:**
- Core: `name`, `slug`, `description`, `shortDescription`, `categoryId`, `subcategoryId`, `brandId`, `productType`, `foodType`, `taxCategoryId`, `hsnCode`, `searchKeywords`, `tags`, `defaultImageUrl`, `imageUrls`, `attributeSummary`, `isFeatured`, `isVisible`, `approvalStatus`, `status`, `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Approval metadata (PDF page 54): `approvedBy`, `approvedAt`, `rejectedBy`, `rejectedAt`, `rejectionReason`

**Implementation steps:**
1. Partial unique index: `{ slug: 1 }` where `isDeleted: false`.
2. Indexes per `catalog-index-plan.md`: `categoryId`, `subcategoryId`, `brandId`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `isDeleted`, `createdAt`.
3. Text index on `name`, `slug`, `searchKeywords` (or `searchKeywords` text per index plan).
4. Use `isDeleted` / `deletedAt` from `baseSchemaFields` without duplicating full `baseSchemaFields.status`.

**Acceptance criteria:**
- Model compiles; enums match constants from Ticket 1.
- No service or route code.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 3 — Product types, slug utility, and response mapper

**Ticket:** 3 — Product types, slug utility, and response mapper

**Objective:** TypeScript contracts and API mapping for product admin layer.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/types/product.types.ts`
- `backend/api/src/modules/catalog/products/utils/product-slug.util.ts`
- `backend/api/src/modules/catalog/products/utils/product-response.mapper.ts`

**API endpoints:** None (response shape only).

**DB fields:** Maps public fields; excludes `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `approvedBy`, `rejectedBy`, `__v` from normal list/detail response (approval metadata may be included on detail/approval responses per contract).

**Implementation steps:**
1. Types: `ProductStatus`, `ProductType`, `FoodType`, `ProductApprovalStatus`, `ProductDocument`, `CreateProductInput`, `UpdateProductInput`, `ProductListQuery`, `UpdateProductApprovalInput`, `ProductResponse`.
2. Slug util: URL-safe slug from product name (same pattern as category/brand).
3. Mapper: `_id` → `id`; stringify `categoryId`, `subcategoryId`, `brandId`, `taxCategoryId` when present.

**Acceptance criteria:**
- Types align with `catalog-validation-rules.md` product section.
- Mapper stable for CRUD responses.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 4 — Product repository: CRUD methods

**Ticket:** 4 — Product repository: CRUD methods

**Objective:** Data access for create, find, update, soft delete (soft-delete aware).

**Files to create/update:**
- `backend/api/src/modules/catalog/products/repositories/product.repository.ts` (partial)

**API endpoints:** None.

**DB fields:** Read/write all product fields from Ticket 2.

**Implementation steps:**
1. `createProduct`, `findProductById`, `findProductBySlug` (optional `excludeId`), `updateProductById`, `softDeleteProductById`.
2. Default filter: `isDeleted: false`.

**Acceptance criteria:**
- Invalid ObjectIds handled safely.
- No HTTP or cross-module logic.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 5 — Product repository: list and dependency count methods

**Ticket:** 5 — Product repository: list and dependency count methods

**Objective:** Paginated list filters and count helpers for category/brand delete guards.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/repositories/product.repository.ts` (complete)

**API endpoints:** None.

**DB fields:** Query filters: `categoryId`, `subcategoryId`, `brandId`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `foodType`, `search` (name/slug/keywords).

**Implementation steps:**
1. `listProducts(query)` with pagination, `sortBy`, `sortOrder`; default sort `createdAt` desc per PDF.
2. `countActiveProductsByCategory(categoryId)` — non-deleted products for category (and optionally subcategory scope per product module rules).
3. `countActiveProductsByBrand(brandId)` — non-deleted products referencing brand.

**Acceptance criteria:**
- List supports all PDF query params.
- Count methods return numbers for dependency checks.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 4.

---

## Ticket 6 — Product request validators (create, update, list)

**Ticket:** 6 — Product request validators (create, update, list)

**Objective:** Zod schemas for product CRUD bodies and list query.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/validators/product.validators.ts` (partial)

**API endpoints:** Validates:
- `POST /api/v1/admin/catalog/products`
- `PATCH /api/v1/admin/catalog/products/:productId`
- `GET /api/v1/admin/catalog/products`
- `GET /api/v1/admin/catalog/products/:productId` (params)

**DB fields:** Validates: `name`, `slug`, `description`, `shortDescription`, `categoryId`, `subcategoryId`, `brandId`, `productType`, `foodType`, `taxCategoryId`, `hsnCode`, `searchKeywords`, `tags`, `defaultImageUrl`, `imageUrls`, `attributeSummary`, `isFeatured`, `isVisible`, `status`. List: `categoryId`, `subcategoryId`, `brandId`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `foodType`, `search`, pagination, sort.

**Implementation steps:**
1. Reuse `paginationValidator`, `mongoObjectIdValidator`.
2. Do **not** accept `approvalStatus` on create/update body (dedicated approval endpoint only per validation doc).
3. `productId` params validator.

**Acceptance criteria:**
- Invalid payloads fail with `VALIDATION_ERROR`.
- No controllers yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 7 — Product approval-status validator

**Ticket:** 7 — Product approval-status validator

**Objective:** Zod schema for approval workflow endpoint.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/validators/product.validators.ts` — add `updateProductApprovalBodyValidator`

**API endpoints:** Validates:
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`

**DB fields:** `approvalStatus` (required enum); `rejectionReason` (required when `approvalStatus = rejected`).

**Implementation steps:**
1. Refine with `.superRefine` or equivalent: `rejectionReason` required iff rejected.
2. Allowed transitions validated in service (Ticket 12).

**Acceptance criteria:**
- Rejected without reason fails validation at middleware layer.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 6.

---

## Ticket 8 — Product reference validation helpers

**Ticket:** 8 — Product reference validation helpers

**Objective:** Shared service helpers to validate `categoryId`, `subcategoryId`, and `brandId` against existing catalog modules.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product-reference.service.ts` (or `utils/product-reference.util.ts`)

**API endpoints:** None (used by product service).

**DB fields:** Reads `categories` and `brands` via existing repositories.

**Implementation steps:**
1. Verify `categoryId` exists, active, visible, not deleted → else `INVALID_PRODUCT_CATEGORY`.
2. When `subcategoryId` provided: exists, `parentCategoryId` matches `categoryId` → else `INVALID_PRODUCT_SUBCATEGORY`.
3. When `brandId` provided: exists, active, visible, not deleted → else `INVALID_PRODUCT_BRAND`.
4. `taxCategoryId`: optional ObjectId validation only (no tax CRUD; placeholder OK).

**Acceptance criteria:**
- Helpers callable from create/update without circular imports.
- No routes.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 5–6; Category + Brand modules.

---

## Ticket 9 — Product service: create and getById

**Ticket:** 9 — Product service: create and getById

**Objective:** Product creation and detail read with slug rules and reference validation.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.ts` (partial)

**API endpoints:**
- `POST /api/v1/admin/catalog/products`
- `GET /api/v1/admin/catalog/products/:productId`

**DB fields:** Sets `approvalStatus: draft`, `status: active` defaults; writes `createdBy`, `updatedBy`.

**Implementation steps:**
1. Auto-generate/normalize slug; block duplicates → `PRODUCT_SLUG_ALREADY_EXISTS`.
2. Call reference helpers from Ticket 8.
3. `getProductById` → `PRODUCT_NOT_FOUND` when missing/deleted.
4. Audit on create: `catalog.product_created`.

**Acceptance criteria:**
- Create/get return `ProductResponse` via mapper.
- No list/update/delete/approval yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 5, 8.

---

## Ticket 10 — Product service: listProducts

**Ticket:** 10 — Product service: listProducts

**Objective:** Paginated product list with filters and metadata.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.ts`

**API endpoints:**
- `GET /api/v1/admin/catalog/products`

**DB fields:** Applies list filters from repository.

**Implementation steps:**
1. Return items + standard pagination object (`page`, `limit`, `total`, `totalPages`, `hasNextPage`, `hasPreviousPage`).
2. Default sort `createdAt` desc when not specified.

**Acceptance criteria:**
- List excludes soft-deleted products.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 9.

---

## Ticket 11 — Product service: updateProduct

**Ticket:** 11 — Product service: updateProduct

**Objective:** Product update with slug rules, reference re-validation, and approval reset on critical changes.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.ts`

**API endpoints:**
- `PATCH /api/v1/admin/catalog/products/:productId`

**DB fields:** Updates allowed fields; sets `updatedBy`.

**Implementation steps:**
1. Block update if not found.
2. Duplicate slug check on update.
3. Re-validate `categoryId`, `subcategoryId`, `brandId` when changed.
4. When critical fields change (`name`, `description`, `categoryId`, `subcategoryId`, `brandId`, `productType`, `foodType`, `defaultImageUrl`, `imageUrls`), set `approvalStatus` to `pending_review` and clear approval metadata (`approvedBy`, `approvedAt`, `rejectedBy`, `rejectedAt`, `rejectionReason`) per PDF.
5. Audit: `catalog.product_updated`.

**Acceptance criteria:**
- Critical field change triggers `pending_review`.
- `approvalStatus` not settable via this method.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 10.

---

## Ticket 12 — Product service: updateProductApprovalStatus

**Ticket:** 12 — Product service: updateProductApprovalStatus

**Objective:** Admin approval workflow endpoint logic.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.ts`

**API endpoints:**
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`

**DB fields:** On `approved`: set `approvedBy`, `approvedAt`; clear rejection fields. On `rejected`: set `rejectedBy`, `rejectedAt`, `rejectionReason`; clear approval fields. Support `pending_review`, `archived` per PDF.

**Implementation steps:**
1. `rejectionReason` required when rejected → `REJECTION_REASON_REQUIRED`.
2. Invalid enum/transition → `INVALID_PRODUCT_APPROVAL_STATUS`.
3. Permission enforced at route (`catalog:approve`); service assumes caller authorized.
4. Audit: `catalog.product_approval_status_changed` with `approvalStatus` in metadata.

**Acceptance criteria:**
- Approval and rejection metadata persisted correctly.
- No variant logic.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 11.

---

## Ticket 13 — Product service: deleteProduct

**Ticket:** 13 — Product service: deleteProduct

**Objective:** Soft delete with variant dependency stub.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.ts`

**API endpoints:**
- `DELETE /api/v1/admin/catalog/products/:productId`

**DB fields:** Soft delete: `isDeleted`, `deletedAt`, `status: archived`, `approvalStatus: archived`, `updatedBy`.

**Implementation steps:**
1. Stub `countActiveVariantsByProduct(productId)` returning `0` until Variant module → block with `PRODUCT_HAS_ACTIVE_VARIANTS` when > 0.
2. Audit: `catalog.product_deleted`.

**Acceptance criteria:**
- Delete blocked when stub variant count > 0.
- Soft-deleted product excluded from normal list/get.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 12.

---

## Ticket 14 — Product controller

**Ticket:** 14 — Product controller

**Objective:** HTTP handlers for all six product admin operations.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/controllers/product.controller.ts`

**API endpoints:** Controllers for list, create, get, update, delete, approval-status.

**DB fields:** Pass `req.user.userId` as actor for mutations.

**Implementation steps:**
1. Use `asyncHandler`, `sendPaginatedResponse`, `sendCreatedResponse`, `sendSuccessResponse`.
2. Parse list query from validated `req.query`.

**Acceptance criteria:**
- No direct Mongoose calls in controller.
- Standard API envelope.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 13.

---

## Ticket 15 — Catalog approve permission, global error codes, and audit prep

**Ticket:** 15 — Catalog approve permission, global error codes, and audit prep

**Objective:** Add `catalog:approve` to role seeds and register product error/audit keys globally **before** mounting routes.

**Files to create/update:**
- `backend/api/src/database/seeds/seed-roles.ts` — add `catalog:approve` for `operations_admin` (and verify `super_admin` wildcard)
- `backend/api/src/database/seeds/seed-role-permission-matrix.test.ts` — assert `catalog:approve` on `operations_admin`
- `backend/api/src/errors/error-codes.ts` — product error keys from Ticket 1
- `backend/api/src/modules/audit/constants/audit-event.constants.ts` — product audit events

**API endpoints:** None mounted in this ticket.

**DB fields:** None.

**Implementation steps:**
1. Confirm `AUTH_PERMISSION_ACTION.APPROVE` + `createPermissionCode('catalog', 'approve')` pattern.
2. Do **not** mount product routes yet.

**Acceptance criteria:**
- `operations_admin` seed includes `catalog:approve`.
- Seed matrix test passes.

**Test commands:**
- `npm run test:seed-matrix -w backend/api`
- `npm run typecheck -w backend/api`

**Depends on:** Category + Brand modules. Blocks Tickets 16–17.

---

## Ticket 16 — Product admin routes (unmounted)

**Ticket:** 16 — Product admin routes (unmounted)

**Objective:** Express router for product CRUD + approval with permission middleware.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/routes/product-admin.routes.ts`

**API endpoints:**
- `GET|POST /api/v1/admin/catalog/products`
- `GET|PATCH|DELETE /api/v1/admin/catalog/products/:productId`
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`

**DB fields:** None.

**Implementation steps:**
1. `catalog:read|create|update|delete` on CRUD routes.
2. `catalog:approve` on approval-status route only.
3. `validateRequest` for body/query/params.
4. Export router; do not mount in `admin.routes.ts` until Ticket 17.

**Acceptance criteria:**
- Router mirrors `brand-admin.routes.ts` patterns.
- Approval route uses `requirePermission(catalog:approve)`.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 7, 14, 15.

---

## Ticket 17 — Mount product admin routes

**Ticket:** 17 — Mount product admin routes

**Objective:** Mount product router under admin catalog prefix.

**Files to create/update:**
- `backend/api/src/routes/v1/admin.routes.ts`

**API endpoints:** Mount `/api/v1/admin/catalog/products` → `product-admin.routes.ts`.

**DB fields:** None.

**Implementation steps:**
1. Apply `authenticate()` + `requireRole` admin roles (same as categories/brands).
2. Verify no variant nested routes added.

**Acceptance criteria:**
- Six admin product endpoints reachable in route tree.
- Existing category/brand/unit routes unchanged.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run build -w backend/api`

**Depends on:** Ticket 16.

---

## Ticket 18 — Product error mapping and audit integration

**Ticket:** 18 — Product error mapping and audit integration

**Objective:** Wire module error constants to `AppError` / global `ERROR_CODES`; finalize audit writes in product service.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.ts`
- `docs/errors/catalog-error-codes.md` — mark product codes implemented

**API endpoints:** All product mutation endpoints return documented error codes.

**DB fields:** None.

**Implementation steps:**
1. Use `ERROR_CODES[PRODUCT_ERROR_CODES.*]` pattern from category/brand modules.
2. Ensure audit metadata excludes tokens, secrets, raw image binary.

**Acceptance criteria:**
- Stable `errorCode` values per `docs/errors/catalog-error-codes.md`.
- All four audit events fire on success paths.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 9–13, 15.

---

## Ticket 19 — OpenAPI, contract doc, and route registry

**Ticket:** 19 — OpenAPI, contract doc, and route registry

**Objective:** Document implemented product admin APIs.

**Files to create/update:**
- `backend/api/src/docs/openapi/catalog.paths.ts` — add product paths (6 operations)
- `docs/contracts/product-management-api.md` (create)
- `docs/contracts/backend-route-registry.md` — mark product routes mounted
- `docs/contracts/catalog-admin-api-contract.md` — update products section to implemented

**API endpoints:** Document all six endpoints with request/response field lists per PDF page 66.

**DB fields:** Document `products.*` fields used in contract doc.

**Implementation steps:**
1. OpenAPI placeholder responses (same pattern as category/brand paths).
2. Registry separates products (mounted) from variants (planned).

**Acceptance criteria:**
- Contract matches validators and response mapper.
- OpenAPI document includes product paths.

**Test commands:**
- `npm run build -w backend/api`
- Manual when API running: `curl -s http://localhost:5000/api/v1/public/openapi.json`

**Depends on:** Ticket 17.

---

## Ticket 20 — Product service unit tests: create, slug, references

**Ticket:** 20 — Product service unit tests: create, slug, references

**Objective:** Service tests for create/get and reference validation (mocked repositories).

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.test.ts` (partial)

**API endpoints:** None.

**DB fields:** Fixtures for slug, category, subcategory, brand validation.

**Implementation steps:**
1. Mock product, category, brand repositories and `writeAuditLog`.
2. Tests: create with `name`, `categoryId`, `productType`; slug auto-generate; slug normalize; duplicate slug blocked; missing/inactive category → `INVALID_PRODUCT_CATEGORY`; invalid subcategory parent → `INVALID_PRODUCT_SUBCATEGORY`; invalid brand → `INVALID_PRODUCT_BRAND`.

**Acceptance criteria:**
- Tests pass without live MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/catalog/products/services/product.service.test.js` (until Ticket 26 adds `test:products`)

**Depends on:** Ticket 13.

---

## Ticket 21 — Product service unit tests: update, approval, delete

**Ticket:** 21 — Product service unit tests: update, approval, delete

**Objective:** Service tests for update, approval workflow, and delete.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.test.ts` (complete)

**API endpoints:** None.

**DB fields:** Approval metadata: `approvedBy`, `approvedAt`, `rejectionReason`.

**Implementation steps:**
1. Update sets `updatedBy`; critical field change resets `approvalStatus` to `pending_review`.
2. Approve writes `approvedBy`/`approvedAt`; reject requires `rejectionReason`.
3. Soft delete; variant stub blocks delete when mocked count > 0.

**Acceptance criteria:**
- All service tests pass without MongoDB.

**Test commands:**
- Same as Ticket 20 (partial file until Ticket 26 script).

**Depends on:** Ticket 20.

---

## Ticket 22 — Product controller tests

**Ticket:** 22 — Product controller tests

**Objective:** Controller tests with mocked product service (category module pattern).

**Files to create/update:**
- `backend/api/src/modules/catalog/products/controllers/product.controller.test.ts`

**API endpoints:** Exercise handlers for list, create, get, update, delete, approval-status success paths.

**DB fields:** None.

**Implementation steps:**
1. Mock service module; assert status codes 200/201 and `success: true`.
2. Six tests minimum (one per handler).

**Acceptance criteria:**
- Controller tests pass without HTTP server.

**Test commands:**
- `npm run test:products -w backend/api` (after Ticket 26)

**Depends on:** Ticket 14, Tickets 20–21.

---

## Ticket 23 — Product route integration tests (deferred)

**Ticket:** 23 — Product route integration tests (deferred)

**Objective:** Optional route-level auth/permission tests per PDF pages 67–68; align with Category/Brand module (controller coverage if no harness).

**Files to create/update:**
- `backend/api/src/modules/catalog/products/routes/product-admin.routes.test.ts` (optional)

**API endpoints:** Test 401 unauthenticated, 403 missing `catalog:create` / `catalog:approve`, success paths, duplicate slug, `REJECTION_REASON_REQUIRED`.

**DB fields:** None.

**Implementation steps:**
1. If project has supertest/router harness, implement PDF cases; otherwise document deferral in review with controller test coverage.

**Acceptance criteria:**
- Either route tests pass OR review documents deferral consistent with prior catalog modules.

**Test commands:**
- `npm run test:products -w backend/api` (if route tests added)

**Depends on:** Ticket 17.

---

## Ticket 24 — Wire category delete dependency to product repository

**Ticket:** 24 — Wire category delete dependency to product repository

**Objective:** Replace category service product-count stub with real `countActiveProductsByCategory`.

**Files to create/update:**
- `backend/api/src/modules/catalog/categories/services/category.service.ts`

**API endpoints:** Affects `DELETE /api/v1/admin/catalog/categories/:categoryId` behavior.

**DB fields:** Uses `products.categoryId` (and subcategory rules as implemented in count method).

**Implementation steps:**
1. Import and call `countActiveProductsByCategory` from product repository.
2. Block delete when count > 0 → existing `CATEGORY_HAS_ACTIVE_PRODUCTS`.

**Acceptance criteria:**
- Category service test for product dependency still passes (update mock if needed).

**Test commands:**
- `npm run test:categories -w backend/api`

**Depends on:** Ticket 5, Ticket 13.

---

## Ticket 25 — Wire brand delete dependency to product repository

**Ticket:** 25 — Wire brand delete dependency to product repository

**Objective:** Replace brand service product-count stub with real `countActiveProductsByBrand`.

**Files to create/update:**
- `backend/api/src/modules/catalog/brands/services/brand.service.ts`

**API endpoints:** Affects `DELETE /api/v1/admin/catalog/brands/:brandId` behavior.

**DB fields:** Uses `products.brandId`.

**Implementation steps:**
1. Import and call `countActiveProductsByBrand`.
2. Block delete when count > 0 → `BRAND_HAS_ACTIVE_PRODUCTS`.

**Acceptance criteria:**
- Brand service tests still pass (update mocks if needed).

**Test commands:**
- `npm run test:brands -w backend/api`

**Depends on:** Ticket 5, Ticket 13.

---

## Ticket 26 — Quality gates and npm test entrypoint

**Ticket:** 26 — Quality gates and npm test entrypoint

**Objective:** Add `test:products` script and verify lint/typecheck; include product tests in aggregate scripts.

**Files to create/update:**
- `backend/api/package.json` — `test:products`; extend `test:services` / `test:controllers` if appropriate

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:products`: product service + controller tests (+ route tests if Ticket 23 done).
2. Run full quality gates for touched files.

**Acceptance criteria:**
- `npm run typecheck -w backend/api` passes.
- `npm run lint -w backend/api` passes.
- `npm run test:products` passes.
- `npm run test:categories` and `npm run test:brands` still pass after Tickets 24–25.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:products -w backend/api`
- `npm run test:categories -w backend/api`
- `npm run test:brands -w backend/api`

**Depends on:** Tickets 20–25.

---

## Ticket 27 — Module review, handoff, and project-context closeout

**Ticket:** 27 — Module review, handoff, and project-context closeout

**Objective:** Close Product Management Backend with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/product-management-backend-review.md` (create)
- `docs/handoffs/product-management-backend-complete.md` (create)
- `docs/reviews/phase-3-product-management-backend-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`

**API endpoints:** Verify all six product admin endpoints in review doc.

**DB fields:** Verify `products.*` and approval metadata fields match schema + PDF.

**Implementation steps:**
1. Record verification table: endpoints, permissions, audit, error codes, category/brand wiring.
2. Note pending: variant delete guard stub until Product Variant module.
3. Set next module: **Product Variant Management Backend** (do not start Store Foundation before variant per PDF order).

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- No Variant module routes or `tax_categories` CRUD started.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 26

**Depends on:** Ticket 26.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5 → 6 → 7
              ↓
8 → 9 → 10 → 11 → 12 → 13 → 14
15 → 16 → 17 → 18 → 19
9–13 → 20 → 21 → 22
17 → 23 (optional)
5,13 → 24 → 26
5,13 → 25 → 26
20–26 → 27
```

**Critical path:** 1 → 2 → 3 → 4 → 5 → 6 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 26 → 27

**Cross-module closeout:** 24–25 after product repository count methods (Ticket 5) and delete service (Ticket 13).
