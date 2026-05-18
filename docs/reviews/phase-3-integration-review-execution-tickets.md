# Phase 3 Integration & Review — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** 17 — Phase 3 Integration & Review  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` (Module 17 — pages 413–458)

**Architecture references:**  
`docs/architecture/catalog-architecture.md`, `docs/architecture/catalog-search-filter-architecture.md`, `docs/contracts/backend-route-registry.md`, `docs/handoffs/phase-3-testing-validation-complete.md`, `docs/reviews/phase-3-final-validation-summary.md`, `docs/reviews/phase-3-production-readiness-risks.md`

**Prerequisites (already in repo):**  
Modules 1–16 complete (backend catalog/store/inventory/media/search, admin/vendor/customer UIs, Phase 3 Testing & Validation). Per-module handoffs and review docs under `docs/reviews/` and `docs/handoffs/`.

**Out of scope for this module:**  
New product features; Repository & Codebase Setup; implementing PLANNED vendor/customer category/brand/detail/variant routes; Elasticsearch/production CDN; cart/checkout; code fixes unless a review ticket explicitly records a blocker for a follow-up phase.

**Execution order notes:**
- Run **Ticket 1** (master plan) before all review docs.
- Run **Tickets 2–6** (scope, file reviews, shared contracts) before route/database integration reviews.
- Run **Tickets 7–8** (route registry, database integration) before permission/tenant/customer reviews.
- Run **Tickets 9–15** (permission through search integration) after route registry; can parallelize 11–13 after Ticket 10.
- Run **Tickets 16–19** (seed, env, errors, audit) before security and documentation coverage.
- Run **Ticket 20** (Postman) after route registry is current.
- Run **Tickets 21–23** (release notes, handoff, architecture closeout) after integration reviews.
- Run **Tickets 24–26** (quality re-verify, approval checklist, module closeout) last.

**Repo path corrections (PDF vs repo):**
- Product variants: `backend/api/src/modules/catalog/variants/` (PDF says `product-variants`).
- Customer search query param: **`q`** (min 2), not `search` (PDF lists both; repo implementation uses `q`).
- Vendor/customer `GET /catalog/categories`, `/brands`, `products/:id`, `variants` — record **MOUNTED** vs **PLANNED/GAP**; do not implement in this module.
- Shared catalog types in `packages/shared/api/` — PDF expects them; verify and record **GAP** if app-local types are used instead.
- `npm run smoke:backend` may not exist — use `npm run check:health -w backend/api` plus module 16 smoke review docs.

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (completed 2026-05-18)

---

## Ticket 1 — Phase 3 integration & review master plan

**Ticket:** 1 — Phase 3 integration & review master plan

**Objective:** Create the module master plan listing all integration review artifacts, dependencies on module 16 outputs, and execution index (docs only).

**Files to create/update:**
- `docs/reviews/phase-3-integration-review-plan.md` (create)
- `docs/testing/phase-3-integration-review-verification.md` (create)

**API endpoints:** Index all Phase 3 admin, vendor, customer, and internal endpoint groups — reference `docs/contracts/backend-route-registry.md`; no new endpoints.

**DB fields:** Index all Phase 3 collections: `categories`, `brands`, `product_units`, `products`, `product_variants`, `cities`, `service_areas`, `stores`, `store_products`, `inventory_stocks`, `inventory_movements`, `inventory_locks`, `media_files`, `audit_logs`, plus Phase 2 refs `roles`, `user_identities`.

**Implementation steps:**
1. List modules 1–16 in scope and link module 16 validation summary.
2. Map each ticket (2–26) to its review doc and prerequisite tickets.
3. Define PASS/FAIL/GAP recording rules (especially PLANNED routes and live-only smoke).
4. Add verification command index (reuse `test:phase-3`, `check:secrets`, frontend test scripts from module 16).
5. Note that this module produces integration sign-off, not new features.

**Acceptance criteria:**
- Plan and verification tracker exist; no application code changes.

**Test commands:**
- `test -f docs/reviews/phase-3-integration-review-plan.md && test -f docs/testing/phase-3-integration-review-verification.md && echo PASS`

**Depends on:** Phase 3 Testing & Validation complete (module 16).

---

## Ticket 2 — Phase 3 integration scope document

**Ticket:** 2 — Phase 3 integration scope document

**Objective:** Create the authoritative Phase 3 integration scope doc with goals, backend/frontend scope, full API surface inventory, and DB collections/fields per PDF.

**Files to create/update:**
- `docs/architecture/phase-3-integration-scope.md` (create)
- `docs/testing/phase-3-integration-review-verification.md` (update — link scope doc)

**API endpoints:** Document (reference only, do not implement):
- Admin catalog: `POST|GET|PATCH|DELETE /api/v1/admin/catalog/categories`, `brands`, `units`, `products`, `PATCH .../approval-status`
- Admin locations/stores: `cities`, `service-areas`, `stores`
- Admin store products: CRUD + `bulk-map`, `bulk-price`, `bulk-visibility`
- Admin inventory: stocks CRUD, `adjust`, `bulk-upload`, `bulk-thresholds`, movements, locks, `expire-due`
- Admin media: upload, bulk-upload, files CRUD, `signed-url`
- Vendor: catalog (`categories`, `brands`, `products`, `products/:id`, `variants`, `facets`), store-products, inventory, media
- Customer: catalog (`categories`, `brands`, `products`, `search`, `featured-products`, `variants`, `facets`)
- Internal: inventory locks (`create`, `release`, `confirm`), media `attach-owner`, `GET files/:id`

