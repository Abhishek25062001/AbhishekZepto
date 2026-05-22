# Phase 5 Customer App Order Status Visibility UI Contract

## Scope

Phase 5 Module 12 updates the Customer App order surfaces so customers can see
the current order lifecycle state, customer-safe timeline progress,
cancellation eligibility, and cancelled state after Phase 5 store operations.

This module uses the Phase 5 backend order lifecycle and cancellation contracts.
It does not add live delivery tracking, notifications, refund ledger processing,
support workflows, SLA escalation jobs, rider assignment, or delivery OTP flows.

## Dependencies

- Module 2 - Backend Order State Management
- Module 7 - Order Cancellation Backend
- Existing Phase 4 Customer App order success, detail, and history screens

## Customer App Screens

| Screen | Route | Module 12 behavior |
|---|---|---|
| OrderHistory | `OrderHistory` | Shows current lifecycle status per order and supports refresh after cancellation |
| OrderDetail | `OrderDetail` | Shows current status, customer-safe timeline, cancellation action when eligible, and cancelled state |
| OrderSuccess | `OrderSuccess` | Continues to link to detail and must tolerate cancelled/updated detail responses |

## API Endpoints

| Method | Path | Use |
|---|---|---|
| GET | `/api/v1/customer/orders` | Order history with Phase 5 status fields |
| GET | `/api/v1/customer/orders/{orderId}` | Order detail with lifecycle, cancellation, and status fields |
| GET | `/api/v1/customer/orders/{orderId}/state` | Customer-safe current lifecycle state |
| GET | `/api/v1/customer/orders/{orderId}/lifecycle` | Customer-safe lifecycle/timeline history |
| POST | `/api/v1/customer/orders/{orderId}/cancel` | Customer cancels an eligible own order |

## Customer Visible Statuses

| Status | Label | Notes |
|---|---|---|
| `placed` | Order placed | Customer cancellation allowed by Phase 5 cancellation rules |
| `accepted` | Store accepted | Store has accepted the order |
| `picking` | Picking items | Store is picking order items |
| `packing` | Packing order | Store is packing order items |
| `ready_for_pickup` | Ready for pickup | Store marked order ready for delivery pickup |
| `shipped_placeholder` | On the way | Placeholder only; live delivery is Phase 6+ |
| `delivered_placeholder` | Delivered | Placeholder only; final delivery is Phase 6+ |
| `cancelled` | Cancelled | Terminal customer-visible state |

## Cancellation Rules

- Customer cancellation is visible only for own orders in `placed` state.
- Cancellation requires a non-empty reason.
- Backend remains the source of truth for cancellation eligibility.
- Successful cancellation must refresh order detail and history state.

## Customer-Safe Timeline Rules

Customer timeline display may show:

- public lifecycle labels
- event timestamp
- cancellation reason when returned by the backend

Customer timeline display must not show:

- internal actor ids
- store-only notes
- admin-only metadata
- inventory adjustment internals
- operational audit-only details

## DB Fields

No new DB fields are introduced by this module. It reads existing order fields:

- `orderStatus`
- `storeStatus`
- `pickerStatus`
- `packingStatus`
- `readyForPickupAt`
- `acceptedAt`
- `cancelledAt`
- `cancellationReason`
- `cancelledBy`
- `refundReviewRequired`
- `timeline[]`
- `lifecycle[]` when present

## Permissions And Ownership

- Customer routes require authenticated customer scope.
- Customer reads and cancellation must verify order ownership.
- Customer UI does not expose admin or store permissions.

## Validation

- `orderId` must be a valid order id.
- Cancellation reason is required and trimmed by backend validation.
- Unknown or unavailable statuses must fall back to safe customer copy.

