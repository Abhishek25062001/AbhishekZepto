# Catalog Architecture

## Catalog Architecture Goal

Phase 3 Catalog Architecture defines the global catalog master-data layer for the
Zepto-like platform. It follows Phase 2 Integration & Review and precedes all
catalog backend implementation modules.

This document is architecture-only. It does not implement backend catalog logic,
frontend catalog screens, route mounting, database models, or seed scripts.

Prerequisites:

- Phase 1 foundation (monorepo, backend shell, database conventions).
- Phase 2 complete for static/code/docs verification (OTP auth, RBAC, tenant scope,
  sessions, access-control tests). See `docs/handoffs/phase-2-integration-review-complete.md`.

Phase 3 integration closeout (modules 1–17): `docs/handoffs/phase-3-integration-review-complete.md`,
`docs/architecture/phase-3-integration-scope.md`.

## Catalog Entities

Global catalog entities planned for Phase 3:

| Entity | Collection (planned) | Notes |
|--------|----------------------|-------|
| Category | `categories` | Root and subcategory hierarchy (max level 2) |
| Brand | `brands` | Global brand master |
| Product | `products` | Global product master with approval workflow |
| Product variant | `product_variants` | SKU-level sellable unit |
| Product image | embedded / `products.imageUrls` | Gallery on product; dedicated `product_images` deferred unless needed |
| Product attribute | `products.attributeSummary` | Embedded summary; full `product_attributes` collection deferred |
| Product unit | `product_units` | Unit of measure reference |
| Tax category | `tax_categories` | GST/tax placeholder for Phase 3 |

Store-specific pricing, visibility, and stock are **not** catalog entities. They
belong to later Phase 3 modules (`stores`, `store_products`, `inventory_*`).

## Catalog Ownership Rule

Catalog is **global/platform-level**:

- Admin Dashboard owns create/update/delete/approve of master catalog records.
- Vendor Panel reads approved catalog; store-scoped price/stock changes must not
  mutate global product master data in Phase 3.
- Customer App reads approved, visible catalog; availability joins store layer later.

## Catalog Surfaces

| Surface | Role |
|---------|------|
| Admin Dashboard | Full catalog CRUD, approval, media upload |
| Vendor Panel | Read-only global catalog (approved records) |
| Customer App | Read-only browse/search (approved, visible records) |
| Backend APIs | Versioned routes under `/api/v1/{admin\|vendor\|customer}/catalog/*` |

Delivery Agent App is out of scope for catalog browsing in Phase 3 catalog modules.

## Phase Scope

In scope for Catalog Architecture module:

- Domain architecture and backend file-structure plan
- Database schema documentation for catalog collections
- Admin, vendor, and customer API contracts (planned)
- Validation, permissions, media, search, indexes, audit, error codes (documented)
- Shared type plan, route mount plan, seed plan (documented only)

Out of scope for this module:

- Mongoose models, repositories, services, controllers, routes
- `packages/shared` catalog `.ts` files
- Store, inventory, media runtime implementation
- Phase 4 cart/checkout/order flows

## Related Documents

- `docs/architecture/catalog-backend-file-structure.md` (planned backend layout; no code in this module)
- `docs/architecture/catalog-media-architecture.md`
- `docs/architecture/catalog-search-filter-architecture.md`
- `docs/architecture/catalog-shared-contracts.md`
- `docs/database/catalog-*-schema.md`
- `docs/contracts/catalog-*-api-contract.md`

## API Endpoints

No API endpoints are implemented in this document. Planned route families are
documented in:

- `docs/contracts/catalog-admin-api-contract.md`
- `docs/contracts/catalog-vendor-api-contract.md`
- `docs/contracts/catalog-customer-api-contract.md`
- `docs/contracts/catalog-route-mounting-plan.md`

## DB Fields

No database fields are created in this document. Collection field definitions live in:

- `docs/database/catalog-category-schema.md`
- `docs/database/catalog-brand-schema.md`
- `docs/database/catalog-product-schema.md`
- `docs/database/catalog-product-variant-schema.md`
- `docs/database/catalog-unit-tax-schema.md`
