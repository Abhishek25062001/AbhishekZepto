# Phase 3 Vendor Panel — Store Catalog Foundation — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Vendor Panel — Store Catalog Foundation  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 289–318  

**Architecture references:**  
`docs/contracts/catalog-vendor-api-contract.md`, `docs/contracts/store-product-mapping-api.md`, `docs/contracts/inventory-foundation-api.md`, `docs/security/catalog-permissions.md`, `docs/security/store-product-mapping-permissions.md`, `docs/security/inventory-foundation-permissions.md`, `docs/errors/store-product-mapping-error-codes.md`, `docs/errors/inventory-foundation-error-codes.md`, `docs/errors/catalog-error-codes.md`, `docs/architecture/tenant-store-access-architecture.md`, `docs/handoffs/admin-dashboard-store-inventory-foundation-complete.md`, `docs/handoffs/store-product-mapping-backend-complete.md`, `docs/handoffs/inventory-foundation-backend-complete.md`

**Prerequisites (already in repo):**  
Phase 2 Vendor Panel auth, RBAC (`CanAccess`), React Query, axios `apiClient`, vendor scope from auth context; vendor store-product APIs (`/api/v1/vendor/store-products`); vendor inventory APIs (`/api/v1/vendor/inventory/*`). Vendor catalog read APIs are defined in `docs/contracts/catalog-vendor-api-contract.md` (contract status **PLANNED** — UI tickets wire to documented paths; live catalog browse requires backend vendor catalog routes to be mounted).

**Out of scope for this module:**  
Customer App catalog UI (module 14), Admin Dashboard changes, backend API implementation (unless explicitly required for docs-only alignment), `packages/shared` TypeScript files, Repository & Codebase Setup, cart/checkout/order picking, vendor global catalog mutations (create/update/delete products), admin bulk store-product operations, inventory lock admin UI, media upload UI.

**Execution order notes:**
- Run **Ticket 1** (docs) before implementation tickets.
- Run **Tickets 3–5** (API clients) before **Tickets 14–19** (hooks).
- Run **Tickets 6–10** (types/constants) before **Tickets 22–24** (forms/pages).
- Run **Tickets 11–12** (routes) before **Tickets 25–28** (pages); update **Ticket 13** (sidebar) after routes exist.
- Run **Tickets 20–21** (shared components) before forms and pages.
- Run **Ticket 18** (permission utils) before pages with action visibility.
- Vendor catalog screens are **read-only** — no create/edit/delete controls for global `products` / `product_variants`.
- Vendor may only **update** store-product `availability` and `price` (blocked when `isPriceLocked`).
- Vendor inventory adjust allows movement types: `stock_in`, `stock_out`, `damaged`, `expired`, `correction` only (not reservation types).
- PDF paths use `__tests__/`; repo convention is co-located `*.test.ts` / `*.test.tsx` under `apps/vendor-panel/src/modules/store-catalog/` and `store-inventory/`.
- Replace placeholder `apps/vendor-panel/src/pages/products/ProductsPage.tsx` and `pages/inventory/InventoryPage.tsx` when module routes mount (Tickets 11–12).
- PDF places route files under `modules/*/routes/`; may register via `src/routes/store-catalog.routes.tsx` and `src/routes/store-inventory.routes.tsx` mirroring admin-dashboard pattern if cleaner — paths in tickets list PDF module paths; implementer may colocate under `src/routes/` with same route URLs.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE`

---

## Ticket 1 — Vendor Panel store catalog foundation docs

**Ticket:** 1 — Vendor Panel store catalog foundation docs

**Objective:** Document UI scope, routes, permissions, tenant scope rules, and API wiring (no React implementation).

**Files to create/update:**
- `docs/architecture/vendor-panel-store-catalog-foundation.md` (create)
- `docs/contracts/vendor-panel-store-catalog-ui-contract.md` (create)
- `docs/testing/vendor-panel-store-catalog-verification.md` (create)
- `docs/security/catalog-permissions.md` — add Vendor Panel UI matrix (`catalog:read` only)
- `docs/security/store-product-mapping-permissions.md` — add Vendor Panel UI matrix
- `docs/security/inventory-foundation-permissions.md` — add Vendor Panel UI matrix

**API endpoints:** Document consumer usage only (PDF page 317):
- Catalog (read-only): `GET /api/v1/vendor/catalog/categories`, `GET /api/v1/vendor/catalog/brands`, `GET /api/v1/vendor/catalog/products`, `GET /api/v1/vendor/catalog/products/:productId`, `GET /api/v1/vendor/catalog/products/:productId/variants`
- Store products: `GET /api/v1/vendor/store-products`, `GET .../:storeProductId`, `PATCH .../:storeProductId/availability`, `PATCH .../:storeProductId/price`
- Inventory: `GET /api/v1/vendor/inventory/stocks`, `GET .../:inventoryStockId`, `POST .../:inventoryStockId/adjust`, `GET /api/v1/vendor/inventory/movements`

**DB fields:** Document fields per PDF pages 317–318: `products.*`, `product_variants.*`, `store_products.*`, `inventory_stocks.*`, `inventory_movements.*` (display/update only where API allows).

**Implementation steps:**
1. Route map (12 screens): store-catalog (2), store-products (4), inventory (6).
2. Permission gates: `catalog:read`, `store_products:read|update`, `inventory:read|update`.
3. Tenant-scope verification note: vendor APIs must return only vendor/store-scoped records.
4. Manual QA checklist (auth, scope, read-only catalog, price lock, adjust stock, low/out-of-stock indicators).
5. Note pending: Customer App catalog UI (module 14); vendor catalog backend routes PLANNED per contract.

**Acceptance criteria:**
- Docs match PDF micro-tasks; no new `apps/vendor-panel` feature code.

**Test commands:**
- `test -f docs/architecture/vendor-panel-store-catalog-foundation.md && test -f docs/contracts/vendor-panel-store-catalog-ui-contract.md && echo PASS`

**Depends on:** Admin Dashboard — Store & Inventory Foundation complete.

---

## Ticket 2 — Store catalog and store inventory module scaffold

**Ticket:** 2 — Store catalog and store inventory module scaffold

**Objective:** Create `modules/store-catalog/` and `modules/store-inventory/` folder layouts per PDF.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/api/` (create)
- `apps/vendor-panel/src/modules/store-catalog/components/` (create)
- `apps/vendor-panel/src/modules/store-catalog/forms/` (create)
- `apps/vendor-panel/src/modules/store-catalog/hooks/` (create)
- `apps/vendor-panel/src/modules/store-catalog/pages/` (create)
- `apps/vendor-panel/src/modules/store-catalog/types/` (create)
- `apps/vendor-panel/src/modules/store-catalog/utils/` (create)
- `apps/vendor-panel/src/modules/store-catalog/constants/` (create)
- `apps/vendor-panel/src/modules/store-catalog/routes/` (create — optional if using `src/routes/`)
- `apps/vendor-panel/src/modules/store-inventory/api/` (create)
- `apps/vendor-panel/src/modules/store-inventory/components/` (create)
- `apps/vendor-panel/src/modules/store-inventory/forms/` (create)
- `apps/vendor-panel/src/modules/store-inventory/hooks/` (create)
- `apps/vendor-panel/src/modules/store-inventory/pages/` (create)
- `apps/vendor-panel/src/modules/store-inventory/types/` (create)
- `apps/vendor-panel/src/modules/store-inventory/utils/` (create)
- `apps/vendor-panel/src/modules/store-inventory/constants/` (create)
- `apps/vendor-panel/src/modules/store-inventory/routes/` (create — optional)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Create empty folder trees only.
2. No pages, hooks, or API methods yet.

