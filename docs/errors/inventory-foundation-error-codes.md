# Inventory Foundation Error Codes

Status: **IMPLEMENTED**

| Code | HTTP | When |
|------|------|------|
| `INVENTORY_STOCK_NOT_FOUND` | 404 | Stock missing or soft-deleted |
| `INVENTORY_STOCK_ALREADY_EXISTS` | 409 | Duplicate store + store product |
| `INVALID_INVENTORY_STORE_PRODUCT` | 400 | Mapping missing/inactive |
| `INVALID_INVENTORY_QUANTITY` | 422 | Negative or invalid quantity |
| `INSUFFICIENT_AVAILABLE_STOCK` | 409 | Stock out exceeds available |
| `INVENTORY_RESERVED_STOCK_EXISTS` | 409 | Delete blocked when reserved > 0 |
| `INVENTORY_SCOPE_DENIED` | 403 | Vendor out of scope |
| `INVENTORY_BULK_VALIDATION_FAILED` | 422 | Bulk item validation failed |
| `INVALID_INVENTORY_STATUS` | 422 | Invalid status enum |
| `INVALID_INVENTORY_MOVEMENT_TYPE` | 422 | Movement type not allowed |
| `INVALID_INVENTORY_REFERENCE_TYPE` | 422 | Invalid reference type |
