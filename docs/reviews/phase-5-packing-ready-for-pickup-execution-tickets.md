# Phase 5 Packing & Ready-for-Pickup Execution Tickets

## Ticket 5.1 — Packing & Ready-for-Pickup Scope And API Contract

**Objective:** Document Module 5 scope: start packing, complete packing, and
mark ready-for-pickup. Exclude inventory adjustment, cancellation, delivery
assignment, rider pickup, SLA jobs, notifications, and vendor UI.

**Files to create/update:**

- `docs/contracts/phase-5-packing-ready-for-pickup-api.md`
- `docs/contracts/phase-5-route-mounting-plan.md`
- `docs/reviews/phase-5-packing-ready-for-pickup-execution-tickets.md`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/packing/start`
- `POST /api/v1/store/orders/{orderId}/packing/complete`
- `POST /api/v1/store/orders/{orderId}/ready-for-pickup`

**DB fields:**

- `packingStatus`
- `readyForPickupAt`
- `timeline[]`

**Implementation steps:**

1. Document Module 5 boundaries from route plan, validation rules, transition
   matrix, schema plan, audit logging, and dependency docs.
2. Document all three store/vendor endpoints.
3. State dependency on completed picking from Module 4.
4. Mark inventory reconciliation as Module 6.
5. Mark cancellation as Module 7.
6. Mark delivery handoff beyond `ready_for_pickup` as Phase 6 boundary.

**Acceptance criteria:**

- Module 5 API contract exists.
- All three endpoints are listed.
- Out-of-scope boundaries are explicit.
- Dependency on Module 4 picking completion is documented.

**Test commands:**

- `rg "packing/start" docs/contracts/phase-5-packing-ready-for-pickup-api.md`
- `rg "packing/complete" docs/contracts/phase-5-packing-ready-for-pickup-api.md`
- `rg "ready-for-pickup" docs/contracts/phase-5-packing-ready-for-pickup-api.md`

**Depends on:**

- Module 2 complete
- Module 4 complete

## Ticket 5.2 — Packing Runtime State Foundation

**Objective:** Add backend state foundation for packing and ready-for-pickup
without exposing new routes yet.

**Files to create/update:**

- `backend/api/src/modules/orders/constants/order-status.constant.ts`
- `backend/api/src/modules/orders/constants/order-packing-status.constant.ts`
- `backend/api/src/modules/orders/constants/order-error-codes.constant.ts`
- `backend/api/src/modules/orders/constants/order-audit-events.constant.ts`
- `backend/api/src/errors/error-codes.ts`
- `backend/api/src/modules/orders/types/order.types.ts`
- `backend/api/src/modules/orders/models/order.model.ts`
- `backend/api/src/modules/orders/utils/order-snapshot.util.ts`
- `backend/api/src/modules/orders/utils/order-response.mapper.ts`
- `backend/api/src/modules/orders/utils/order-error.mapper.ts`
- `docs/database/phase-5-order-lifecycle-schema.md`
- `docs/errors/phase-5-error-codes.md`
- `docs/architecture/phase-5-audit-logging.md`

**API endpoints:** None.

**DB fields:**

- `packingStatus`
- `readyForPickupAt`

**Implementation steps:**

1. Add order states `packing` and `ready_for_pickup` if not already present.
2. Add packing status constants such as `in_progress`, `completed`,
   `ready_for_pickup`.
3. Add `ORDER_PACKING_NOT_ALLOWED`.
4. Add audit events `order.packing.started`, `order.packing.completed`, and
   `order.ready_for_pickup`.
5. Extend order model/types/responses with `packingStatus` and
   `readyForPickupAt`.
6. Keep defaults backward-compatible for existing orders.
7. Update docs to mark fields and events as Module 5 implementation-owned.

**Acceptance criteria:**

- Packing fields compile.
- Existing order and picking tests still pass.
- No Module 5 routes are exposed yet.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

**Depends on:** Ticket 5.1

## Ticket 5.3 — Start Packing API

**Objective:** Implement store-owned start packing operation after picking is
completed.

**Files to create/update:**

- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/src/modules/orders/routes/customer-order.routes.test.ts`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/packing/start`

**DB fields:**

- `orderStatus = packing`
- `packingStatus = in_progress`
- `timeline[].event = order.packing.started`

**Implementation steps:**

1. Add store route for packing start.
2. Require `orders:update`.
3. Validate `orderId`.
4. Require actor store scope.
5. Allow only assigned-store orders.
6. Allow only orders with `orderStatus = picking` and
   `pickerStatus = completed`.
7. Update order state to packing.
8. Append timeline/audit event.
9. Add OpenAPI path.

**Acceptance criteria:**

- Store user can start packing after picking completion.
- Packing cannot start before picking completion.
- Cross-store operation is forbidden.
- OpenAPI includes the endpoint.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON check for `/store/orders/{orderId}/packing/start`

**Depends on:** Ticket 5.2

## Ticket 5.4 — Complete Packing API

**Objective:** Implement store-owned complete packing operation after packing
has started.

**Files to create/update:**

- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/src/modules/orders/routes/customer-order.routes.test.ts`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/packing/complete`

**DB fields:**

- `packingStatus = completed`
- `timeline[].event = order.packing.completed`

**Implementation steps:**

1. Add store route for packing complete.
2. Require `orders:update`.
3. Validate `orderId`.
4. Require assigned-store ownership.
5. Allow only orders with `orderStatus = packing` and
   `packingStatus = in_progress`.
6. Set `packingStatus = completed`.
7. Append timeline/audit event.
8. Do not mark ready-for-pickup in this ticket.
9. Add OpenAPI path.

**Acceptance criteria:**

- Store user can complete active packing.
- Packing completion fails if packing has not started.
- Ready-for-pickup is not set by this ticket.
- OpenAPI includes the endpoint.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON check for `/store/orders/{orderId}/packing/complete`

**Depends on:** Ticket 5.3

## Ticket 5.5 — Mark Ready-for-Pickup API

**Objective:** Implement store-owned ready-for-pickup operation after packing is
completed.

**Files to create/update:**

- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/src/modules/orders/routes/customer-order.routes.test.ts`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/ready-for-pickup`

**DB fields:**

- `orderStatus = ready_for_pickup`
- `packingStatus = ready_for_pickup`
- `readyForPickupAt`
- `timeline[].event = order.ready_for_pickup`

**Implementation steps:**

1. Add store route for ready-for-pickup.
2. Require `orders:update`.
3. Validate `orderId`.
4. Require assigned-store ownership.
5. Allow only orders with `orderStatus = packing` and
   `packingStatus = completed`.
6. Set `orderStatus = ready_for_pickup`.
7. Set `packingStatus = ready_for_pickup`.
8. Set `readyForPickupAt`.
9. Append timeline/audit event.
10. Do not implement rider assignment, shipped state, delivery OTP, or live
   delivery.

**Acceptance criteria:**

- Store user can mark order ready only after packing completion.
- Ready-for-pickup cannot bypass picking or packing.
- `readyForPickupAt` is set.
- OpenAPI includes the endpoint.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON check for `/store/orders/{orderId}/ready-for-pickup`

**Depends on:** Ticket 5.4

## Ticket 5.6 — Module 5 Review And Handoff

**Objective:** Review Module 5 implementation and close the handoff.

**Files to create/update:**

- `docs/reviews/phase-5-packing-ready-for-pickup-review.md`
- `docs/handoffs/phase-5-packing-ready-for-pickup-flow-complete.md`
- `docs/contracts/phase-5-module-completion-matrix.md`
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_5_HANDOFF.md`

**API endpoints:** Verify all three Module 5 endpoints.

**DB fields:** Verify `packingStatus`, `readyForPickupAt`, and `timeline[]`.

**Implementation steps:**

1. Run full Module 5 review.
2. Verify no Module 6, 7, 9, 13, or 14 work was started.
3. Update Module 5 review doc.
4. Update Module 5 handoff.
5. Mark Module 5 as DONE in completion matrix.
6. Update Phase 5 handoff and current progress.
7. Mark Module 6 as next.

**Acceptance criteria:**

- Typecheck passes.
- Lint passes.
- Customer-order/order lifecycle tests pass.
- OpenAPI includes all Module 5 endpoints.
- Completion matrix marks Module 5 DONE.
- Handoff marks Module 6 as next.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON verification for all three Module 5 endpoints
- `rg "| 5 | Packing & Ready-for-Pickup Flow | DONE" docs/contracts/phase-5-module-completion-matrix.md`

**Depends on:** Ticket 5.5