**Acceptance criteria:**
- Both module trees exist; `npm run typecheck -w apps/vendor-panel` unaffected.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 1.

---

## Ticket 3 — Vendor catalog API client

**Ticket:** 3 — Vendor catalog API client

**Objective:** Axios read-only client for vendor global catalog browse.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/api/vendor-catalog.api.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/catalog/categories`
- `GET /api/v1/vendor/catalog/brands`
- `GET /api/v1/vendor/catalog/products`
- `GET /api/v1/vendor/catalog/products/:productId`
- `GET /api/v1/vendor/catalog/products/:productId/variants`

**DB fields:** None (transport only).

**Implementation steps:**
1. Methods: `getVendorCatalogCategories`, `getVendorCatalogBrands`, `getVendorCatalogProducts`, `getVendorCatalogProductById`, `getVendorCatalogProductVariants`.
2. Product list query: `page`, `limit`, `search`, `categoryId`, `subcategoryId`, `brandId`, `foodType`, `status`, `isVisible`, `isFeatured`, `sortBy`, `sortOrder`.
3. Unwrap `{ success, data, meta }` per backend response format.

**Acceptance criteria:**
- All 5 read methods typed per `docs/contracts/catalog-vendor-api-contract.md`; no write methods.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 2.

---

## Ticket 4 — Vendor store product API client

**Ticket:** 4 — Vendor store product API client

**Objective:** Axios client for vendor store product list, detail, availability, and price updates.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/api/vendor-store-product.api.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/store-products`
- `GET /api/v1/vendor/store-products/:storeProductId`
- `PATCH /api/v1/vendor/store-products/:storeProductId/availability`
- `PATCH /api/v1/vendor/store-products/:storeProductId/price`

**DB fields:** None (transport only).

**Implementation steps:**
1. List query: `page`, `limit`, `search`, `productId`, `variantId`, `categoryId`, `brandId`, `status`, `isAvailable`, `isVisible`, `isFeatured`, `sortBy`, `sortOrder`.
2. Typed payloads for availability and price PATCH bodies.

**Acceptance criteria:**
- Four methods match `docs/contracts/store-product-mapping-api.md` vendor section.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 2.

---

## Ticket 5 — Vendor inventory API client

