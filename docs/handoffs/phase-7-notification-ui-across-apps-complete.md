# Phase 7 Module 13 - Notification UI Across Apps Complete

## Completed

- Shared notification UI package created under `packages/shared-ui/notifications`.
- Customer and delivery mobile notification bells, notification center entries, list behavior, unread count loading, read marking, and realtime notification updates are implemented.
- Vendor and admin topbar dropdowns, latest-five previews, unread count loading, mark-all-read behavior, notification center routes, and realtime notification updates are implemented.
- Cross-app notification routing, relative time formatting, message truncation, loading/retry states, screen-reader labels, keyboard close handling, and in-flight disabled states are implemented.
- Notification-focused tests and validation scripts were added for all four apps.

## APIs Used

- `GET /api/v1/customer/me/notifications`
- `GET /api/v1/customer/me/notifications/unread-count`
- `PATCH /api/v1/customer/me/notifications/:notificationId/read`
- `GET /api/v1/delivery/me/notifications`
- `GET /api/v1/delivery/me/notifications/unread-count`
- `PATCH /api/v1/delivery/me/notifications/:notificationId/read`
- `GET /api/v1/vendor/me/notifications?limit=5`
- `GET /api/v1/vendor/me/notifications/unread-count`
- `PATCH /api/v1/vendor/me/notifications/read-all`
- `GET /api/v1/admin/me/notifications?limit=5`
- `GET /api/v1/admin/me/notifications/unread-count`
- `PATCH /api/v1/admin/me/notifications/read-all`

## Notes

- No new backend endpoints were introduced in this module.
- OpenAPI verification is not applicable for Module 13 because the module consumes the existing Phase 7 notification endpoints.
- Generated `dist-notifications-test/**` folders are ignored by each app lint config.

