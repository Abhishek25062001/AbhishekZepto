# Phase 5 Vendor Panel Picking & Packing Execution Tickets

## Module

Phase 5 — Order Lifecycle & Store Operations  
Module 9 — Vendor Panel - Picking & Packing

## Ticket Status

| Ticket | Name | Status | Depends on |
|--------|------|--------|------------|
| 9.1 | Module 9 Scope And UI Contract | DONE | Modules 4, 5, 8 |
| 9.2 | Vendor Picking/Packing API Client Extensions | DONE | 9.1 |
| 9.3 | Active Orders List View | DONE | 9.2 |
| 9.4 | Start Picking Action | DONE | 9.3 |
| 9.5 | Item Picked And Missing Workflow | DONE | 9.4 |
| 9.6 | Complete Picking Action | DONE | 9.5 |
| 9.7 | Packing And Ready-For-Pickup Actions | DONE | 9.6 |
| 9.8 | Permission Visibility And Workflow Guards | DONE | 9.7 |
| 9.9 | Module 9 Review, Matrix, And Handoff | DONE | 9.1-9.8 |

## Scope Guard

Module 9 must not implement backend picking/packing routes, Module 10 order
history filters, store cancellation, Module 13 notifications, Module 14 SLA
jobs, delivery handoff, admin UI, or customer UI.

## Tickets

### Ticket 9.1 — Module 9 Scope And UI Contract

**Objective:** Define Vendor Panel picking and packing scope, boundaries,
endpoint consumption, permissions, validation, audit, and DB-field expectations.

**Files to create/update:**

- `docs/contracts/phase-5-vendor-picking-packing-ui-contract.md`
- `docs/reviews/phase-5-vendor-panel-picking-packing-execution-tickets.md`

**API endpoints:** Document planned consumption of store order read, picking,
packing, and ready-for-pickup endpoints. No new endpoints.

**DB fields:** Document existing order lifecycle, picking, packing, item, and
timeline fields. No new DB fields.

**Implementation steps:**

1. Create the Module 9 UI contract.
2. Create this execution ticket ledger.
3. Confirm Module 9 dependencies on Modules 4, 5, and 8.
4. Record permission, audit logging, validation, and out-of-scope rules.

**Acceptance criteria:**

- Contract lists all consumed Module 4 and Module 5 endpoints.
- Contract lists `orders:read` and `orders:update` visibility rules.
- Contract states no new DB fields.
- Ticket ledger tracks Tickets 9.1 through 9.9.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `test -f docs/contracts/phase-5-vendor-picking-packing-ui-contract.md`

**Depends on:** Modules 4, 5, and 8.

### Ticket 9.2 — Vendor Picking/Packing API Client Extensions

**Objective:** Add Vendor Panel API helpers, types, and active-order query
helpers for picking, packing, and ready-for-pickup endpoints.

**Files to create/update:**

- `apps/vendor-panel/src/modules/orders/api/vendor-orders.api.ts`
- `apps/vendor-panel/src/modules/orders/types/vendor-orders.types.ts`
- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-query.util.ts`
- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-query.util.test.ts`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/picking/start`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/picked`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/missing`
- `POST /api/v1/store/orders/{orderId}/picking/complete`
- `POST /api/v1/store/orders/{orderId}/packing/start`
- `POST /api/v1/store/orders/{orderId}/packing/complete`
- `POST /api/v1/store/orders/{orderId}/ready-for-pickup`

**DB fields:** No new DB fields.

**Implementation steps:**

1. Add request payload and mutation response types.
2. Add API client helpers for picking, item, packing, and ready-for-pickup
   mutations.
3. Add active order list query helper for accepted/picking/packing/
   ready-for-pickup states.
4. Extend query utility tests.

**Acceptance criteria:**

- API helpers call only Module 4 and Module 5 endpoints.
- Quantity payload type supports positive integer validation by callers.
- Active order query helper excludes `placed`, `rejected`, and `cancelled`.
- Tests cover query param construction.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`

**Depends on:** Ticket 9.1.

### Ticket 9.3 — Active Orders List View

**Objective:** Add active picking/packing order list route, page, hook, table,
empty state, and error state.

**Files to create/update:**

- `apps/vendor-panel/src/modules/orders/hooks/useVendorActiveOrders.ts`
- `apps/vendor-panel/src/modules/orders/pages/VendorActiveOrdersPage.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorActiveOrdersTable.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorActiveOrdersEmptyState.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorActiveOrdersErrorState.tsx`
- `apps/vendor-panel/src/modules/orders/pages/vendor-active-orders-page.test.tsx`
- `apps/vendor-panel/src/routes/vendor.routes.tsx`
- `apps/vendor-panel/src/components/layout/Sidebar.tsx`