**Ticket:** 5 — Vendor inventory API client

**Objective:** Axios client for vendor inventory stocks, adjust, and movements.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-inventory/api/vendor-inventory.api.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/inventory/stocks`
- `GET /api/v1/vendor/inventory/stocks/:inventoryStockId`
- `POST /api/v1/vendor/inventory/stocks/:inventoryStockId/adjust`
- `GET /api/v1/vendor/inventory/movements`

**DB fields:** None (transport only).

**Implementation steps:**
1. Stock list query: `page`, `limit`, `search`, `storeProductId`, `productId`, `variantId`, `sku`, `isLowStock`, `isOutOfStock`, `status`, `sortBy`, `sortOrder`.
2. Movement list query: `page`, `limit`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `movementType`, `referenceType`, `referenceId`, `fromDate`, `toDate`, `sortBy`, `sortOrder`.
3. Adjust payload: `movementType`, `quantity`, `reason`, `notes`.

**Acceptance criteria:**
- All methods typed per vendor inventory contract; no admin-only bulk endpoints.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 2.

---

## Ticket 6 — Vendor catalog types

**Ticket:** 6 — Vendor catalog types

**Objective:** TypeScript types for vendor catalog category, brand, product, and variant responses.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/types/vendor-catalog.types.ts` (create)

**API endpoints:** None (types only).

**DB fields:**
- Categories: `id`, `name`, `slug`, `description`, `parentCategoryId`, `level`, `displayOrder`, `iconUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`, timestamps
- Brands: `id`, `name`, `slug`, `description`, `logoUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`, timestamps
- Products: `id`, `name`, `slug`, `description`, `shortDescription`, `categoryId`, `subcategoryId`, `brandId`, `productType`, `foodType`, `taxCategoryId`, `hsnCode`, `searchKeywords`, `tags`, `defaultImageUrl`, `imageUrls`, `attributeSummary`, `isFeatured`, `isVisible`, `approvalStatus`, `status`, timestamps
- Variants: `id`, `productId`, `variantName`, `sku`, `barcode`, `unit`, `unitValue`, `mrp`, `defaultSellingPrice`, `weightInGrams`, dimensions, `imageUrl`, `attributeValues`, `isDefault`, `isVisible`, `status`, timestamps

**Implementation steps:**
1. List query types for catalog products.
2. No form create payloads (read-only module).

**Acceptance criteria:**
- Types cover PDF pages 291–292 field lists.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 3.

---

## Ticket 7 — Vendor store product types

**Ticket:** 7 — Vendor store product types

**Objective:** TypeScript types for vendor store product responses and update payloads.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/types/vendor-store-product.types.ts` (create)

**API endpoints:** None (types only).

**DB fields:**
- Response: `store_products.*` per PDF page 293 (`storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `sku`, `storeSku`, pricing, flags, timestamps)
- `VendorAvailabilityUpdatePayload`: `isAvailable`, `isVisible`, `status`
- `VendorPriceUpdatePayload`: `mrp`, `sellingPrice`, `discountType`, `discountValue`

**Implementation steps:**
1. List query type aligned with Ticket 4.
2. Include `isPriceLocked` on response for UI disable logic.

**Acceptance criteria:**
- Payload types match backend validators for PATCH availability/price.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 4.

---

## Ticket 8 — Vendor inventory types

**Ticket:** 8 — Vendor inventory types

**Objective:** TypeScript types for vendor inventory stock, movement, and adjustment payloads.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-inventory/types/vendor-inventory.types.ts` (create)

**API endpoints:** None (types only).

**DB fields:**
- Stock: `inventory_stocks.*` per PDF pages 294, 318
- Movement: `inventory_movements.*` per PDF pages 294, 318
- Adjustment payload: `movementType`, `quantity`, `reason`, `notes`

**Implementation steps:**
1. Restrict `movementType` union to vendor-allowed values for forms.

**Acceptance criteria:**
- Types align with vendor inventory API contract.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 5.

---

## Ticket 9 — Store catalog constants

**Ticket:** 9 — Store catalog constants

**Objective:** Status and enum constants for vendor catalog and store products.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/constants/vendor-store-product.constants.ts` (create)

**API endpoints:** None.

**DB fields:** Enums for product `approvalStatus`, `status`; store product `status`; `discountType`.

**Implementation steps:**
1. Store product status: `active`, `inactive`, `archived`.
2. Discount type: `none`, `flat`, `percentage`.
3. Catalog approval badges: `approved`, `pending_review`, `rejected` (display only).
4. Export label maps for badges and selects.

**Acceptance criteria:**
- Constants match PDF page 295 and catalog vendor contract filters.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 6–7.

---

## Ticket 10 — Store inventory constants

**Ticket:** 10 — Store inventory constants

