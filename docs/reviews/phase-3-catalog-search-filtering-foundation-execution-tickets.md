# Phase 3 Catalog Search & Filtering Foundation — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Catalog Search & Filtering Foundation  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 339–364  

**Architecture references:**  
`docs/architecture/catalog-search-filter-architecture.md`, `docs/database/catalog-index-plan.md`, `docs/contracts/catalog-admin-api-contract.md`, `docs/contracts/catalog-vendor-api-contract.md`, `docs/contracts/catalog-customer-api-contract.md`, `docs/security/catalog-permissions.md`, `docs/errors/catalog-error-codes.md`, `docs/handoffs/customer-app-catalog-read-foundation-complete.md`, `docs/handoffs/vendor-panel-store-catalog-foundation-complete.md`

**Prerequisites (already in repo):**  
Category, Brand & Unit, Product, Product Variant backends; Store Foundation; Store Product Mapping; Inventory Foundation; Admin/Vendor/Customer catalog UIs (modules 11–14). Admin `GET /api/v1/admin/catalog/products` exists with basic list/search; vendor and customer catalog routes are **not mounted** (contracts PLANNED).

**Out of scope for this module:**  
Elasticsearch / Meilisearch, typo tolerance, synonyms, advanced ranking; Repository & Codebase Setup; `packages/shared` TypeScript files; customer categories/brands/detail/variants read routes (not in this PDF module section — remain separate if still PLANNED); Phase 3 Testing & Validation (module 16).

**Execution order notes:**
- Run **Ticket 1** (docs) before implementation.
- Run **Tickets 2–5** (scaffold, types, constants, utils) before repository.
- Run **Tickets 6–9** (repository) before service.
- Run **Tickets 10–12** (validators, service, mapper) before controllers.
- Run **Tickets 13–17** (controllers, routes, mount, index updates) before tests.
- Run **Tickets 18–19** (errors, audit) before or with controllers.
- Run **Tickets 20–25** (tests, OpenAPI, contract) before frontend integration.
- Run **Tickets 26–28** (customer, vendor, admin app wiring) after backend routes pass.
- **MongoDB-first** search only; variant-level price filters until store join is live.
- Customer search endpoint uses query param **`q`** (min 2, max 100) per PDF; align customer app client in Ticket 26 if needed.
- Customer visibility: `products.status=active`, `approvalStatus=approved`, `isVisible=true`, `isDeleted=false`; store_product and inventory constraints per PDF.
- Vendor tenant: `store_products.vendorId` / `store_products.storeId` from authenticated actor.
- Co-located `*.test.ts` under `catalog/search/` preferred over `__tests__/` (repo convention).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (completed 2026-05-18)

---

## Ticket 1 — Catalog search & filtering foundation docs

**Ticket:** 1 — Catalog search & filtering foundation docs

**Objective:** Document implementation scope, endpoints, filters, visibility rules, and verification checklist (no runtime code).

**Files to create/update:**
- `docs/architecture/catalog-search-filter-architecture.md` (update — status IMPLEMENTED after module)
- `docs/contracts/catalog-search-filtering-api.md` (create)
- `docs/testing/catalog-search-filtering-verification.md` (create)
- `docs/database/catalog-index-plan.md` (update — note indexes applied in this module)

**API endpoints:** Document all consumer endpoints (PDF pages 345–356):
- `GET /api/v1/admin/catalog/products` (enhanced search/filter)
- `GET /api/v1/vendor/catalog/products`
- `GET /api/v1/vendor/catalog/facets`
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/search`
- `GET /api/v1/customer/catalog/featured-products`
- `GET /api/v1/customer/catalog/facets`

**DB fields:** Document searchable/filterable fields per PDF pages 357–363: `products.*`, `store_products.*`, `inventory_stocks.*`, `categories.name`, `brands.name`, `product_variants.sku` (via join where applicable).

**Implementation steps:**
1. Surface-specific filter matrix (admin / vendor / customer).
2. Sort mapping table (`price_low_to_high` → `store_products.finalPrice asc`, etc.).
3. Customer visibility and vendor tenant-scope rules.
4. Manual QA checklist (auth, 401/403, price range validation, facet counts).
5. Note deferred: Elasticsearch, typo tolerance, synonyms.

**Acceptance criteria:**
- Docs match PDF micro-tasks; no `backend/api/src/modules/catalog/search/` code yet.

**Test commands:**
- `test -f docs/contracts/catalog-search-filtering-api.md && test -f docs/testing/catalog-search-filtering-verification.md && echo PASS`

**Depends on:** Customer App — Catalog Read Foundation complete (module 14).

---

## Ticket 2 — Catalog search module scaffold

**Ticket:** 2 — Catalog search module scaffold

**Objective:** Create `backend/api/src/modules/catalog/search/` folder layout per PDF.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/controllers/` (create)
- `backend/api/src/modules/catalog/search/routes/` (create)
- `backend/api/src/modules/catalog/search/services/` (create)
- `backend/api/src/modules/catalog/search/repositories/` (create)
- `backend/api/src/modules/catalog/search/validators/` (create)
- `backend/api/src/modules/catalog/search/types/` (create)
- `backend/api/src/modules/catalog/search/constants/` (create)
- `backend/api/src/modules/catalog/search/utils/` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Create empty folder tree only.
2. No services, routes, or models yet.

