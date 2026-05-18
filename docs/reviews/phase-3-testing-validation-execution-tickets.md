# Phase 3 Testing & Validation — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Phase 3 Testing & Validation  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` (Module 16 — pages 365–412)

**Architecture references:**  
`docs/architecture/catalog-architecture.md`, `docs/architecture/catalog-search-filter-architecture.md`, `docs/contracts/backend-route-registry.md`, `docs/contracts/catalog-admin-api-contract.md`, `docs/contracts/catalog-vendor-api-contract.md`, `docs/contracts/catalog-customer-api-contract.md`, `docs/security/catalog-permissions.md`, `docs/security/store-foundation-permissions.md`, `docs/security/store-product-mapping-permissions.md`, `docs/security/inventory-foundation-permissions.md`, `docs/errors/catalog-error-codes.md`, `docs/database/catalog-index-plan.md`, `docs/handoffs/catalog-search-filtering-foundation-complete.md`

**Prerequisites (already in repo):**  
Modules 1–15 complete (backend catalog/store/inventory/media, admin/vendor/customer UIs, catalog search). Existing per-module verification docs under `docs/testing/`. Backend unit tests via `test:categories`, `test:products`, `test:store-products`, `test:inventory`, `test:catalog-search`, etc.

**Out of scope for this module:**  
New product features; Repository & Codebase Setup; Elasticsearch/production CDN; checkout integration; new API endpoints; new Mongoose models; Phase 3 Integration & Review (module 17).

**Execution order notes:**
- Run **Ticket 1** (master plan) before all review docs.
- Run **Tickets 2–6** (structure, schema, indexes) before route/permission reviews.
- Run **Tickets 7–10** (routes, permissions) before live API smoke reviews.
- Run **Tickets 11–13** (admin/vendor/customer API smoke) with running API + MongoDB + seed.
- Run **Tickets 14–16** (UI reviews) after API smoke or in parallel with mocked frontends.
- Run **Tickets 17–23** (domain validations) after smoke tests; require live DB for movement/lock/media.
- Run **Tickets 24–25** (seed, OpenAPI) before quality gates.
- Run **Tickets 26–27** (automated quality) before manual checklist.
- Run **Tickets 28–30** (manual checklist, risks, final summary) to close module.

**Repo path corrections (PDF vs repo):**
- Variants live at `backend/api/src/modules/catalog/variants/` (not `product-variants`).
- Vendor/customer `categories` / `brands` / `products/:id` / `variants` routes may be **PLANNED** — record PASS/FAIL/GAP in reviews; do not implement in this module.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (completed 2026-05-18)

---

## Ticket 1 — Phase 3 testing & validation master plan

**Ticket:** 1 — Phase 3 testing & validation master plan

**Objective:** Create the module master plan listing all Phase 3 modules, validation scopes, and review artifact index (docs only).

**Files to create/update:**
- `docs/reviews/phase-3-testing-validation-plan.md` (create)
- `docs/testing/phase-3-testing-validation-verification.md` (create)

**API endpoints:** Document verification scope for all Phase 3 surfaces (admin, vendor, customer, internal) — reference `docs/contracts/backend-route-registry.md`; no new endpoints.

**DB fields:** Reference all Phase 3 collections: `categories`, `brands`, `product_units`, `products`, `product_variants`, `cities`, `service_areas`, `stores`, `store_products`, `inventory_stocks`, `inventory_movements`, `inventory_locks`, `media_files`, `audit_logs`.

**Implementation steps:**
1. List modules 1–15 covered by this validation pass.
2. Define validation categories: backend structure, DB schema, indexes, route mount, permissions, API smoke, UI smoke, tenant scope, customer visibility, inventory movement/lock, media, search, audit, seed idempotency, OpenAPI, quality gates, manual E2E, production risks.
3. Link each category to its review doc (Tickets 2–30).
4. Add verification command index (typecheck, lint, test scripts per workspace).
5. Note live-environment requirement for smoke/validation tickets (MongoDB, seeded data, tokens).

**Acceptance criteria:**
- Plan doc exists; lists all review outputs and dependencies; no application code changes.

**Test commands:**
- `test -f docs/reviews/phase-3-testing-validation-plan.md && test -f docs/testing/phase-3-testing-validation-verification.md && echo PASS`

**Depends on:** Catalog Search & Filtering Foundation complete (module 15).

---

## Ticket 2 — Backend module structure review

**Ticket:** 2 — Backend module structure review

