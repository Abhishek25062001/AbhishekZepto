# Catalog Index Plan

Status: **APPLIED** — compound and text indexes added for catalog search/filtering (Catalog Search & Filtering Foundation).

## Category Indexes

| Index | Type |
|-------|------|
| `slug` | unique partial where `isDeleted = false` |
| `parentCategoryId` | ascending |
| `status` | ascending |
| `displayOrder` | ascending |
| `isDeleted` | ascending |

## Brand Indexes

| Index | Type |
|-------|------|
| `slug` | unique partial where `isDeleted = false` |
| `status` | ascending |
| `isFeatured` | ascending |

## Product Indexes

| Index | Type |
|-------|------|
| `slug` | unique partial where `isDeleted = false` |
| `categoryId` | ascending |
| `subcategoryId` | ascending |
| `brandId` | ascending |
| `approvalStatus` | ascending |
| `status` | ascending |
| `isVisible` | ascending |
| `isFeatured` | ascending |
| `searchKeywords` | text |

## Variant Indexes

| Index | Type |
|-------|------|
| `productId` | ascending |
| `sku` | unique partial where `isDeleted = false` |
| `barcode` | sparse |
| `status` | ascending |
| `isVisible` | ascending |

## API Endpoints

No API endpoints created. List/search endpoints benefit from these indexes:

- `GET /api/v1/admin/catalog/products`
- `GET /api/v1/vendor/catalog/products`
- `GET /api/v1/customer/catalog/products`
- `GET /api/v1/customer/catalog/search`

## DB Fields Indexed

Summary keys: `categories.slug`, `categories.parentCategoryId`, `brands.slug`,
`products.slug`, `products.categoryId`, `products.brandId`, `products.approvalStatus`,
`product_variants.productId`, `product_variants.sku`.
