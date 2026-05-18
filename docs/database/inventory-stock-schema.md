# Inventory Stock Schema

## Collection

`inventory_stocks`

Store-level stock quantities for a **store product mapping**. One stock record per `storeId` + `storeProductId` (when not soft-deleted).

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `storeId` | ObjectId | yes | Ref `stores` |
| `vendorId` | ObjectId | yes | Denormalized from store product |
| `cityId` | ObjectId | yes | Denormalized from store product |
| `storeProductId` | ObjectId | yes | Ref `store_products` |
| `productId` | ObjectId | yes | Denormalized |
| `variantId` | ObjectId | yes | Denormalized |
| `sku` | string | yes | Denormalized from mapping |
| `storeSku` | string | no | Denormalized |
| `availableQuantity` | number | yes | min 0 |
| `reservedQuantity` | number | yes | Default 0; locking module updates |
| `damagedQuantity` | number | yes | Default 0 |
| `expiredQuantity` | number | yes | Default 0 |
| `totalQuantity` | number | yes | `available + reserved + damaged + expired` |
| `lowStockThreshold` | number | yes | Default 0 |
| `reorderLevel` | number | yes | Default 0 |
| `isLowStock` | boolean | yes | Derived |
| `isOutOfStock` | boolean | yes | Derived (`available <= 0`) |
| `lastStockUpdatedAt` | Date | no | |
| `lastStockMovementId` | ObjectId | no | Ref `inventory_movements` |
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
| `{ storeId: 1, storeProductId: 1 }` | unique partial where `isDeleted: false` |
| `storeId`, `vendorId`, `cityId`, `storeProductId`, `productId`, `variantId`, `sku` | ascending |
| `isLowStock`, `isOutOfStock`, `status`, `isDeleted`, `createdAt` | ascending |

## API Endpoints

Planned admin and vendor routes documented in `docs/contracts/inventory-foundation-api.md`.
