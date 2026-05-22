# Cart API Contract

Status: **IMPLEMENTED** — Module 3 (2026-05-19); pricing enhanced Module 5 (2026-05-19).

Authentication: `authenticate` + `CUSTOMER` role.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/customer/cart` | Get active cart for store |
| POST | `/api/v1/customer/cart/items` | Add line item |
| PATCH | `/api/v1/customer/cart/items/:itemId` | Update quantity |
| DELETE | `/api/v1/customer/cart/items/:itemId` | Remove line |
| DELETE | `/api/v1/customer/cart` | Clear all items |
| POST | `/api/v1/customer/cart/recalculate` | Refresh price snapshots and totals |

**Excluded:** `POST /cart/merge` — not in Phase 4 MVP.

## GET `/api/v1/customer/cart`

**Query:** `storeId` (required), `validatePrices` (optional boolean)

**Success:** Cart document or `CART_NOT_FOUND` if no cart yet (created on first add).

When `validatePrices=true` and any line snapshot differs from current store price → `409 CART_PRICE_CHANGED` with `details.changedItems[]`.

```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "data": {
    "id": "65f0a0000000000000000100",
    "storeId": "65f0a0000000000000000002",
    "status": "active",
    "currency": "INR",
    "items": [
      {
        "id": "65f0a0000000000000000101",
        "productId": "...",
        "variantId": "...",
        "storeProductId": "...",
        "quantity": 2,
        "unitPriceSnapshot": 99,
        "lineTotal": 198,
        "productNameSnapshot": "Amul Milk 1L"
      }
    ],
    "subtotal": 198,
    "discountAmount": 0,
    "taxAmount": 0,
    "deliveryFeeAmount": 0,
    "grandTotal": 198
  }
}
```

## POST `/api/v1/customer/cart/items`

**Body:** `storeId`, `variantId`, `quantity`

Creates cart if none exists for (`customerId`, `storeId`).

## PATCH `/api/v1/customer/cart/items/:itemId`

**Body:** `quantity` (absolute, min 1)

**Query:** `storeId` (required)

## DELETE `/api/v1/customer/cart/items/:itemId`

**Query:** `storeId` (required)

## DELETE `/api/v1/customer/cart`

**Query:** `storeId` (required) — clears `items[]`; cart remains active.

## POST `/api/v1/customer/cart/recalculate`

**Body:** `{ "storeId": "..." }`

Refreshes all line `unitPriceSnapshot` values from current `store_products.finalPrice`, recalculates tax/delivery/grand total, persists cart.

## Errors

| Code | HTTP | When |
|------|------|------|
| `CART_NOT_FOUND` | 404 | No active cart (GET before add) |
| `CART_ITEM_NOT_FOUND` | 404 | Unknown line id |
| `CART_EMPTY` | 400 | Operation requires items (future checkout) |
| `CART_PRODUCT_UNAVAILABLE` | 409 | Inactive or not mapped to store |
| `CART_INSUFFICIENT_STOCK` | 409 | Quantity exceeds available |
| `CART_MAX_QUANTITY_EXCEEDED` | 400 | Above per-line max |
| `CART_STORE_MISMATCH` | 400 | storeId ≠ selected store |
| `STORE_NOT_FOUND` | 404 | Unknown store |
| `CART_PRICE_CHANGED` | 409 | Snapshot stale; call recalculate |

**`CART_PRICE_CHANGED` details:**

```json
{
  "error": {
    "code": "CART_PRICE_CHANGED",
    "details": {
      "changedItems": [
        { "itemId": "...", "oldPrice": 99, "newPrice": 109 }
      ]
    }
  }
}
```

## DB Fields

`docs/database/cart-schema.md`

## Permissions

`docs/security/phase-4-permissions.md`
