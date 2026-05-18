# Catalog Admin API Contract

Status: **PARTIAL** — categories, brands, units, products, and variants implemented; vendor/customer surfaces remain planned.

Authentication: required (admin surface).  
Permission gates: see `docs/security/catalog-permissions.md`.

## Categories

| Method | Path | Permission |
|--------|------|------------|
| GET | `/api/v1/admin/catalog/categories` | `catalog:read` |
| POST | `/api/v1/admin/catalog/categories` | `catalog:create` |
| GET | `/api/v1/admin/catalog/categories/:categoryId` | `catalog:read` |
| PATCH | `/api/v1/admin/catalog/categories/:categoryId` | `catalog:update` |
| DELETE | `/api/v1/admin/catalog/categories/:categoryId` | `catalog:delete` |

DB fields: `categories.*` — see `docs/database/catalog-category-schema.md`.

## Brands

| Method | Path | Permission |
|--------|------|------------|
| GET | `/api/v1/admin/catalog/brands` | `catalog:read` |
| POST | `/api/v1/admin/catalog/brands` | `catalog:create` |
| GET | `/api/v1/admin/catalog/brands/:brandId` | `catalog:read` |
| PATCH | `/api/v1/admin/catalog/brands/:brandId` | `catalog:update` |
| DELETE | `/api/v1/admin/catalog/brands/:brandId` | `catalog:delete` |

DB fields: `brands.*` — see `docs/database/catalog-brand-schema.md`.

## Products

| Method | Path | Permission |
|--------|------|------------|
| GET | `/api/v1/admin/catalog/products` | `catalog:read` — enhanced search/filters (`search`, `categoryId`, `brandId`, `foodType`, `productType`, `approvalStatus`, `status`, `isVisible`, `isFeatured`, `sortBy`, `sortOrder`) |
| POST | `/api/v1/admin/catalog/products` | `catalog:create` |
| GET | `/api/v1/admin/catalog/products/:productId` | `catalog:read` |
| PATCH | `/api/v1/admin/catalog/products/:productId` | `catalog:update` |
| DELETE | `/api/v1/admin/catalog/products/:productId` | `catalog:delete` |
| PATCH | `/api/v1/admin/catalog/products/:productId/approval-status` | `catalog:approve` |

DB fields: `products.*` — see `docs/database/catalog-product-schema.md`.

## Variants (nested under product)

| Method | Path | Permission |
|--------|------|------------|
| POST | `/api/v1/admin/catalog/products/:productId/variants` | `catalog:create` |
| GET | `/api/v1/admin/catalog/products/:productId/variants` | `catalog:read` |
| PATCH | `/api/v1/admin/catalog/products/:productId/variants/:variantId` | `catalog:update` |
| DELETE | `/api/v1/admin/catalog/products/:productId/variants/:variantId` | `catalog:delete` |

DB fields: `product_variants.*` — see `docs/database/catalog-product-variant-schema.md`.

## Product units

| Method | Path | Permission |
|--------|------|------------|
| GET | `/api/v1/admin/catalog/units` | `catalog:read` |
| POST | `/api/v1/admin/catalog/units` | `catalog:create` |
| GET | `/api/v1/admin/catalog/units/:unitId` | `catalog:read` |
| PATCH | `/api/v1/admin/catalog/units/:unitId` | `catalog:update` |
| DELETE | `/api/v1/admin/catalog/units/:unitId` | `catalog:delete` |

DB fields: `product_units.*` — see `docs/database/catalog-unit-tax-schema.md`.

## Media (reference)

| Method | Path | Permission |
|--------|------|------------|
| POST | `/api/v1/admin/catalog/media/upload` | `catalog:media_upload` |
| DELETE | `/api/v1/admin/catalog/media/:mediaId` | `catalog:update` or `catalog:delete` |

See `docs/architecture/catalog-media-architecture.md`. Runtime upload belongs to Media module.

## Request/Response Conventions

Follow `docs/standards/api-conventions.md` and `docs/standards/backend-response-format.md`.
Validation rules: `docs/validation/catalog-validation-rules.md`.
Error codes: `docs/errors/catalog-error-codes.md`.
