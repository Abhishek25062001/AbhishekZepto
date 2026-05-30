# Realtime Events Registry

## Transport

Phase 7 uses Socket.IO namespaces over WebSocket with polling fallback. REST APIs remain responsible for writes; realtime events broadcast committed backend state.

## Namespaces

| Namespace | Surface | Authentication |
|---|---|---|
| `/` | Shared authenticated socket root | JWT access token in socket handshake |
| `/customer` | Customer app | JWT access token in socket handshake |
| `/delivery` | Delivery agent app | JWT access token in socket handshake |
| `/vendor` | Vendor panel | JWT access token in socket handshake |
| `/admin` | Admin dashboard | JWT access token in socket handshake |

## Rooms

| Room | Namespace | Purpose |
|---|---|---|
| `customer:{customerId}` | `/customer` | Customer-scoped updates |
| `delivery:{deliveryAgentId}` | `/delivery` | Rider-scoped assignment updates |
| `vendor:{storeId}` | `/vendor` | Store pickup updates |
| `order:{orderId}` | `/customer` | Order tracking stream |
| `assignment:{assignmentId}` | `/delivery` | Active delivery assignment stream |
| `city:{cityId}` | `/admin` | City operations stream |
| `admin:{adminId}` | `/admin` | Admin-scoped updates |
| `admin:operations` | `/admin` | General operations stream |

## Client Join Events

| Event | Namespace | Payload | Result |
|---|---|---|---|
| `customer.join_order_room` | `/customer` | `{ "orderId": "..." }` | Joins `order:{orderId}` |
| `customer.track_order` | `/customer` | `{ "orderId": "..." }` | Joins `order:{orderId}` |
| `delivery.join_assignment_room` | `/delivery` | `{ "assignmentId": "..." }` | Joins `assignment:{assignmentId}` |
| `vendor.join_order_room` | `/vendor` | `{ "orderId": "..." }` | Joins `order:{orderId}` |
| `admin.join_city_room` | `/admin` | `{ "cityId": "..." }` | Super admin joins `city:{cityId}` |
| `admin.join_delivery_city_room` | `/admin` | `{ "cityId": "..." }` | Admin joins authorized `city:{cityId}` for delivery tracking |

## Customer Events

| Event | Namespace | Room | Payload source |
|---|---|---|---|
| `customer.order_status_updated` | `/customer` | `customer:{customerId}`, `order:{orderId}` | Realtime order update payload |
| `customer.order_accepted` | `/customer` | `customer:{customerId}`, `order:{orderId}` | Realtime order update payload |
| `customer.order_packed` | `/customer` | `customer:{customerId}`, `order:{orderId}` | Realtime order update payload |
| `customer.order_ready_for_pickup` | `/customer` | `customer:{customerId}`, `order:{orderId}` | Realtime order update payload |
| `customer.order_out_for_delivery` | `/customer` | `customer:{customerId}`, `order:{orderId}` | Realtime order update payload |
| `customer.order_cancelled` | `/customer` | `customer:{customerId}`, `order:{orderId}` | Realtime order update payload |
| `customer.delivery_progress_updated` | `/customer` | `order:{orderId}` | Delivery assignment progress payload |
| `customer.delivery_location_updated` | `/customer` | `order:{orderId}` | Delivery assignment progress payload |
| `customer.rider_reached_customer` | `/customer` | `order:{orderId}` | Delivery tracking realtime payload |
| `customer.order_delivered` | `/customer` | `order:{orderId}` | Delivery completion payload |
| `customer.delivery_failed` | `/customer` | `order:{orderId}` | Delivery tracking realtime payload |

## Delivery Agent Events

| Event | Namespace | Room | Payload source |
|---|---|---|---|
| `delivery.assignment_created` | `/delivery` | `delivery:{deliveryAgentId}` | Delivery assignment payload |
| `delivery.assignment_cancelled` | `/delivery` | `delivery:{deliveryAgentId}` | Reserved event in registry |
| `delivery.pickup_updated` | `/delivery` | `assignment:{assignmentId}` | Reserved event in registry |
| `delivery.delivery_status_updated` | `/delivery` | `assignment:{assignmentId}` | Reserved event in registry |
| `delivery.location_sync_acknowledged` | `/delivery` | `delivery:{deliveryAgentId}` | Delivery tracking realtime payload |
| `delivery.location_sync_rejected` | `/delivery` | `delivery:{deliveryAgentId}` | Delivery tracking realtime payload |