**Objective:** Status, movement type, and reference type constants for vendor inventory UI.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-inventory/constants/vendor-inventory.constants.ts` (create)

**API endpoints:** None.

**DB fields:** `inventory_stocks.status`; movement types; reference types.

**Implementation steps:**
1. Stock status: `active`, `inactive`, `archived`.
2. **Vendor-allowed** movement types: `stock_in`, `stock_out`, `damaged`, `expired`, `correction`.
3. Reference types: `manual`, `order`, `cart`, `return`, `system`, `seed`, `import` (display on movement list).
4. Stock level labels: `low_stock`, `out_of_stock`, `in_stock`, `reserved`.

**Acceptance criteria:**
- Adjustment form dropdown uses only vendor-allowed movement types per PDF page 304.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 8.

---

## Ticket 11 — Store catalog routes and vendor route registration

**Ticket:** 11 — Store catalog routes and vendor route registration

**Objective:** Define store-catalog and store-product React Router paths; register in vendor routes; replace placeholder products page.

**Files to create/update:**
- `apps/vendor-panel/src/routes/store-catalog.routes.tsx` (create — or `modules/store-catalog/routes/store-catalog.routes.ts` per PDF)
- `apps/vendor-panel/src/routes/vendor.routes.tsx` (update — import `storeCatalogRoutes`, remove placeholder `/products`)

**API endpoints:** None (routing only).

**DB fields:** None.

**Implementation steps:**
1. Paths per PDF page 296–297: `/store-catalog` (redirect to `/store-catalog/products`), `/store-catalog/products`, `/store-catalog/products/:productId`, `/store-products`, `/store-products/:storeProductId`, `/store-products/:storeProductId/price`, `/store-products/:storeProductId/availability`.
2. `CanAccess`: catalog routes `catalog:read`; store-product routes `store_products:read` (update routes add `store_products:update`).
3. Legacy `/products` redirects to `/store-catalog/products`.

**Acceptance criteria:**
- 7 store-catalog module routes registered with auth guards.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`
- `rg "/store-catalog/products" apps/vendor-panel/src`

**Depends on:** Ticket 2.

---

## Ticket 12 — Store inventory routes and vendor route registration

**Ticket:** 12 — Store inventory routes and vendor route registration

**Objective:** Define inventory React Router paths; register in vendor routes; replace placeholder inventory page.

**Files to create/update:**
- `apps/vendor-panel/src/routes/store-inventory.routes.tsx` (create — or `modules/store-inventory/routes/store-inventory.routes.ts`)
- `apps/vendor-panel/src/routes/vendor.routes.tsx` (update — import `storeInventoryRoutes`)

**API endpoints:** None (routing only).

**DB fields:** None.

**Implementation steps:**
1. Paths: `/inventory` (redirect to `/inventory/stocks`), `/inventory/stocks`, `/inventory/stocks/:inventoryStockId`, `/inventory/stocks/:inventoryStockId/adjust`, `/inventory/movements`.
2. Permissions: list/detail `inventory:read`; adjust route `inventory:update`.
3. Legacy `/inventory` placeholder replaced by module stock list.

**Acceptance criteria:**
- 5 inventory routes registered; adjust route gated by `inventory:update`.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`
- `rg "/inventory/stocks" apps/vendor-panel/src`

**Depends on:** Ticket 2.

---

## Ticket 13 — Sidebar navigation updates

**Ticket:** 13 — Sidebar navigation updates

**Objective:** Update Vendor Panel sidebar with Store Catalog and Inventory links; remove legacy Products label path.

**Files to create/update:**
- `apps/vendor-panel/src/components/layout/Sidebar.tsx` (update)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. **Store Catalog** menu item → `/store-catalog/products`; hide if user lacks `catalog:read` (catalog browse) — store-product list may use `store_products:read` for `/store-products` (add second item or grouped submenu per PDF page 297).
2. PDF: sidebar items **Store Catalog** (`catalog:read`) and **Inventory** (`inventory:read`).
3. Add **Store Products** link → `/store-products` gated by `store_products:read`.
4. Update **Inventory** link from `/inventory` to `/inventory/stocks`.

**Acceptance criteria:**
- Sidebar matches PDF; permission-gated visibility.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 11–12.

---

## Ticket 14 — Vendor catalog product hooks

**Ticket:** 14 — Vendor catalog product hooks

**Objective:** React Query hooks for vendor catalog product list and detail.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/hooks/useVendorCatalogProducts.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/hooks/useVendorCatalogProductDetail.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/catalog/products`
- `GET /api/v1/vendor/catalog/products/:productId`

**DB fields:** `products.*` (read)

**Implementation steps:**
1. List hook with URL query sync (`page`, `limit`, `search`, filters from PDF page 298).
2. Detail hook enabled when `productId` present.
3. Detail page will load variants separately (Ticket 15).

**Acceptance criteria:**
- Hooks mirror admin-dashboard list/detail patterns.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 3, 6.

---

## Ticket 15 — Vendor catalog filter hooks

**Ticket:** 15 — Vendor catalog filter hooks

