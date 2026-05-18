# Vendor Panel — Store Catalog Foundation

Status: **IMPLEMENTED** (Vendor Panel UI)

## Scope

Vendor-facing read-only global catalog browse, store-product price/availability updates, and inventory stock management within vendor/store tenant scope.

## Route map (12 screens)

| Area | Path | Screen |
|------|------|--------|
| Store catalog | `/store-catalog/products` | Product list (read-only) |
| Store catalog | `/store-catalog/products/:productId` | Product detail (read-only) |
| Store products | `/store-products` | Store product list |
| Store products | `/store-products/:storeProductId` | Store product detail |
| Store products | `/store-products/:storeProductId/price` | Price update |
| Store products | `/store-products/:storeProductId/availability` | Availability update |
| Inventory | `/inventory/stocks` | Stock list |
| Inventory | `/inventory/stocks/:inventoryStockId` | Stock detail |
| Inventory | `/inventory/stocks/:inventoryStockId/adjust` | Stock adjustment |
| Inventory | `/inventory/movements` | Movement list |

Legacy `/products` redirects to `/store-catalog/products`.

## Permissions

| Permission | Usage |
|------------|--------|
| `catalog:read` | Vendor catalog browse (categories, brands, products, variants) |
| `store_products:read` | List/detail store products |
| `store_products:update` | PATCH availability and price |
| `inventory:read` | Stock list/detail, movements list |
| `inventory:update` | POST stock adjust |

## Tenant scope

Vendor APIs must return only records scoped to the authenticated vendor/store context. UI must not expose cross-vendor identifiers or actions.

## API wiring

See `docs/contracts/vendor-panel-store-catalog-ui-contract.md`.

## Out of scope

- Customer App catalog UI (module 14)
- Admin Dashboard changes
- Global catalog mutations (create/update/delete products)
- Admin bulk store-product or inventory operations
- Inventory lock admin UI
- Media upload UI

## Pending backend

Vendor catalog read routes are **PLANNED** per `docs/contracts/catalog-vendor-api-contract.md`. UI is wired to documented paths; live catalog browse requires backend mount.

## Related

- `docs/handoffs/vendor-panel-store-catalog-foundation-complete.md`
- `docs/testing/vendor-panel-store-catalog-verification.md`
