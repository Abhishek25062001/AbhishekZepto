# Inventory Locking Error Codes

Status: **IMPLEMENTED**

| Code | HTTP | When |
|------|------|------|
| `INVENTORY_LOCK_NOT_FOUND` | 404 | Lock missing or invalid token/id |
| `INVENTORY_LOCK_ALREADY_CONFIRMED` | 409 | Idempotent hint / already confirmed |
| `INVENTORY_LOCK_ALREADY_RELEASED` | 409 | Idempotent hint / already released |
| `INVENTORY_LOCK_EXPIRED` | 409 | Lock past expiry |
| `INVENTORY_LOCK_NOT_ACTIVE` | 409 | Operation requires active lock |
| `INVENTORY_LOCK_RELEASE_BLOCKED` | 409 | Cannot release confirmed lock |
| `INVENTORY_LOCK_CONFIRM_BLOCKED` | 409 | Cannot confirm released/expired lock |
| `INVENTORY_LOCK_TOKEN_COLLISION` | 409 | Rare token generation collision |
| `INVENTORY_LOCK_QUANTITY_INVALID` | 422 | quantity ≤ 0 |
| `INVENTORY_LOCK_STOCK_MISMATCH` | 400 | storeProductId does not match stock |
| `INVENTORY_LOCK_INSUFFICIENT_STOCK` | 409 | quantity > availableQuantity |
| `INVENTORY_LOCK_EXPIRY_INVALID` | 422 | expiresAt in past |
