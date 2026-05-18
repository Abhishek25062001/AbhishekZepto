# Catalog Search & Filtering API Contract

Status: **IMPLEMENTED** — Catalog Search & Filtering Foundation module.

## Admin — enhanced product list

| Method | Path | Permission |
|--------|------|------------|
| GET | `/api/v1/admin/catalog/products` | `catalog:read` |

**Query parameters:** `page`, `limit`, `search` (max 100), `categoryId`, `subcategoryId`, `brandId`, `foodType`, `productType`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `sortBy`, `sortOrder`

**Sort values:** `relevance`, `newest`, `featured`, `name_asc`, `name_desc`, `updated_desc`, `createdAt`, `name`, `updatedAt`

## Vendor — store-scoped catalog

| Method | Path | Permission |
|--------|------|------------|
| GET | `/api/v1/vendor/catalog/products` | `catalog:read` |
| GET | `/api/v1/vendor/catalog/facets` | `catalog:read` |

**Query parameters (products):** `page`, `limit`, `search`, `categoryId`, `subcategoryId`, `brandId`, `foodType`, `productType`, `status`, `isVisible`, `isAvailable`, `isFeatured`, `sortBy`, `sortOrder`

**Tenant scope:** `vendorId`, `storeId` from authenticated actor (not query body).

## Customer — browse and search

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/v1/customer/catalog/products` | Customer session |
| GET | `/api/v1/customer/catalog/search` | Customer session |
| GET | `/api/v1/customer/catalog/featured-products` | Customer session |
| GET | `/api/v1/customer/catalog/facets` | Customer session |

**Products list query:** `page`, `limit`, `search`, `categoryId`, `subcategoryId`, `brandId`, `foodType`, `isFeatured`, `isAvailable`, `minPrice`, `maxPrice`, `cityId`, `storeId`, `sortBy`, `sortOrder`

**Search query:** `q` (required, min 2, max 100) plus optional filters above (except `search`).

**Featured query:** `page`, `limit`, `categoryId`, `brandId`, `cityId`, `storeId`

**Facets query:** `search`, `categoryId`, `subcategoryId`, `brandId`, `foodType`, `cityId`, `storeId`

## Visibility rules (customer)

Products must be: `status=active`, `approvalStatus=approved`, `isVisible=true`, `isDeleted=false`.

Store products must be: `status=active`, `isVisible=true`, `isAvailable=true`, `isDeleted=false`.

Inventory stocks must be: `status=active`, `isDeleted=false`.

When `isAvailable=true`, exclude `inventory_stocks.isOutOfStock=true`.

## Sort mapping (customer)

| `sortBy` | Mongo sort |
|----------|------------|
| `price_low_to_high` | `finalPrice` asc |
| `price_high_to_low` | `finalPrice` desc |
| `newest` | `products.createdAt` desc |
| `featured` | `products.isFeatured` desc |
| `relevance` (default) | `products.isFeatured` desc, then `products.createdAt` desc |

## Error codes

| Code | HTTP |
|------|------|
| `CATALOG_SEARCH_QUERY_TOO_LONG` | 400 |
| `CATALOG_SEARCH_INVALID_SORT` | 400 |
| `CATALOG_SEARCH_INVALID_FILTER` | 400 |
| `CATALOG_SEARCH_PRICE_RANGE_INVALID` | 400 |
| `CATALOG_SEARCH_SCOPE_DENIED` | 403 |
| `CATALOG_SEARCH_FAILED` | 500 |

## DB fields (reference)

See `docs/architecture/catalog-search-filter-architecture.md` and PDF module 15 field list.

## Limitations

- MongoDB regex/text search only (no Elasticsearch in Phase 3).
- Price filters use `store_products.finalPrice` when store mapping exists.
- Customer `categories` / `brands` / `products/:id` / `variants` routes are outside this module unless separately mounted.