**DB fields:** Document catalog fields (`categories.*`, `brands.*`, `product_units.*`, `products.*`, `product_variants.*`) and store/inventory/media fields (`cities.*`, `service_areas.*`, `stores.*`, `store_products.*`, `inventory_stocks.*`, `inventory_movements.*`, `inventory_locks.*`, `media_files.*`) per PDF pages 413–418.

**Implementation steps:**
1. Add **Phase 3 Goal** and **Completed Phase 3 systems** (modules 1–16 list).
2. Add **Phase 3 Backend Scope** (catalog master data through catalog search).
3. Add **Phase 3 Frontend Scope** (admin catalog/store/inventory, vendor store-catalog/inventory, customer catalog).
4. Add **Phase 3 API Surface** with grouped endpoint tables for admin, vendor, customer, internal.
5. Add **DB collections** and **DB fields** sections (catalog + store/inventory/media).
6. Mark vendor/customer routes not mounted as **PLANNED** where applicable.

**Acceptance criteria:**
- Scope doc complete; matches PDF inventory; PLANNED routes clearly labeled.

**Test commands:**
- `test -f docs/architecture/phase-3-integration-scope.md && echo PASS`

**Depends on:** Ticket 1.

---

## Ticket 3 — Backend catalog & search file review

**Ticket:** 3 — Backend catalog & search file review

**Objective:** Verify catalog backend module folders and required files exist per PDF; record PASS/GAP in review doc.

**Files to create/update:**
- `docs/reviews/phase-3-backend-file-review.md` (create — catalog + search sections)
- `docs/testing/phase-3-integration-review-verification.md` (update)

**API endpoints:** None created. Reference admin catalog + search routes mounted from category through customer/vendor search modules.

**DB fields:** Reference models: `categories`, `brands`, `product_units`, `products`, `product_variants`.

**Implementation steps:**
1. Review `backend/api/src/modules/catalog/categories` — confirm `models/`, `repositories/`, `services/`, `controllers/`, `routes/`, `validators/`, `types/`.
2. Repeat for `brands`, `units`, `products`, `variants` (not `product-variants`).
3. Review `backend/api/src/modules/catalog/search` — repository, services, admin/vendor/customer controllers, routes, validators, types.
4. Record missing files as GAP with path; do not create code in this ticket.
5. Add **API endpoints** and **DB fields** sections noting no new endpoints/fields in this task.

**Acceptance criteria:**
- Review doc lists each module with PASS/GAP per expected file.

**Test commands:**
- `test -f docs/reviews/phase-3-backend-file-review.md && echo PASS`

**Depends on:** Ticket 2.

---

## Ticket 4 — Backend store, inventory & media file review

**Ticket:** 4 — Backend store, inventory & media file review

**Objective:** Verify store foundation, store-products, inventory (stocks, movements, locks), and media module file structure per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-backend-file-review.md` (update — store/inventory/media sections)

**API endpoints:** Reference admin/vendor/internal routes for locations, stores, store-products, inventory, media; no new endpoints.

**DB fields:** `cities`, `service_areas`, `stores`, `store_products`, `inventory_stocks`, `inventory_movements`, `inventory_locks`, `media_files`.

**Implementation steps:**
1. Review `backend/api/src/modules/locations/cities`, `service-areas`, `stores` — controllers, routes, services, repositories, models, validators, types.
2. Review `store-products` — admin + vendor controllers/routes.
3. Review `inventory`, `inventory/movements`, `inventory/locks` — including internal lock controller/routes.
4. Review `media` — admin, vendor, internal controllers; upload middleware; storage adapter factory.
5. Consolidate backend file review PASS/GAP summary.

**Acceptance criteria:**
- Backend file review doc complete for all Phase 3 backend domains.

**Test commands:**
- `grep -q "store-products" docs/reviews/phase-3-backend-file-review.md && echo PASS`

**Depends on:** Ticket 3.

---

## Ticket 5 — Admin Dashboard frontend file review

**Ticket:** 5 — Admin Dashboard frontend file review

**Objective:** Verify admin catalog, stores, and inventory module folders contain expected API clients, forms, and pages per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-frontend-file-review.md` (create — admin sections)

**API endpoints:** None. Reference admin API clients used by catalog/store/inventory modules.

**DB fields:** None.

**Implementation steps:**
1. Review `apps/admin-dashboard/src/modules/catalog` — `api/`, `forms/`, `pages/` (categories, brands, units, products, media).
2. Review `apps/admin-dashboard/src/modules/stores` — cities, service areas, stores.
3. Review `apps/admin-dashboard/src/modules/inventory` — store products, stocks, movements, locks.
4. Record PASS/GAP per expected file from PDF pages 423–424.
5. Add sections: no new API endpoints; no new DB fields.

**Acceptance criteria:**
- Admin frontend file inventory documented with PASS/GAP.

**Test commands:**
- `test -f docs/reviews/phase-3-frontend-file-review.md && echo PASS`

**Depends on:** Ticket 4.

---

## Ticket 6 — Vendor Panel & Customer App frontend file review

