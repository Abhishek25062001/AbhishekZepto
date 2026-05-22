# Phase 5 Order Cancellation Backend Execution Tickets

## Ticket 7.1 — Cancellation Scope And API Contract

**Objective:** Document Module 7 cancellation scope, actor rules, cutoff states,
inventory impact, refund placeholder, and route contract.

**Files to create/update:**

- `docs/contracts/phase-5-order-cancellation-api.md`
- `docs/reviews/phase-5-order-cancellation-backend-execution-tickets.md`
- `docs/contracts/phase-5-route-mounting-plan.md`

**API endpoints:**

- `POST /api/v1/customer/orders/{orderId}/cancel`
- `POST /api/v1/store/orders/{orderId}/cancel`
- `POST /api/v1/admin/orders/{orderId}/cancel`

**DB fields:**

- `orderStatus`
- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `refundReviewRequired`
- `timeline[].reason`

**Implementation steps:**

1. Document customer/store/admin cancellation scope.
2. Document cutoff rules from `phase-5-cancellation-rules.md`.
3. Document inventory behavior dependency on Module 6.
4. Document refund handling as placeholder only.
5. Document all three planned cancellation endpoints.
6. Confirm no delivery, refund ledger, settlement, support, or SLA job behavior
   is included.

**Acceptance criteria:**

- Module 7 contract exists.
- All three cancellation endpoints are documented.
- Actor rules and cutoff states are explicit.
- Inventory and refund placeholders are documented without implementing future
  modules.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `rg "customer/orders/.*/cancel|store/orders/.*/cancel|admin/orders/.*/cancel" docs/contracts/phase-5-order-cancellation-api.md`

**Depends on:**

- Module 1 complete
- Module 2 complete
- Module 6 complete

## Ticket 7.2 — Cancellation Runtime State Foundation

**Objective:** Add backend cancellation constants, model/type fields,
validation schema, and error mapping without exposing routes yet.

**Files to create/update:**

- `backend/api/src/modules/orders/constants/order-status.constant.ts`
- `backend/api/src/modules/orders/constants/order-audit-events.constant.ts`
- `backend/api/src/modules/orders/constants/order-error-codes.constant.ts`
- `backend/api/src/errors/error-codes.ts`
- `backend/api/src/modules/orders/types/order.types.ts`
- `backend/api/src/modules/orders/models/order.model.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/modules/orders/utils/order-error.mapper.ts`
- `docs/database/phase-5-order-lifecycle-schema.md`
- `docs/errors/phase-5-error-codes.md`
- `docs/validation/phase-5-validation-rules.md`
- `docs/architecture/phase-5-audit-logging.md`

**API endpoints:** None.

**DB fields:**

- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `refundReviewRequired`
- `timeline[].event = order.cancelled`
- `timeline[].reason`

**Implementation steps:**

1. Confirm or add `cancelled` order status.
2. Add `order.cancelled` audit event constant.
3. Add cancellation error codes.
4. Add cancellation fields to order model/types.
5. Add cancellation body validator requiring trimmed reason.
6. Keep defaults backward-compatible for existing orders.
7. Update schema, validation, audit, and error docs.

**Acceptance criteria:**

- Cancellation fields compile.
- Cancellation validator exists.
- No routes are exposed yet.
- Existing order tests still pass.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

**Depends on:** Ticket 7.1

## Ticket 7.3 — Cancellation Inventory Impact Service

**Objective:** Implement internal cancellation inventory behavior before wiring
public cancellation endpoints.

**Files to create/update:**

