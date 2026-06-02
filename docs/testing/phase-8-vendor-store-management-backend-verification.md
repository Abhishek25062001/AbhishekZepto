# Phase 8 Module 6 - Vendor & Store Management Backend Verification

## Scope

This verification covers only Phase 8 Module 6 backend vendor and store
management. It validates admin REST routes, validators, permission gates,
OpenAPI registration, city-scope boundaries, status audit hooks, and regression
coverage for existing customer order flows.

## Commands

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `node --test backend/api/dist/modules/vendor-store-management/routes/admin-vendor-store.routes.test.js`
- OpenAPI JSON verification for all Module 6 admin vendor/store paths.

## OpenAPI Paths Verified

- `GET /admin/vendors`
- `GET /admin/vendors/{vendorId}`
- `PATCH /admin/vendors/{vendorId}/status`
- `GET /admin/stores`
- `GET /admin/stores/{storeId}`
- `PATCH /admin/stores/{storeId}/status`
- `GET /admin/stores/{storeId}/orders`
- `GET /admin/stores/{storeId}/inventory`
- `GET /admin/stores/{storeId}/audit`

## Result

Module 6 verification passes. Existing customer order tests may emit the known
duplicate Mongoose index warning for `{"isDeleted":1}`; the warning predates
Module 6 and does not fail the suite.