**Objective:** Verify Phase 3 backend module folders and required subfolders exist per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-backend-module-structure-review.md` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Confirm folders exist: `catalog/categories`, `catalog/brands`, `catalog/units`, `catalog/products`, `catalog/variants`, `catalog/search`, `locations/cities`, `locations/service-areas`, `stores`, `store-products`, `inventory`, `inventory/locks`, `media`.
2. For each module, confirm subfolders: `controllers`, `routes`, `services`, `repositories`, `models`, `validators`, `types`, `constants`, `utils` (where applicable per module).
3. Record any missing folders or naming mismatches vs PDF.
4. Cross-reference handoff docs for modules 2–15.

**Acceptance criteria:**
- Review doc lists each module with PASS/FAIL and notes; no code changes unless fixing doc-only typos.

**Test commands:**
- `test -f docs/reviews/phase-3-backend-module-structure-review.md && echo PASS`
- `find backend/api/src/modules/catalog backend/api/src/modules/locations backend/api/src/modules/stores backend/api/src/modules/store-products backend/api/src/modules/inventory backend/api/src/modules/media -type d -maxdepth 2 2>/dev/null | head -40`

**Depends on:** Ticket 1.

---

## Ticket 3 — Database schema review (catalog collections)

**Ticket:** 3 — Database schema review (catalog collections)

**Objective:** Validate Mongoose models and schema docs for catalog master collections.

**Files to create/update:**
- `docs/reviews/phase-3-database-schema-review.md` (create — catalog section)

**API endpoints:** None.

**DB fields:**
- `categories`: `name`, `slug`, `description`, `parentCategoryId`, `level`, `displayOrder`, `iconUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`, `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- `brands`: `name`, `slug`, `description`, `logoUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`, `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- `product_units`: `code`, `name`, `baseUnit`, `conversionFactor`, `status`, `isDeleted`, `deletedAt`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- `products`: `name`, `slug`, `description`, `shortDescription`, `categoryId`, `subcategoryId`, `brandId`, `productType`, `foodType`, `taxCategoryId`, `hsnCode`, `searchKeywords`, `tags`, `defaultImageUrl`, `imageUrls`, `attributeSummary`, `isFeatured`, `isVisible`, `approvalStatus`, `status`, approval/rejection fields, audit timestamps
- `product_variants`: `productId`, `variantName`, `sku`, `barcode`, `unit`, `unitValue`, `mrp`, `defaultSellingPrice`, dimensions, `imageUrl`, `attributeValues`, `isDefault`, `isVisible`, `status`, soft-delete and audit fields

**Implementation steps:**
1. Compare each collection’s model in `backend/api/src/modules/catalog/**/models/` against PDF field list.
2. Compare against `docs/database/catalog-*-schema.md` if present.
3. Mark each field present/missing/type mismatch.
4. Do not alter models in this ticket — document gaps only.

**Acceptance criteria:**
- Catalog section complete with per-collection PASS/FAIL table.

**Test commands:**
- `test -f docs/reviews/phase-3-database-schema-review.md && echo PASS`

**Depends on:** Ticket 2.

---

## Ticket 4 — Database schema review (location & store collections)

**Ticket:** 4 — Database schema review (location & store collections)

**Objective:** Validate `cities`, `service_areas`, and `stores` models against PDF.

**Files to create/update:**
- `docs/reviews/phase-3-database-schema-review.md` (update — location/store section)

**API endpoints:** None.

**DB fields:**
- `cities`: `name`, `slug`, `state`, `country`, `timezone`, `currencyCode`, geo/service fields, `isServiceable`, `status`, soft-delete, audit fields
- `service_areas`: `cityId`, `name`, `slug`, `description`, `polygon`, center/radius, `isServiceable`, `status`, soft-delete, audit fields
- `stores`: `vendorId`, `cityId`, `serviceAreaIds`, `name`, `slug`, `code`, contact/address/geo, hours, `storeType`, `fulfillmentType`, `status`, soft-delete, audit fields

**Implementation steps:**
1. Review `locations/cities`, `locations/service-areas`, `stores` models.
2. Document field-level parity with PDF pages 366–371.
3. Note immutable fields (e.g. `stores.code`) if enforced in service layer.

**Acceptance criteria:**
- Location/store sections added to schema review doc.

**Test commands:**
- `grep -l "cityId" backend/api/src/modules/stores/models/*.ts backend/api/src/modules/locations/**/*.ts 2>/dev/null | head -5`

**Depends on:** Ticket 3.

---

## Ticket 5 — Database schema review (store products, inventory, locks, media)

**Ticket:** 5 — Database schema review (store products, inventory, locks, media)

**Objective:** Validate operational collections used by store catalog, inventory, and media modules.

**Files to create/update:**
- `docs/reviews/phase-3-database-schema-review.md` (update — operational section)

**API endpoints:** None.

**DB fields:**
- `store_products`: `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `sku`, `storeSku`, pricing fields, `isAvailable`, `isVisible`, `isFeatured`, `isPriceLocked`, `priceUpdatedAt`, `status`, soft-delete, audit fields
- `inventory_stocks`: quantities, thresholds, `isLowStock`, `isOutOfStock`, `lastStockUpdatedAt`, `lastStockMovementId`, scope ids, `status`, soft-delete, audit fields
- `inventory_movements`: movement types, quantity deltas, `referenceType`, `referenceId`, `metadata`, scope ids
- `inventory_locks`: `lockToken`, `lockType`, `quantity`, `status`, `expiresAt`, release/confirm fields, cart/order refs, scope ids
- `media_files`: owner/upload metadata, storage fields, `checksum`, `status`, soft-delete fields

**Implementation steps:**
1. Review models under `store-products`, `inventory`, `inventory/locks`, `media`.
2. Complete schema review doc with PASS/FAIL per collection.
3. Link to `docs/database/store-product-schema.md`, inventory schema docs, media schema docs.

**Acceptance criteria:**
- Full Phase 3 schema review doc covers all PDF collections.

**Test commands:**
- `test -f docs/reviews/phase-3-database-schema-review.md && wc -l docs/reviews/phase-3-database-schema-review.md`

**Depends on:** Ticket 4.

---

## Ticket 6 — Database index review

**Ticket:** 6 — Database index review

**Objective:** Verify partial unique, compound, text, TTL, and search indexes per PDF and `catalog-index-plan.md`.

**Files to create/update:**
- `docs/reviews/phase-3-database-index-review.md` (create)
- `docs/database/catalog-index-plan.md` (update — validation status note only)

**API endpoints:** None.

