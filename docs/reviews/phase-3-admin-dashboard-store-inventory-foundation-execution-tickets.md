# Phase 3 Admin Dashboard — Store & Inventory Foundation — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Admin Dashboard — Store & Inventory Foundation  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 235–288  

**Architecture references:**  
`docs/contracts/city-management-api.md`, `docs/contracts/service-area-management-api.md`, `docs/contracts/store-management-api.md`, `docs/contracts/store-product-mapping-api.md`, `docs/contracts/inventory-foundation-api.md`, `docs/contracts/inventory-locking-api.md`, `docs/security/store-foundation-permissions.md`, `docs/security/store-product-mapping-permissions.md`, `docs/security/inventory-foundation-permissions.md`, `docs/security/inventory-locking-permissions.md`, `docs/errors/store-foundation-error-codes.md`, `docs/errors/store-product-mapping-error-codes.md`, `docs/errors/inventory-foundation-error-codes.md`, `docs/errors/inventory-locking-error-codes.md`, `docs/validation/store-foundation-validation-rules.md`, `docs/handoffs/store-foundation-backend-complete.md`, `docs/handoffs/store-product-mapping-backend-complete.md`, `docs/handoffs/inventory-foundation-backend-complete.md`, `docs/handoffs/inventory-locking-preparation-complete.md`, `docs/handoffs/admin-dashboard-catalog-foundation-complete.md`

**Prerequisites (already in repo):**  
Phase 2 Admin Dashboard auth, RBAC (`CanAccess` / `CanAccessAny`), React Query, axios `apiClient`; store foundation APIs (`/api/v1/admin/locations/*`, `/api/v1/admin/stores`); store-product APIs (`/api/v1/admin/store-products`); inventory APIs (`/api/v1/admin/inventory/*`); catalog read APIs for product/variant dropdowns in store-product forms.

**Out of scope for this module:**  
Vendor Panel store catalog/inventory UI (module 13), Customer App catalog UI (module 14), backend API changes, `packages/shared` TypeScript files, Repository & Codebase Setup, cart/checkout/order runtime, internal lock create/release/confirm UI (internal APIs only), production map/polygon editor (PDF allows temporary polygon JSON textarea).

**Execution order notes:**
- Run **Ticket 1** (docs) before implementation tickets.
- Run **Tickets 3–7** (API clients) before **Tickets 15–20** (hooks).
- Run **Tickets 8–11** (types/constants) before **Tickets 25–27** (forms/pages).
- Run **Tickets 12–13** (routes) before **Tickets 28–33** (pages); update **Ticket 14** (sidebar) after routes exist.
- Run **Tickets 23–24** (shared components) before forms/pages that use selects and badges.
- Run **Ticket 21–22** (permission utils) before pages with action visibility.
- **StoreProductForm** uses `GET /api/v1/admin/catalog/products` and `GET /api/v1/admin/catalog/products/:productId/variants` for dropdowns (read-only catalog consumption).
- Bulk store-product and inventory operations are UI modals/forms on list pages per PDF (not separate routes).
- PDF paths use `__tests__/`; repo convention is co-located `*.test.ts` / `*.test.tsx` under `apps/admin-dashboard/src/modules/stores/` and `modules/inventory/` (mirror catalog module).
- Replace placeholder `apps/admin-dashboard/src/pages/stores/StoresPage.tsx` when `/stores` module routes mount (Ticket 12); legacy `/stores` route should point to new store list.

**Status legend:** `DONE` | `DONE`

**Module status:** All tickets `DONE`

---

## Ticket 1 — Admin Dashboard store & inventory foundation docs

**Ticket:** 1 — Admin Dashboard store & inventory foundation docs

**Objective:** Document UI scope, routes, permissions, and API wiring for location/store/inventory screens (no React implementation).

**Files to create/update:**
- `docs/architecture/admin-dashboard-store-inventory-foundation.md` (create)
- `docs/contracts/admin-dashboard-store-inventory-ui-contract.md` (create)
- `docs/testing/admin-dashboard-store-inventory-verification.md` (create)
- `docs/security/store-foundation-permissions.md` — add Admin Dashboard UI permission matrix (status: backend IMPLEMENTED)
- `docs/security/store-product-mapping-permissions.md` — add Admin Dashboard UI matrix
- `docs/security/inventory-foundation-permissions.md` — add Admin Dashboard UI matrix
- `docs/security/inventory-locking-permissions.md` — add Admin Dashboard UI matrix (expire-due uses `inventory:adjust`)

**API endpoints:** Document consumer usage only (see PDF page 286):
- Locations: `GET|POST /api/v1/admin/locations/cities`, `GET|PATCH|DELETE .../:cityId`; same for `service-areas`
- Stores: `GET|POST /api/v1/admin/stores`, `GET|PATCH|DELETE .../:storeId`
- Store products: `GET|POST /api/v1/admin/store-products`, `GET|PATCH|DELETE .../:storeProductId`, `POST /bulk-map`, `PATCH /bulk-price`, `PATCH /bulk-visibility`
- Inventory stocks: `GET|POST /api/v1/admin/inventory/stocks`, `GET|PATCH|DELETE .../:inventoryStockId`, `POST .../adjust`, `POST /bulk-upload`, `PATCH /bulk-thresholds`
- Movements: `GET /api/v1/admin/inventory/movements`, `GET .../:movementId`
- Locks: `GET /api/v1/admin/inventory/locks`, `GET .../:lockId`, `POST /expire-due`
- Catalog (dropdowns only): `GET /api/v1/admin/catalog/products`, `GET .../:productId/variants`

**DB fields:** Document fields per PDF pages 287–288: `cities.*`, `service_areas.*`, `stores.*`, `store_products.*`, `inventory_stocks.*`, `inventory_movements.*`, `inventory_locks.*`.