**Acceptance criteria:**
- Folder tree exists; `npm run typecheck -w backend/api` unaffected.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 1.

---

## Ticket 3 — Catalog search types and constants

**Ticket:** 3 — Catalog search types and constants

**Objective:** TypeScript types and enum constants for search, filters, sort, errors, and audit.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/types/catalog-search.types.ts` (create)
- `backend/api/src/modules/catalog/search/constants/catalog-sort.constant.ts` (create)
- `backend/api/src/modules/catalog/search/constants/catalog-filter.constant.ts` (create)
- `backend/api/src/modules/catalog/search/constants/catalog-search-error-codes.constant.ts` (create)
- `backend/api/src/modules/catalog/search/constants/catalog-search-audit-events.constant.ts` (create)

**API endpoints:** None (types only).

**DB fields:** Filter key constants map to query params: `categoryId`, `subcategoryId`, `brandId`, `foodType`, `productType`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `isAvailable`, `isOutOfStock`, `minPrice`, `maxPrice`, `storeId`, `cityId`, `vendorId`, `search`/`q`.

**Implementation steps:**
1. Types: `CatalogSearchQuery`, `CatalogSearchResult`, `CatalogSearchFilters`, `CatalogSortOption`, `CatalogFacetResult`, `AdminCatalogSearchQuery`, `VendorCatalogSearchQuery`, `CustomerCatalogSearchQuery`, `CustomerCatalogListQuery`.
2. Sort options: `relevance`, `newest`, `price_low_to_high`, `price_high_to_low`, `featured`, `name_asc`, `name_desc`, `updated_desc`.
3. Error codes: `CATALOG_SEARCH_QUERY_TOO_LONG`, `CATALOG_SEARCH_INVALID_SORT`, `CATALOG_SEARCH_INVALID_FILTER`, `CATALOG_SEARCH_PRICE_RANGE_INVALID`, `CATALOG_SEARCH_SCOPE_DENIED`, `CATALOG_SEARCH_FAILED`.
4. Audit events: `catalog.search_executed`, `catalog.customer_search_executed`, `catalog.vendor_search_executed` (and facet request events per PDF).

**Acceptance criteria:**
- Types and constants compile; align with `catalog-search-filter-architecture.md`.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 4 — Search query and sort utilities

**Ticket:** 4 — Search query and sort utilities

**Objective:** Normalize search input, build safe regex, and map sort options per surface.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/utils/catalog-search-query.util.ts` (create)
- `backend/api/src/modules/catalog/search/utils/catalog-sort.util.ts` (create)

**API endpoints:** None (utilities).

**DB fields:** Sort maps to Mongo fields: `products.createdAt`, `products.isFeatured`, `products.updatedAt`, `store_products.finalPrice`.

**Implementation steps:**
1. `normalizeSearchQuery(search)` — trim, collapse spaces, empty → `undefined`, max **100** chars → throw `CATALOG_SEARCH_QUERY_TOO_LONG`.
2. `buildSearchRegex(search)` — escape regex special characters; case-insensitive match.
3. `buildCatalogSort(sortBy, sortOrder, surface)` — map customer `price_low_to_high` / `price_high_to_low` to `store_products.finalPrice`; `newest` → `products.createdAt desc`; `featured` → `products.isFeatured desc`; admin default `products.updatedAt desc`; customer default relevance then `products.isFeatured desc`.

**Acceptance criteria:**
- Pure functions unit-testable; max length enforced.

**Test commands:**
- See Ticket 23

**Depends on:** Ticket 3.

---

## Ticket 5 — Catalog filter builder utilities

**Ticket:** 5 — Catalog filter builder utilities

