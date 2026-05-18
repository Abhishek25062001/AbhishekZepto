# Phase 3 Admin Dashboard — Catalog Foundation — CURSOR Execution Tickets

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** Admin Dashboard — Catalog Foundation  
**Source:** `projectin micro/docthree/PhaesDetail3.pdf` pages 203–234  

**Architecture references:**  
`docs/architecture/catalog-architecture.md`, `docs/contracts/catalog-admin-api-contract.md`, `docs/contracts/media-file-upload-api.md`, `docs/security/catalog-permissions.md`, `docs/errors/catalog-error-codes.md`, `docs/errors/media-upload-error-codes.md`, `docs/validation/catalog-validation-rules.md`, `docs/handoffs/admin-dashboard-authentication-complete.md`, `docs/handoffs/media-file-upload-foundation-complete.md`

**Prerequisites (already in repo):**  
Phase 2 Admin Dashboard auth, RBAC (`CanAccess` / `CanAccessAny`), React Query, axios `apiClient`; catalog backend APIs (categories, brands, units, products, approval); media upload APIs at `/api/v1/admin/media/*` (not `/admin/catalog/media/*`).

**Out of scope for this module:**  
Product **variant** management UI (explicit PDF pending note — later module), Store & Inventory Dashboard UI (module 12), Vendor Panel catalog UI (module 13), Customer App catalog UI (module 14), backend API changes, `packages/shared` catalog TypeScript files, Repository & Codebase Setup, cart/checkout/order flows.

**Execution order notes:**
- Run **Ticket 1** (docs) before implementation tickets.
- Run **Tickets 3–7** (API clients) before **Tickets 12–15** (hooks).
- Run **Tickets 8–9** (types/constants) before **Tickets 18–22** (forms/pages).
- Run **Ticket 10** (routes) before **Tickets 19–27** (pages); update **Ticket 11** (sidebar) after routes exist.
- Run **Ticket 15** (`useMediaUpload`) before **Ticket 17** (`ImageUploadField`) and form tickets using uploads.
- Run **Tickets 16–18** (shared components/utils) before entity pages.
- Media upload UI must use `POST /api/v1/admin/media/upload` with `media:upload`; catalog create/update payloads use `*MediaFileId` fields aligned with backend validators (`iconMediaFileId`, `bannerMediaFileId`, `logoMediaFileId`, `defaultImageMediaFileId`, etc.) — not raw URL-only writes unless backend already accepts URLs on that field.
- PDF paths use `__tests__/`; repo convention is co-located `*.test.tsx` under `apps/admin-dashboard/src/modules/catalog/` (mirror `access-control` smoke pattern).
- Deprecate placeholder `apps/admin-dashboard/src/pages/products/ProductsPage.tsx` when `/catalog/products` routes mount (Ticket 10).

**Status legend:** `PENDING` | `DONE`

**Module status:** All tickets `DONE` (2026-05-18)

---

## Ticket 1 — Admin Dashboard catalog foundation docs

**Ticket:** 1 — Admin Dashboard catalog foundation docs

**Objective:** Document UI scope, routes, permissions, and API wiring for catalog screens (no React implementation).

**Files to create/update:**
- `docs/architecture/admin-dashboard-catalog-foundation.md` (create)
- `docs/contracts/admin-dashboard-catalog-ui-contract.md` (create)
- `docs/testing/admin-dashboard-catalog-verification.md` (create)
- `docs/security/catalog-permissions.md` — add Admin Dashboard UI permission matrix (status note: backend IMPLEMENTED)

**API endpoints:** Document consumer usage only:
- Catalog: `GET|POST /api/v1/admin/catalog/categories`, `GET|PATCH|DELETE .../:categoryId`; same pattern for brands, units, products; `PATCH .../products/:productId/approval-status`
- Media: `POST /api/v1/admin/media/upload`, `GET /api/v1/admin/media/files` (reference only)

**DB fields:** Document fields displayed/edited per PDF pages 233–234: `categories.*`, `brands.*`, `product_units.*`, `products.*`, `media_files.filePurpose`, `media_files.publicUrl`. Note variant UI deferred.

**Implementation steps:**
1. Route map: `/catalog/categories`, `/catalog/brands`, `/catalog/units`, `/catalog/products` (+ `/new`, `/:id`, `/:id/edit`).
2. Permission gates: `catalog:read`, `catalog:create`, `catalog:update`, `catalog:delete`, `catalog:approve`; media upload `media:upload`.
3. List query params per entity (page, limit, search, status, filters from PDF).
4. Verification checklist for manual QA (auth required, permission hiding, CRUD flows).

