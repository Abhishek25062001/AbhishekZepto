# Phase 1–3 Remaining Work — Execution Tickets

**Generated:** 2026-05-18  
**Machine-readable:** [`phase-1-3-remaining-work-execution-tickets.json`](./phase-1-3-remaining-work-execution-tickets.json)

## Source of truth

| Source | Path |
|--------|------|
| Local audit JSON | [`phase-1-3-local-audit.json`](./phase-1-3-local-audit.json) |
| Verified matrix | [`phase-1-3-verified-completion-matrix.md`](./phase-1-3-verified-completion-matrix.md) |
| Phase 3 handoff | [`project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`](../../project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md) |
| Phase 3 PDF | [`projectin micro/docthree/PhaesDetail3.pdf`](../../projectin%20micro/docthree/PhaesDetail3.pdf) |
| Customer catalog contract | [`docs/contracts/catalog-customer-api-contract.md`](../contracts/catalog-customer-api-contract.md) |
| Vendor catalog contract | [`docs/contracts/catalog-vendor-api-contract.md`](../contracts/catalog-vendor-api-contract.md) |

**Scope:** Only **Partial** or **Not Started** gaps from the audit. **Do not re-execute** Completed modules (e.g. Admin `P3_M12` store/inventory UI, Phase 3 backend CRUD `P3_M02`–`P3_M10` admin APIs).

**Suggested execution order:** `RW-01` → `RW-02` → `RW-03`/`RW-04` (customer API) → `RW-05`/`RW-06` (vendor API) → `RW-13` → `RW-07`–`RW-12` (frontend) → `RW-14` → `RW-15`.

---

## Summary table

| ID | Ticket name | App / layer | Phase module(s) | Priority | Est. | Depends on | Status |
|----|-------------|-------------|-----------------|----------|------|------------|--------|
| RW-01 | `P3_M02_P3_M05_catalog_master_seed` | Backend | P3_M02–P3_M05 | High | 2–3h | — | PENDING |
| RW-02 | `P3_M07_P3_M08_seed_runner_store_inventory` | Backend | P3_M07, P3_M08 | High | 1–2h | RW-01 | PENDING |
| RW-03 | `P3_M14_customer_catalog_categories_brands` | Backend | P3_M14 | High | 1–2h | RW-01 | PENDING |
| RW-04 | `P3_M14_customer_product_detail_variants` | Backend | P3_M14 | High | 1–2h | RW-01, RW-03 | PENDING |
| RW-05 | `P3_M13_vendor_catalog_categories_brands` | Backend | P3_M13 | High | 1–2h | RW-01 | PENDING |
| RW-06 | `P3_M13_vendor_product_detail_variants` | Backend | P3_M13 | High | 1–2h | RW-01, RW-05 | PENDING |
| RW-07 | `P3_M10_vendor_media_upload_ui` | Vendor Panel | P3_M10 | Medium | 2–3h | — | PENDING |
| RW-08 | `P3_M12_admin_stores_page_cleanup` | Admin Dashboard | P3_M12 | Low | 0.5h | — | PENDING |
| RW-09 | `P3_M11_admin_variant_crud_ui` | Admin Dashboard | P3_M11 | Low | 2–3h | — | PENDING |
| RW-10 | `P3_M14_customer_catalog_frontend_integration` | Customer App | P3_M14, P3_M15 | High | 2h | RW-03, RW-04 | PENDING |
| RW-11 | `P3_M14_customer_product_detail_cart_placeholder` | Customer App | P3_M14 | Medium | 1h | RW-10 | PENDING |
| RW-12 | `P3_M13_vendor_catalog_frontend_integration` | Vendor Panel | P3_M13, P3_M15 | High | 1–2h | RW-05, RW-06 | PENDING |
| RW-13 | `P3_M15_openapi_route_registry_sync` | Backend / Docs | P3_M15, P3_M16 | Medium | 1h | RW-03–RW-06 | PENDING |
| RW-14 | `P3_M16_live_manual_postman_smoke` | All | P3_M16, P3_M17 | Medium | 2h | RW-01–06, RW-10, RW-12 | PENDING |
| RW-15 | `P3_M17_gap_closeout_verification` | Docs | P3_M17 | Low | 1h | All above | PENDING |

