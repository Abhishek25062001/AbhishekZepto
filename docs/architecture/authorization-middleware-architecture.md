# Authorization Middleware Architecture

## Authorization Goal

Backend is the final authority for token, role, permission, and tenant-scope access.

## Planned Authenticate Middleware

Planned file:

- `/backend/api/src/modules/auth/middlewares/authenticate.middleware.ts`

`authenticate()` responsibility:

- Read Authorization header.
- Validate Bearer token format.
- Verify access token.
- Load session.
- Reject revoked session.
- Load user identity.
- Reject blocked/inactive users.
- Attach `req.user`.

## Planned Role Middleware

Planned file:

- `/backend/api/src/modules/auth/middlewares/require-role.middleware.ts`

`requireRole()` responsibility:

- Allow access only when `req.user.role` matches one of the allowed roles.
- Return forbidden when the authenticated user has the wrong role.

## Planned Permission Middleware

Planned file:

- `/backend/api/src/modules/auth/middlewares/require-permission.middleware.ts`

`requirePermission()` responsibility:

- Allow access only when `req.user.permissions` contains the required permission or wildcard permission.

Planned file:

- `/backend/api/src/modules/auth/middlewares/require-any-permission.middleware.ts`

`requireAnyPermission()` responsibility:

- Allow access when `req.user.permissions` contains at least one allowed permission or wildcard permission.

## Planned Role Guards

Planned file:

- `/backend/api/src/modules/auth/middlewares/role-guards.middleware.ts`

Role guards:

- `requireCustomer`
- `requireDeliveryAgent`
- `requireVendorUser`
- `requireAdminUser`
- `requireSuperAdmin`

## API Endpoints

- `GET /api/v1/internal/auth/test-protected`
- Future protected customer/vendor/admin/delivery endpoints

## DB Fields

- `auth_sessions.userId`
- `auth_sessions.isRevoked`
- `auth_sessions.expiresAt`
- `user_identities.accountStatus`
- `user_identities.permissions`
- `audit_logs.eventType`
- `audit_logs.actorId`
- `audit_logs.actorRole`
- `audit_logs.metadata`
- `audit_logs.status`
