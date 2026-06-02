# Phase 8 Admin Catalog Oversight

Status: **IMPLEMENTED** — Module 10 complete.

## Purpose

Phase 8 Admin Catalog Oversight brings the existing Phase 3 admin catalog
backend and Admin Dashboard catalog foundation under the Phase 8 operational
oversight umbrella. It does not create a second catalog domain.

The module is scoped to admin oversight of global catalog master data:

- categories
- brands
- product units
- products
- product variants
- product approval state

## Ownership

Admin Dashboard remains the only admin surface for global catalog create,
update, soft-delete, and product approval workflows. Vendor Panel and Customer
App catalog surfaces remain read-only for their Phase 3 contracts and are out
of scope for this module.

## Boundaries

In scope:

- Use existing `/api/v1/admin/catalog/*` backend routes.
- Use existing catalog permission gates from `docs/security/catalog-permissions.md`.
- Improve Admin Dashboard coverage for catalog oversight and variants.
- Document verification and handoff status for Phase 8 Module 10.

Out of scope:

- New backend catalog entities.
- New database fields.
- Store-specific pricing, visibility, stock, or inventory workflows.
- Vendor Panel catalog mutation workflows.
- Customer App catalog workflows.
- Media storage changes.
- Promotions, analytics, exports, refunds, support tickets, and platform
  settings.

## Permission Model

| Action | Permission |
|--------|------------|
| List/detail catalog records | `catalog:read` |
| Create catalog records | `catalog:create` |
| Update catalog records | `catalog:update` |
| Soft-delete catalog records | `catalog:delete` |
| Update product approval status | `catalog:approve` |

Image upload fields continue to use the canonical media permission and route
documented in `docs/architecture/catalog-media-architecture.md`.

## API Surface

Module 10 consumes existing Admin Catalog routes documented in
`docs/contracts/catalog-admin-api-contract.md` and represented in
`backend/api/src/docs/openapi/catalog.paths.ts`.

No new backend routes are planned for this module.

## Database

Module 10 does not add fields or collections. It reads and mutates the existing
catalog collections through existing backend services:

- `categories`
- `brands`
- `product_units`
- `products`
- `product_variants`

## Review Notes

The module must preserve the catalog ownership rule from
`docs/architecture/catalog-architecture.md`: store-specific pricing,
availability, and stock must not be treated as global catalog master data.
