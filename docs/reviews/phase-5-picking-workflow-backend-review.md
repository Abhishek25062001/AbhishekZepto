# Phase 5 Picking Workflow Backend Review

## Scope

This review validates Phase 5 Module 4 Picking Workflow Backend completion for
the implemented ticket scope.

## Checklist

- [x] Picking API contract is documented.
- [x] Start picking route is implemented under `/api/v1/store/orders/:orderId/picking/start`.
- [x] Mark item picked route is implemented under `/api/v1/store/orders/:orderId/items/:itemId/picked`.
- [x] Mark item missing route is implemented under `/api/v1/store/orders/:orderId/items/:itemId/missing`.
- [x] Complete picking route is implemented under `/api/v1/store/orders/:orderId/picking/complete`.
- [x] Picking routes require `orders:update`.
- [x] Picking routes enforce assigned-store ownership.
- [x] Start picking requires an accepted store order.
- [x] Item picking operations require active picking state.
- [x] Picked plus missing quantity cannot exceed ordered quantity.
- [x] Picking completion requires all items to be resolved.
- [x] Audit and timeline events are implemented for picking actions.
- [x] OpenAPI includes all Module 4 endpoints.
- [x] Backend typecheck, lint, ticket tests, and OpenAPI verification pass.
- [x] Packing, ready-for-pickup, inventory adjustment, cancellation, and vendor UI are not started.

## API Endpoints

Implemented Module 4 endpoints:

- `POST /api/v1/store/orders/{orderId}/picking/start`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/picked`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/missing`
- `POST /api/v1/store/orders/{orderId}/picking/complete`

## DB Fields

Implemented Module 4 fields:

- `pickerStatus`
- `assignedPickerId`
- `items[].pickedQuantity`
- `items[].missingQuantity`
- `items[].pickingStatus`
- `timeline[].itemId`
- `timeline[].quantity`

## Runtime Files

- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/models/order.model.ts`
- `backend/api/src/modules/orders/types/order.types.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/docs/openapi/order.paths.ts`

## Review Commands

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON path verification for all Module 4 endpoints

## Review Result

Module 4 Picking Workflow Backend is complete for the implemented scope.
Module 5 Packing & Ready-for-Pickup Flow may be ticketized next.