**Objective:** Hook to load category, brand, and variant filter options for catalog and store-product lists.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/hooks/useVendorCatalogFilters.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/catalog/categories`
- `GET /api/v1/vendor/catalog/brands`
- `GET /api/v1/vendor/catalog/products/:productId/variants`

**DB fields:** Filter option ids/names from categories, brands, variants.

**Implementation steps:**
1. Expose `categories`, `brands`, `getVariants(productId)` for filter dropdowns and product detail variant table.
2. Cache with React Query; staleTime reasonable for master data.

**Acceptance criteria:**
- Filter hook used by catalog product list and store product list pages.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 3.

---

## Ticket 16 — Vendor store product hooks

**Ticket:** 16 — Vendor store product hooks

**Objective:** List, detail, and mutation hooks for vendor store products.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/hooks/useVendorStoreProducts.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/hooks/useVendorStoreProductDetail.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/hooks/useVendorStoreProductMutations.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/store-products`
- `GET /api/v1/vendor/store-products/:storeProductId`
- `PATCH .../availability`
- `PATCH .../price`

**DB fields:** `store_products.*`

**Implementation steps:**
1. List hook with filters from PDF page 298–299.
2. Mutations: `updateAvailability`, `updatePrice` with query invalidation.
3. Handle `STORE_PRODUCT_PRICE_LOCKED` error for price mutation.

**Acceptance criteria:**
- No create/delete mutations.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 4, 7.

---

## Ticket 17 — Vendor inventory stock hooks

**Ticket:** 17 — Vendor inventory stock hooks

**Objective:** List and detail hooks for vendor inventory stocks.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-inventory/hooks/useVendorInventoryStocks.ts` (create)
- `apps/vendor-panel/src/modules/store-inventory/hooks/useVendorInventoryStockDetail.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/inventory/stocks`
- `GET /api/v1/vendor/inventory/stocks/:inventoryStockId`

**DB fields:** `inventory_stocks.*`

**Implementation steps:**
1. List hook with filters from PDF page 300.
2. Detail hook for stock detail and adjustment pages.

**Acceptance criteria:**
- Hooks scoped to vendor context (no cross-vendor ids in UI).

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 5, 8.

---

## Ticket 18 — Vendor inventory movement and mutation hooks

**Ticket:** 18 — Vendor inventory movement and mutation hooks

**Objective:** Movement list hook and stock adjustment mutation hook.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-inventory/hooks/useVendorInventoryMovements.ts` (create)
- `apps/vendor-panel/src/modules/store-inventory/hooks/useVendorInventoryMutations.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/inventory/movements`
- `POST /api/v1/vendor/inventory/stocks/:inventoryStockId/adjust`

**DB fields:** `inventory_movements.*`; adjustment creates movement records.

**Implementation steps:**
1. Movement list with date range and reference filters (PDF page 300).
2. `adjustStock` mutation invalidates stock detail and movement queries.

**Acceptance criteria:**
- No admin bulk upload/threshold mutations.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 5, 8.

---

## Ticket 19 — Vendor permission utilities

**Ticket:** 19 — Vendor permission utilities

**Objective:** Permission helper functions for catalog, store-product, and inventory UI gates.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/utils/vendor-catalog-permissions.util.ts` (create)
- `apps/vendor-panel/src/modules/store-inventory/utils/vendor-inventory-permissions.util.ts` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Catalog: `canReadCatalog`.
2. Store product: `canReadStoreProducts`, `canUpdateStoreProducts`.
3. Inventory: `canReadInventory`, `canUpdateInventory`.
4. Use `shouldRenderPermissionGatedContent` from vendor access-control util.

**Acceptance criteria:**
- Helpers align with PDF page 297 permission table.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 2.

---

## Ticket 20 — Store catalog shared components

**Ticket:** 20 — Store catalog shared components

**Objective:** Reusable badges, search, pagination, product cards, and loading/error states for store-catalog module.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/components/VendorCatalogStatusBadge.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/components/VendorCatalogSearchInput.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/components/VendorCatalogPagination.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/components/VendorProductCard.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/components/VendorStoreProductPriceCard.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/components/VendorStoreProductAvailabilityCard.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/components/VendorCatalogTableSkeleton.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/components/VendorCatalogEmptyState.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/components/VendorCatalogErrorState.tsx` (create)

**API endpoints:** None (presentation).

**DB fields:** Display fields per PDF pages 301–302 (`defaultImageUrl`, `name`, pricing, availability flags).

**Implementation steps:**
1. `VendorCatalogStatusBadge` — product approval, visibility, availability states per PDF page 301.
2. Search input syncs `search` URL param.
3. Pagination syncs `page` and `limit`.
4. Product card shows image, name, category, brand, type, food type, status.

**Acceptance criteria:**
- Components render without pages; reusable on list/detail.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 9, 14.

---

## Ticket 21 — Store inventory shared components

**Ticket:** 21 — Store inventory shared components

