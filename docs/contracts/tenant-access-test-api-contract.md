# Tenant Access Test API Contract

## Purpose

These endpoints are internal verification surfaces for Phase 2 tenant and store
scope checks. They are test-only and not part of the production business API.

## Internal base path

`/api/v1/internal/tenant-access`

## Endpoints

### `POST /api/v1/internal/tenant-access/test-records`

Create an internal tenant access test record.

Body:

```json
{
  "vendorId": "65f0a0000000000000000001",
  "storeId": "65f0a0000000000000000002",
  "cityId": "65f0a0000000000000000003",
  "customerId": "68295cf6d5cc8fddf6b8d203",
  "deliveryAgentId": "68295cf6d5cc8fddf6b8d204",
  "label": "manual-internal-test-record"
}
```

Rules:

- `label` is required
- at least one tenant scope field is required
- `vendorId` is required when `storeId` is present

### `GET /api/v1/internal/tenant-access/vendor/:vendorId/store/:storeId/test-records`

Return test records that match the provided vendor and store scope.

### `GET /api/v1/internal/tenant-access/customer/:customerId/test-records`

Return test records for a customer scope.

### `GET /api/v1/internal/tenant-access/delivery-agent/:deliveryAgentId/test-records`

Return test records for a delivery-agent scope.

## Model fields

- `tenant_access_tests.vendorId`
- `tenant_access_tests.storeId`
- `tenant_access_tests.cityId`
- `tenant_access_tests.customerId`
- `tenant_access_tests.deliveryAgentId`
- `tenant_access_tests.label`
- standard base fields:
  - `status`
  - `isDeleted`
  - `deletedAt`
  - `createdAt`
  - `updatedAt`

## Current protection model

- all routes require authentication
- record creation is limited to current admin roles
- vendor/store lookup uses existing vendor/store scope middleware
- customer/delivery-agent lookup uses the current `read_self` or `users:read`
  permission vocabulary

## Needs Verification

- whether internal tenant test routes should support an admin override that
  bypasses vendor/store scope middleware
- whether the source PDF intended a more explicit internal-test permission
  namespace than the current codebase exposes
