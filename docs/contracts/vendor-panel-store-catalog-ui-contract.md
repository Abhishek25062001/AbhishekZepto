# Vendor Panel Store Catalog UI Contract

Status: **IMPLEMENTED**

## Consumer endpoints (15)

### Catalog (read-only)

| Method | Path |
|--------|------|
| GET | `/api/v1/vendor/catalog/categories` |
| GET | `/api/v1/vendor/catalog/brands` |
| GET | `/api/v1/vendor/catalog/products` |
| GET | `/api/v1/vendor/catalog/products/:productId` |
| GET | `/api/v1/vendor/catalog/products/:productId/variants` |

### Store products

| Method | Path |
|--------|------|
| GET | `/api/v1/vendor/store-products` |
| GET | `/api/v1/vendor/store-products/:storeProductId` |
| PATCH | `/api/v1/vendor/store-products/:storeProductId/availability` |
| PATCH | `/api/v1/vendor/store-products/:storeProductId/price` |

### Inventory

| Method | Path |
|--------|------|
| GET | `/api/v1/vendor/inventory/stocks` |
| GET | `/api/v1/vendor/inventory/stocks/:inventoryStockId` |
| POST | `/api/v1/vendor/inventory/stocks/:inventoryStockId/adjust` |
| GET | `/api/v1/vendor/inventory/movements` |

## UI modules

| Module | Path prefix |
|--------|-------------|
| `store-catalog` | `/store-catalog`, `/store-products` |
| `store-inventory` | `/inventory` |

## Response shape

All clients unwrap `{ success, data, meta }` via `apiClient` helpers.

## Field display/update rules

- **Catalog:** display `products.*`, `product_variants.*`; no mutations.
- **Store products:** display `store_products.*`; update `isAvailable`, `isVisible`, `status`, `mrp`, `sellingPrice`, `discountType`, `discountValue` when not `isPriceLocked`.
- **Inventory:** display `inventory_stocks.*`, `inventory_movements.*`; adjust via vendor movement types only.

## Error codes

Mapped in module error-message utilities. See store-product, catalog, and inventory foundation error docs.
