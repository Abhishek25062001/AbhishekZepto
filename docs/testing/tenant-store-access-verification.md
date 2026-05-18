# Tenant & Store Access Verification

## Purpose

This checklist verifies the Phase 2 Tenant & Store Access Control module
against the internal auth scope verification routes, the temporary internal
tenant-access record routes, and the current Vendor Panel/Admin Dashboard
protected entry points.

## Seed Baseline

Use the seeded auth identities from the auth module:

- `7777777777` -> `vendor_owner` with `vendorId`, `storeId`, `cityId`
- `8888888888` -> `delivery_agent` with `cityId`
- `9999999999` -> `customer`
- `6666666666` -> `super_admin` with no vendor/store/city scope

Seeded internal test records now also exist for:

- `seeded-vendor-store-customer-record`
- `seeded-vendor-store-delivery-record`

## Vendor Scope Allow

1. Log in as the seeded `vendor_owner`.
2. Call:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-vendor-scope?vendorId=65f0a0000000000000000001" \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Expected result:

- HTTP `200`
- response message `Vendor scope test route working`
- response includes the authenticated `user` scope values

## Vendor Scope Deny

Call the same route with the wrong vendor id:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-vendor-scope?vendorId=65f0a0000000000000009999" \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Expected result:

- HTTP `403`
- error code `VENDOR_SCOPE_MISMATCH`
- audit event `security.scope_access_denied`

## Store Scope Allow

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-store-scope?storeId=65f0a0000000000000000002" \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Expected result:

- HTTP `200`
- response message `Store scope test route working`

## City Scope Allow

Vendor allow:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-city-scope?cityId=65f0a0000000000000000003" \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Delivery allow:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-city-scope?cityId=65f0a0000000000000000003" \
  -H "Authorization: Bearer REPLACE_DELIVERY_ACCESS_TOKEN"
```

Expected result for both:

- HTTP `200`
- response message `City scope test route working`

## Missing Scope Deny

Use the seeded `super_admin` token against a store-scoped route:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-store-scope" \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN"
```

Expected result:

- HTTP `403`
- error code `STORE_SCOPE_REQUIRED`

## Audit Log Expectations

For scope deny cases verify:

- missing scope deny event: `security.tenant_access_denied`
- scope mismatch event: `security.tenant_scope_mismatch`
- supported admin override event: `security.tenant_admin_override_used`
- `metadata.scopeKind` is present
- `metadata.reason` is one of:
  - `missing_scope`
  - `scope_mismatch`
  - `access_denied`
  - `admin_override`
- `metadata.field` records the checked scope field
- `metadata.requestedScope` and `metadata.allowedScope` are present

## Internal Tenant Access Record Create

Use the seeded `super_admin` token:

```bash
curl -X POST "http://localhost:5000/api/v1/internal/tenant-access/test-records" \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "65f0a0000000000000000001",
    "storeId": "65f0a0000000000000000002",
    "cityId": "65f0a0000000000000000003",
    "label": "manual-internal-test-record"
  }'
```

Expected result:

- HTTP `201`
- response message `Internal tenant access test record created`

## Internal Vendor/Store Record Lookup

Use the seeded `vendor_owner` token:

```bash
curl "http://localhost:5000/api/v1/internal/tenant-access/vendor/65f0a0000000000000000001/store/65f0a0000000000000000002/test-records" \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Expected result:

- HTTP `200`
- response message `Internal tenant access vendor/store records loaded`
- seeded vendor/store records are returned

## Internal Customer Record Lookup

Use the seeded `customer` token and that user’s id:

```bash
curl "http://localhost:5000/api/v1/internal/tenant-access/customer/REPLACE_CUSTOMER_USER_ID/test-records" \
  -H "Authorization: Bearer REPLACE_CUSTOMER_ACCESS_TOKEN"
```

Expected result:

- HTTP `200`
- response message `Internal tenant access customer records loaded`

Admin override check:

- use a current admin role token with `users:read`
- expect HTTP `200`
- expect audit event `security.tenant_admin_override_used`

## Internal Delivery-Agent Record Lookup

Use the seeded `delivery_agent` token and that user’s id:

```bash
curl "http://localhost:5000/api/v1/internal/tenant-access/delivery-agent/REPLACE_DELIVERY_AGENT_USER_ID/test-records" \
  -H "Authorization: Bearer REPLACE_DELIVERY_ACCESS_TOKEN"
```

Expected result:

- HTTP `200`
- response message `Internal tenant access delivery-agent records loaded`

Admin override check:

- use a current admin role token with `users:read`
- expect HTTP `200`
- expect audit event `security.tenant_admin_override_used`

## Soft Delete Expectation

Internal lookup routes should exclude soft-deleted records from responses.
This is now covered by backend repository tests.

## Needs Verification

- whether source-expected vendor/store/city admin override behavior should
  bypass the current scope middleware for internal tenant test routes

## Vendor Panel Protected Entry

Manual check:

- a vendor session missing `vendorId` or `storeId` should be cleared and sent to
  `/login`
- a non-vendor role should not be allowed into protected vendor routes

## Admin Dashboard Protected Entry

Manual check:

- only `support_admin`, `operations_admin`, and `super_admin` should enter
  protected admin routes
- vendor-role sessions should be redirected to `/login`
- admin protected entry should not require vendor/store scope
