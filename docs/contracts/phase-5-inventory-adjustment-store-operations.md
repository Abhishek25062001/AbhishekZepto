# Phase 5 Inventory Adjustment During Store Operations

## Scope

Phase 5 Module 6 implements backend inventory reconciliation for store
operations after item-level picking has resolved picked and missing quantities.

This module owns picked quantity reconciliation, missing item inventory
adjustment, and inventory adjustment audit/timeline records.

This module does not implement new public API routes, cancellation, refunds,
packing, delivery assignment, rider pickup, delivery OTP, live delivery,
notifications, SLA jobs, or vendor-panel UI.

## Dependencies

- Module 2 — Backend Order State Management
- Module 4 — Picking Workflow Backend

Inventory adjustment depends on item-level picked and missing state from the
picking workflow. It blocks cancellation inventory release rules in Module 7 and
Phase 5 testing/integration review modules.

## API Endpoints

No public API endpoints are introduced by Module 6.

Module 6 runs as internal backend behavior connected to store operation
boundaries. OpenAPI verification for this module is therefore N/A unless a
future ticket explicitly adds a public endpoint.

## Operational Boundary

Inventory adjustment runs only after picking completion validation succeeds.
Invalid or unresolved picking state must not adjust inventory.

The existing picking completion route is the integration boundary:

- `POST /api/v1/store/orders/{orderId}/picking/complete`

No request/response contract changes are introduced for that endpoint.

Picked quantity reconciliation is implemented in
`backend/api/src/modules/orders/services/order-inventory-adjustment.service.ts`.
The service requires every item to have fully resolved picked and missing
quantities before inventory adjustment can continue.

Missing item adjustment creates an append-only inventory movement using the
existing `inventory_movements` collection and emits the
`order.inventory.adjusted` audit event. No stock quantity fields are changed by
the missing-item movement; the movement records the operational reconciliation
against the order reference.

When missing items are adjusted during picking completion, the order timeline
also receives `order.inventory.adjusted` with the total missing quantity and
reason `missing_item_reconciliation`.

## DB Fields

Module 6 uses existing fields only:

- `orders.items[].pickedQuantity`
- `orders.items[].missingQuantity`
- `orders.items[].pickingStatus`
- `orders.timeline[]`
- Existing `inventory_stocks` quantity fields
- Existing `inventory_movements` records

No new DB fields are planned for Module 6.

## Audit And Timeline

Module 6 must emit:

- `order.inventory.adjusted`

The audit event constant is implemented in
`backend/api/src/modules/orders/constants/order-audit-events.constant.ts`.

Adjustment audit/timeline context must include order id, store id, item/store
product id, picked quantity, missing quantity, ordered quantity, and adjustment
reason.

## Out Of Scope

- New public order or inventory endpoints
- Customer, admin, or vendor-panel UI
- Cancellation and refund processing
- Packing or ready-for-pickup transitions
- Delivery lifecycle transitions
- SLA breach jobs or notifications
