# Catalog Error Codes

Status: **PARTIAL** — category, brand, unit, product, variant, and catalog search codes implemented; media codes planned.

Apply to catalog read/write endpoints documented in `docs/contracts/catalog-*-api-contract.md`.

## Category

| Code | HTTP (typical) |
|------|----------------|
| `CATEGORY_NOT_FOUND` | 404 |
| `CATEGORY_SLUG_ALREADY_EXISTS` | 409 |
| `CATEGORY_HAS_ACTIVE_PRODUCTS` | 409 |
| `INVALID_PARENT_CATEGORY` | 400 |
| `CATEGORY_HAS_CHILDREN` | 409 (Category Management Backend) |
| `CATEGORY_LEVEL_LIMIT_EXCEEDED` | 400 (Category Management Backend) |

## Brand

| Code | HTTP (typical) |
|------|----------------|
| `BRAND_NOT_FOUND` | 404 |
| `BRAND_SLUG_ALREADY_EXISTS` | 409 |
| `BRAND_HAS_ACTIVE_PRODUCTS` | 409 |

## Product

| Code | HTTP (typical) |
|------|----------------|
| `PRODUCT_NOT_FOUND` | 404 |
| `PRODUCT_SLUG_ALREADY_EXISTS` | 409 |
| `PRODUCT_NOT_APPROVED` | 403 |
| `PRODUCT_NOT_VISIBLE` | 403 |
| `INVALID_PRODUCT_STATUS` | 400 |
| `INVALID_PRODUCT_APPROVAL_STATUS` | 400 |

## Variant

| Code | HTTP (typical) |
|------|----------------|
| `VARIANT_NOT_FOUND` | 404 |
| `SKU_ALREADY_EXISTS` | 409 |
| `BARCODE_ALREADY_EXISTS` | 409 |
| `DEFAULT_VARIANT_REQUIRED` | 400 |
| `INVALID_VARIANT_UNIT` | 400 |

## Media

| Code | HTTP (typical) |
|------|----------------|
| `CATALOG_MEDIA_UPLOAD_FAILED` | 500 |
| `INVALID_CATALOG_MEDIA_TYPE` | 400 |
| `CATALOG_MEDIA_TOO_LARGE` | 413 |
| `CATALOG_MEDIA_NOT_FOUND` | 404 |

## Catalog search

| Code | HTTP (typical) |
|------|----------------|
| `CATALOG_SEARCH_QUERY_TOO_LONG` | 400 |
| `CATALOG_SEARCH_INVALID_SORT` | 400 |
| `CATALOG_SEARCH_INVALID_FILTER` | 400 |
| `CATALOG_SEARCH_PRICE_RANGE_INVALID` | 400 |
| `CATALOG_SEARCH_SCOPE_DENIED` | 403 |
| `CATALOG_SEARCH_FAILED` | 500 |

## API Endpoints

All catalog read/write endpoints (admin, vendor read, customer read).

## DB Fields

No database fields created in this document.