**API endpoints:**

- `GET /api/v1/store/orders`

**DB fields:** No new DB fields.

**Implementation steps:**

1. Add active orders hook using the active-order query helper.
2. Add active orders list components.
3. Add `/orders/active` route protected by `orders:read`.
4. Add sidebar navigation for Active Orders.
5. Add tests for list columns and query defaults.

**Acceptance criteria:**

- `/orders/active` renders active accepted/picking/packing/ready orders.
- Empty/error/loading states are present.
- Navigation remains permission gated by `orders:read`.
- Incoming order route remains unchanged.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`

**Depends on:** Ticket 9.2.

### Ticket 9.4 — Start Picking Action

**Objective:** Add Vendor Panel start-picking action on eligible accepted order
details.

**Files to create/update:**

- `apps/vendor-panel/src/modules/orders/hooks/useVendorOrderMutations.ts`
- `apps/vendor-panel/src/modules/orders/components/VendorStartPickingAction.tsx`
- `apps/vendor-panel/src/modules/orders/pages/VendorIncomingOrderDetailPage.tsx`
- `apps/vendor-panel/src/modules/orders/pages/VendorActiveOrderDetailPage.tsx`
- `apps/vendor-panel/src/modules/orders/pages/vendor-active-orders-page.test.tsx`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/picking/start`

**DB fields:** Backend mutates existing `orderStatus`, `pickerStatus`,
`assignedPickerId`, and `timeline[]`.

**Implementation steps:**

1. Add start-picking mutation to the Vendor Panel mutation hook.
2. Add permission-gated start-picking action component.
3. Surface action on order detail when backend state is accepted and picking has
   not started.
4. Refresh active and detail queries after success.
5. Add workflow guard tests.

**Acceptance criteria:**

- Start picking is shown only for eligible accepted orders.
- Action requires `orders:update`.
- Mutation refreshes list/detail queries after success.
- Backend error text is shown near the action.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- OpenAPI verification for `/store/orders/{orderId}/picking/start`

**Depends on:** Ticket 9.3.

### Ticket 9.5 — Item Picked And Missing Workflow

**Objective:** Add item picked/missing quantity forms and picking items table for
active picking orders.

**Files to create/update:**

- `apps/vendor-panel/src/modules/orders/forms/vendor-order-item-quantity.schema.ts`
- `apps/vendor-panel/src/modules/orders/forms/vendor-order-item-quantity.schema.test.ts`
- `apps/vendor-panel/src/modules/orders/forms/VendorOrderItemQuantityForm.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorPickingItemsTable.tsx`
- `apps/vendor-panel/src/modules/orders/hooks/useVendorOrderMutations.ts`
- `apps/vendor-panel/src/modules/orders/pages/VendorActiveOrderDetailPage.tsx`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/items/{itemId}/picked`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/missing`

**DB fields:** Backend mutates existing `items[].pickedQuantity`,
`items[].missingQuantity`, `items[].pickingStatus`, and `timeline[]`.

**Implementation steps:**

1. Add quantity schema requiring positive integer quantities.
2. Add reusable item quantity form.
3. Add picked and missing item mutations.
4. Add picking items table with ordered, picked, missing, remaining, and action
   controls.
5. Refresh active and detail queries after success.

**Acceptance criteria:**

- Quantity validation rejects zero, negative, and decimal values.
- Item action `itemId` uses `storeProductId`.
- Picked/missing controls appear only during active picking.
- Backend conflict/validation errors are displayed.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- OpenAPI verification for picked/missing item endpoints

**Depends on:** Ticket 9.4.

### Ticket 9.6 — Complete Picking Action

**Objective:** Add complete-picking action after every order item is resolved.

**Files to create/update:**