## Vendor Events

| Event | Namespace | Room | Payload source |
|---|---|---|---|
| `vendor.order_created` | `/vendor` | `vendor:{storeId}` | Realtime order update payload |
| `vendor.order_status_updated` | `/vendor` | `vendor:{storeId}` | Realtime order update payload |
| `vendor.order_cancelled` | `/vendor` | `vendor:{storeId}` | Realtime order update payload |
| `vendor.rider_arrived` | `/vendor` | `vendor:{storeId}` | Reserved event in registry |
| `vendor.pickup_completed` | `/vendor` | `vendor:{storeId}` | Pickup completion payload |

## Admin Events

| Event | Namespace | Room | Payload source |
|---|---|---|---|
| `admin.order_created` | `/admin` | `city:{cityId}` | Realtime order update payload |
| `admin.order_status_updated` | `/admin` | `city:{cityId}` | Realtime order update payload |
| `admin.order_delayed` | `/admin` | `city:{cityId}` | Realtime order update payload |
| `admin.order_cancelled` | `/admin` | `city:{cityId}` | Realtime order update payload |
| `admin.delivery_location_updated` | `/admin` | `city:{cityId}` | Delivery tracking realtime payload |
| `admin.delivery_progress_updated` | `/admin` | `city:{cityId}` | Delivery tracking realtime payload |
| `admin.delivery_failed` | `/admin` | `city:{cityId}` | Delivery tracking realtime payload |
| `admin.delivery_assignment_created` | `/admin` | `city:{cityId}`, `admin:operations` | Delivery assignment payload |
| `admin.delivery_sla_breach_created` | `/admin` | `city:{cityId}`, `admin:operations` | SLA breach payload |
| `admin.delivery_status_changed` | `/admin` | `admin:operations` | Reserved event in registry |

## Generic Connection Events

| Event | Purpose |
|---|---|
| `connection.authenticated` | Successful socket authentication and default room join |
| `connection.error` | Socket authentication or room payload validation failure |
| `connection.disconnected` | Reserved connection lifecycle event |
| `room.joined` | Successful socket room join acknowledgement |
| `room.left` | Reserved room leave acknowledgement |
| `room.join_denied` | Reserved room access denial event |

## Payload Rules

Realtime payloads must not expose internal Mongoose fields, raw OTP values, OTP hashes, or internal metadata. Payloads use string IDs and ISO timestamp strings.

## Delivery Tracking Sample Payloads

### `customer.delivery_location_updated`

```json
{
  "orderId": "order-1",
  "assignmentId": "assignment-1",
  "deliveryAgentId": "agent-1",
  "customerId": "customer-1",
  "storeId": "store-1",
  "cityId": "city-1",
  "progressStatus": "en_route_to_customer",
  "currentLatitude": 28.6139,
  "currentLongitude": 77.209,
  "lastLocationUpdatedAt": "2026-05-29T01:10:00.000Z",
  "estimatedDeliveryAt": "2026-05-29T01:20:00.000Z",
  "updatedAt": "2026-05-29T01:10:00.000Z"
}
```

### `customer.delivery_progress_updated`

```json
{
  "orderId": "order-1",
  "assignmentId": "assignment-1",
  "deliveryAgentId": "agent-1",
  "customerId": "customer-1",
  "storeId": "store-1",
  "cityId": "city-1",
  "progressStatus": "arrived_at_customer",
  "currentLatitude": null,
  "currentLongitude": null,
  "lastLocationUpdatedAt": "2026-05-29T01:15:00.000Z",
  "estimatedDeliveryAt": null,
  "updatedAt": "2026-05-29T01:15:00.000Z"
}
```

### `admin.delivery_location_updated`

```json
{
  "orderId": "order-1",
  "assignmentId": "assignment-1",
  "deliveryAgentId": "agent-1",
  "customerId": "customer-1",
  "storeId": "store-1",
  "cityId": "city-1",
  "progressStatus": "en_route_to_customer",
  "currentLatitude": 28.6139,
  "currentLongitude": 77.209,
  "lastLocationUpdatedAt": "2026-05-29T01:10:00.000Z",
  "estimatedDeliveryAt": "2026-05-29T01:20:00.000Z",
  "updatedAt": "2026-05-29T01:10:00.000Z"
}
```
