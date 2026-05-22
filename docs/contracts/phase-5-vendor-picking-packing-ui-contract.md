# Phase 5 Vendor Panel Picking & Packing UI Contract

## Scope

Phase 5 Module 9 implements the Vendor Panel picking and packing experience for
store-scoped users after a store has accepted an order.

This module covers active orders, start picking, item picked or missing updates,
complete picking, start packing, complete packing, and ready-for-pickup actions.

This module does not implement backend picking or packing endpoints, store
cancellation, order history filters, notifications, SLA jobs, delivery handoff,
admin UI, customer UI, or real-time updates.

## Dependencies

- Module 4 — Picking Workflow Backend
- Module 5 — Packing & Ready-for-Pickup Flow
- Module 8 — Vendor Panel - Incoming Orders

Module 9 consumes the existing store order read, picking, packing, and
ready-for-pickup backend endpoints.

## API Endpoints Consumed

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/store/orders` | List store-scoped active orders |
| GET | `/api/v1/store/orders/{orderId}` | Fetch store-scoped active order detail |
| POST | `/api/v1/store/orders/{orderId}/picking/start` | Start picking an accepted order |
| POST | `/api/v1/store/orders/{orderId}/items/{itemId}/picked` | Mark an item quantity as picked |
| POST | `/api/v1/store/orders/{orderId}/items/{itemId}/missing` | Mark an item quantity as missing |
| POST | `/api/v1/store/orders/{orderId}/picking/complete` | Complete picking after all items are resolved |
| POST | `/api/v1/store/orders/{orderId}/packing/start` | Start packing after picking completion |
| POST | `/api/v1/store/orders/{orderId}/packing/complete` | Complete active packing |
| POST | `/api/v1/store/orders/{orderId}/ready-for-pickup` | Mark packed order ready for pickup |

## Active Orders List

The active orders page shows accepted orders that are in picking, packing, or
ready-for-pickup store-operation states.

Display fields:

- order number
- order status
- picker status
- packing status
- item count
- grand total
- accepted or placed time
- SLA indicator when provided by backend, otherwise display-only placeholder

## Active Order Detail

The active order detail view shows:

- order summary
- store-visible lifecycle state
- picker and packing status
- item picking table with ordered, picked, missing, and remaining quantities
- lifecycle actions allowed by the current backend state

Store detail must not expose admin-only notes, cross-store data, future delivery
lifecycle data, or cancellation/history features from later modules.

## Picking Behavior

- Start picking calls `POST /api/v1/store/orders/{orderId}/picking/start`.
- Mark picked calls `POST /api/v1/store/orders/{orderId}/items/{itemId}/picked`
  with `quantity`.
- Mark missing calls
  `POST /api/v1/store/orders/{orderId}/items/{itemId}/missing` with `quantity`.
- Complete picking calls `POST /api/v1/store/orders/{orderId}/picking/complete`.
- Item operation `itemId` is the order item's `storeProductId`, matching the
  Module 4 backend contract.
- Quantity forms must require positive integer quantities.
- Complete picking is visible only when every item has a resolved picking status.

## Packing And Ready-For-Pickup Behavior

- Start packing calls `POST /api/v1/store/orders/{orderId}/packing/start`.
- Complete packing calls `POST /api/v1/store/orders/{orderId}/packing/complete`.
- Ready for pickup calls
  `POST /api/v1/store/orders/{orderId}/ready-for-pickup`.
- Packing actions must follow the backend lifecycle order:
  picking completed, packing in progress, packing completed, ready for pickup.

## Permissions

- Vendor Panel active order routes require authenticated vendor/store session.
- Active order list and detail require `orders:read`.
- Picking, packing, and ready-for-pickup actions require `orders:update`.
- All backend reads and mutations remain scoped to the authenticated actor's
  `storeId`.
- Permission and workflow helpers are implemented in the Vendor Panel orders
  utilities so visibility remains consistent across list and detail actions.

## Validation

- Picked and missing quantities are positive integers.
- Picked plus missing quantities must not exceed ordered quantity. Backend
  remains the source of truth; frontend form limits provide operator guidance.
- Actions are hidden or disabled when the current order state does not allow
  the transition.
- Backend validation and conflict errors must be shown near the relevant action.

## Audit Logging

Module 9 does not add backend audit events. It surfaces actions that trigger the
existing Module 4 and Module 5 timeline events:

- `order.picking.started`
- `order.item.picked`
- `order.item.missing`
- `order.picking.completed`
- `order.packing.started`
- `order.packing.completed`
- `order.ready_for_pickup`

## DB Fields

No new DB fields are introduced by Module 9.

Existing fields used:

- `orderStatus`
- `storeStatus`
- `pickerStatus`
- `packingStatus`
- `assignedPickerId`
- `readyForPickupAt`
- `acceptedAt`
- `placedAt`
- `createdAt`
- `items[].quantity`
- `items[].pickedQuantity`
- `items[].missingQuantity`
- `items[].pickingStatus`
- `timeline[]`

## Out Of Scope

- Backend route implementation for picking and packing
- Inventory adjustment behavior
- Store cancellation UI
- Order history and advanced filters
- Notifications
- SLA evaluation jobs
- Delivery assignment and rider handoff
- Admin and customer UI
