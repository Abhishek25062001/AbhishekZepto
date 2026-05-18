# Inventory Foundation Validation Rules

## Quantities

- `availableQuantity`, `reservedQuantity`, `damagedQuantity`, `expiredQuantity` must be `>= 0`.
- `totalQuantity = availableQuantity + reservedQuantity + damagedQuantity + expiredQuantity`.
- Adjustments must not produce negative bucket quantities.
- `stock_out` and `damaged` / `expired` cannot reduce `availableQuantity` below zero.

## Stock create

- `storeProductId` required; mapping must exist, be active, visible, and not deleted.
- One stock row per `storeId` + `storeProductId` when not deleted.

## Admin adjustment `movementType`

Allowed: `stock_in`, `stock_out`, `manual_adjustment`, `damaged`, `expired`, `correction`.

- `manual_adjustment` requires `adjustmentMode`: `increase`, `decrease`, or `set`.
- `correction` sets `availableQuantity` to the provided quantity value.

## Vendor adjustment `movementType`

Allowed: `stock_in`, `stock_out`, `damaged`, `expired`, `correction` (no `manual_adjustment`).

## Bulk upload

- `duplicateMode`: `fail`, `skip`, `replace`.
- Per-item `storeProductId` and `availableQuantity` required.

## Delete guard

- Soft delete blocked when `reservedQuantity > 0`.
- Store product soft delete blocked when inventory stock exists for mapping.
