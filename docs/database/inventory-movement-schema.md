# Inventory Movement Schema

## Collection

`inventory_movements`

Append-only audit trail of stock quantity changes. No soft delete.

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `storeId` | ObjectId | yes | |
| `vendorId` | ObjectId | yes | |
| `cityId` | ObjectId | yes | |
| `inventoryStockId` | ObjectId | yes | Ref `inventory_stocks` |
| `storeProductId` | ObjectId | yes | |
| `productId` | ObjectId | yes | |
| `variantId` | ObjectId | yes | |
| `movementType` | enum | yes | See movement types below |
| `quantity` | number | yes | Movement amount (context depends on type) |
| `previousAvailableQuantity` | number | yes | |
| `newAvailableQuantity` | number | yes | |
| `previousReservedQuantity` | number | yes | |
| `newReservedQuantity` | number | yes | |
| `previousTotalQuantity` | number | yes | |
| `newTotalQuantity` | number | yes | |
| `reason` | string | yes | |
| `referenceType` | enum | yes | `manual`, `order`, `cart`, `return`, `system`, `seed`, `import` |
| `referenceId` | string | no | |
| `notes` | string | no | |
| `metadata` | object | no | |
| `createdBy` | ObjectId | no | |
| `createdAt` | Date | yes | |

## Movement types

`stock_in`, `stock_out`, `manual_adjustment`, `reservation_created`, `reservation_released`, `reservation_confirmed`, `damaged`, `expired`, `correction`

Reservation types are documented for Inventory Locking; HTTP adjust APIs in this module do not execute reservation flows.

## Indexes

`storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `productId`, `variantId`, `movementType`, `referenceType`, `referenceId`, `createdAt`