**Objective:** Build MongoDB filter objects for admin, vendor, and customer surfaces.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/utils/catalog-filter.util.ts` (create)

**API endpoints:** None (used by repository).

**DB fields:**
- Admin: `categoryId`, `subcategoryId`, `brandId`, `foodType`, `productType`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, text `search`.
- Vendor: above (except approval admin-only) + `isAvailable`, tenant `vendorId`/`storeId`.
- Customer: `categoryId`, `subcategoryId`, `brandId`, `foodType`, `isFeatured`, `isAvailable`, `minPrice`, `maxPrice`, `cityId`, `storeId`, text `search`; force `products.status=active`, `approvalStatus=approved`, `isVisible=true`, `isDeleted=false`; `store_products.status=active`, `isVisible=true`, `isAvailable=true`, `isDeleted=false`; `inventory_stocks.status=active`, `isDeleted=false`.

**Implementation steps:**
1. `buildAdminProductFilters(query)`.
2. `buildVendorProductFilters(query, tenantScope)`.
3. `buildCustomerProductFilters(query, customerScope)`.
4. When `isAvailable=true`, exclude `inventory_stocks.isOutOfStock=true` per PDF test requirement.

**Acceptance criteria:**
- Filters omit undefined keys; customer/vendor visibility enforced in builder.

**Test commands:**
- See Ticket 23

**Depends on:** Ticket 3.

---

## Ticket 6 — Catalog search repository: admin products

**Ticket:** 6 — Catalog search repository: admin products

**Objective:** `searchAdminProducts` with pagination, text search, and category/brand summary lookup.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/repositories/catalog-search.repository.ts` (create — partial)

**API endpoints:** Used by `GET /api/v1/admin/catalog/products`.

**DB fields:** Query `products`; optional lookup `categories.name`, `brands.name`; filters from `buildAdminProductFilters`; search across `name`, `slug`, `searchKeywords`, `tags`.

**Implementation steps:**
1. `searchAdminProducts(query)` — paginated list + total count.
2. Apply `buildSearchRegex` when search present.
3. Attach category and brand summary fields on each item (populate or secondary lookup).
4. Return pagination metadata (`page`, `limit`, `total`, `totalPages`, `hasNextPage`, `hasPreviousPage`).

**Acceptance criteria:**
- Repository only; no HTTP layer.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 4–5.

---

## Ticket 7 — Catalog search repository: vendor products

**Ticket:** 7 — Catalog search repository: vendor products

**Objective:** `searchVendorProducts` joining `products` with `store_products` under tenant scope.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/repositories/catalog-search.repository.ts` (extend)

**API endpoints:** Used by `GET /api/v1/vendor/catalog/products`.

**DB fields:** Join `products._id = store_products.productId`; filter `store_products.vendorId`, `store_products.storeId` from `tenantScope`; return store-scoped mapped products only.

**Implementation steps:**
1. `searchVendorProducts(query, tenantScope)`.
2. Aggregation or lookup pipeline for store product fields: `storeProductId`, `variantId`, `mrp`, `sellingPrice`, `finalPrice`, `isAvailable`, `isVisible`, `status`.
3. Paginated response.

**Acceptance criteria:**
- Cross-vendor records never returned when `vendorId`/`storeId` scoped.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 5–6.

---

## Ticket 8 — Catalog search repository: customer products and featured

**Ticket:** 8 — Catalog search repository: customer products and featured

**Objective:** `searchCustomerProducts` and `getCustomerFeaturedProducts` with store + inventory join.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/repositories/catalog-search.repository.ts` (extend)

**API endpoints:**
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/featured-products`

**DB fields:** Join `products`, `store_products`, `inventory_stocks`; filter `cityId`/`storeId` when provided; attach `availableQuantity`, `isOutOfStock`, `isLowStock`; featured forces `products.isFeatured=true`.

**Implementation steps:**
1. `searchCustomerProducts(query, customerScope)` — active store mapping required.
2. `getCustomerFeaturedProducts(query, customerScope)` — featured + customer visibility filters.
3. Price range filters on `store_products.finalPrice` (or variant MRP fallback per architecture limitation note).

**Acceptance criteria:**
- Only approved, visible, non-deleted products; store product mapping required.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 5–7.

---

## Ticket 9 — Catalog search repository: facets

**Ticket:** 9 — Catalog search repository: facets

**Objective:** `getCatalogFacets` returning facet counts per surface and scope.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/repositories/catalog-search.repository.ts` (complete)

**API endpoints:**
- `GET /api/v1/customer/catalog/facets`
- `GET /api/v1/vendor/catalog/facets`

**DB fields:** Facet buckets: `categories`, `brands`, `foodTypes`, `priceRanges`, `availability` (counts from visible/scoped records only).

**Implementation steps:**
1. `getCatalogFacets(query, surface, scope)`.
2. Customer facets — only visible, serviceable, in-scope records.
3. Vendor facets — tenant-scoped counts only.

**Acceptance criteria:**
- Facet counts match active filters; no PII in facet payload.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 6–8.

---

## Ticket 10 — Catalog search validators

**Ticket:** 10 — Catalog search validators