---

## RW-01 — `P3_M02_P3_M05_catalog_master_seed`

| Field | Value |
|-------|-------|
| **Objective** | Replace catalog/unit seed placeholders with idempotent upserts for categories, brands, units, products, and variants. |
| **App / layer** | Backend |
| **Phase module** | P3_M02, P3_M03, P3_M04, P3_M05 |
| **Priority** | High |
| **Sources** | `phase-1-3-local-audit.json`; `docs/database/catalog-seed-data-plan.md`; `PhaesDetail3.pdf` |

**Files to create/update**

- `backend/api/src/database/seeds/seed-catalog.ts` (new)
- `backend/api/src/database/seeds/seed-units.ts`
- `backend/api/src/database/seeds/seed-default-settings.ts` (if still placeholder)

**DB collections / fields**

- `categories` (slug unique)
- `brands` (slug unique)
- `product_units` (code unique)
- `products` (slug unique)
- `product_variants` (sku unique)

**Dependencies:** None (first in chain).

**Acceptance criteria**

1. `seed-catalog.ts` upserts sample catalog data idempotently.
2. `seed-units.ts` performs real upserts (no placeholder-only log).
3. Second full `npm run seed` creates no duplicate catalog rows.

**Test commands**

```bash
npm run test:seed-matrix -w backend/api
npm run seed -w backend/api
npm run seed -w backend/api
```

---

## RW-02 — `P3_M07_P3_M08_seed_runner_store_inventory`

| Field | Value |
|-------|-------|
| **Objective** | Wire seed-runner order and remove skip logic so store-product and inventory seeds run after catalog seed. |
| **App / layer** | Backend |
| **Phase module** | P3_M07, P3_M08 |
| **Priority** | High |
| **Sources** | `phase-1-3-local-audit.json`; `seed-store-products.ts`; `seed-inventory.ts` |

**Files to create/update**

- `backend/api/src/database/seeds/seed-runner.ts`
- `backend/api/src/database/seeds/seed-store-products.ts`
- `backend/api/src/database/seeds/seed-inventory.ts`

**DB collections / fields**

- `store_products`
- `inventory_stocks`
- `inventory_movements` (opening movement once)

**Dependencies:** RW-01.

**Acceptance criteria**

1. `seed-runner` invokes `seed-catalog` before `seed-store-products`.
2. `seed-store-products` no longer logs catalog-not-configured skip.
3. `seed-inventory` creates stocks when store products exist.
4. Double seed is idempotent for `store_products` and `inventory_stocks`.

**Test commands**

```bash
npm run seed -w backend/api
npm run test:store-products -w backend/api
npm run test:inventory -w backend/api
```

---

## RW-03 — `P3_M14_customer_catalog_categories_brands`

| Field | Value |
|-------|-------|
| **Objective** | Mount customer GET categories and brands with visibility filters per contract. |
| **App / layer** | Backend |
| **Phase module** | P3_M14 |
| **Priority** | High |
| **Sources** | `catalog-customer-api-contract.md`; `phase-1-3-local-audit.json` (P3_M14 Partial); `PhaesDetail3.pdf` |

**Files to create/update**

- `backend/api/src/modules/catalog/search/controllers/catalog-search-customer.controller.ts`
- `backend/api/src/modules/catalog/search/routes/catalog-search-customer.routes.ts`
- `backend/api/src/modules/catalog/search/services/catalog-search.service.ts`
- `docs/contracts/catalog-customer-api-contract.md`
- `docs/contracts/backend-route-registry.md`

**API endpoints**

- `GET /api/v1/customer/catalog/categories`
- `GET /api/v1/customer/catalog/brands`

**DB collections / fields**

