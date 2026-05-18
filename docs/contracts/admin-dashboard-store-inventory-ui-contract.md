# Admin Dashboard Store & Inventory UI Contract

Status: **IMPLEMENTED**

## API consumers

### Locations

- `GET|POST /api/v1/admin/locations/cities`, `GET|PATCH|DELETE .../:cityId`
- `GET|POST /api/v1/admin/locations/service-areas`, `GET|PATCH|DELETE .../:serviceAreaId`

### Stores

- `GET|POST /api/v1/admin/stores`, `GET|PATCH|DELETE .../:storeId`

### Store products

- `GET|POST /api/v1/admin/store-products`, `GET|PATCH|DELETE .../:storeProductId`
- `POST /api/v1/admin/store-products/bulk-map`
- `PATCH /api/v1/admin/store-products/bulk-price`
- `PATCH /api/v1/admin/store-products/bulk-visibility`

### Inventory stocks

- `GET|POST /api/v1/admin/inventory/stocks`, `GET|PATCH|DELETE .../:inventoryStockId`
- `POST .../:inventoryStockId/adjust`
- `POST /api/v1/admin/inventory/stocks/bulk-upload`
- `PATCH /api/v1/admin/inventory/stocks/bulk-thresholds`

### Movements & locks

- `GET /api/v1/admin/inventory/movements`, `GET .../:movementId`
- `GET /api/v1/admin/inventory/locks`, `GET .../:lockId`, `POST /expire-due`

### Catalog (dropdowns only)

- `GET /api/v1/admin/catalog/products`
- `GET /api/v1/admin/catalog/products/:productId/variants`

## Bulk UI

Bulk store-product and inventory operations are modals on list pages (not separate routes). Payloads are JSON arrays submitted from textarea forms.

## Response shape

Follow `docs/standards/backend-response-format.md`.
