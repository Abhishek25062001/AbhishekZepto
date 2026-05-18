# Phase 3 Store Product Mapping Backend — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Store Product Mapping Backend  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 105–127  

**Architecture references:**  
`docs/architecture/catalog-architecture.md`, `docs/database/catalog-product-schema.md`, `docs/database/catalog-product-variant-schema.md`, `docs/database/store-schema.md`, `project-context/DATABASE_STANDARDS.md`, `docs/contracts/role-permission-contract.md`, `docs/security/audit-log-fields.md`, `docs/standards/api-conventions.md`

**Prerequisites (already in repo):**  
Phase 2 auth/RBAC/tenant scope; Catalog modules complete (`products`, `product_variants` mounted); Store Foundation Backend complete (`cities`, `service_areas`, `stores` mounted).

**Out of scope for this module:**  
Inventory Foundation (`inventory_stocks`, stock quantity), Inventory Locking, Media upload, customer store-product read APIs, frontend UIs, Order Management, `packages/shared` TypeScript files, Repository & Codebase Setup, global catalog mutation from vendor routes.

**Execution order notes:**
- Run **Ticket 13** (`store_products:*` permissions + global error/audit prep) before **Tickets 15–17** (routes and mount).
- Run **Ticket 14** (controllers) before **Tickets 15–16** (routes).
- Run **Ticket 8** (reference validation) before **Tickets 9–12** (services).
- Run **Ticket 22** (product/variant delete wiring) after **Ticket 6** count repository methods.
- Register **Ticket 23** seeds after stores and catalog variant seeds exist.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-18)

---

## Ticket 1 — Store product mapping schema and contract docs

**Ticket:** 1 — Store product mapping schema and contract docs

**Objective:** Add planning docs for `store_products` collection and module contracts (no runtime code).

**Files to create/update:**
- `docs/database/store-product-schema.md` (create)
- `docs/validation/store-product-mapping-validation-rules.md` (create)
- `docs/security/store-product-mapping-permissions.md` (create)
- `docs/errors/store-product-mapping-error-codes.md` (create)

**API endpoints:** Document planned admin and vendor routes only (no implementation).

