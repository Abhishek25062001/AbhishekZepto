# Phase 5 Picking Workflow Backend Complete

**Date:** 2026-05-20  
**Module:** 4 — Picking Workflow Backend

## Closeout Status

Phase 5 Module 4 is complete for the implemented Picking Workflow Backend scope.

This closeout covers store picking routes, picked/missing item operations,
state validation, ownership/permission rules, audit/timeline persistence,
OpenAPI paths, tests, and Module 5 boundary protection.

## Completed Artifacts

Docs:

- `docs/contracts/phase-5-picking-workflow-api.md`
- `docs/reviews/phase-5-picking-workflow-backend-execution-tickets.md`
- `docs/reviews/phase-5-picking-workflow-backend-review.md`
- `docs/handoffs/phase-5-picking-workflow-backend-complete.md`
- `docs/contracts/phase-5-route-mounting-plan.md`
- `docs/database/phase-5-order-lifecycle-schema.md`
- `docs/errors/phase-5-error-codes.md`
- `docs/architecture/phase-5-audit-logging.md`

Runtime artifacts:

- `backend/api/src/modules/orders/constants/order-picker-status.constant.ts`
- `backend/api/src/modules/orders/constants/order-item-picking-status.constant.ts`
- `backend/api/src/modules/orders/constants/order-status.constant.ts`
- `backend/api/src/modules/orders/constants/order-error-codes.constant.ts`
- `backend/api/src/modules/orders/constants/order-audit-events.constant.ts`
- `backend/api/src/errors/error-codes.ts`
- `backend/api/src/modules/orders/models/order.model.ts`
- `backend/api/src/modules/orders/types/order.types.ts`
- `backend/api/src/modules/orders/utils/order-snapshot.util.ts`
- `backend/api/src/modules/orders/utils/order-response.mapper.ts`
- `backend/api/src/modules/orders/utils/order-error.mapper.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/src/modules/orders/routes/customer-order.routes.test.ts`

## Architecture Decisions

- Picking can start only from an accepted assigned-store order.
- Active picking uses `orderStatus = picking` and `pickerStatus = in_progress`.
- Item picking operations use the order item's `storeProductId` as the route
  `itemId` until a dedicated line-item id exists.
- Picked and missing quantities are treated as current quantities, not additive
  increments.
- Picked plus missing quantity cannot exceed ordered quantity.
- Picking completion sets `pickerStatus = completed` and keeps packing deferred
  to Module 5.
- Timeline events include item id and quantity context for item operations.

## API Endpoints Implemented

- `POST /api/v1/store/orders/{orderId}/picking/start`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/picked`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/missing`
- `POST /api/v1/store/orders/{orderId}/picking/complete`

## DB Fields Implemented

- `pickerStatus`
- `assignedPickerId`
- `items[].pickedQuantity`
- `items[].missingQuantity`
- `items[].pickingStatus`
- `timeline[].itemId`
- `timeline[].quantity`

## Audit Events Implemented

- `order.picking.started`
- `order.item.picked`
- `order.item.missing`
- `order.picking.completed`

## Tests Run

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON verification for `/store/orders/{orderId}/picking/start`
- OpenAPI JSON verification for `/store/orders/{orderId}/items/{itemId}/picked`
- OpenAPI JSON verification for `/store/orders/{orderId}/items/{itemId}/missing`
- OpenAPI JSON verification for `/store/orders/{orderId}/picking/complete`

## Next

**Phase 5 Module 5 — Packing & Ready-for-Pickup Flow** should be ticketized
next.
