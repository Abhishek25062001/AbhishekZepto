# Store Product Mapping Validation Rules

Status: **PLANNED** — enforced in Store Product Mapping Backend module.

## Create (`POST /api/v1/admin/store-products`)

| Field | Rule |
|-------|------|
| `storeId` | required ObjectId |
| `productId` | required ObjectId |
| `variantId` | required ObjectId |
| `storeSku` | optional string |
| `mrp` | required number > 0 |
| `sellingPrice` | required number > 0; must be ≤ `mrp` |
| `discountType` | optional enum `none` \| `flat` \| `percentage` |
| `discountValue` | optional number ≥ 0; required when `discountType` is `flat` or `percentage`; must be `0` or omitted when `none` |
| `isAvailable`, `isVisible`, `isFeatured`, `isPriceLocked` | optional boolean |
| `status` | optional enum `active` \| `inactive` \| `archived` |

## Update (`PATCH /api/v1/admin/store-products/:storeProductId`)

Same fields as create, all optional; `sellingPrice` ≤ `mrp` when both present.

## List query (`GET /api/v1/admin/store-products`)

`page`, `limit`, `storeId`, `vendorId`, `cityId`, `productId`, `variantId`, `categoryId`, `brandId`, `status`, `isAvailable`, `isVisible`, `isFeatured`, `search`, `sortBy`, `sortOrder`.

## Bulk map (`POST /api/v1/admin/store-products/bulk-map`)

| Field | Rule |
|-------|------|
| `storeId` | required |
| `items` | required array |
| `items[].productId`, `items[].variantId` | required |
| `items[].mrp`, `items[].sellingPrice` | required > 0 |
| `duplicateMode` | optional enum `fail` \| `skip` \| `replace` (default `fail`) |

## Bulk price (`PATCH /api/v1/admin/store-products/bulk-price`)

`storeProductIds` required array; optional `mrp`, `sellingPrice`, `discountType`, `discountValue`.

## Bulk visibility (`PATCH /api/v1/admin/store-products/bulk-visibility`)

`storeProductIds` required array; optional `isAvailable`, `isVisible`, `isFeatured`, `status`.

## Vendor availability (`PATCH /api/v1/vendor/store-products/:storeProductId/availability`)

Optional `isAvailable`, `isVisible`, `status`.

## Vendor price (`PATCH /api/v1/vendor/store-products/:storeProductId/price`)

Optional `mrp`, `sellingPrice`, `discountType`, `discountValue`; blocked when `isPriceLocked` is true on mapping.

## Price calculation

- `finalPrice` derived via `calculateFinalPrice(mrp, sellingPrice, discountType, discountValue)`.
- Percentage discount cannot exceed 100.
- `finalPrice` must be ≥ 0 and ≤ `mrp`.
