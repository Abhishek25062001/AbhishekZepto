# Phase 3 Integration Scope

**Phase:** Phase 3 — Catalog & Inventory Foundation  
**Module:** 17 — Phase 3 Integration & Review  
**Status:** Integration sign-off scope (modules 1–16)

## Phase 3 Goal

Deliver catalog master data, store/location foundation, store-product mapping, inventory stock and movement tracking, inventory locking preparation, media upload foundation, multi-surface catalog UIs (admin, vendor, customer), and catalog search/filtering — integrated with Phase 2 auth, permissions, and tenant access control.

## Completed Phase 3 Systems (Modules 1–16)

| # | Module |
|---|--------|
| 1 | Catalog Architecture |
| 2 | Category Management Backend |
| 3 | Brand & Unit Management Backend |
| 4 | Product Management Backend |
| 5 | Product Variant Management Backend |
| 6 | Store Foundation Backend |
| 7 | Store Product Mapping |
| 8 | Inventory Foundation Backend |
| 9 | Inventory Locking Preparation |
| 10 | Media & File Upload Foundation |
| 11 | Admin Dashboard — Catalog Foundation |
| 12 | Admin Dashboard — Store & Inventory Foundation |
| 13 | Vendor Panel — Store Catalog Foundation |
| 14 | Customer App — Catalog Read Foundation |
| 15 | Catalog Search & Filtering Foundation |
| 16 | Phase 3 Testing & Validation |

## Phase 3 Backend Scope

- Catalog master data: categories, brands, product units, products, variants
- City and service area management
- Store management
- Store product mapping (admin + vendor)
- Inventory stock management and movement tracking
- Inventory locking preparation (internal + admin)
- Media upload and file ownership
- Catalog search and filtering (admin enhanced list, vendor/customer search)
- Vendor catalog access (products, facets — partial)
- Customer catalog read access (products, search, featured, facets — partial)
- Admin catalog/store/inventory/media APIs

**Layout note:** Store-domain modules live as top-level siblings under `backend/api/src/modules/` (`locations/`, `stores/`, `store-products/`, `inventory/`, `media/`), not under a `store/` parent folder.

## Phase 3 Frontend Scope

| App | Modules |
|-----|---------|
| Admin Dashboard | `modules/catalog`, `modules/stores`, `modules/inventory` |
| Vendor Panel | `modules/store-catalog`, `modules/store-inventory` |
| Customer App | `modules/catalog` (browse, search, filters) |

## Phase 3 API Surface

### Admin — Catalog

| Method | Path |
|--------|------|
| POST, GET | `/api/v1/admin/catalog/categories` |
| GET, PATCH, DELETE | `/api/v1/admin/catalog/categories/:categoryId` |
| POST, GET | `/api/v1/admin/catalog/brands` |
| GET, PATCH, DELETE | `/api/v1/admin/catalog/brands/:brandId` |
| POST, GET | `/api/v1/admin/catalog/units` |
| GET, PATCH, DELETE | `/api/v1/admin/catalog/units/:unitId` |
| POST, GET | `/api/v1/admin/catalog/products` |
| GET, PATCH, DELETE | `/api/v1/admin/catalog/products/:productId` |
| PATCH | `/api/v1/admin/catalog/products/:productId/approval-status` |
| GET, POST | `/api/v1/admin/catalog/products/:productId/variants` |
| PATCH, DELETE | `/api/v1/admin/catalog/products/:productId/variants/:variantId` |

### Admin — Locations & Stores

| Method | Path |
|--------|------|
| POST, GET | `/api/v1/admin/locations/cities` |
| GET, PATCH, DELETE | `/api/v1/admin/locations/cities/:cityId` |
| POST, GET | `/api/v1/admin/locations/service-areas` |
| GET, PATCH, DELETE | `/api/v1/admin/locations/service-areas/:serviceAreaId` |
| POST, GET | `/api/v1/admin/stores` |
| GET, PATCH, DELETE | `/api/v1/admin/stores/:storeId` |

### Admin — Store Products & Inventory & Media

