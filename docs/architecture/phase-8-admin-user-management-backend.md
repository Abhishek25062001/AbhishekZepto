# Phase 8 Module 3 — Admin User Management Backend

## Status

Module 3 complete.

## Objective

Admin User Management Backend provides the Admin Dashboard backend surface for
creating, listing, viewing, updating, disabling, and permissioning admin users.

## Scope Boundary

Module 3 owns backend admin-user management only. It may update backend routes,
controllers, services, repositories, validators, OpenAPI contracts, tests, and
required documentation related to admin users.

Module 3 does not implement Admin Dashboard frontend UI, customer management,
delivery-agent management, vendor/store management, analytics, exports, support
operations, or platform settings.

## Dependencies

- Phase 2 auth identity, role, permission, and session foundations.
- Phase 8 Module 2 Admin Control architecture, audit expectations, and admin
  route security patterns.

## Runtime Ownership

Existing `UserIdentity` records remain the source of truth for admin identity,
role, account status, scope, and direct permissions. Module 3 adds admin-user
backend management around that existing auth-owned identity surface.

## Admin User Domain Model

Admin users are existing auth identities with an admin role. The backend maps
`UserIdentity._id` to both `adminId` and `userId` in Admin User Management
responses.

Implemented fields:

- `adminId`
- `userId`
- `name`
- `email`
- `phone`
- `role`
- `permissions`
- `status`
- `cityScope`
- `storeScope`
- `createdBy`
- `updatedBy`
- `lastLoginAt`
- `disabledAt`
- `disabledBy`
- `disableReason`
- `createdAt`
- `updatedAt`

## Planned Implementation Units

- Admin-user domain model and repository helpers. Implemented in Ticket 3.2.
- Admin-user management routes, controllers, services, validators, and OpenAPI.
  Implemented in Ticket 3.3.
- RBAC gates for create/read/update/status/role/permission/audit actions.
  Implemented in Ticket 3.4.
- Validation and error-code boundaries. Implemented in Ticket 3.5.
- Audit records for sensitive admin-user changes. Implemented in Ticket 3.6.
- Backend tests and module review artifacts. Verification plan implemented in
  Ticket 3.7.

## Implemented API Endpoints

- `POST /api/v1/admin/users`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/:adminUserId`
- `PATCH /api/v1/admin/users/:adminUserId`
- `PATCH /api/v1/admin/users/:adminUserId/status`
- `PATCH /api/v1/admin/users/:adminUserId/roles`
- `PATCH /api/v1/admin/users/:adminUserId/permissions`
- `GET /api/v1/admin/users/:adminUserId/audit`

## Implemented Audit Actions

Admin-user management writes Phase 8 admin action audits for:

- `ADMIN_USER_CREATED`
- `ADMIN_USER_UPDATED`
- `ADMIN_USER_STATUS_CHANGED`
- `ADMIN_USER_ROLE_CHANGED`
- `ADMIN_USER_PERMISSIONS_CHANGED`
