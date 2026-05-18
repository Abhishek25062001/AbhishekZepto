# Admin Dashboard — Store & Inventory Foundation

Status: **IMPLEMENTED**

## Objective

Admin Dashboard UI for locations (cities, service areas), stores, store-product mapping, inventory stock, movements, and locks.

## Prerequisites

- Phase 2 Admin Dashboard authentication and RBAC.
- Store foundation, store-product mapping, inventory foundation, and inventory locking backend APIs.
- Admin Dashboard Catalog Foundation (product/variant dropdowns for store-product forms).

## Routes (21 screens)

| Path | Screen |
|------|--------|
| `/locations/cities` | City list |
| `/locations/cities/new` | Create city |
| `/locations/cities/:cityId/edit` | Edit city |
| `/locations/service-areas` | Service area list |
| `/locations/service-areas/new` | Create service area |
| `/locations/service-areas/:serviceAreaId/edit` | Edit service area |
| `/stores` | Store list |
| `/stores/new` | Create store |
| `/stores/:storeId` | Store detail |
| `/stores/:storeId/edit` | Edit store |
| `/store-products` | Store product list (bulk modals) |
| `/store-products/new` | Map store product |
| `/store-products/:storeProductId/edit` | Edit mapping |
| `/inventory/stocks` | Stock list (adjust/bulk modals) |
| `/inventory/stocks/new` | Create stock |
| `/inventory/stocks/:inventoryStockId` | Stock detail |
| `/inventory/stocks/:inventoryStockId/edit` | Edit stock |
| `/inventory/movements` | Movement list |
| `/inventory/movements/:movementId` | Movement detail |
| `/inventory/locks` | Lock list (expire-due) |
| `/inventory/locks/:lockId` | Lock detail |

## Permissions

| Area | Permissions |
|------|-------------|
| Locations | `locations:read`, `locations:create`, `locations:update`, `locations:delete` |
| Stores | `stores:read`, `stores:create`, `stores:update`, `stores:delete` |
| Store products | `store_products:read`, `store_products:create`, `store_products:update`, `store_products:delete`, `store_products:bulk_update` |
| Inventory | `inventory:read`, `inventory:create`, `inventory:update`, `inventory:delete`, `inventory:adjust`, `inventory:bulk_update` |

Expire-due locks uses `inventory:adjust`.

## Module layout

```text
apps/admin-dashboard/src/modules/stores/
apps/admin-dashboard/src/modules/inventory/
apps/admin-dashboard/src/routes/store.routes.tsx
apps/admin-dashboard/src/routes/inventory.routes.tsx
```

## Deferred

- Vendor Panel store catalog UI (module 13).
- Customer App catalog availability UI (module 14).
- Internal lock create/release/confirm UI.
