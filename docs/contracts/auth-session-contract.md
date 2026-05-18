# Auth Session Contract

## Contract Goal

Document the session object shape used internally by the backend.

## Collection

- `auth_sessions`

## Internal Session Shape

```ts
type AuthSessionContract = {
  id: string;
  userId: string;
  role: AuthRole;
  refreshTokenHash: string;
  refreshTokenRotatedAt: string | null;
  deviceId: string | null;
  deviceName: string | null;
  deviceType: 'android' | 'ios' | 'web' | 'unknown';
  appSurface:
    | 'customer_app'
    | 'delivery_agent_app'
    | 'vendor_panel'
    | 'admin_dashboard';
  appVersion: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: string;
  revokedAt: string | null;
  revokedReason: string | null;
  lastUsedAt: string | null;
  isRevoked: boolean;
  status: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
```

## API Endpoints

- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/auth/me/sessions`
- `POST /api/v1/auth/logout-session`
- `POST /api/v1/auth/logout-other-sessions`

## Current Implemented Self-Session Contract

The current repository implements one generic self-session API family shared by
all authenticated surfaces:

- `GET /api/v1/auth/me/sessions`
- `POST /api/v1/auth/logout-session`
- `POST /api/v1/auth/logout-other-sessions`

This is the current implemented contract for Customer App, Delivery Agent App,
Vendor Panel, and Admin Dashboard.

## Source-Document Route Expectation Mismatch

The source PDF appears to expect per-surface self-session routes such as:

- `GET /api/v1/customer/me/sessions`
- `DELETE /api/v1/customer/me/sessions/:sessionId`
- `GET /api/v1/delivery/me/sessions`
- `GET /api/v1/vendor/me/sessions`
- `GET /api/v1/admin/me/sessions`

It may also expect admin user-session routes for listing or revoking another
user's sessions.

Those per-surface and admin user-session route families are not implemented in
the current repository.

## Corrective Contract Decision

For the current Phase 2 corrective path:

- the generic `/api/v1/auth/*` self-session family remains the canonical
  implemented contract for current-user session management
- per-surface route families are documented as source expectations, not as
  implemented APIs
- admin user-session management routes are implemented under
  `/api/v1/admin/users/:userId/sessions*`

## Admin User-Session APIs

Admin routes for managing another user's sessions:

- `GET /api/v1/admin/users/:userId/sessions`
- `DELETE /api/v1/admin/users/:userId/sessions/:sessionId`
- `DELETE /api/v1/admin/users/:userId/sessions`

### Permission gates

`NEEDS VERIFICATION` against the source PDF permission matrix naming, but the
current implementation uses:

- list: any of `auth:read`, `users:read`, `settings:manage`
- revoke one / revoke all: `auth:manage`

`operations_admin` is seeded with `auth:manage`. `super_admin` inherits all
permissions through `*:*`. `support_admin` can list but cannot revoke.

### Admin session summary response shape

`GET /api/v1/admin/users/:userId/sessions` returns:

- `userId`
- `sessions[]` with the same safe summary fields as self-session list, except
  there is no `isCurrent` marker

Responses must not include:

- `refreshTokenHash`
- access tokens
- refresh tokens
- other secret material

### Admin revoke behavior

Revoking a session updates:

- `auth_sessions.isRevoked = true`
- `auth_sessions.revokedAt`
- `auth_sessions.revokedReason`

Reason codes:

- single revoke: `admin_revoked_session`
- revoke all: `admin_revoked_all_sessions`

`DELETE /api/v1/admin/users/:userId/sessions/:sessionId` is idempotent for
already-revoked sessions and returns `alreadyRevoked: true` without failing.

Admin revoke-all only updates sessions that are not already revoked.

## Current Session Summary Response Shape

`GET /api/v1/auth/me/sessions` currently returns session summaries with:

- `id`
- `role`
- `deviceId`
- `deviceName`
- `deviceType`
- `appSurface`
- `appVersion`
- `ipAddress`
- `userAgent`
- `lastUsedAt`
- `expiresAt`
- `isCurrent`
- `isRevoked`
- `revokedAt`
- `revokedReason`
- `createdAt`

## DB Fields

- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.refreshTokenHash`
- `auth_sessions.refreshTokenRotatedAt`
- `auth_sessions.deviceId`
- `auth_sessions.deviceName`
- `auth_sessions.deviceType`
- `auth_sessions.appSurface`
- `auth_sessions.appVersion`
- `auth_sessions.ipAddress`
- `auth_sessions.userAgent`
- `auth_sessions.expiresAt`
- `auth_sessions.revokedAt`
- `auth_sessions.revokedReason`
- `auth_sessions.lastUsedAt`
- `auth_sessions.isRevoked`
- `auth_sessions.status`
- `auth_sessions.isDeleted`
- `auth_sessions.deletedAt`
- `auth_sessions.createdAt`
- `auth_sessions.updatedAt`
