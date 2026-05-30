# Admin Real-Time Control Tower Events and Fallback API

## Socket Namespace

- Namespace: `/admin`
- Client env: `VITE_ADMIN_SOCKET_BASE_URL`
- Auth: socket `auth.token` uses the admin access token.

## Socket Events

Order events:

- `admin.order_created`
- `admin.order_status_updated`
- `admin.order_delayed`
- `admin.order_cancelled`

Delivery events:

- `admin.delivery_assignment_created`
- `admin.delivery_status_changed`
- `admin.delivery_location_updated`
- `admin.delivery_progress_updated`
- `admin.delivery_failed`

SLA event:

- `admin.delivery_sla_breach_created`

## Room Events

- Join city room: `admin.join_delivery_city_room` with `{ "cityId": "..." }`
- Leave city room: `admin.leave_delivery_city_room` with `{ "cityId": "..." }`

## Fallback Endpoints

### GET /api/v1/admin/control-tower/snapshot

Query:

- `cityId` optional string

Response data:

- `activeOrdersCount`
- `assignedRidersCount`
- `outForDeliveryCount`
- `delayedOrdersCount`
- `openSlaBreachesCount`
- `activeOrders`
- `activeDeliveries`
- `openSlaBreaches`

### GET /api/v1/admin/control-tower/delivery-locations

Query:

- `cityId` optional string

Response data:

- Array of active delivery location records.

## DB Fields Consumed

`orders`:

- `_id`
- `orderNumber`
- `customerId`
- `storeId`
- `cityId`
- `orderStatus`
- `storeStatus`
- `pickerStatus`
- `packingStatus`
- `paymentStatus`
- `grandTotal`
- `currency`
- `placedAt`
- `createdAt`
- `acceptedAt`
- `slaStatus`
- `slaBreachedStage`
- `items`

`delivery_assignments`:

- `_id`
- `orderId`
- `cityId`
- `deliveryAgentId`
- `deliveryStatus`
- `assignedAt`
- `pickedUpAt`
- `completedAt`
- `cancelledAt`
- `createdAt`
- `updatedAt`
- `slaStatus`
- `slaBreachedStage`
- `slaBreachedAt`

`delivery_progress`:

- `assignmentId`
- `orderId`
- `cityId`
- `deliveryAgentId`
- `deliveryStatus`
- `currentLatitude`
- `currentLongitude`
- `heading`
- `speed`
- `lastLocationUpdatedAt`
- `updatedAt`

`delivery_sla_breaches`:

- `breachId`
- `orderId`
- `assignmentId`
- `deliveryId`
- `cityId`
- `breachType`
- `escalationLevel`
- `breachedAt`

Current backend implementation derives open delivery SLA breaches from
`delivery_assignments.slaStatus` until a dedicated `delivery_sla_breaches` model is
introduced by a later ticket.

