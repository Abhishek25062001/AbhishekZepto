# Catalog Vendor API Contract

Status: **IMPLEMENTED** — all vendor catalog read routes mounted.

Authentication: required (vendor surface).  
Permission: `catalog:read` (vendor roles).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/vendor/catalog/categories` | List visible categories |
| GET | `/api/v1/vendor/catalog/brands` | List visible brands |
| GET | `/api/v1/vendor/catalog/products` | List store-scoped products (search/filters) |
| GET | `/api/v1/vendor/catalog/facets` | Facet counts for filters |
| GET | `/api/v1/vendor/catalog/products/:productId` | Product detail |
| GET | `/api/v1/vendor/catalog/products/:productId/variants` | Variants for product |

## Vendor Restrictions

- Vendor users may **read** approved, visible, non-deleted catalog records only.
- Vendor users **cannot create** global products in Phase 3 unless explicitly enabled in a future decision.
- Vendor or store staff must not use catalog APIs to change global product master fields (`products.*`, `product_variants.*` pricing at master level).

## Vendor Scope Rule

Responses must respect Phase 2 vendor/store scope middleware where applicable.
Store-specific price and stock updates belong to Store Product Mapping and Inventory
modules, not these routes.

## DB Fields (read filters)

- `products.approvalStatus` = `approved`
- `products.isVisible` = true
- `products.isDeleted` = false
- `product_variants.isVisible` = true
- `product_variants.isDeleted` = false

## Related Documents

- `docs/contracts/catalog-admin-api-contract.md`
- `docs/security/catalog-permissions.md`
- Phase 2 tenant scope: `docs/architecture/tenant-store-access-architecture.md`