**DB fields:** Indexed fields per PDF: slugs/codes/SKUs (partial unique), `inventory_locks.lockToken` (active), `inventory_locks.expiresAt` (TTL), `media_files.storageKey`, product text index, `store_products` catalog filter compounds, `inventory_stocks` facet compounds.

**Implementation steps:**
1. Inspect index definitions in all Phase 3 Mongoose models.
2. Verify partial unique indexes: `categories.slug`, `brands.slug`, `product_units.code`, `products.slug`, `product_variants.sku`, `cities.slug`, `service_areas` compound, `stores` compound, `store_products` compound, `inventory_stocks` compound.
3. Verify search indexes: product text fields; store_product customer filter indexes; inventory out-of-stock indexes.
4. Document any missing or duplicate index warnings.

**Acceptance criteria:**
- Index review doc lists each expected index with PASS/FAIL; catalog-index-plan cross-referenced.

**Test commands:**
- `test -f docs/reviews/phase-3-database-index-review.md && echo PASS`
- `npm run typecheck -w backend/api`

**Depends on:** Ticket 5.

---

## Ticket 7 — Backend route mount review (admin catalog & locations)

**Ticket:** 7 — Backend route mount review (admin catalog & locations)

**Objective:** Confirm admin catalog and location routes are mounted and match contracts.

**Files to create/update:**
- `docs/reviews/phase-3-backend-route-mount-review.md` (create — admin catalog/locations section)
- `docs/contracts/backend-route-registry.md` (update — validation note if gaps found)

**API endpoints:** Verify mounted:
- `POST|GET /api/v1/admin/catalog/categories`, `GET|PATCH|DELETE .../:categoryId`
- `POST|GET /api/v1/admin/catalog/brands`, `GET|PATCH|DELETE .../:brandId`
- `POST|GET /api/v1/admin/catalog/units`, `GET|PATCH|DELETE .../:unitId`
- `POST|GET /api/v1/admin/catalog/products`, `GET|PATCH|DELETE .../:productId`, `PATCH .../approval-status`
- Nested `GET|POST|PATCH|DELETE .../products/:productId/variants`
- `POST|GET /api/v1/admin/locations/cities`, `GET|PATCH|DELETE .../:cityId`
- `POST|GET /api/v1/admin/locations/service-areas`, `GET|PATCH|DELETE .../:serviceAreaId`
- `POST|GET /api/v1/admin/stores`, `GET|PATCH|DELETE .../:storeId`

**DB fields:** None.

**Implementation steps:**
1. Trace mounts in `backend/api/src/routes/v1/admin.routes.ts` and nested route files.
2. Compare to PDF list (pages 377–378) and route registry.
3. Record PASS/FAIL per endpoint pattern.

**Acceptance criteria:**
- Admin catalog/location/store route section complete in mount review.

**Test commands:**
- `grep -E "catalog/(categories|brands|units|products)|locations/(cities|service-areas)|/stores" backend/api/src/routes/v1/admin.routes.ts`

**Depends on:** Ticket 6.

---

## Ticket 8 — Backend route mount review (admin store products, inventory, media)

**Ticket:** 8 — Backend route mount review (admin store products, inventory, media)

**Objective:** Confirm admin operational routes for store products, inventory, locks, and media.

**Files to create/update:**
- `docs/reviews/phase-3-backend-route-mount-review.md` (update — admin operations section)

**API endpoints:** Verify mounted:
- Store products: list/create/detail/update/delete, bulk-map, bulk-price, bulk-visibility
- Inventory stocks: CRUD, adjust, bulk-upload, bulk-thresholds; movements list/detail; locks list/detail/expire-due
- Media: upload, bulk-upload, files CRUD, signed-url

**DB fields:** None.

**Implementation steps:**
1. Trace `store-products`, `inventory`, `media` admin route modules.
2. Match PDF endpoints (pages 378–379).
3. Update route registry doc if discrepancies found (doc only).

**Acceptance criteria:**
- Admin operational routes documented with mount paths.

**Test commands:**
- `grep -E "store-products|inventory|media" backend/api/src/routes/v1/admin.routes.ts`

**Depends on:** Ticket 7.

---

## Ticket 9 — Backend route mount review (vendor, customer, internal)

**Ticket:** 9 — Backend route mount review (vendor, customer, internal)

**Objective:** Confirm vendor/customer catalog and operational routes plus internal lock/media routes.

**Files to create/update:**
- `docs/reviews/phase-3-backend-route-mount-review.md` (update — vendor/customer/internal section)
- `docs/contracts/backend-route-registry.md` (update — PLANNED vs IMPLEMENTED gaps)

**API endpoints:** Verify per PDF:
- Vendor: `GET /api/v1/vendor/catalog/products`, `/facets`; store-products; inventory stocks/movements; media (as implemented)
- Customer: `GET /api/v1/customer/catalog/products`, `/search`, `/featured-products`, `/facets` (module 15)
- PDF also lists vendor/customer categories, brands, product detail, variants — **record GAP if not mounted**
- Internal: `POST /api/v1/internal/inventory/locks`, release, confirm; `POST /api/v1/internal/media/attach-owner`, `GET .../media/files/:mediaFileId`

**DB fields:** None.

**Implementation steps:**
1. Trace `vendor.routes.ts`, `customer.routes.ts`, `internal.routes.ts`.
2. Mark each PDF endpoint IMPLEMENTED / PLANNED / N/A.
3. Do not implement missing routes in this module.

**Acceptance criteria:**
- Full mount review covers all Phase 3 surfaces; gaps explicitly listed.