**Ticket:** 6 — Vendor Panel & Customer App frontend file review

**Objective:** Verify vendor store-catalog/inventory and customer catalog module files per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-frontend-file-review.md` (update — vendor + customer sections)

**API endpoints:** Reference vendor and customer catalog/inventory/media clients; note PLANNED screens calling unmounted routes.

**DB fields:** None.

**Implementation steps:**
1. Review `apps/vendor-panel/src/modules/store-catalog` and `store-inventory` — APIs, forms, pages.
2. Review `apps/customer-app/src/modules/catalog` — API, screens, components, hooks, filter store.
3. Record GAP if UI references PLANNED endpoints (categories/brands/detail on customer app).
4. Complete frontend file review summary.

**Acceptance criteria:**
- Frontend file review doc covers all three apps.

**Test commands:**
- `grep -q "customer-app" docs/reviews/phase-3-frontend-file-review.md && echo PASS`

**Depends on:** Ticket 5.

---

## Ticket 7 — Shared contract & cross-app type review

**Ticket:** 7 — Shared contract & cross-app type review

**Objective:** Verify Phase 3 shared types in `packages/shared` and cross-app import stability per PDF; document deviations.

**Files to create/update:**
- `docs/reviews/phase-3-shared-contract-review.md` (create)

**API endpoints:** None.

**DB fields:** None (types only).

**Implementation steps:**
1. Review `packages/shared/api` for catalog, store, inventory, media types listed in PDF.
2. Confirm `packages/shared/api/index.ts` exports (or record GAP if types live in app modules).
3. Spot-check admin, vendor, customer imports from stable `@zepto/shared` paths.
4. Reference `docs/architecture/catalog-shared-contracts.md` if present.
5. Add API/DB sections: none created in this task.

**Acceptance criteria:**
- Shared contract review complete with explicit GAP list if PDF-expected types are missing.

**Test commands:**
- `test -f docs/reviews/phase-3-shared-contract-review.md && echo PASS`

**Depends on:** Tickets 5–6.

---

## Ticket 8 — Route registry integration review

**Ticket:** 8 — Route registry integration review

**Objective:** Update and verify `backend-route-registry.md` lists all Phase 3 routes; mark internal routes appropriately.

**Files to create/update:**
- `docs/reviews/phase-3-route-registry-review.md` (create)
- `docs/contracts/backend-route-registry.md` (update — only if gaps found; docs-only corrections)

**API endpoints:** Verify listed:
- Admin catalog, locations, stores, store-products, inventory, media
- Vendor catalog, store-products, inventory, media
- Customer catalog (products, search, featured-products, facets; PLANNED: categories, brands, detail, variants)
- Internal inventory locks + media attach-owner  
Mark internal inventory lock and media attach routes as **internal-only / service-to-service / not public**.

**DB fields:** None.

**Implementation steps:**
1. Cross-check registry against `phase-3-integration-scope.md` API surface.
2. Confirm mount status per route (MOUNTED / PLANNED / INTERNAL).
3. Record review PASS/GAP; update registry doc for any omissions.
4. Link module 16 `phase-3-backend-route-mount-review.md` for cross-reference.

**Acceptance criteria:**
- Route registry review doc complete; registry aligned or gaps explicitly listed.

**Test commands:**
- `test -f docs/reviews/phase-3-route-registry-review.md && echo PASS`

**Depends on:** Ticket 2.

---

## Ticket 9 — Database relationship integration review

**Ticket:** 9 — Database relationship integration review

**Objective:** Verify Phase 3 FK-style relationships and search join paths across catalog, store, inventory, and media collections.

**Files to create/update:**
- `docs/reviews/phase-3-database-integration-review.md` (create)

**API endpoints:** None.

**DB fields verified:**
- `products.categoryId`, `products.subcategoryId`, `products.brandId` → categories/brands
- `product_variants.productId` → products
- `stores.cityId`, `stores.serviceAreaIds[]` → cities/service_areas
- `store_products.storeId`, `productId`, `variantId`
- `inventory_stocks.storeProductId`; `inventory_movements.inventoryStockId`; `inventory_locks.inventoryStockId`
- `media_files.ownerType` + `ownerId`
- Customer/vendor search joins: `products` → `store_products` → `inventory_stocks` (vendor scoped by `vendorId`/`storeId`)

**Implementation steps:**
1. Validate each relationship against Mongoose models/schemas (read-only).
2. Cross-reference `docs/reviews/phase-3-database-schema-review.md` from module 16.
3. Document any broken or soft-reference-only relationships as GAP.
4. Add **DB fields verified** checklist per PDF.

**Acceptance criteria:**
- Database integration review doc lists all relationships with PASS/GAP.

**Test commands:**
- `test -f docs/reviews/phase-3-database-integration-review.md && echo PASS`

**Depends on:** Ticket 8.

---

## Ticket 10 — Permission integration review

**Ticket:** 10 — Permission integration review

**Objective:** Verify Phase 3 routes enforce documented permissions and `super_admin` retains `*:*`.

**Files to create/update:**
- `docs/reviews/phase-3-permission-integration-review.md` (create)

**API endpoints:** All protected Phase 3 admin, vendor, customer routes.

**DB fields:** `roles.permissions`, `user_identities.permissions`, `user_identities.role`

**Implementation steps:**
1. Verify admin catalog → `catalog:read|create|update|delete|approve`.
2. Verify admin locations → `locations:*`; stores → `stores:*`; store products → `store_products:*`; inventory → `inventory:*`; media → `media:*`.
3. Verify vendor → `catalog:read`, `store_products:read|update`, `inventory:read|update`, `media:read|upload|delete`.
4. Verify customer → `catalog:read`; internal routes → internal API auth (not public).
5. Confirm `super_admin` has `*:*` in seed/role config.
6. Link `docs/security/catalog-permissions.md` and module 16 permission review.

**Acceptance criteria:**
- Permission integration review complete; internal routes marked non-public.

**Test commands:**
- `npm run test:access-control-scenarios -w backend/api` (record PASS/FAIL in review doc)

**Depends on:** Ticket 8.

---

## Ticket 11 — Tenant scope integration review

**Ticket:** 11 — Tenant scope integration review

**Objective:** Verify vendor APIs filter/deny by authenticated `vendorId` and `storeId` per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-tenant-scope-integration-review.md` (create)

