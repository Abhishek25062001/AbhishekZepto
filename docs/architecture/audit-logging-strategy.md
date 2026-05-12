# Audit Logging Strategy

## Audit Logging Goal

Audit logs will track important user, admin, vendor, delivery, inventory, order,
payment, and security actions.

## Audit Events

Examples:

- `auth.login_success`
- `auth.login_failed`
- `auth.logout`
- `admin.user_created`
- `admin.permission_changed`
- `vendor.inventory_updated`
- `order.status_changed`
- `payment.refund_initiated`
- `delivery.assignment_changed`
- `security.access_denied`

## Security Audit Hook Locations

- `/backend/api/src/modules/auth/middlewares/require-role.middleware.ts`
- `/backend/api/src/modules/auth/middlewares/require-permission.middleware.ts`
- `/backend/api/src/modules/auth/middlewares/require-any-permission.middleware.ts`

## API Endpoints

- `GET /api/v1/internal/auth/test-protected`

## DB Fields Touched

- `audit_logs.eventType`
- `audit_logs.actorId`
- `audit_logs.actorRole`
- `audit_logs.actorSurface`
- `audit_logs.requestId`
- `audit_logs.traceId`
- `audit_logs.ipAddress`
- `audit_logs.userAgent`
- `audit_logs.metadata`
- `audit_logs.status`
- `audit_logs.createdAt`
- `audit_logs.updatedAt`