- `categories`: `status`, `isVisible`, `isDeleted`
- `brands`: `status`, `isVisible`, `isDeleted`

**Dependencies:** RW-01 (seeded data for manual smoke).

**Acceptance criteria**

1. Authenticated customer receives only active, visible, non-deleted categories/brands.
2. Routes on customer router with `catalog:read`.
3. Route/controller tests pass.
4. Contract marks these endpoints IMPLEMENTED.

**Test commands**

```bash
npm run test:catalog-search -w backend/api
npm run build -w backend/api && node --test dist/modules/catalog/search/controllers/catalog-search.routes.test.js
```

---

## RW-04 — `P3_M14_customer_product_detail_variants`

| Field | Value |
|-------|-------|
| **Objective** | Mount customer GET product detail and variants with approval/visibility rules. |
| **App / layer** | Backend |
| **Phase module** | P3_M14 |
| **Priority** | High |
| **Sources** | `catalog-customer-api-contract.md`; `phase-1-3-local-audit.json` |

**Files to create/update**

- `backend/api/src/modules/catalog/search/controllers/catalog-search-customer.controller.ts`
- `backend/api/src/modules/catalog/search/routes/catalog-search-customer.routes.ts`
- `backend/api/src/modules/catalog/search/validators/catalog-search.validators.ts`
- `docs/contracts/catalog-customer-api-contract.md`

**API endpoints**

- `GET /api/v1/customer/catalog/products/:productId`
- `GET /api/v1/customer/catalog/products/:productId/variants`

**DB collections / fields**

- `products`: `status`, `approvalStatus`, `isVisible`
- `product_variants`: `productId`, `status`, `isVisible`

**Dependencies:** RW-01, RW-03.

**Acceptance criteria**

1. 404 for unapproved or invisible products.
2. Variants exclude deleted/invisible rows.
3. No `vendorId` or internal audit fields in DTO.
4. Contract marks detail/variants IMPLEMENTED.

**Test commands**

```bash
npm run test:catalog-search -w backend/api
npm run test:phase-3 -w backend/api
```

---

## RW-05 — `P3_M13_vendor_catalog_categories_brands`

| Field | Value |
|-------|-------|
| **Objective** | Mount vendor GET categories and brands (read-only, `catalog:read`). |
| **App / layer** | Backend |
| **Phase module** | P3_M13 |
| **Priority** | High |
| **Sources** | `catalog-vendor-api-contract.md`; `phase-1-3-local-audit.json` (P3_M13 Partial) |

**Files to create/update**

- `backend/api/src/modules/catalog/search/controllers/catalog-search-vendor.controller.ts`
- `backend/api/src/modules/catalog/search/routes/catalog-search-vendor.routes.ts`
- `docs/contracts/catalog-vendor-api-contract.md`
- `docs/contracts/backend-route-registry.md`

**API endpoints**

- `GET /api/v1/vendor/catalog/categories`
- `GET /api/v1/vendor/catalog/brands`

**Dependencies:** RW-01.

**Acceptance criteria**

1. Vendor with `catalog:read` receives lists.
2. Unauthenticated → 401.
3. Contract updated for categories/brands.

**Test commands**

```bash
npm run test:catalog-search -w backend/api
npm run test:tenant-access -w backend/api
```

---

## RW-06 — `P3_M13_vendor_product_detail_variants`

| Field | Value |
|-------|-------|
| **Objective** | Mount vendor GET product detail and variants (read-only). |
| **App / layer** | Backend |
| **Phase module** | P3_M13 |
| **Priority** | High |
| **Sources** | `catalog-vendor-api-contract.md`; `phase-1-3-local-audit.json` |

**Files to create/update**

- `backend/api/src/modules/catalog/search/controllers/catalog-search-vendor.controller.ts`
- `backend/api/src/modules/catalog/search/routes/catalog-search-vendor.routes.ts`
- `docs/contracts/catalog-vendor-api-contract.md`

**API endpoints**

