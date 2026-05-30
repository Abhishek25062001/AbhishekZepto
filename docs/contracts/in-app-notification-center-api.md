# In-App Notification Center API

Phase 7 Module 12 implements user-scoped in-app notification center APIs for customer, delivery agent, vendor, and admin surfaces.

## Endpoints

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/api/v1/customer/me/notifications` | `notifications:read_self` | List customer notifications |
| GET | `/api/v1/customer/me/notifications/unread-count` | `notifications:read_self` | Get customer unread count |
| PATCH | `/api/v1/customer/me/notifications/:notificationId/read` | `notifications:update_self` | Mark one customer notification read |
| PATCH | `/api/v1/customer/me/notifications/read-all` | `notifications:update_self` | Mark all customer notifications read |
| GET | `/api/v1/delivery/me/notifications` | `notifications:read_self` | List delivery agent notifications |
| GET | `/api/v1/delivery/me/notifications/unread-count` | `notifications:read_self` | Get delivery unread count |
| PATCH | `/api/v1/delivery/me/notifications/:notificationId/read` | `notifications:update_self` | Mark one delivery notification read |
| PATCH | `/api/v1/delivery/me/notifications/read-all` | `notifications:update_self` | Mark all delivery notifications read |
| GET | `/api/v1/vendor/me/notifications` | `notifications:read_self` | List vendor user notifications |
| GET | `/api/v1/vendor/me/notifications/unread-count` | `notifications:read_self` | Get vendor unread count |
| PATCH | `/api/v1/vendor/me/notifications/:notificationId/read` | `notifications:update_self` | Mark one vendor notification read |
| PATCH | `/api/v1/vendor/me/notifications/read-all` | `notifications:update_self` | Mark all vendor notifications read |
| GET | `/api/v1/admin/me/notifications` | `notifications:read_self` | List admin notifications |
| GET | `/api/v1/admin/me/notifications/unread-count` | `notifications:read_self` | Get admin unread count |
| PATCH | `/api/v1/admin/me/notifications/:notificationId/read` | `notifications:update_self` | Mark one admin notification read |
| PATCH | `/api/v1/admin/me/notifications/read-all` | `notifications:update_self` | Mark all admin notifications read |

## Query Parameters

`isRead`, `notificationType`, `page`, and `limit` are supported on all list endpoints.

Allowed notification types are `order_update`, `delivery_update`, `assignment_update`, `payment_update`, `refund_update`, `sla_alert`, and `system_alert`.

## DB Fields

`in_app_notifications` stores `userId`, `role`, `appSurface`, `notificationType`, `title`, `message`, `dataPayload`, `priority`, `isRead`, `readAt`, `isArchived`, `archivedAt`, `createdAt`, and `updatedAt`.

Indexes exist on `userId`, `role`, `appSurface`, `isRead`, `isArchived`, `notificationType`, and `createdAt`.

## Realtime Event

After creation, the backend emits `notification.created` to the authenticated user room for the target surface. The payload is the public notification response shape and excludes `userId`, `role`, `appSurface`, internal archive fields, and `__v`.
