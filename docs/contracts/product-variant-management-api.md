# Product Variant Management API

Status: **IMPLEMENTED**

Base path: `/api/v1/admin/catalog/products/:productId/variants`

## Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | `catalog:read` |
| POST | `/` | `catalog:create` |
| PATCH | `/:variantId` | `catalog:update` |
| DELETE | `/:variantId` | `catalog:delete` |

## Create / update body (high level)

Required on create: `variantName`, `sku`, `unit`, `unitValue`, `mrp`.  
Optional: `barcode`, `defaultSellingPrice`, `weightInGrams`, `lengthCm`, `widthCm`, `heightCm`, `imageUrl`, `attributeValues`, `isDefault`, `isVisible`, `status`.

`productId` comes from the URL path only (not accepted in body).

## Rules

- `sku` unique among non-deleted variants (global).
- `barcode` unique when provided.
- `unit` must match an active `product_units.code`.
- Only one `isDefault: true` per product; first variant is forced default.
- Deleting the default variant auto-promotes the oldest remaining variant when others exist.

## List query

`page`, `limit`, `status`, `isVisible`, `isDefault`, `sortBy`, `sortOrder`

## DB fields

See `docs/database/catalog-product-variant-schema.md`.

## Cross-module dependencies

- `countActiveVariantsByProduct(productId)` — blocks product delete
- `countVariantsUsingUnit(unitCode)` — blocks unit delete