**Objective:** Zod schemas for all list/search/featured/facet query params.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/validators/catalog-search.validators.ts` (create)

**API endpoints:** Validates query params for all endpoints in Ticket 1.

**DB fields:** Validates types for filter fields; `maxPrice >= minPrice` or `CATALOG_SEARCH_PRICE_RANGE_INVALID`.

**Implementation steps:**
1. Admin list: `page`, `limit`, `search` max 100, `categoryId`, `subcategoryId`, `brandId`, `foodType`, `productType`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `sortBy`, `sortOrder`.
2. Vendor list: same + `isAvailable`; tenant params from auth not body.
3. Customer list: `search` max 100, `minPrice`/`maxPrice` min 0, `cityId`, `storeId`, `isAvailable`, `isFeatured`, etc.
4. Customer search: **`q` required min 2 max 100**, optional filters, `sortBy`.
5. Featured: `page`, `limit`, `categoryId`, `brandId`, `cityId`, `storeId`.
6. Facets: `search` max 100, filter keys per surface.

**Acceptance criteria:**
- Invalid sort enum → `CATALOG_SEARCH_INVALID_SORT`; invalid filter combo → `CATALOG_SEARCH_INVALID_FILTER`.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 11 — Catalog search service

**Ticket:** 11 — Catalog search service

**Objective:** Service layer orchestrating repository, scope, and normalized queries.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/services/catalog-search.service.ts` (create)

**API endpoints:** All search/list/featured/facet endpoints (via controllers).

**DB fields:** None (orchestration only).

**Implementation steps:**
1. `searchAdminProducts(query, actor)` — call repository; return paginated results with category/brand summary.
2. `searchVendorProducts(query, actor)` — read `vendorId`, `storeId`, `cityId` from actor; call repository.
3. `searchCustomerProducts(query, actor)` — read `cityId` from actor; validate `storeId` belongs to serviceable scope placeholder.
4. `searchCustomerCatalog(query, actor)` — require `q`; delegate to `searchCustomerProducts` with normalized search.
5. `getCustomerFeaturedProducts(query, actor)`.
6. `getCustomerCatalogFacets(query, actor)`.
7. `getVendorCatalogFacets(query, actor)`.

**Acceptance criteria:**
- No HTTP in service; scope denial throws `CATALOG_SEARCH_SCOPE_DENIED`.

**Test commands:**
- See Ticket 23

**Depends on:** Tickets 6–10.

---

## Ticket 12 — Catalog search response mapper

**Ticket:** 12 — Catalog search response mapper

**Objective:** Map repository results to API responses per surface; strip internal fields from customer payload.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/utils/catalog-search-response.mapper.ts` (create)

**API endpoints:** Response shapes for all Ticket 1 endpoints.

**DB fields:** Admin exposes full catalog fields; vendor exposes store-product join fields; customer exposes `id`, `storeProductId`, `productId`, `variantId`, `name`, `shortDescription`, `category`, `brand`, `defaultImageUrl`, `foodType`, `mrp`, `sellingPrice`, `finalPrice`, `discountType`, `discountValue`, `isAvailable`, `isOutOfStock`, `availableQuantity` — excludes `createdBy`, `updatedBy`, `isDeleted`, `vendorId`, internal metadata.

**Implementation steps:**
1. `mapAdminProductSearchItem(record)`.
2. `mapVendorProductSearchItem(record)`.
3. `mapCustomerProductSearchItem(record)`.
4. `mapCatalogFacets(facets)`.

**Acceptance criteria:**
- Customer responses never include admin-only or internal fields.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 3.

---

## Ticket 13 — Admin catalog search controller and product list integration

**Ticket:** 13 — Admin catalog search controller and product list integration

**Objective:** Admin controller for enhanced product list; wire existing admin product list route to search service.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/controllers/catalog-search-admin.controller.ts` (create)
- `backend/api/src/modules/catalog/products/controllers/product.controller.ts` (update — delegate list to search service OR replace route target)
- `backend/api/src/modules/catalog/products/routes/product-admin.routes.ts` (update — avoid duplicate handlers)

**API endpoints:**
- `GET /api/v1/admin/catalog/products`

**DB fields:** Same as Ticket 6.

**Implementation steps:**
1. Controller method `listAdminCatalogProducts` using `searchAdminProducts` service.
2. Replace or redirect existing `listProductsController` list path to enhanced search (PDF: avoid duplicate route conflict).
3. Standard `{ success, data, meta }` response format.

**Acceptance criteria:**
- Admin product list supports PDF filter set and text search.

**Test commands:**
- See Tickets 24–25

**Depends on:** Tickets 11–12.

---

## Ticket 14 — Vendor catalog search controllers

**Ticket:** 14 — Vendor catalog search controllers

