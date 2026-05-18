# Phase 3 Inventory Foundation Backend — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Inventory Foundation Backend  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 128–156  

**Architecture references:**  
`docs/database/store-product-schema.md`, `docs/architecture/catalog-architecture.md`, `project-context/DATABASE_STANDARDS.md`, `docs/contracts/role-permission-contract.md`, `docs/security/audit-log-fields.md`, `docs/standards/api-conventions.md`

**Prerequisites (already in repo):**  
Phase 2 auth/RBAC/tenant scope; Catalog modules (`products`, `product_variants`); Store Foundation (`cities`, `service_areas`, `stores`); Store Product Mapping Backend (`store_products` mounted with admin + vendor APIs).

**Out of scope for this module:**  
Inventory Locking Preparation (`inventory_locks`, Redis reservation, `reservation_*` movement execution), Media upload, customer inventory read APIs, frontend UIs, Order Management checkout integration, `packages/shared` TypeScript files, Repository & Codebase Setup, implementing `reservation_created` / `reservation_released` / `reservation_confirmed` adjustment flows (enum values documented only; runtime in Module 9).

**Execution order notes:**
- Run **Ticket 15** (`inventory:*` permissions + `ADJUST` action + global error/audit prep) before **Tickets 18–20** (routes and mount).
- Run **Tickets 16–17** (controllers) before **Tickets 18–19** (route files).
- Run **Ticket 10** (movement service) before **Tickets 12–13** (stock adjust/create write movements).
- Run **Ticket 7** (stock repository) before **Ticket 11** (reference validation uses store-product repo; stock service uses both repos).
- Register **Ticket 27** seeds after `seed-store-products`.
- Use co-located `*.test.ts` files (repo convention), not PDF `__tests__/` paths.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-18)

---

## Ticket 1 — Inventory foundation schema and contract docs

**Ticket:** 1 — Inventory foundation schema and contract docs

**Objective:** Add planning docs for `inventory_stocks` and `inventory_movements` (no runtime code).

**Files to create/update:**
- `docs/database/inventory-stock-schema.md` (create)
- `docs/database/inventory-movement-schema.md` (create)
- `docs/validation/inventory-foundation-validation-rules.md` (create)
- `docs/security/inventory-foundation-permissions.md` (create)
- `docs/errors/inventory-foundation-error-codes.md` (create)

**API endpoints:** Document planned admin and vendor routes only (no implementation).

**DB fields:** Document `inventory_stocks.*`: `storeId`, `vendorId`, `cityId`, `storeProductId`, `productId`, `variantId`, `sku`, `storeSku`, `availableQuantity`, `reservedQuantity`, `damagedQuantity`, `expiredQuantity`, `totalQuantity`, `lowStockThreshold`, `reorderLevel`, `isLowStock`, `isOutOfStock`, `lastStockUpdatedAt`, `lastStockMovementId`, `status`, soft-delete and audit fields. Document `inventory_movements.*`: `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `movementType`, `quantity`, previous/new quantity snapshots, `reason`, `referenceType`, `referenceId`, `notes`, `metadata`, `createdBy`, `createdAt`.

**Implementation steps:**
1. Stock schema: partial unique `{ storeId, storeProductId }` where `isDeleted: false`.
2. Stock `status` enum: `active`, `inactive`, `archived`.
3. Movement `movementType` enum: `stock_in`, `stock_out`, `manual_adjustment`, `reservation_created`, `reservation_released`, `reservation_confirmed`, `damaged`, `expired`, `correction` (note reservation types deferred to Locking module for HTTP adjust APIs).
4. Movement `referenceType` enum: `manual`, `order`, `cart`, `return`, `system`, `seed`, `import`.
5. Permissions doc: `inventory:read|create|update|delete|adjust|bulk_update`.
6. Error codes doc: all codes from PDF page 147.
7. Validation rules: quantities `>= 0`; `totalQuantity = available + reserved + damaged + expired`; admin/vendor allowed `movementType` sets; `adjustmentMode` for manual adjustment (`increase`, `decrease`, `set`).

**Acceptance criteria:**
- Docs match PDF micro-tasks; no Mongoose or route files created.

**Test commands:**
- `test -f docs/database/inventory-stock-schema.md && test -f docs/database/inventory-movement-schema.md && test -f docs/errors/inventory-foundation-error-codes.md && echo PASS`

**Depends on:** Store Product Mapping Backend complete.

---

## Ticket 2 — Inventory module scaffold and constants

**Ticket:** 2 — Inventory module scaffold and constants

**Objective:** Create `inventory/` and `inventory/movements/` folder layouts and enum/error/audit constant files.

**Files to create/update:**
- `backend/api/src/modules/inventory/` — `controllers/`, `routes/`, `services/`, `repositories/`, `models/`, `validators/`, `types/`, `constants/`, `utils/`
- `backend/api/src/modules/inventory/movements/` — same subfolders
- `backend/api/src/modules/inventory/constants/inventory-stock-status.constant.ts` — `active`, `inactive`, `archived`
- `backend/api/src/modules/inventory/movements/constants/inventory-movement-type.constant.ts`
- `backend/api/src/modules/inventory/movements/constants/inventory-reference-type.constant.ts`
- `backend/api/src/modules/inventory/constants/inventory-bulk-duplicate-mode.constant.ts` — `fail`, `skip`, `replace`
- `backend/api/src/modules/inventory/constants/inventory-error-codes.constant.ts`
- `backend/api/src/modules/inventory/constants/inventory-audit-events.constant.ts`

**API endpoints:** None.

**DB fields:** Constants only.

**Implementation steps:**
1. Error codes per PDF: `INVENTORY_STOCK_NOT_FOUND`, `INVENTORY_STOCK_ALREADY_EXISTS`, `INVALID_INVENTORY_STORE_PRODUCT`, `INVALID_INVENTORY_QUANTITY`, `INSUFFICIENT_AVAILABLE_STOCK`, `INVENTORY_RESERVED_STOCK_EXISTS`, `INVENTORY_SCOPE_DENIED`, `INVENTORY_BULK_VALIDATION_FAILED`, `INVALID_INVENTORY_STATUS`, `INVALID_INVENTORY_MOVEMENT_TYPE`, `INVALID_INVENTORY_REFERENCE_TYPE`.
2. Audit events per PDF: `inventory.stock_created`, `inventory.stock_updated`, `inventory.stock_deleted`, `inventory.stock_adjusted`, `inventory.bulk_uploaded`, `inventory.bulk_thresholds_updated`, `inventory.vendor_stock_adjusted`.

**Acceptance criteria:**
- Folder trees exist; no models, routes, or services yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 3 — Inventory stock Mongoose model and indexes

**Ticket:** 3 — Inventory stock Mongoose model and indexes

**Objective:** Implement `InventoryStockModel` for collection `inventory_stocks`.

**Files to create/update:**
- `backend/api/src/modules/inventory/models/inventory-stock.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — add `INVENTORY_STOCKS: 'inventory_stocks'`