**API endpoints verified:**
- `GET|PATCH /api/v1/vendor/store-products`, `.../availability`, `.../price`
- `GET|POST /api/v1/vendor/inventory/stocks`, movements, media files

**DB fields:** `user_identities.vendorId`, `user_identities.storeId`, `store_products.vendorId`, `store_products.storeId`, `inventory_stocks.vendorId`, `inventory_stocks.storeId`, `inventory_movements.vendorId`, `inventory_movements.storeId`, `media_files.ownerType`, `media_files.ownerId`

**Implementation steps:**
1. Trace list/detail/update handlers for tenant filters (read-only code review).
2. Verify cross-tenant access returns scope-denied errors (`STORE_PRODUCT_SCOPE_DENIED`, `INVENTORY_SCOPE_DENIED`, etc.).
3. Cross-reference module 16 `phase-3-tenant-scope-validation.md`.
4. Record vendor media scoping behavior.

**Acceptance criteria:**
- Tenant scope integration review documents enforcement points with PASS/GAP.

**Test commands:**
- `npm run test:tenant-access -w backend/api && npm run test:tenant-scope -w backend/api`

**Depends on:** Ticket 10.

---

## Ticket 12 — Customer catalog integration review

**Ticket:** 12 — Customer catalog integration review

**Objective:** Verify customer catalog APIs expose only approved, active, visible records and hide private fields per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-customer-catalog-integration-review.md` (create)

**API endpoints verified:**
- `GET /api/v1/customer/catalog/categories` (PLANNED if not mounted)
- `GET /api/v1/customer/catalog/brands` (PLANNED)
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/search`
- `GET /api/v1/customer/catalog/featured-products`
- `GET /api/v1/customer/catalog/facets`

**DB fields verified:** `categories.status|isVisible|isDeleted`, `brands.status|isVisible|isDeleted`, `products.status|approvalStatus|isVisible|isDeleted`, `store_products.status|isVisible|isAvailable|isDeleted`, `inventory_stocks.availableQuantity|isOutOfStock|isLowStock`; must not expose `vendorId`, `createdBy`, `updatedBy`, `isDeleted`, `deletedAt`, internal metadata.

**Implementation steps:**
1. Review customer catalog service/repository filters (read-only).
2. Confirm list/search/featured/facets share visibility rules.
3. Record PLANNED route GAP separately from visibility rule PASS.
4. Link module 16 customer visibility validation.

**Acceptance criteria:**
- Customer catalog integration review complete with mounted vs PLANNED distinction.

**Test commands:**
- `npm run test:catalog-search -w backend/api` (customer paths)

**Depends on:** Tickets 9, 10.

---

## Ticket 13 — Media integration review

**Ticket:** 13 — Media integration review

**Objective:** Verify media upload purposes, form URL binding, owner attach, unsafe file blocking, and production storage rules.

**Files to create/update:**
- `docs/reviews/phase-3-media-integration-review.md` (create)

**API endpoints verified:**
- `POST /api/v1/admin/media/upload`, `bulk-upload`
- `GET|DELETE /api/v1/admin/media/files/:mediaFileId`
- `POST /api/v1/internal/media/attach-owner`

**DB fields:** `media_files.ownerType`, `ownerId`, `filePurpose`, `storageKey`, `publicUrl`, `mimeType`, `sizeBytes`, `checksum`, `status`, `isDeleted`; catalog/brand/product URL fields (`categories.iconUrl|bannerUrl`, etc.)

**Implementation steps:**
1. Verify purposes: `category_icon`, `category_banner`, `brand_logo`, `brand_banner`, `product_main_image`, `product_gallery_image`, `variant_image`.
2. Confirm blocked types: SVG, HTML, JS, EXE, shell scripts; empty/oversized files.
3. Confirm `MEDIA_STORAGE_PROVIDER=local` blocked when `APP_ENV=production`.
4. Cross-reference module 16 media validation doc.

**Acceptance criteria:**
- Media integration review documents enforcement with PASS/GAP.

**Test commands:**
- `npm run test:media -w backend/api`

**Depends on:** Ticket 10.

---

## Ticket 14 — Inventory integration review

**Ticket:** 14 — Inventory integration review