**Acceptance criteria:**
- Docs match PDF micro-tasks; no new `apps/admin-dashboard` feature code.

**Test commands:**
- `test -f docs/architecture/admin-dashboard-catalog-foundation.md && test -f docs/contracts/admin-dashboard-catalog-ui-contract.md && echo PASS`

**Depends on:** Media & File Upload Foundation complete.

---

## Ticket 2 — Catalog module scaffold

**Ticket:** 2 — Catalog module scaffold

**Objective:** Create `apps/admin-dashboard/src/modules/catalog/` folder layout per PDF.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/api/` (create)
- `apps/admin-dashboard/src/modules/catalog/components/` (create)
- `apps/admin-dashboard/src/modules/catalog/forms/` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/` (create)
- `apps/admin-dashboard/src/modules/catalog/pages/` (create — subfolders `categories/`, `brands/`, `units/`, `products/`)
- `apps/admin-dashboard/src/modules/catalog/types/` (create)
- `apps/admin-dashboard/src/modules/catalog/utils/` (create)
- `apps/admin-dashboard/src/modules/catalog/constants/` (create)
- `apps/admin-dashboard/src/modules/catalog/routes/` (create)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Add barrel `index.ts` files only if needed for clean imports (optional).
2. No pages, hooks, or API methods yet.

**Acceptance criteria:**
- Folder tree exists under `modules/catalog/`; build unaffected.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 1.

---

## Ticket 3 — Category and brand API clients

**Ticket:** 3 — Category and brand API clients

**Objective:** Axios API clients for admin category and brand CRUD.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/api/category.api.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/api/brand.api.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/catalog/categories`
- `GET /api/v1/admin/catalog/categories/:categoryId`
- `POST /api/v1/admin/catalog/categories`
- `PATCH /api/v1/admin/catalog/categories/:categoryId`
- `DELETE /api/v1/admin/catalog/categories/:categoryId`
- `GET|POST|GET|PATCH|DELETE` — same for `/api/v1/admin/catalog/brands` and `:brandId`

**DB fields:** None (transport only).

**Implementation steps:**
1. Methods: `getAdminCategories(query)`, `getAdminCategoryById`, `createAdminCategory`, `updateAdminCategory`, `deleteAdminCategory`.
2. Methods: `getAdminBrands(query)`, `getAdminBrandById`, `createAdminBrand`, `updateAdminBrand`, `deleteAdminBrand`.
3. Use existing `apiClient`; unwrap `{ success, data }` responses per `docs/standards/backend-response-format.md`.
4. Typed query params: `page`, `limit`, `search`, `status`, `isVisible`, `isFeatured`, `parentCategoryId` (categories), `sortBy`, `sortOrder`.

**Acceptance criteria:**
- All 10 methods exist with correct paths; no UI yet.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 4 — Product unit API client

**Ticket:** 4 — Product unit API client

**Objective:** Axios API client for admin product units CRUD.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/api/product-unit.api.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/catalog/units`
- `GET /api/v1/admin/catalog/units/:unitId`
- `POST /api/v1/admin/catalog/units`
- `PATCH /api/v1/admin/catalog/units/:unitId`
- `DELETE /api/v1/admin/catalog/units/:unitId`

**DB fields:** None.

**Implementation steps:**
1. Methods: `getAdminProductUnits(query)`, `getAdminProductUnitById`, `createAdminProductUnit`, `updateAdminProductUnit`, `deleteAdminProductUnit`.
2. Query params: `page`, `limit`, `search`, `status`, `baseUnit`, `sortBy`, `sortOrder`.

**Acceptance criteria:**
- Five methods implemented; typed payloads.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 5 — Product API client (including approval)

**Ticket:** 5 — Product API client (including approval)

**Objective:** Axios API client for admin products CRUD and approval status.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/api/product.api.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/catalog/products`
- `GET /api/v1/admin/catalog/products/:productId`
- `POST /api/v1/admin/catalog/products`
- `PATCH /api/v1/admin/catalog/products/:productId`
- `DELETE /api/v1/admin/catalog/products/:productId`
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`

**DB fields:** None.

