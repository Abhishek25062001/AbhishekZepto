# Inventory Locking Permissions

Status: **IMPLEMENTED**

## Internal (`/api/v1/internal/inventory/locks`)

| Endpoint | Auth |
|----------|------|
| POST `/` | `authenticate()` — service/cart/checkout callers use valid JWT |
| POST `/:lockToken/release` | Same |
| POST `/:lockToken/confirm` | Same |

No new permission namespace. Internal surface is not exposed to vendor/customer panels.

## Admin (`/api/v1/admin/inventory/locks`)

| Endpoint | Permission |
|----------|------------|
| GET `/` | `inventory:read` |
| GET `/:lockId` | `inventory:read` |
| POST `/expire-due` | `inventory:adjust` |

Roles: `super_admin`, `support_admin`, `operations_admin` (via admin route group).

## Admin Dashboard UI matrix

| Screen / action | Permission |
|-----------------|------------|
| Locks list / detail | `inventory:read` |
| Expire due locks button | `inventory:adjust` |

## Seeded roles

`operations_admin` already has `inventory:read` and `inventory:adjust` from Inventory Foundation.
