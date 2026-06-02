# Phase 8 Module 7 - Admin Dashboard User Management UI Verification

## Scope

This verification covers the Admin Dashboard frontend user-management UI and
its integration with existing Phase 8 Module 3 backend APIs.

## Required Checks

- `npm run typecheck -w apps/admin-dashboard`
- `npm run lint -w apps/admin-dashboard`
- `npm run test -w apps/admin-dashboard -- admin-users`
- `npm run build -w apps/admin-dashboard`
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

## Backend Endpoint Verification

Module 7 adds no backend endpoints. OpenAPI verification should confirm the
existing Module 3 admin-user paths remain present:

- `/admin/users`
- `/admin/users/{adminUserId}`
- `/admin/users/{adminUserId}/status`
- `/admin/users/{adminUserId}/roles`
- `/admin/users/{adminUserId}/permissions`
- `/admin/users/{adminUserId}/audit`

## Result

PASS. Module 7 verification passed. Existing customer order tests may emit the
known duplicate Mongoose index warning for `{"isDeleted":1}`; the warning
predates Module 7 and does not fail the suite.