**DB fields:** Document `store_products.*` per PDF: `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `sku`, `storeSku`, `mrp`, `sellingPrice`, `discountType`, `discountValue`, `finalPrice`, `taxCategoryId`, `isAvailable`, `isVisible`, `isFeatured`, `isPriceLocked`, `priceUpdatedAt`, `availabilityUpdatedAt`, `status`, soft-delete and audit fields.

**Implementation steps:**
1. Schema doc: partial unique `{ storeId, variantId }` where `isDeleted: false`; partial unique `{ storeId, storeSku }` where `isDeleted: false` and `storeSku` exists.
2. Enums: `status` (`active`, `inactive`, `archived`); `discountType` (`none`, `flat`, `percentage`).
3. Permissions doc: `store_products:read|create|update|delete|bulk_update`.
4. Error codes doc: all codes from PDF page 119 (`STORE_PRODUCT_NOT_FOUND`, `STORE_PRODUCT_ALREADY_MAPPED`, etc.).
5. Validation rules: `sellingPrice <= mrp`; `discountValue` required for `flat`/`percentage`; percentage `<= 100`; vendor price blocked when `isPriceLocked`.

**Acceptance criteria:**
- Docs match PDF micro-tasks; no Mongoose or route files created.

**Test commands:**
- `test -f docs/database/store-product-schema.md && test -f docs/errors/store-product-mapping-error-codes.md && echo PASS`

**Depends on:** Store Foundation Backend complete.

---

## Ticket 2 — Store product module scaffold and constants

**Ticket:** 2 — Store product module scaffold and constants

**Objective:** Create `store-products/` folder layout and enum/error/audit constant files.

**Files to create/update:**
- `backend/api/src/modules/store-products/` — `controllers/`, `routes/`, `services/`, `repositories/`, `models/`, `validators/`, `types/`, `constants/`, `utils/`
- `backend/api/src/modules/store-products/constants/store-product-status.constant.ts` — `active`, `inactive`, `archived`
- `backend/api/src/modules/store-products/constants/store-product-discount-type.constant.ts` — `none`, `flat`, `percentage`
- `backend/api/src/modules/store-products/constants/store-product-error-codes.constant.ts`
- `backend/api/src/modules/store-products/constants/store-product-audit-events.constant.ts`

**API endpoints:** None.

**DB fields:** Constants only.

**Implementation steps:**
1. Error codes per PDF: `STORE_PRODUCT_NOT_FOUND`, `STORE_PRODUCT_ALREADY_MAPPED`, `STORE_PRODUCT_SKU_ALREADY_EXISTS`, `INVALID_STORE_PRODUCT_STORE`, `INVALID_STORE_PRODUCT_PRODUCT`, `INVALID_STORE_PRODUCT_VARIANT`, `STORE_PRODUCT_VARIANT_MISMATCH`, `STORE_PRODUCT_PRICE_INVALID`, `STORE_PRODUCT_FINAL_PRICE_INVALID`, `STORE_PRODUCT_PRICE_LOCKED`, `STORE_PRODUCT_SCOPE_DENIED`, `STORE_PRODUCT_BULK_VALIDATION_FAILED`.
2. Audit events per PDF: `store_product.created`, `store_product.updated`, `store_product.deleted`, `store_product.bulk_mapped`, `store_product.bulk_price_updated`, `store_product.bulk_visibility_updated`, `store_product.vendor_price_updated`, `store_product.vendor_availability_updated`.

**Acceptance criteria:**
- Folder tree exists; no models, routes, or services yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 3 — Store product Mongoose model and indexes

**Ticket:** 3 — Store product Mongoose model and indexes

**Objective:** Implement `StoreProductModel` for collection `store_products`.

**Files to create/update:**
- `backend/api/src/modules/store-products/models/store-product.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — add `STORE_PRODUCTS: 'store_products'`

**API endpoints:** None.

**DB fields:** All fields from Ticket 1; ObjectId refs for `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `taxCategoryId`.

**Implementation steps:**
1. Partial unique: `{ storeId: 1, variantId: 1 }` where `isDeleted: false`.
2. Partial unique: `{ storeId: 1, storeSku: 1 }` where `isDeleted: false` and `storeSku` exists.
3. Indexes per PDF: `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `status`, `isAvailable`, `isVisible`, `isFeatured`, `sku`, `createdAt`.
4. Defaults on create (service layer): `discountType: none`, `discountValue: 0`, `isAvailable: true`, `isVisible: true`, `status: active`.

**Acceptance criteria:**
- Model compiles; enums match Ticket 2.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 4 — Store product types and price utility

**Ticket:** 4 — Store product types and price utility

**Objective:** TypeScript contracts and `calculateFinalPrice` utility per PDF.

**Files to create/update:**
- `backend/api/src/modules/store-products/types/store-product.types.ts`
- `backend/api/src/modules/store-products/utils/store-product-price.util.ts`

**API endpoints:** None.

**DB fields:** Types for `StoreProductStatus`, `StoreProductDiscountType`, `CreateStoreProductInput`, `UpdateStoreProductInput`, `StoreProductListQuery`, `BulkMapStoreProductsInput`, `BulkUpdateStoreProductPriceInput`, `BulkUpdateStoreProductVisibilityInput`.

