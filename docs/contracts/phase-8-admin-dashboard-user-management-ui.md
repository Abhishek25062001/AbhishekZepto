# Phase 8 Module 7 - Admin Dashboard User Management UI Contract

## Status

Module 7 implemented.

## Consumed Endpoints

- `POST /api/v1/admin/users`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/:adminUserId`
- `PATCH /api/v1/admin/users/:adminUserId`
- `PATCH /api/v1/admin/users/:adminUserId/status`
- `PATCH /api/v1/admin/users/:adminUserId/roles`
- `PATCH /api/v1/admin/users/:adminUserId/permissions`
- `GET /api/v1/admin/users/:adminUserId/audit`

## List Filters

The Admin Dashboard users list may send only these filters to
`GET /api/v1/admin/users`:

- `role`
- `status`
- `cityId`
- `search`
- `page`
- `limit`

## Mutation Contracts

Create and profile update forms must send only fields supported by the Module 3
backend contract. Sensitive status, role, and direct permission updates must
capture and submit `reason`.

## Boundaries

Module 7 is a frontend consumer of existing backend APIs. It must not add API
routes, OpenAPI paths, database fields, or backend admin-user behavior.

## Implemented Route Surface

- `/users`
- `/users/:adminUserId`
- Existing `/users/:userId/sessions` remains available for user-session
  management.