**API endpoints:** None.

**DB fields:** All stock fields from Ticket 1; ObjectId refs for `storeId`, `vendorId`, `cityId`, `storeProductId`, `productId`, `variantId`, `lastStockMovementId`.

**Implementation steps:**
1. Partial unique: `{ storeId: 1, storeProductId: 1 }` where `isDeleted: false`.
2. Indexes per PDF: `storeId`, `vendorId`, `cityId`, `storeProductId`, `productId`, `variantId`, `sku`, `isLowStock`, `isOutOfStock`, `status`, `isDeleted`, `createdAt`.
3. Defaults for service layer: `reservedQuantity: 0`, `damagedQuantity: 0`, `expiredQuantity: 0`, `status: active`.

**Acceptance criteria:**
- Model compiles; enums match Ticket 2.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 4 — Inventory movement Mongoose model and indexes

**Ticket:** 4 — Inventory movement Mongoose model and indexes

**Objective:** Implement `InventoryMovementModel` for collection `inventory_movements`.

**Files to create/update:**
- `backend/api/src/modules/inventory/movements/models/inventory-movement.model.ts`
- `backend/api/src/database/constants/collection-names.constants.ts` — add `INVENTORY_MOVEMENTS: 'inventory_movements'`

**API endpoints:** None.

**DB fields:** All movement fields from Ticket 1.

**Implementation steps:**
1. Indexes per PDF: `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `movementType`, `referenceType`, `referenceId`, `createdAt`.
2. Movement records are append-only (no soft delete on movements).

**Acceptance criteria:**
- Model compiles; movement/reference enums match Ticket 2.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 5 — Inventory types and quantity utility

**Ticket:** 5 — Inventory types and quantity utility

**Objective:** TypeScript contracts and stock calculation utilities per PDF.

**Files to create/update:**
- `backend/api/src/modules/inventory/types/inventory-stock.types.ts`
- `backend/api/src/modules/inventory/movements/types/inventory-movement.types.ts`
- `backend/api/src/modules/inventory/utils/inventory-quantity.util.ts`

**API endpoints:** None.

**DB fields:** Types for `InventoryStockStatus`, `InventoryMovementType`, `InventoryReferenceType`, `CreateInventoryStockInput`, `UpdateInventoryStockInput`, `InventoryStockListQuery`, `InventoryAdjustmentInput`, `BulkInventoryUploadInput`, `BulkInventoryThresholdInput`, `InventoryMovementListQuery`, `CreateInventoryMovementInput`.

**Implementation steps:**
1. `calculateTotalQuantity(available, reserved, damaged, expired)` — block negative inputs.
2. `calculateStockFlags(available, lowStockThreshold)` — `isOutOfStock` when `available <= 0`; `isLowStock` when `available > 0` and `available <= lowStockThreshold`.
3. List query filters for stocks and movements per PDF pages 134–137.

**Acceptance criteria:**
- Utils are pure and unit-testable.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 3–4.

---

## Ticket 6 — Inventory response mappers

**Ticket:** 6 — Inventory response mappers

**Objective:** Map DB documents to API response DTOs; exclude internal fields.

**Files to create/update:**
- `backend/api/src/modules/inventory/utils/inventory-stock-response.mapper.ts`
- `backend/api/src/modules/inventory/movements/utils/inventory-movement-response.mapper.ts`

**API endpoints:** None (used by services/controllers).

**DB fields:** Stock response includes fields per PDF page 133; exclude `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `__v`. Movement response includes fields per PDF page 133 movement section.