**Test commands:**
- `grep -E "catalog|store-products|inventory|media" backend/api/src/routes/v1/vendor.routes.ts backend/api/src/routes/v1/customer.routes.ts`

**Depends on:** Ticket 8.

---

## Ticket 10 — Permission and role seed review

**Ticket:** 10 — Permission and role seed review

**Objective:** Validate Phase 3 permission codes and role seed matrix per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-permission-review.md` (create)
- `docs/security/catalog-permissions.md` (update — validation status only, if needed)

**API endpoints:** None (permissions gate existing endpoints).

**DB fields:** `roles.permissions`, `user_identities.permissions`, `user_identities.role`, `user_identities.vendorId`, `user_identities.storeId`, `user_identities.cityId`

**Implementation steps:**
1. Verify permission constants exist: `catalog:*`, `locations:*`, `stores:*`, `store_products:*`, `inventory:*`, `media:*`.
2. Verify `super_admin` has `*:*` in seed.
3. Review `backend/api/src/database/seeds/seed-roles.ts` (and related) for `operations_admin`, vendor roles, customer role assignments per PDF pages 380–381.
4. Cross-check `npm run test:seed-matrix -w backend/api`.

**Acceptance criteria:**
- Permission review doc lists each permission family with PASS/FAIL; seed matrix test referenced.

**Test commands:**
- `npm run test:seed-matrix -w backend/api`
- `test -f docs/reviews/phase-3-permission-review.md && echo PASS`

**Depends on:** Ticket 9.

---

## Ticket 11 — Admin API smoke review

**Ticket:** 11 — Admin API smoke review

**Objective:** Live smoke test admin Phase 3 list endpoints and record results (requires running API + seed + admin token).

**Files to create/update:**
- `docs/reviews/phase-3-admin-api-smoke-review.md` (create)

**API endpoints:** Smoke `GET` list endpoints:
- `/api/v1/admin/catalog/categories`, `/brands`, `/units`, `/products`
- `/api/v1/admin/locations/cities`, `/service-areas`
- `/api/v1/admin/stores`, `/store-products`
- `/api/v1/admin/inventory/stocks`, `/movements`, `/locks`
- `/api/v1/admin/media/files`

**DB fields:** None (read-only smoke).

**Implementation steps:**
1. Start API: `npm run dev -w backend/api`; run `npm run seed -w backend/api`.
2. Obtain admin access token (OTP flow or test fixture).
3. Execute PDF curl templates with `Authorization: Bearer` header.
4. Record HTTP status, `success` flag, and sample payload shape per endpoint.
5. Note blockers (DB down, auth failure) in review doc.

**Acceptance criteria:**
- Smoke review doc has result table (PASS/FAIL/SKIP) for each admin list endpoint.

**Test commands:**
- `npm run check:health` (if backend running)
- `test -f docs/reviews/phase-3-admin-api-smoke-review.md && echo PASS`

**Depends on:** Tickets 7–8, 10.

---

## Ticket 12 — Vendor API smoke review

**Ticket:** 12 — Vendor API smoke review

**Objective:** Live smoke test vendor-scoped catalog, store product, and inventory endpoints.

**Files to create/update:**
- `docs/reviews/phase-3-vendor-api-smoke-review.md` (create)

**API endpoints:**
- `GET /api/v1/vendor/catalog/products`, `/facets` (+ PDF categories/brands if mounted — note GAP)
- `GET /api/v1/vendor/store-products`
- `GET /api/v1/vendor/inventory/stocks`, `/movements`

**DB fields:** `user_identities.vendorId`, `user_identities.storeId`, `store_products.vendorId`, `store_products.storeId`, `inventory_stocks.vendorId`, `inventory_stocks.storeId`

**Implementation steps:**
1. Seed + vendor login; capture `VENDOR_ACCESS_TOKEN`.
2. Run PDF curl commands (pages 384–385).
3. Verify responses are scoped to token’s vendor/store (spot-check `vendorId`/`storeId` in payload if exposed).
4. Record results in review doc.

**Acceptance criteria:**
- Vendor smoke doc complete; tenant scope spot-check noted.

**Test commands:**
- `test -f docs/reviews/phase-3-vendor-api-smoke-review.md && echo PASS`

**Depends on:** Ticket 11.

---

## Ticket 13 — Customer API smoke review

**Ticket:** 13 — Customer API smoke review

**Objective:** Live smoke test customer catalog browse/search endpoints.

**Files to create/update:**
- `docs/reviews/phase-3-customer-api-smoke-review.md` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/search?q=milk`
- `GET /api/v1/customer/catalog/featured-products`
- `GET /api/v1/customer/catalog/facets`
- PDF categories/brands/detail/variants — record GAP if not mounted

**DB fields:** Visibility fields: `products.approvalStatus`, `products.status`, `products.isVisible`, `store_products.isAvailable`, `inventory_stocks.isOutOfStock`

**Implementation steps:**
1. Customer login; capture `CUSTOMER_ACCESS_TOKEN`.
2. Run PDF curl commands (pages 386–387).
3. Confirm search uses `q` (min 2 chars).
4. Record PASS/FAIL per endpoint.

**Acceptance criteria:**
- Customer smoke doc complete with visibility field references.

**Test commands:**
- `test -f docs/reviews/phase-3-customer-api-smoke-review.md && echo PASS`

**Depends on:** Ticket 12.

---

## Ticket 14 — Admin Dashboard UI review

**Ticket:** 14 — Admin Dashboard UI review