- `GET /api/v1/vendor/catalog/products/:productId`
- `GET /api/v1/vendor/catalog/products/:productId/variants`

**Dependencies:** RW-01, RW-05.

**Acceptance criteria**

1. Vendor can fetch detail/variants for approved visible products.
2. No master-catalog mutation via these routes.
3. Vendor catalog contract no longer PARTIAL for read set.

**Test commands**

```bash
npm run test:catalog-search -w backend/api
npm run test:phase-3 -w backend/api
```

---

## RW-07 — `P3_M10_vendor_media_upload_ui`

| Field | Value |
|-------|-------|
| **Objective** | Add vendor media upload, list, and delete UI (backend APIs already exist). |
| **App / layer** | Vendor Panel |
| **Phase module** | P3_M10 |
| **Priority** | Medium |
| **Sources** | `phase-1-3-local-audit.json` (P3_M10 Not Started — vendor UI); `media-file-upload-api.md`; `media-file-upload-foundation-complete.md` |

**Files to create/update**

- `apps/vendor-panel/src/modules/media/api/vendor-media.api.ts`
- `apps/vendor-panel/src/modules/media/pages/VendorMediaListPage.tsx`
- `apps/vendor-panel/src/modules/media/components/MediaUploadField.tsx`
- `apps/vendor-panel/src/routes/vendor.routes.tsx`
- `apps/vendor-panel/src/components/layout/Sidebar.tsx`

**API endpoints**

- `POST /api/v1/vendor/media/upload`
- `GET /api/v1/vendor/media/files`
- `GET /api/v1/vendor/media/files/:mediaFileId`
- `DELETE /api/v1/vendor/media/files/:mediaFileId`

**Dependencies:** None (parallel with backend API work).

**Acceptance criteria**

1. Upload image → appears in list.
2. Delete removes from list.
3. `CanAccess` gates `media:read`, `media:upload`, `media:delete`.
4. `npm run typecheck -w apps/vendor-panel` passes.

**Test commands**

```bash
npm run typecheck -w apps/vendor-panel
npm run test:media -w backend/api
# Manual: vendor token + upload smoke
```

---

## RW-08 — `P3_M12_admin_stores_page_cleanup`

| Field | Value |
|-------|-------|
| **Objective** | Remove orphan `StoresPage` placeholder; `/stores` uses `modules/stores` only. |
| **App / layer** | Admin Dashboard |
| **Phase module** | P3_M12 (cleanup only — module already Completed) |
| **Priority** | Low |
| **Sources** | `phase-1-3-local-audit.json` (orphan page note) |

**Files to create/update**

- Delete or stop exporting `apps/admin-dashboard/src/pages/stores/StoresPage.tsx`
- Verify `apps/admin-dashboard/src/routes/admin.routes.tsx`, `store.routes.tsx`

**Dependencies:** None.

**Acceptance criteria**

1. No route imports `pages/stores/StoresPage`.
2. `/stores` renders `modules/stores/pages/stores/StoreListPage.tsx`.

**Test commands**

```bash
npm run typecheck -w apps/admin-dashboard
grep -r StoresPage apps/admin-dashboard/src || true
```

---

## RW-09 — `P3_M11_admin_variant_crud_ui` (optional)

| Field | Value |
|-------|-------|
| **Objective** | Admin UI to create, edit, delete product variants (backend complete). |
| **App / layer** | Admin Dashboard |
| **Phase module** | P3_M11 |
| **Priority** | Low |
| **Sources** | `phase-1-3-local-audit.json`; `product-variant-management-backend-complete.md` |

**Files to create/update**

- `apps/admin-dashboard/src/modules/catalog/pages/variants/VariantListPage.tsx`
- `apps/admin-dashboard/src/modules/catalog/pages/variants/VariantCreatePage.tsx`
- `apps/admin-dashboard/src/modules/catalog/pages/variants/VariantEditPage.tsx`
- `apps/admin-dashboard/src/modules/catalog/forms/VariantForm.tsx`
- `apps/admin-dashboard/src/modules/catalog/api/product.api.ts`
- `apps/admin-dashboard/src/routes/catalog.routes.tsx`
- `apps/admin-dashboard/src/modules/catalog/pages/products/ProductDetailPage.tsx`