**Implementation steps:**
1. Mirror `store-product-response.mapper.ts` patterns.

**Acceptance criteria:**
- Mappers compile; no service logic.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 5.

---

## Ticket 7 — Inventory stock repository

**Ticket:** 7 — Inventory stock repository

**Objective:** Data access layer for inventory stock records including bulk helpers.

**Files to create/update:**
- `backend/api/src/modules/inventory/repositories/inventory-stock.repository.ts`

**API endpoints:** None.

**DB fields:** CRUD on all `inventory_stocks.*`; soft delete sets `isDeleted`, `deletedAt`, `status: archived`, `updatedBy`.

**Implementation steps:**
1. Methods: `createInventoryStock`, `findInventoryStockById`, `findInventoryStockByStoreProduct`, `updateInventoryStockById`, `softDeleteInventoryStockById`, `listInventoryStocks` (filters from Ticket 5).
2. `countInventoryStocksByStoreProduct(storeProductId)` for delete guards.
3. `bulkCreateInventoryStocks(records)`.
4. `bulkUpdateInventoryThresholds(stockIds, payload, actorId)`.
5. Exclude soft-deleted records by default in find/list.

**Acceptance criteria:**
- No service or route code in this ticket.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 8 — Inventory movement repository

**Ticket:** 8 — Inventory movement repository

**Objective:** Data access layer for inventory movement audit trail.

**Files to create/update:**
- `backend/api/src/modules/inventory/movements/repositories/inventory-movement.repository.ts`

**API endpoints:** None.

**DB fields:** Create and list on `inventory_movements.*`.