**Objective:** Verify admin catalog, location, store, inventory, and media UI routes load and call correct APIs.

**Files to create/update:**
- `docs/reviews/phase-3-admin-dashboard-ui-review.md` (create)

**API endpoints:** Document expected API calls from UI:
- Category/product CRUD, store CRUD, inventory adjust, media upload per PDF pages 388–389

**DB fields:** None.

**Implementation steps:**
1. Start `npm run dev -w apps/admin-dashboard` with backend running.
2. Verify routes load: `/catalog/categories`, `/brands`, `/units`, `/products`, `/locations/cities`, `/service-areas`, `/stores`, `/store-products`, `/inventory/stocks`, `/movements`, `/locks`.
3. Spot-check network calls for create/edit forms (category, product, store, inventory adjust, media upload).
4. Verify permission-gated buttons hidden without `catalog:create`, `stores:create`, `inventory:adjust`, etc.
5. Record PASS/FAIL in review doc.

**Acceptance criteria:**
- UI review doc lists routes and API mapping; permission UI checks documented.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`
- `npm run test:catalog -w apps/admin-dashboard`
- `npm run test:stores -w apps/admin-dashboard`
- `npm run test:inventory -w apps/admin-dashboard`

**Depends on:** Ticket 11.

---

## Ticket 15 — Vendor Panel UI review

**Ticket:** 15 — Vendor Panel UI review

**Objective:** Verify vendor store catalog, store products, and inventory UI behavior per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-vendor-panel-ui-review.md` (create)

**API endpoints:**
- `GET /api/v1/vendor/catalog/products`
- `GET|PATCH /api/v1/vendor/store-products`, price/availability patches
- `GET|POST /api/v1/vendor/inventory/stocks`, adjust, movements list

**DB fields:** `store_products.isPriceLocked`, `inventory_stocks.isLowStock`, `inventory_stocks.isOutOfStock`

**Implementation steps:**
1. Start vendor panel dev server.
2. Verify routes: `/store-catalog/products`, `/store-products`, `/inventory/stocks`, `/inventory/movements`.
3. Confirm no global catalog create/delete controls.
4. Confirm price form disabled when `isPriceLocked=true` (fixture or seed data).
5. Confirm low-stock/out-of-stock indicators render.

**Acceptance criteria:**
- Vendor UI review doc complete with API and indicator checks.

**Test commands:**
- `npm run typecheck -w apps/vendor-panel`
- `npm run test:store-catalog -w apps/vendor-panel`
- `npm run test:store-inventory -w apps/vendor-panel`

**Depends on:** Ticket 12.

---

## Ticket 16 — Customer App UI review

**Ticket:** 16 — Customer App UI review

**Objective:** Verify customer catalog screens call correct APIs and render catalog UX rules.

**Files to create/update:**
- `docs/reviews/phase-3-customer-app-ui-review.md` (create)

**API endpoints:**
- Home: categories, brands, featured
- Category/brand product lists; product detail; search (`q` min 2); facets
- Per PDF pages 391–392

**DB fields:** `products.name`, `products.defaultImageUrl`, `store_products.finalPrice`, `store_products.mrp`, `inventory_stocks.isOutOfStock`

**Implementation steps:**
1. Start customer app; login as customer.
2. Verify `CatalogHomeScreen`, category/brand/search/filter/detail flows.
3. Confirm search debounce/min length before `/search` call.
4. Confirm product card fields and disabled Add to Cart when unavailable/out of stock.
5. Cross-check with `npm run test:catalog -w apps/customer-app`.

**Acceptance criteria:**
- Customer UI review doc maps screens → endpoints; automated catalog tests pass.

**Test commands:**
- `npm run typecheck -w apps/customer-app`
- `npm run test:catalog -w apps/customer-app`

**Depends on:** Ticket 13.

---

## Ticket 17 — Tenant scope validation

**Ticket:** 17 — Tenant scope validation

**Objective:** Validate vendor A cannot access vendor B store product or inventory records (live API).

**Files to create/update:**
- `docs/reviews/phase-3-tenant-scope-validation.md` (create)

**API endpoints:**
- `GET /api/v1/vendor/store-products`
- `GET /api/v1/vendor/store-products/:storeProductId` (cross-tenant → 403)
- `GET /api/v1/vendor/inventory/stocks`
- `GET /api/v1/vendor/inventory/stocks/:inventoryStockId` (cross-tenant → 403)

**DB fields:** `user_identities.vendorId`, `user_identities.storeId`, `store_products.vendorId`, `store_products.storeId`, `inventory_stocks.vendorId`, `inventory_stocks.storeId`

**Implementation steps:**
1. Seed two vendor users (store A and store B) or use existing seed identities.
2. List with vendor A token — assert all rows match A’s scope.
3. Request vendor B resource IDs with vendor A token — expect `403` + `STORE_PRODUCT_SCOPE_DENIED` / `INVENTORY_SCOPE_DENIED`.
4. Document curl commands and results per PDF pages 393–394.

**Acceptance criteria:**
- Tenant validation doc shows positive scope + negative cross-tenant cases PASS.

**Test commands:**
- `npm run test:tenant-access -w backend/api` (automated baseline)
- `npm run test:access-control-scenarios -w backend/api`

**Depends on:** Tickets 12, 15.

---

## Ticket 18 — Customer visibility validation

**Ticket:** 18 — Customer visibility validation

**Objective:** Validate customer catalog only returns approved/visible/active products and strips internal fields.