**Implementation steps:**
1. `calculateFinalPrice(mrp, sellingPrice, discountType, discountValue)`: return `sellingPrice` when `none`; subtract flat; apply percentage; block final price `< 0` or `> mrp`.
2. List query filters: `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `status`, `isAvailable`, `isVisible`, `isFeatured`, `search`, pagination, sort.

**Acceptance criteria:**
- Price util unit-testable in isolation (covered in Ticket 19).

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 5 — Store product response mapper

**Ticket:** 5 — Store product response mapper

**Objective:** Map DB documents to API response DTOs; exclude internal fields.

**Files to create/update:**
- `backend/api/src/modules/store-products/utils/store-product-response.mapper.ts`

**API endpoints:** None (mapper used by services/controllers).

**DB fields:** Response includes: `id`, `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `sku`, `storeSku`, `mrp`, `sellingPrice`, `discountType`, `discountValue`, `finalPrice`, `taxCategoryId`, `isAvailable`, `isVisible`, `isFeatured`, `isPriceLocked`, `priceUpdatedAt`, `availabilityUpdatedAt`, `status`, `createdAt`, `updatedAt`. Exclude: `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `__v`.

**Implementation steps:**
1. Mirror `store-response.mapper.ts` / `product-variant-response.mapper.ts` patterns.

**Acceptance criteria:**
- Mapper compiles; no service logic.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 4.

---

## Ticket 6 — Store product repository (CRUD, list, counts)

**Ticket:** 6 — Store product repository (CRUD, list, counts)

**Objective:** Data access layer for store product mappings.

**Files to create/update:**
- `backend/api/src/modules/store-products/repositories/store-product.repository.ts`

**API endpoints:** None.

**DB fields:** CRUD on all `store_products.*` fields; soft delete sets `isDeleted`, `deletedAt`, `status: archived`, `isAvailable: false`, `isVisible: false`.

**Implementation steps:**
1. Methods: `createStoreProduct`, `findStoreProductById`, `findStoreProductByStoreAndVariant`, `findStoreProductByStoreSku`, `updateStoreProductById`, `softDeleteStoreProductById`, `listStoreProducts` (filters from Ticket 4).
2. Count helpers: `countMappedVariantsByStore`, `countStoreProductsByVariant`, `countStoreProductsByProduct`.
3. Exclude soft-deleted records by default in find/list.

**Acceptance criteria:**
- No service or route code in this ticket.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 7 — Store product repository (bulk operations)

**Ticket:** 7 — Store product repository (bulk operations)

**Objective:** Bulk create/update repository methods for admin bulk endpoints.

**Files to create/update:**
- `backend/api/src/modules/store-products/repositories/store-product.repository.ts` (extend)

**API endpoints:** None.

**DB fields:** Bulk price/visibility updates set `priceUpdatedAt` / `availabilityUpdatedAt` when applicable.

**Implementation steps:**
1. `bulkCreateStoreProducts(records)`.
2. `bulkUpdateStoreProductPrices(storeProductIds, pricePayload, actorId)`.
3. `bulkUpdateStoreProductVisibility(storeProductIds, visibilityPayload, actorId)`.

**Acceptance criteria:**
- Bulk methods compile; used by service in Ticket 11.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 6.

---

## Ticket 8 — Catalog and store reference validation service

**Ticket:** 8 — Catalog and store reference validation service

**Objective:** Centralize validation of store, product, and variant eligibility for mapping.

**Files to create/update:**
- `backend/api/src/modules/store-products/services/store-product-reference.service.ts`

**API endpoints:** None.

**DB fields:** Read-only checks against `stores`, `products`, `product_variants` collections.

**Implementation steps:**
1. Verify `storeId` exists, active, not deleted → `INVALID_STORE_PRODUCT_STORE`.
2. Verify `productId` exists, approved, active, visible, not deleted → `INVALID_STORE_PRODUCT_PRODUCT`.
3. Verify `variantId` exists, belongs to `productId`, active, visible, not deleted → `INVALID_STORE_PRODUCT_VARIANT` / `STORE_PRODUCT_VARIANT_MISMATCH`.
4. Expose helper to copy denormalized fields: `vendorId`, `cityId`, `categoryId`, `brandId`, `sku`, `taxCategoryId` from store/product/variant records.

**Acceptance criteria:**
- No HTTP handlers; reusable from create/update/bulk services.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 6; Store Foundation + Product modules (read-only).

---

## Ticket 9 — Admin and vendor Zod validators

**Ticket:** 9 — Admin and vendor Zod validators

**Objective:** Request validation for all store product admin and vendor endpoints.

**Files to create/update:**
- `backend/api/src/modules/store-products/validators/store-product.validators.ts`

**API endpoints:** Validators for:
- `POST /api/v1/admin/store-products`
- `PATCH /api/v1/admin/store-products/:storeProductId`
- `GET /api/v1/admin/store-products` (query)
- `POST /api/v1/admin/store-products/bulk-map`
- `PATCH /api/v1/admin/store-products/bulk-price`
- `PATCH /api/v1/admin/store-products/bulk-visibility`
- `GET /api/v1/vendor/store-products` (query)
- `PATCH /api/v1/vendor/store-products/:storeProductId/availability`
- `PATCH /api/v1/vendor/store-products/:storeProductId/price`

**DB fields:** Validated request fields per PDF pages 109–111, 118.

**Implementation steps:**
1. Create body: `storeId`, `productId`, `variantId` required; `mrp`, `sellingPrice` > 0; `sellingPrice <= mrp`; discount rules; optional flags.
2. Bulk map: `storeId`, `items[]`, `duplicateMode` enum (`fail`, `skip`, `replace`).
3. Bulk price/visibility: `storeProductIds` required array.
4. Params: `storeProductId` as ObjectId.

**Acceptance criteria:**
- Validators export Zod schemas used by routes; no controllers yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 10 — Store product service: create, get, list

**Ticket:** 10 — Store product service: create, get, list

**Objective:** Admin create/read business logic with reference validation and price calculation.

**Files to create/update:**
- `backend/api/src/modules/store-products/services/store-product.service.ts` (partial)

**API endpoints:**
- `POST /api/v1/admin/store-products`
- `GET /api/v1/admin/store-products`
- `GET /api/v1/admin/store-products/:storeProductId`

**DB fields:** Set `finalPrice` via price util; `priceUpdatedAt` / `availabilityUpdatedAt` on create; `createdBy` / `updatedBy` from actor.

**Implementation steps:**
1. `createStoreProduct`: reference validation (Ticket 8); block duplicate `storeId+variantId` → `STORE_PRODUCT_ALREADY_MAPPED`; block duplicate `storeSku` per store → `STORE_PRODUCT_SKU_ALREADY_EXISTS`; copy denormalized fields; defaults per PDF.
2. `getStoreProductById` → `STORE_PRODUCT_NOT_FOUND` when missing/deleted.
3. `listStoreProducts` with pagination; default sort `createdAt desc`.
4. Audit: `store_product.created` on create.

**Acceptance criteria:**
- No route or controller code in this ticket.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 6–8.

---

## Ticket 11 — Store product service: update and delete

**Ticket:** 11 — Store product service: update and delete

**Objective:** Admin update/delete with price recalculation and soft-delete rules.

**Files to create/update:**
- `backend/api/src/modules/store-products/services/store-product.service.ts` (extend)

**API endpoints:**
- `PATCH /api/v1/admin/store-products/:storeProductId`
- `DELETE /api/v1/admin/store-products/:storeProductId`

**DB fields:** Update recalculates `finalPrice` when price fields change; sets `priceUpdatedAt` / `availabilityUpdatedAt` on respective changes. Delete: `isDeleted: true`, `isAvailable: false`, `isVisible: false`, `status: archived`.

**Implementation steps:**
1. Block duplicate `storeSku` on update when changed.
2. Recalculate `finalPrice` when `mrp`, `sellingPrice`, `discountType`, or `discountValue` change.
3. Audit: `store_product.updated`, `store_product.deleted`.

**Acceptance criteria:**
- Soft-deleted mappings excluded from list/get.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 10.

---

## Ticket 12 — Store product service: bulk map, bulk price, bulk visibility

**Ticket:** 12 — Store product service: bulk map, bulk price, bulk visibility

**Objective:** Admin bulk operations with `duplicateMode` and per-item result metadata.

**Files to create/update:**
- `backend/api/src/modules/store-products/services/store-product.service.ts` (complete admin methods)

**API endpoints:**
- `POST /api/v1/admin/store-products/bulk-map`
- `PATCH /api/v1/admin/store-products/bulk-price`
- `PATCH /api/v1/admin/store-products/bulk-visibility`

**DB fields:** Bulk map creates multiple `store_products` rows; bulk updates touch `finalPrice`, timestamps.

**Implementation steps:**
1. `bulkMapStoreProducts`: validate store once; validate all product/variant IDs; apply `duplicateMode` (`fail` | `skip` | `replace`); return `created`, `skipped`, `failed`, `errors[]`.
2. `bulkUpdateStoreProductPrices`: recalculate `finalPrice`; update `priceUpdatedAt`.
3. `bulkUpdateStoreProductVisibility`: update `availabilityUpdatedAt`.
4. Audit: `store_product.bulk_mapped`, `store_product.bulk_price_updated`, `store_product.bulk_visibility_updated`.

**Acceptance criteria:**
- Bulk validation failure surfaces `STORE_PRODUCT_BULK_VALIDATION_FAILED` when appropriate.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 7, 10.

---

## Ticket 13 — Vendor store product service methods

**Ticket:** 13 — Vendor store product service methods

**Objective:** Vendor-scoped list/detail and limited update (availability, price) per PDF.

**Files to create/update:**
- `backend/api/src/modules/store-products/services/store-product-vendor.service.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/store-products`
- `GET /api/v1/vendor/store-products/:storeProductId`
- `PATCH /api/v1/vendor/store-products/:storeProductId/availability`
- `PATCH /api/v1/vendor/store-products/:storeProductId/price`

**DB fields:** Vendor updates respect `isPriceLocked`; scope via `vendorId` / `storeId` from auth context.

**Implementation steps:**
1. List/detail filtered to authenticated vendor/store scope → `STORE_PRODUCT_SCOPE_DENIED` when out of scope.
2. Availability update: optional `isAvailable`, `isVisible`, `status`; set `availabilityUpdatedAt`.
3. Price update: block when `isPriceLocked` → `STORE_PRODUCT_PRICE_LOCKED`; recalculate `finalPrice`; set `priceUpdatedAt`.
4. Audit: `store_product.vendor_availability_updated`, `store_product.vendor_price_updated`.
5. Do **not** mutate global `products` or `product_variants` records.

**Acceptance criteria:**
- Vendor service does not expose admin bulk or create/delete.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 6, 8, 11.

---

## Ticket 14 — Store product permissions, global error codes, and audit prep

**Ticket:** 14 — Store product permissions, global error codes, and audit prep

**Objective:** Register `store_products` permissions and global error/audit keys **before** mounting routes.

**Files to create/update:**
- `backend/api/src/modules/auth/constants/auth-permission.constants.ts` — add `STORE_PRODUCTS: 'store_products'` resource (or equivalent naming aligned with permission contract)
- `backend/api/src/database/seeds/seed-roles.ts` — `store_products:*` for `operations_admin`; vendor roles: `store_products:read`, `store_products:update` per PDF
- `backend/api/src/database/seeds/seed-role-permission-matrix.test.ts`
- `backend/api/src/errors/error-codes.ts` — all store product error keys from Ticket 2
- `backend/api/src/modules/audit/constants/audit-event.constants.ts` — store product audit events
- `docs/errors/store-product-mapping-error-codes.md` — mark planned→implemented
- `docs/security/store-product-mapping-permissions.md` — mark implemented

**API endpoints:** None mounted in this ticket.

**DB fields:** None.

**Implementation steps:**
1. Permission codes: `store_products:read|create|update|delete|bulk_update`.
2. `operations_admin`: full admin CRUD + bulk; `vendor_owner`, `store_manager`, `store_staff`: read + update per PDF; `super_admin`: `*:*` unchanged.
3. Do **not** mount store product routes yet.

**Acceptance criteria:**
- `npm run test:seed-matrix` passes.

**Test commands:**
- `npm run test:seed-matrix -w backend/api`
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2. Blocks Tickets 15–17.

---

## Ticket 15 — Store product admin and vendor controllers

**Ticket:** 15 — Store product admin and vendor controllers

**Objective:** HTTP handlers for admin CRUD/bulk and vendor read/update operations.

**Files to create/update:**
- `backend/api/src/modules/store-products/controllers/store-product.controller.ts`
- `backend/api/src/modules/store-products/controllers/store-product-vendor.controller.ts`

**API endpoints:** Controllers for all thirteen operations (8 admin + 5 vendor).

**DB fields:** Pass `req.user.userId` as actor for mutations.

**Implementation steps:**
1. Use `asyncHandler`, `sendPaginatedResponse`, `sendCreatedResponse`, `sendSuccessResponse`.
2. Bulk map response includes created/skipped/failed counts per PDF.

**Acceptance criteria:**
- No direct Mongoose calls in controllers.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 10–13.

---

## Ticket 16 — Store product admin routes (unmounted)

**Ticket:** 16 — Store product admin routes (unmounted)

**Objective:** Express admin router with permission middleware.

**Files to create/update:**
- `backend/api/src/modules/store-products/routes/store-product-admin.routes.ts`

**API endpoints:**
- `POST|GET /api/v1/admin/store-products`
- `GET|PATCH|DELETE /api/v1/admin/store-products/:storeProductId`
- `POST /api/v1/admin/store-products/bulk-map`
- `PATCH /api/v1/admin/store-products/bulk-price`
- `PATCH /api/v1/admin/store-products/bulk-visibility`

**DB fields:** None.

**Implementation steps:**
1. Permissions: `store_products:create` (POST), `read` (GET), `update` (PATCH), `delete` (DELETE), `bulk_update` (bulk routes).
2. `validateRequest` on body/query/params; export router only.

**Acceptance criteria:**
- Router mirrors `store-admin.routes.ts` / `brand-admin.routes.ts` patterns; not mounted in `admin.routes.ts`.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 9, 14–15.

---

## Ticket 17 — Store product vendor routes (unmounted)

**Ticket:** 17 — Store product vendor routes (unmounted)

**Objective:** Express vendor router with auth, tenant scope, and permissions.

**Files to create/update:**
- `backend/api/src/modules/store-products/routes/store-product-vendor.routes.ts`

**API endpoints:**
- `GET /api/v1/vendor/store-products`
- `GET /api/v1/vendor/store-products/:storeProductId`
- `PATCH /api/v1/vendor/store-products/:storeProductId/availability`
- `PATCH /api/v1/vendor/store-products/:storeProductId/price`

**DB fields:** None.

**Implementation steps:**
1. Apply `authenticate()` + vendor role gates + Phase 2 vendor/store scope middleware.
2. Permissions: `store_products:read` (GET), `store_products:update` (PATCH).
3. Export router only; do not mount yet.

**Acceptance criteria:**
- Vendor routes do not expose admin bulk or delete.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 9, 13–15.

---

## Ticket 18 — Mount admin and vendor store product routes

**Ticket:** 18 — Mount admin and vendor store product routes

**Objective:** Mount store product routers under admin and vendor API prefixes.

**Files to create/update:**
- `backend/api/src/routes/v1/admin.routes.ts`
- `backend/api/src/routes/v1/vendor.routes.ts`

**API endpoints:**
- `/api/v1/admin/store-products` → `store-product-admin.routes.ts`
- `/api/v1/vendor/store-products` → `store-product-vendor.routes.ts`

**DB fields:** None.

**Implementation steps:**
1. Admin: `authenticate()` + `requireRole` admin roles (same as stores/catalog).
2. Vendor: `authenticate()` + vendor roles + existing scope middleware.
3. Do not modify unrelated route mounts.

**Acceptance criteria:**
- Thirteen endpoints reachable in route tree.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run build -w backend/api`

