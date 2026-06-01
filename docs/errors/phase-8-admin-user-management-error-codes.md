# Phase 8 Module 3 — Admin User Management Error Codes

## Status

Implemented.

## Error Codes

| Code | HTTP status | Use |
| --- | --- | --- |
| `ADMIN_USER_NOT_FOUND` | 404 | Target admin user does not exist or is not manageable. |
| `ADMIN_USER_ALREADY_EXISTS` | 409 | Admin user already exists for the submitted phone and role. |
| `INVALID_ADMIN_ROLE` | 422 | Submitted role is outside the supported admin role set. |
| `ADMIN_USER_SELF_DISABLE_DENIED` | 403 | Admin attempted to disable or restrict their own account. |
| `ADMIN_USER_SELF_ROLE_CHANGE_DENIED` | 403 | Admin attempted to change their own role. |
| `ADMIN_USER_SELF_PERMISSION_CHANGE_DENIED` | 403 | Admin attempted to change their own direct permissions. |

## Validation Rules

- `adminUserId`, `cityId`, city scope values, and store scope values must be
  valid Mongo ObjectIds.
- `email` must be a valid email when provided.
- `phone` must be present on create and valid length.
- `role` must be one of the managed admin roles.
- `permissions` must be valid permission codes.
- Status, role, and permission changes require reason capture.