**Files to create/update:**
- `docs/reviews/phase-3-customer-visibility-validation.md` (create)

**API endpoints:**
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/search`
- `GET /api/v1/customer/catalog/featured-products`

**DB fields:** `products.approvalStatus`, `products.isVisible`, `products.status`, `store_products.isAvailable`, `inventory_stocks.isOutOfStock`; response must omit `vendorId`, `createdBy`, `updatedBy`, `isDeleted`, internal metadata

**Implementation steps:**
1. Create fixtures: approved visible in-stock product (included).
2. Set `approvalStatus=rejected`, `isVisible=false`, `store_products.isAvailable=false`, `inventory_stocks.isOutOfStock=true` — verify exclusion/UI state per PDF pages 394–395.
3. Inspect JSON for forbidden internal fields.
4. Document results.

**Acceptance criteria:**
- Visibility validation doc covers include/exclude cases and field stripping.

**Test commands:**
- `npm run test:catalog-search -w backend/api` (unit baseline for filters)

**Depends on:** Ticket 13.

---

## Ticket 19 — Inventory movement validation

**Ticket:** 19 — Inventory movement validation

**Objective:** Live validate stock adjustments create movements and update quantities per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-inventory-movement-validation.md` (create)

**API endpoints:**
- `POST /api/v1/admin/inventory/stocks`
- `POST /api/v1/admin/inventory/stocks/:inventoryStockId/adjust` (stock_in, stock_out, damaged, expired)
- `GET /api/v1/admin/inventory/movements?inventoryStockId=:id`

**DB fields:** `inventory_stocks.availableQuantity`, `totalQuantity`, `damagedQuantity`, `expiredQuantity`, `lastStockMovementId`; `inventory_movements.movementType`, quantity deltas

**Implementation steps:**
1. Create stock via admin API.
2. Adjust in/out/damaged/expired; verify DB fields after each step.
3. Attempt stock_out > available → expect `INSUFFICIENT_AVAILABLE_STOCK`.
4. List movements — confirm all adjustment types logged (PDF pages 395–396).

**Acceptance criteria:**
- Movement validation doc shows full adjustment matrix PASS.

**Test commands:**
- `npm run test:inventory -w backend/api`

**Depends on:** Ticket 11.

---

## Ticket 20 — Inventory lock validation

**Ticket:** 20 — Inventory lock validation

**Objective:** Live validate internal lock create, release, confirm, and expire-due flows.

**Files to create/update:**
- `docs/reviews/phase-3-inventory-lock-validation.md` (create)

**API endpoints:**
- `POST /api/v1/internal/inventory/locks`
- `POST /api/v1/internal/inventory/locks/:lockToken/release`
- `POST /api/v1/internal/inventory/locks/:lockToken/confirm`
- `POST /api/v1/admin/inventory/locks/expire-due`

**DB fields:** `inventory_locks.status`, `expiresAt`, `releasedAt`, `confirmedAt`; `inventory_stocks.availableQuantity`, `reservedQuantity`; movement `reservation_created`

**Implementation steps:**
1. Create lock via internal endpoint; verify reserved/available quantities.
2. Release lock — verify quantities and lock status.
3. Create second lock; confirm — verify reserved decreases without returning available.
4. Expire due locks admin endpoint on expired fixture (PDF pages 397–398).

**Acceptance criteria:**
- Lock validation doc covers create/release/confirm/expire paths.

**Test commands:**
- `npm run test:inventory-locks -w backend/api`

**Depends on:** Ticket 19.

---

## Ticket 21 — Media upload validation

**Ticket:** 21 — Media upload validation

**Objective:** Live validate media upload, invalid file rejection, attach-owner, and soft delete.

**Files to create/update:**
- `docs/reviews/phase-3-media-upload-validation.md` (create)

**API endpoints:**
- `POST /api/v1/admin/media/upload`
- `POST /api/v1/internal/media/attach-owner`
- `DELETE /api/v1/admin/media/files/:mediaFileId`

**DB fields:** `media_files.originalFileName`, `storedFileName`, `storageKey`, `publicUrl`, `mimeType`, `extension`, `sizeBytes`, `checksum`, `status`, `ownerType`, `ownerId`, `isDeleted`, `deletedAt`

**Implementation steps:**
1. Upload valid image — verify `media_files` record fields.
2. Upload invalid SVG → `MEDIA_INVALID_MIME_TYPE`; oversize → `MEDIA_FILE_TOO_LARGE`.
3. Attach owner via internal API.
4. Delete file — verify soft-delete fields (PDF pages 398–399).

**Acceptance criteria:**
- Media validation doc records success and error cases.

**Test commands:**
- `npm run test:media -w backend/api`

**Depends on:** Ticket 11.

---

## Ticket 22 — Catalog search validation

**Ticket:** 22 — Catalog search validation

