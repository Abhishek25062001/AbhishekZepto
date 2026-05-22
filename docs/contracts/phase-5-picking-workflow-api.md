# Phase 5 Picking Workflow API

## Scope

Phase 5 Module 4 implements the store picking backend after a store has
accepted an order. This module owns starting picking, marking order items as
picked or missing, and completing picking.

This module does not implement packing, ready-for-pickup, inventory adjustment,
cancellation, notifications, SLA jobs, or vendor-panel UI.

## Dependencies

- Module 2 — Backend Order State Management
- Module 3 — Store Acceptance Flow

Picking starts only after store acceptance. Packing and ready-for-pickup depend
on picking completion and belong to Module 5.

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/store/orders/{orderId}/picking/start` | Start picking an accepted order |
| POST | `/api/v1/store/orders/{orderId}/items/{itemId}/picked` | Mark an order item quantity as picked |
| POST | `/api/v1/store/orders/{orderId}/items/{itemId}/missing` | Mark an order item quantity as missing |
| POST | `/api/v1/store/orders/{orderId}/picking/complete` | Complete picking after all items are resolved |

## Permission And Ownership

- Store picking routes require authenticated store/vendor scope.
- Store picking routes require `orders:update`.
- The order must belong to the actor's assigned store.
- Cross-store picking operations must be denied.

## Start Picking

**Endpoint:** `POST /api/v1/store/orders/{orderId}/picking/start`

### Preconditions

- `orderId` is valid.
- Order belongs to the actor store.
- `orderStatus` is `accepted`.

### State Changes

- `orderStatus` becomes `picking`.
- `pickerStatus` becomes `in_progress`.
- `assignedPickerId` is set from the actor user id when available.
- Timeline event `order.picking.started` is appended.

## Mark Item Picked

**Endpoint:** `POST /api/v1/store/orders/{orderId}/items/{itemId}/picked`

### Body

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `quantity` | number | yes | Positive integer quantity picked |

### Preconditions

- Order belongs to the actor store.
- Order is in active picking.
- `itemId` references an item in the order. Ticket 4.4 runtime uses the
  order item's `storeProductId` as this identifier.
- Picked plus missing quantity must not exceed ordered quantity.

### State Changes

- `items[].pickedQuantity` is updated.
- `items[].pickingStatus` becomes `picked` or `partial`.
- Timeline event `order.item.picked` is appended.

Ticket 4.4 treats `quantity` as the current picked quantity for the item, not
as an additive increment.

## Mark Item Missing

**Endpoint:** `POST /api/v1/store/orders/{orderId}/items/{itemId}/missing`

### Body

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `quantity` | number | yes | Positive integer quantity missing |

### Preconditions

- Order belongs to the actor store.
- Order is in active picking.
- `itemId` references an item in the order. Ticket 4.5 runtime uses the
  order item's `storeProductId` as this identifier.
- Picked plus missing quantity must not exceed ordered quantity.

### State Changes

- `items[].missingQuantity` is updated.
- `items[].pickingStatus` becomes `missing` or `partial`.
- Timeline event `order.item.missing` is appended.

Ticket 4.5 treats `quantity` as the current missing quantity for the item, not
as an additive increment.

## Complete Picking

**Endpoint:** `POST /api/v1/store/orders/{orderId}/picking/complete`

### Preconditions

- Order belongs to the actor store.
- Order is in active picking.
- Every order item is resolved as `picked`, `missing`, or `partial`.

### State Changes

- `pickerStatus` becomes `completed`.
- Timeline event `order.picking.completed` is appended.

Module 5 owns the later transition from picking completion into packing.

## DB Fields

Module 4 uses these order fields:

- `pickerStatus`
- `assignedPickerId`
- `items[].pickedQuantity`
- `items[].missingQuantity`
- `items[].pickingStatus`
- `timeline[]`

## Error Codes

- `ORDER_PICKING_NOT_ALLOWED`
- `ORDER_ITEM_OPERATION_INVALID`
- `ORDER_ACCESS_FORBIDDEN`
- `ORDER_SCOPE_REQUIRED`

## Needs Verification

- Whether item operation body should support replacement quantities or additive
  quantities. Module 4 implementation should keep the chosen behavior explicit
  in service tests.
