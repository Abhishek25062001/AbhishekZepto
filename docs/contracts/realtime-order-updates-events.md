# Realtime Order Updates Events

## Scope

Phase 7 Module 4 broadcasts committed order lifecycle changes over Socket.IO. REST APIs remain responsible for order writes; this contract defines only realtime event names, payload shape, and room targets.

## Namespaces And Rooms

| Surface | Namespace | Room |
|---|---|---|
| Customer order owner | `/customer` | `customer:{customerId}` |
| Customer order tracking stream | `/customer` | `order:{orderId}` |
| Vendor store operations | `/vendor` | `vendor:{storeId}` |
| Admin city operations | `/admin` | `city:{cityId}` |

## Client Join Events

| Event | Namespace | Payload | Authorization |
|---|---|---|---|
| `customer.join_order_room` | `/customer` | `{ "orderId": "..." }` | Order must belong to the connected customer |
| `customer.track_order` | `/customer` | `{ "orderId": "..." }` | Same authorization as `customer.join_order_room` |
| `vendor.join_order_room` | `/vendor` | `{ "orderId": "..." }` | Order must belong to the connected store |
| `admin.join_city_room` | `/admin` | `{ "cityId": "..." }` | Only `super_admin` can join an arbitrary city room |

Invalid payloads or denied room access emit `connection.error` with `ROOM_JOIN_DENIED`.

## Payload

All realtime order update payloads use this safe shape:

| Field | Type | Description |
|---|---|---|
| `orderId` | string | Order identifier |
| `customerId` | string | Customer owner identifier |
| `storeId` | string | Store identifier |
| `vendorId` | string or null | Vendor identifier when available |
| `cityId` | string or null | City identifier when available |
| `orderStatus` | string | Current order lifecycle status |
| `paymentStatus` | string or null | Current payment status when available |
| `totalAmount` | number or null | Order total when available |
| `updatedAt` | string or null | ISO timestamp for the committed update |
| `eventSource` | `order`, `delivery`, or `system` | Backend source that produced the realtime update |

Payload mappers intentionally exclude internal Mongoose fields, auth tokens, OTP values, payment gateway secrets, raw metadata, and session data.

## Customer Events

| Event | Rooms |
|---|---|
| `customer.order_status_updated` | `customer:{customerId}`, `order:{orderId}` |
| `customer.order_accepted` | `customer:{customerId}`, `order:{orderId}` |
| `customer.order_packed` | `customer:{customerId}`, `order:{orderId}` |
| `customer.order_ready_for_pickup` | `customer:{customerId}`, `order:{orderId}` |
| `customer.order_out_for_delivery` | `customer:{customerId}`, `order:{orderId}` |
| `customer.order_delivered` | `customer:{customerId}`, `order:{orderId}` |
| `customer.order_cancelled` | `customer:{customerId}`, `order:{orderId}` |

## Vendor Events

| Event | Rooms |
|---|---|
| `vendor.order_created` | `vendor:{storeId}` |
| `vendor.order_status_updated` | `vendor:{storeId}` |
| `vendor.order_cancelled` | `vendor:{storeId}` |

## Admin Events

| Event | Rooms |
|---|---|
| `admin.order_created` | `city:{cityId}` |
| `admin.order_status_updated` | `city:{cityId}` |
| `admin.order_delayed` | `city:{cityId}` |
| `admin.order_cancelled` | `city:{cityId}` |

## REST API Impact

This module adds no REST API endpoints.

## Database Fields Consumed

This module consumes existing order fields only: `orderId`, `_id`, `customerId`, `storeId`, `vendorId`, `cityId`, `orderStatus`, `paymentStatus`, `totalAmount`, `grandTotal`, and `updatedAt`. It adds no database fields or collections.
