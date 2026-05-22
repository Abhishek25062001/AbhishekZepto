# Phase 5 Order Cancellation API

## Scope

Phase 5 Module 7 implements backend order cancellation for customer, store, and
admin actors.

This module owns cancellation routes, cancellation state changes, cancellation
reason validation, cancellation audit/timeline events, inventory impact hooks,
and refund-review placeholder metadata.

This module does not implement refund ledger processing, payment refunds,
settlement, support workflows, delivery assignment, rider pickup, live delivery,
notifications, SLA jobs, or frontend UI.

## Dependencies

- Module 1 — Order Lifecycle Architecture
- Module 2 — Backend Order State Management
- Module 6 — Inventory Adjustment During Store Operations

Cancellation depends on lifecycle cutoff rules, backend order state fields, and
inventory release/reconciliation behavior.

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/customer/orders/{orderId}/cancel` | Customer cancels eligible own order |
| POST | `/api/v1/store/orders/{orderId}/cancel` | Store cancels eligible assigned-store order |
| POST | `/api/v1/admin/orders/{orderId}/cancel` | Admin cancels eligible active order |

## Request Body

All cancellation endpoints require:

```json
{
  "reason": "Customer requested cancellation"
}
```

## Actor Rules

| Actor | Allowed cancellation scope | Cutoff |
|-------|----------------------------|--------|
| Customer | Own orders only | `placed` only |
| Store/vendor | Assigned-store orders only | `placed`, `accepted`, `picking`, `packing` |
| Admin | Authorized active orders | Active non-terminal orders before `ready_for_pickup` |

Cancellation is blocked for `ready_for_pickup`, delivery placeholders,
`delivered_placeholder`, and `cancelled`.

## Inventory Impact

- Cancellation before picking releases or reverses allocated inventory using
  existing inventory stock/movement conventions.
- Cancellation during picking/packing must reuse Module 6 reconciliation before
  cancellation finalization.
- Internal cancellation inventory impact is implemented in
  `backend/api/src/modules/orders/services/order-cancellation-inventory.service.ts`.
- Pre-picking cancellation restocks full ordered quantity with existing
  `stock_in` inventory movement records.
- Picking/packing cancellation reuses Module 6 missing-item reconciliation and
  restocks picked quantities.

## Payment / Refund Placeholder

Phase 5 does not execute refunds. Cancellation records whether refund review is
required so later finance/refund modules can process ledger and gateway work.

## DB Fields

Module 7 uses or implements these order fields:

- `orderStatus`
- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `refundReviewRequired`
- `timeline[]`

## Audit And Timeline

Module 7 must emit:

- `order.cancelled`

The audit event constant is implemented in
`backend/api/src/modules/orders/constants/order-audit-events.constant.ts`.

Cancellation audit/timeline context must include order id, previous status,
cancelled status, actor context, reason, and timestamp.

## Customer Cancellation

**Endpoint:** `POST /api/v1/customer/orders/{orderId}/cancel`

### Preconditions

- Authenticated customer owns the order.
- `orderStatus` is `placed`.
- Request body includes non-empty `reason`.

### State Changes

- `orderStatus` becomes `cancelled`.
- `cancellationReason` is set.
- `cancelledAt` is set.
- `cancelledBy.actorType` is `customer`.
- `refundReviewRequired` is set to `true`.
- Timeline event `order.cancelled` is appended.

## Store Cancellation

**Endpoint:** `POST /api/v1/store/orders/{orderId}/cancel`

### Preconditions

- Authenticated store/vendor actor belongs to the order store.
- Actor has store order mutation permission.
- `orderStatus` is `placed`, `accepted`, `picking`, or `packing`.
- Request body includes non-empty `reason`.

### State Changes

- `orderStatus` becomes `cancelled`.
- `cancellationReason` is set.
- `cancelledAt` is set.
- `cancelledBy.actorType` is `store`.
- `refundReviewRequired` is set to `true`.
- Timeline event `order.cancelled` is appended.

## Admin Cancellation

**Endpoint:** `POST /api/v1/admin/orders/{orderId}/cancel`

### Preconditions

- Authenticated admin actor is in the mounted admin route group.
- Actor has `orders:cancel`.
- `orderStatus` is `placed`, `accepted`, `picking`, or `packing`.
- Request body includes non-empty `reason`.

### State Changes

- `orderStatus` becomes `cancelled`.
- `cancellationReason` is set.
- `cancelledAt` is set.
- `cancelledBy.actorType` is `admin`.
- `refundReviewRequired` is set to `true`.
- Timeline event `order.cancelled` is appended.

## Out Of Scope

- Refund execution
- Ledger or settlement entries
- Support workflow tasks
- Delivery lifecycle behavior
- Notifications and SLA jobs
- Customer, vendor, or admin frontend UI
