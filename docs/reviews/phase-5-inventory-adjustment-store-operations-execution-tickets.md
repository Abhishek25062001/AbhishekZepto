# Phase 5 Inventory Adjustment During Store Operations Execution Tickets

## Ticket 6.1 — Inventory Adjustment Scope And Contract

**Objective:** Define Module 6 boundaries for inventory adjustment during store
operations, including no public API routes, dependency on picked/missing item
state, and audit expectations.

**Files to create/update:**

- `docs/contracts/phase-5-inventory-adjustment-store-operations.md`
- `docs/reviews/phase-5-inventory-adjustment-store-operations-execution-tickets.md`
- `docs/contracts/phase-5-route-mounting-plan.md`

**API endpoints:** None.

**DB fields:**

- Existing `orders.items[].pickedQuantity`
- Existing `orders.items[].missingQuantity`
- Existing `orders.items[].pickingStatus`
- Existing `orders.timeline[]`
- Existing inventory stock/movement fields

**Implementation steps:**

1. Document Module 6 scope: missing item adjustment, picked quantity
   reconciliation, inventory audit logs.
2. Document dependency on Module 2 and Module 4.
3. Document that Module 6 does not introduce customer/store-facing routes.
4. Document planned audit event `order.inventory.adjusted`.
5. Mark OpenAPI verification as N/A unless a future ticket explicitly adds an
   endpoint.

**Acceptance criteria:**

- Module 6 contract exists.
- No unrelated module behavior is included.
- Route mounting plan confirms no public Module 6 endpoints.
- Dependencies and blocked modules are documented.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `rg "order.inventory.adjusted|Inventory Adjustment" docs`

**Depends on:**

- Module 2 complete
- Module 4 complete

## Ticket 6.2 — Inventory Adjustment Runtime Foundation

**Objective:** Add the backend foundation needed for inventory adjustment
without wiring business execution yet.

**Files to create/update:**

- `backend/api/src/modules/orders/constants/order-audit-events.constant.ts`
- `backend/api/src/modules/orders/types/order-inventory-adjustment.types.ts`
- `docs/architecture/phase-5-audit-logging.md`
- `docs/contracts/phase-5-inventory-adjustment-store-operations.md`

**API endpoints:** None.

**DB fields:** No new DB fields.

**Implementation steps:**

1. Add or confirm `order.inventory.adjusted` audit event constant.
2. Add internal TypeScript types for inventory adjustment inputs/results.
3. Document required adjustment context.
4. Avoid public routes and new persistence fields.

**Acceptance criteria:**

- Audit event is available to backend code.
- Types are internal and scoped to Module 6.
- No feature behavior is triggered yet.
- Docs match the implementation surface.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

**Depends on:** Ticket 6.1

## Ticket 6.3 — Picked Quantity Reconciliation Service

**Objective:** Implement internal reconciliation logic for picked quantities
using existing picked/missing item state.

**Files to create/update:**

- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.ts`
- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.test.ts`
- `backend/api/package.json`
- `docs/contracts/phase-5-inventory-adjustment-store-operations.md`

**API endpoints:** None.

**DB fields:** Existing order item picking fields and inventory stock/movement
fields only.

**Implementation steps:**

1. Create an internal service for order inventory reconciliation.
2. Validate that item picked/missing quantities are resolved before adjustment.
3. Calculate expected picked quantity per item.
4. Produce reconciliation results without adding cancellation, refund, packing,
   or delivery behavior.
5. Add focused unit tests.
6. Ensure `test:customer-orders` includes the new test file if needed.

**Acceptance criteria:**

- Service reconciles picked quantities from existing order item data.
- Invalid unresolved item states are rejected.
- No public endpoint is added.
- Tests cover normal and invalid reconciliation inputs.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

**Depends on:** Ticket 6.2

## Ticket 6.4 — Missing Item Inventory Adjustment

**Objective:** Extend the reconciliation service to handle missing item
quantities and create inventory adjustment/audit output.

**Files to create/update:**

- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.ts`
- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.test.ts`
- `docs/contracts/phase-5-inventory-adjustment-store-operations.md`

**API endpoints:** None.

**DB fields:** Existing order item, inventory movement, inventory stock, and
order timeline/audit fields only.

**Implementation steps:**

1. Identify order items with `missingQuantity > 0`.
2. Validate `pickedQuantity + missingQuantity <= ordered quantity`.
3. Create adjustment behavior using existing inventory movement conventions.
4. Add `order.inventory.adjusted` timeline/audit context with item and quantity
   details.
5. Add tests for missing item adjustment and zero-missing no-op behavior.

**Acceptance criteria:**

- Missing quantities generate inventory adjustment behavior.
- Audit context includes item reference and quantity context.
- No new DB field is introduced.
- Tests verify missing and non-missing paths.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

**Depends on:** Ticket 6.3

## Ticket 6.5 — Wire Inventory Adjustment To Picking Completion

**Objective:** Trigger Module 6 inventory reconciliation only from the completed
picking boundary.

**Files to create/update:**

- `backend/api/src/modules/orders/services/order.service.ts`
- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.ts`
- `backend/api/src/modules/orders/services/order.service.test.ts`
- `backend/api/src/modules/orders/services/order-inventory-adjustment.service.test.ts`
- `docs/contracts/phase-5-inventory-adjustment-store-operations.md`

**API endpoints:** None new.

Existing endpoint behavior updated internally:

- `POST /api/v1/store/orders/{orderId}/picking/complete`

**DB fields:** Existing order item picking fields, inventory movement/stock
fields, and timeline/audit entries only.

**Implementation steps:**

1. Read existing picking completion flow.
2. Call inventory adjustment service only after picking completion validation
   passes.
3. Ensure failed picking completion does not adjust inventory.
4. Ensure adjustment does not start packing or ready-for-pickup behavior.
5. Update tests for picking completion with inventory adjustment.

**Acceptance criteria:**

- Inventory adjustment runs after valid picking completion.
- Invalid picking completion does not adjust inventory.
- Existing picking endpoint contract remains unchanged.
- OpenAPI does not gain new Module 6 endpoints.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`

**Depends on:** Ticket 6.4

## Ticket 6.6 — Module 6 Review, Matrix, And Handoff

**Objective:** Complete Module 6 documentation, review notes, and project
handoff status.

**Files to create/update:**

- `docs/reviews/phase-5-inventory-adjustment-store-operations-review.md`
- `docs/handoffs/phase-5-inventory-adjustment-store-operations-complete.md`
- `docs/contracts/phase-5-module-completion-matrix.md`
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_5_HANDOFF.md`

**API endpoints:** None.

**DB fields:** No new DB fields.

**Implementation steps:**

1. Record tickets completed.
2. Record commands run and results.
3. Record OpenAPI verification as no new public endpoints.
4. Update Phase 5 completion matrix for Module 6.
5. Update current progress and handoff notes.
6. Note downstream dependency readiness for Module 7, Module 15, and Module 16.

**Acceptance criteria:**

- Module 6 marked complete only after tests pass.
- Review file includes scope, implementation summary, and residual risks.
- Handoff clearly identifies next module readiness.
- No unrelated modules are marked complete.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `rg "Module 6|Inventory Adjustment|order.inventory.adjusted" docs project-context`

**Depends on:** Ticket 6.5
