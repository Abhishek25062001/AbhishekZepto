# Phase 7 Module 13 - Notification UI Across Apps Review

## Scope

Module 13 added notification UI integration across customer app, delivery agent app, vendor panel, and admin dashboard using the Phase 7 in-app notification APIs and realtime `notification.created` event.

## Shared UI Foundation

- Shared types and utilities live under `packages/shared-ui/notifications`.
- Shared notification types cover view models, priorities, surfaces, and click targets.
- Shared utilities cover notification icon labels, priority labels, realtime payload extraction, message truncation, and relative time formatting.
- Shared web and mobile components cover bell, badge, empty state, list, list item, and web dropdown primitives.

## App Integrations

- Customer app:
  - Home header notification bell loads unread count from `GET /api/v1/customer/me/notifications/unread-count`.
  - Profile screen exposes a Notification center entry.
  - Notification center lists notifications from `GET /api/v1/customer/me/notifications`, supports All/Unread filtering, pull-to-refresh, retry, empty state, and per-item read marking through `PATCH /api/v1/customer/me/notifications/:notificationId/read`.
- Delivery agent app:
  - Dashboard header notification bell loads unread count from `GET /api/v1/delivery/me/notifications/unread-count`.
  - Profile screen exposes a Notification center entry.
  - Notification center lists notifications from `GET /api/v1/delivery/me/notifications`, supports All/Unread filtering, pull-to-refresh, retry, empty state, and per-item read marking through `PATCH /api/v1/delivery/me/notifications/:notificationId/read`.
- Vendor panel:
  - Topbar dropdown loads unread count from `GET /api/v1/vendor/me/notifications/unread-count`.
  - Dropdown loads latest five notifications from `GET /api/v1/vendor/me/notifications?limit=5`.
  - Mark-all-read uses `PATCH /api/v1/vendor/me/notifications/read-all`, refreshes unread state, and links to `/notifications`.
- Admin dashboard:
  - Topbar dropdown loads unread count from `GET /api/v1/admin/me/notifications/unread-count`.
  - Dropdown loads latest five notifications from `GET /api/v1/admin/me/notifications?limit=5`.
  - Mark-all-read uses `PATCH /api/v1/admin/me/notifications/read-all`, refreshes unread state, and links to `/notifications`.

## Realtime Behavior

- All four apps listen for `notification.created` on their existing realtime sockets.
- Incoming notifications are prepended into the local notification store.
- Unread badge count increments for unread realtime notifications.
- High and critical notifications trigger the app surface alert path.

## Click Routing

- Customer `order_update` routes to order detail; `delivery_update` routes to delivery tracking.
- Delivery `assignment_update` routes to active delivery assignment.
- Vendor `order_update` and `delivery_update` route to active order visibility.
- Admin `sla_alert` routes to realtime control tower; `delivery_update` routes to delivery operations detail when `deliveryId` is present.

## Consumed DB Fields

The UI consumes the following in-app notification fields surfaced by the backend API:

- `notificationType`
- `title`
- `message`
- `priority`
- `isRead`
- `readAt`
- `createdAt`

## Validation

- Backend typecheck, lint, and customer-orders test suite passed.
- Customer, delivery, vendor, and admin notification test suites passed.
- Customer, delivery, vendor, and admin frontend typechecks passed.
- Customer, delivery, vendor, and admin frontend lints passed after excluding generated notification test output directories.

