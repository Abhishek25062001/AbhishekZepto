# Phase 8 Module 3 — Admin User Management API

## Status

Implemented by Module 3.

## Endpoints

- `POST /api/v1/admin/users`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/:adminUserId`
- `PATCH /api/v1/admin/users/:adminUserId`
- `PATCH /api/v1/admin/users/:adminUserId/status`
- `PATCH /api/v1/admin/users/:adminUserId/roles`
- `PATCH /api/v1/admin/users/:adminUserId/permissions`
- `GET /api/v1/admin/users/:adminUserId/audit`

## List Filters

- `role`
- `status`
- `cityId`
- `search`
- `page`
- `limit`

## Response Shape

Admin-user responses include `adminUserId`, `userId`, identity metadata, role,
permissions, status, city/store scope, audit metadata, and timestamps.

## Validation And Errors

Sensitive status, role, and permission updates require `reason`.

Implemented error codes:

- `ADMIN_USER_NOT_FOUND`
- `ADMIN_USER_ALREADY_EXISTS`
- `INVALID_ADMIN_ROLE`
- `ADMIN_USER_SELF_DISABLE_DENIED`
- `ADMIN_USER_SELF_ROLE_CHANGE_DENIED`
- `ADMIN_USER_SELF_PERMISSION_CHANGE_DENIED`

## Audit Endpoint

`GET /api/v1/admin/users/:adminUserId/audit` returns admin action audit records
for `entityType = admin_user`.

Implemented audit action types:

- `ADMIN_USER_CREATED`
- `ADMIN_USER_UPDATED`
- `ADMIN_USER_STATUS_CHANGED`
- `ADMIN_USER_ROLE_CHANGED`
- `ADMIN_USER_PERMISSIONS_CHANGED`