**Implementation steps:**
1. Route map (17 screens): locations (6), stores (4), store-products (3), inventory stocks (4), movements (2), locks (2).
2. Permission gates: `locations:*`, `stores:*`, `store_products:*`, `inventory:*` per PDF pages 248–249.
3. List query params per entity from PDF hooks sections.
4. Manual QA checklist (auth, permission hiding, CRUD, bulk ops, adjust stock, expire-due locks).
5. Note pending: Vendor Panel UI (module 13), customer catalog availability UI (module 14).

**Acceptance criteria:**
- Docs match PDF micro-tasks; no new `apps/admin-dashboard` feature code.

**Test commands:**
- `test -f docs/architecture/admin-dashboard-store-inventory-foundation.md && test -f docs/contracts/admin-dashboard-store-inventory-ui-contract.md && echo PASS`

**Depends on:** Admin Dashboard — Catalog Foundation complete.

---

## Ticket 2 — Stores and inventory module scaffold

**Ticket:** 2 — Stores and inventory module scaffold

**Objective:** Create `modules/stores/` and `modules/inventory/` folder layouts per PDF.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/api/` (create)
- `apps/admin-dashboard/src/modules/stores/components/` (create)
- `apps/admin-dashboard/src/modules/stores/forms/` (create)
- `apps/admin-dashboard/src/modules/stores/hooks/` (create)
- `apps/admin-dashboard/src/modules/stores/pages/` (create — `cities/`, `service-areas/`, `stores/`)
- `apps/admin-dashboard/src/modules/stores/types/` (create)
- `apps/admin-dashboard/src/modules/stores/utils/` (create)
- `apps/admin-dashboard/src/modules/stores/constants/` (create)
- `apps/admin-dashboard/src/modules/stores/routes/` (create)
- `apps/admin-dashboard/src/modules/inventory/api/` (create)
- `apps/admin-dashboard/src/modules/inventory/components/` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/` (create)
- `apps/admin-dashboard/src/modules/inventory/hooks/` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/` (create — `store-products/`, `stocks/`, `movements/`, `locks/`)
- `apps/admin-dashboard/src/modules/inventory/types/` (create)
- `apps/admin-dashboard/src/modules/inventory/utils/` (create)
- `apps/admin-dashboard/src/modules/inventory/constants/` (create)
- `apps/admin-dashboard/src/modules/inventory/routes/` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Create empty folder tree only; no pages, hooks, or API methods yet.
2. Optional barrel `index.ts` files only if needed for imports.

**Acceptance criteria:**
- Both module trees exist; `npm run typecheck -w apps/admin-dashboard` unaffected.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 1.

---

## Ticket 3 — City and service area API clients

**Ticket:** 3 — City and service area API clients

**Objective:** Axios API clients for admin city and service area CRUD.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/api/city.api.ts` (create)
- `apps/admin-dashboard/src/modules/stores/api/service-area.api.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/locations/cities`
- `GET /api/v1/admin/locations/cities/:cityId`
- `POST /api/v1/admin/locations/cities`
- `PATCH /api/v1/admin/locations/cities/:cityId`
- `DELETE /api/v1/admin/locations/cities/:cityId`
- `GET|POST|GET|PATCH|DELETE` — same for `/api/v1/admin/locations/service-areas` and `:serviceAreaId`

**DB fields:** None (transport only).

**Implementation steps:**
1. City methods: `getAdminCities(query)`, `getAdminCityById`, `createAdminCity`, `updateAdminCity`, `deleteAdminCity`.
2. Service area methods: `getAdminServiceAreas(query)`, `getAdminServiceAreaById`, `createAdminServiceArea`, `updateAdminServiceArea`, `deleteAdminServiceArea`.
3. Use existing `apiClient`; unwrap `{ success, data }` per `docs/standards/backend-response-format.md`.
4. Query params: cities — `page`, `limit`, `search`, `status`, `isServiceable`, `sortBy`, `sortOrder`; service areas — add `cityId`.

**Acceptance criteria:**
- All 10 methods exist with correct paths; no UI yet.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 4 — Store API client

**Ticket:** 4 — Store API client

**Objective:** Axios API client for admin store CRUD.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/api/store.api.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/stores`
- `GET /api/v1/admin/stores/:storeId`
- `POST /api/v1/admin/stores`
- `PATCH /api/v1/admin/stores/:storeId`
- `DELETE /api/v1/admin/stores/:storeId`

**DB fields:** None (transport only).

**Implementation steps:**
1. Methods: `getAdminStores(query)`, `getAdminStoreById`, `createAdminStore`, `updateAdminStore`, `deleteAdminStore`.
2. List query: `page`, `limit`, `search`, `vendorId`, `cityId`, `serviceAreaId`, `status`, `isOpen`, `isAcceptingOrders`, `storeType`, `fulfillmentType`, `sortBy`, `sortOrder`.

**Acceptance criteria:**
- All 5 methods typed; paths match `docs/contracts/store-management-api.md`.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 5 — Store product API client

**Ticket:** 5 — Store product API client

**Objective:** Axios API client for admin store product CRUD and bulk operations.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/api/store-product.api.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/store-products`
- `GET /api/v1/admin/store-products/:storeProductId`
- `POST /api/v1/admin/store-products`
- `PATCH /api/v1/admin/store-products/:storeProductId`
- `DELETE /api/v1/admin/store-products/:storeProductId`
- `POST /api/v1/admin/store-products/bulk-map`
- `PATCH /api/v1/admin/store-products/bulk-price`
- `PATCH /api/v1/admin/store-products/bulk-visibility`

**DB fields:** None (transport only).

