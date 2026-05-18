# Admin Dashboard — Catalog Foundation

Status: **IMPLEMENTED**

## Objective

Admin Dashboard UI for global catalog master data: categories, brands, product units, and products (including approval workflow and media uploads).

## Prerequisites

- Phase 2 Admin Dashboard authentication and RBAC (`CanAccess`, `ProtectedRoute`).
- Catalog backend APIs mounted at `/api/v1/admin/catalog/*`.
- Media upload APIs at `/api/v1/admin/media/*` (Module 10).

## Routes

| Path | Screen |
|------|--------|
| `/catalog/categories` | Category list |
| `/catalog/categories/new` | Create category |
| `/catalog/categories/:categoryId/edit` | Edit category |
| `/catalog/brands` | Brand list |
| `/catalog/brands/new` | Create brand |
| `/catalog/brands/:brandId/edit` | Edit brand |
| `/catalog/units` | Product unit list |
| `/catalog/units/new` | Create unit |
| `/catalog/units/:unitId/edit` | Edit unit |
| `/catalog/products` | Product list |
| `/catalog/products/new` | Create product |
| `/catalog/products/:productId` | Product detail |
| `/catalog/products/:productId/edit` | Edit product |

Legacy `/products` redirects to `/catalog/products`.

## Permissions

| Action | Permission |
|--------|------------|
| List / detail | `catalog:read` |
| Create | `catalog:create` |
| Update | `catalog:update` |
| Delete | `catalog:delete` |
| Approve / reject product | `catalog:approve` |
| Image upload | `media:upload` |

## Deferred

- Product **variant** management UI (later Phase 3 module).
- Store & Inventory Dashboard UI (module 12).

## Module layout

```text
apps/admin-dashboard/src/modules/catalog/
  api/ components/ forms/ hooks/ pages/ types/ utils/ constants/ routes/
```