**Objective:** Live validate customer/vendor/admin search, filters, sort, facets, and error codes per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-catalog-search-validation.md` (create)
- `docs/testing/catalog-search-filtering-verification.md` (update — link to validation results)

**API endpoints:**
- Customer: `/search?q=`, `/products` filters (category, brand, foodType, min/max price, sort), `/facets`
- Vendor: `/catalog/products?search=`, `/facets`
- Admin: `/catalog/products?search=`

**DB fields:** `store_products.finalPrice`, product visibility fields; error codes `CATALOG_SEARCH_PRICE_RANGE_INVALID`, `CATALOG_SEARCH_QUERY_TOO_LONG`

**Implementation steps:**
1. Seed searchable products across categories/brands/prices/stock states.
2. Run PDF curl matrix (pages 399–401).
3. Verify sort `price_low_to_high` / `price_high_to_low`.
4. Verify invalid price range and >100 char query errors.
5. Cross-check `npm run test:catalog-search -w backend/api`.

**Acceptance criteria:**
- Catalog search validation doc complete; unit tests still pass.

**Test commands:**
- `npm run test:catalog-search -w backend/api`

**Depends on:** Ticket 13, module 15.

---

## Ticket 23 — Audit log validation

**Ticket:** 23 — Audit log validation

**Objective:** Verify audit events fire for Phase 3 mutations and exclude secrets from metadata.

**Files to create/update:**
- `docs/reviews/phase-3-audit-log-validation.md` (create)
- `docs/security/catalog-audit-logging.md` (update — validation note, if exists)

**API endpoints:** Trigger mutations on category, brand, product, approval, store, store_product, inventory adjust, lock, media upload, customer search (when `q` present).

**DB fields:** `audit_logs.eventType`, `actorId`, `actorRole`, `actorSurface`, `entityType`, `entityId`, `metadata` — must not contain tokens, raw buffers, AWS secrets

**Implementation steps:**
1. Perform one mutation per event type listed in PDF (pages 401–402).
2. Query `audit_logs` collection (Mongo shell or admin tool).
3. Confirm expected `eventType` values including `catalog.customer_search_executed` when search has query text.
4. Confirm metadata excludes auth tokens and file buffers.

**Acceptance criteria:**
- Audit validation doc lists each event with PASS/FAIL; secret exclusion verified.

**Test commands:**
- Manual MongoDB query documented in review (no new code required)

**Depends on:** Tickets 19–22.

---

## Ticket 24 — Seed data idempotency validation

**Ticket:** 24 — Seed data idempotency validation

**Objective:** Verify running seed twice does not duplicate master records.

**Files to create/update:**
- `docs/reviews/phase-3-seed-data-validation.md` (create)

**API endpoints:** None.

**DB fields:** Unique keys: `categories.slug`, `brands.slug`, `product_units.code`, `cities.slug`, `service_areas` compound, `stores.code`, `store_products` store+variant, `inventory_stocks` store+storeProduct

**Implementation steps:**
1. Review seed files: `seed-catalog.ts`, `seed-locations.ts`, `seed-stores.ts`, `seed-store-products.ts`, `seed-inventory.ts`, `seed-roles.ts`.
2. Run `npm run seed -w backend/api` twice.
3. Count documents or verify unique indexes do not create duplicates (PDF pages 403–404).
4. Note opening movement duplication rules for inventory seed.

**Acceptance criteria:**
- Seed validation doc confirms idempotent behavior or documents known exceptions.

**Test commands:**
- `npm run seed -w backend/api && npm run seed -w backend/api`

**Depends on:** Ticket 10.

---

## Ticket 25 — OpenAPI and route registry review

**Ticket:** 25 — OpenAPI and route registry review

**Objective:** Compare OpenAPI spec to mounted routes and contract registry.

**Files to create/update:**
- `docs/reviews/phase-3-openapi-contract-review.md` (create)
- `docs/contracts/backend-route-registry.md` (update — reconcile gaps list)
- `backend/api/src/docs/openapi/catalog.paths.ts` (update only if doc lists missing paths — optional small doc sync, not feature work)

**API endpoints:** All Phase 3 endpoints — fetch `GET /api/v1/public/openapi.json` when server running.

**DB fields:** None.

**Implementation steps:**
1. Start backend; curl OpenAPI JSON.
2. Confirm admin catalog, locations, stores, store-products, inventory, media paths present.
3. Confirm vendor/customer catalog paths present (and note PLANNED gaps).
4. Diff against `backend-route-registry.md`; list missing/extra paths in review doc (PDF pages 404–405).

**Acceptance criteria:**
- OpenAPI review doc lists parity status; gap list attached if any.

**Test commands:**
- `npm run build -w backend/api`
- `curl -s http://localhost:5000/api/v1/public/openapi.json | head -c 500` (when server up)

**Depends on:** Ticket 9.

---

## Ticket 26 — Backend quality gates and results doc

**Ticket:** 26 — Backend quality gates and results doc

**Objective:** Run all Phase 3 backend automated tests and record results in a single results doc; add aggregate `test:phase-3` script if missing.

**Files to create/update:**
- `docs/reviews/phase-3-backend-quality-results.md` (create)
- `backend/api/package.json` (update — add `test:phase-3` aggregating module test scripts, if not present)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Run: `npm run typecheck -w backend/api`, `lint`, `build`.
2. Run module tests: `test:categories`, `test:brands`, `test:units`, `test:products`, `test:variants`, `test:cities`, `test:service-areas`, `test:stores`, `test:store-products`, `test:inventory`, `test:inventory-locks`, `test:media`, `test:catalog-search`.
3. Run access control: `test:access-control-harness`, `test:access-control-scenarios`, `test:tenant-access`, `test:seed-matrix`.
4. Run root: `npm run check:secrets`.
5. Save pass/fail counts and dates in results doc. Map PDF `test:access-control` to existing harness/scenarios scripts.

**Acceptance criteria:**
- All listed commands executed; results doc shows PASS/FAIL per command; `test:phase-3` runs catalog+store+inventory suite.

**Test commands:**
- All commands in implementation steps

**Depends on:** Tickets 2–6, 22.

---

## Ticket 27 — Frontend quality gates and results doc