**Implementation steps:**
1. CRUD methods plus `bulkMapAdminStoreProducts`, `bulkUpdateAdminStoreProductPrices`, `bulkUpdateAdminStoreProductVisibility`.
2. List query: `page`, `limit`, `search`, `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `status`, `isAvailable`, `isVisible`, `isFeatured`, `sortBy`, `sortOrder`.

**Acceptance criteria:**
- All 8 methods exist; bulk payloads align with backend validators.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 6 — Inventory stock API client

**Ticket:** 6 — Inventory stock API client

**Objective:** Axios API client for admin inventory stock CRUD, adjust, and bulk operations.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/api/inventory-stock.api.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/inventory/stocks`
- `GET /api/v1/admin/inventory/stocks/:inventoryStockId`
- `POST /api/v1/admin/inventory/stocks`
- `PATCH /api/v1/admin/inventory/stocks/:inventoryStockId`
- `DELETE /api/v1/admin/inventory/stocks/:inventoryStockId`
- `POST /api/v1/admin/inventory/stocks/:inventoryStockId/adjust`
- `POST /api/v1/admin/inventory/stocks/bulk-upload`
- `PATCH /api/v1/admin/inventory/stocks/bulk-thresholds`

**DB fields:** None (transport only).

**Implementation steps:**
1. Methods for CRUD, `adjustAdminInventoryStock`, `bulkUploadAdminInventoryStocks`, `bulkUpdateAdminInventoryThresholds`.
2. List query: `page`, `limit`, `search`, `storeId`, `vendorId`, `cityId`, `storeProductId`, `productId`, `variantId`, `sku`, `isLowStock`, `isOutOfStock`, `status`, `sortBy`, `sortOrder`.

**Acceptance criteria:**
- All 8 methods typed per `docs/contracts/inventory-foundation-api.md`.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 7 — Inventory movement and lock API clients

**Ticket:** 7 — Inventory movement and lock API clients

**Objective:** Axios API clients for inventory movements (read-only) and locks (read + expire-due).

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/api/inventory-movement.api.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/api/inventory-lock.api.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/inventory/movements`
- `GET /api/v1/admin/inventory/movements/:movementId`
- `GET /api/v1/admin/inventory/locks`
- `GET /api/v1/admin/inventory/locks/:lockId`
- `POST /api/v1/admin/inventory/locks/expire-due`

**DB fields:** None (transport only).

**Implementation steps:**
1. Movement: `getAdminInventoryMovements(query)`, `getAdminInventoryMovementById`.
2. Lock: `getAdminInventoryLocks(query)`, `getAdminInventoryLockById`, `expireDueInventoryLocks()`.
3. Movement list query: `page`, `limit`, `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `movementType`, `referenceType`, `referenceId`, `fromDate`, `toDate`, `sortBy`, `sortOrder`.
4. Lock list query: `page`, `limit`, `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `customerId`, `cartId`, `orderId`, `lockType`, `status`, `fromDate`, `toDate`, `sortBy`, `sortOrder`.

**Acceptance criteria:**
- All 5 methods exist; no internal lock create/release/confirm in admin UI.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 8 — Store entity types

**Ticket:** 8 — Store entity types

**Objective:** TypeScript types for city, service area, and store API payloads and responses.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/types/city.types.ts` (create)
- `apps/admin-dashboard/src/modules/stores/types/service-area.types.ts` (create)
- `apps/admin-dashboard/src/modules/stores/types/store.types.ts` (create)

**API endpoints:** None (types only).

**DB fields:**
- `cities`: `id`, `name`, `slug`, `state`, `country`, `timezone`, `currencyCode`, `latitude`, `longitude`, `serviceRadiusKm`, `isServiceable`, `status`, `createdAt`, `updatedAt`
- `service_areas`: `id`, `cityId`, `name`, `slug`, `description`, `polygon`, `centerLatitude`, `centerLongitude`, `radiusKm`, `isServiceable`, `status`, `createdAt`, `updatedAt`
- `stores`: `id`, `vendorId`, `cityId`, `serviceAreaIds`, `name`, `slug`, `code`, `description`, `phone`, `email`, address fields, geo/ops fields, `storeType`, `fulfillmentType`, `status`, `createdAt`, `updatedAt`

**Implementation steps:**
1. Response types and form payload types per PDF pages 240–242.
2. Align enums with backend contract docs.

**Acceptance criteria:**
- Types cover all fields used in forms and list columns.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 3–4.

---

## Ticket 9 — Inventory entity types

**Ticket:** 9 — Inventory entity types

**Objective:** TypeScript types for store product, inventory stock, movement, and lock entities.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/types/store-product.types.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/types/inventory-stock.types.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/types/inventory-movement.types.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/types/inventory-lock.types.ts` (create)

**API endpoints:** None (types only).

**DB fields:**
- `store_products`: `id`, `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `sku`, `storeSku`, `mrp`, `sellingPrice`, `discountType`, `discountValue`, `finalPrice`, `taxCategoryId`, `isAvailable`, `isVisible`, `isFeatured`, `isPriceLocked`, `priceUpdatedAt`, `availabilityUpdatedAt`, `status`, timestamps
- `inventory_stocks`: quantity buckets, thresholds, flags per PDF page 243–244
- `inventory_movements`: movement fields per PDF page 244
- `inventory_locks`: lock fields per PDF page 245

**Implementation steps:**
1. Include bulk operation payload/result summary types for map/price/visibility/upload/thresholds responses.
2. Bulk item row types for dynamic form arrays.

**Acceptance criteria:**
- Types align with backend contracts and PDF field lists.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 5–7.

---

## Ticket 10 — Store constants

**Ticket:** 10 — Store constants

**Objective:** Status and enum constants for cities, service areas, and stores.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/constants/store.constants.ts` (create)

**API endpoints:** None.

**DB fields:** Enum values for `cities.status`, `service_areas.status`, `stores.status`, `stores.storeType`, `stores.fulfillmentType`.

**Implementation steps:**
1. City/service area status: `active`, `inactive`, `archived`.
2. Store status: `active`, `inactive`, `suspended`, `archived`.
3. Store type: `grocery`, `pharmacy`, `restaurant`, `general`, `dark_store`.
4. Fulfillment type: `delivery`, `pickup`, `delivery_and_pickup`.
5. Export label maps for selects and badges.

**Acceptance criteria:**
- Constants match backend enums in store foundation docs.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 8.

---

## Ticket 11 — Inventory constants

**Ticket:** 11 — Inventory constants

**Objective:** Status and enum constants for store products, stocks, movements, and locks.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/constants/store-product.constants.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/constants/inventory.constants.ts` (create)