**Objective:** Vendor controllers for product list and facets.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/controllers/catalog-search-vendor.controller.ts` (create)

**API endpoints:**
- `GET /api/v1/vendor/catalog/products`
- `GET /api/v1/vendor/catalog/facets`

**DB fields:** Per Tickets 7 and 9.

**Implementation steps:**
1. `listVendorCatalogProducts` controller.
2. `getVendorCatalogFacets` controller.
3. Use standard success response helper.

**Acceptance criteria:**
- Controllers compile; no routes mounted yet.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 11–12.

---

## Ticket 15 — Customer catalog search controllers

**Ticket:** 15 — Customer catalog search controllers

**Objective:** Customer controllers for products, search, featured, and facets.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/controllers/catalog-search-customer.controller.ts` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/search`
- `GET /api/v1/customer/catalog/featured-products`
- `GET /api/v1/customer/catalog/facets`

**DB fields:** Per Tickets 8–9.

**Implementation steps:**
1. `listCustomerCatalogProducts`.
2. `searchCustomerCatalog` (requires `q`).
3. `getCustomerFeaturedProducts`.
4. `getCustomerCatalogFacets`.

**Acceptance criteria:**
- Controllers compile; customer-safe mapped responses only.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 11–12.

---

## Ticket 16 — Catalog search route files and middleware

**Ticket:** 16 — Catalog search route files and middleware

**Objective:** Express routers with auth, permission, and vendor tenant middleware.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/routes/catalog-search-admin.routes.ts` (create)
- `backend/api/src/modules/catalog/search/routes/catalog-search-vendor.routes.ts` (create)
- `backend/api/src/modules/catalog/search/routes/catalog-search-customer.routes.ts` (create)

**API endpoints:** Register all routes from Tickets 13–15.

**DB fields:** None.

**Implementation steps:**
1. Admin: `authenticate()`, `requireRole(adminRoles)`, `catalog:read`, validate query, controller.
2. Vendor: `authenticate()`, vendor roles, `catalog:read`, tenant scope middleware, validate, controller.
3. Customer: `authenticate()`, `requireRole(CUSTOMER)` (customer surface — not admin `catalog:read` permission), validate, controller.

**Acceptance criteria:**
- Validators applied on all routes; middleware chain matches Phase 2 patterns.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Tickets 10, 13–15.

---

## Ticket 17 — Mount catalog search routes and resolve duplicates

**Ticket:** 17 — Mount catalog search routes and resolve duplicates

**Objective:** Mount search routers on admin, vendor, and customer route entrypoints; remove duplicate product list registrations.

**Files to create/update:**
- `backend/api/src/routes/v1/admin.routes.ts` (update)
- `backend/api/src/routes/v1/vendor.routes.ts` (update)
- `backend/api/src/routes/v1/customer.routes.ts` (update)
- `docs/contracts/catalog-route-mounting-plan.md` (update — IMPLEMENTED paths)
- `docs/contracts/backend-route-registry.md` (update)

**API endpoints:** Mount under `/api/v1/admin/catalog`, `/api/v1/vendor/catalog`, `/api/v1/customer/catalog`.

**DB fields:** None.

**Implementation steps:**
1. Mount `catalog-search-admin.routes.ts` on admin catalog prefix.
2. Mount `catalog-search-vendor.routes.ts` on vendor catalog prefix.
3. Mount `catalog-search-customer.routes.ts` on customer catalog prefix.
4. Resolve duplicate `GET .../products` between legacy product routes and search routes (PDF pages 350–351).
5. Ensure no path conflicts for search, featured, facets.

**Acceptance criteria:**
- All 7 endpoints reachable on running API; no duplicate route registration errors.

**Test commands:**
- See Ticket 24

**Depends on:** Ticket 16.

---

## Ticket 18 — Model index updates for search and filtering

**Ticket:** 18 — Model index updates for search and filtering

**Objective:** Apply text and compound indexes on product, store_product, and inventory models per PDF.

**Files to create/update:**
- `backend/api/src/modules/catalog/products/models/product.model.ts` (update)
- `backend/api/src/modules/store-products/models/store-product.model.ts` (update)
- `backend/api/src/modules/inventory/models/inventory-stock.model.ts` (update)
- `docs/database/catalog-index-plan.md` (update — mark applied)

**API endpoints:** None (indexes support list/search endpoints).

**DB fields:**
- Product text index: `name`, `slug`, `shortDescription`, `description`, `searchKeywords`, `tags`.
- Compound: `categoryId + status + approvalStatus + isVisible`, `brandId + ...`, `foodType + ...`, `isFeatured + ...`.
- Store product: `cityId + status + isVisible + isAvailable`, `storeId + status + isVisible + isAvailable`, `productId + variantId`, `finalPrice`.
- Inventory: `storeProductId + status + isOutOfStock`, `cityId + status + isOutOfStock`.

**Implementation steps:**
1. Add/update Mongoose indexes per PDF pages 352–353.
2. Do not remove existing partial unique slug/sku indexes.