- `apps/vendor-panel/src/modules/orders/hooks/useVendorOrderMutations.ts`
- `apps/vendor-panel/src/modules/orders/components/VendorCompletePickingAction.tsx`
- `apps/vendor-panel/src/modules/orders/pages/VendorActiveOrderDetailPage.tsx`
- `apps/vendor-panel/src/modules/orders/pages/vendor-active-orders-page.test.tsx`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/picking/complete`

**DB fields:** Backend mutates existing `pickerStatus`, `orderStatus`,
`timeline[]`, and Module 6 inventory adjustment state.

**Implementation steps:**

1. Add complete-picking mutation.
2. Add workflow guard that requires active picking and all items resolved.
3. Add permission-gated action component.
4. Refresh active and detail queries after success.
5. Add tests for resolved-item guard.

**Acceptance criteria:**

- Complete picking is hidden/disabled until all items are resolved.
- Action requires `orders:update`.
- Backend errors are displayed.
- Success refreshes active orders and detail.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- OpenAPI verification for `/store/orders/{orderId}/picking/complete`

**Depends on:** Ticket 9.5.

### Ticket 9.7 — Packing And Ready-For-Pickup Actions

**Objective:** Add start-packing, complete-packing, and ready-for-pickup actions
for eligible active orders.

**Files to create/update:**

- `apps/vendor-panel/src/modules/orders/hooks/useVendorOrderMutations.ts`
- `apps/vendor-panel/src/modules/orders/components/VendorPackingActions.tsx`
- `apps/vendor-panel/src/modules/orders/pages/VendorActiveOrderDetailPage.tsx`
- `apps/vendor-panel/src/modules/orders/pages/vendor-active-orders-page.test.tsx`

**API endpoints:**

- `POST /api/v1/store/orders/{orderId}/packing/start`
- `POST /api/v1/store/orders/{orderId}/packing/complete`
- `POST /api/v1/store/orders/{orderId}/ready-for-pickup`

**DB fields:** Backend mutates existing `packingStatus`, `orderStatus`,
`readyForPickupAt`, and `timeline[]`.

**Implementation steps:**

1. Add packing and ready-for-pickup mutations.
2. Add workflow guards for each packing transition.
3. Add permission-gated packing action component.
4. Refresh active and detail queries after success.
5. Add tests for packing action visibility rules.

**Acceptance criteria:**

- Start packing appears only after picking completion.
- Complete packing appears only during active packing.
- Ready-for-pickup appears only after packing completion.
- Actions require `orders:update` and show backend errors.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- OpenAPI verification for packing and ready-for-pickup endpoints

**Depends on:** Ticket 9.6.

### Ticket 9.8 — Permission Visibility And Workflow Guards

**Objective:** Centralize Vendor Panel picking/packing permission and workflow
visibility rules.

**Files to create/update:**

- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-permissions.util.ts`
- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-permissions.util.test.ts`
- `docs/security/phase-5-permissions.md`
- `docs/contracts/phase-5-vendor-picking-packing-ui-contract.md`

**API endpoints:** No new endpoints.

**DB fields:** No new DB fields.

**Implementation steps:**

1. Add helper rules for active-order read and operation updates.
2. Add helper rules for picking and packing workflow visibility.
3. Extend permission utility tests.
4. Update Phase 5 permissions documentation.

**Acceptance criteria:**

- Read views remain gated by `orders:read`.
- Mutating actions remain gated by `orders:update`.
- Workflow guards match Module 4 and Module 5 backend states.
- Permissions documentation mentions Vendor Panel picking/packing visibility.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- `npm run test:access-control-smoke -w apps/vendor-panel`

**Depends on:** Ticket 9.7.

### Ticket 9.9 — Module 9 Review, Matrix, And Handoff

**Objective:** Complete Module 9 closeout documentation and update Phase 5
status files.

**Files to create/update:**

- `docs/reviews/phase-5-vendor-panel-picking-packing-review.md`
- `docs/handoffs/phase-5-vendor-panel-picking-packing-complete.md`
- `docs/contracts/phase-5-module-completion-matrix.md`
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_5_HANDOFF.md`

**API endpoints:** No new endpoints beyond consumed Module 4 and Module 5
endpoints.

**DB fields:** No new DB fields.

**Implementation steps:**

1. Document completed tickets and verified scope.
2. Record commands and OpenAPI checks.
3. Mark Module 9 complete in the Phase 5 completion matrix.
4. Update current progress and Phase 5 handoff next-module pointer.

**Acceptance criteria:**

- Module 9 review file exists and states pass/fail result.
- Module 9 handoff file exists.
- Matrix marks Module 9 `DONE`.
- Project context points to Module 10 next.

**Test commands:**

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- `npm run test:access-control-smoke -w apps/vendor-panel`
- OpenAPI verification for all consumed Module 9 operation endpoints

**Depends on:** Tickets 9.1 through 9.8.

## Review Commands

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI verification for any endpoint added by the ticket
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- `npm run test:access-control-smoke -w apps/vendor-panel` for permission closeout