**API endpoints:** None.

**DB fields:** Enums for `store_products.status`, `discountType`; `inventory_stocks.status`; `inventory_movements.movementType`, `referenceType`; `inventory_locks.status`, `lockType`.

**Implementation steps:**
1. Store product status: `active`, `inactive`, `archived`; discount: `none`, `flat`, `percentage`.
2. Stock status: `active`, `inactive`, `archived`.
3. Movement types: `stock_in`, `stock_out`, `manual_adjustment`, `reservation_created`, `reservation_released`, `reservation_confirmed`, `damaged`, `expired`, `correction`.
4. Reference types: `manual`, `order`, `cart`, `return`, `system`, `seed`, `import`.
5. Lock status: `active`, `released`, `confirmed`, `expired`, `cancelled`, `failed`; lock type: `cart`, `checkout`, `order`, `manual`, `system`.

**Acceptance criteria:**
- Constants match backend enums.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 9.

---

## Ticket 12 — Store routes and admin route registration

**Ticket:** 12 — Store routes and admin route registration

**Objective:** Define location and store React Router paths; register in admin routes; replace placeholder stores page.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/routes/store.routes.tsx` (create)
- `apps/admin-dashboard/src/routes/admin.routes.tsx` (update — import `storeRoutes`, remove placeholder `StoresPage` at `/stores`)
- `apps/admin-dashboard/src/pages/stores/StoresPage.tsx` (update — redirect to `/stores` list or remove usage)

**API endpoints:** None (routing only).

**DB fields:** None.

**Implementation steps:**
1. Paths per PDF page 247: `/locations/cities`, `/locations/cities/new`, `/locations/cities/:cityId/edit`, `/locations/service-areas`, `/locations/service-areas/new`, `/locations/service-areas/:serviceAreaId/edit`, `/stores`, `/stores/new`, `/stores/:storeId`, `/stores/:storeId/edit`.
2. Wrap routes with `ProtectedRoute` and `CanAccess` using `locations:read` / `stores:read` as appropriate.
3. Mount under dashboard layout children in `admin.routes.tsx`.

**Acceptance criteria:**
- 10 store-module routes registered; placeholder stores list no longer the only `/stores` handler.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`
- `rg "/locations/cities" apps/admin-dashboard/src`

**Depends on:** Ticket 2.

---

## Ticket 13 — Inventory routes and admin route registration

**Ticket:** 13 — Inventory routes and admin route registration

**Objective:** Define store-product and inventory React Router paths; register in admin routes.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/routes/inventory.routes.tsx` (create)
- `apps/admin-dashboard/src/routes/admin.routes.tsx` (update — import `inventoryRoutes`)

**API endpoints:** None (routing only).

**DB fields:** None.

**Implementation steps:**
1. Paths per PDF page 248: `/store-products`, `/store-products/new`, `/store-products/:storeProductId/edit`, `/inventory/stocks`, `/inventory/stocks/new`, `/inventory/stocks/:inventoryStockId`, `/inventory/stocks/:inventoryStockId/edit`, `/inventory/movements`, `/inventory/movements/:movementId`, `/inventory/locks`, `/inventory/locks/:lockId`.
2. Permission gates: `store_products:read`, `inventory:read` on list/detail routes; create/update routes use respective permissions.

**Acceptance criteria:**
- 11 inventory-module routes registered with auth guards.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`
- `rg "/inventory/stocks" apps/admin-dashboard/src`

**Depends on:** Ticket 2.

---

## Ticket 14 — Sidebar navigation groups

**Ticket:** 14 — Sidebar navigation groups

**Objective:** Add Locations, Stores, and Inventory menu groups with permission-gated links.

**Files to create/update:**
- `apps/admin-dashboard/src/components/layout/Sidebar.tsx` (update)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. **Locations** group (requires `locations:read`): Cities → `/locations/cities`, Service Areas → `/locations/service-areas`.
2. **Stores** item (requires `stores:read`): → `/stores` (update existing top-level Stores link to new module list or remove duplicate).
3. **Inventory** group (requires `inventory:read`): Store Products → `/store-products`, Stock → `/inventory/stocks`, Movements → `/inventory/movements`, Locks → `/inventory/locks`.
4. Hide entire groups when user lacks base read permission.

**Acceptance criteria:**
- Sidebar matches PDF page 249–250; Catalog group unchanged.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 12–13.

---

## Ticket 15 — City React Query hooks

**Ticket:** 15 — City React Query hooks

**Objective:** List, detail, and mutation hooks for admin cities.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/hooks/useCities.ts` (create)
- `apps/admin-dashboard/src/modules/stores/hooks/useCityDetail.ts` (create)
- `apps/admin-dashboard/src/modules/stores/hooks/useCityMutations.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/locations/cities`
- `GET /api/v1/admin/locations/cities/:cityId`
- `POST /api/v1/admin/locations/cities`
- `PATCH /api/v1/admin/locations/cities/:cityId`
- `DELETE /api/v1/admin/locations/cities/:cityId`

**DB fields:** `cities.*` (read/write via API).

**Implementation steps:**
1. `useCities` — query key includes filter state; supports `page`, `limit`, `search`, `status`, `isServiceable`, `sortBy`, `sortOrder`.
2. `useCityDetail(cityId)` — enabled when id present.
3. `useCityMutations` — create/update/delete with query invalidation.

**Acceptance criteria:**
- Hooks mirror catalog module patterns; no pages yet.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 3, 8.

---

## Ticket 16 — Service area React Query hooks

**Ticket:** 16 — Service area React Query hooks

**Objective:** List, detail, and mutation hooks for admin service areas.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/hooks/useServiceAreas.ts` (create)
- `apps/admin-dashboard/src/modules/stores/hooks/useServiceAreaDetail.ts` (create)
- `apps/admin-dashboard/src/modules/stores/hooks/useServiceAreaMutations.ts` (create)