**Ticket:** 27 — Frontend quality gates and results doc

**Objective:** Run Phase 3 frontend automated checks for admin, vendor, and customer apps.

**Files to create/update:**
- `docs/reviews/phase-3-frontend-quality-results.md` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Admin: typecheck, lint, build, `test:catalog`, `test:stores`, `test:inventory`, `test:access-control-smoke`.
2. Vendor: typecheck, lint, build, `test:store-catalog`, `test:store-inventory`, smoke.
3. Customer: typecheck, lint, `test:catalog`, smoke.
4. Root: `npm run check:frontend-secrets`.
5. Record outputs in results doc (PDF pages 406–408).

**Acceptance criteria:**
- Frontend results doc lists each workspace with PASS/FAIL.

**Test commands:**
- Commands listed in implementation steps

**Depends on:** Tickets 14–16.

---

## Ticket 28 — Manual smoke checklist

**Ticket:** 28 — Manual smoke checklist

**Objective:** Create consolidated manual E2E checklist for admin, vendor, and customer flows per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-manual-smoke-checklist.md` (create)
- `docs/testing/phase-3-testing-validation-verification.md` (update — link manual checklist)

**API endpoints:** Reference full mutation/list flows from PDF pages 408–409 (category through media upload, vendor price/availability, customer browse/search/filters).

**DB fields:** Reference key fields for each flow (approval, inventory quantities, `isPriceLocked`, out-of-stock UI).

**Implementation steps:**
1. Add Admin Dashboard checklist (create category → upload media).
2. Add Vendor Panel checklist (scoped catalog, price lock, inventory adjust).
3. Add Customer App checklist (browse, search, filters, disabled Add to Cart).
4. Add checkbox columns: Executed / PASS / Notes / Tester / Date.

**Acceptance criteria:**
- Checklist doc usable for QA sign-off; no code required to complete doc ticket.

**Test commands:**
- `test -f docs/reviews/phase-3-manual-smoke-checklist.md && echo PASS`

**Depends on:** Tickets 11–16.

---

## Ticket 29 — Production readiness risks

**Ticket:** 29 — Production readiness risks

**Objective:** Document known Phase 3 production risks and mitigations per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-production-readiness-risks.md` (create)

**API endpoints:** None (risk context references catalog search, media, locks, customer serviceability).

**DB fields:** `media_files.storageProvider`, `store_products.isPriceLocked`, `inventory_locks.status`, `inventory_locks.expiresAt`, `inventory_stocks.availableQuantity`, `inventory_stocks.reservedQuantity`

**Implementation steps:**
1. Document risks: local media storage, MongoDB-only search, city/store serviceability placeholder, checkout/lock integration pending, seed accuracy, price lock enforcement, TTL vs explicit release, large upload/CDN needs.
2. Add mitigation per risk (PDF pages 409–410).
3. Link to module 17 Integration & Review for follow-up.

**Acceptance criteria:**
- Risks doc complete; no new features introduced.

**Test commands:**
- `test -f docs/reviews/phase-3-production-readiness-risks.md && echo PASS`

**Depends on:** Tickets 22, 29 (risks can run parallel to 28).

---

## Ticket 30 — Final validation summary and module closeout

**Ticket:** 30 — Final validation summary and module closeout

**Objective:** Consolidate all review docs into final sign-off summary and update project progress/handoff.

**Files to create/update:**
- `docs/reviews/phase-3-final-validation-summary.md` (create)
- `docs/reviews/phase-3-testing-validation-execution-tickets.md` (update — all tickets DONE)
- `docs/testing/phase-3-testing-validation-verification.md` (update — VERIFIED)
- `docs/handoffs/phase-3-testing-validation-complete.md` (create)
- `project-context/CURRENT_PROGRESS.md` (update)
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md` (update — module 16 DONE, module 17 next)

**API endpoints:** Sign-off checklist: all Phase 3 endpoints validated (per route mount + smoke reviews).

**DB fields:** Sign-off checklist: schemas, indexes, audit, seed uniqueness validated.

**Implementation steps:**
1. Link all review docs from Tickets 2–29 in summary.
2. Add final checklist: backend APIs, DB schemas, indexes, permissions, tenant scope, customer visibility, inventory movements/locks, media, search, admin/vendor/customer UI, OpenAPI, quality gates, manual smoke.
3. Add sign-off fields: Reviewer, Date, Approved, Notes.
4. Mark blockers and deferred items (unmounted customer categories route, live-only gaps).
5. Set next module: **Phase 3 Integration & Review** (module 17).

**Acceptance criteria:**
- Final summary complete; handoff created; tracker all DONE; progress updated.

**Test commands:**
- All commands from Tickets 26–27 pass
- `test -f docs/reviews/phase-3-final-validation-summary.md && echo PASS`

**Depends on:** Tickets 1–29.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10
10 → 11 → 12 → 13
11 → 14 | 12 → 15 | 13 → 16
12,15 → 17 | 13 → 18 | 11 → 19 → 20 | 11 → 21 | 13,15 → 22 → 23
10 → 24 | 9 → 25
22 → 26 | 14–16 → 27 | 11–16 → 28 | 22 → 29
1–29 → 30
```

**Critical path:** 1 → 2 → 5 → 6 → 9 → 10 → 11 → 13 → 22 → 26 → 30  
**Parallel:** 14–16 UI reviews; 17–21 domain validations (after smoke); 24–25; 28–29

**Cross-module order:** Module 15 complete. This module validates modules 1–15. Module 17 (Integration & Review) follows.
