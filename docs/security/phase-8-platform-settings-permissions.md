# Phase 8 Platform Settings Permissions

Status: **COMPLETE** — Module 14 backend.

## Permissions

| Permission | Use |
| --- | --- |
| `settings:read` | List settings, view detail, and view setting audit entries |
| `settings:manage` | Update editable settings |

## Sensitive Settings Rules

- Mutations require `settings:manage`.
- Mutations require reason capture.
- Updates to non-editable settings must be rejected.
- Updates must write admin audit entries.
- This module does not grant pricing, finance, order, delivery, customer,
  support, catalog, vendor, store, analytics, export, or UI permissions.

## Role Intent

Phase 8 Admin Control defines platform settings as a sensitive operational
permission group. Seed roles may grant settings permissions only where existing
role policy allows administrative settings control.
