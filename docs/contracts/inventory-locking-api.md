# Inventory Locking API

Status: **IMPLEMENTED**

## Internal (`/api/v1/internal/inventory/locks`)

Authentication: `authenticate()` (service JWT).

| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create lock; reserves stock |
| POST | `/:lockToken/release` | Release lock; restores available |
| POST | `/:lockToken/confirm` | Confirm lock; consumes reserved |

### Create body

`inventoryStockId`, `storeProductId`, `quantity`, `lockType`, optional `customerId`, `cartId`, `orderId`, `expiresAt`, `metadata`.

### Release body

`releaseReason` (required), optional `metadata`.

### Confirm body

`confirmationReason` (required), optional `orderId`, `metadata`.

## Admin (`/api/v1/admin/inventory/locks`)

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/` | `inventory:read` | List locks (paginated, filterable) |
| GET | `/:lockId` | `inventory:read` | Lock detail |
| POST | `/expire-due` | `inventory:adjust` | Batch-expire active locks past `expiresAt` |

## Stock side effects

- **Create:** `availableQuantity` decreases, `reservedQuantity` increases; movement `reservation_created`.
- **Release / expire:** reverse reservation; movement `reservation_released`.
- **Confirm:** `reservedQuantity` decreases only; movement `reservation_confirmed`.

## Pending consumers

Cart and checkout modules will call internal create/release/confirm endpoints (future phase).
