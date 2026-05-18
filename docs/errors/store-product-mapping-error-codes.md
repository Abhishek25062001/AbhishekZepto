# Store Product Mapping Error Codes

Status: **IMPLEMENTED**

| Code | HTTP (typical) | Description |
|------|----------------|-------------|
| `STORE_PRODUCT_NOT_FOUND` | 404 | Mapping missing or soft-deleted |
| `STORE_PRODUCT_ALREADY_MAPPED` | 409 | Duplicate `storeId` + `variantId` |
| `STORE_PRODUCT_SKU_ALREADY_EXISTS` | 409 | Duplicate `storeSku` within store |
| `INVALID_STORE_PRODUCT_STORE` | 400 | Store missing, inactive, or deleted |
| `INVALID_STORE_PRODUCT_PRODUCT` | 400 | Product missing, not approved, or not visible |
| `INVALID_STORE_PRODUCT_VARIANT` | 400 | Variant missing or inactive |
| `STORE_PRODUCT_VARIANT_MISMATCH` | 400 | Variant does not belong to product |
| `STORE_PRODUCT_PRICE_INVALID` | 422 | Price/discount validation failed |
| `STORE_PRODUCT_FINAL_PRICE_INVALID` | 422 | Calculated final price out of range |
| `STORE_PRODUCT_PRICE_LOCKED` | 409 | Vendor price update blocked |
| `STORE_PRODUCT_SCOPE_DENIED` | 403 | Vendor cannot access mapping |
| `STORE_PRODUCT_BULK_VALIDATION_FAILED` | 422 | Bulk operation validation failed |

## Audit events (planned)

- `store_product.created`
- `store_product.updated`
- `store_product.deleted`
- `store_product.bulk_mapped`
- `store_product.bulk_price_updated`
- `store_product.bulk_visibility_updated`
- `store_product.vendor_price_updated`
- `store_product.vendor_availability_updated`