**API endpoints:**
- `GET|POST|GET|PATCH|DELETE /api/v1/admin/locations/service-areas` (+ `:serviceAreaId`)

**DB fields:** `service_areas.*`

**Implementation steps:**
1. List hook with `cityId`, `status`, `isServiceable`, pagination, search, sort.
2. Detail and mutations with cache invalidation for list and parent city views.

**Acceptance criteria:**
- Hooks complete; no pages yet.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 3, 8.

---

## Ticket 17 — Store React Query hooks

**Ticket:** 17 — Store React Query hooks

**Objective:** List, detail, and mutation hooks for admin stores.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/hooks/useStores.ts` (create)
- `apps/admin-dashboard/src/modules/stores/hooks/useStoreDetail.ts` (create)
- `apps/admin-dashboard/src/modules/stores/hooks/useStoreMutations.ts` (create)

**API endpoints:**
- `GET|POST|GET|PATCH|DELETE /api/v1/admin/stores` (+ `:storeId`)

**DB fields:** `stores.*`

**Implementation steps:**
1. List hook with filters: `vendorId`, `cityId`, `serviceAreaId`, `status`, `isOpen`, `isAcceptingOrders`, `storeType`, `fulfillmentType`, search, pagination, sort.
2. Detail and mutations.

**Acceptance criteria:**
- Hooks complete; no pages yet.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 4, 8.

---

## Ticket 18 — Store product React Query hooks

**Ticket:** 18 — Store product React Query hooks

**Objective:** List, detail, mutation, and bulk hooks for admin store products.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/hooks/useStoreProducts.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/hooks/useStoreProductDetail.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/hooks/useStoreProductMutations.ts` (create)

**API endpoints:**
- Store product CRUD + `POST /bulk-map`, `PATCH /bulk-price`, `PATCH /bulk-visibility`

**DB fields:** `store_products.*`

**Implementation steps:**
1. List hook with full filter set from PDF page 253.
2. Mutations include `bulkMap`, `bulkUpdatePrices`, `bulkUpdateVisibility` returning summary counts (created/skipped/failed per backend).

**Acceptance criteria:**
- Bulk mutations invalidate list queries.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 5, 9.

---

## Ticket 19 — Inventory stock React Query hooks

**Ticket:** 19 — Inventory stock React Query hooks

**Objective:** List, detail, mutation, adjust, and bulk hooks for inventory stocks.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/hooks/useInventoryStocks.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/hooks/useInventoryStockDetail.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/hooks/useInventoryStockMutations.ts` (create)

**API endpoints:**
- Stock CRUD + `POST .../adjust` + `POST /bulk-upload` + `PATCH /bulk-thresholds`

**DB fields:** `inventory_stocks.*`

**Implementation steps:**
1. List hook with low-stock/out-of-stock filters.
2. `adjustStock` mutation; bulk upload and bulk thresholds mutations with result summaries.

**Acceptance criteria:**
- Adjust invalidates stock detail and movement list queries.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 6, 9.

---

## Ticket 20 — Inventory movement and lock hooks

**Ticket:** 20 — Inventory movement and lock hooks

**Objective:** Read hooks for movements; list/detail/expire hooks for locks.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/hooks/useInventoryMovements.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/hooks/useInventoryMovementDetail.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/hooks/useInventoryLocks.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/hooks/useInventoryLockDetail.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/hooks/useInventoryLockMutations.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/inventory/movements`, `GET .../:movementId`
- `GET /api/v1/admin/inventory/locks`, `GET .../:lockId`, `POST /expire-due`

**DB fields:** `inventory_movements.*`, `inventory_locks.*`

**Implementation steps:**
1. Movement list supports date range and reference filters.
2. Lock list supports cart/order/customer filters.
3. `expireDueLocks` mutation shows processed/expired/failed summary per PDF page 277.

**Acceptance criteria:**
- No create/release/confirm lock UI (internal APIs only).

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 7, 9.

---

## Ticket 21 — Store permission utilities

**Ticket:** 21 — Store permission utilities

**Objective:** Permission helper functions for location and store UI gates.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/utils/store-permissions.util.ts` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Helpers: `canReadLocations`, `canCreateLocation`, `canUpdateLocation`, `canDeleteLocation`, `canReadStores`, `canCreateStore`, `canUpdateStore`, `canDeleteStore`.
2. Use `shouldRenderPermissionGatedContent` from access-control util (mirror catalog module).

**Acceptance criteria:**
- All `locations:*` and `stores:*` helpers exported.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 22 — Inventory permission utilities

**Ticket:** 22 — Inventory permission utilities

**Objective:** Permission helper functions for store-product and inventory UI gates.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/utils/inventory-permissions.util.ts` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Helpers: `canReadStoreProducts`, `canCreateStoreProduct`, `canUpdateStoreProduct`, `canDeleteStoreProduct`, `canBulkUpdateStoreProducts`, `canReadInventory`, `canCreateInventory`, `canUpdateInventory`, `canDeleteInventory`, `canAdjustInventory`, `canBulkUpdateInventory`.
2. Map `expire-due locks` to `canAdjustInventory` (`inventory:adjust`).

**Acceptance criteria:**
- Helpers align with PDF permission tables.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 23 — Store shared components and selects

**Ticket:** 23 — Store shared components and selects

**Objective:** Reusable badges and cascading selects for store module.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/components/StoreStatusBadge.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/components/CitySelect.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/components/ServiceAreaSelect.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/components/StoreSelect.tsx` (create)

**API endpoints:**
- `GET /api/v1/admin/locations/cities` (CitySelect)
- `GET /api/v1/admin/locations/service-areas` (ServiceAreaSelect — filter by `cityId`)
- `GET /api/v1/admin/stores` (StoreSelect)

**DB fields:** Filter active/serviceable entities by default per PDF page 258.

**Implementation steps:**
1. `StoreStatusBadge` — states: active, inactive, suspended, archived; store ops badges: open/closed, accepting orders.
2. Selects fetch options via hooks/API; `ServiceAreaSelect` accepts `cityId` prop; default to active + serviceable.

**Acceptance criteria:**
- Components usable in forms and list filters; no pages yet.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 15–17.

---

## Ticket 24 — Inventory shared components

**Ticket:** 24 — Inventory shared components

**Objective:** Reusable badges, selects, skeleton, empty, and error states for inventory module.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/components/InventoryStatusBadge.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/components/InventoryMovementBadge.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/components/StoreProductSelect.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/components/InventoryStockSelect.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/components/InventoryTableSkeleton.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/components/InventoryEmptyState.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/components/InventoryErrorState.tsx` (create)

