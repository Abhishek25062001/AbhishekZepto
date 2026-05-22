# Phase 5 Packing & Ready-for-Pickup Review

## Scope

This review validates Phase 5 Module 5 Packing & Ready-for-Pickup completion
for the implemented ticket scope.

## Checklist

- [x] Packing and ready-for-pickup API contract is documented.
- [x] Start packing route is implemented under `/api/v1/store/orders/:orderId/packing/start`.
- [x] Complete packing route is implemented under `/api/v1/store/orders/:orderId/packing/complete`.
- [x] Ready-for-pickup route is implemented under `/api/v1/store/orders/:orderId/ready-for-pickup`.
- [x] Packing routes require `orders:update`.
- [x] Packing routes enforce assigned-store ownership.
- [x] Start packing requires completed picking.
- [x] Complete packing requires active packing.
- [x] Ready-for-pickup requires completed packing.
- [x] `readyForPickupAt` is set when an order is marked ready.
- [x] Audit and timeline events are implemented for packing actions.
- [x] OpenAPI includes all Module 5 endpoints.
- [x] Backend typecheck, lint, ticket tests, and OpenAPI verification pass.
- [x] Inventory adjustment, cancellation, delivery, notifications, SLA jobs, and vendor UI are not started.

## API Endpoints

Implemented Module 5 endpoints:

- `POST /api/v1/store/orders/{orderId}/packing/start`
- `POST /api/v1/store/orders/{orderId}/packing/complete`
- `POST /api/v1/store/orders/{orderId}/ready-for-pickup`

## DB Fields

Implemented Module 5 fields:

- `packingStatus`
- `readyForPickupAt`
- `timeline[]`

## Runtime Files

- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/models/order.model.ts`
- `backend/api/src/modules/orders/types/order.types.ts`
- `backend/api/src/modules/orders/utils/order-snapshot.util.ts`
- `backend/api/src/modules/orders/utils/order-response.mapper.ts`
- `backend/api/src/modules/orders/utils/order-error.mapper.ts`
- `backend/api/src/docs/openapi/order.paths.ts`

## Review Commands

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON path verification for all Module 5 endpoints

## Review Result

Module 5 Packing & Ready-for-Pickup Flow is complete for the implemented scope.
Module 6 Inventory Adjustment During Store Operations may be ticketized next.
