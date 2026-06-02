# Phase 8 Admin Data Export Permissions

Status: **IMPLEMENTED** — Module 20 backend.

## Permission Codes

| Permission | Scope |
|------------|-------|
| `reports:export` | Create and inspect admin export request metadata |

## Role Assignment

- `OPERATIONS_ADMIN`: receives `reports:export`.
- `SUPER_ADMIN`: retains access through `*:*`.
- `SUPPORT_ADMIN`: does not receive `reports:export` by default.
- Vendor, store, customer, and delivery-agent roles do not receive
  `reports:export`.

## Boundaries

`reports:export` does not allow source-domain mutation, file generation,
download streaming, scheduled exports, retry/cancel/delete workflows, or UI
behavior.
