# Phase 8 Operational Analytics Permissions

Status: **COMPLETE** — Module 18 backend.

## Permission Codes

| Permission | Scope |
|------------|-------|
| `reports:read` | Read-only operational analytics summaries |

## Role Assignment

- `OPERATIONS_ADMIN`: receives `reports:read`.
- `SUPER_ADMIN`: retains access through `*:*`.
- `SUPPORT_ADMIN`: does not receive `reports:read` by default.
- Vendor, store, customer, and delivery-agent roles do not receive
  `reports:read`.

## Boundaries

`reports:read` does not allow exports, scheduled reports, custom report
builders, source-record mutation, sensitive data reveal beyond documented
summary payloads, or Admin Dashboard UI behavior.