**API endpoints:**
- `GET /api/v1/admin/store-products` (StoreProductSelect — filter by `storeId`)
- `GET /api/v1/admin/inventory/stocks` (InventoryStockSelect)

**DB fields:** None (presentation).

**Implementation steps:**
1. Badges for stock levels, movement types, lock status per PDF page 257.
2. Skeleton/empty/error reused on store-product, stock, movement, lock lists.

**Acceptance criteria:**
- Components render without pages; match catalog UX patterns.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 18–19.

---

## Ticket 25 — Location and store forms

**Ticket:** 25 — Location and store forms

**Objective:** Zod schemas and react-hook-form components for city, service area, and store.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/forms/city.schema.ts` (create)
- `apps/admin-dashboard/src/modules/stores/forms/CityForm.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/forms/service-area.schema.ts` (create)
- `apps/admin-dashboard/src/modules/stores/forms/ServiceAreaForm.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/forms/store.schema.ts` (create)
- `apps/admin-dashboard/src/modules/stores/forms/StoreForm.tsx` (create)

**API endpoints:** Form submit targets city/service-area/store CRUD endpoints.

**DB fields:** Form fields per PDF pages 259–261 (`cities.*`, `service_areas.*`, `stores.*`).

**Implementation steps:**
1. CityForm — required: name, state, country, timezone, currencyCode, status; `serviceRadiusKm > 0` when provided.
2. ServiceAreaForm — required: cityId, name, status; polygon JSON textarea optional with JSON array validation.
3. StoreForm — required fields per PDF; `temporaryClosureReason` required when `isOpen=false` or `isAcceptingOrders=false`.
4. Use `CitySelect`, `ServiceAreaSelect` where applicable.

**Acceptance criteria:**
- Forms validate client-side before submit; no pages yet.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 8, 10, 23.

---

## Ticket 26 — Store product and bulk forms

**Ticket:** 26 — Store product and bulk forms

**Objective:** Forms for single store product mapping and bulk map/price/visibility operations.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/forms/store-product.schema.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/StoreProductForm.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/BulkStoreProductMapForm.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/BulkStoreProductPriceForm.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/BulkStoreProductVisibilityForm.tsx` (create)

**API endpoints:**
- `POST /api/v1/admin/store-products`
- `PATCH /api/v1/admin/store-products/:storeProductId`
- `POST /api/v1/admin/store-products/bulk-map`
- `PATCH /api/v1/admin/store-products/bulk-price`
- `PATCH /api/v1/admin/store-products/bulk-visibility`
- `GET /api/v1/admin/catalog/products`, `GET /api/v1/admin/catalog/products/:productId/variants` (dropdowns)

**DB fields:** `store_products.*` per PDF pages 261–263.

**Implementation steps:**
1. StoreProductForm — store/product/variant selects; validate `sellingPrice <= mrp`, discount rules, required ids.
2. Bulk forms — dynamic `items[]` or id lists; show created/skipped/failed summary after submit.
3. Reuse `StoreSelect`; product dropdown from catalog API (read-only).

**Acceptance criteria:**
- All validations from PDF page 262 implemented.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 9, 11, 18, 23–24.

---

## Ticket 27 — Inventory stock and bulk forms

**Ticket:** 27 — Inventory stock and bulk forms

**Objective:** Forms for stock CRUD, manual adjustment, bulk upload, and bulk thresholds.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/forms/inventory-stock.schema.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/InventoryStockForm.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/inventory-adjustment.schema.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/InventoryAdjustmentForm.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/BulkInventoryUploadForm.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/BulkInventoryThresholdForm.tsx` (create)

**API endpoints:**
- Stock CRUD + adjust + bulk-upload + bulk-thresholds (see Ticket 6)

**DB fields:** `inventory_stocks.*`, adjustment creates `inventory_movements.*`

**Implementation steps:**
1. InventoryStockForm — `storeProductId` required; quantity fields `min 0`.
2. InventoryAdjustmentForm — `movementType`, `quantity > 0`, `reason` required; `adjustmentMode` when `manual_adjustment`.
3. Bulk upload/threshold forms with result summaries per PDF pages 264–265.

**Acceptance criteria:**
- Adjustment submits to `POST .../adjust` only (no direct movement create UI).

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 9, 11, 19, 24.

---

## Ticket 28 — City and service area pages

**Ticket:** 28 — City and service area pages

**Objective:** List, create, and edit pages for cities and service areas.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/pages/cities/CityListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/cities/CityCreatePage.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/cities/CityEditPage.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/service-areas/ServiceAreaListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/service-areas/ServiceAreaCreatePage.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/service-areas/ServiceAreaEditPage.tsx` (create)

**API endpoints:** City and service area CRUD (Ticket 3).

**DB fields:** `cities.*`, `service_areas.*` — columns and filters per PDF pages 265–267.

**Implementation steps:**
1. List pages — table, filters (search, status, isServiceable; service areas add cityId), URL query sync, pagination.
2. Permission-gated create/edit/delete using `ConfirmDeleteDialog` (reuse from common components).
3. Redirect after create/update to list routes.

**Acceptance criteria:**
- 6 pages wired to routes; loading/empty/error states present.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 12–16, 21, 25.

---

## Ticket 29 — Store pages

**Ticket:** 29 — Store pages