**Objective:** Verify store-product → inventory stock linkage, adjustments, movements, and lock lifecycle integration per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-inventory-integration-review.md` (create)

**API endpoints verified:**
- `POST /api/v1/admin/inventory/stocks`, `POST .../adjust`, `GET .../movements`
- `POST /api/v1/internal/inventory/locks`, `.../release`, `.../confirm`

**DB fields:** `store_products.storeId|productId|variantId`; `inventory_stocks.*` denormalized fields; `inventory_stocks.availableQuantity|reservedQuantity|totalQuantity|isLowStock|isOutOfStock|lastStockMovementId`; `inventory_movements.movementType|quantity`; `inventory_locks.status|quantity|expiresAt|releasedAt|confirmedAt`

**Implementation steps:**
1. Verify stock creation copies denormalized fields and calculates totals/low-stock flags.
2. Verify adjustments write `inventory_movements` with correct types.
3. Verify lock create/release/confirm mutates available/reserved quantities and writes reservation movement types.
4. Cross-reference module 16 inventory movement/lock validation docs.

**Acceptance criteria:**
- Inventory integration review complete; lock lifecycle documented end-to-end.

**Test commands:**
- `npm run test:inventory -w backend/api && npm run test:inventory-locks -w backend/api`

**Depends on:** Ticket 9.

---

## Ticket 15 — Catalog search integration review

**Ticket:** 15 — Catalog search integration review

**Objective:** Verify admin/vendor/customer listing filters, customer `q` rules, facets, and price sorting integration across surfaces.

**Files to create/update:**
- `docs/reviews/phase-3-search-integration-review.md` (create)

**API endpoints verified:**
- `GET /api/v1/admin/catalog/products`
- `GET /api/v1/vendor/catalog/products`, `/facets`
- `GET /api/v1/customer/catalog/products`, `/search`, `/featured-products`, `/facets`

**DB fields:** `products.name|searchKeywords|tags|categoryId|brandId|foodType|approvalStatus|status|isVisible`; `store_products.finalPrice|isAvailable|isVisible`; `inventory_stocks.isOutOfStock`

**Implementation steps:**
1. Document admin filter params: search, categoryId, brandId, foodType, approvalStatus, status, isVisible, isFeatured, sortBy, sortOrder.
2. Document vendor filters including `isAvailable`.
3. Document customer filters; **`q` min 2, max 100** (not `search`).
4. Verify facets return categories, brands, foodTypes, priceRanges, availability; vendor facets scoped by vendorId/storeId.
5. Note PDF `search` vs repo `q` in deviations section.

**Acceptance criteria:**
- Search integration review aligns repo behavior with PDF intent; deviations listed.

**Test commands:**
- `npm run test:catalog-search -w backend/api`

**Depends on:** Tickets 8, 12.

---

## Ticket 16 — Seed integration review

**Ticket:** 16 — Seed integration review

**Objective:** Verify Phase 3 seed ordering, idempotency, and duplicate prevention per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-seed-integration-review.md` (create)

**API endpoints:** None.

**DB fields:** Unique keys — `categories.slug`, `brands.slug`, `product_units.code`, `products.slug`, `product_variants.sku`, `cities.slug`, `service_areas.slug`, `stores.code`, `store_products.storeId+variantId`, `inventory_stocks.storeProductId`

**Implementation steps:**
1. Review seed runner order: roles → dev users; catalog → store products; locations → stores → store products → inventory.
2. Confirm opening movements created once.
3. Run `npm run seed -w backend/api` twice; record duplicate check for categories, brands, units, products, variants, cities, service_areas, stores, store_products, inventory_stocks.
4. Link module 16 `phase-3-seed-data-validation.md`.

**Acceptance criteria:**
- Seed integration review documents order + idempotency PASS/FAIL (requires MongoDB for live run).

**Test commands:**
- `npm run test:seed-matrix -w backend/api`
- `npm run seed -w backend/api` (twice, if MongoDB available — record in doc)

**Depends on:** Ticket 9.

---

## Ticket 17 — Environment & configuration integration review

**Ticket:** 17 — Environment & configuration integration review

**Objective:** Verify media and inventory-lock env vars in `.env.example`, `env.ts` validation, production guards, and frontend secret hygiene.

**Files to create/update:**
- `docs/reviews/phase-3-env-config-review.md` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Review `backend/api/.env.example` / `.env.development.example` for `MEDIA_*`, `INVENTORY_LOCK_EXPIRY_*`, AWS S3 placeholders.
2. Review `backend/api/src/config/env.ts` — production blocks `MEDIA_STORAGE_PROVIDER=local`; test disables lock expiry job.
3. Confirm frontends lack `AWS_S3_*`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`.
4. Run `npm run check:secrets` and `npm run check:frontend-secrets` at repo root; record results.

**Acceptance criteria:**
- Env config review doc complete with PASS/GAP per variable and secret checks recorded.

**Test commands:**
- `npm run check:secrets && npm run check:frontend-secrets`

**Depends on:** Ticket 13.

---

## Ticket 18 — Error handling integration review

**Ticket:** 18 — Error handling integration review

**Objective:** Confirm Phase 3 error codes exist in `error-codes.ts` and frontends map them to user messages where applicable.

**Files to create/update:**
- `docs/reviews/phase-3-error-handling-review.md` (create)

**API endpoints:** All Phase 3 endpoints (error surface only).

**DB fields:** None.

**Implementation steps:**
1. Verify category, brand, unit, product, city/service-area/store, store-product, inventory, inventory-lock, media, catalog-search error codes per PDF pages 443–444.
2. Cross-check `backend/api/src/errors/error-codes.ts` and `docs/errors/catalog-error-codes.md`.
3. Spot-check frontend error message mapping (admin/vendor/customer) — record GAP if missing.
4. Do not add new codes unless review finds blocking absence (record for follow-up phase instead).

**Acceptance criteria:**
- Error handling review lists all expected codes with present/missing status.

**Test commands:**
- `grep -E "CATEGORY_NOT_FOUND|CATALOG_SEARCH_QUERY_TOO_LONG|INVENTORY_LOCK_NOT_FOUND" backend/api/src/errors/error-codes.ts && echo PASS`

**Depends on:** Ticket 10.

---

## Ticket 19 — Audit log integration review

**Ticket:** 19 — Audit log integration review

**Objective:** Verify Phase 3 audit event types exist and metadata excludes secrets per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-audit-integration-review.md` (create)

