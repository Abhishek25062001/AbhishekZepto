# Phase 8 Admin Dashboard Catalog Oversight UI Contract

Status: **IMPLEMENTED** — Module 11 complete.

## Routes

| Route | Purpose | Permission |
|-------|---------|------------|
| `/catalog/categories` | Category list | `catalog:read` |
| `/catalog/categories/new` | Category create | `catalog:create` |
| `/catalog/categories/:categoryId` | Category detail | `catalog:read` |
| `/catalog/categories/:categoryId/edit` | Category edit | `catalog:update` |
| `/catalog/brands` | Brand list | `catalog:read` |
| `/catalog/brands/new` | Brand create | `catalog:create` |
| `/catalog/brands/:brandId` | Brand detail | `catalog:read` |
| `/catalog/brands/:brandId/edit` | Brand edit | `catalog:update` |
| `/catalog/units` | Product unit list | `catalog:read` |
| `/catalog/units/new` | Product unit create | `catalog:create` |
| `/catalog/units/:unitId` | Product unit detail | `catalog:read` |
| `/catalog/units/:unitId/edit` | Product unit edit | `catalog:update` |
| `/catalog/products` | Product list and filters | `catalog:read` |
| `/catalog/products/new` | Product create | `catalog:create` |
| `/catalog/products/:productId` | Product detail and approval entry | `catalog:read` |
| `/catalog/products/:productId/edit` | Product edit | `catalog:update` |
| `/catalog/products/:productId/variants` | Product variant oversight | `catalog:read` |

## Consumed APIs

The UI consumes only existing admin catalog APIs:

- `GET|POST /api/v1/admin/catalog/categories`
- `GET|PATCH|DELETE /api/v1/admin/catalog/categories/:categoryId`
- `GET|POST /api/v1/admin/catalog/brands`
- `GET|PATCH|DELETE /api/v1/admin/catalog/brands/:brandId`
- `GET|POST /api/v1/admin/catalog/units`
- `GET|PATCH|DELETE /api/v1/admin/catalog/units/:unitId`
- `GET|POST /api/v1/admin/catalog/products`
- `GET|PATCH|DELETE /api/v1/admin/catalog/products/:productId`
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`
- `GET|POST /api/v1/admin/catalog/products/:productId/variants`
- `PATCH|DELETE /api/v1/admin/catalog/products/:productId/variants/:variantId`

## Unsupported Workflows

The UI must not call Vendor Catalog, Customer Catalog, Store Product,
Inventory, Promotion, Export, Refund, Support, or Settings APIs.
