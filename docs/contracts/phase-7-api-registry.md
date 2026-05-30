# Phase 7 API Registry

**Phase:** Phase 7 - Realtime & Live Systems  
**Module:** 16 - Phase 7 Integration & Review

## Implemented REST APIs

### Device Token APIs

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/customer/me/device-token` | Register or refresh customer device token. |
| `DELETE` | `/api/v1/customer/me/device-token/:deviceId` | Remove customer device token. |
| `POST` | `/api/v1/delivery/me/device-token` | Register or refresh delivery-agent device token. |
| `DELETE` | `/api/v1/delivery/me/device-token/:deviceId` | Remove delivery-agent device token. |

### Push Notification Admin APIs

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/admin/push-notifications/logs` | List push notification logs. |
| `GET` | `/api/v1/admin/push-notifications/logs/:logId` | Get a single push notification log. |

### Notification Center APIs

| Method | Path Pattern | Surfaces |
| --- | --- | --- |
| `GET` | `/api/v1/{surface}/me/notifications` | customer, delivery, vendor, admin |
| `GET` | `/api/v1/{surface}/me/notifications/unread-count` | customer, delivery, vendor, admin |
| `PATCH` | `/api/v1/{surface}/me/notifications/:notificationId/read` | customer, delivery, vendor, admin |
| `PATCH` | `/api/v1/{surface}/me/notifications/read-all` | customer, delivery, vendor, admin |

### Admin Control Tower Fallback APIs

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/admin/control-tower/snapshot` | Polling fallback for admin control tower snapshot. |
| `GET` | `/api/v1/admin/control-tower/delivery-locations` | Polling fallback for active delivery locations. |

## Required But Missing APIs

| Method | Path | Status |
| --- | --- | --- |
| `GET` | `/api/v1/customer/realtime/missed-events` | Missing from backend source and OpenAPI. |
| `POST` | `/api/v1/customer/realtime/events/:eventId/ack` | Missing from backend source and OpenAPI. |
| `GET` | `/api/v1/admin/realtime/health` | Missing from backend source and OpenAPI. |

## DB Fields Reviewed

- `device_tokens.userId`
- `device_tokens.deviceId`
- `device_tokens.fcmToken`
- `device_tokens.appSurface`
- `device_tokens.isActive`
- `push_notification_logs.notificationType`
- `push_notification_logs.status`
- `push_notification_logs.sentAt`
- `push_notification_logs.failedAt`
- `in_app_notifications.userId`
- `in_app_notifications.appSurface`
- `in_app_notifications.notificationType`
- `in_app_notifications.priority`
- `in_app_notifications.isRead`
- `in_app_notifications.readAt`
- `in_app_notifications.createdAt`
- Expected but missing: `realtime_event_logs.eventId`
- Expected but missing: `realtime_event_logs.eventName`
- Expected but missing: `realtime_event_logs.recipientUserId`
- Expected but missing: `realtime_event_logs.appSurface`
- Expected but missing: `realtime_event_logs.deliveryStatus`
- Expected but missing: `realtime_event_logs.emittedAt`
- Expected but missing: `realtime_event_logs.acknowledgedAt`
- Expected but missing: `realtime_event_logs.expiresAt`

