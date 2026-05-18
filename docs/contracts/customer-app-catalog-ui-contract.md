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
| `cityId` | Optional; from auth store when set |

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