**Implementation steps:**
1. CRUD methods per PDF.
2. `updateAdminProductApprovalStatus(productId, { approvalStatus, rejectionReason? })`.
3. List query params: `page`, `limit`, `search`, `categoryId`, `subcategoryId`, `brandId`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `foodType`, `sortBy`, `sortOrder`.

**Acceptance criteria:**
- Six methods implemented.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 6 — Media API client

**Ticket:** 6 — Media API client

**Objective:** Axios client for admin media upload used by catalog forms.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/api/media.api.ts` (create)

**API endpoints:**
- `POST /api/v1/admin/media/upload` (multipart `file` + `filePurpose`, optional `ownerType`, `ownerId`, `isPublic`)
- `GET /api/v1/admin/media/files` (optional list for debugging; not required on all pages)

**DB fields:** Reference `media_files` response fields: `id`, `publicUrl`, `filePurpose`, `mimeType`, `status`.

**Implementation steps:**
1. `uploadAdminMedia(file, payload)` using `FormData`.
2. `getAdminMediaFiles(query)` if needed for future; minimal implementation acceptable.
3. Do **not** call `/api/v1/admin/catalog/media/*` (not implemented).

**Acceptance criteria:**
- Upload method posts to canonical media path.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 7 — Catalog TypeScript types

**Ticket:** 7 — Catalog TypeScript types

**Objective:** Response and form payload types for catalog entities per PDF pages 206–208.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/types/category.types.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/types/brand.types.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/types/product-unit.types.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/types/product.types.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/types/media.types.ts` (create)

**API endpoints:** None.

**DB fields:** Mirror PDF field lists:
- Category response/form: `id`, `name`, `slug`, `description`, `parentCategoryId`, `level`, `displayOrder`, `iconUrl`, `bannerUrl`, `isFeatured`, `isVisible`, `status`, `createdAt`, `updatedAt`; form adds optional `iconMediaFileId`, `bannerMediaFileId` for backend integration.
- Brand: `logoUrl`, `bannerUrl`, `logoMediaFileId`, `bannerMediaFileId`.
- Unit: `code`, `name`, `baseUnit`, `conversionFactor`, `status`.
- Product: full PDF list including `approvalStatus`, `defaultImageUrl`, `imageUrls`, `attributeSummary`; form adds `defaultImageMediaFileId` / gallery IDs as needed.
- Media: `id`, `ownerType`, `ownerId`, `fileCategory`, `filePurpose`, `originalFileName`, `publicUrl`, `mimeType`, `extension`, `sizeBytes`, `width`, `height`, `storageProvider`, `status`, `isPublic`, `metadata`, timestamps.

**Implementation steps:**
1. Separate `*Response`, `*FormValues`, `*ListQuery` types.
2. Align enum string unions with backend constants docs.

**Acceptance criteria:**
- Types compile; no runtime code.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 2.

---

## Ticket 8 — Catalog constants

**Ticket:** 8 — Catalog constants

**Objective:** Frontend enum constants for catalog UI labels and selects.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/constants/catalog-status.constants.ts` (create) — `active`, `inactive`, `archived`
- `apps/admin-dashboard/src/modules/catalog/constants/product.constants.ts` (create) — `productType`: `simple`, `variant`, `bundle_placeholder`; `foodType`: `veg`, `non_veg`, `egg`, `not_applicable`; `approvalStatus`: `draft`, `pending_review`, `approved`, `rejected`, `archived`
- `apps/admin-dashboard/src/modules/catalog/constants/product-unit.constants.ts` (create) — `baseUnit`: `piece`, `pack`, `kg`, `g`, `litre`, `ml`, `dozen`
- `apps/admin-dashboard/src/modules/catalog/constants/media-purpose.constants.ts` (create) — `category_icon`, `category_banner`, `brand_logo`, `brand_banner`, `product_main_image`, `product_gallery_image` (variant_image reserved for future module)

**API endpoints:** None.

**DB fields:** Constants mirror DB enums from schema docs.

**Implementation steps:**
1. Export const objects + label maps for UI selects.
2. Export media purpose literals used by `ImageUploadField`.

**Acceptance criteria:**
- Constants imported by forms without magic strings.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 7.

---

## Ticket 9 — Catalog routes and permission guards

**Ticket:** 9 — Catalog routes and permission guards

**Objective:** Register catalog routes with auth and RBAC guards per PDF pages 209–210.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/routes/catalog.routes.tsx` (create)
- `apps/admin-dashboard/src/routes/admin.routes.tsx` (update — import catalog routes; remove or redirect legacy `/products` placeholder)
- `apps/admin-dashboard/src/pages/products/ProductsPage.tsx` (update — redirect to `/catalog/products` or remove route usage)

**API endpoints:** None (routing only).

**DB fields:** None.

**Implementation steps:**
1. Route paths:
   - `/catalog/categories`, `/catalog/categories/new`, `/catalog/categories/:categoryId/edit`
   - `/catalog/brands`, `/catalog/brands/new`, `/catalog/brands/:brandId/edit`
   - `/catalog/units`, `/catalog/units/new`, `/catalog/units/:unitId/edit`
   - `/catalog/products`, `/catalog/products/new`, `/catalog/products/:productId`, `/catalog/products/:productId/edit`
2. Wrap with `ProtectedRoute` + `CanAccess` / `CanAccessAny`:
   - List/detail: `catalog:read`
   - Create: `catalog:create`
   - Edit: `catalog:update`
   - Delete actions (page-level): `catalog:delete`
   - Approve/reject: `catalog:approve`
3. Placeholder page components acceptable until Tickets 19–27; routes must resolve.

**Acceptance criteria:**
- All 13 catalog paths registered; protected routes reject unauthenticated users.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`
- `npm run build -w apps/admin-dashboard`

**Depends on:** Ticket 2 (use minimal page stubs until Tickets 20–24 implement screens).

---

## Ticket 10 — Sidebar catalog navigation

**Ticket:** 10 — Sidebar catalog navigation

**Objective:** Add Catalog menu group and hide when user lacks `catalog:read`.

**Files to create/update:**
- `apps/admin-dashboard/src/components/layout/Sidebar.tsx` (update)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Replace single “Products” link with Catalog group:
   - Categories → `/catalog/categories`
   - Brands → `/catalog/brands`
   - Units → `/catalog/units`
   - Products → `/catalog/products`
2. Wrap group with `CanAccess permission="catalog:read"`.
3. Hide create/edit affordances at page level (later tickets), not in sidebar.

**Acceptance criteria:**
- Sidebar shows four catalog links when permitted; hidden without `catalog:read`.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 9.

---

## Ticket 11 — Category React Query hooks

**Ticket:** 11 — Category React Query hooks

**Objective:** List, detail, and mutation hooks for categories.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/hooks/useCategories.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/useCategoryDetail.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/useCategoryMutations.ts` (create)

**API endpoints:** Category CRUD (Ticket 3).

**DB fields:** `categories.*` via API responses.

**Implementation steps:**
1. `useCategories` — query key includes list filters; supports URL-synced params (wired in Ticket 24).
2. `useCategoryDetail(categoryId)`.
3. Mutations: create, update, delete with query invalidation.

**Acceptance criteria:**
- Hooks call correct API methods; no pages yet.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 3, 7.

---

## Ticket 12 — Brand React Query hooks

**Ticket:** 12 — Brand React Query hooks

**Objective:** List, detail, and mutation hooks for brands.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/hooks/useBrands.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/useBrandDetail.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/useBrandMutations.ts` (create)

**API endpoints:** Brand CRUD (Ticket 3).

**DB fields:** `brands.*`

**Implementation steps:**
1. List query params: `page`, `limit`, `search`, `status`, `isVisible`, `isFeatured`, `sortBy`, `sortOrder`.
2. Create/update/delete mutations with cache invalidation.

**Acceptance criteria:**
- Hooks implemented and typed.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 3, 7.

---

## Ticket 13 — Product unit React Query hooks

**Ticket:** 13 — Product unit React Query hooks

**Objective:** List, detail, and mutation hooks for product units.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/hooks/useProductUnits.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/useProductUnitDetail.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/useProductUnitMutations.ts` (create)

**API endpoints:** Unit CRUD (Ticket 4).

**DB fields:** `product_units.*`

**Implementation steps:**
1. List filters: `page`, `limit`, `search`, `status`, `baseUnit`, `sortBy`, `sortOrder`.
2. Mutations for create/update/delete.

**Acceptance criteria:**
- Hooks implemented.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 4, 7.

---

## Ticket 14 — Product and media React Query hooks

**Ticket:** 14 — Product and media React Query hooks

**Objective:** Product list/detail/mutations including approval; media upload hook.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/hooks/useProducts.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/useProductDetail.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/useProductMutations.ts` (create)
- `apps/admin-dashboard/src/modules/catalog/hooks/useMediaUpload.ts` (create)

**API endpoints:**
- Product CRUD + `PATCH .../approval-status` (Ticket 5)
- `POST /api/v1/admin/media/upload` (Ticket 6)

**DB fields:** `products.*`, `media_files.*` (upload response)

**Implementation steps:**
1. Product list filters per PDF.
2. `useUpdateProductApprovalStatus` mutation (approve/reject).
3. `useMediaUpload` returns `{ mediaFileId, publicUrl }` on success for form binding.

**Acceptance criteria:**
- Approval mutation accepts `approvalStatus` + optional `rejectionReason`.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 5, 6, 7.

---

## Ticket 15 — Shared catalog UI components (layout)

**Ticket:** 15 — Shared catalog UI components (layout)

**Objective:** Reusable header, status badge, search, and pagination components.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/components/CatalogPageHeader.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/components/CatalogStatusBadge.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/components/CatalogSearchInput.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/components/CatalogPagination.tsx` (create)

**API endpoints:** None.

**DB fields:** Badge maps `status` and `approvalStatus` enums.

**Implementation steps:**
1. `CatalogPageHeader`: `title`, `description`, `primaryActionLabel`, `primaryActionHref`, `requiredPermission`.
2. `CatalogStatusBadge`: `active`, `inactive`, `archived`, `draft`, `pending_review`, `approved`, `rejected`.
3. `CatalogSearchInput` — sync to URL `search` param.
4. `CatalogPagination` — sync `page`, `limit` to URL.

**Acceptance criteria:**
- Components render with existing theme tokens; no entity pages yet.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Ticket 8.

---

## Ticket 16 — Shared catalog UI components (dialogs and upload)

**Ticket:** 16 — Shared catalog UI components (dialogs and upload)

**Objective:** Delete confirmation dialog and image upload field.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/components/ConfirmDeleteDialog.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/components/ImageUploadField.tsx` (create)

**API endpoints:** `POST /api/v1/admin/media/upload` via `useMediaUpload`.

**DB fields:** Uses `mediaFileId` + `publicUrl` from upload response.

**Implementation steps:**
1. `ConfirmDeleteDialog`: `title`, `description`, `confirmLabel`, `isLoading`, `onConfirm`.
2. `ImageUploadField`: props `filePurpose`, `value` (mediaFileId/url), `onChange`; calls `useMediaUpload`; restrict purposes to catalog constants (Ticket 8).
3. Gate upload control with `CanAccess permission="media:upload"`.

**Acceptance criteria:**
- Successful upload returns `mediaFileId` and preview URL to parent form.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 14, 15.

---

## Ticket 17 — Catalog select components and query-param utility

**Ticket:** 17 — Catalog select components and query-param utility

**Objective:** Dropdowns for category/brand/unit selection and URL query sync helper.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/components/CategorySelect.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/components/BrandSelect.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/components/ProductUnitSelect.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/utils/catalog-query-param.util.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/catalog/categories` (active + visible for dropdown mode)
- `GET /api/v1/admin/catalog/brands`
- `GET /api/v1/admin/catalog/units` (active only)

**DB fields:** None.

**Implementation steps:**
1. Selects fetch via lightweight queries (can reuse list API with filters).
2. Subcategory: filter categories where `parentCategoryId` matches selected root.
3. `catalog-query-param.util.ts` — parse/serialize list filters to `URLSearchParams`.

**Acceptance criteria:**
- Utility used by list pages (Ticket 24).

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 11–13.

---

## Ticket 18 — Category and brand forms

**Ticket:** 18 — Category and brand forms

**Objective:** Create/edit forms for categories and brands with media fields.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/forms/CategoryForm.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/forms/BrandForm.tsx` (create)

**API endpoints:** Category and brand CRUD; media upload for icons/banners/logos.

**DB fields:**
- Category: `name`, `description`, `parentCategoryId`, `displayOrder`, `iconUrl`/`iconMediaFileId`, `bannerUrl`/`bannerMediaFileId`, `isFeatured`, `isVisible`, `status`
- Brand: `name`, `description`, `logoUrl`/`logoMediaFileId`, `bannerUrl`/`bannerMediaFileId`, `isFeatured`, `isVisible`, `status`

**Implementation steps:**
1. `react-hook-form` + zod validation: category `name` required, `displayOrder` numeric, `status` required; brand `name` + `status` required.
2. Parent category dropdown from `CategorySelect` (root categories only for parent).
3. Icon/banner/logo uploads via `ImageUploadField` with correct `filePurpose`.
4. Duplicate-submit prevention (disable submit while pending).

**Acceptance criteria:**
- Forms expose `onSubmit` payload matching backend validators.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 16, 17.

---

## Ticket 19 — Product unit and product forms

**Ticket:** 19 — Product unit and product forms

**Objective:** Forms for units and products including relationships and images.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/forms/ProductUnitForm.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/forms/ProductForm.tsx` (create)

**API endpoints:** Unit CRUD; product CRUD; media upload for product images.

**DB fields:**
- Unit: `code`, `name`, `baseUnit`, `conversionFactor`, `status`
- Product: PDF fields pages 217–218; `categoryId` required, `productType`, `foodType`, `status`, images, metadata

**Implementation steps:**
1. Unit validation: `code`, `name`, `baseUnit` required; `conversionFactor > 0`.
2. Product validation: `name`, `categoryId`, `productType`, `foodType`, `status` required.
3. Category/subcategory/brand dropdowns; subcategory filtered by `parentCategoryId`.
4. Main image + gallery uploads (`product_main_image`, `product_gallery_image`).
5. Duplicate-submit prevention.

**Acceptance criteria:**
- Product form does not include variant management section (out of scope).

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 16, 17.

---

## Ticket 20 — Category pages (list, create, edit)

**Ticket:** 20 — Category pages (list, create, edit)

**Objective:** Full category management UI.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/pages/categories/CategoryListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/pages/categories/CategoryCreatePage.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/pages/categories/CategoryEditPage.tsx` (create)

**API endpoints:** Category CRUD.

**DB fields:** `categories.*` columns in table: Name, Slug, Parent, Level, Featured, Visible, Status, Updated At.

**Implementation steps:**
1. List: filters (`search`, `status`, `isVisible`, `isFeatured`, `parentCategoryId`), pagination, create button (`catalog:create`), edit (`catalog:update`), delete with `ConfirmDeleteDialog` (`catalog:delete`).
2. Delete confirmation: “This category will be archived and hidden from catalog lists.”
3. Create → redirect `/catalog/categories`; Edit loads detail by `:categoryId`.
4. Wire routes from Ticket 9.

**Acceptance criteria:**
- End-to-end category CRUD callable against running API (manual QA).

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`
- `npm run build -w apps/admin-dashboard`

**Depends on:** Tickets 9–11, 15–18.

---

## Ticket 21 — Brand pages (list, create, edit)

**Ticket:** 21 — Brand pages (list, create, edit)

**Objective:** Full brand management UI.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/pages/brands/BrandListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/pages/brands/BrandCreatePage.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/pages/brands/BrandEditPage.tsx` (create)

**API endpoints:** Brand CRUD.

**DB fields:** `brands.*` — table columns per PDF page 221.

**Implementation steps:**
1. List filters: `search`, `status`, `isVisible`, `isFeatured`.
2. Permission-gated create/edit/delete; delete message per PDF.
3. Redirects: create/edit success → `/catalog/brands`.

**Acceptance criteria:**
- Brand CRUD UI complete.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 9–12, 15–18.

---

## Ticket 22 — Product unit pages (list, create, edit)

**Ticket:** 22 — Product unit pages (list, create, edit)

**Objective:** Full product unit management UI.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/pages/units/ProductUnitListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/pages/units/ProductUnitCreatePage.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/pages/units/ProductUnitEditPage.tsx` (create)

**API endpoints:** Unit CRUD.

**DB fields:** `product_units.*` — Code, Name, Base Unit, Conversion Factor, Status.

**Implementation steps:**
1. List filters: `search`, `status`, `baseUnit`.
2. Delete confirmation: “This unit will be archived and cannot be used for new variants.”
3. Redirects to `/catalog/units`.

**Acceptance criteria:**
- Unit CRUD UI complete.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 9–13, 15–19.

---

## Ticket 23 — Product pages (list, create, edit)

**Ticket:** 23 — Product pages (list, create, edit)

**Objective:** Product list and create/edit flows.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/pages/products/ProductListPage.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/pages/products/ProductCreatePage.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/pages/products/ProductEditPage.tsx` (create)

**API endpoints:** Product CRUD.

**DB fields:** `products.*` — list columns per PDF page 224.

**Implementation steps:**
1. List filters: `search`, `categoryId`, `subcategoryId`, `brandId`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `foodType`.
2. Actions: view → `/catalog/products/:productId`, edit (`catalog:update`), delete (`catalog:delete`).
3. Create success → product detail or list per contract doc.
4. Edit loads `GET .../products/:productId`.

**Acceptance criteria:**
- Product list/create/edit functional; approval on detail page (Ticket 24).

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 9–14, 15–19.

---

## Ticket 24 — Product detail, approval dialog, and error mapping

**Ticket:** 24 — Product detail, approval dialog, and error mapping

**Objective:** Product detail view with approve/reject workflow and API error messages.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/pages/products/ProductDetailPage.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/components/ProductApprovalDialog.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/utils/catalog-error-message.util.ts` (create)

**API endpoints:**
- `GET /api/v1/admin/catalog/products/:productId`
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`

**DB fields:** Detail sections per PDF: Basic Information, Category & Brand, Images, Search Metadata, Approval Status, System Information (`products.*`).

**Implementation steps:**
1. Approve: `{ approvalStatus: 'approved' }`; Reject: `{ approvalStatus: 'rejected', rejectionReason }` (required).
2. Hide approve/reject without `catalog:approve`.
3. Success feedback + refetch detail after approval update.
4. Map error codes: `CATEGORY_*`, `BRAND_*`, `PRODUCT_UNIT_*`, `PRODUCT_*`, `MEDIA_*` per PDF page 227.

**Acceptance criteria:**
- Approve/reject updates `products.approvalStatus` via API.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`

**Depends on:** Tickets 14, 23.

---

## Ticket 25 — Loading, empty, error states, breadcrumbs, and list UX polish

**Ticket:** 25 — Loading, empty, error states, breadcrumbs, and list UX polish

**Objective:** Consistent list UX and URL filter sync across catalog pages.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/components/CatalogTableSkeleton.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/components/CatalogEmptyState.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/components/CatalogErrorState.tsx` (create)
- Update list pages (Tickets 20–23) to use skeleton/empty/error + `catalog-query-param.util.ts`
- Breadcrumb labels: Catalog → Categories/Brands/Units/Products → Create/Edit/Detail (inline or small config in `catalog.routes.tsx`)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. Wire skeleton/empty/error into all four list pages.
2. Sync filters to URL for categories, brands, units, products.
3. Product delete confirmation text per PDF.

**Acceptance criteria:**
- All list pages share loading/empty/error patterns; filters survive refresh via URL.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`
- `npm run build -w apps/admin-dashboard`

**Depends on:** Tickets 17, 20–24.

---

## Ticket 26 — Category and brand UI tests

**Ticket:** 26 — Category and brand UI tests

**Objective:** Unit tests for category and brand list pages and forms (mocked API).

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/category-list-page.test.tsx` (create — co-located, not `__tests__/`)
- `apps/admin-dashboard/src/modules/catalog/category-form.test.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/brand-list-page.test.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/brand-form.test.tsx` (create)

**API endpoints:** Mock `GET/POST` category and brand endpoints.

**DB fields:** None.

**Implementation steps:**
1. Category list: calls `GET /api/v1/admin/catalog/categories`; create hidden without `catalog:create`; delete hidden without `catalog:delete`.
2. Category form: blocks submit without `name`; submits to `POST /api/v1/admin/catalog/categories`.
3. Brand list/form: same patterns for brand API.

**Acceptance criteria:**
- Tests pass without live backend (mock `apiClient` or hooks).

**Test commands:**
- `npm run test:catalog -w apps/admin-dashboard` (after Ticket 30 adds script) OR `node --test` on compiled tests

**Depends on:** Tickets 18, 20–21.

---

## Ticket 27 — Product unit and product UI tests

**Ticket:** 27 — Product unit and product UI tests

**Objective:** Unit tests for unit/product list, forms, and approval dialog.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/product-unit-list-page.test.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/product-unit-form.test.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/product-list-page.test.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/product-form.test.tsx` (create)
- `apps/admin-dashboard/src/modules/catalog/product-approval-dialog.test.tsx` (create)

**API endpoints:** Mock unit/product/approval endpoints.

**DB fields:** None.

**Implementation steps:**
1. Unit form: block when `code` missing or `conversionFactor <= 0`; submit to `POST .../units`.
2. Product list: calls `GET .../products`; create hidden without `catalog:create`; approval hidden without `catalog:approve`.
3. Product form: block without `name` or `categoryId`; submit to `POST .../products`.
4. Approval: approve calls `PATCH .../approval-status`; reject requires `rejectionReason`.

**Acceptance criteria:**
- Tests pass without HTTP server.

**Test commands:**
- See Ticket 30 `test:catalog`

**Depends on:** Tickets 19, 22–24.

---

## Ticket 28 — Image upload field test

**Ticket:** 28 — Image upload field test

**Objective:** Test media upload field integration.

**Files to create/update:**
- `apps/admin-dashboard/src/modules/catalog/image-upload-field.test.tsx` (create)

**API endpoints:** Mock `POST /api/v1/admin/media/upload`.

**DB fields:** None.

**Implementation steps:**
1. Assert upload calls media endpoint with `filePurpose`.
2. Assert success passes `publicUrl` (and `mediaFileId`) to form `onChange`.

**Acceptance criteria:**
- Test passes with mocked upload hook/client.

**Test commands:**
- See Ticket 30

**Depends on:** Ticket 16.

---

## Ticket 29 — Quality gates and npm test entrypoint

**Ticket:** 29 — Quality gates and npm test entrypoint

**Objective:** Add `test:catalog` script and run admin-dashboard quality gates.

**Files to create/update:**
- `apps/admin-dashboard/package.json` — add `test:catalog` aggregating Tickets 26–28 tests (use `tsconfig` + `node --test` pattern like `test:access-control-smoke`)

**API endpoints:** None.

**DB fields:** None.

**Implementation steps:**
1. `test:catalog`: compile catalog tests then `node --test` on output.
2. Regression: `test:access-control-smoke`, backend `test:categories`, `test:products`, `test:brands` unchanged.

**Acceptance criteria:**
- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:catalog` pass in `apps/admin-dashboard`.

**Test commands:**
- `npm run typecheck -w apps/admin-dashboard`
- `npm run lint -w apps/admin-dashboard`
- `npm run build -w apps/admin-dashboard`
- `npm run test:catalog -w apps/admin-dashboard`
- `npm run test:access-control-smoke -w apps/admin-dashboard`

**Depends on:** Tickets 26–28.

---

## Ticket 30 — Module review, handoff, and project-context closeout

**Ticket:** 30 — Module review, handoff, and project-context closeout

**Objective:** Close Admin Dashboard Catalog Foundation with verification doc and progress updates.

**Files to create/update:**
- `docs/reviews/admin-dashboard-catalog-foundation-review.md` (create — expand from PDF checklist)
- `docs/handoffs/admin-dashboard-catalog-foundation-complete.md` (create)
- `docs/reviews/phase-3-admin-dashboard-catalog-foundation-execution-tickets.md` — mark all tickets DONE
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_3_HANDOFF.md`
- `docs/testing/admin-dashboard-catalog-verification.md` — mark steps verified

**API endpoints:** Verify all consumer endpoints listed in Ticket 1 and PDF pages 232–233.

**DB fields:** Verify UI reads/writes fields per PDF pages 233–234; document variant UI as deferred.

**Implementation steps:**
1. Verification table: 13 UI routes, permissions, CRUD flows, media upload, product approval.
2. Note pending: variant management UI, store/inventory dashboard (module 12).
3. Set next module: **Admin Dashboard — Store & Inventory Foundation**.

**Acceptance criteria:**
- Handoff marks module complete for static/code verification.
- No store/inventory dashboard screens started.
- Tracker all DONE.

**Test commands:**
- All commands from Ticket 29

**Depends on:** Ticket 29.

---

## Dependency graph (summary)

```text
1 → 2 → 3,4,5,6 → 7 → 8
7 → 11,12,13,14
3–6,7 → 14
8 → 15,16
14,16 → 17,18,19
2,9 → 9 → 10
9,11–19,15–17 → 20,21,22,23
14,23 → 24
17,20–24 → 25
18–24 → 26,27,28
26–28 → 29 → 30
```

**Critical path:** 1 → 2 → 3 → 7 → 11 → 18 → 20 → 25 → 26 → 29 → 30  
(Parallel: 4–6 API clients; 12–14 hooks; 21–24 other entities; 28 upload test)

**Cross-module order:** Catalog + Media backends before this module; this module before Admin Dashboard Store & Inventory UI (module 12).