**Acceptance criteria:**
- Models compile; index definitions match index plan doc.

**Test commands:**
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 2.

---

## Ticket 19 — Catalog search error codes and handler mapping

**Ticket:** 19 — Catalog search error codes and handler mapping

**Objective:** Register search error codes in global catalog error handling.

**Files to create/update:**
- `docs/errors/catalog-error-codes.md` (update)
- `backend/api/src/modules/catalog/search/constants/catalog-search-error-codes.constant.ts` (verify complete from Ticket 3)
- Catalog error utility or global error handler (update — map search codes to HTTP 400/403/500)

**API endpoints:** Error responses on all search endpoints.

**DB fields:** None.

**Implementation steps:**
1. Map `CATALOG_SEARCH_QUERY_TOO_LONG` → 400.
2. Map `CATALOG_SEARCH_INVALID_SORT`, `CATALOG_SEARCH_INVALID_FILTER`, `CATALOG_SEARCH_PRICE_RANGE_INVALID` → 400.
3. Map `CATALOG_SEARCH_SCOPE_DENIED` → 403.
4. Map `CATALOG_SEARCH_FAILED` → 500.

**Acceptance criteria:**
- Route test for invalid price range returns `CATALOG_SEARCH_PRICE_RANGE_INVALID` (PDF page 359).

**Test commands:**
- See Ticket 24

**Depends on:** Ticket 3.

---

## Ticket 20 — Catalog search audit logging

**Ticket:** 20 — Catalog search audit logging

**Objective:** Write audit events for search requests when query text is present.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/services/catalog-search.service.ts` (update)
- `docs/security/catalog-audit-logging.md` (update — search events)

**API endpoints:** Audit on search only (not empty list filters).

**DB fields:** `audit_logs` — `eventType`, `entityType`, `metadata` (no tokens, no raw auth headers).

**Implementation steps:**
1. Admin: audit when `search` query param present → `catalog.search_executed`.
2. Customer: audit when `q` present → `catalog.customer_search_executed`.
3. Vendor: audit when `search` present → `catalog.vendor_search_executed`.
4. Metadata: `surface`, `filters`, `resultCount`, `requestId`/`traceId` — exclude secrets.

**Acceptance criteria:**
- No audit on facet-only or filter-only requests without search text.

**Test commands:**
- See Ticket 23

**Depends on:** Ticket 11.

---

## Ticket 21 — OpenAPI documentation for catalog search endpoints

**Ticket:** 21 — OpenAPI documentation for catalog search endpoints

**Objective:** Document query params and responses in OpenAPI spec.

**Files to create/update:**
- Backend OpenAPI source (update — paths under `/api/v1/admin/catalog`, `/api/v1/vendor/catalog`, `/api/v1/customer/catalog`)
- `docs/contracts/catalog-search-filtering-api.md` (sync)

**API endpoints:** All Ticket 1 endpoints with query param tables from PDF pages 345–347.

**DB fields:** Documented in schema references.

**Implementation steps:**
1. Document admin, vendor, customer list query params.
2. Document customer `q` on search endpoint.
3. Document facet response shape.

**Acceptance criteria:**
- `curl http://localhost:5000/api/v1/public/openapi.json` includes search paths (when API running).

**Test commands:**
- `npm run build -w backend/api` (if OpenAPI generated at build)

**Depends on:** Ticket 17.

---

## Ticket 22 — Catalog search service unit tests

**Ticket:** 22 — Catalog search service unit tests

**Objective:** Unit tests for filter builders, search normalization, and service scope rules.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/utils/catalog-search-query.util.test.ts` (create)
- `backend/api/src/modules/catalog/search/utils/catalog-filter.util.test.ts` (create)
- `backend/api/src/modules/catalog/search/services/catalog-search.service.test.ts` (create)

**API endpoints:** None (unit tests).

**DB fields:** None.

**Implementation steps:**
1. Admin filters by `categoryId`, `brandId`, `approvalStatus`; text search applied.
2. Customer returns only approved/visible/active store products.
3. Customer `isAvailable=true` excludes out-of-stock.
4. Customer price range filter.
5. Customer sort price low-to-high.
6. Featured forces `isFeatured=true`.
7. Vendor scoped to `vendorId`/`storeId`.
8. Query > 100 chars blocked.
9. Invalid price range blocked.

**Acceptance criteria:**
- All PDF-listed service tests pass.

**Test commands:**
- See Ticket 29

**Depends on:** Tickets 4–5, 11.

---

## Ticket 23 — Catalog search route integration tests

**Ticket:** 23 — Catalog search route integration tests

**Objective:** Route tests for auth, permissions, success paths, and error cases.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/controllers/catalog-search.routes.test.ts` (create — co-located, not `__tests__/`)

