# Phase 6 Delivery Notifications Placeholder Contract

## Scope

Phase 6 Module 17 adds an internal placeholder layer for delivery-operation notification records. It captures delivery lifecycle events that should notify delivery agents (riders), customers, vendors/stores, and admins later, without sending real push, SMS, email, socket, or provider messages.

This module is placeholder-only. It records internal notification intent after successful delivery-operation state changes.

## Placeholder Event Sources

Module 17 may create placeholder records after successful existing events:

- `delivery.assignment.created` / `assigned` (Rider notification)
- `delivery.agent.arrived_at_store` (Vendor/Admin notification)
- `delivery.order.picked_up` (Customer notification)
- `delivery.agent.arrived_at_customer` (Customer notification)
- `delivery.order.delivered` (Customer/Admin notification)
- `delivery.order.failed` (Customer/Admin notification)
- `delivery.assignment.cancelled` (Customer/Vendor notification)
- `delivery.sla.breached` (Admin/Vendor notification)

## Placeholder Recipients

| Recipient type | Purpose |
|---|---|
| `customer` | Customer-visible delivery progress |
| `vendor` | Store/vendor operational awareness |
| `admin` | Admin operational monitoring placeholder |
| `agent` | Rider assignment and state alerts |

## Placeholder Payload

Internal placeholder payloads use the Mongoose `order_notification_placeholders` collection:

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

No provider token, phone number, email address, socket id, or external queue id is stored by Module 17.

## API Endpoints

Module 17 adds no public HTTP endpoints.

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

## Permissions

No new permission codes are added. Placeholder creation runs internally after already-authorized delivery operations complete.
