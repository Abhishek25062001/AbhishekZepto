# Phase 5 Module 9 — Vendor Panel Picking & Packing — Complete

## Status

Complete.

## Summary

Module 9 implements the Vendor Panel active order workflow for store operators.
It consumes the existing Module 4 and Module 5 backend endpoints for picking,
packing, and ready-for-pickup operations.

## Implemented Scope

- Active orders list at `/orders/active`.
- Active order detail at `/orders/active/:orderId`.
- Vendor Panel API helpers for picking and packing operations.
- Start picking action.
- Item picked and missing quantity forms.
- Complete picking action.
- Start packing, complete packing, and ready-for-pickup actions.
- Permission helpers for active order reads and store-operation mutations.
- Workflow guards for Module 4 and Module 5 lifecycle states.

## API Endpoints Consumed

- `GET /api/v1/store/orders`
- `GET /api/v1/store/orders/{orderId}`
- `POST /api/v1/store/orders/{orderId}/picking/start`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/picked`
- `POST /api/v1/store/orders/{orderId}/items/{itemId}/missing`
- `POST /api/v1/store/orders/{orderId}/picking/complete`
- `POST /api/v1/store/orders/{orderId}/packing/start`
- `POST /api/v1/store/orders/{orderId}/packing/complete`
- `POST /api/v1/store/orders/{orderId}/ready-for-pickup`

## Files Created

- `docs/contracts/phase-5-vendor-picking-packing-ui-contract.md`
- `docs/reviews/phase-5-vendor-panel-picking-packing-execution-tickets.md`
- `docs/reviews/phase-5-vendor-panel-picking-packing-review.md`
- `apps/vendor-panel/src/modules/orders/hooks/useVendorActiveOrders.ts`
- `apps/vendor-panel/src/modules/orders/pages/VendorActiveOrdersPage.tsx`
- `apps/vendor-panel/src/modules/orders/pages/VendorActiveOrderDetailPage.tsx`
- `apps/vendor-panel/src/modules/orders/pages/vendor-active-orders-page.test.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorActiveOrdersTable.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorActiveOrdersEmptyState.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorActiveOrdersErrorState.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorStartPickingAction.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorPickingItemsTable.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorCompletePickingAction.tsx`
- `apps/vendor-panel/src/modules/orders/components/VendorPackingActions.tsx`
- `apps/vendor-panel/src/modules/orders/forms/vendor-order-item-quantity.schema.ts`
- `apps/vendor-panel/src/modules/orders/forms/vendor-order-item-quantity.schema.test.ts`
- `apps/vendor-panel/src/modules/orders/forms/VendorOrderItemQuantityForm.tsx`
- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-workflow.util.ts`

## Files Updated

- `apps/vendor-panel/src/modules/orders/api/vendor-orders.api.ts`
- `apps/vendor-panel/src/modules/orders/types/vendor-orders.types.ts`
- `apps/vendor-panel/src/modules/orders/hooks/useVendorOrderMutations.ts`
- `apps/vendor-panel/src/modules/orders/pages/VendorIncomingOrderDetailPage.tsx`
- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-display.util.ts`
- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-permissions.util.ts`
- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-permissions.util.test.ts`
- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-query.util.ts`
- `apps/vendor-panel/src/modules/orders/utils/vendor-orders-query.util.test.ts`
- `apps/vendor-panel/src/routes/vendor.routes.tsx`
- `apps/vendor-panel/src/components/layout/Sidebar.tsx`
- `docs/security/phase-5-permissions.md`
- `docs/contracts/phase-5-module-completion-matrix.md`
- `project-context/CURRENT_PROGRESS.md`
- `project-context/PHASE_HANDOFFS/PHASE_5_HANDOFF.md`

## Verification

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run test:customer-orders -w backend/api`
- OpenAPI verification for consumed Module 9 operation endpoints
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run test:vendor-orders -w apps/vendor-panel`
- `npm run test:access-control-smoke -w apps/vendor-panel`

## Notes

- No new backend endpoints or DB fields were introduced by Module 9.
- Backend order tests still emit a pre-existing Mongoose duplicate index warning
  for `{"isDeleted":1}`.
- Module 10 — Vendor Panel - Order History & Filters can be ticketized next.
