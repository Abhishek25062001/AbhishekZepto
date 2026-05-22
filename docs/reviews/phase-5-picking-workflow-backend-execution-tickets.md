# Phase 5 Picking Workflow Backend Execution Tickets

## Ticket 4.1 — Picking Workflow Scope And API Contract

**Objective:** Document the Module 4 boundary for picking only: start picking,
mark item picked, mark item missing, complete picking. Exclude packing,
ready-for-pickup, inventory adjustment, cancellation, and vendor UI.

**Files to create/update:**

- `docs/contracts/phase-5-picking-workflow-api.md`
- `docs/contracts/phase-5-route-mounting-plan.md`
- `docs/reviews/phase-5-picking-workflow-backend-execution-tickets.md`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/picking/start`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/picked`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/missing`
- `POST /api/v1/store/orders/{orderId}/picking/complete`

**DB fields:**

- `pickerStatus`
- `assignedPickerId`
- `items[].pickedQuantity`
- `items[].missingQuantity`
- `items[].pickingStatus`
- `timeline[]`

**Implementation steps:**

1. Document Module 4 scope from route plan, validation rules, schema plan, audit
   logging, and transition matrix.
2. Document endpoint request/response expectations.
3. Mark packing and ready-for-pickup as Module 5.
4. Mark inventory quantity reconciliation as Module 6.
5. Record unclear quantity-body behavior as `needs verification`.

**Acceptance criteria:**

- Module 4 contract exists.
- All four picking endpoints are listed.
- Out-of-scope boundaries are explicit.
- Dependencies on Modules 2 and 3 are documented.

**Test commands:**

- `rg "picking/start" docs/contracts/phase-5-picking-workflow-api.md`
- `rg "items/\\{itemId\\}/picked" docs/contracts/phase-5-picking-workflow-api.md`
- `rg "items/\\{itemId\\}/missing" docs/contracts/phase-5-picking-workflow-api.md`
- `rg "picking/complete" docs/contracts/phase-5-picking-workflow-api.md`

**Depends on:**

- Module 2 complete
- Module 3 complete

## Ticket 4.2 — Picking Runtime State Foundation

**Objective:** Add the backend picking state foundation without exposing routes
yet.

**Files to create/update:**

- `backend/api/src/modules/orders/constants/order-status.constant.ts`
- `backend/api/src/modules/orders/constants/order-error-codes.constant.ts`
- `backend/api/src/modules/orders/constants/order-audit-events.constant.ts`
- `backend/api/src/modules/orders/types/order.types.ts`
- `backend/api/src/modules/orders/models/order.model.ts`
- `backend/api/src/modules/orders/utils/order-snapshot.util.ts`
- `backend/api/src/modules/orders/utils/order-response.mapper.ts`
- `backend/api/src/errors/error-codes.ts`
- `docs/database/phase-5-order-lifecycle-schema.md`
- `docs/errors/phase-5-error-codes.md`
- `docs/architecture/phase-5-audit-logging.md`

**API endpoints:** None.

**DB fields:**

- `pickerStatus`
- `assignedPickerId`
- `items[].pickedQuantity`
- `items[].missingQuantity`
- `items[].pickingStatus`

**Implementation steps:**

1. Add picking status constants.
2. Add item picking status constants: pending, picked, missing, partial.
3. Add `ORDER_PICKING_NOT_ALLOWED`.
4. Add `ORDER_ITEM_OPERATION_INVALID`.
5. Add audit events `order.picking.started`, `order.item.picked`,
   `order.item.missing`, and `order.picking.completed`.
6. Extend order model/types/response mapping with picking fields.
7. Keep defaults backward-compatible for existing placed orders.

**Acceptance criteria:**

- Picking fields compile.
- Existing order creation tests still pass.
- No picking routes are exposed yet.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

**Depends on:** Ticket 4.1

## Ticket 4.3 — Start Picking API

**Objective:** Implement store-owned start picking operation for accepted orders.

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

- `POST /api/v1/store/orders/{orderId}/picking/start`

**DB fields:**

- `orderStatus = picking`
- `pickerStatus = in_progress`
- `assignedPickerId`
- `timeline[].event = order.picking.started`

**Implementation steps:**

1. Add route under store orders.
2. Require `orders:update`.
3. Validate `orderId`.
4. Require actor store scope.
5. Allow only assigned-store orders.
6. Allow only accepted orders.
7. Update picking state and append timeline/audit event.
8. Add OpenAPI path.

**Acceptance criteria:**

- Accepted store order can start picking.
- Non-accepted order is rejected.
- Cross-store order is forbidden.
- OpenAPI includes the endpoint.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON check for `/store/orders/{orderId}/picking/start`

**Depends on:** Ticket 4.2

## Ticket 4.4 — Mark Item Picked API

**Objective:** Implement item-level picked quantity update during active
picking.

**Files to create/update:**

- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/items/{itemId}/picked`

