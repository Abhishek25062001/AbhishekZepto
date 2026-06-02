# Phase 8 Module 9 - Admin Dashboard Vendor & Store Management UI Contract

## Status

Module 9 implemented.

## Admin Dashboard Routes

- `/vendors`
- `/vendors/:vendorId`
- `/stores`
- `/stores/:storeId`

## Consumed Endpoints

- `GET /api/v1/admin/vendors`
- `GET /api/v1/admin/vendors/:vendorId`
- `PATCH /api/v1/admin/vendors/:vendorId/status`
- `GET /api/v1/admin/stores`
- `GET /api/v1/admin/stores/:storeId`
- `PATCH /api/v1/admin/stores/:storeId/status`
- `GET /api/v1/admin/stores/:storeId/orders`
- `GET /api/v1/admin/stores/:storeId/inventory`
- `GET /api/v1/admin/stores/:storeId/audit`

## List Filters

The Admin Dashboard vendor list may send only these filters to
`GET /api/v1/admin/vendors`:

- `status`
- `cityId`
- `search`
- `page`
- `limit`

The Admin Dashboard store list may send only these filters to
`GET /api/v1/admin/stores`:

- `status`
- `vendorId`
- `cityId`
- `search`
- `page`
- `limit`

## Detail And Inspection

Vendor detail displays existing Module 6 vendor identity and scope read-model
fields only.

Store detail displays existing Module 6 store read-model fields only. Store
orders, inventory, and audit sections are read-only inspection surfaces.

## Mutation Contracts

Vendor status updates submit only `status` and `reason` to the vendor status
endpoint.

Store status updates submit only `status` and `reason` to the store status
endpoint.

## Boundaries

Module 9 is a frontend consumer of existing backend APIs. It must not add API
routes, OpenAPI paths, database fields, backend vendor/store behavior, Vendor
Panel UI, catalog CRUD rewrites, inventory mutations, order workflow actions,
payouts, settlements, analytics, exports, or support-ticket workflows.
