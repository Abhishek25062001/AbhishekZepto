# Session & Device Management

## Module Goal

Add authenticated session visibility and session-revoke controls on top of the
existing Phase 2 OTP auth/session foundation.

## Corrective API Decision

Current implementation uses one shared self-session API family under
`/api/v1/auth/*` for every authenticated surface.

The source PDF appears to expect per-surface self-session route families such
as:

- `GET /api/v1/customer/me/sessions`
- `DELETE /api/v1/customer/me/sessions/:sessionId`
- `GET /api/v1/delivery/me/sessions`
- `GET /api/v1/vendor/me/sessions`
- `GET /api/v1/admin/me/sessions`

and may also expect admin user-session management routes.

The corrective decision for Phase 2 is:

- preserve the current generic self-session API family as the canonical backend
  design for current-user session management
- treat any per-surface self-session route families as optional compatibility
  aliases, not as the canonical contract
- admin user-session management routes are implemented under
  `/api/v1/admin/users/:userId/sessions*` with explicit permission gates

This keeps the current backend design consistent with the existing shared auth
session model and avoids duplicating the same session logic across customer,
delivery, vendor, and admin route families.

## Included Behavior

- list the current user's sessions
- mark the current session in the response
- revoke one other owned session
- revoke all other owned sessions
- keep existing `POST /api/v1/public/auth/logout` behavior for current-device
  logout and logout-all-devices

## Excluded Behavior

- refresh-token rotation redesign
- trusted-device or remember-device features
- MFA
- business-module ownership checks

## Backend Endpoints

Self-session:

- `GET /api/v1/auth/me/sessions`
- `POST /api/v1/auth/logout-session`
- `POST /api/v1/auth/logout-other-sessions`
- `POST /api/v1/public/auth/logout`

Admin user-session:

- `GET /api/v1/admin/users/:userId/sessions`
- `DELETE /api/v1/admin/users/:userId/sessions/:sessionId`
- `DELETE /api/v1/admin/users/:userId/sessions`

## Source Mismatch Recorded

The source document and the current repository differ in three important ways:

1. The repo exposes generic self-session routes under `/api/v1/auth/*`.
2. The source appears to prefer per-surface self-session routes under
   `/api/v1/{surface}/me/*`.
3. The source may expect admin user-session routes, while the current repo does
   not yet expose that family.

## Impact Of The Decision

### Backend route design

- keep `GET /api/v1/auth/me/sessions`
- keep `POST /api/v1/auth/logout-session`
- keep `POST /api/v1/auth/logout-other-sessions`
- do not duplicate those handlers under customer/delivery/vendor/admin route
  families unless Tickets 10-12 intentionally add compatibility aliases
- admin user-session routes are mounted under `/api/v1/admin/users/:userId/sessions*`

### Frontend API services

- current frontend surfaces may keep calling the shared auth session endpoints
- Ticket 12 should not assume new per-surface session endpoints unless Ticket 10
  or Ticket 11 changes that contract

### Permission and RBAC

- current self-session APIs do not require new per-surface permission families
- admin user-session management uses `auth:read`/`users:read`/`settings:manage`
  for list and `auth:manage` for revoke

### OpenAPI and contracts

- contracts should describe the generic self-session endpoints as the current
  implemented Phase 2 truth
- per-surface examples should stay documented as source expectations/mismatch,
  not as already-implemented APIs

### Tests

- existing backend tests should continue to target the generic auth session API
  family
- Tickets 10-12 should only add tests for per-surface or admin session routes
  if that follow-up implementation is explicitly approved

## Remaining Architecture Question

`NEEDS VERIFICATION`:

- whether the source PDF requires per-surface route families as a hard product
  requirement, or whether the current generic self-session contract is an
  acceptable architectural reconciliation for Phase 2
- whether Module 11 must include admin user-session routes, or whether those
  routes belong to a later admin-operations scope

## Session Fields Used

- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.deviceId`
- `auth_sessions.deviceType`
- `auth_sessions.appSurface`
- `auth_sessions.appVersion`
- `auth_sessions.ipAddress`
- `auth_sessions.userAgent`
- `auth_sessions.lastUsedAt`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
- `auth_sessions.revokedAt`
- `auth_sessions.revokedReason`

## Frontend Surfaces

Dedicated session-management UI (Ticket 12):

- Customer App `SessionsScreen`
- Delivery Agent App `SessionsScreen`
- Vendor Panel `SessionsPage` (`/settings/sessions`)
- Admin Dashboard `SessionsPage` (`/settings/sessions`)
- Admin Dashboard `UserSessionsPage` (`/users/:userId/sessions`)

Profile/header surfaces link into the dedicated pages instead of owning the full
session-management workflow inline.
