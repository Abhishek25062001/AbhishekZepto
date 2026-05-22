# Customer Cart Backend Foundation

## Module

Phase 4 Module 3 — Cart Backend Foundation.

## Goal

Persist a store-scoped shopping cart per customer with line items, price snapshots,
stock validation on mutations, and REST APIs for Module 4 customer-app UI.

## Cart lifecycle

```text
POST /cart/items (first call) → creates active cart
GET /cart?storeId=           → returns cart or CART_NOT_FOUND
PATCH /cart/items/:itemId    → update quantity
DELETE /cart/items/:itemId  → remove line
DELETE /cart?storeId=        → clear items (cart document remains, items: [])
```

## Store scoping

- One **active** cart per (`customerId`, `storeId`).
- `storeId` required on all endpoints (query or body).
- When `customer_store_selections` has `isSelected: true`, `storeId` must match selected store.

## Add item flow

1. Resolve `store_products` by `storeId` + `variantId` (active, visible, available).
2. Read `inventory_stocks.availableQuantity` via `findInventoryStockByStoreProduct`.
3. Snapshot `unitPriceSnapshot` from `storeProduct.finalPrice`.
4. Snapshot `productNameSnapshot` from catalog `products.name`.
5. Merge line if same `variantId` exists (increment quantity).
6. Recalculate totals; audit log.

## Totals (Module 5 — pricing service)

Cart mutations and GET delegate to `backend/api/src/modules/pricing/`:

- `lineTotal = quantity * unitPriceSnapshot`
- `subtotal`, `taxAmount`, `deliveryFeeAmount`, `discountAmount`, `grandTotal` per `cart-pricing-calculation.md`
- `POST /cart/recalculate` refreshes snapshots from `store_products.finalPrice`
- `GET ?validatePrices=true` throws `CART_PRICE_CHANGED` when snapshots are stale

## Out of scope

- Inventory locks (Module 6 checkout)
- `POST /cart/merge`
- Customer app UI (Module 4)
- Promotions / coupons

## API

`docs/contracts/cart-api.md`

## DB

`carts` — `docs/database/cart-schema.md`

## QA

- Customer `9999999999`, OTP `123456`
- Store `STORE-000001`, seeded store products + inventory

## Related

- `docs/architecture/phase-4-inventory-lock-integration.md`
- Phase 3 `store_products`, `inventory_stocks`