**Depends on:** Tickets 16–17.

---

## Ticket 19 — OpenAPI, contract docs, and route registry

**Ticket:** 19 — OpenAPI, contract docs, and route registry

**Objective:** Document implemented store product admin and vendor APIs.

**Files to create/update:**
- `backend/api/src/docs/openapi/store-product.paths.ts` (create)
- `backend/api/src/docs/openapi/index.ts` — merge `storeProductPaths`
- `docs/contracts/store-product-mapping-api.md` (create)
- `docs/contracts/backend-route-registry.md`

**API endpoints:** Document all thirteen endpoints with request/response field lists per PDF pages 121–122.

**DB fields:** Document field usage in contract doc.

**Implementation steps:**
1. OpenAPI placeholder responses (catalog/store foundation pattern).
2. Registry lists admin and vendor store product routes separately.

**Acceptance criteria:**
- Contracts match validators and response mapper.

**Test commands:**
- `npm run build -w backend/api`

**Depends on:** Ticket 18.

---

## Ticket 20 — Store product service unit tests

**Ticket:** 20 — Store product service unit tests

**Objective:** Service tests for mapping CRUD, price rules, bulk, and vendor guards (mocked repositories).

**Files to create/update:**
- `backend/api/src/modules/store-products/services/store-product.service.test.ts`
- `backend/api/src/modules/store-products/services/store-product-vendor.service.test.ts`
- `backend/api/src/modules/store-products/utils/store-product-price.util.test.ts` (optional co-located tests)

