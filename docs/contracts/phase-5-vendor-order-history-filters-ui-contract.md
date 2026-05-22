# Phase 5 Vendor Panel Order History & Filters UI Contract

## Scope

Phase 5 Module 10 implements the Vendor Panel order history and supported
filters experience for store-scoped users.

This module covers store order history list, supported filters, read-only
history detail, timeline display, cancellation metadata display, and store
cancellation UI that consumes the existing Module 7 backend endpoint.

This module does not implement new backend order endpoints, unsupported filter
fields, notifications, SLA jobs, delivery handoff, admin UI, customer UI, or
real-time updates.

## Dependencies

- Module 2 — Backend Order State Management
- Module 7 — Order Cancellation Backend
- Module 8 — Vendor Panel - Incoming Orders
- Module 9 — Vendor Panel - Picking & Packing

Module 10 consumes the existing store order read surface and the existing store
order cancellation endpoint.

## API Endpoints Consumed

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/store/orders` | List store-scoped history orders with supported filters |
| GET | `/api/v1/store/orders/{orderId}` | Fetch store-scoped history order detail |
| POST | `/api/v1/store/orders/{orderId}/cancel` | Cancel an eligible store order with a reason |

## Supported Filters

Module 10 uses only filter fields already supported by the store order list API:

- `status`
- `storeStatus`
- `paymentStatus`
- `page`
- `limit`

Date range, free-text search, sort controls, SLA filters, and delivery filters
are out of scope unless a later backend module adds them.

## History List

The history list shows store orders outside the incoming-only and active-only
operator queues, while still allowing the vendor to filter by supported status
fields.

Display fields:

- order number
- order status
- store status
- payment status
- grand total
- placed time
- last updated or accepted time when available

## History Detail

The history detail view shows:

- order summary
- ordered items and totals
- store-visible lifecycle state
- cancellation metadata when present
- read-only timeline

Store detail must not expose admin-only notes, cross-store data, future delivery
lifecycle data, or customer-only controls.

## Status And Cancellation Display

- Cancelled order status and rejected store status must be visually
  distinguishable.
- Cancellation reason takes precedence over rejection reason when both are
  present.
- Refund review is display-only and does not start any refund workflow.
- Timeline events remain read-only.

## Store Cancellation Behavior

- Store cancellation calls `POST /api/v1/store/orders/{orderId}/cancel`.
- The body includes a required `reason`.
- Backend Module 7 remains the source of truth for cancellation eligibility.
- Successful cancellation refreshes history/detail data.
- No admin or customer cancellation UI is added by Module 10.

## Permissions

- Vendor Panel history routes require authenticated vendor/store session.
- History list and detail require `orders:read`.
- Store cancellation action requires `orders:update`.
- All backend reads and mutations remain scoped to the authenticated actor's
  `storeId`.
- Permission and workflow helpers are implemented in the Vendor Panel orders
  utilities. Frontend guards only control visibility; backend policy remains the
  source of truth.

## Validation

- Cancellation reason is required, trimmed, and capped consistently with the
  backend cancellation contract.
- Unsupported filter values are not sent.
- Empty filter values are omitted from API requests.
- Backend validation and conflict errors must be shown near the relevant action.

## Audit Logging

Module 10 does not add backend audit events. Store cancellation UI triggers the
existing Module 7 cancellation timeline/audit behavior.

## DB Fields

No new DB fields are introduced by Module 10.

Existing fields used:

- `orderStatus`
- `storeStatus`
- `paymentStatus`
- `createdAt`
- `updatedAt`
- `placedAt`
- `acceptedAt`
- `rejectedAt`
- `rejectionReason`
- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `refundReviewRequired`
- `readyForPickupAt`
- `items[]`
- `timeline[]`

## Out Of Scope

- Backend route implementation
- New repository filters beyond the existing store order list API
- Date range or search filters
- Refund workflow
- Notifications
- SLA evaluation jobs
- Delivery assignment and rider handoff
- Admin and customer UI
