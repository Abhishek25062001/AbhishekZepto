# Phase 8 Module 3 — Admin User Management Permissions

## Status

Implemented with existing RBAC permission codes.

## Permission Matrix

| Action | Endpoint family | Permission gate |
| --- | --- | --- |
| Create admin user | `POST /api/v1/admin/users` | `users:create` or `settings:manage` |
| Read admin users | `GET /api/v1/admin/users*` | `users:read`, `settings:read`, or `settings:manage` |
| Update admin metadata | `PATCH /api/v1/admin/users/:adminUserId` | `users:update` or `settings:manage` |
| Update admin status | `PATCH /api/v1/admin/users/:adminUserId/status` | `users:update-status` or `settings:manage` |
| Assign admin role | `PATCH /api/v1/admin/users/:adminUserId/roles` | `settings:manage` |
| Assign direct permissions | `PATCH /api/v1/admin/users/:adminUserId/permissions` | `settings:manage` |
| Read admin audit | `GET /api/v1/admin/users/:adminUserId/audit` | `users:read` or `settings:manage` |

## Role Hierarchy Restrictions

Admin-user routes are mounted behind the existing admin role guard. Direct role
and permission assignment require `settings:manage`, which is seeded for the
highest operational admin roles.

## Self-Modification Restrictions

Sensitive self-modification protections are implemented in the validation and
error-boundary ticket. Role and permission changes are treated as sensitive
operations and require reason capture before Module 3 closes.