**Objective:** Reusable inventory badges, summary cards, alerts, and loading/error states.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-inventory/components/VendorInventoryStatusBadge.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/components/VendorInventoryMovementBadge.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/components/VendorStockSummaryCards.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/components/VendorLowStockAlert.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/components/VendorInventoryTableSkeleton.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/components/VendorInventoryEmptyState.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/components/VendorInventoryErrorState.tsx` (create)

**API endpoints:** None.

**DB fields:** Quantity fields for summary cards; `isLowStock`, `isOutOfStock` for alerts.

**Implementation steps:**
1. Summary cards: available, reserved, damaged, expired, total (PDF page 303).
2. `VendorLowStockAlert` when `isLowStock` or `isOutOfStock`.
3. Movement badge supports vendor-allowed movement types.

**Acceptance criteria:**
- Components used by stock list and detail pages.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Ticket 10.

---

## Ticket 22 — Vendor store product forms

**Ticket:** 22 — Vendor store product forms

**Objective:** Zod schemas and forms for availability and price updates (vendor-scoped mutations only).

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/forms/vendor-store-product-availability.schema.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/forms/VendorStoreProductAvailabilityForm.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/forms/vendor-store-product-price.schema.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/forms/VendorStoreProductPriceForm.tsx` (create)

**API endpoints:**
- `PATCH /api/v1/vendor/store-products/:storeProductId/availability`
- `PATCH /api/v1/vendor/store-products/:storeProductId/price`

**DB fields:** `store_products.isAvailable`, `isVisible`, `status`; `mrp`, `sellingPrice`, `discountType`, `discountValue`; `isPriceLocked`.

**Implementation steps:**
1. Availability form — at least one field changed; status enum validation (PDF page 303).
2. Price form — `sellingPrice <= mrp`, discount rules, disabled when `isPriceLocked` (PDF page 304).
3. Warning message when `isPriceLocked` on price form.
4. Optimistic disabled submit + duplicate submit prevention (PDF page 313).

**Acceptance criteria:**
- Forms validate client-side before PATCH.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 7, 9, 16.

---

## Ticket 23 — Vendor inventory adjustment form

**Ticket:** 23 — Vendor inventory adjustment form

**Objective:** Zod schema and form for vendor stock adjustment.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-inventory/forms/vendor-inventory-adjustment.schema.ts` (create)
- `apps/vendor-panel/src/modules/store-inventory/forms/VendorInventoryAdjustmentForm.tsx` (create)

**API endpoints:**
- `POST /api/v1/vendor/inventory/stocks/:inventoryStockId/adjust`

**DB fields:** Creates `inventory_movements.*`; updates `inventory_stocks` quantities.

**Implementation steps:**
1. Fields: `movementType`, `quantity`, `reason`, `notes`.
2. Movement type dropdown restricted to vendor-allowed types only.
3. Validate `quantity > 0`, `reason` required.
4. Warning when `movementType = stock_out` and quantity exceeds available (PDF page 313).
5. Optimistic disabled submit + duplicate prevention.

**Acceptance criteria:**
- Form submits only to vendor adjust endpoint.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 8, 10, 18.

---

## Ticket 24 — Vendor catalog pages

**Ticket:** 24 — Vendor catalog pages

**Objective:** Read-only global catalog product list and detail pages for vendors.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/pages/VendorCatalogProductListPage.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/pages/VendorCatalogProductDetailPage.tsx` (create)

**API endpoints:**
- `GET /api/v1/vendor/catalog/products`
- `GET /api/v1/vendor/catalog/products/:productId`
- `GET /api/v1/vendor/catalog/products/:productId/variants`

**DB fields:** `products.*`, `product_variants.*` per PDF pages 305–306.

**Implementation steps:**
1. List — columns: Image, Product, Category, Brand, Product Type, Food Type, Status, Actions (view only); filters: search, categoryId, subcategoryId, brandId, foodType, status; **no** create/edit/delete controls (PDF page 314).
2. Detail — sections: Basic Information, Category & Brand, Images, Variants, Search Metadata; variant table from variants API.
3. View action → `/store-catalog/products/:productId`.
4. URL query sync, skeleton/empty/error states.

**Acceptance criteria:**
- Read-only; no global catalog mutation UI.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 11–15, 19–20.

---

## Ticket 25 — Vendor store product pages

**Ticket:** 25 — Vendor store product pages