**API endpoints:** None.

**DB fields:** Fixtures for store/product/variant refs, price/discount, soft delete.

**Implementation steps:**
1. Tests per PDF pages 122–123: create success; invalid store/product/variant; duplicate mapping/SKU; final price for `none`/`flat`/`percentage`; `sellingPrice > mrp` blocked; percentage > 100 blocked; timestamp updates on price/availability change; soft delete flags; vendor price lock; vendor scope denied.
2. Mock `writeAuditLog` and repositories.

**Acceptance criteria:**
- Tests pass without live MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/store-products/services/store-product.service.test.js dist/modules/store-products/services/store-product-vendor.service.test.js`

**Depends on:** Tickets 10–13.

---

## Ticket 21 — Store product controller tests

**Ticket:** 21 — Store product controller tests

**Objective:** Controller tests with mocked services (admin + vendor handlers).

**Files to create/update:**
- `backend/api/src/modules/store-products/controllers/store-product.controller.test.ts`
- `backend/api/src/modules/store-products/controllers/store-product-vendor.controller.test.ts`

**API endpoints:** Exercise success paths for all thirteen handlers.

**DB fields:** None.

**Implementation steps:**
1. Mock service modules; assert 200/201 and `success: true`.
2. Minimum one test per handler.

**Acceptance criteria:**
- Controller tests pass without HTTP server.

**Test commands:**
- `npm run test:store-products -w backend/api` (after Ticket 24)

**Depends on:** Ticket 15, Ticket 20.

---

## Ticket 22 — Route integration tests (deferred)

**Ticket:** 22 — Route integration tests (deferred)

**Objective:** Optional route-level auth/permission tests per PDF pages 123–125; align with catalog/store modules (controller coverage if no harness).

**Files to create/update:**
- `backend/api/src/modules/store-products/routes/store-product-admin.routes.test.ts` (optional)
- `backend/api/src/modules/store-products/routes/store-product-vendor.routes.test.ts` (optional)

**API endpoints:** Test 401, 403 missing `store_products:create`, success paths, duplicate mapping/SKU, vendor scope denied, `STORE_PRODUCT_PRICE_LOCKED`.

**DB fields:** None.

**Implementation steps:**
1. If supertest/router harness exists, implement PDF cases; else document deferral in review.

**Acceptance criteria:**
- Either route tests pass OR review documents deferral.

**Test commands:**
- `npm run test:store-products -w backend/api` (if route tests added)

**Depends on:** Ticket 18.

---

## Ticket 23 — Product and variant delete dependency wiring

**Ticket:** 23 — Product and variant delete dependency wiring

**Objective:** Connect catalog delete guards to store product counts (PDF pages 125–126).

**Files to create/update:**
- `backend/api/src/modules/catalog/products/services/product.service.ts` — use `countStoreProductsByProduct`
- `backend/api/src/modules/catalog/variants/services/product-variant.service.ts` — use `countStoreProductsByVariant`

**API endpoints:** None new (existing DELETE endpoints gain guard).

**DB fields:** None new.

**Implementation steps:**
1. Block product soft delete when `countStoreProductsByProduct(productId) > 0` (add/use error code from catalog or store-product module per existing pattern).
2. Block variant soft delete when `countStoreProductsByVariant(variantId) > 0`.
3. Minimal diff — only delete-guard wiring; no other catalog refactors.

**Acceptance criteria:**
- `npm run test:products` and `npm run test:variants` still pass.

**Test commands:**
- `npm run test:products -w backend/api`
- `npm run test:variants -w backend/api`

**Depends on:** Ticket 6 count methods.

---

## Ticket 24 — Store product seed script

**Ticket:** 24 — Store product seed script

**Objective:** Idempotent dev seeds mapping seeded store to seeded catalog variants (PDF page 126).

**Files to create/update:**
- `backend/api/src/database/seeds/seed-store-products.ts` (create)
- `backend/api/src/database/seeds/seed-runner.ts` — register after `seed-stores` and catalog seeds

**API endpoints:** None.

**DB fields:** Seed mappings for Delhi/Dwarka store (`STORE-000001`) and existing catalog variants; idempotent by `storeId+variantId`.

**Implementation steps:**
1. Skip gracefully in dry-run with planned upsert log.
2. Depend on `seed-stores` and catalog product/variant seeds (or minimal inline upsert if catalog seeds not yet present — document in seed file).

**Acceptance criteria:**
- `npm run seed:dry -w backend/api` logs planned store-product upserts without error.

**Test commands:**
- `npm run seed:dry -w backend/api`

**Depends on:** Tickets 3–6; Store Foundation seeds; catalog products/variants available.

---

## Ticket 25 — Quality gates and npm test entrypoints

**Ticket:** 25 — Quality gates and npm test entrypoints

**Objective:** Add test scripts and verify lint/typecheck for store product module.

**Files to create/update:**
- `backend/api/package.json` — `test:store-products` (aggregate service + controller tests); extend `test:services` / `test:controllers` if applicable

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:store-products`: all store product service and controller tests.
2. Run full quality gates.