**API endpoints:** All Phase 3 mutation endpoints (audit write verification).

**DB fields:** `audit_logs.eventType`, `actorId`, `actorRole`, `actorSurface`, `entityType`, `entityId`, `metadata`, `status`

**Implementation steps:**
1. Verify catalog, store, store_product, inventory, inventory_lock, media, catalog search audit events per PDF pages 445–446.
2. Confirm metadata never includes authorization, tokens, raw buffers, internal/AWS secrets.
3. Cross-reference module 16 `phase-3-audit-log-validation.md`.

**Acceptance criteria:**
- Audit integration review lists expected events with PASS/GAP.

**Test commands:**
- `test -f docs/reviews/phase-3-audit-integration-review.md && echo PASS`

**Depends on:** Tickets 13–15.

---

## Ticket 20 — Security integration review

**Ticket:** 20 — Security integration review

**Objective:** Consolidate Phase 3 security posture: customer field exposure, tenant enforcement, permission authority, media safety, lock token safety, atomic stock updates, business rule blocks.

**Files to create/update:**
- `docs/reviews/phase-3-security-review.md` (create)

**API endpoints:** All protected admin/vendor/customer/internal Phase 3 endpoints.

**DB fields:** `store_products.isPriceLocked`, `inventory_stocks.reservedQuantity`, `inventory_locks.lockToken`, `media_files.storageKey`, `media_files.isDeleted`

**Implementation steps:**
1. Confirm customer APIs do not expose vendor/private fields.
2. Confirm vendor tenant scope is server-side (not UI-only).
3. Confirm admin permission checks on backend; frontend guards are not security authority.
4. Confirm internal lock/media routes require internal authentication.
5. Confirm unsafe upload blocked; local storage blocked in production; signed URLs do not leak secrets.
6. Confirm price update blocked when `isPriceLocked`; stock delete blocked when `reservedQuantity > 0`.
7. Link `docs/reviews/phase-3-production-readiness-risks.md`.

**Acceptance criteria:**
- Security integration review complete with no new features.

**Test commands:**
- `npm run test:access-control-scenarios -w backend/api`

**Depends on:** Tickets 10–13, 19.

---

## Ticket 21 — Documentation coverage review

**Ticket:** 21 — Documentation coverage review

**Objective:** Confirm all Phase 3 architecture, database, contract, review, and handoff docs exist or are listed as missing.

**Files to create/update:**
- `docs/reviews/phase-3-documentation-coverage.md` (create)

**API endpoints:** None (inventory of contract docs).

**DB fields:** None (inventory of schema docs).

**Implementation steps:**
1. Verify architecture docs: `catalog-architecture.md`, `catalog-backend-file-structure.md`, `catalog-media-architecture.md`, `catalog-search-filter-architecture.md`, `catalog-shared-contracts.md`.
2. Verify database docs under `docs/database/` (category, brand, product, variant, unit-tax, index plan, seed plan).
3. Verify API contracts (category through catalog-search-filtering, inventory-locking, media).
4. Verify module handoffs/reviews for modules 1–16; list any missing doc as GAP.
5. Add missing-doc remediation list (docs only — no code).

**Acceptance criteria:**
- Documentation coverage matrix complete with PASS/GAP per doc path.

**Test commands:**
- `test -f docs/reviews/phase-3-documentation-coverage.md && echo PASS`

**Depends on:** Tickets 2–20.

---

## Ticket 22 — Phase 3 Postman collection

**Ticket:** 22 — Phase 3 Postman collection

**Objective:** Create Phase 3 Postman collection with admin, vendor, customer, and internal folders per PDF; add JSON validation script.

**Files to create/update:**
- `docs/contracts/postman/zepto-like-phase-3.postman_collection.json` (create)
- `docs/contracts/postman/README.md` (update — Phase 3 section)
- `package.json` (update root — add `validate:postman:phase-3` script)
- `docs/testing/phase-3-integration-review-verification.md` (update)

**API endpoints:** Include requests for all PDF-listed folders:
- Admin: catalog CRUD samples, cities/service-areas/stores, store-products + bulk ops, inventory stocks/adjust/movements/locks/expire-due, media upload/list/delete
- Vendor: catalog products, store-products price/availability, inventory stocks/adjust/movements
- Customer: categories, brands, products, search (`q`), featured-products, facets (mark PLANNED requests if routes unmounted)
- Internal: inventory lock create/release/confirm, media attach-owner  
Environment variables: `baseUrl`, `adminAccessToken`, `vendorAccessToken`, `customerAccessToken`, `internalAccessToken`, entity IDs per PDF.

