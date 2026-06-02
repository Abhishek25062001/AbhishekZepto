# Phase 8 Module 6 — Vendor & Store Management Backend

## Status

Module 6 implemented.

## Objective

Vendor & Store Management Backend provides the Admin Dashboard backend surface
for inspecting and operationally managing vendor identities and stores.

## Scope Boundary

Module 6 owns backend admin vendor/store management only. It may add backend
routes, controllers, services, repositories, validators, OpenAPI paths, tests,
and documentation related to admin-facing vendor and store management.

Module 6 does not implement Vendor Panel UI, Admin Dashboard frontend UI,
catalog CRUD rewrites, inventory operations, order workflows, payouts,
settlements, analytics, exports, or support-ticket workflows.

## Dependencies

- Phase 2 auth identity, RBAC, and tenant/store scope foundations.
- Phase 3 store foundation backend.
- Phase 3 store product and inventory foundations for downstream read-only
  operational inspection.
- Phase 5 order lifecycle backend for downstream store order inspection.
- Phase 8 Module 2 Admin Control audit and route patterns.
- Phase 8 Module 3 Admin User Management backend patterns.
- Phase 8 Module 4 Customer Management backend permission/error/audit patterns.
- Phase 8 Module 5 Delivery Agent Management backend permission/error/audit
  patterns.

## Runtime Ownership

Existing `stores` records remain the source of truth for store identity,
location, operating configuration, open/accepting-orders flags, and store
status.

Existing `user_identities` records with vendor/store roles and `vendorId` /
`storeId` scope remain the source of truth for vendor-facing user identity and
tenant scope. Module 6 does not introduce a new vendor master collection.

Vendor Panel remains the owner for store-staff workflows such as order
acceptance, picking, packing, ready-for-pickup, store catalog operations, and
inventory operations.

## Planned Admin Read Model

Module 6 may expose existing store fields for admin inspection:

- `storeId`
- `vendorId`
- `cityId`
- `serviceAreaIds`
- `name`
- `slug`
- `code`
- `description`
- `phone`
- `email`
- `addressLine1`
- `addressLine2`
- `landmark`
- `pincode`
- `latitude`
- `longitude`
- `serviceRadiusKm`
- `openingTime`
- `closingTime`
- `operatingDays`
- `isOpen`
- `isAcceptingOrders`
- `temporaryClosureReason`
- `storeType`
- `fulfillmentType`
- `status`
- `createdAt`
- `updatedAt`

Module 6 may expose vendor identity/scope summaries from existing
`user_identities` vendor roles:

- `vendorUserId`
- `vendorId`
- `storeId`
- `cityId`
- `name`
- `phone`
- `email`
- `role`
- `accountStatus`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

The field contract is documented in
`docs/database/phase-8-vendor-store-management-schema.md`.

## Implemented API Endpoints

- `GET /api/v1/admin/vendors`
- `GET /api/v1/admin/vendors/:vendorId`
- `GET /api/v1/admin/stores`
- `GET /api/v1/admin/stores/:storeId`
- `PATCH /api/v1/admin/vendors/:vendorId/status`
- `PATCH /api/v1/admin/stores/:storeId/status`
- `GET /api/v1/admin/stores/:storeId/orders`
- `GET /api/v1/admin/stores/:storeId/inventory`
- `GET /api/v1/admin/stores/:storeId/audit`

These endpoints are read-only and expose existing vendor identity/scope and
store fields for admin inspection.

The vendor list endpoint supports status, city, literal search, page, and limit
filters. The store list endpoint supports status, vendor, city, literal search,
page, and limit filters. Search is intentionally limited to existing identity,
contact, and store identification fields.

Status controls are reason-captured and write only existing status fields:
`user_identities.accountStatus` for vendor-scoped identities and `stores.status`
for stores. Module 6 status controls do not mutate catalog, inventory, orders,
payouts, settlements, store open flags, or store accepting-orders flags.

Store operational inspection endpoints read existing orders, inventory stocks,
and admin audit records after verifying the store exists. They are GET-only and
do not mutate order, inventory, catalog, or audit state.

## Audit Integration

Vendor status changes write `AdminActionAudit` records with action type
`VENDOR_STATUS_CHANGED`, `entityType` `vendor`, reason, request metadata, and
before/after vendor summaries.

Store status changes write `AdminActionAudit` records with action type
`STORE_STATUS_CHANGED`, `entityType` `store`, reason, request metadata, and
before/after store summaries.

Audit write failures use the existing admin audit helper behavior and do not
block the status mutation response.

## Permission Model

Module 6 route-level permissions use existing store administration permissions:
read surfaces use `stores:read`, status updates use `stores:update`, and each
group allows `settings:manage` as the super-admin operations override.

## Validation And Scope

All Module 6 endpoints validate ObjectId params and bounded pagination. When
the authenticated admin context includes `cityId`, the service layer constrains
list filters and per-vendor/store operations to that city and returns
`INVALID_ADMIN_SCOPE` for cross-city access.
