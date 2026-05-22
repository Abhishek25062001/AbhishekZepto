# Phase 5 Inventory Adjustment During Store Operations Review

## Scope

This review validates Phase 5 Module 6 Inventory Adjustment During Store
Operations for the implemented ticket scope.

## Checklist

- [x] Module 6 contract is documented.
- [x] Module 6 does not introduce public API routes.
- [x] `order.inventory.adjusted` audit event constant is implemented.
- [x] Internal inventory adjustment types are implemented.
- [x] Picked and missing quantities must be fully resolved before adjustment.
- [x] Missing item adjustment creates append-only inventory movement records.
- [x] Missing item adjustment writes `order.inventory.adjusted` audit logs.
- [x] Picking completion invokes inventory adjustment after validation.
- [x] Picking completion appends `order.inventory.adjusted` timeline event when missing items are adjusted.
- [x] Backend typecheck, lint, ticket tests, and OpenAPI verification pass.
- [x] Cancellation, refunds, delivery, notifications, SLA jobs, and vendor UI are not started.

## API Endpoints

No new Module 6 endpoints were added.

Existing endpoint with internal behavior update:

- `POST /api/v1/store/orders/{orderId}/picking/complete`

## DB Fields

No new DB fields were added.

Existing fields used:

- `orders.items[].pickedQuantity`
- `orders.items[].missingQuantity`
- `orders.items[].pickingStatus`
- `orders.timeline[]`
- `inventory_stocks.lastStockUpdatedAt`
- `inventory_stocks.lastStockMovementId`
- `inventory_movements.*`

## Runtime Files

- `backend/api/src/modules/orders/constants/order-audit-events.constant.ts`
- `backend/api/src/modules/orders/types/order-inventory-adjustment.types.ts`
- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.ts`
- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.test.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/package.json`

## Review Commands

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI route search confirmed no new Module 6 public endpoint.

## Review Result

Module 6 Inventory Adjustment During Store Operations is complete for the
implemented scope. Module 7 Order Cancellation Backend is ready to ticketize
next.

## Residual Risk

Runtime tests continue to emit the existing Mongoose duplicate `isDeleted`
schema-index warning. This warning predates Module 6 and does not block the
Module 6 test suite.
