# Catalog Validation Rules

Status: **PLANNED** — enforced in Category/Product backend modules; documented here for Catalog Architecture.

Applies to admin write endpoints listed in `docs/contracts/catalog-admin-api-contract.md`.

## Category Validation

| Field | Rule |
|-------|------|
| `name` | required |
| `slug` | optional; auto-generated from `name` if missing |
| `description` | optional |
| `parentCategoryId` | optional ObjectId; must reference valid parent |
| `displayOrder` | optional number |
| `iconUrl` | optional URL string |
| `bannerUrl` | optional URL string |
| `isFeatured` | optional boolean |
| `isVisible` | optional boolean |
| `status` | optional enum: `active`, `inactive`, `archived` |

## Brand Validation

| Field | Rule |
|-------|------|
| `name` | required |
| `slug` | optional; auto-generated if missing |
| `description` | optional |
| `logoUrl` | optional |
| `bannerUrl` | optional |
| `isFeatured` | optional boolean |
| `isVisible` | optional boolean |
| `status` | optional enum |

## Product Validation

| Field | Rule |
|-------|------|
| `name` | required |
| `categoryId` | required |
| `brandId` | optional |
| `productType` | required enum |
| `approvalStatus` | admin-only on create/update via dedicated endpoint |
| `defaultImageUrl` | optional |
| `searchKeywords` | optional array of strings |
| `tags` | optional array of strings |

## Variant Validation

| Field | Rule |
|-------|------|
| `productId` | required (from path on nested routes) |
| `variantName` | required |
| `sku` | required |
| `unit` | required (valid `product_units.code`) |
| `unitValue` | required number |
| `mrp` | required number |
| `defaultSellingPrice` | optional number |
| `isDefault` | optional boolean |

## API Endpoints Affected

- `POST|PATCH /api/v1/admin/catalog/categories*`
- `POST|PATCH /api/v1/admin/catalog/brands*`
- `POST|PATCH /api/v1/admin/catalog/products*`
- `POST|PATCH /api/v1/admin/catalog/products/:productId/variants*`

## DB Fields

Validated fields map to collections documented in `docs/database/catalog-*-schema.md`.