**Implementation steps:**
1. Methods: `createInventoryMovement`, `findInventoryMovementById`, `listInventoryMovements` (filters: `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `movementType`, `referenceType`, `referenceId`, `fromDate`, `toDate`, pagination, sort default `createdAt desc`).

**Acceptance criteria:**
- Repository compiles; no HTTP layer.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 4.

---

## Ticket 9 — Inventory Zod validators

**Ticket:** 9 — Inventory Zod validators

**Objective:** Request validation for all inventory admin and vendor endpoints.

**Files to create/update:**
- `backend/api/src/modules/inventory/validators/inventory-stock.validators.ts`
- `backend/api/src/modules/inventory/movements/validators/inventory-movement.validators.ts`

**API endpoints:** Validators for:
- `POST /api/v1/admin/inventory/stocks`
- `PATCH /api/v1/admin/inventory/stocks/:inventoryStockId`
- `GET /api/v1/admin/inventory/stocks`
- `POST /api/v1/admin/inventory/stocks/:inventoryStockId/adjust`
- `POST /api/v1/admin/inventory/stocks/bulk-upload`
- `PATCH /api/v1/admin/inventory/stocks/bulk-thresholds`
- `GET /api/v1/admin/inventory/movements`
- `GET /api/v1/vendor/inventory/stocks`
- `POST /api/v1/vendor/inventory/stocks/:inventoryStockId/adjust`
- `GET /api/v1/vendor/inventory/movements`
- Params: `inventoryStockId`, `movementId` as ObjectId

**DB fields:** Validated request fields per PDF pages 135–137, 145–146.

**Implementation steps:**
1. Create stock: `storeProductId` required; `availableQuantity` required min 0; optional `reservedQuantity`, `damagedQuantity`, `expiredQuantity`, `lowStockThreshold`, `reorderLevel` min 0.
2. Update settings: `lowStockThreshold`, `reorderLevel`, `status` optional.
3. Admin adjust: `movementType` required; `quantity` > 0; `reason` required; optional `referenceType`, `referenceId`, `notes`; restrict admin types to `stock_in`, `stock_out`, `manual_adjustment`, `damaged`, `expired`, `correction`; `adjustmentMode` enum `increase|decrease|set` when `manual_adjustment`.
4. Bulk upload: `items[]`, `duplicateMode` (`fail|skip|replace`).
5. Bulk thresholds: `inventoryStockIds[]`, optional threshold fields.
6. Vendor adjust: restrict types to `stock_in`, `stock_out`, `damaged`, `expired`, `correction` (no `manual_adjustment` per PDF page 146).

**Acceptance criteria:**
- Validators export Zod schemas; no controllers yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 10 — Inventory movement service

**Ticket:** 10 — Inventory movement service

**Objective:** Internal movement creation and read APIs for services/controllers.

**Files to create/update:**
- `backend/api/src/modules/inventory/movements/services/inventory-movement.service.ts`

**API endpoints:**
- `GET /api/v1/admin/inventory/movements`
- `GET /api/v1/admin/inventory/movements/:movementId`
- `GET /api/v1/vendor/inventory/movements` (scoped list — vendor filter applied in Ticket 14)

**DB fields:** Movement writes include previous/new quantity snapshots per PDF.

**Implementation steps:**
1. `createInventoryMovement(payload)` — used internally by stock service (opening stock, adjustments, bulk).
2. `getInventoryMovementById` → not found error when missing.
3. `listInventoryMovements` with pagination; default sort `createdAt desc`.
4. Vendor list applies scope filter when `vendorScope` provided (Ticket 14).

**Acceptance criteria:**
- No route files; service methods ready for controllers.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 6, 8.

---

## Ticket 11 — Inventory stock service: create, read, list

**Ticket:** 11 — Inventory stock service: create, read, list

**Objective:** Admin create/read business logic with store-product reference validation.

**Files to create/update:**
- `backend/api/src/modules/inventory/services/inventory-stock.service.ts` (partial)
- `backend/api/src/modules/inventory/services/inventory-stock-reference.service.ts` (create — store product eligibility checks)

**API endpoints:**
- `POST /api/v1/admin/inventory/stocks`
- `GET /api/v1/admin/inventory/stocks`
- `GET /api/v1/admin/inventory/stocks/:inventoryStockId`

**DB fields:** Copy `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `sku`, `storeSku` from active store product mapping; set `totalQuantity`, flags, `lastStockUpdatedAt`, `createdBy`/`updatedBy`.

**Implementation steps:**
1. Verify `storeProductId` exists, active, visible, not deleted → `INVALID_INVENTORY_STORE_PRODUCT`.
2. Block duplicate `storeId+storeProductId` → `INVENTORY_STOCK_ALREADY_EXISTS`.
3. Defaults: `reservedQuantity`, `damagedQuantity`, `expiredQuantity` = 0.
4. Calculate `totalQuantity` and stock flags via Ticket 5 util.
5. On create, write opening movement (`movementType: stock_in`, `referenceType: manual`, reason `Opening stock created`) via Ticket 10; set `lastStockMovementId`.
6. `getInventoryStockById` → `INVENTORY_STOCK_NOT_FOUND`; `listInventoryStocks` paginated, default sort `createdAt desc`.

**Acceptance criteria:**
- Create path produces movement record; list/get exclude soft-deleted by default.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 7, 10; Store Product module (read-only).

---

## Ticket 12 — Inventory stock service: settings, adjust, delete

**Ticket:** 12 — Inventory stock service: settings, adjust, delete

**Objective:** Admin stock settings update, quantity adjustments, and soft delete.

**Files to create/update:**
- `backend/api/src/modules/inventory/services/inventory-stock.service.ts` (extend)

**API endpoints:**
- `PATCH /api/v1/admin/inventory/stocks/:inventoryStockId`
- `POST /api/v1/admin/inventory/stocks/:inventoryStockId/adjust`
- `DELETE /api/v1/admin/inventory/stocks/:inventoryStockId`

**DB fields:** Adjust updates quantities, flags, `lastStockUpdatedAt`, `lastStockMovementId`; delete sets `isDeleted`, `deletedAt`, `status: archived`, `updatedBy`.

**Implementation steps:**
1. `updateInventoryStockSettings` — only `lowStockThreshold`, `reorderLevel`, `status`; recalculate flags.
2. `adjustInventoryStock` — apply movement types per PDF page 140: `stock_in` increase available; `stock_out` decrease; `manual_adjustment` with `adjustmentMode`; `damaged`/`expired` shift quantities; `correction` set available with reason; block negative quantities → `INSUFFICIENT_AVAILABLE_STOCK` / `INVALID_INVENTORY_QUANTITY`.
3. Write movement with previous/new snapshots; update `lastStockMovementId`.
4. `deleteInventoryStock` — block when `reservedQuantity > 0` → `INVENTORY_RESERVED_STOCK_EXISTS`; else soft delete.

**Acceptance criteria:**
- Each successful adjust creates exactly one movement record.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 11.

---

## Ticket 13 — Inventory stock service: bulk upload and bulk thresholds

**Ticket:** 13 — Inventory stock service: bulk upload and bulk thresholds

**Objective:** Admin bulk opening stock and threshold updates.

**Files to create/update:**
- `backend/api/src/modules/inventory/services/inventory-stock.service.ts` (extend)

**API endpoints:**
- `POST /api/v1/admin/inventory/stocks/bulk-upload`
- `PATCH /api/v1/admin/inventory/stocks/bulk-thresholds`

**DB fields:** Bulk upload creates/replaces stock rows and movements; bulk thresholds update `lowStockThreshold`, `reorderLevel`, flags.

**Implementation steps:**
1. `bulkUploadInventoryStocks(items, duplicateMode, actorId)` — validate all `storeProductId` first; `fail|skip|replace` per PDF; return created/replaced/skipped/failed counts + item errors → `INVENTORY_BULK_VALIDATION_FAILED` when appropriate.
2. Create movement for each created/replaced record.
3. `bulkUpdateInventoryThresholds` — recalculate flags for each id; return affected count.

**Acceptance criteria:**
- Bulk modes behave per `duplicateMode`; partial failures reported in response metadata.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 11–12.

---

## Ticket 14 — Vendor inventory service

**Ticket:** 14 — Vendor inventory service

**Objective:** Vendor-scoped list, detail, adjust, and movement list.

**Files to create/update:**
- `backend/api/src/modules/inventory/services/inventory-vendor.service.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/inventory/stocks`
- `GET /api/v1/vendor/inventory/stocks/:inventoryStockId`
- `POST /api/v1/vendor/inventory/stocks/:inventoryStockId/adjust`
- `GET /api/v1/vendor/inventory/movements`

**DB fields:** Force filter by authenticated `vendorId` and `storeId` on list; scope check on get/adjust.

**Implementation steps:**
1. `listVendorInventoryStocks` — inject vendor/store scope into query.
2. `getVendorInventoryStockById` — `INVENTORY_SCOPE_DENIED` when out of scope.
3. `adjustVendorInventoryStock` — allowed movement types per PDF page 146; same quantity rules as admin adjust; audit `inventory.vendor_stock_adjusted`.
4. `listVendorInventoryMovements` — scoped by vendor/store.

**Acceptance criteria:**
- Vendor cannot read or adjust another store's stock.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 10, 12.

---

## Ticket 15 — Inventory permissions, global errors, and audit registration

**Ticket:** 15 — Inventory permissions, global errors, and audit registration

**Objective:** Wire `inventory:*` permissions, `ADJUST` action, global error codes, and audit event constants.

**Files to create/update:**
- `backend/api/src/modules/auth/constants/auth-permission.constants.ts` — add `ADJUST: 'adjust'` to `AUTH_PERMISSION_ACTION`
- `backend/api/src/errors/error-codes.ts` — register inventory error codes
- `backend/api/src/constants/audit-event.constants.ts` — register inventory audit events (if global registry used)
- `backend/api/src/database/seeds/seed-roles.ts` — `operations_admin`: `inventory:read|create|update|delete|adjust|bulk_update`; vendor roles: `inventory:read`, `inventory:update` (vendor adjust uses update gate per PDF page 144–146)
- `docs/security/inventory-foundation-permissions.md` — mark IMPLEMENTED when done

**API endpoints:** None (permission gates documented for routes).

**DB fields:** None.

**Implementation steps:**
1. Map route permissions per PDF page 144: `inventory:create` POST stocks; `inventory:read` GET; `inventory:update` PATCH stocks + vendor adjust; `inventory:delete` DELETE; `inventory:adjust` POST admin adjust; `inventory:bulk_update` bulk-upload + bulk-thresholds.
2. Seed `vendor_owner`, `store_manager`, `store_staff` with `inventory:read` + `inventory:update`.
3. `super_admin` retains `*:*`.

**Acceptance criteria:**
- Permission codes align with route middleware in Tickets 18–19.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 16 — Admin inventory stock controller

**Ticket:** 16 — Admin inventory stock controller

**Objective:** HTTP handlers for admin stock CRUD, adjust, and bulk endpoints.

**Files to create/update:**
- `backend/api/src/modules/inventory/controllers/inventory-stock.controller.ts`

**API endpoints:**
- `POST /api/v1/admin/inventory/stocks`
- `GET /api/v1/admin/inventory/stocks`
- `GET /api/v1/admin/inventory/stocks/:inventoryStockId`
- `PATCH /api/v1/admin/inventory/stocks/:inventoryStockId`
- `DELETE /api/v1/admin/inventory/stocks/:inventoryStockId`
- `POST /api/v1/admin/inventory/stocks/:inventoryStockId/adjust`
- `POST /api/v1/admin/inventory/stocks/bulk-upload`
- `PATCH /api/v1/admin/inventory/stocks/bulk-thresholds`

**DB fields:** None (delegate to services).

**Implementation steps:**
1. Use `asyncHandler`, standard paginated/success/created responses.
2. Pass `req.user.userId` as actor to services.
3. Wire audit writes in services (Tickets 11–13), not controller.

**Acceptance criteria:**
- Controller compiles; no route mount yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 11–13.

---

## Ticket 17 — Inventory movement and vendor controllers

**Ticket:** 17 — Inventory movement and vendor controllers

**Objective:** HTTP handlers for movement read and vendor inventory endpoints.

**Files to create/update:**
- `backend/api/src/modules/inventory/movements/controllers/inventory-movement.controller.ts`
- `backend/api/src/modules/inventory/controllers/inventory-vendor.controller.ts`

**API endpoints:**
- `GET /api/v1/admin/inventory/movements`
- `GET /api/v1/admin/inventory/movements/:movementId`
- `GET /api/v1/vendor/inventory/stocks`
- `GET /api/v1/vendor/inventory/stocks/:inventoryStockId`
- `POST /api/v1/vendor/inventory/stocks/:inventoryStockId/adjust`
- `GET /api/v1/vendor/inventory/movements`

**DB fields:** None.

**Implementation steps:**
1. Admin movement controllers call Ticket 10 service.
2. Vendor controllers call Ticket 14 service; pass `vendorId`/`storeId` from `req.user`.

**Acceptance criteria:**
- All fifteen module endpoints have controller methods.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 10, 14.

---

## Ticket 18 — Admin inventory routes

**Ticket:** 18 — Admin inventory routes

**Objective:** Register admin inventory routes with auth, validation, and permission middleware.

**Files to create/update:**
- `backend/api/src/modules/inventory/routes/inventory-admin.routes.ts`

**API endpoints:** All eleven admin endpoints from Tickets 16–17 under `/api/v1/admin/inventory`.

**DB fields:** None.

**Implementation steps:**
1. Apply `authenticate()` and admin role guards (same pattern as `store-product-admin.routes.ts`).
2. Apply `requirePermission` per Ticket 15 mapping.
3. Wire validators from Ticket 9.

**Acceptance criteria:**
- Route file exports router; not mounted until Ticket 20.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 9, 15–17.

---

## Ticket 19 — Vendor inventory routes

**Ticket:** 19 — Vendor inventory routes

**Objective:** Register vendor inventory routes with auth, scope, validation, and permissions.

**Files to create/update:**
- `backend/api/src/modules/inventory/routes/inventory-vendor.routes.ts`

**API endpoints:** Four vendor endpoints under `/api/v1/vendor/inventory`.

**DB fields:** None.

**Implementation steps:**
1. Apply `authenticate()`, vendor role guards, existing vendor/store scope middleware.
2. `inventory:read` on GET; `inventory:update` on POST adjust (per PDF).

**Acceptance criteria:**
- Route file exports router; not mounted until Ticket 20.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 9, 14–15, 17.

---

## Ticket 20 — Mount admin and vendor inventory routes

**Ticket:** 20 — Mount admin and vendor inventory routes

**Objective:** Mount inventory routers under admin and vendor API prefixes.

**Files to create/update:**
- `backend/api/src/routes/v1/admin.routes.ts`
- `backend/api/src/routes/v1/vendor.routes.ts`

**API endpoints:**
- `/api/v1/admin/inventory` → `inventory-admin.routes.ts`
- `/api/v1/vendor/inventory` → `inventory-vendor.routes.ts`

**DB fields:** None.

**Implementation steps:**
1. Mount without modifying unrelated routes.
2. Verify fifteen endpoints in route tree.

**Acceptance criteria:**
- Typecheck/build pass with routes mounted.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run build -w backend/api`

**Depends on:** Tickets 18–19.

---

## Ticket 21 — OpenAPI, contract docs, and route registry

**Ticket:** 21 — OpenAPI, contract docs, and route registry

**Objective:** Document implemented inventory admin and vendor APIs.

**Files to create/update:**
- `backend/api/src/docs/openapi/inventory.paths.ts` (create)
- `backend/api/src/docs/openapi/index.ts` — merge `inventoryPaths`
- `docs/contracts/inventory-foundation-api.md` (create)
- `docs/contracts/backend-route-registry.md`
- `docs/security/inventory-foundation-permissions.md` — status IMPLEMENTED
- `docs/errors/inventory-foundation-error-codes.md` — status IMPLEMENTED

**API endpoints:** Document all fifteen endpoints with request/response field lists per PDF pages 148–150.

**DB fields:** Document stock and movement field usage in contract doc.

**Implementation steps:**
1. OpenAPI placeholder responses (store-product pattern).
2. Registry lists admin and vendor inventory routes separately.

**Acceptance criteria:**
- Contracts match validators and response mappers.

**Test commands:**
- `npm run build -w backend/api`

**Depends on:** Ticket 20.

---

## Ticket 22 — Inventory quantity util and stock service unit tests

**Ticket:** 22 — Inventory quantity util and stock service unit tests

**Objective:** Service tests for stock CRUD, adjustments, bulk, and quantity rules (mocked repositories).

**Files to create/update:**
- `backend/api/src/modules/inventory/utils/inventory-quantity.util.test.ts`
- `backend/api/src/modules/inventory/services/inventory-stock.service.test.ts`

**API endpoints:** None.

**DB fields:** Fixtures for store product refs, quantities, thresholds, movements.

**Implementation steps:**
1. Util tests: total quantity calculation; negative input blocked; `isOutOfStock` / `isLowStock` flags.
2. Service tests per PDF pages 151–152: create success; invalid/missing store product; duplicate stock; denormalized field copy; opening movement; stock in/out; damaged/expired; negative adjust blocked; movement record created; delete blocked when reserved > 0; soft delete success.
3. Mock `writeAuditLog` and repositories.

**Acceptance criteria:**
- Tests pass without live MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/inventory/utils/inventory-quantity.util.test.js dist/modules/inventory/services/inventory-stock.service.test.js`

**Depends on:** Tickets 11–13.

---

## Ticket 23 — Movement and vendor inventory service unit tests

**Ticket:** 23 — Movement and vendor inventory service unit tests

**Objective:** Service tests for movement list filters and vendor scope/adjust guards.

**Files to create/update:**
- `backend/api/src/modules/inventory/movements/services/inventory-movement.service.test.ts`
- `backend/api/src/modules/inventory/services/inventory-vendor.service.test.ts`

**API endpoints:** None.

**DB fields:** Movement list filter fixtures; vendor scope cases.

**Implementation steps:**
1. Movement tests per PDF page 152: create with required fields; list filters by `inventoryStockId`, `movementType`, `referenceType`, date range.
2. Vendor tests: scope denied on foreign store; adjust blocked out of scope; successful scoped adjust.

**Acceptance criteria:**
- Tests pass without live MongoDB.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/inventory/movements/services/inventory-movement.service.test.js dist/modules/inventory/services/inventory-vendor.service.test.js`

**Depends on:** Tickets 10, 14.

---

## Ticket 24 — Inventory controller unit tests

**Ticket:** 24 — Inventory controller unit tests

**Objective:** Controller tests with mocked services (repo pattern).

**Files to create/update:**
- `backend/api/src/modules/inventory/controllers/inventory-stock.controller.test.ts`
- `backend/api/src/modules/inventory/movements/controllers/inventory-movement.controller.test.ts`
- `backend/api/src/modules/inventory/controllers/inventory-vendor.controller.test.ts`

**API endpoints:** Smoke-test handler wiring for create, list, get, adjust, bulk (admin) and vendor list/adjust.

**DB fields:** None.

**Implementation steps:**
1. Mirror `store-product.controller.test.ts` mock response pattern.
2. Assert standard `{ success, data }` payload shape and status codes (200/201).

**Acceptance criteria:**
- Controller tests pass without HTTP server.

**Test commands:**
- `npm run build -w backend/api && node --test dist/modules/inventory/controllers/inventory-stock.controller.test.js dist/modules/inventory/movements/controllers/inventory-movement.controller.test.js dist/modules/inventory/controllers/inventory-vendor.controller.test.js`

**Depends on:** Tickets 16–17.

---

## Ticket 25 — Route integration tests (optional)

**Ticket:** 25 — Route integration tests (optional)

**Objective:** HTTP route tests per PDF pages 152–153, or document deferral if unit coverage is sufficient.

**Files to create/update:**
- `backend/api/src/modules/inventory/routes/inventory-admin.routes.test.ts` (optional)
- `backend/api/src/modules/inventory/routes/inventory-vendor.routes.test.ts` (optional)
- `docs/reviews/inventory-foundation-backend-review.md` (note deferral if skipped)

**API endpoints:** 401/403/ success paths for representative admin and vendor routes per PDF.

**DB fields:** None.

**Implementation steps:**
1. If deferred: document in module review that controller + service unit tests cover handlers; route tests planned for Phase 3 Testing module.
2. If implemented: unauthenticated 401, missing permission 403, duplicate stock conflict, insufficient stock on stock_out.

**Acceptance criteria:**
- Either route tests pass or deferral is documented.

**Test commands:**
- `npm run test:inventory -w backend/api` (when script exists) OR documented N/A

**Depends on:** Ticket 20.

---

## Ticket 26 — Store product delete dependency wiring

**Ticket:** 26 — Store product delete dependency wiring

**Objective:** Block store product soft delete when inventory stock exists (PDF page 154).

**Files to create/update:**
- `backend/api/src/modules/store-products/services/store-product.service.ts` — use `countInventoryStocksByStoreProduct`
- `backend/api/src/modules/store-products/constants/store-product-error-codes.constant.ts` — add error if missing (e.g. `STORE_PRODUCT_HAS_INVENTORY_STOCK`)
- `backend/api/src/errors/error-codes.ts` — register new code
- `backend/api/src/modules/store-products/services/store-product.service.test.ts` — extend delete guard test

**API endpoints:** None new (existing DELETE gains guard).

**DB fields:** None new.

**Implementation steps:**
1. Before soft delete, if `countInventoryStocksByStoreProduct(storeProductId) > 0`, throw conflict.
2. Minimal diff — delete-guard wiring only.

**Acceptance criteria:**
- `npm run test:store-products` still passes.

**Test commands:**
- `npm run test:store-products -w backend/api`

**Depends on:** Ticket 7 count method.

---

## Ticket 27 — Inventory seed script

**Ticket:** 27 — Inventory seed script

**Objective:** Idempotent dev seeds for inventory on seeded store product mappings (PDF pages 154–155).

**Files to create/update:**
- `backend/api/src/database/seeds/seed-inventory.ts` (create)
- `backend/api/src/database/seeds/seed-runner.ts` — register after `seed-store-products`

**API endpoints:** None.

**DB fields:** Opening stock per mapped store product; opening `stock_in` movement; idempotent by `storeId+storeProductId`.

**Implementation steps:**
1. Skip gracefully in dry-run with planned upsert log.
2. Skip when store product seeds absent (same pattern as `seed-store-products.ts`).
3. No duplicate stock on re-run.

**Acceptance criteria:**
- `npm run seed:dry -w backend/api` logs planned inventory upserts without error.

**Test commands:**
- `npm run seed:dry -w backend/api`

**Depends on:** Tickets 3–8; `seed-store-products` when mappings exist.

---

## Ticket 28 — Quality gates and npm test entrypoints

**Ticket:** 28 — Quality gates and npm test entrypoints

**Objective:** Add test scripts and verify lint/typecheck for inventory module.

**Files to create/update:**
- `backend/api/package.json` — `test:inventory` (aggregate util, stock, movement, vendor service + controller tests)
- `backend/api/src/database/seeds/seed-role-permission-matrix.test.ts` — assert `inventory:*` on `operations_admin` and vendor roles

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:inventory`: all inventory unit tests from Tickets 22–24.
2. Run full quality gates and regression on store-products, store-foundation, seed-matrix.

**Acceptance criteria:**
- `npm run typecheck`, `npm run lint`, `npm run test:inventory` pass.
- `npm run test:store-products`, `npm run test:store-foundation`, `npm run test:seed-matrix` still pass.

**Test commands:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:inventory -w backend/api`
- `npm run test:store-products -w backend/api`
- `npm run test:seed-matrix -w backend/api`

**Depends on:** Tickets 22–24, 26–27.

---

## Ticket 29 — Module review, handoff, and project-context closeout

**Ticket:** 29 — Module review, handoff, and project-context closeout

**Objective:** Close Inventory Foundation Backend with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/inventory-foundation-backend-review.md` (create)
- `docs/handoffs/inventory-foundation-backend-complete.md` (create)
- `docs/reviews/phase-3-inventory-foundation-backend-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`

**API endpoints:** Verify all fifteen admin + vendor endpoints in review doc.

**DB fields:** Verify `inventory_stocks.*` and `inventory_movements.*` match schema docs + PDF pages 155–156.

**Implementation steps:**
1. Record verification table: endpoints, permissions, audit, error codes, movements, bulk ops, store-product delete guard.
2. Note pending: Redis reservation / `inventory_locks` in Inventory Locking Preparation; route tests if deferred (Ticket 25).
3. Set next module: **Inventory Locking Preparation** per PDF order (do not start Media/frontend).

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- No `inventory_locks` runtime code started.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 28

**Depends on:** Ticket 28.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 5 → 6
2 → 4 → 5
3 → 7 → 11 → 12 → 13
4 → 8 → 10
2 → 9
5,6,7,8,9 → 11
10,11 → 12 → 13
10,12 → 14
2 → 15 → 18,19
11–13 → 16
10,14 → 17
9,15–17 → 18,19 → 20 → 21
11–14 → 22,23 → 28
16,17 → 24 → 28
20 → 25
7 → 26
3–8,27 deps → 27 → 28
28 → 29
```

**Critical path:** 1 → 2 → 3 → 7 → 11 → 12 → 16 → 18 → 20 → 28 → 29  
(Parallel: 4–5 movement model/util; 10 movement service; 14 vendor; 26 delete wiring after repo)

**Cross-module order:** Store product mapping before inventory stock records; inventory foundation before inventory locking (`inventory_locks`, reservation movement execution).
