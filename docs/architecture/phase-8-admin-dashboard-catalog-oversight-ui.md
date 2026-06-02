# Phase 8 Admin Dashboard Catalog Oversight UI

Status: **IMPLEMENTED** — Module 11 complete.

## Purpose

Module 11 owns the Admin Dashboard screens for catalog oversight. It is a UI
module over the existing Phase 3 Admin Catalog APIs and the Phase 8 Module 10
catalog oversight boundary.

## UI Ownership

The Admin Dashboard catalog UI provides operational oversight for:

- categories
- brands
- product units
- products
- product approval state
- product variants

## Boundaries

In scope:

- Admin Dashboard routes under `/catalog/*`.
- Permission-gated catalog actions using `catalog:*` permissions.
- Loading, empty, error, list, detail, form, approval, and delete states.
- Source-level tests that verify UI route and endpoint boundaries.

Out of scope:

- New backend routes.
- New database fields or collections.
- Store-specific pricing, stock, or inventory mutation UI.
- Vendor Panel catalog mutation UI.
- Customer App catalog UI.
- Media storage rewrites.
- Promotions, analytics, exports, refunds, support, and settings workflows.

## Permission Model

| UI action | Permission |
|-----------|------------|
| Catalog route access and read views | `catalog:read` |
| Create forms and buttons | `catalog:create` |
| Edit forms and buttons | `catalog:update` |
| Delete buttons and confirmations | `catalog:delete` |
| Product approval dialog | `catalog:approve` |

## API Surface

Module 11 consumes existing Admin Catalog endpoints documented in
`docs/contracts/catalog-admin-api-contract.md`. It does not add backend API
surface.

## Database

Module 11 does not add database fields. It reads and mutates existing catalog
records through existing backend endpoints only.