**DB fields:** None (collection uses runtime IDs).

**Implementation steps:**
1. Create collection JSON with folder structure from PDF pages 449–451.
2. Add representative requests (method, path, auth header placeholders).
3. Add `validate:postman:phase-3` npm script (JSON parse check, same pattern as phase-2).
4. Document manual execution requirement (Newman optional, not required).

**Acceptance criteria:**
- Postman collection exists; `npm run validate:postman:phase-3` passes.

**Test commands:**
- `npm run validate:postman:phase-3`

**Depends on:** Ticket 8.

---

## Ticket 23 — Phase 3 release notes

**Ticket:** 23 — Phase 3 release notes

**Objective:** Prepare Phase 3 release notes summarizing completed modules, APIs, frontends, security improvements, and known pending items.

**Files to create/update:**
- `docs/releases/phase-3-release-notes.md` (create)

**API endpoints:** Summarize all Phase 3 endpoint groups (admin, vendor, customer, internal) — no new endpoints.

**DB fields:** None in release notes body (reference collections in prose only).

**Implementation steps:**
1. Add **Completed Modules** (1–16 list per PDF).
2. Add **Completed Backend APIs** summaries by domain.
3. Add **Completed Frontend Integrations** (admin, vendor, customer).
4. Add **Security Improvements** (permissions, tenant scope, media validation, customer-safe responses, locks, audit).
5. Add **Known Pending Items** (cart, checkout, address serviceability, cloud media/CDN, advanced search, order deduction, PLANNED catalog routes).
6. Note live Postman execution is manual.

**Acceptance criteria:**
- Release notes doc complete; accurate vs integration scope.

**Test commands:**
- `test -f docs/releases/phase-3-release-notes.md && echo PASS`

**Depends on:** Tickets 2, 21.

---

## Ticket 24 — Phase 3 integration handoff

**Ticket:** 24 — Phase 3 integration handoff

**Objective:** Create Phase 3 integration handoff documenting completed systems, collections, critical rules, and links to validation artifacts.

**Files to create/update:**
- `docs/handoffs/phase-3-integration-review-complete.md` (create)

**API endpoints:** List endpoint groups: admin catalog, locations, stores, store-products, inventory, media; vendor catalog/store-products/inventory; customer catalog; internal locks/media.

**DB fields:** Collections: `categories`, `brands`, `product_units`, `products`, `product_variants`, `cities`, `service_areas`, `stores`, `store_products`, `inventory_stocks`, `inventory_movements`, `inventory_locks`, `media_files`, `audit_logs`.

**Implementation steps:**
1. Document completed backend and frontend systems per PDF page 454.
2. Add **critical integration rules** (customer visibility, vendor scope, store-product bridge, movements on mutation, lock quantity rules, media attach-once).
3. Link quality results: `phase-3-backend-quality-results.md`, `phase-3-frontend-quality-results.md`, `phase-3-final-validation-summary.md`, `phase-3-production-readiness-risks.md`.
4. List known pending items (cart, checkout, PLANNED routes, production CDN, etc.).
5. State live verification still required for production confidence.

**Acceptance criteria:**
- Handoff doc complete and links all key review outputs.

**Test commands:**
- `test -f docs/handoffs/phase-3-integration-review-complete.md && echo PASS`

**Depends on:** Tickets 2–23.

---

## Ticket 25 — Phase 3 architecture integration closeout doc

**Ticket:** 25 — Phase 3 architecture integration closeout doc

**Objective:** Create/update architecture-level Phase 3 integration review doc with closeout conclusion (mirrors Phase 2 pattern).

**Files to create/update:**
- `docs/architecture/phase-3-integration-review.md` (create)
- `docs/contracts/phase-3-module-completion-matrix.md` (create — module 1–17 status)

**API endpoints:** Reference final API surface in `phase-3-integration-scope.md`.

**DB fields:** Reference final collection inventory.

**Implementation steps:**
1. Add goal, modules in scope (1–17), review areas checklist.
2. Add closeout conclusion: static/docs verification vs live verification required.
3. Create module completion matrix with links to handoffs per module.
4. Document deviations (PLANNED routes, `q` vs `search`, shared types GAP if any).
5. Set next phase boundary (Phase 4 / Repository setup — planning only, do not implement).

**Acceptance criteria:**
- Architecture integration doc and completion matrix exist.

**Test commands:**
- `test -f docs/architecture/phase-3-integration-review.md && test -f docs/contracts/phase-3-module-completion-matrix.md && echo PASS`

**Depends on:** Ticket 24.

---

## Ticket 26 — Automated quality gate re-verification

**Ticket:** 26 — Automated quality gate re-verification

**Objective:** Re-run automated quality gates for Phase 3 integration sign-off; update or reference existing quality result docs.

**Files to create/update:**
- `docs/reviews/phase-3-final-approval-checklist.md` (create — automated checks section only, partial)
- `docs/reviews/phase-3-backend-quality-results.md` (update if re-run differs)
- `docs/reviews/phase-3-frontend-quality-results.md` (update if re-run differs)
- `docs/testing/phase-3-integration-review-verification.md` (update)

