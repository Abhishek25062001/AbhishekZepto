# Phase 8 Admin Catalog Oversight UI Contract

Status: **IMPLEMENTED** — Module 10 complete.

## Scope

This contract covers the Admin Dashboard catalog oversight screens that consume
existing admin catalog APIs. It does not define new backend endpoints.

## Routes

| Admin Dashboard route | Purpose | Permission |
|-----------------------|---------|------------|
| `/catalog/categories` | Category list and actions | `catalog:read` |
| `/catalog/categories/new` | Category create form | `catalog:create` |
| `/catalog/categories/:categoryId/edit` | Category edit form | `catalog:update` |
| `/catalog/brands` | Brand list and actions | `catalog:read` |
| `/catalog/brands/new` | Brand create form | `catalog:create` |
| `/catalog/brands/:brandId/edit` | Brand edit form | `catalog:update` |
| `/catalog/units` | Product unit list and actions | `catalog:read` |
| `/catalog/units/new` | Product unit create form | `catalog:create` |
| `/catalog/units/:unitId/edit` | Product unit edit form | `catalog:update` |
| `/catalog/products` | Product list, filters, actions | `catalog:read` |
| `/catalog/products/new` | Product create form | `catalog:create` |
| `/catalog/products/:productId` | Product detail and approval action | `catalog:read` |
| `/catalog/products/:productId/edit` | Product edit form | `catalog:update` |
| `/catalog/products/:productId/variants` | Product variant oversight | `catalog:read` |

## API Consumers

### Categories

- `GET /api/v1/admin/catalog/categories`
- `GET /api/v1/admin/catalog/categories/:categoryId`
- `POST /api/v1/admin/catalog/categories`
- `PATCH /api/v1/admin/catalog/categories/:categoryId`
- `DELETE /api/v1/admin/catalog/categories/:categoryId`

### Brands

- `GET /api/v1/admin/catalog/brands`
- `GET /api/v1/admin/catalog/brands/:brandId`
- `POST /api/v1/admin/catalog/brands`
- `PATCH /api/v1/admin/catalog/brands/:brandId`
- `DELETE /api/v1/admin/catalog/brands/:brandId`

### Product units

- `GET /api/v1/admin/catalog/units`
- `GET /api/v1/admin/catalog/units/:unitId`
- `POST /api/v1/admin/catalog/units`
- `PATCH /api/v1/admin/catalog/units/:unitId`
- `DELETE /api/v1/admin/catalog/units/:unitId`

### Products

- `GET /api/v1/admin/catalog/products`
- `GET /api/v1/admin/catalog/products/:productId`
- `POST /api/v1/admin/catalog/products`
- `PATCH /api/v1/admin/catalog/products/:productId`
- `DELETE /api/v1/admin/catalog/products/:productId`
- `PATCH /api/v1/admin/catalog/products/:productId/approval-status`

### Product variants

- `GET /api/v1/admin/catalog/products/:productId/variants`
- `POST /api/v1/admin/catalog/products/:productId/variants`
- `PATCH /api/v1/admin/catalog/products/:productId/variants/:variantId`
- `DELETE /api/v1/admin/catalog/products/:productId/variants/:variantId`

## Exclusions

The UI must not introduce store inventory mutations, store product pricing
mutations, Vendor Panel catalog mutations, Customer App catalog changes, or new
media storage APIs.