**API endpoints**

- `GET /api/v1/admin/catalog/products/:productId/variants`
- `POST /api/v1/admin/catalog/products/:productId/variants`
- `PATCH /api/v1/admin/catalog/products/:productId/variants/:variantId`
- `DELETE /api/v1/admin/catalog/products/:productId/variants/:variantId`

**Dependencies:** None.

**Acceptance criteria**

1. List/create/edit/delete from product detail.
2. Permission-gated routes.
3. Admin catalog tests pass.

**Test commands**

```bash
npm run typecheck -w apps/admin-dashboard
npm run test:catalog -w apps/admin-dashboard
npm run test:variants -w backend/api
```

---

## RW-10 — `P3_M14_customer_catalog_frontend_integration`

| Field | Value |
|-------|-------|
| **Objective** | Verify/fix customer catalog screens against newly mounted APIs. |
| **App / layer** | Customer App |
| **Phase module** | P3_M14, P3_M15 |
| **Priority** | High |
| **Sources** | `phase-1-3-local-audit.json`; `customer-app-catalog-read-foundation-complete.md` |

**Files to create/update**

- `apps/customer-app/src/modules/catalog/screens/*` (home, category, brand, detail)
- `apps/customer-app/src/modules/catalog/hooks/useCustomerCategories.ts` (and brands, detail, variants)
- `docs/testing/customer-app-catalog-verification.md`

**API endpoints (all customer catalog read)**

- `GET .../categories`, `.../brands`, `.../products`, `.../products/:id`, `.../products/:id/variants`, `.../search`, `.../facets`

**Dependencies:** RW-03, RW-04.

**Acceptance criteria**

1. Home loads categories/brands without errors.
2. Category/brand product lists render.
3. Product detail loads by id; variant selector works.

**Test commands**

```bash
npm run typecheck -w apps/customer-app
npm run test:catalog -w apps/customer-app
```

---

## RW-11 — `P3_M14_customer_product_detail_cart_placeholder`

| Field | Value |
|-------|-------|
| **Objective** | Polish ProductDetail: wired detail/variants; **disabled** Add to Cart until cart phase. |
| **App / layer** | Customer App |
| **Phase module** | P3_M14 |
| **Priority** | Medium |
| **Sources** | `phase-1-3-local-audit.json` (Add to Cart TODO); `ProductDetailScreen.tsx` |

**Files to create/update**

- `apps/customer-app/src/modules/catalog/screens/ProductDetailScreen.tsx`
- `apps/customer-app/src/modules/catalog/components/ProductVariantSelector.tsx`
- `docs/contracts/customer-app-catalog-ui-contract.md`

**Dependencies:** RW-10.

**Acceptance criteria**

1. Add to Cart disabled or “Coming soon” — **no cart API**.
2. Detail shows price, images, variant selection.
3. Contract documents cart phase dependency.

**Test commands**

```bash
npm run test:catalog -w apps/customer-app
# Manual: product detail on simulator
```

---

## RW-12 — `P3_M13_vendor_catalog_frontend_integration`

| Field | Value |
|-------|-------|
| **Objective** | Verify vendor catalog list/detail against mounted PLANNED routes. |
| **App / layer** | Vendor Panel |
| **Phase module** | P3_M13, P3_M15 |
| **Priority** | High |
| **Sources** | `phase-1-3-local-audit.json`; `vendor-panel-store-catalog-foundation-complete.md` |

**Files to create/update**

- `apps/vendor-panel/src/modules/store-catalog/pages/VendorCatalogProductListPage.tsx`
- `apps/vendor-panel/src/modules/store-catalog/pages/VendorCatalogProductDetailPage.tsx`
- `apps/vendor-panel/src/modules/store-catalog/hooks/useVendorCatalogProductDetail.ts`
- `docs/testing/vendor-panel-store-catalog-verification.md`