**Objective:** Store product list, detail, dedicated price, and availability pages.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/pages/VendorStoreProductListPage.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/pages/VendorStoreProductDetailPage.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/pages/VendorStoreProductPricePage.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/pages/VendorStoreProductAvailabilityPage.tsx` (create)

**API endpoints:**
- `GET /api/v1/vendor/store-products`
- `GET /api/v1/vendor/store-products/:storeProductId`
- `PATCH .../availability`
- `PATCH .../price`

**DB fields:** `store_products.*` per PDF pages 306–308.

**Implementation steps:**
1. List — columns per PDF; filters; actions: detail, price edit (`store_products:update`), availability edit (`store_products:update`); hide when lacking permission.
2. Detail — sections: Product Linkage, Price, Availability, Store Scope, System Information; link to `/inventory/stocks?storeProductId=...`.
3. Price/Availability pages — load detail, render forms, redirect to detail on success.
4. Use `VendorStoreProductPriceCard` and `VendorStoreProductAvailabilityCard` on detail.

**Acceptance criteria:**
- 4 pages wired to routes; price form disabled when `isPriceLocked`.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 11–13, 16, 19–20, 22.

---

## Ticket 26 — Vendor inventory pages

**Ticket:** 26 — Vendor inventory pages

**Objective:** Inventory stock list/detail, adjustment page, and movement list page.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-inventory/pages/VendorInventoryStockListPage.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/pages/VendorInventoryStockDetailPage.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/pages/VendorInventoryAdjustmentPage.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/pages/VendorInventoryMovementListPage.tsx` (create)

**API endpoints:**
- Stock list/detail/adjust + movements list (Tickets 5, 17–18)

**DB fields:** `inventory_stocks.*`, `inventory_movements.*` per PDF pages 309–311.

**Implementation steps:**
1. Stock list — columns per PDF; low-stock and out-of-stock visual indicators; adjust action gated by `inventory:update`.
2. Detail — sections: Stock Summary, Quantities, Thresholds, Product Mapping, Recent Movements, System Information; recent movements panel via movements API filtered by `inventoryStockId`.
3. Adjustment page — render `VendorInventoryAdjustmentForm`; redirect to stock detail on success.
4. Movement list — columns and filters per PDF; URL query sync.

**Acceptance criteria:**
- 4 pages complete; no lock or admin bulk UI.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 12–13, 17–18, 21, 23.

---

## Ticket 27 — Error messages and query-param utilities

**Ticket:** 27 — Error messages and query-param utilities

**Objective:** Map backend errors to user messages; sync list filters to URL query params; breadcrumb config.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/utils/vendor-catalog-error-message.util.ts` (create)
- `apps/vendor-panel/src/modules/store-inventory/utils/vendor-inventory-error-message.util.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/utils/vendor-catalog-query-param.util.ts` (create)
- `apps/vendor-panel/src/modules/store-inventory/utils/vendor-inventory-query-param.util.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/constants/vendor-breadcrumbs.constants.ts` (create — optional)
- List pages from Tickets 24–26 (update — wire utils and breadcrumbs per PDF page 314)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Map store product errors: `STORE_PRODUCT_NOT_FOUND`, `STORE_PRODUCT_PRICE_LOCKED`, `STORE_PRODUCT_SCOPE_DENIED`, `STORE_PRODUCT_PRICE_INVALID`, etc. (PDF page 311).
2. Map catalog errors: `PRODUCT_NOT_FOUND`, `PRODUCT_NOT_APPROVED`, `PRODUCT_NOT_VISIBLE`, `VARIANT_NOT_FOUND` (PDF page 312).
3. Map inventory errors: `INVENTORY_STOCK_NOT_FOUND`, `INVALID_INVENTORY_QUANTITY`, `INSUFFICIENT_AVAILABLE_STOCK`, `INVENTORY_SCOPE_DENIED`, etc.
4. Breadcrumb labels per PDF page 314: Store Catalog → Products → Detail; Store Products → Price/Availability; Inventory → Stocks → Movements → Adjust.
5. Wire query-param utils on all list pages.

**Acceptance criteria:**
- API errors show mapped messages; filters persist in URL.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`

**Depends on:** Tickets 24–26.

---

## Ticket 28 — Store catalog UI tests

**Ticket:** 28 — Store catalog UI tests

**Objective:** Co-located unit tests for catalog list, store product list, and forms.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/forms/vendor-store-product-price.schema.test.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/forms/vendor-store-product-availability.schema.test.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/utils/vendor-catalog-permissions.util.test.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/utils/vendor-catalog-query-param.util.test.ts` (create)
- `apps/vendor-panel/src/modules/store-catalog/pages/vendor-catalog-product-list-page.test.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/pages/vendor-store-product-list-page.test.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/forms/vendor-store-product-price-form.test.tsx` (create)
- `apps/vendor-panel/src/modules/store-catalog/forms/vendor-store-product-availability-form.test.tsx` (create)

**API endpoints:** Mock vendor catalog and store-product endpoints.

**DB fields:** None.

**Implementation steps:**
1. Catalog list — calls `GET /api/v1/vendor/catalog/products`; hides create/edit/delete (PDF page 314).
2. Store product list — calls `GET /api/v1/vendor/store-products`; price/availability actions hidden without `store_products:update`.
3. Price form — blocks `sellingPrice > mrp`, percentage > 100, disabled when `isPriceLocked`; submits to PATCH price.
4. Availability form — blocks empty change set; submits to PATCH availability.

**Acceptance criteria:**
- Tests follow co-located pattern (not `__tests__/` folder required).

**Test commands:**
- See Ticket 30 `test:store-catalog`

**Depends on:** Tickets 22–25, 27.

---

## Ticket 29 — Store inventory UI tests

**Ticket:** 29 — Store inventory UI tests

**Objective:** Co-located unit tests for inventory list, adjustment form, and movement list.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-inventory/forms/vendor-inventory-adjustment.schema.test.ts` (create)
- `apps/vendor-panel/src/modules/store-inventory/utils/vendor-inventory-permissions.util.test.ts` (create)
- `apps/vendor-panel/src/modules/store-inventory/utils/vendor-inventory-query-param.util.test.ts` (create)
- `apps/vendor-panel/src/modules/store-inventory/pages/vendor-inventory-stock-list-page.test.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/forms/vendor-inventory-adjustment-form.test.tsx` (create)
- `apps/vendor-panel/src/modules/store-inventory/pages/vendor-inventory-movement-list-page.test.tsx` (create)