**API endpoints:** N/A (test execution).

**DB fields:** N/A.

**Implementation steps:**
1. Backend: `npm run typecheck -w backend/api`, `lint`, `test:phase-3`, `test:access-control-scenarios`, `test:tenant-access`, `test:seed-matrix`, `check:health` (if API running).
2. Frontend: typecheck/lint/tests per admin, vendor, customer workspaces; `check:frontend-secrets`.
3. Record PASS/FAIL with timestamps in quality docs and approval checklist automated section.
4. Do not fix code failures in this module unless user approves — record as blockers.

**Acceptance criteria:**
- Automated gate results recorded; checklist partial doc exists.

**Test commands:**
```bash
npm run typecheck -w backend/api && npm run lint -w backend/api && npm run test:phase-3 -w backend/api
npm run test:access-control-scenarios -w backend/api && npm run test:tenant-access -w backend/api
npm run typecheck -w apps/admin-dashboard && npm run typecheck -w apps/vendor-panel && npm run typecheck -w apps/customer-app
npm run check:secrets && npm run check:frontend-secrets
```

**Depends on:** Tickets 1–25 (reviews complete before final gate).

---

## Ticket 27 — Final approval checklist (manual + sign-off)

**Ticket:** 27 — Final approval checklist (manual + sign-off)

**Objective:** Complete Phase 3 final approval checklist with manual confirmations, OpenAPI/Postman/doc checks, and sign-off fields per PDF.

**Files to create/update:**
- `docs/reviews/phase-3-final-approval-checklist.md` (complete all sections)
- `docs/testing/phase-3-integration-review-verification.md` (update — VERIFIED when all PASS)

**API endpoints:** Confirm coverage: all Phase 3 admin, vendor, customer, internal endpoints documented and reviewed.

**DB fields:** All Phase 3 catalog, store, inventory, lock, media, role, permission, tenant fields validated via integration reviews.

**Implementation steps:**
1. Complete automated section from Ticket 26 results.
2. Add manual confirmations: admin catalog/store/inventory/media flows; vendor isolation; customer visibility; inventory movements/locks; media unsafe-file block; audit no secrets; production risks documented.
3. Confirm OpenAPI includes Phase 3 endpoints (link `phase-3-openapi-contract-review.md`).
4. Confirm Postman collection created (Ticket 22).
5. Confirm all Phase 3 docs created/updated (Ticket 21).
6. Add sign-off fields: Reviewer, Date, Approved, Notes.
7. Link `docs/reviews/phase-3-manual-smoke-checklist.md` for live QA (LIVE PENDING acceptable).

**Acceptance criteria:**
- Final approval checklist complete; blockers and LIVE PENDING items explicitly listed.

**Test commands:**
- `test -f docs/reviews/phase-3-final-approval-checklist.md && echo PASS`

**Depends on:** Tickets 20–26.

---

## Ticket 28 — Module closeout and project context update

**Ticket:** 28 — Module closeout and project context update

**Objective:** Mark module 17 complete; update trackers, handoffs, and execution ticket status.

**Files to create/update:**
- `docs/reviews/phase-3-integration-review-execution-tickets.md` (update — all tickets DONE)
- `docs/testing/phase-3-integration-review-verification.md` (update — VERIFIED)
- `project-context/CURRENT_PROGRESS.md` (update — module 17 DONE, Phase 3 complete)
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md` (update — Phase 3 closed)
- `docs/architecture/catalog-architecture.md` (update — link Phase 3 integration closeout, if applicable)

**API endpoints:** Sign-off: all Phase 3 endpoints reviewed per checklist.

**DB fields:** Sign-off: schemas, relationships, seed uniqueness per integration reviews.

**Implementation steps:**
1. Ensure Tickets 1–27 artifacts exist.
2. Add Phase 3 closeout summary paragraph to `PHASE_3_HANDOFF.md`.
3. Set `CURRENT_PROGRESS.md` — Phase 3 Catalog & Inventory Foundation **COMPLETE**; next work is Phase 4 / Repository setup (do not start without approval).
4. Mark all tickets DONE in this file.
5. List deferred items for next phase (PLANNED routes, live smoke, production CDN).

**Acceptance criteria:**
- All tickets DONE; project context reflects Phase 3 completion; handoff published.

**Test commands:**
- All commands from Ticket 26 pass
- `test -f docs/handoffs/phase-3-integration-review-complete.md && echo PASS`

**Depends on:** Tickets 1–27.

---

## Dependency graph (summary)

```text
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9
8 → 10 → 11
9,10 → 12 | 10 → 13 | 9 → 14 | 8,12 → 15
9 → 16 | 13 → 17 | 10 → 18 | 13–15 → 19 → 20
2–20 → 21 → 23
8 → 22
2–23 → 24 → 25 → 26 → 27 → 28
```

**Critical path:** 1 → 2 → 8 → 10 → 12 → 20 → 21 → 24 → 26 → 27 → 28  
**Parallel after Ticket 8:** 11–15 domain integration reviews; Ticket 22 Postman; Ticket 17 env review

**Cross-module order:** Module 16 (Testing & Validation) complete. Module 17 closes Phase 3. Repository & Codebase Setup is **not** started by this module.
