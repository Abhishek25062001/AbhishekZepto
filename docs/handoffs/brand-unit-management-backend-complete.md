# Brand & Unit Management Backend — Complete

Date: 2026-05-18

## Scope delivered

- Admin brand CRUD: `/api/v1/admin/catalog/brands`
- Admin product unit CRUD: `/api/v1/admin/catalog/units`
- Collections: `brands`, `product_units`
- Permissions: existing `catalog:read|create|update|delete`
- Audit: `catalog.brand_*`, `catalog.unit_*`
- Unit tests: `npm run test:brands`, `npm run test:units`

## Not in scope

- Product / Variant modules
- `tax_categories` admin CRUD
- Product delete guard on brands (stub)
- Variant-in-use guard on units (stub)

## Verification

```bash
cd backend/api
npm run typecheck
npm run test:brands
npm run test:units
npm run test:seed-matrix
```
