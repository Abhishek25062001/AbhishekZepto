# Customer Realtime Order Events

## Scope

Phase 7 Module 6 adds Customer App consumption of existing realtime Socket.IO events. It adds no REST endpoints and does not write order or delivery state.

## Namespace

Customer sockets connect to the `/customer` namespace with the authenticated customer access token.

## Room Join

| Event | Payload | Authorization |
|---|---|---|
| `customer.join_order_room` | `{ "orderId": "..." }` | Backend verifies the order belongs to the connected customer before joining `order:{orderId}` |

## Order Events

| Event | Purpose |
|---|---|
| `customer.order_status_updated` | Generic order status update |
| `customer.order_accepted` | Store accepted the order |
| `customer.order_packed` | Store packed the order |
| `customer.order_ready_for_pickup` | Order is ready for rider pickup |
| `customer.order_out_for_delivery` | Delivery is in progress |
| `customer.order_delivered` | Order delivered |
| `customer.order_cancelled` | Order cancelled |

Expected safe payload fields: `orderId`, `orderStatus`, `updatedAt`, optional `eventId`, and optional envelope `emittedAt`.

## Delivery Tracking Events

| Event | Purpose |
|---|---|
| `customer.delivery_location_updated` | Rider location changed |
| `customer.delivery_progress_updated` | Delivery progress status changed |
| `customer.rider_reached_customer` | Rider reached customer location |
| `customer.delivery_failed` | Delivery failed |

Expected safe payload fields: `orderId`, `assignmentId`, `deliveryAgentId`, `customerId`, `storeId`, `cityId`, `progressStatus`, `currentLatitude`, `currentLongitude`, `lastLocationUpdatedAt`, `estimatedDeliveryAt`, `updatedAt`, and optional `eventId`.

## Client Rules

- Ignore malformed payloads.
- Ignore order events with `updatedAt` older than the latest local realtime order event for that order.
- Ignore location events with invalid coordinates.
- Ignore location events with `lastLocationUpdatedAt` older than the latest accepted location event.
- Keep polling fallback active when the socket is disconnected.

## REST API Impact

None.
