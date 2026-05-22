# Phase 5 Vendor Panel Incoming Orders UI Contract

## Scope

Phase 5 Module 8 implements the Vendor Panel incoming orders experience for
store-scoped users.

This module covers incoming order list, incoming order detail, accept/reject
actions, permission visibility, and display-only SLA indicators.

This module does not implement picking, packing, ready-for-pickup actions,
store cancellation, order history filters, notifications, SLA jobs, admin order
operations, customer order visibility, or real-time updates.

## Dependencies

- Module 2 — Backend Order State Management
- Module 3 — Store Acceptance Flow

Module 8 consumes the store order read surface and the already implemented
store accept/reject actions.

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/store/orders` | List store-scoped incoming orders — implemented Ticket 8.2 |
| GET | `/api/v1/store/orders/{orderId}` | Fetch store-scoped incoming order detail — implemented Ticket 8.2 |
| POST | `/api/v1/store/orders/{orderId}/accept` | Accept an incoming order |
| POST | `/api/v1/store/orders/{orderId}/reject` | Reject an incoming order with a reason |

## Incoming Order List

The incoming orders page shows store orders currently eligible for store review
or acceptance.

Vendor Panel API helpers are implemented in
`apps/vendor-panel/src/modules/orders/api/vendor-orders.api.ts`.
The incoming orders list page is implemented at
`apps/vendor-panel/src/modules/orders/pages/VendorIncomingOrdersPage.tsx`.

Display fields:

- order number
- order status
- store status
- payment status
- grand total
- placed/created time
- accepted time when present
- SLA indicator when provided by backend, otherwise display-only placeholder

## Incoming Order Detail

The detail view shows:

- order summary
- payment status
- ordered items
- totals
- store-visible lifecycle state
- accept/reject actions when order is still `placed`

Store detail must not expose admin-only notes, cross-store data, or future
delivery lifecycle data.

The incoming order detail view is implemented at
`apps/vendor-panel/src/modules/orders/pages/VendorIncomingOrderDetailPage.tsx`.

## Accept / Reject Behavior

- Accept calls `POST /api/v1/store/orders/{orderId}/accept`.
- Reject calls `POST /api/v1/store/orders/{orderId}/reject` with a non-empty
  reason.
- Successful accept/reject refreshes list/detail data.
- Accept does not start picking. Picking belongs to Module 9.
- Vendor Panel accept/reject actions are implemented in
  `apps/vendor-panel/src/modules/orders/components/VendorIncomingOrderActions.tsx`.

## Permissions

- Vendor Panel route requires authenticated vendor/store session.
- Incoming orders require `orders:read`.
- Accept/reject actions require `orders:update`.
- All backend reads and mutations remain scoped to the authenticated actor's
  `storeId`.
Permission utilities are implemented in
`apps/vendor-panel/src/modules/orders/utils/vendor-orders-permissions.util.ts`.

## SLA Indicator

SLA display is read-only in Module 8. If backend SLA fields are absent, the
Vendor Panel should show a neutral placeholder state. SLA evaluation and jobs
belong to Module 14.

## DB Fields

No new DB fields are introduced by Module 8.

Existing fields used:

- `orderStatus`
- `storeStatus`
- `paymentStatus`
- `acceptedAt`
- `rejectedAt`
- `rejectionReason`
- `createdAt`
- `items[]`
- `timeline[]`

## Out Of Scope

- Picking and packing workflows
- Ready-for-pickup action
- Store cancellation
- Order history and advanced filters
- Notifications
- SLA evaluation jobs
- Admin and customer UI