- `backend/api/src/modules/orders/services/order-cancellation-inventory.service.ts`
- `backend/api/src/modules/orders/services/order-cancellation-inventory.service.test.ts`
- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.ts`
- `backend/api/package.json`
- `docs/contracts/phase-5-order-cancellation-api.md`

**API endpoints:** None.

**DB fields:** Existing order item, inventory stock, and inventory movement
fields only.

**Implementation steps:**

1. Create internal cancellation inventory service.
2. For pre-picking cancellations, release or reverse allocated inventory using
   existing inventory stock/movement conventions.
3. For picking/packing cancellations, reuse Module 6 reconciliation behavior.
4. Do not implement refunds or finance ledger behavior.
5. Add unit tests for pre-picking and picking/packing paths.

**Acceptance criteria:**

- Inventory service is internal only.
- Inventory behavior uses existing inventory stock/movement structures.
- Module 6 reconciliation is reused where applicable.
- No public endpoint is added.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

**Depends on:** Ticket 7.2

## Ticket 7.4 — Customer Cancellation API

**Objective:** Implement customer-owned cancellation for eligible `placed`
orders only.

**Files to create/update:**

- `backend/api/src/modules/orders/routes/customer-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/src/modules/orders/routes/customer-order.routes.test.ts`
- `docs/contracts/phase-5-order-cancellation-api.md`

**API endpoints:**

- `POST /api/v1/customer/orders/{orderId}/cancel`

**DB fields:**

- `orderStatus = cancelled`
- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `refundReviewRequired`
- `timeline[].event = order.cancelled`
- `timeline[].reason`

**Implementation steps:**

1. Add customer cancellation route.
2. Require authenticated customer role through mounted customer route group.
3. Validate `orderId`.
4. Validate cancellation reason.
5. Ensure order belongs to customer.
6. Allow only `orderStatus = placed`.
7. Invoke cancellation inventory service.
8. Set cancellation fields and terminal status.
9. Append timeline/audit event.
10. Add OpenAPI path and tests.

**Acceptance criteria:**

- Customer can cancel own placed order.
- Customer cannot cancel accepted or later orders.
- Customer cannot cancel another customer's order.
- Inventory impact service is called.
- OpenAPI includes the customer cancellation endpoint.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON verification for `/customer/orders/{orderId}/cancel`

**Depends on:** Ticket 7.3

## Ticket 7.5 — Store Cancellation API

**Objective:** Implement assigned-store cancellation for eligible active
preparation states.

**Files to create/update:**

- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/src/modules/orders/routes/customer-order.routes.test.ts`
- `docs/contracts/phase-5-order-cancellation-api.md`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/cancel`

**DB fields:**

- `orderStatus = cancelled`
- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `refundReviewRequired`
- `timeline[].event = order.cancelled`
- `timeline[].reason`

**Implementation steps:**

1. Add store cancellation route.
2. Require store/vendor authentication through mounted store route group.
3. Require existing `orders:update` permission convention.
4. Validate `orderId` and reason.
5. Ensure order belongs to actor's assigned store.
6. Allow `placed`, `accepted`, `picking`, or `packing`.
7. Block `ready_for_pickup` and terminal states.
8. Invoke cancellation inventory service.
9. Set cancellation fields and append audit/timeline event.
10. Add OpenAPI path and tests.

**Acceptance criteria:**

- Store can cancel assigned-store eligible orders.
- Cross-store cancellation is forbidden.
- Ready-for-pickup and terminal states are blocked.
- Inventory service is called.
- OpenAPI includes the store cancellation endpoint.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON verification for `/store/orders/{orderId}/cancel`

**Depends on:** Ticket 7.4

## Ticket 7.6 — Admin Cancellation API

**Objective:** Implement admin cancellation for authorized active non-terminal
orders.

**Files to create/update:**

- `backend/api/src/modules/orders/routes/admin-order.routes.ts`
- `backend/api/src/routes/v1/admin.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/src/modules/orders/routes/admin-order.routes.test.ts`
- `docs/contracts/phase-5-order-cancellation-api.md`
- `docs/security/phase-5-permissions.md`

**API endpoints:**

- `POST /api/v1/admin/orders/{orderId}/cancel`

**DB fields:**

- `orderStatus = cancelled`
- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `refundReviewRequired`
- `timeline[].event = order.cancelled`
- `timeline[].reason`

**Implementation steps:**

1. Add admin cancellation route.
2. Require admin authentication through mounted admin route group.
3. Require `orders:cancel`.
4. Validate `orderId` and reason.
5. Allow active non-terminal orders before `ready_for_pickup`.
6. Block `ready_for_pickup`, delivery placeholders, delivered, and cancelled.
7. Invoke cancellation inventory service.
8. Set cancellation fields and append audit/timeline event.
9. Add OpenAPI path and tests.

**Acceptance criteria:**

- Authorized admin can cancel eligible active orders.
- Unauthorized admin cancellation is blocked by permission middleware.
- Terminal/cutoff states are blocked.
- Inventory service is called.
- OpenAPI includes the admin cancellation endpoint.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON verification for `/admin/orders/{orderId}/cancel`

**Depends on:** Ticket 7.5

## Ticket 7.7 — Module 7 Review, Matrix, And Handoff

**Objective:** Close Module 7 with review docs, handoff updates, matrix status,
and next-module readiness.

**Files to create/update:**

- `docs/reviews/phase-5-order-cancellation-backend-review.md`
- `docs/handoffs/phase-5-order-cancellation-backend-complete.md`
- `docs/contracts/phase-5-module-completion-matrix.md`
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_5_HANDOFF.md`

**API endpoints:** No new endpoint beyond Tickets 7.4–7.6.

**DB fields:** No new fields beyond Ticket 7.2.

**Implementation steps:**

1. Record all completed tickets.
2. Record endpoints implemented.
3. Record DB fields added.
4. Record permissions and audit events.
5. Record test and OpenAPI verification results.
6. Update Module 7 status to DONE.
7. Mark Module 8 as next per dependency order.

**Acceptance criteria:**

- Module 7 review exists.
- Module 7 handoff exists.
- Completion matrix marks Module 7 DONE.
- Project context points to the next Phase 5 module.
- No unrelated modules are marked complete.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `rg "Order Cancellation Backend|order.cancelled|Module 7" docs project-context`

**Depends on:** Ticket 7.6