**DB fields:**

- `items[].pickedQuantity`
- `items[].missingQuantity`
- `items[].pickingStatus`
- `timeline[].event = order.item.picked`

**Implementation steps:**

1. Add route and validator for `orderId`, `itemId`, and quantity.
2. Require `orders:update`.
3. Require assigned-store ownership.
4. Allow only orders in picking state.
5. Validate item exists in the order.
6. Validate picked plus missing quantity does not exceed ordered quantity.
7. Update item picking status to picked or partial.
8. Append timeline/audit event with item and quantity context.

**Acceptance criteria:**

- Store user can mark an item picked.
- Invalid item fails.
- Quantity above ordered quantity fails.
- Non-picking order fails.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON check for `/store/orders/{orderId}/items/{itemId}/picked`

**Depends on:** Ticket 4.3

## Ticket 4.5 — Mark Item Missing API

**Objective:** Implement item-level missing quantity update during active
picking.

**Files to create/update:**

- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/modules/orders/validators/order.validators.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/items/{itemId}/missing`

**DB fields:**

- `items[].pickedQuantity`
- `items[].missingQuantity`
- `items[].pickingStatus`
- `timeline[].event = order.item.missing`

**Implementation steps:**

1. Add route and validator for `orderId`, `itemId`, and quantity.
2. Require `orders:update`.
3. Require assigned-store ownership.
4. Allow only orders in picking state.
5. Validate item exists in the order.
6. Validate picked plus missing quantity does not exceed ordered quantity.
7. Update item picking status to missing or partial.
8. Append timeline/audit event with item and quantity context.

**Acceptance criteria:**

- Store user can mark an item missing.
- Invalid item fails.
- Quantity above ordered quantity fails.
- Missing item event is recorded.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON check for `/store/orders/{orderId}/items/{itemId}/missing`

**Depends on:** Ticket 4.3

## Ticket 4.6 — Complete Picking API

**Objective:** Complete picking only after all order items are resolved as
picked, missing, or partial.

**Files to create/update:**

- `backend/api/src/modules/orders/routes/store-order.routes.ts`
- `backend/api/src/modules/orders/controllers/order.controller.ts`
- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/repositories/order.repository.ts`
- `backend/api/src/docs/openapi/order.paths.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/picking/complete`

**DB fields:**

- `pickerStatus = completed`
- `timeline[].event = order.picking.completed`

**Implementation steps:**

1. Add complete picking route.
2. Require `orders:update`.
3. Require assigned-store ownership.
4. Allow only orders in picking state.
5. Verify every item has resolved picking state.
6. Set `pickerStatus` to completed.
7. Append timeline/audit event.
8. Do not implement packing start, packing complete, or ready-for-pickup here.

**Acceptance criteria:**

- Picking cannot complete with unresolved items.
- Picking completes once all items are resolved.
- Packing flow is not started in this ticket.
- OpenAPI includes the endpoint.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON check for `/store/orders/{orderId}/picking/complete`

**Depends on:**

- Ticket 4.4
- Ticket 4.5

## Ticket 4.7 — Module 4 Review And Handoff

**Objective:** Review Module 4 implementation and close the handoff.

**Files to create/update:**

- `docs/reviews/phase-5-picking-workflow-backend-review.md`
- `docs/handoffs/phase-5-picking-workflow-backend-complete.md`
- `docs/contracts/phase-5-module-completion-matrix.md`
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_5_HANDOFF.md`

**API endpoints:** Verify all four Module 4 endpoints.

**DB fields:** Verify picking fields and timeline implementation.

**Implementation steps:**

1. Run full Module 4 review.
2. Verify no Module 5, 6, 7, or 9 work was started.
3. Update Module 4 handoff.
4. Mark Module 4 as DONE in completion matrix.
5. Update Phase 5 handoff and current progress.

**Acceptance criteria:**

- Typecheck passes.
- Lint passes.
- Picking tests pass.
- OpenAPI includes all Module 4 endpoints.
- Handoff marks Module 5 as next.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI JSON verification for all four Module 4 endpoints
- `rg "| 4 | Picking Workflow Backend | DONE" docs/contracts/phase-5-module-completion-matrix.md`

**Depends on:** Ticket 4.6