| Method | Path |
|--------|------|
| POST, GET | `/api/v1/admin/store-products` |
| GET, PATCH, DELETE | `/api/v1/admin/store-products/:storeProductId` |
| POST | `/api/v1/admin/store-products/bulk-map` |
| PATCH | `/api/v1/admin/store-products/bulk-price`, `bulk-visibility` |
| POST, GET | `/api/v1/admin/inventory/stocks` |
| GET, PATCH, DELETE | `/api/v1/admin/inventory/stocks/:inventoryStockId` |
| POST | `/api/v1/admin/inventory/stocks/:inventoryStockId/adjust` |
| POST, PATCH | `/api/v1/admin/inventory/stocks/bulk-upload`, `bulk-thresholds` |
| GET | `/api/v1/admin/inventory/movements`, `.../:movementId` |
| GET | `/api/v1/admin/inventory/locks`, `.../:lockId` |
| POST | `/api/v1/admin/inventory/locks/expire-due` |
| POST | `/api/v1/admin/media/upload`, `bulk-upload` |
| GET, PATCH, DELETE | `/api/v1/admin/media/files/:mediaFileId` |
| GET | `/api/v1/admin/media/files/:mediaFileId/signed-url` |

### Vendor

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/vendor/catalog/categories` | **PLANNED** |
| GET | `/api/v1/vendor/catalog/brands` | **PLANNED** |
| GET | `/api/v1/vendor/catalog/products` | MOUNTED |
| GET | `/api/v1/vendor/catalog/products/:productId` | **PLANNED** |
| GET | `/api/v1/vendor/catalog/products/:productId/variants` | **PLANNED** |
| GET | `/api/v1/vendor/catalog/facets` | MOUNTED |
| GET, PATCH | `/api/v1/vendor/store-products`, `.../availability`, `.../price` | MOUNTED |
| GET, POST | `/api/v1/vendor/inventory/stocks`, `.../adjust` | MOUNTED |
| GET | `/api/v1/vendor/inventory/movements` | MOUNTED |
| POST, GET, DELETE | `/api/v1/vendor/media/upload`, `files` | MOUNTED |

### Customer

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/customer/catalog/categories` | **PLANNED** |
| GET | `/api/v1/customer/catalog/brands` | **PLANNED** |
| GET | `/api/v1/customer/catalog/products` | MOUNTED |
| GET | `/api/v1/customer/catalog/products/:productId` | **PLANNED** |
| GET | `/api/v1/customer/catalog/search` | MOUNTED (`q`, min 2) |
| GET | `/api/v1/customer/catalog/featured-products` | MOUNTED |
| GET | `/api/v1/customer/catalog/products/:productId/variants` | **PLANNED** |
| GET | `/api/v1/customer/catalog/facets` | MOUNTED |

### Internal (service-to-service)

| Method | Path |
|--------|------|
| POST | `/api/v1/internal/inventory/locks` |
| POST | `/api/v1/internal/inventory/locks/:lockToken/release` |
| POST | `/api/v1/internal/inventory/locks/:lockToken/confirm` |
| POST | `/api/v1/internal/media/attach-owner` |
| GET | `/api/v1/internal/media/files/:mediaFileId` |

## DB Collections

`categories`, `brands`, `product_units`, `products`, `product_variants`, `cities`, `service_areas`, `stores`, `store_products`, `inventory_stocks`, `inventory_movements`, `inventory_locks`, `media_files`, `audit_logs`, `roles`, `user_identities`

## DB Fields — Catalog

| Collection | Key fields |
|------------|------------|
| categories | name, slug, parentCategoryId, level, iconUrl, bannerUrl, isFeatured, isVisible, status |
| brands | name, slug, logoUrl, bannerUrl, isFeatured, isVisible, status |
| product_units | code, name, baseUnit, conversionFactor |
| products | name, slug, categoryId, subcategoryId, brandId, productType, foodType, searchKeywords, tags, defaultImageUrl, imageUrls, approvalStatus, status |
| product_variants | productId, variantName, sku, unit, unitValue, mrp, defaultSellingPrice |

## DB Fields — Store / Inventory / Media

| Collection | Key fields |
|------------|------------|
| cities | name, slug, isServiceable |
| service_areas | cityId, slug, isServiceable |
| stores | vendorId, cityId, serviceAreaIds, code, isOpen, isAcceptingOrders |
| store_products | storeId, vendorId, productId, variantId, finalPrice, isAvailable, isVisible |
| inventory_stocks | storeProductId, availableQuantity, reservedQuantity, totalQuantity, isLowStock, isOutOfStock |
| inventory_movements | inventoryStockId, movementType, quantity |
| inventory_locks | lockToken, lockType, quantity, status, expiresAt |
| media_files | ownerType, ownerId, filePurpose, storageKey, publicUrl, status |

## Deviations (PDF vs repo)

- Variants path: `catalog/variants/` (not `product-variants/`)
- Customer search param: **`q`** (not `search`)
- Vendor/customer category, brand, detail, variant routes: **PLANNED** (frontend may call them; backend not mounted)
