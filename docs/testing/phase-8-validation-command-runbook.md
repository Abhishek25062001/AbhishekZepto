# Phase 8 Validation Command Runbook

Status: **PLANNED** — Module 22 validation commands.

## Backend Command Order

1. `npm run typecheck -w backend/api`
2. `npm run lint -w backend/api`
3. `npm run test:customer-orders -w backend/api`
4. `npm run test -w backend/api -- seed-role-permission-matrix`
5. `npm run build -w backend/api`
6. `node --test backend/api/dist/modules/admin-control/routes/admin-control.routes.test.js backend/api/dist/modules/admin-control/services/admin-control-realtime.service.test.js`
7. `node --test backend/api/dist/modules/admin-users/routes/admin-user.routes.test.js`
8. `node --test backend/api/dist/modules/customer-management/routes/customer-management.routes.test.js`
9. `node --test backend/api/dist/modules/delivery-agent-management/routes/admin-delivery-agent.routes.test.js`
10. `node --test backend/api/dist/modules/vendor-store-management/routes/admin-vendor-store.routes.test.js`
11. `node --test backend/api/dist/modules/support-operations/routes/support-operations.routes.test.js`
12. `npm run test -w backend/api -- platform-settings`
13. `npm run test -w backend/api -- audit-log-system`
14. `npm run test -w backend/api -- operational-analytics`
15. `npm run test -w backend/api -- admin-data-exports`

## Admin Dashboard Command Order

1. `npm run typecheck -w apps/admin-dashboard`
2. `npm run lint -w apps/admin-dashboard`
3. `npm run test -w apps/admin-dashboard -- admin-users`
4. `npm run test -w apps/admin-dashboard -- delivery-agents`
5. `npm run test -w apps/admin-dashboard -- vendor-stores`
6. `npm run test -w apps/admin-dashboard -- catalog-oversight`
7. `npm run test -w apps/admin-dashboard -- support`
8. `npm run test -w apps/admin-dashboard -- platform-settings`
9. `npm run test -w apps/admin-dashboard -- audit-logs`
10. `npm run test -w apps/admin-dashboard -- operational-overview`
11. `npm run test -w apps/admin-dashboard -- data-exports`

## OpenAPI JSON Verification

After backend build, verify `backend/api/dist/docs/openapi` contains:

- `/admin/control/session/start`
- `/admin/users`
- `/admin/customers`
- `/admin/delivery-agents`
- `/admin/vendors`
- `/admin/stores`
- `/admin/support/tickets`
- `/admin/settings`
- `/admin/audit-logs`
- `/admin/analytics/overview`
- `/admin/data-exports`

## Known Non-Blocking Warnings

Customer order regression may emit existing Mongoose duplicate schema index
warnings. These warnings are known from earlier Phase 8 validation and are not
Module 22 blockers unless accompanied by test failures.

## Failure Handling

- Stop at the failing ticket.
- Fix only validation issues that are inside Module 22 scope.
- Do not add product features or future-module behavior.
- Record unresolved failures as blockers with module ownership.
