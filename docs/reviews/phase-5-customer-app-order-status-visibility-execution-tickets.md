# Phase 5 Customer App Order Status Visibility Execution Tickets

## Module

Phase 5 Module 12 - Customer App - Order Status Visibility

## Status

In progress.

## Tickets

| Ticket | Status |
|---|---|
| 12.1 - Module 12 Scope And Customer UI Contract | DONE |
| 12.2 - Customer Order Lifecycle Types And Display Rules | DONE |
| 12.3 - Customer Order API Client Extensions | DONE |
| 12.4 - Order History Status Visibility And Refresh | DONE |
| 12.5 - Order Detail Current Status Panel | DONE |
| 12.6 - Customer-Safe Timeline Visibility | DONE |
| 12.7 - Customer Cancellation Action | DONE |
| 12.8 - Cancelled State And Error UX | DONE |
| 12.9 - Customer Order Visibility Tests And Verification Docs | DONE |
| 12.10 - Module 12 Handoff And Progress Closeout | DONE |

## Ticket 12.1 Review

- Created Module 12 customer UI/API/DB boundary contract.
- Created Module 12 execution ticket log.
- API endpoints documented only.
- DB fields documented only; no new fields added.

## Ticket 12.2 Review

- Extended Customer App order types for Phase 5 lifecycle, store operation,
  timeline, and cancellation fields.
- Added customer-safe status labels, descriptions, terminal checks, and
  customer cancellation eligibility helpers.
- Added focused tests for Phase 5 status labels and helper behavior.

## Ticket 12.3 Review

- Implemented customer-safe backend state and lifecycle read endpoints.
- Added Customer App API methods for order state, lifecycle, and cancellation.
- Added query keys for state, lifecycle, and list invalidation.
- Added OpenAPI paths for customer order list, detail, state, lifecycle, and
  cancellation.

## Ticket 12.4 Review

- Updated customer order history queries to include all Phase 5 lifecycle
  statuses instead of filtering to `placed`.
- Added pull-to-refresh behavior to order history.
- Updated history rows to surface current status labels, cancelled styling, and
  accessible status labels.

## Ticket 12.5 Review

- Added an order detail status summary component.
- Displayed current lifecycle status, customer-safe description, and latest
  relevant status timestamp.
- Kept existing address, items, and totals sections intact.

## Ticket 12.6 Review

- Added Customer App lifecycle query hook for customer-safe timeline reads.
- Added order timeline component that renders public status labels, timestamps,
  and optional customer-safe reasons.
- Added timeline display to order detail without exposing actor ids or internal
  store/admin metadata.

## Ticket 12.7 Review

- Added Customer App cancellation mutation hook with detail, state, lifecycle,
  and history query invalidation.
- Added customer cancellation action on order detail for `placed` orders only.
- Added required reason validation and customer-safe cancellation error messages.

## Ticket 12.8 Review

- Added cancelled-order notice on detail with timestamp, reason, and refund
  review placeholder context when returned by backend.
- Updated order success display to tolerate changed/cancelled order status.
- Confirmed cancellation error copy is covered in Customer App order tests.

## Ticket 12.9 Review

- Added customer order status visibility verification document.
- Added Module 12 review document.
- Added pure utility tests for customer-safe lifecycle timeline labels and
  reason display.

## Ticket 12.10 Review

- Added Module 12 completion handoff.
- Marked Module 12 complete in the Phase 5 completion matrix.
- Updated current progress, Phase 5 handoff, and Module 12 review result.
