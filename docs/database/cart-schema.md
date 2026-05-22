# Cart Schema

## Collection

`carts`

## DB Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | yes | Primary key |
| `customerId` | ObjectId | yes | Cart owner |
| `storeId` | ObjectId | yes | Dark store for this cart |
| `status` | enum | yes | `active`, `abandoned`, `converted` |
| `items` | array | yes | Line items (may be empty) |
| `items[].productId` | ObjectId | yes | Global product |
| `items[].variantId` | ObjectId | yes | Sellable SKU |
| `items[].storeProductId` | ObjectId | yes | Store mapping |
| `items[].quantity` | number | yes | Min 1, max per validation rules |
| `items[].unitPriceSnapshot` | number | yes | Store price at add/update time |
| `items[].lineTotal` | number | yes | `quantity * unitPriceSnapshot` |
| `items[].productNameSnapshot` | string | no | Display cache |
| `items[].addedAt` | Date | yes | Line added |
| `items[].updatedAt` | Date | yes | Line last changed |
| `subtotal` | number | no | Sum of line totals; set by pricing service |
| `discountAmount` | number | no | `0` in Module 5 MVP (promotions Phase 9+) |
| `taxAmount` | number | no | `subtotal * CART_TAX_RATE_PERCENT / 100` |
| `deliveryFeeAmount` | number | no | Flat `CART_DELIVERY_FEE_AMOUNT` |
| `grandTotal` | number | no | `subtotal - discount + tax + delivery` |
| `currency` | string | yes | Default `INR` |
| `lastCalculatedAt` | Date | no | Set on each pricing recalculation |
| `createdAt` | Date | yes | Base timestamp |
| `updatedAt` | Date | yes | Base timestamp |

## Business Rules

- One **active** cart per (`customerId`, `storeId`) pair.
- Changing store may require new cart or clear (Module 1/3 decision at implementation).
- All items must reference active `store_products` with available stock checks at mutation time.
- Price snapshots updated on add/quantity change (Module 5).

## Indexes

See `docs/database/phase-4-index-plan.md`.

## itemId

API `itemId` = MongoDB embedded subdocument `_id` on `items[]`.

## API Endpoints

`docs/contracts/cart-api.md` — **IMPLEMENTED** (Module 3, `backend/api/src/modules/cart/`).
