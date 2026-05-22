# Phase 5 Order Cancellation Backend Complete

**Date:** 2026-05-21  
**Module:** 7 — Order Cancellation Backend

## Closeout Status

Phase 5 Module 7 is complete for backend order cancellation.

This module implements customer, store, and admin cancellation APIs, lifecycle
state mutation to `cancelled`, cancellation audit/timeline records, inventory
release/reconciliation behavior, validation, OpenAPI documentation, and tests.

## Completed Artifacts

Docs:

- `docs/contracts/phase-5-order-cancellation-api.md`
- `docs/reviews/phase-5-order-cancellation-backend-execution-tickets.md`
- `docs/reviews/phase-5-order-cancellation-backend-review.md`
- `docs/handoffs/phase-5-order-cancellation-backend-complete.md`
- `docs/security/phase-5-permissions.md`
- `docs/contracts/phase-5-module-completion-matrix.md`

Runtime artifacts:

- `backend/api/src/modules/auth/constants/auth-permission.constants.ts`
- `backend/api/src/database/seeds/seed-roles.ts`
- `backend/api/src/modules/orders/constants/order-audit-events.constant.ts`
- `backend/api/src/modules/orders/constants/order-error-codes.constant.ts`
- `backend/api/src/errors/error-codes.ts`
- `backend/api/src/modules/orders/models/order.model.ts`
- `backend/api/src/modules/orders/types/order.types.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/services/order-cancellation-inventory.service.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/routes/customer-order.routes.ts`
- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/routes/admin-order.routes.ts`
- `backend/api/src/routes/v1/admin.routes.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order-cancellation-inventory.service.test.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/src/modules/orders/routes/customer-order.routes.test.ts`
- `backend/api/src/modules/orders/routes/admin-order.routes.test.ts`
- `backend/api/package.json`

## API Endpoints Implemented

- `POST /api/v1/customer/orders/{orderId}/cancel`
- `POST /api/v1/store/orders/{orderId}/cancel`
- `POST /api/v1/admin/orders/{orderId}/cancel`

## DB Fields Implemented

- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `refundReviewRequired`
- `timeline[]` cancellation event metadata

## Permissions Implemented

- Customer cancellation: authenticated customer ownership.
- Store cancellation: `orders:update` plus assigned-store scope.
- Admin cancellation: `orders:cancel` under the admin route group.

## Audit Events Implemented

- `order.cancelled`

## Tests Run

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI verification for `/customer/orders/{orderId}/cancel`
- OpenAPI verification for `/store/orders/{orderId}/cancel`
- OpenAPI verification for `/admin/orders/{orderId}/cancel`

## Blockers

None.

## Notes

- Test output includes a pre-existing Mongoose duplicate index warning for
  `{"isDeleted":1}`. It is non-blocking for Module 7.
- Refund execution remains out of scope and is represented by
  `refundReviewRequired`.

## Next

**Phase 5 Module 8 — Vendor Panel - Incoming Orders** should be ticketized next.
