# Inventory Foundation API

Status: **IMPLEMENTED**

Store-level stock quantities and movement audit trail per store product mapping.

## Admin endpoints

Base path: `/api/v1/admin/inventory`

| Method | Path | Permission |
|--------|------|------------|
| POST | `/stocks` | `inventory:create` |
| GET | `/stocks` | `inventory:read` |
| GET | `/stocks/:inventoryStockId` | `inventory:read` |
| PATCH | `/stocks/:inventoryStockId` | `inventory:update` |
| DELETE | `/stocks/:inventoryStockId` | `inventory:delete` |
| POST | `/stocks/:inventoryStockId/adjust` | `inventory:adjust` |
| POST | `/stocks/bulk-upload` | `inventory:bulk_update` |
| PATCH | `/stocks/bulk-thresholds` | `inventory:bulk_update` |
| GET | `/movements` | `inventory:read` |
| GET | `/movements/:movementId` | `inventory:read` |

## Vendor endpoints

Base path: `/api/v1/vendor/inventory`

| Method | Path | Permission |
|--------|------|------------|
| GET | `/stocks` | `inventory:read` |
| GET | `/stocks/:inventoryStockId` | `inventory:read` |
| POST | `/stocks/:inventoryStockId/adjust` | `inventory:update` |
| GET | `/movements` | `inventory:read` |

Vendor routes enforce `vendorId` / `storeId` scope from auth context.

## Collections

- `inventory_stocks` — quantity buckets and thresholds
- `inventory_movements` — append-only adjustment history

See `docs/database/inventory-stock-schema.md` and `docs/database/inventory-movement-schema.md`.
