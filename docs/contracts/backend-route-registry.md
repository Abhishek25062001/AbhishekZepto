# Backend Route Registry

## Public Routes

- `GET /api/v1/public/health`
- `GET /api/v1/public/version`
- `GET /api/v1/public/system-info`
- `GET /api/v1/public/docs`
- `GET /api/v1/public/openapi.json`
- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## Customer Routes

Placeholder route group:

```text
/api/v1/customer/*
```

## Delivery Routes

Placeholder route group:

```text
/api/v1/delivery/*
```

## Vendor Routes

Placeholder route group:

```text
/api/v1/vendor/*
```

## Admin Routes

- `GET /api/v1/admin`
- `GET /api/v1/admin/me/permissions`
- `GET /api/v1/admin/roles`
- `POST /api/v1/admin/roles`
- `GET /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/roles/:roleId`
- `DELETE /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/users/:userId/permissions`
- `PATCH /api/v1/admin/users/:userId/role`
- `POST /api/v1/admin/users/:userId/sync-role-permissions`

## Internal Routes

- `POST /api/v1/internal/system/database-write-check`
- `GET /api/v1/internal/auth/test-protected`

Internal test routes must be protected or removed before production.

## Phase 3 Catalog Routes — Categories (mounted)

Mounted in Category Management Backend (`admin.routes.ts`):

- `GET /api/v1/admin/catalog/categories`
- `POST /api/v1/admin/catalog/categories`
- `GET /api/v1/admin/catalog/categories/:categoryId`
- `PATCH /api/v1/admin/catalog/categories/:categoryId`
- `DELETE /api/v1/admin/catalog/categories/:categoryId`

Contract: `docs/contracts/category-management-api.md`

## Phase 3 Catalog Routes — Brands & Units (mounted)

- `GET|POST /api/v1/admin/catalog/brands`
- `GET|PATCH|DELETE /api/v1/admin/catalog/brands/:brandId`
- `GET|POST /api/v1/admin/catalog/units`
- `GET|PATCH|DELETE /api/v1/admin/catalog/units/:unitId`

Contracts: `docs/contracts/brand-management-api.md`, `docs/contracts/product-unit-management-api.md`

## Phase 3 Catalog Routes — Products (mounted)

