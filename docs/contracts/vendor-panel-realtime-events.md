# Vendor Panel Realtime Events

## Scope

Phase 7 Module 8 adds Vendor Panel consumption of existing realtime Socket.IO events. It adds no REST endpoints and does not write order or pickup state directly.

## Namespace

Vendor sockets connect to the `/vendor` namespace with the authenticated vendor access token.

## Room Join

| Event | Payload | Authorization |
|---|---|---|
| `vendor.join_order_room` | `{ "orderId": "..." }` | Backend verifies the order belongs to the connected vendor/store before joining the order room |

## Order Events

| Event | Purpose |
|---|---|
| `vendor.order_created` | New store order arrived |
| `vendor.order_status_updated` | Existing store order status changed |
| `vendor.order_cancelled` | Store order was cancelled |

Expected safe payload fields: `orderId`, `_id`, `storeId`, `orderStatus`, `storeStatus`, `totalAmount`, `grandTotal`, `itemCount`, `orderNumber`, `customerId`, `currency`, `createdAt`, `placedAt`, `acceptedAt`, `updatedAt`, optional `eventId`, and optional envelope `emittedAt`.

## Pickup Events

| Event | Purpose |
|---|---|
| `vendor.rider_arrived` | Rider arrived at the store for handover |
| `vendor.pickup_completed` | Rider pickup was completed |

Expected safe payload fields: `orderId`, `assignmentId`, `deliveryId`, `riderId`, `deliveryAgentId`, `pickupStatus`, `arrivedAt`, `pickupCompletedAt`, `updatedAt`, optional `eventId`, and optional envelope `emittedAt`.

## DB Fields Consumed

- `orders._id`
- `orders.storeId`
- `orders.orderStatus`
- `orders.totalAmount`
- `orders.updatedAt`
- `delivery_pickups.orderId`
- `delivery_pickups.pickupStatus`
- `delivery_pickups.arrivedAt`
- `delivery_pickups.pickupCompletedAt`

## Client Rules

- Ignore malformed payloads.
- Ignore order events with `updatedAt` older than the latest accepted realtime order event for the same order.
- Ignore pickup events with `updatedAt` older than the latest accepted realtime pickup event for the same order.
- Rejoin active order rooms after reconnect.
- Keep polling fallback available while the socket is disconnected.

## REST API Impact

None.

## DB Impact

None.

