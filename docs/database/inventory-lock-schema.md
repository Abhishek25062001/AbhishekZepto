# Inventory Lock Schema

## Collection

`inventory_locks`

Temporary stock reservations tied to cart, checkout, order, or operational flows. Mutates `inventory_stocks.availableQuantity` and `reservedQuantity` while `status = active`.

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `storeId` | ObjectId | yes | Denormalized from stock |
| `vendorId` | ObjectId | yes | Denormalized |
| `cityId` | ObjectId | yes | Denormalized |
| `inventoryStockId` | ObjectId | yes | Ref `inventory_stocks` |
| `storeProductId` | ObjectId | yes | Ref `store_products` |
| `productId` | ObjectId | yes | Denormalized |
| `variantId` | ObjectId | yes | Denormalized |
| `customerId` | ObjectId | no | Optional cart/checkout context |
| `cartId` | ObjectId | no | Optional |
| `orderId` | ObjectId | no | Set on confirm when provided |
| `lockToken` | string | yes | `lock_<random-safe-id>` |
| `lockType` | enum | yes | `cart`, `checkout`, `order`, `manual`, `system` |
| `quantity` | number | yes | min 1 |
| `status` | enum | yes | See status enum |
| `expiresAt` | Date | yes | Default from lock type |
| `releasedAt` | Date | no | Set on release/expire |
| `confirmedAt` | Date | no | Set on confirm |
| `releaseReason` | string | no | Required on release |
| `confirmationReason` | string | no | Required on confirm |
| `metadata` | object | no | Arbitrary JSON |
| `createdBy` | ObjectId | no | Actor |
| `updatedBy` | ObjectId | no | Actor |
| `createdAt` | Date | yes | |
| `updatedAt` | Date | yes | |

## Status Enum

`active`, `released`, `confirmed`, `expired`, `cancelled`, `failed`

## Indexes

| Index | Type |
|-------|------|
| `{ lockToken: 1 }` | unique partial where `status: active` |
| `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId` | ascending |
| `customerId`, `cartId`, `orderId`, `status`, `expiresAt`, `createdAt` | ascending |
| `{ expiresAt: 1 }` | TTL (supplements explicit expire-due job; service still processes expiry) |

## Stock Fields Mutated

On create: `availableQuantity` ↓, `reservedQuantity` ↑. On release/expire: reverse. On confirm: `reservedQuantity` ↓ only. Always recalculate `totalQuantity`, `isLowStock`, `isOutOfStock`, `lastStockUpdatedAt`, `lastStockMovementId`.

## Movement Types

`reservation_created`, `reservation_released`, `reservation_confirmed`

## Default Expiry

| lockType | Minutes |
|----------|---------|
| cart | 10 |
| checkout | 15 |
| order, manual, system | 30 |
