# Tenant Validation

Ticket 6 adds dedicated validator primitives for tenant scope identifiers
without adding runtime endpoints.

## Source file

- `backend/api/src/validators/tenant.validators.ts`

## Available validators

- `vendorIdParamValidator`
- `storeIdParamValidator`
- `cityIdParamValidator`
- `customerIdParamValidator`
- `deliveryAgentIdParamValidator`
- `vendorStoreScopeParamValidator`
- `tenantScopeQueryValidator`

## Validation rules

- Scope IDs use the existing shared backend Mongo ObjectId validation pattern.
- Query validators trim string input and treat blank values as absent.
- Validators remain helper-only until mounted by later ticketed work.

## Needs Verification

- Exact source-document endpoint-to-validator wiring remains deferred until the
  internal tenant-access APIs are added in Ticket 7.
