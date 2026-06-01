# Phase 8 Module 3 — Admin User Management Backend Verification

## Status

Implemented.

## Required Checks

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `node --test backend/api/dist/modules/admin-users/routes/admin-user.routes.test.js`
- OpenAPI JSON verification for Admin User Management paths.

## Coverage

Route and validator coverage includes:

- `POST /api/v1/admin/users`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/:adminUserId`
- `PATCH /api/v1/admin/users/:adminUserId`
- `PATCH /api/v1/admin/users/:adminUserId/status`
- `PATCH /api/v1/admin/users/:adminUserId/roles`
- `PATCH /api/v1/admin/users/:adminUserId/permissions`
- `GET /api/v1/admin/users/:adminUserId/audit`

Focused tests cover:

- route contract
- create payload validation
- list filter validation
- ObjectId validation
- RBAC permission groups
- sensitive reason capture
- Module 3 error codes
- audit action type registration

## OpenAPI Verification

The OpenAPI document must include:

- `/admin/users`
- `/admin/users/{adminUserId}`
- `/admin/users/{adminUserId}/status`
- `/admin/users/{adminUserId}/roles`
- `/admin/users/{adminUserId}/permissions`
- `/admin/users/{adminUserId}/audit`
