# Phase 5 Admin Dashboard Order Operations UI Contract

## Scope

Phase 5 Module 11 implements Admin Dashboard order operations visibility and
actions. This module covers admin order list, filters, order detail, timeline
visibility, status update, and admin cancellation UI wiring.

This module uses the Phase 5 backend order lifecycle and cancellation contracts.
It does not implement SLA computation jobs, notifications, refund execution,
support workflows, delivery assignment, rider pickup, live delivery progress,
or finance ledger behavior.

## Dependencies

- Module 2 - Backend Order State Management
- Module 3 - Store Acceptance Flow
- Module 5 - Packing & Ready-for-Pickup Flow
- Module 7 - Order Cancellation Backend

## Admin Routes

| Surface | Route | Permission |
|---------|-------|------------|
| Order list | `/orders` | `orders:read` |
| Order detail | `/orders/:orderId` | `orders:read` |
| Status update action | order detail | `orders:update-status` |
| Cancellation action | order detail | `orders:cancel` |
| SLA visibility | order list/detail | `orders:monitor-sla` when enforced by UI helper |

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/admin/orders` | Admin order list with filters |
| GET | `/api/v1/admin/orders/{orderId}` | Admin order detail |
| GET | `/api/v1/admin/orders/{orderId}/timeline` | Admin timeline view |
| POST | `/api/v1/admin/orders/{orderId}/status` | Admin status update |
| POST | `/api/v1/admin/orders/{orderId}/cancel` | Admin cancellation |

## List Filters

Admin order list supports only the filters documented in
`docs/contracts/phase-5-admin-order-api.md`:

| Filter | Purpose |
|--------|---------|
| `status` | Lifecycle/order status |
| `storeStatus` | Store operation status |
| `storeId` | Store filter |
| `cityId` | City filter |
| `paymentStatus` | Payment status |
| `customerId` | Customer filter |
| `slaStatus` | SLA state display/filter placeholder |
| `slaBreachedStage` | SLA breached stage display/filter placeholder |
| `fromDate` / `toDate` | Order creation date range |
| `page` / `limit` | Pagination |
| `sort` | Created date, status, or SLA-priority sort |

## List Columns

- Order number
- Customer id
- Store id
- City id
- Order status
- Store status
- Payment status
- Grand total
- Created date
- Accepted date
- SLA status
- SLA breached stage

## Detail Sections

| Section | Contents |
|---------|----------|
| Summary | Order id, order number, customer, store, city, totals, timestamps |
| Payment | Payment id/status/summary when present |
| Items | Product/variant snapshots, ordered/picked/missing quantities |
| State | `orderStatus`, `storeStatus`, `pickerStatus`, `packingStatus` |
| Timeline | Admin-visible lifecycle and operational events |
| SLA | `slaStatus`, `slaBreachedStage`, and stage timestamps when present |
| Cancellation | Reason, actor, timestamp, refund review placeholder |

## Action Rules

- Status update is visible only with `orders:update-status`.
- Cancellation is visible only with `orders:cancel`.
- Frontend guards may hide impossible actions for terminal states, but the
  backend remains the source of truth for status transition and cancellation
  eligibility.
- Cancellation requires a non-empty reason up to the backend limit.

## DB Fields

No new DB fields are introduced by this UI contract.

Module 11 reads or updates existing Phase 5 fields:

- `orderStatus`
- `storeStatus`
- `paymentStatus`
- `pickerStatus`
- `packingStatus`
- `timeline[]`
- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `refundReviewRequired`
- `slaStatus`
- `slaBreachedStage`

## Out Of Scope

- SLA computation or escalation jobs
- Notification dispatch
- Refund processing or ledger entries
- Support workflow/task creation
- Delivery assignment, rider pickup, live tracking, or delivered lifecycle
- New store/vendor/customer functionality
