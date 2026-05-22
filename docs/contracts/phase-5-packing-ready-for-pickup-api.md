# Phase 5 Packing & Ready-for-Pickup API

## Scope

Phase 5 Module 5 implements the store packing backend after picking has been
completed. This module owns starting packing, completing packing, and marking an
order ready for pickup.

This module does not implement inventory adjustment, cancellation, delivery
assignment, rider pickup, delivery OTP, live delivery, notifications, SLA jobs,
or vendor-panel UI.

## Dependencies

- Module 2 — Backend Order State Management
- Module 4 — Picking Workflow Backend

Packing starts only after picking completion. Inventory reconciliation belongs
to Module 6. Cancellation belongs to Module 7. Delivery handoff after
`ready_for_pickup` belongs to Phase 6+.

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/store/orders/{orderId}/packing/start` | Start packing after picking completion |
| POST | `/api/v1/store/orders/{orderId}/packing/complete` | Complete active packing |
| POST | `/api/v1/store/orders/{orderId}/ready-for-pickup` | Mark packed order ready for pickup |

## Permission And Ownership

- Store packing routes require authenticated store/vendor scope.
- Store packing routes require `orders:update`.
- The order must belong to the actor's assigned store.
- Cross-store packing and ready-for-pickup operations must be denied.

## Start Packing

**Endpoint:** `POST /api/v1/store/orders/{orderId}/packing/start`

### Preconditions

- `orderId` is valid.
- Order belongs to the actor store.
- `orderStatus` is `picking`.
- `pickerStatus` is `completed`.

### State Changes

- `orderStatus` becomes `packing`.
- `packingStatus` becomes `in_progress`.
- Timeline event `order.packing.started` is appended.

## Complete Packing

**Endpoint:** `POST /api/v1/store/orders/{orderId}/packing/complete`

### Preconditions

- Order belongs to the actor store.
- `orderStatus` is `packing`.
- `packingStatus` is `in_progress`.

### State Changes

- `packingStatus` becomes `completed`.
- Timeline event `order.packing.completed` is appended.

This endpoint does not mark the order ready for pickup.

## Ready For Pickup

**Endpoint:** `POST /api/v1/store/orders/{orderId}/ready-for-pickup`

### Preconditions

- Order belongs to the actor store.
- `orderStatus` is `packing`.
- `packingStatus` is `completed`.

### State Changes

- `orderStatus` becomes `ready_for_pickup`.
- `packingStatus` becomes `ready_for_pickup`.
- `readyForPickupAt` is set.
- Timeline event `order.ready_for_pickup` is appended.

## DB Fields

Module 5 uses these order fields:

- `packingStatus`
- `readyForPickupAt`
- `timeline[]`

## Error Codes

- `ORDER_PACKING_NOT_ALLOWED`
- `ORDER_ACCESS_FORBIDDEN`
- `ORDER_SCOPE_REQUIRED`

## Out Of Scope

- Inventory adjustment for missing/picked items
- Cancellation from packing states
- Store operation notifications
- SLA breach marking or escalation jobs
- Delivery assignment and shipped/delivered transitions
- Vendor-panel packing UI
