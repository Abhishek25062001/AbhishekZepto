# Store Product Schema

## Collection

`store_products`

Maps a catalog **variant** to a **store** with store-specific pricing, visibility, and availability. Does not hold stock quantity (Inventory Foundation).

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `storeId` | ObjectId | yes | Ref `stores` |
| `vendorId` | ObjectId | yes | Denormalized from store |
| `cityId` | ObjectId | yes | Denormalized from store |
| `productId` | ObjectId | yes | Ref `products` |
| `variantId` | ObjectId | yes | Ref `product_variants` |
| `categoryId` | ObjectId | yes | Denormalized from product |
| `brandId` | ObjectId | no | Denormalized from product |
| `sku` | string | yes | Denormalized from variant |
| `storeSku` | string | no | Optional store-specific SKU |
| `mrp` | number | yes | > 0 |
| `sellingPrice` | number | yes | > 0; must be ≤ `mrp` |
| `discountType` | enum | yes | `none`, `flat`, `percentage` |
| `discountValue` | number | yes | Default `0`; required when discount applied |
| `finalPrice` | number | yes | Calculated from price util |
| `taxCategoryId` | ObjectId | no | Denormalized placeholder |
| `isAvailable` | boolean | yes | Default `true` |
| `isVisible` | boolean | yes | Default `true` |
| `isFeatured` | boolean | yes | Default `false` |
| `isPriceLocked` | boolean | yes | Blocks vendor price updates when `true` |
| `priceUpdatedAt` | Date | no | Set when price fields change |
| `availabilityUpdatedAt` | Date | no | Set when availability fields change |
| `status` | enum | yes | `active`, `inactive`, `archived` |
| `isDeleted` | boolean | yes | |
| `deletedAt` | Date \| null | no | |
| `createdBy` | ObjectId | no | |
| `updatedBy` | ObjectId | no | |
| `createdAt` | Date | yes | |
| `updatedAt` | Date | yes | |

## Indexes

| Index | Type |
|-------|------|
| `{ storeId: 1, variantId: 1 }` | unique partial where `isDeleted: false` |
| `{ storeId: 1, storeSku: 1 }` | unique partial where `isDeleted: false` and `storeSku` exists |
| `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId` | ascending |
| `status`, `isAvailable`, `isVisible`, `isFeatured`, `sku`, `createdAt` | ascending |

## API Endpoints

Planned admin and vendor routes documented in `docs/contracts/store-product-mapping-api.md`.
