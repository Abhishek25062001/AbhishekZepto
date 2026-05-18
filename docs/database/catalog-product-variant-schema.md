# Catalog Product Variant Schema

## Collection

`product_variants`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `productId` | ObjectId | yes | Parent product |
| `variantName` | string | yes | Display name (e.g. "500 g") |
| `sku` | string | yes | Stock keeping unit |
| `barcode` | string | no | Optional barcode |
| `unit` | string | yes | Unit code (references `product_units.code`) |
| `unitValue` | number | yes | Numeric unit amount |
| `mrp` | number | yes | Maximum retail price |
| `defaultSellingPrice` | number | no | Default price before store override |
| `weightInGrams` | number | no | Shipping weight |
| `lengthCm` | number | no | Dimension |
| `widthCm` | number | no | Dimension |
| `heightCm` | number | no | Dimension |
| `imageUrl` | string | no | Variant-specific image |
| `attributeValues` | object | no | Variant attributes map |
| `isDefault` | boolean | yes | Default variant for product |
| `isVisible` | boolean | yes | Listing visibility |
| `status` | enum | yes | `active`, `inactive`, `archived` |
| `isDeleted` | boolean | yes | Soft delete |
| `deletedAt` | Date \| null | no | Soft delete timestamp |
| `createdBy` | ObjectId | no | Admin actor |
| `updatedBy` | ObjectId | no | Admin actor |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## SKU Uniqueness Rule

- `product_variants.sku` must be unique among documents where `isDeleted = false`.

## Default Variant Rule

- Only **one** variant per `productId` may have `isDefault = true`.

## API Endpoints

No API endpoints are created in this schema document. Planned nested admin routes
under `/api/v1/admin/catalog/products/:productId/variants`.
