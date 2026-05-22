# Phase 5 Inventory Adjustment During Store Operations Complete

**Date:** 2026-05-21  
**Module:** 6 — Inventory Adjustment During Store Operations

## Closeout Status

Phase 5 Module 6 is complete for the implemented Inventory Adjustment During
Store Operations scope.

This closeout covers internal inventory reconciliation after picking
completion, missing item inventory movement records, `order.inventory.adjusted`
audit/timeline events, validation safeguards, tests, and Module 7 boundary
protection.

## Completed Artifacts

Docs:

- `docs/contracts/phase-5-inventory-adjustment-store-operations.md`
- `docs/reviews/phase-5-inventory-adjustment-store-operations-execution-tickets.md`
- `docs/reviews/phase-5-inventory-adjustment-store-operations-review.md`
- `docs/handoffs/phase-5-inventory-adjustment-store-operations-complete.md`
- `docs/contracts/phase-5-route-mounting-plan.md`
- `docs/architecture/phase-5-audit-logging.md`
- `docs/contracts/phase-5-module-completion-matrix.md`

Runtime artifacts:

- `backend/api/src/modules/orders/constants/order-audit-events.constant.ts`
- `backend/api/src/modules/orders/types/order-inventory-adjustment.types.ts`
- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.ts`
- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.test.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/package.json`

## Architecture Decisions

- Module 6 does not add public API routes.
- Inventory adjustment runs from the existing picking completion boundary.
- Every order item must have fully resolved picked and missing quantities before
  inventory adjustment can continue.
- Missing items create append-only `inventory_movements` records using the
  existing `correction` movement type and `order` reference type.
- Missing item movements do not change stock quantity fields; they record the
  operational reconciliation against the order reference and update last
  movement metadata.
- `order.inventory.adjusted` is emitted as both audit log and order timeline
  event when missing items are adjusted.

## API Endpoints Implemented

No new endpoints.

Existing endpoint updated internally:

- `POST /api/v1/store/orders/{orderId}/picking/complete`

## DB Fields Implemented

No new DB fields.

Existing fields used:

- `orders.items[].pickedQuantity`
- `orders.items[].missingQuantity`
- `orders.items[].pickingStatus`
- `orders.timeline[]`
- `inventory_stocks.lastStockUpdatedAt`
- `inventory_stocks.lastStockMovementId`
- `inventory_movements.*`

## Audit Events Implemented

- `order.inventory.adjusted`

## Tests Run

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI verification: no new Module 6 public endpoints added

## Next

**Phase 5 Module 7 — Order Cancellation Backend** should be ticketized next.