**Objective:** List, create, edit, and detail pages for stores.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/pages/stores/StoreListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/stores/StoreCreatePage.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/stores/StoreEditPage.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/stores/StoreDetailPage.tsx` (create)

**API endpoints:** Store CRUD (Ticket 4).

**DB fields:** `stores.*` — list columns and detail sections per PDF pages 268–270.

**Implementation steps:**
1. StoreListPage — filters: vendorId, cityId, serviceAreaId, status, isOpen, isAcceptingOrders, storeType, fulfillmentType.
2. StoreDetailPage — sections: Identity, Address & Location, Operations, Service Areas, System Information.
3. View action links to `/stores/:storeId`; edit/delete permission-gated.

**Acceptance criteria:**
- 4 store pages complete; replaces placeholder stores experience.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 12–14, 17, 21, 23, 25.

---

## Ticket 30 — Store product pages

**Ticket:** 30 — Store product pages

**Objective:** List, create, and edit pages for store products with bulk action entry points.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/pages/store-products/StoreProductListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/store-products/StoreProductCreatePage.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/store-products/StoreProductEditPage.tsx` (create)

**API endpoints:** Store product CRUD + bulk endpoints (Ticket 5).

**DB fields:** `store_products.*` — columns per PDF pages 270–272.

**Implementation steps:**
1. List — columns: Store, Product, Variant, SKU, MRP, Selling Price, Final Price, Available, Visible, Featured, Status, Updated At.
2. Bulk map/price/visibility buttons on list (modals using Ticket 26 forms); gated by `store_products:bulk_update`.
3. Filters synced to URL query params.

**Acceptance criteria:**
- 3 pages + bulk modals on list; no separate bulk routes.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 13–14, 18, 22, 24, 26.

---

## Ticket 31 — Inventory stock pages

**Ticket:** 31 — Inventory stock pages

**Objective:** List, create, edit, and detail pages for inventory stocks with adjust and bulk entry points.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/pages/stocks/InventoryStockListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/stocks/InventoryStockCreatePage.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/stocks/InventoryStockEditPage.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/stocks/InventoryStockDetailPage.tsx` (create)

**API endpoints:** Stock CRUD, adjust, bulk (Ticket 6); recent movements on detail via `GET /api/v1/admin/inventory/movements?inventoryStockId=...`

**DB fields:** `inventory_stocks.*` per PDF pages 273–275.

**Implementation steps:**
1. List — low-stock/out-of-stock columns; adjust action opens `InventoryAdjustmentForm` modal; bulk upload/thresholds buttons.
2. Detail — sections: Stock Summary, Quantities, Thresholds, Product Mapping, Recent Movements, System Information.
3. Permission gates: create `inventory:create`, adjust `inventory:adjust`, bulk `inventory:bulk_update`.

**Acceptance criteria:**
- 4 stock pages; adjust and bulk flows functional in UI.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 13–14, 19–20, 22, 24, 27.

---

## Ticket 32 — Inventory movement and lock pages

**Ticket:** 32 — Inventory movement and lock pages

**Objective:** Read-only movement list/detail; lock list/detail with expire-due action.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/pages/movements/InventoryMovementListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/movements/InventoryMovementDetailPage.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/locks/InventoryLockListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/locks/InventoryLockDetailPage.tsx` (create)

**API endpoints:**
- Movements: `GET` list + detail
- Locks: `GET` list + detail, `POST /expire-due`

**DB fields:** `inventory_movements.*`, `inventory_locks.*` per PDF pages 275–277.

**Implementation steps:**
1. MovementListPage — filters including date range; detail shows Movement Summary, Quantity Changes, Reference, Metadata.
2. LockListPage — expire-due button calls mutation; show processed/expired/failed summary toast/panel.
3. LockDetailPage — sections: Lock Summary, Customer/Cart/Order Linkage, Stock Linkage, Lifecycle.

**Acceptance criteria:**
- 4 read-focused pages; no movement create UI.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 13–14, 20, 22, 24.

---

## Ticket 33 — Error messages and query-param utilities

**Ticket:** 33 — Error messages and query-param utilities

**Objective:** Map backend error codes to user-facing messages; sync list filters to URL query params.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/utils/store-error-message.util.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/utils/inventory-error-message.util.ts` (create)
- `apps/admin-dashboard/src/modules/stores/utils/store-query-param.util.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/utils/inventory-query-param.util.ts` (create)
- List pages from Tickets 28–32 (update — wire utils and delete confirmation copy)

**API endpoints:** None (client utilities).

**DB fields:** None.

**Implementation steps:**
1. Map codes from `store-foundation-error-codes.md`, `store-product-mapping-error-codes.md`, `inventory-foundation-error-codes.md`, `inventory-locking-error-codes.md`.
2. Query param helpers: parse/serialize filters for each list page (mirror `catalog-query-param.util.ts`).
3. Delete confirmation strings for service area, store, store product, inventory stock per PDF page 281.

**Acceptance criteria:**
- All list pages use query-param util; API errors show mapped messages.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 28–32.

---

## Ticket 34 — Stores module UI tests

**Ticket:** 34 — Stores module UI tests

**Objective:** Co-located unit tests for city, service area, and store schemas, permissions, and key page behaviors.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/stores/city.schema.test.ts` (create)
- `apps/admin-dashboard/src/modules/stores/service-area.schema.test.ts` (create)
- `apps/admin-dashboard/src/modules/stores/store.schema.test.ts` (create)
- `apps/admin-dashboard/src/modules/stores/store-permissions.util.test.ts` (create)
- `apps/admin-dashboard/src/modules/stores/store-query-param.util.test.ts` (create)
- `apps/admin-dashboard/src/modules/stores/pages/cities/city-list-page.test.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/cities/city-form.test.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/service-areas/service-area-list-page.test.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/service-areas/service-area-form.test.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/stores/store-list-page.test.tsx` (create)
- `apps/admin-dashboard/src/modules/stores/pages/stores/store-form.test.tsx` (create)

**API endpoints:** Mock CRUD endpoints in tests.

**DB fields:** None.

