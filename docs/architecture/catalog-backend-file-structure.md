# Catalog Backend File Structure

## Goal

Document the planned backend catalog module layout for Phase 3 implementation
modules. Category Management Backend and related modules will create code under
this structure; Catalog Architecture does not create runtime files.

## Root Module Path

```text
/backend/api/src/modules/catalog/
```

Current repository state: placeholder `.gitkeep` only. No models or routes exist yet.

## Submodule Convention

Implementation modules use **feature subfolders** (aligned with Category
Management Backend micro-tasks in the source PDF):

```text
/backend/api/src/modules/catalog/
  categories/
    controllers/
    routes/
    services/
    repositories/
    models/
    validators/
    types/
    constants/
    utils/
  brands/
    ...
  units/
    ...
  products/
    ...
  variants/
    ...
```

Shared catalog utilities (query, cross-entity helpers) may live at:

```text
/backend/api/src/modules/catalog/
  query/
  constants/
  utils/
```

## Planned Files (PDF Reference)

The source PDF also lists a flat layout reference. The **canonical plan** for
this repository is feature subfolders above. Equivalent responsibilities:

| PDF flat name | Submodule target |
|---------------|------------------|
| `category.controller.ts` | `categories/controllers/category.controller.ts` |
| `brand.controller.ts` | `brands/controllers/brand.controller.ts` |
| `product.controller.ts` | `products/controllers/product.controller.ts` |
| `product-variant.controller.ts` | `variants/controllers/product-variant.controller.ts` |
| `catalog-media.controller.ts` | Media module (later) or `catalog/media/` |
| `category.service.ts` | `categories/services/category.service.ts` |
| `catalog-query.service.ts` | `catalog/query/catalog-query.service.ts` |
| `category.repository.ts` | `categories/repositories/category.repository.ts` |
| `category.model.ts` | `categories/models/category.model.ts` |
| `category-admin.routes.ts` | `categories/routes/category-admin.routes.ts` |
| `product-vendor.routes.ts` | `products/routes/product-vendor.routes.ts` |
| `product-public.routes.ts` | Customer catalog routes under `products/routes/` |

## Route Mounting (Planned)

Route files are mounted from existing Phase 2 route entrypoints:

- `backend/api/src/routes/v1/admin.routes.ts` → `/api/v1/admin/catalog`
- `backend/api/src/routes/v1/vendor.routes.ts` → `/api/v1/vendor/catalog`
- `backend/api/src/routes/v1/customer.routes.ts` → `/api/v1/customer/catalog`

See `docs/contracts/catalog-route-mounting-plan.md`.

## API Endpoints

No API endpoints are created in this task. Route files listed above are **planned**
only.

## DB Fields

No database fields are created in this task. Model files listed above are **planned**
only.
