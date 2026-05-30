# Internal Events Registry

## Scope

Phase 7 Module 3 defines backend-only internal events. These events are not public REST APIs and are not stored in a new database collection by this module.

## Metadata

| Field | Description |
|---|---|
| `eventId` | Generated event identifier |
| `eventName` | Internal event name |
| `sourceModule` | Module that published the event |
| `actorId` | Optional actor user id |
| `actorRole` | Optional actor role |
| `requestId` | Optional request id |
| `traceId` | Optional trace id |
| `createdAt` | ISO timestamp when metadata was built |

## Order Events

| Event | Payload fields |
|---|---|
| `order.created` | `orderId`, `orderNumber`, `customerId`, `storeId`, `cityId`, `orderStatus`, `paymentStatus`, `updatedAt` |
| `order.accepted` | `orderId`, `orderNumber`, `customerId`, `storeId`, `cityId`, `orderStatus`, `paymentStatus`, `updatedAt` |
| `order.packed` | `orderId`, `orderNumber`, `customerId`, `storeId`, `cityId`, `orderStatus`, `paymentStatus`, `updatedAt` |
| `order.ready_for_pickup` | `orderId`, `orderNumber`, `customerId`, `storeId`, `cityId`, `orderStatus`, `paymentStatus`, `updatedAt` |
| `order.out_for_delivery` | `orderId`, `orderNumber`, `customerId`, `storeId`, `cityId`, `orderStatus`, `paymentStatus`, `updatedAt` |
| `order.cancelled` | `orderId`, `orderNumber`, `customerId`, `storeId`, `cityId`, `orderStatus`, `paymentStatus`, `updatedAt` |
| `order.delivered` | `orderId`, `orderNumber`, `customerId`, `storeId`, `cityId`, `orderStatus`, `paymentStatus`, `updatedAt` |

## Order Publishers

| Publisher | Event |
|---|---|
| `publishOrderCreated` | `order.created` |
| `publishOrderAccepted` | `order.accepted` |
| `publishOrderPacked` | `order.packed` |
| `publishOrderReadyForPickup` | `order.ready_for_pickup` |
| `publishOrderOutForDelivery` | `order.out_for_delivery` |
| `publishOrderCancelled` | `order.cancelled` |
| `publishOrderDelivered` | `order.delivered` |

## Delivery Events

| Event | Payload fields |
|---|---|
| `delivery.assignment_created` | `orderId`, `assignmentId`, `customerId`, `deliveryAgentId`, `storeId`, `cityId`, `assignmentStatus` |
| `delivery.assignment_accepted` | `orderId`, `assignmentId`, `customerId`, `deliveryAgentId`, `storeId`, `cityId`, `assignmentStatus` |
| `delivery.pickup_completed` | `orderId`, `assignmentId`, `customerId`, `deliveryAgentId`, `storeId`, `pickupStatus` |
| `delivery.out_for_delivery` | `orderId`, `assignmentId`, `customerId`, `deliveryAgentId`, `storeId`, `cityId`, `progressStatus`, `currentLatitude`, `currentLongitude`, `lastLocationUpdatedAt`, `estimatedDeliveryAt`, `updatedAt` |
| `delivery.location_updated` | `orderId`, `assignmentId`, `customerId`, `deliveryAgentId`, `storeId`, `cityId`, `progressStatus`, `currentLatitude`, `currentLongitude`, `lastLocationUpdatedAt`, `estimatedDeliveryAt`, `updatedAt` |
| `delivery.reached_customer` | `orderId`, `assignmentId`, `customerId`, `deliveryAgentId`, `storeId`, `cityId`, `progressStatus`, `currentLatitude`, `currentLongitude`, `lastLocationUpdatedAt`, `estimatedDeliveryAt`, `updatedAt` |
| `delivery.completed` | `orderId`, `assignmentId`, `customerId`, `deliveryAgentId`, `storeId`, `cityId`, `completionStatus`, `progressStatus`, `currentLatitude`, `currentLongitude`, `lastLocationUpdatedAt`, `estimatedDeliveryAt`, `completedAt`, `updatedAt` |
| `delivery.failed` | `orderId`, `assignmentId`, `customerId`, `deliveryAgentId`, `storeId`, `cityId`, `progressStatus`, `currentLatitude`, `currentLongitude`, `lastLocationUpdatedAt`, `estimatedDeliveryAt`, `updatedAt` |

## Delivery Tracking Publishers

| Publisher | Event |
|---|---|
| `publishOutForDelivery` | `delivery.out_for_delivery` |
| `publishDeliveryLocationUpdated` | `delivery.location_updated` |
| `publishDeliveryReachedCustomer` | `delivery.reached_customer` |
| `publishDeliveryCompleted` | `delivery.completed` |
| `publishDeliveryFailed` | `delivery.failed` |

## SLA Events

| Event | Payload fields |
|---|---|
| `delivery.sla_breach_created` | `breachId`, `orderId`, `assignmentId`, `customerId`, `deliveryAgentId`, `storeId`, `cityId`, `slaType`, `breachStatus`, `escalationLevel` |

## Excluded Fields

Internal event payloads must not expose `__v`, raw OTP values, auth tokens, refresh tokens, or internal secrets.