**API endpoints:** All Ticket 1 endpoints.

**DB fields:** Seed fixtures as needed in test setup.

**Implementation steps:**
1. Customer unauthenticated → 401; missing permission N/A for customer role tests.
2. Customer list/search/featured/facets success paths.
3. Vendor unauthenticated → 401; tenant isolation on product search.
4. Admin unauthenticated → 401; missing `catalog:read` → 403.
5. Admin search success with `?search=milk`.
6. Invalid price range → `CATALOG_SEARCH_PRICE_RANGE_INVALID`.

**Acceptance criteria:**
- Route tests match PDF pages 358–359.

**Test commands:**
- See Ticket 29

**Depends on:** Tickets 17, 19.

---

## Ticket 24 — Catalog search performance test

**Ticket:** 24 — Catalog search performance test

**Objective:** Seed dataset and local performance smoke tests for customer list/search.

**Files to create/update:**
- `backend/api/src/modules/catalog/search/catalog-search-performance.test.ts` (create)
- Test seed helper or script reference (update existing seed pattern if present)

**API endpoints:**
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/search`

**DB fields:** Seed at least 1000 `products`, 1000 `store_products`, 1000 `inventory_stocks` (PDF page 360).

**Implementation steps:**
1. Seed fixtures for performance test environment.
2. Assert customer list returns within acceptable local threshold (document threshold in test comment).
3. Assert customer search with text within acceptable local threshold.
4. Note production SLA finalized in later performance phase.

**Acceptance criteria:**
- Tests run in CI/local without flaking on empty DB (skip or seed in `before`).

**Test commands:**
- See Ticket 29

**Depends on:** Ticket 17.

---

## Ticket 25 — Backend test script and quality gates

**Ticket:** 25 — Backend test script and quality gates

**Objective:** Add `test:catalog-search` npm script; run backend quality gates.

**Files to create/update:**
- `backend/api/package.json` (update — `test:catalog-search`)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:catalog-search` runs search util, service, and route tests.
2. Regression: `test:products`, `test:store-products` (or `test:store-product`), `test:inventory` per PDF pages 361–362.

**Acceptance criteria:**
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run build -w backend/api`
- `npm run test:catalog-search -w backend/api`
- `npm run test:products -w backend/api`
- `npm run test:store-products -w backend/api` (or equivalent store-product test script)
- `npm run test:inventory -w backend/api`

**Test commands:**
- All commands above

**Depends on:** Tickets 22–24.

---

## Ticket 26 — Customer App catalog search integration

**Ticket:** 26 — Customer App catalog search integration

**Objective:** Wire customer app to live facets and enhanced filter/sort query params.

**Files to create/update:**
- `apps/customer-app/src/modules/catalog/api/customer-catalog.api.ts` (update)
- `apps/customer-app/src/modules/catalog/utils/catalog-query.util.ts` (update)
- `apps/customer-app/src/modules/catalog/screens/CatalogFiltersScreen.tsx` (update — facet counts)
- `apps/customer-app/src/modules/catalog/hooks/useCustomerCatalogSearch.ts` (update — use `q` if backend requires)
- `apps/customer-app/src/modules/catalog/types/customer-catalog-query.types.ts` (update)

**API endpoints:**
- `GET /api/v1/customer/catalog/facets`
- `GET /api/v1/customer/catalog/search` (param `q`)
- `GET /api/v1/customer/catalog/products` (`minPrice`, `maxPrice`, `isAvailable`, `sortBy`)

**DB fields:** Facet response drives UI counts.

**Implementation steps:**
1. Add `getCustomerCatalogFacets()`.
2. Extend `buildCatalogQuery` with `minPrice`, `maxPrice`, `isAvailable`, `sortBy`.
3. Filters screen loads facets; display counts next to category/brand options.
4. Product list screens pass sort options: `price_low_to_high`, `price_high_to_low`, `newest`, `featured`.

**Acceptance criteria:**
- `npm run typecheck -w apps/customer-app`
- `npm run test:catalog -w apps/customer-app`

**Test commands:**
- `npm run typecheck -w apps/customer-app`
- `npm run test:catalog -w apps/customer-app`

**Depends on:** Ticket 17.

---

## Ticket 27 — Vendor Panel catalog facets integration

**Ticket:** 27 — Vendor Panel catalog facets integration

**Objective:** Vendor panel facets API and filter UI counts.

**Files to create/update:**
- `apps/vendor-panel/src/modules/store-catalog/api/vendor-catalog.api.ts` (update)
- `apps/vendor-panel/src/modules/store-catalog/pages/VendorCatalogProductListPage.tsx` (update — facet counts when available)

**API endpoints:**
- `GET /api/v1/vendor/catalog/facets`
- `GET /api/v1/vendor/catalog/products` (enhanced filters)

**DB fields:** None (client).

**Implementation steps:**
1. Add `getVendorCatalogFacets()`.
2. Show facet counts on store catalog product list filters when API returns data.

**Acceptance criteria:**
- `npm run typecheck -w apps/vendor-panel`
- `npm run test:store-catalog -w apps/vendor-panel`

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`
- `npm run test:store-catalog -w apps/vendor-panel`