**Implementation steps:**
1. Schema tests — required field validation per PDF pages 281–283.
2. List page tests — API called, create/delete hidden without permission.
3. Form tests — block submit when required missing; submit calls correct endpoint.

**Acceptance criteria:**
- Tests follow catalog module `node --test` pattern; no `__tests__/` folder required.

**Test commands:**
- See Ticket 36 `test:stores`

**Depends on:** Tickets 25, 28–29, 33.

---

## Ticket 35 — Inventory module UI tests

**Ticket:** 35 — Inventory module UI tests

**Objective:** Co-located unit tests for inventory schemas, permissions, and key page/form behaviors.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/inventory/store-product.schema.test.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/inventory-stock.schema.test.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/inventory-adjustment.schema.test.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/inventory-permissions.util.test.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/inventory-query-param.util.test.ts` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/store-products/store-product-form.test.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/store-products/store-product-list-page.test.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/stocks/inventory-stock-list-page.test.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/forms/inventory-adjustment-form.test.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/movements/inventory-movement-list-page.test.tsx` (create)
- `apps/admin-dashboard/src/modules/inventory/pages/locks/inventory-lock-list-page.test.tsx` (create)

**API endpoints:** Mock store-product, stock, movement, lock endpoints.

**DB fields:** None.

**Implementation steps:**
1. Store product form — block when `sellingPrice > mrp`; submit to `POST /api/v1/admin/store-products`.
2. Stock list — adjust hidden without `inventory:adjust`; bulk buttons hidden without `inventory:bulk_update`.
3. Lock list — expire-due hidden without `inventory:adjust`; calls `POST /expire-due`.

**Acceptance criteria:**
- Coverage matches PDF pages 283–284 test micro-tasks.

**Test commands:**
- See Ticket 36 `test:inventory`

**Depends on:** Tickets 26–27, 30–32, 33.

---

## Ticket 36 — Quality gates and npm test entrypoints

**Ticket:** 36 — Quality gates and npm test entrypoints

**Objective:** Add `test:stores` and `test:inventory` scripts; run admin-dashboard quality gates.

**Files to create/update:**
- `apps/admin-dashboard/package.json` — add `test:stores`, `test:inventory`
- `apps/admin-dashboard/tsconfig.stores-test.json` (create)
- `apps/admin-dashboard/tsconfig.inventory-test.json` (create)
- `.gitignore` (update — `dist-stores-test/`, `dist-inventory-test/` if needed)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:stores` — compile stores tests then `node --test` (mirror `test:catalog`).
2. `test:inventory` — compile inventory tests then `node --test`.
3. Regression: `test:catalog`, `test:access-control-smoke`, backend `test:categories`, `test:products`, `test:store-products`, `test:inventory`, `test:inventory-locks` unchanged.

**Acceptance criteria:**
- `npm run typecheck`, `lint`, `build`, `test:stores`, `test:inventory`, `test:catalog`, `test:access-control-smoke` pass in `apps/admin-dashboard`.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`
- `npm run lint -w apps/admin-dashboard`
- `npm run build -w apps/admin-dashboard`
- `npm run test:stores -w apps/admin-dashboard`
- `npm run test:inventory -w apps/admin-dashboard`
- `npm run test:catalog -w apps/admin-dashboard`
- `npm run test:access-control-smoke -w apps/admin-dashboard`

**Depends on:** Tickets 34–35.

---

## Ticket 37 — Module review, handoff, and project-context closeout

**Ticket:** 37 — Module review, handoff, and project-context closeout

**Objective:** Close Admin Dashboard Store & Inventory Foundation with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/admin-dashboard-store-inventory-foundation-review.md` (create)
- `docs/handoffs/admin-dashboard-store-inventory-foundation-complete.md` (create)
- `docs/reviews/phase-3-admin-dashboard-store-inventory-foundation-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md` (update)
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md` (update)
- `docs/testing/admin-dashboard-store-inventory-verification.md` — mark steps verified

**API endpoints:** Verify all consumer endpoints listed in Ticket 1 and PDF page 286 (35 admin endpoints).

**DB fields:** Verify UI reads/writes fields per PDF pages 287–288.

**Implementation steps:**
1. Verification table: 21 UI routes (locations 6 + stores 4 + store-products 3 + inventory 8), permissions, CRUD, bulk ops, stock adjust, expire-due locks.
2. List all API endpoints and DB fields in handoff per PDF pages 286–288.
3. Note pending: Vendor Panel store catalog UI (module 13), customer catalog UI (module 14).
4. Set next module: **Vendor Panel — Store Catalog Foundation**.

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- Tracker all DONE.
- No vendor-panel or customer-app screens started.

**Test commands:**
- All commands from Ticket 36

**Depends on:** Ticket 36.

---

## Dependency graph (summary)

```text
1 → 2 → 3,4,5,6,7 → 8,9 → 10,11
2 → 12,13 → 14
3,8 → 15,16 | 4,8 → 17 | 5,9 → 18 | 6,9 → 19 | 7,9 → 20
2 → 21,22
15–17 → 23 | 18–19 → 24
8,10,23 → 25 | 9,11,18,23–24 → 26 | 9,11,19,24 → 27
12–16,21,25 → 28 | 12–14,17,21,23,25 → 29
13–14,18,22,24,26 → 30 | 13–14,19–20,22,24,27 → 31 | 13–14,20,22,24 → 32
28–32 → 33
25,28–29,33 → 34 | 26–27,30–32,33 → 35
34–35 → 36 → 37
```

**Critical path:** 1 → 2 → 3 → 8 → 15 → 25 → 28 → 34 → 36 → 37  
(Parallel: 4–7 API clients; 9–11 types/constants; 12–14 routes/sidebar; 18–20 inventory hooks; 29–32 remaining pages)

**Cross-module order:** Store Foundation + Store Product Mapping + Inventory Foundation + Inventory Locking backends (modules 6–9) and Admin Catalog UI (module 11) must be complete before this module; this module before Vendor Panel Store Catalog UI (module 13).
