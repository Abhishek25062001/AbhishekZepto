# Catalog Customer API Contract

Status: **IMPLEMENTED** — all customer catalog read routes mounted.

Authentication: customer auth required in Phase 3 (see `docs/security/catalog-permissions.md`).
Public unauthenticated browse may be enabled later.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/customer/catalog/categories` | Browse categories |
| GET | `/api/v1/customer/catalog/brands` | Browse brands |
| GET | `/api/v1/customer/catalog/products` | List products (filters) |
| GET | `/api/v1/customer/catalog/products/:productId` | Product detail |
| GET | `/api/v1/customer/catalog/search` | Search products (`q` min 2, max 100) |
| GET | `/api/v1/customer/catalog/facets` | Facet counts for filters |
| GET | `/api/v1/customer/catalog/featured-products` | Featured listing |

## Customer Visibility Rule

Customer APIs return only records that are:

- `status` active (product/variant/category/brand as applicable)
- `approvalStatus = approved` (products)
- `isVisible = true`
- `isDeleted = false`

## Future Inventory Rule

Phase 3 catalog APIs return **catalog master data only**. Store-specific stock and
availability are joined later through `store_products` and `inventory_stocks` in
Store Product Mapping and Customer catalog integration modules.

## DB Fields (filter reference)

- `products.status`
- `products.approvalStatus`
- `products.isVisible`
- `products.isDeleted`
- `product_variants.status`
- `product_variants.isVisible`
- `product_variants.isDeleted`

## Search and Filters

See `docs/architecture/catalog-search-filter-architecture.md`.