**Depends on:** Ticket 17.

---

## Ticket 28 — Admin Dashboard enhanced catalog filters

**Ticket:** 28 — Admin Dashboard enhanced catalog filters

**Objective:** Pass enhanced search/filter/sort query params from admin product list UI.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/hooks/useProducts.ts` (or equivalent product list hook — update)
- `apps/admin-dashboard/src/modules/catalog/utils/catalog-query-param.util.ts` (update)
- Product list page components (update — filter controls for PDF admin params)

**API endpoints:**
- `GET /api/v1/admin/catalog/products`

**DB fields:** Query params: `search`, `categoryId`, `subcategoryId`, `brandId`, `foodType`, `productType`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `sortBy`, `sortOrder`.

**Implementation steps:**
1. Serialize all admin filter fields to URL/query.
2. Product list hook passes params to API client.

**Acceptance criteria:**
- `npm run typecheck -w apps/admin-dashboard`
- `npm run test:catalog -w apps/admin-dashboard` (if exists)

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 13.

---

## Ticket 29 — Update catalog API contract statuses

**Ticket:** 29 — Update catalog API contract statuses

**Objective:** Mark vendor/customer catalog search contracts IMPLEMENTED; sync customer search `q` param.

**Files to create/update:**
- `docs/contracts/catalog-customer-api-contract.md` (update)
- `docs/contracts/catalog-vendor-api-contract.md` (update)
- `docs/contracts/catalog-admin-api-contract.md` (update — enhanced list note)
- `docs/contracts/customer-app-catalog-ui-contract.md` (update — facets, `q` on search)

**API endpoints:** Document all implemented endpoints and query param names.

**DB fields:** Cross-reference Ticket 1 field list.

**Implementation steps:**
1. Set contract status IMPLEMENTED for mounted routes.
2. Document `GET /api/v1/customer/catalog/facets` and vendor facets.
3. Note customer search uses `q` (min 2); list uses `search`.

**Acceptance criteria:**
- Contracts align with implemented backend.

**Test commands:**
- `test -f docs/contracts/catalog-search-filtering-api.md && echo PASS`

**Depends on:** Ticket 17.

---

## Ticket 30 — Module review, handoff, and project-context closeout

**Ticket:** 30 — Module review, handoff, and project-context closeout

**Objective:** Close Catalog Search & Filtering Foundation with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/catalog-search-filtering-foundation-review.md` (create)
- `docs/handoffs/catalog-search-filtering-foundation-complete.md` (create)
- `docs/reviews/phase-3-catalog-search-filtering-foundation-execution-tickets.md` — mark all tickets DONE
- `docs/testing/catalog-search-filtering-verification.md` — mark verified
- `docs/architecture/catalog-search-filter-architecture.md` — status IMPLEMENTED
- `project-context/CURRENT_PROGRESS.md` (update)
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md` (update)

**API endpoints:** Verify all 7 endpoints + admin enhanced list (PDF pages 362–363).

**DB fields:** Verify indexed/filtered fields per PDF page 363.

**Implementation steps:**
1. Verification table: admin/vendor/customer search, facets, visibility, tenant scope.
2. Note pending: Elasticsearch, typo tolerance, customer categories/brands/detail routes if still unmounted.
3. Set next module: **Phase 3 Testing & Validation** (module 16).

**Acceptance criteria:**
- Handoff complete; tracker all DONE.

**Test commands:**
- All commands from Ticket 25
- `npm run test:catalog -w apps/customer-app`
- `npm run test:store-catalog -w apps/vendor-panel`

**Depends on:** Tickets 25–29.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4,5 → 6 → 7 → 8 → 9
3 → 10 → 11 ← 6-9
11,12 → 13,14,15 → 16 → 17
2 → 18 | 3 → 19 | 11 → 20
17 → 21,23,24 | 11,4,5 → 22
17 → 26,27 | 13 → 28
17 → 29 → 30
22,23,24 → 25 → 26,27,28 → 30
```

**Critical path:** 1 → 2 → 3 → 5 → 8 → 11 → 15 → 16 → 17 → 23 → 25 → 30  
**Parallel:** 18 indexes; 19 errors; 20 audit; 21 OpenAPI; 26–28 frontend integration

**Cross-module order:** Module 14 (customer UI) complete; this module enables live catalog browse/search. Module 16 (Phase 3 Testing) follows.
