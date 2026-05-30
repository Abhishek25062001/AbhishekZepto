# Delivery Agent Realtime Events

## Scope

Phase 7 Module 7 adds Delivery Agent App consumption of existing realtime Socket.IO events. It adds no REST endpoints and does not write delivery state directly.

## Namespace

Delivery agent sockets connect to the `/delivery` namespace with the authenticated delivery access token.

## Room Join

| Event | Payload | Authorization |
|---|---|---|
| `delivery.join_assignment_room` | `{ "assignmentId": "..." }` | Backend verifies the assignment belongs to the connected delivery agent before joining the assignment room |

## Assignment Events

| Event | Purpose |
|---|---|
| `delivery.assignment_created` | New assignment became available for the delivery agent |
| `delivery.assignment_cancelled` | Active assignment was cancelled |

Expected safe payload fields: `assignmentId`, `deliveryId`, `orderId`, `assignmentStatus`, `deliveryStatus`, `pickupEta`, `assignmentCode`, `cancelledReason`, `updatedAt`, optional `eventId`, and optional envelope `emittedAt`.

## Delivery Status Events

| Event | Purpose |
|---|---|
| `delivery.pickup_updated` | Pickup flow status changed |
| `delivery.delivery_status_updated` | Active delivery progress status changed |

Expected safe payload fields: `assignmentId`, `deliveryId`, `orderId`, `pickupStatus`, `progressStatus`, `deliveryStatus`, `status`, `pickedUpAt`, `arrivedAtStoreAt`, `lastLocationUpdatedAt`, `updatedAt`, optional `eventId`, and optional envelope `emittedAt`.

## Location Sync Events

| Event | Purpose |
|---|---|
| `delivery.location_sync_acknowledged` | Backend accepted the latest location sync |
| `delivery.location_sync_rejected` | Backend rejected location sync and the app must pause realtime sync until recovery |

Expected safe payload fields: `assignmentId`, `deliveryId`, `orderId`, `status`, `rejectionReason`, `lastLocationUpdatedAt`, `updatedAt`, optional `eventId`, and optional envelope `emittedAt`.

## Client Rules

- Ignore malformed payloads.
- Ignore assignment events with `updatedAt` older than the latest local realtime assignment event for that assignment.
- Ignore status events with `updatedAt` older than the latest local realtime status event for that assignment.
- Rejoin active assignment rooms after reconnect.
- Keep REST polling fallback available while the socket is disconnected.

## REST API Impact

None.

## DB Impact

None.