**API endpoints**

- `GET .../products`, `.../facets`, `.../products/:id`, `.../products/:id/variants`

**Dependencies:** RW-05, RW-06.

**Acceptance criteria**

1. List and detail load without 404 on former PLANNED paths.
2. Facets/search still work.
3. Vendor store-catalog tests pass.

**Test commands**

```bash
npm run typecheck -w apps/vendor-panel
npm run test:store-catalog -w apps/vendor-panel
```

---

## RW-13 — `P3_M15_openapi_route_registry_sync`

| Field | Value |
|-------|-------|
| **Objective** | Sync OpenAPI and route registry after PLANNED catalog mounts. |
| **App / layer** | Backend / Docs |
| **Phase module** | P3_M15, P3_M16 |
| **Priority** | Medium |
| **Sources** | `phase-3-openapi-contract-review.md`; `backend-route-registry.md` |

**Dependencies:** RW-03, RW-04, RW-05, RW-06.

**Acceptance criteria**

1. OpenAPI lists new customer/vendor catalog paths.
2. Route registry PLANNED → MOUNTED.
3. `npm run validate:postman:phase-3` passes.

**Test commands**

```bash
npm run validate:postman:phase-3
npm run build -w backend/api
```

---

## RW-14 — `P3_M16_live_manual_postman_smoke` (documentation only)

| Field | Value |
|-------|-------|
| **Objective** | Execute and record live manual smoke + Postman phase-3 collection. |
| **App / layer** | All |
| **Phase module** | P3_M16, P3_M17 |
| **Priority** | Medium |
| **Sources** | `phase-3-manual-smoke-checklist.md`; `zepto-like-phase-3.postman_collection.json`; `phase-3-testing-validation-complete.md` |

**Files to create/update**

- `docs/reviews/phase-3-manual-smoke-checklist.md` (fill Executed/PASS/Date)
- `docs/testing/phase-1-3-live-smoke-results.md` (new)
- `docs/testing/phase-3-integration-review-verification.md`

**Dependencies:** RW-01, RW-02, RW-03–06, RW-10, RW-12.

**Acceptance criteria**

1. Checklist completed for admin, vendor, customer flows.
2. Postman run documented with env tokens.
3. PASS/FAIL per flow; failures → new tickets.

**Test commands**

```bash
npm run validate:postman:phase-3
npm run check:health -w backend/api
npm run seed -w backend/api
# Manual Postman + app walkthrough
```

---

## RW-15 — `P3_M17_gap_closeout_verification`

| Field | Value |
|-------|-------|
| **Objective** | Update audit JSON and progress docs after all RW tickets. |
| **App / layer** | Docs |
| **Phase module** | P3_M17 |
| **Priority** | Low |
| **Sources** | `phase-1-3-local-audit.json`; `phase-1-3-verified-completion-matrix.md` |

**Dependencies:** All RW-01–RW-14.

**Acceptance criteria**

1. Audit reflects Completed for remediated gaps.
2. Explicit deferrals (cart phase) documented.
3. `CURRENT_PROGRESS.md` updated.

**Test commands**

```bash
npm run test:phase-3 -w backend/api
npm run typecheck --workspaces
```

---

## Excluded from this set (already Completed per audit)

- Admin store/inventory UI (`P3_M12`)
- Phase 3 backend admin CRUD (`P3_M02`–`P3_M11` APIs)
- Customer/vendor Phase 2 auth and sessions
- Customer catalog UI shell (pending API mount only)
- Module 17 integration review tickets (separate doc, all DONE)

## Deferred to later phases (not ticketed here)

- Orders / cart / checkout (`backend/api/src/modules/orders/` stubs)
- Users / delivery domain modules (`.gitkeep` only)
- Customer **Add to Cart** implementation (requires cart phase; RW-11 keeps placeholder only)
