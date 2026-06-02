# Phase 8 Module 6 — Vendor & Store Management API

## Status

Module 6 implemented.

## Endpoints

- `GET /api/v1/admin/vendors`
- `GET /api/v1/admin/vendors/:vendorId`
- `GET /api/v1/admin/stores`
- `GET /api/v1/admin/stores/:storeId`
- `PATCH /api/v1/admin/vendors/:vendorId/status`
- `PATCH /api/v1/admin/stores/:storeId/status`
- `GET /api/v1/admin/stores/:storeId/orders`
- `GET /api/v1/admin/stores/:storeId/inventory`
- `GET /api/v1/admin/stores/:storeId/audit`

## List Filters

`GET /api/v1/admin/vendors` supports:

| Query | Type | Notes |
| --- | --- | --- |
| `status` | auth account status | Maps to existing `user_identities.accountStatus`. |
| `cityId` | ObjectId | Filters vendor-scoped identities by city. |
| `search` | string, 1-120 chars | Literal case-insensitive match against name, phone, or email. |
| `page` | integer | Defaults to `1`. |
| `limit` | integer | Defaults to `20`, maximum `100`. |

`GET /api/v1/admin/stores` supports:

| Query | Type | Notes |
| --- | --- | --- |
| `status` | store status | Maps to existing `stores.status`. |
| `vendorId` | ObjectId | Filters by vendor tenant id. |
| `cityId` | ObjectId | Filters by city. |
| `search` | string, 1-120 chars | Literal case-insensitive match against name, slug, code, phone, or email. |
| `page` | integer | Defaults to `1`. |
| `limit` | integer | Defaults to `20`, maximum `100`. |

## Response Shape

Vendor responses are derived from existing `user_identities` vendor/store roles
grouped by `vendorId`. Store responses are derived from existing `stores`
records. The response does not expose soft-delete internals.

## Permission Gates

- Vendor list/detail require `stores:read` or `settings:manage`.
- Vendor status updates require `stores:update` or `settings:manage`.
- Store list/detail/orders/inventory require `stores:read` or `settings:manage`.
- Store status updates require `stores:update` or `settings:manage`.
- Store audit inspection requires `stores:read` or `settings:manage`.

## Error And Scope Contract

Admin requests with a scoped `cityId` may only inspect or manage vendors and
stores in that city. Cross-city list filters and cross-city vendor/store ids
return `INVALID_ADMIN_SCOPE` with HTTP `403`. Missing vendors return
`NOT_FOUND`; missing or deleted stores return `STORE_NOT_FOUND`.

## Status Writes

`PATCH /api/v1/admin/vendors/:vendorId/status` updates existing
`user_identities.accountStatus` for vendor-scoped identities under the vendor
tenant id and requires `reason`. Destructive `deleted` status is intentionally
not accepted by this operational control. Successful writes create an admin
audit record with action type `VENDOR_STATUS_CHANGED`, `entityType` `vendor`,
and the vendor id as `entityId`.

`PATCH /api/v1/admin/stores/:storeId/status` updates only existing
`stores.status` and requires `reason`. It does not mutate catalog, inventory,
orders, payouts, settlements, `isOpen`, or `isAcceptingOrders`. Successful
writes create an admin audit record with action type `STORE_STATUS_CHANGED`,
`entityType` `store`, and the store id as `entityId`.

## Read-Only Store Inspection

`GET /api/v1/admin/stores/:storeId/orders` returns existing order summaries for
the store. `GET /api/v1/admin/stores/:storeId/inventory` returns existing
inventory stock summaries for the store. `GET /api/v1/admin/stores/:storeId/audit`
returns existing admin audit records where `entityType` is `store` and
`entityId` is the store id.

All three inspection endpoints validate the store exists first, support
`page` and `limit`, and do not mutate order, inventory, catalog, or audit
state.

## Boundaries

Module 6 does not add Vendor Panel UI, Admin Dashboard frontend UI, catalog CRUD
rewrites, inventory mutations, order workflow actions, payouts, settlements,
analytics, exports, or support-ticket workflows.
