# In-App Notification Center

Phase 7 Module 12 adds a persisted notification center on top of existing internal events and realtime socket infrastructure.

## Backend Flow

1. Business modules publish internal events.
2. `in-app-notification.subscriber.ts` translates supported events into notification creation requests.
3. `in-app-notification.service.ts` persists notifications and emits `notification.created`.
4. Surface routes expose scoped list, unread count, mark-read, and mark-all-read operations.

Notification creation is isolated from source flows: subscriber failures are caught so order and delivery event processing is not blocked by notification writes.

## Surfaces

| Surface | App surface value | API base |
|---------|-------------------|----------|
| Customer App | `customer_app` | `/api/v1/customer/me/notifications` |
| Delivery Agent App | `delivery_agent_app` | `/api/v1/delivery/me/notifications` |
| Vendor Panel | `vendor_panel` | `/api/v1/vendor/me/notifications` |
| Admin Dashboard | `admin_dashboard` | `/api/v1/admin/me/notifications` |

## Frontend Foundation

Each app has a notification-center module with API client, store, bell component, list component, page or screen, and routing utility. Realtime `notification.created` handlers can prepend the payload through `prependNotification` and increment unread counts without re-fetching.
