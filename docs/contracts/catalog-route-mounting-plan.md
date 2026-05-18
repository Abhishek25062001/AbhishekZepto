# Catalog Route Mounting Plan

Status: **PARTIAL** — admin CRUD and search/filter routes mounted; vendor/customer browse detail routes partial.

## Admin

| Item | Value |
|------|-------|
| Mount file | `backend/api/src/routes/v1/admin.routes.ts` |
| URL prefix | `/api/v1/admin/catalog` |
| Route modules | `categories/routes/category-admin.routes.ts`, `brands/...`, `products/...`, etc. |

## Vendor

| Item | Value |
|------|-------|
| Mount file | `backend/api/src/routes/v1/vendor.routes.ts` |
| URL prefix | `/api/v1/vendor/catalog` |
| Route modules | `catalog/search/routes/catalog-search-vendor.routes.ts` (products, facets) |

## Customer

| Item | Value |
|------|-------|
| Mount file | `backend/api/src/routes/v1/customer.routes.ts` |
| URL prefix | `/api/v1/customer/catalog` |
| Route modules | `catalog/search/routes/catalog-search-customer.routes.ts` |

## Example Planned Routes

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/admin/catalog/products` | IMPLEMENTED (enhanced search/filters) |
| POST | `/api/v1/admin/catalog/products` | IMPLEMENTED |
| GET | `/api/v1/vendor/catalog/products` | IMPLEMENTED |
| GET | `/api/v1/vendor/catalog/facets` | IMPLEMENTED |
| GET | `/api/v1/customer/catalog/products` | IMPLEMENTED |
| GET | `/api/v1/customer/catalog/search` | IMPLEMENTED |
| GET | `/api/v1/customer/catalog/featured-products` | IMPLEMENTED |
| GET | `/api/v1/customer/catalog/facets` | IMPLEMENTED |

Full inventory: `docs/contracts/catalog-admin-api-contract.md`, vendor and customer contract docs.

## Implementation Rule

Do not mount catalog routers until owning backend module implements controllers and middleware chain (auth + permission + validate).

## DB Fields

None.
