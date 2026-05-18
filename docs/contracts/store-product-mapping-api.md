# Store Product Mapping API

Status: **IMPLEMENTED**

Maps catalog variants to stores with store-specific pricing and visibility.

## Admin endpoints

Base path: `/api/v1/admin/store-products`

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | `store_products:read` |
| POST | `/` | `store_products:create` |
| GET | `/:storeProductId` | `store_products:read` |
| PATCH | `/:storeProductId` | `store_products:update` |
| DELETE | `/:storeProductId` | `store_products:delete` |
| POST | `/bulk-map` | `store_products:bulk_update` |
| PATCH | `/bulk-price` | `store_products:bulk_update` |
| PATCH | `/bulk-visibility` | `store_products:bulk_update` |

## Vendor endpoints

Base path: `/api/v1/vendor/store-products`

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | `store_products:read` |
| GET | `/:storeProductId` | `store_products:read` |
| PATCH | `/:storeProductId/availability` | `store_products:update` |
| PATCH | `/:storeProductId/price` | `store_products:update` |

Vendor routes enforce `vendorId` / `storeId` scope from auth context. Price updates blocked when `isPriceLocked` is true.

## DB fields

`store_products.storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `sku`, `storeSku`, `mrp`, `sellingPrice`, `discountType`, `discountValue`, `finalPrice`, `taxCategoryId`, `isAvailable`, `isVisible`, `isFeatured`, `isPriceLocked`, `priceUpdatedAt`, `availabilityUpdatedAt`, `status`, soft-delete and audit fields.
