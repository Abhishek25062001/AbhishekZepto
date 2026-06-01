# Phase 8 Module 4 — Customer Management Permissions

## Status

Implemented.

## Permission Gates

| Endpoint group | Permission group |
| --- | --- |
| Customer list/detail/orders/addresses | `customer:read` or `settings:manage` |
| Customer status update | `customer:update-status` or `settings:manage` |
| Customer admin notes update | `customer:update` or `settings:manage` |
| Customer audit read | `customer:read` or `settings:manage` |

## Seed Role Impact

Support admin receives `customer:read` for customer inspection. Operations
admin receives `customer:read`, `customer:update`, and `customer:update-status`
for operational customer account management. Super admin continues to use the
wildcard permission.
