# Phase 8 Admin Dashboard Validation Matrix

Status: **PLANNED** — Module 22 Admin Dashboard validation.

## Baseline Commands

| Check | Command |
|-------|---------|
| Admin Dashboard typecheck | `npm run typecheck -w apps/admin-dashboard` |
| Admin Dashboard lint | `npm run lint -w apps/admin-dashboard` |

## Focused UI Suites

| Phase 8 UI surface | Permission gate | Consumed APIs | Focused validation command |
|--------------------|-----------------|---------------|----------------------------|
| Admin Dashboard user management | `users:read`, `users:create`, `users:update` | `/api/v1/admin/users` | `npm run test -w apps/admin-dashboard -- admin-users` |
| Delivery agent management UI | `delivery:read`, `delivery:update`, `delivery:manage` | `/api/v1/admin/delivery-agents` | `npm run test -w apps/admin-dashboard -- delivery-agents` |
| Vendor & store management UI | `stores:read`, `stores:update` | `/api/v1/admin/vendors`, `/api/v1/admin/stores` | `npm run test -w apps/admin-dashboard -- vendor-stores` |
| Catalog oversight UI | `catalog:read`, `catalog:create`, `catalog:update`, `catalog:approve` | `/api/v1/admin/catalog/*` | `npm run test -w apps/admin-dashboard -- catalog-oversight` |
| Support operations UI | `support:read`, `support:create`, `support:update`, `support:assign` | `/api/v1/admin/support/tickets` | `npm run test -w apps/admin-dashboard -- support` |
| Platform settings UI | `settings:read`, `settings:manage` | `/api/v1/admin/settings` | `npm run test -w apps/admin-dashboard -- platform-settings` |
| Audit log UI | `audit_logs:read` | `/api/v1/admin/audit-logs` | `npm run test -w apps/admin-dashboard -- audit-logs` |
| Operational overview UI | `reports:read` | `/api/v1/admin/analytics/*` | `npm run test -w apps/admin-dashboard -- operational-overview` |
| Export UI | `reports:export` | `/api/v1/admin/data-exports` | `npm run test -w apps/admin-dashboard -- data-exports` |

## Validation Boundaries

- UI validation must not add backend routes, database fields, OpenAPI paths, or
  source-domain mutation behavior.
- Permission-gated routes and sidebar visibility are validated by focused
  source tests.
- UI API clients must consume only documented Phase 8 backend endpoints.