**API endpoints:** Mock vendor inventory endpoints.

**DB fields:** None.

**Implementation steps:**
1. Stock list — calls `GET /api/v1/vendor/inventory/stocks`; adjust hidden without `inventory:update`; low/out-of-stock badge tests.
2. Adjustment form — blocks missing movementType, quantity <= 0, missing reason; submits to POST adjust.
3. Movement list — calls `GET /api/v1/vendor/inventory/movements`; filter URL sync.

**Acceptance criteria:**
- Coverage matches PDF pages 315–316 test micro-tasks.

**Test commands:**
- See Ticket 30 `test:store-inventory`

**Depends on:** Tickets 23, 26–27.

---

## Ticket 30 — Quality gates and npm test entrypoints

**Ticket:** 30 — Quality gates and npm test entrypoints

**Objective:** Add `test:store-catalog` and `test:store-inventory` scripts; run vendor-panel quality gates.

**Files to create/update:**
- `apps/vendor-panel/package.json` — add `test:store-catalog`, `test:store-inventory`
- `apps/vendor-panel/tsconfig.store-catalog-test.json` (create)
- `apps/vendor-panel/tsconfig.store-inventory-test.json` (create)
- `apps/vendor-panel/eslint.config.mjs` (update — ignore `dist-store-catalog-test/`, `dist-store-inventory-test/` if needed)
- `.gitignore` (update — test output dirs)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Mirror admin-dashboard `test:catalog` compile-and-`node --test` pattern.
2. Regression: `test:access-control-smoke` unchanged.

**Acceptance criteria:**
- `npm run typecheck`, `lint`, `build`, `test:store-catalog`, `test:store-inventory`, `test:access-control-smoke` pass in `apps/vendor-panel`.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run build -w apps/vendor-panel`
- `npm run test:store-catalog -w apps/vendor-panel`
- `npm run test:store-inventory -w apps/vendor-panel`
- `npm run test:access-control-smoke -w apps/vendor-panel`

**Depends on:** Tickets 28–29.

---

## Ticket 31 — Module review, handoff, and project-context closeout

**Ticket:** 31 — Module review, handoff, and project-context closeout

**Objective:** Close Vendor Panel Store Catalog Foundation with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/vendor-panel-store-catalog-foundation-review.md` (create)
- `docs/handoffs/vendor-panel-store-catalog-foundation-complete.md` (create)
- `docs/reviews/phase-3-vendor-panel-store-catalog-foundation-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md` (update)
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md` (update)
- `docs/testing/vendor-panel-store-catalog-verification.md` — mark steps verified

**API endpoints:** Verify all 15 consumer endpoints (PDF page 317) and UI-only catalog contract paths.

**DB fields:** Verify display/update fields per PDF pages 317–318; document tenant-scope rule.

**Implementation steps:**
1. Verification table: 12 UI routes, permissions, read-only catalog, store-product price/availability, inventory adjust.
2. Note pending: Customer App catalog (module 14); vendor catalog backend routes PLANNED; order picking/packing deferred.
3. Set next module: **Customer App — Catalog Read Foundation**.

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- No customer-app screens started.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 30

**Depends on:** Ticket 30.

---

## Dependency graph (summary)

```text
1 → 2 → 3,4,5 → 6,7,8 → 9,10
2 → 11,12 → 13
3,6 → 14,15 | 4,7 → 16 | 5,8 → 17,18
2 → 19
9,14 → 20 | 10 → 21
7,9,16 → 22 | 8,10,18 → 23
11–15,19–20 → 24
11–13,16,19–20,22 → 25
12–13,17–18,21,23 → 26
24–26 → 27
22–25,27 → 28 | 23,26–27 → 29
28–29 → 30 → 31
```

**Critical path:** 1 → 2 → 3 → 6 → 14 → 24 → 28 → 30 → 31  
(Parallel: 4–5 APIs; 16–18 hooks; 25–26 remaining pages)

**Cross-module order:** Admin Dashboard Store & Inventory (module 12) and vendor store-product/inventory backends must be complete; vendor catalog read backend should be mounted for full catalog browse (contract PLANNED). This module before Customer App Catalog Read (module 14).
