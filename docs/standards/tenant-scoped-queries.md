# Tenant-Scoped Queries

Ticket 6 adds a dedicated helper layer for tenant-scoped query filters without
changing runtime business APIs.

## Source files

- `packages/shared/api/tenant-scope.types.ts`
- `backend/api/src/database/tenant-query-helpers.ts`

## Supported scope fields

- `vendorId`
- `storeId`
- `cityId`
- `customerId`
- `deliveryAgentId`

## Query helper rules

- Trim string scope values before building a filter.
- Collapse blank, missing, and non-string values to no filter.
- Build field-specific filters with:
  - `buildVendorScopeFilter`
  - `buildStoreScopeFilter`
  - `buildCityScopeFilter`
  - `buildCustomerScopeFilter`
  - `buildDeliveryAgentScopeFilter`
- Use `buildTenantScopeFilter` when multiple tenant dimensions may be present.

## Relationship to existing auth scope utilities

- Do not replace the existing auth middleware scope checks.
- Continue using `scope-access.service.ts` and `scope-access.util.ts` for auth
  user scope resolution and scope matching.
- Use `tenant-query-helpers.ts` only when a database query needs the same
  normalized scope fields expressed as query filters.

## Needs Verification

- The source PDF expects a broader temporary tenant-access test surface; that
  surface is intentionally out of scope for Ticket 6 and remains for Ticket 7.
