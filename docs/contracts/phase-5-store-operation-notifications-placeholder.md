# Phase 5 Store Operation Notifications Placeholder

## Scope

Phase 5 Module 13 adds an internal placeholder layer for store-operation
notification records. It captures order lifecycle events that should notify
customer, vendor/store, and admin surfaces later, without sending real push,
SMS, email, socket, or provider messages.

This module is placeholder-only. It records internal notification intent after
successful store-operation state changes.

## Dependencies

- Module 2 - Backend Order State Management
- Module 3 - Store Acceptance Flow
- Module 4 - Picking Workflow Backend
- Module 5 - Packing & Ready-for-Pickup Flow
- Module 7 - Order Cancellation Backend

## Out Of Scope

- Firebase Cloud Messaging, APNS, SMS, email, or provider integration
- Real queues or workers
- Realtime sockets
- Delivery assignment notifications
- SLA escalation notifications
- Customer, vendor, or admin notification UI
- Notification preferences

## Placeholder Event Sources

Module 13 may create placeholder records after successful existing events:

- `order.store.accepted`
- `order.store.rejected`
- `order.picking.started`
- `order.item.missing`
- `order.picking.completed`
- `order.packing.started`
- `order.packing.completed`
- `order.ready_for_pickup`
- `order.cancelled`

## Placeholder Recipients

| Recipient type | Purpose |
|---|---|
| `customer` | Customer-visible order progress |
| `vendor` | Store/vendor operational awareness |
| `admin` | Admin operational monitoring placeholder |

## Placeholder Payload

Internal placeholder payloads use:

- `orderId`
- `event`
- `recipient.recipientType`
- `recipient.recipientId`
- `title`
- `body`
- `status`
- `storeId`
- `customerId`
- `metadata`

No provider token, phone number, email address, socket id, or external queue id
is stored by Module 13.

## API Endpoints

Module 13 adds no public HTTP endpoints.

## DB Fields

Placeholder records are stored in `order_notification_placeholders` with:

- `orderId`
- `event`
- `recipientType`
- `recipientId`
- `storeId`
- `customerId`
- `title`
- `body`
- `status`
- `metadata`
- `createdAt`
- `processedAt`

Indexes:

- `orderId + createdAt`
- `recipientType + createdAt`
- `status + createdAt`
- `createdAt`

## Permissions

No new permission codes are added. Placeholder creation runs internally after
already-authorized order operations complete.

## Ticket 13.2 Implementation

Backend constants define placeholder notification events, recipient types, and
placeholder statuses in:

- `backend/api/src/modules/orders/constants/order-notification-events.constant.ts`
- `backend/api/src/modules/orders/types/order-notification.types.ts`

## Ticket 13.3 Implementation

Placeholder record persistence is implemented in:

- `backend/api/src/modules/orders/models/order-notification-placeholder.model.ts`

## Ticket 13.4 Implementation

Placeholder record creation and publishing are implemented in:

- `backend/api/src/modules/orders/repositories/order-notification-placeholder.repository.ts`
- `backend/api/src/modules/orders/services/order-notification-placeholder.service.ts`

The publisher creates customer, vendor, and admin placeholder records for each
supported event and performs no external delivery.

## Ticket 13.5 Implementation

Placeholder publishing is wired into successful existing order-operation
transitions in:

- `backend/api/src/modules/orders/services/order.service.ts`

Publishing is attempted only after the existing order transition and audit log
complete. Placeholder publishing failures do not block the completed order
operation.

Implemented event wiring:

- Customer, store, and admin cancellations publish `order.cancelled`.
- Store acceptance publishes `order.store.accepted`.
- Store rejection publishes `order.store.rejected`.
- Picking start publishes `order.picking.started`.
- Missing item marking publishes `order.item.missing`.
- Picking completion publishes `order.picking.completed`.
- Packing start publishes `order.packing.started`.
- Packing completion publishes `order.packing.completed`.
- Ready for pickup publishes `order.ready_for_pickup`.
