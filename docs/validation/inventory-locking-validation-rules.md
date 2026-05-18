# Inventory Locking Validation Rules

## Create lock (internal)

| Field | Rule |
|-------|------|
| `inventoryStockId` | Required ObjectId |
| `storeProductId` | Required ObjectId; must match stock record |
| `quantity` | Integer > 0 |
| `lockType` | One of `cart`, `checkout`, `order`, `manual`, `system` |
| `customerId` | Optional ObjectId |
| `cartId` | Optional ObjectId |
| `orderId` | Optional ObjectId |
| `expiresAt` | Optional ISO date; must be future if provided |
| `metadata` | Optional object |

## Release lock (internal)

| Field | Rule |
|-------|------|
| `lockToken` | Required path param |
| `releaseReason` | Required non-empty string |
| `metadata` | Optional object |

## Confirm lock (internal)

| Field | Rule |
|-------|------|
| `lockToken` | Required path param |
| `confirmationReason` | Required non-empty string |
| `orderId` | Optional ObjectId |
| `metadata` | Optional object |

## Admin list locks

Pagination + optional filters: `storeId`, `vendorId`, `cityId`, `inventoryStockId`, `storeProductId`, `customerId`, `cartId`, `orderId`, `lockType`, `status`, `expiresBefore`, `expiresAfter`. Default sort `createdAt desc`.

## Admin expire-due

No body. Triggers batch expiry of active locks where `expiresAt < now`.
