# Phase 8 Module 6 — Vendor & Store Management Permissions

## Route Permissions

| Capability | Endpoint | Required permission |
| --- | --- | --- |
| Vendor list/detail | `GET /api/v1/admin/vendors*` | `stores:read` or `settings:manage` |
| Vendor status update | `PATCH /api/v1/admin/vendors/:vendorId/status` | `stores:update` or `settings:manage` |
| Store list/detail/orders/inventory | `GET /api/v1/admin/stores*` | `stores:read` or `settings:manage` |
| Store status update | `PATCH /api/v1/admin/stores/:storeId/status` | `stores:update` or `settings:manage` |
| Store audit read | `GET /api/v1/admin/stores/:storeId/audit` | `stores:read` or `settings:manage` |

## Seed Roles

Support admin already receives `stores:read` for read-only vendor/store
inspection. Operations admin already receives `stores:read` and `stores:update`
for operational store controls. Super admin retains wildcard permissions.

## Boundary

Permission gates authorize only Module 6 admin vendor/store management
surfaces. They do not grant catalog rewrites, inventory mutation, order
workflow actions, payouts, settlements, analytics, exports, Vendor Panel UI, or
Admin Dashboard frontend UI permissions.
