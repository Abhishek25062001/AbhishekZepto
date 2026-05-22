# Customer App Catalog UI Contract

Status: **IMPLEMENTED**

## Consumer endpoints (7)

| Method | Path |
|--------|------|
| GET | `/api/v1/customer/catalog/categories` |
| GET | `/api/v1/customer/catalog/brands` |
| GET | `/api/v1/customer/catalog/products` |
| GET | `/api/v1/customer/catalog/products/:productId` |
| GET | `/api/v1/customer/catalog/products/:productId/variants` |
| GET | `/api/v1/customer/catalog/search` |
| GET | `/api/v1/customer/catalog/featured-products` |

## Query parameters (list/search/featured)

| Parameter | Usage |
|-----------|--------|
| `page`, `limit` | Pagination |
| `search` | Text search (search endpoint; optional on products) |
| `categoryId`, `subcategoryId`, `brandId` | Filters |
| `foodType` | `veg`, `non_veg`, `egg`, `not_applicable` |
| `availability` | `available`, `out_of_stock`, `all` |
| `isFeatured` | Featured listing |
| `sortBy`, `sortOrder` | Sort (see constants) |
| `cityId` | Optional; from location context (fallback auth) |
| `storeId` | Optional; from `useLocationContext` when store selected — required for accurate store stock |
| `isAvailable` | Client maps filter `availability: available` only (backend has no `isOutOfStock` query param) |

## Browsing improvements (Module 13)

### Pagination

| Screen | Endpoint | Behavior |
|--------|----------|----------|
| `CategoryProductsScreen` | `GET .../products` | Infinite scroll; default `limit` 20 |
| `BrandProductsScreen` | `GET .../products` | Same |
| `CatalogSearchScreen` | `GET .../search` | Same; reset when debounced `q` changes |

- `hasNextPage`: `pagination.page * pagination.limit < pagination.total` (or equivalent meta).
- `onEndReached` on `ProductGrid` / `FlatList`; guard while `isLoadingMore`.
- Pull-to-refresh and filter/subcategory/search changes reset to `page = 1`.
- Footer: loading indicator + end-of-list message.

### OOS listing cards

| Field | Rule |
|-------|------|
| `isOutOfStock === true` | Badge “Out of stock”, dimmed card, hide quick-add |
| `isAvailable === false` | Badge “Unavailable”, dimmed card, hide quick-add |

### Product detail

- `getAvailabilityState(isAvailable, isOutOfStock)` → `AvailabilityBadge`.
- Low stock: `availableQuantity != null && availableQuantity > 0 && availableQuantity <= 5` → “Only {n} left”.
- Add to cart disabled when OOS or unavailable.

### Availability filter

UI filter `out_of_stock` does not map to a server query param in Phase 3/4 backend. Only `available` sends `isAvailable=true`. Do not client-filter paginated pages for `out_of_stock`.

## Response shape

Unwrap `{ success, data, meta }` via `customer-catalog-api.util.ts`.

## Field display rules

### Categories / brands

Display: `name`, `iconUrl`/`logoUrl`, `bannerUrl`, `isFeatured`.

### Products (list cards)

Display: `name`, `defaultImageUrl`, `foodType`, optional `mrp`, `finalPrice`, `isOutOfStock`.

### Product detail

Display: `imageUrls`, `description`, `shortDescription`, variant selector fields, optional store pricing join:

- `mrp`, `sellingPrice`, `finalPrice`, `isAvailable`, `isOutOfStock`, `availableQuantity`

### Variants

Display: `variantName`, `unit`, `unitValue`, `mrp`, `isDefault`.

## Error codes (UI mapping)

| Code | User message pattern |
|------|----------------------|
| `PRODUCT_NOT_FOUND` | Product not found |
| `PRODUCT_NOT_APPROVED` | Product unavailable |
| `PRODUCT_NOT_VISIBLE` | Product unavailable |
| `CATEGORY_NOT_FOUND` | Category not found |
| `BRAND_NOT_FOUND` | Brand not found |
| `VARIANT_NOT_FOUND` | Variant not found |
| (default) | Something went wrong. Please try again. |

## Module layout

`apps/customer-app/src/modules/catalog/` — `api`, `components`, `hooks`, `screens`, `types`, `utils`, `constants`, `store`, `navigation`.

## Pending backend

Customer catalog routes **PLANNED** — live browse requires backend mount per `docs/contracts/catalog-customer-api-contract.md`.