**Acceptance criteria:**
- `npm run typecheck`, `npm run lint`, `npm run test:store-products` pass.
- Existing `npm run test:store-foundation`, `test:products`, `test:variants` still pass.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:store-products -w backend/api`
- `npm run test:seed-matrix -w backend/api`

**Depends on:** Tickets 20–21, 23–24.

---

## Ticket 26 — Module review, handoff, and project-context closeout

**Ticket:** 26 — Module review, handoff, and project-context closeout

**Objective:** Close Store Product Mapping Backend with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/store-product-mapping-backend-review.md` (create)
- `docs/handoffs/store-product-mapping-backend-complete.md` (create)
- `docs/reviews/phase-3-store-product-mapping-backend-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`

**API endpoints:** Verify all thirteen admin + vendor endpoints in review doc.

**DB fields:** Verify `store_products.*` match schema doc + PDF.

**Implementation steps:**
1. Record verification table: endpoints, permissions, audit, error codes, delete guards, bulk operations.
2. Note pending: stock quantity in Inventory Foundation; route tests if deferred (Ticket 22).
3. Set next module: **Inventory Foundation Backend** per PDF order (do not start Media/frontend).

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- No Inventory runtime code started.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 25

**Depends on:** Ticket 25.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5
3 → 6 → 7
6 → 8 → 10 → 11 → 12
2 → 9
9,10,11,12 → 15
8,10–13 → 15
9,14 → 16 → 17
14 → 16,17 → 18 → 19
10–13 → 20 → 25
15,20 → 21 → 25
18 → 22 (optional)
6 → 23
3–6,24 deps → 24 → 25
25 → 26
```

**Critical path:** 1 → 2 → 3 → 6 → 8 → 10 → 14 → 16 → 18 → 25 → 26  
(Parallel: 4–5 mappers; 11–12 bulk/vendor; 23 delete wiring after repo counts)

**Cross-module order:** Store + catalog master data before store product mapping; mapping before inventory stock records.
