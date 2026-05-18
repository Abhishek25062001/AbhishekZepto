# Catalog Search and Filter Architecture

Status: **IMPLEMENTED** — MongoDB-first search in Phase 3 (Catalog Search & Filtering Foundation).

## Searchable Fields

- `products.name`
- `products.slug`
- `products.searchKeywords`
- `products.tags`
- `brands.name`
- `categories.name`
- `product_variants.sku`
- `product_variants.barcode`

## Customer Filters

Query parameters on customer list/search endpoints:

| Parameter | Maps to |
|-----------|---------|
| `categoryId` | `products.categoryId` |
| `brandId` | `products.brandId` |
| `minPrice` | variant MRP/selling price (catalog phase; store price later) |
| `maxPrice` | variant MRP/selling price |
| `foodType` | `products.foodType` |
| `isFeatured` | `products.isFeatured` |
| `searchQuery` | text search across searchable fields |
| `sortBy` | name, price, createdAt (documented per implementation) |

## Admin Filters

Additional admin product list filters:

- `approvalStatus`
- `status`
- `isVisible`
- `createdBy`
- `updatedBy`
- `searchQuery`

## Initial Search Approach

- Phase 3: **MongoDB** text indexes and compound indexes (see `docs/database/catalog-index-plan.md`).
- Elasticsearch / Meilisearch: deferred to scale-readiness phase.

## API Endpoints (reference)

| Method | Path |
|--------|------|
| GET | `/api/v1/admin/catalog/products` |
| GET | `/api/v1/vendor/catalog/products` |
| GET | `/api/v1/customer/catalog/products` |
| GET | `/api/v1/customer/catalog/search` |

## DB Fields

Index and filter fields documented in schema and index plan docs.

## Limitation

`minPrice` / `maxPrice` filters on customer APIs use variant-level catalog prices until
store-product overrides exist. Document in implementation modules.
