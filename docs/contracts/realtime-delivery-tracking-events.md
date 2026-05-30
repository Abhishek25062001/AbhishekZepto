# Realtime Delivery Tracking Events

## Scope

Phase 7 Module 5 broadcasts committed delivery tracking updates over Socket.IO. REST APIs remain responsible for delivery state changes and location writes; this contract defines only realtime event names, payload shape, rooms, and safety rules.

## Namespaces And Rooms

| Surface | Namespace | Room |
|---|---|---|
| Customer order tracking | `/customer` | `order:{orderId}` |
| Delivery agent sync acknowledgement | `/delivery` | `delivery:{deliveryAgentId}` |
| Admin city operations | `/admin` | `city:{cityId}` |

## Client Join Events

| Event | Namespace | Payload | Authorization |
|---|---|---|---|
| `customer.join_order_room` | `/customer` | `{ "orderId": "..." }` | Order must belong to the connected customer |
| `customer.track_order` | `/customer` | `{ "orderId": "..." }` | Same authorization as `customer.join_order_room` |
| `admin.join_delivery_city_room` | `/admin` | `{ "cityId": "..." }` | `super_admin` can join any city; scoped admins can join only their assigned city |

Denied joins emit `connection.error` with `ROOM_JOIN_DENIED`.

## Payload

| Field | Type | Description |
|---|---|---|
| `orderId` | string | Order identifier |
| `assignmentId` | string | Delivery assignment identifier |
| `deliveryAgentId` | string | Assigned delivery agent identifier |
| `customerId` | string | Customer identifier |
| `storeId` | string | Store identifier |
| `cityId` | string | City identifier |
| `progressStatus` | string | Current delivery progress status |
| `currentLatitude` | number or null | Current latitude when available |
| `currentLongitude` | number or null | Current longitude when available |
| `lastLocationUpdatedAt` | string or null | ISO timestamp for the latest location update |
| `estimatedDeliveryAt` | string or null | Estimated delivery timestamp when available |
| `updatedAt` | string or null | ISO timestamp for the committed delivery update |

Blocked/internal fields must not appear in realtime payloads: `__v`, raw OTP values, OTP hashes, proof image private metadata, auth fields, session fields, and verification values.

## Customer Events

| Event | Room |
|---|---|
| `customer.delivery_location_updated` | `order:{orderId}` |
| `customer.delivery_progress_updated` | `order:{orderId}` |
| `customer.rider_reached_customer` | `order:{orderId}` |
| `customer.order_delivered` | `order:{orderId}` |
| `customer.delivery_failed` | `order:{orderId}` |

## Admin Events

| Event | Room |
|---|---|
| `admin.delivery_location_updated` | `city:{cityId}` |
| `admin.delivery_progress_updated` | `city:{cityId}` |
| `admin.delivery_failed` | `city:{cityId}` |

## Delivery Agent Events

| Event | Room |
|---|---|
| `delivery.location_sync_acknowledged` | `delivery:{deliveryAgentId}` |
| `delivery.location_sync_rejected` | `delivery:{deliveryAgentId}` |

## Location Frequency Rule

`DELIVERY_LOCATION_EMIT_MIN_INTERVAL_SECONDS=10` is the placeholder interval for suppressing duplicate realtime location emissions when coordinates are unchanged and the prior location update is too recent. It controls realtime event emission only, not database write frequency.

## REST API Impact

This module adds no public REST API endpoints.

## Database Fields Consumed

This module consumes existing delivery tracking fields only: `delivery_progress.orderId`, `delivery_progress.assignmentId`, `delivery_progress.deliveryAgentId`, `delivery_progress.customerId`, `delivery_progress.storeId`, `delivery_progress.cityId`, `delivery_progress.progressStatus`, `delivery_progress.currentLatitude`, `delivery_progress.currentLongitude`, `delivery_progress.lastLocationUpdatedAt`, `delivery_progress.estimatedDeliveryAt`, and `delivery_progress.updatedAt`.