- `GET|POST /api/v1/admin/catalog/products`
- `GET|PATCH|DELETE /api/v1/admin/catalog/products/:productId`
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`

Contract: `docs/contracts/product-management-api.md`

## Phase 3 Catalog Routes — Product Variants (nested, mounted)

- `GET|POST /api/v1/admin/catalog/products/:productId/variants`
- `PATCH|DELETE /api/v1/admin/catalog/products/:productId/variants/:variantId`

Contract: `docs/contracts/product-variant-management-api.md`

## Phase 3 Location & Store Routes (mounted)

- `GET|POST /api/v1/admin/locations/cities`
- `GET|PATCH|DELETE /api/v1/admin/locations/cities/:cityId`
- `GET|POST /api/v1/admin/locations/service-areas`
- `GET|PATCH|DELETE /api/v1/admin/locations/service-areas/:serviceAreaId`
- `GET|POST /api/v1/admin/stores`
- `GET|PATCH|DELETE /api/v1/admin/stores/:storeId`

Contracts: `docs/contracts/city-management-api.md`, `docs/contracts/service-area-management-api.md`, `docs/contracts/store-management-api.md`

## Phase 3 Store Product Mapping Routes (mounted)

Admin:

- `GET|POST /api/v1/admin/store-products`
- `GET|PATCH|DELETE /api/v1/admin/store-products/:storeProductId`
- `POST /api/v1/admin/store-products/bulk-map`
- `PATCH /api/v1/admin/store-products/bulk-price`
- `PATCH /api/v1/admin/store-products/bulk-visibility`

Vendor:

- `GET /api/v1/vendor/store-products`
- `GET /api/v1/vendor/store-products/:storeProductId`
- `PATCH /api/v1/vendor/store-products/:storeProductId/availability`
- `PATCH /api/v1/vendor/store-products/:storeProductId/price`

Contract: `docs/contracts/store-product-mapping-api.md`

## Phase 3 Inventory Foundation Routes (mounted)

Admin:

- `POST|GET /api/v1/admin/inventory/stocks`
- `GET|PATCH|DELETE /api/v1/admin/inventory/stocks/:inventoryStockId`
- `POST /api/v1/admin/inventory/stocks/:inventoryStockId/adjust`
- `POST /api/v1/admin/inventory/stocks/bulk-upload`
- `PATCH /api/v1/admin/inventory/stocks/bulk-thresholds`
- `GET /api/v1/admin/inventory/movements`
- `GET /api/v1/admin/inventory/movements/:movementId`

Vendor:

- `GET /api/v1/vendor/inventory/stocks`
- `GET /api/v1/vendor/inventory/stocks/:inventoryStockId`
- `POST /api/v1/vendor/inventory/stocks/:inventoryStockId/adjust`
- `GET /api/v1/vendor/inventory/movements`

Contract: `docs/contracts/inventory-foundation-api.md`

## Phase 3 — Inventory Locking (mounted)

**Internal**

- `POST /api/v1/internal/inventory/locks`
- `POST /api/v1/internal/inventory/locks/:lockToken/release`
- `POST /api/v1/internal/inventory/locks/:lockToken/confirm`

**Admin**

- `GET /api/v1/admin/inventory/locks`
- `GET /api/v1/admin/inventory/locks/:lockId`
- `POST /api/v1/admin/inventory/locks/expire-due`

Contract: `docs/contracts/inventory-locking-api.md`

## Phase 3 — Media & File Upload (mounted)

**Admin**

- `POST /api/v1/admin/media/upload`
- `POST /api/v1/admin/media/bulk-upload`
- `GET /api/v1/admin/media/files`
- `GET /api/v1/admin/media/files/:mediaFileId`
- `GET /api/v1/admin/media/files/:mediaFileId/signed-url`
- `PATCH /api/v1/admin/media/files/:mediaFileId`
- `DELETE /api/v1/admin/media/files/:mediaFileId`

**Vendor**

- `POST /api/v1/vendor/media/upload`
- `GET /api/v1/vendor/media/files`
- `GET /api/v1/vendor/media/files/:mediaFileId`
- `DELETE /api/v1/vendor/media/files/:mediaFileId`

**Internal**

- `POST /api/v1/internal/media/attach-owner`
- `GET /api/v1/internal/media/files/:mediaFileId`

Contract: `docs/contracts/media-file-upload-api.md`

## Phase 3 Catalog Search & Filtering (mounted)

Admin enhanced list (via existing products route):

- `GET /api/v1/admin/catalog/products` — search, filters, sort (`catalog:read`)

Vendor:

- `GET /api/v1/vendor/catalog/categories`
- `GET /api/v1/vendor/catalog/brands`
- `GET /api/v1/vendor/catalog/products`
- `GET /api/v1/vendor/catalog/products/:productId`
- `GET /api/v1/vendor/catalog/products/:productId/variants`
- `GET /api/v1/vendor/catalog/facets`

Customer:

- `GET /api/v1/customer/catalog/categories`
- `GET /api/v1/customer/catalog/brands`
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/products/:productId`
- `GET /api/v1/customer/catalog/products/:productId/variants`
- `GET /api/v1/customer/catalog/search` (`q` param)
- `GET /api/v1/customer/catalog/featured-products`
- `GET /api/v1/customer/catalog/facets`

Contract: `docs/contracts/catalog-search-filtering-api.md`

## Phase 3 Catalog Read Routes

All vendor/customer catalog browse routes are **MOUNTED** (RW-03–RW-06, 2026-05-18). See:

- `docs/contracts/catalog-admin-api-contract.md`
- `docs/contracts/catalog-vendor-api-contract.md`
- `docs/contracts/catalog-customer-api-contract.md`
