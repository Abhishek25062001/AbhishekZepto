# Phase 8 Module 9 - Admin Dashboard Vendor & Store Management UI Verification

## Scope

This verification covers the Admin Dashboard frontend vendor/store management
UI and its integration with existing Phase 8 Module 6 backend APIs.

## Required Checks

- `npm run typecheck -w apps/admin-dashboard`
- `npm run lint -w apps/admin-dashboard`
- `npm run test -w apps/admin-dashboard -- vendor-stores`
- `npm run build -w apps/admin-dashboard`
- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

## Backend Endpoint Verification

Module 9 adds no backend endpoints. OpenAPI verification should confirm the
existing Module 6 vendor/store paths remain present:

- `/admin/vendors`
- `/admin/vendors/{vendorId}`
- `/admin/vendors/{vendorId}/status`
- `/admin/stores`
- `/admin/stores/{storeId}`
- `/admin/stores/{storeId}/status`
- `/admin/stores/{storeId}/orders`
- `/admin/stores/{storeId}/inventory`
- `/admin/stores/{storeId}/audit`

## Result

PASS. Module 9 checks passed with the command set above.

Known non-blocking backend test warning: existing Mongoose duplicate index
warnings appeared during customer order regression tests.
