# Phase 8 Backend Validation Matrix

Status: **PLANNED** — Module 22 backend validation.

## Baseline Commands

| Check | Command |
|-------|---------|
| Backend typecheck | `npm run typecheck -w backend/api` |
| Backend lint | `npm run lint -w backend/api` |
| Customer order regression | `npm run test:customer-orders -w backend/api` |
| Role seed matrix | `npm run test -w backend/api -- seed-role-permission-matrix` |

## Focused Backend Suites

| Phase 8 surface | Focused validation command |
|-----------------|----------------------------|
| Admin Control Architecture | `npm run build -w backend/api` then `node --test backend/api/dist/modules/admin-control/routes/admin-control.routes.test.js backend/api/dist/modules/admin-control/services/admin-control-realtime.service.test.js` |
| Admin User Management Backend | `npm run build -w backend/api` then `node --test backend/api/dist/modules/admin-users/routes/admin-user.routes.test.js` |
| Customer Management Backend | `npm run build -w backend/api` then `node --test backend/api/dist/modules/customer-management/routes/customer-management.routes.test.js` |
| Delivery Agent Management Backend | `npm run build -w backend/api` then `node --test backend/api/dist/modules/delivery-agent-management/routes/admin-delivery-agent.routes.test.js` |
| Vendor & Store Management Backend | `npm run build -w backend/api` then `node --test backend/api/dist/modules/vendor-store-management/routes/admin-vendor-store.routes.test.js` |
| Support Operations Backend | `npm run build -w backend/api` then `node --test backend/api/dist/modules/support-operations/routes/support-operations.routes.test.js` |
| Platform Settings Backend | `npm run test -w backend/api -- platform-settings` |
| Audit Log System | `npm run test -w backend/api -- audit-log-system` |
| Operational Analytics Backend | `npm run test -w backend/api -- operational-analytics` |
| Admin Data Export Foundation | `npm run test -w backend/api -- admin-data-exports` |

## OpenAPI Verification

OpenAPI JSON verification must confirm the following endpoint groups are present:

- Admin Control: `/admin/control/*`
- Admin user management: `/admin/users`
- Customer management: `/admin/customers`
- Delivery agent management: `/admin/delivery-agents`
- Vendor/store management: `/admin/vendors`, `/admin/stores`
- Support operations: `/admin/support/tickets`
- Platform settings: `/admin/settings`
- Audit logs: `/admin/audit-logs`
- Operational analytics: `/admin/analytics/*`
- Admin data exports: `/admin/data-exports`

## Non-Goals

Module 22 must not add backend endpoints, database fields, validators,
permissions, seed changes, OpenAPI paths, or product workflows.
