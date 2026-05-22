# Phase 5 Integration Scope

**Phase:** Phase 5 - Order Lifecycle & Store Operations
**Module:** 16 - Phase 5 Integration & Review
**Status:** Implemented
**Reviewed:** 2026-05-21

## Scope

This document defines the Phase 5 integration boundary at closeout. It is a
review artifact only. It does not create backend routes, frontend screens,
OpenAPI paths, permissions, database fields, jobs, or runtime behavior.

## Included Modules

| Module | Included integration surface |
|---|---|
| 0 | Phase 5 foundation plans, bootstrap readiness, contracts, dependency map |
| 1 | Order lifecycle states, transition matrix, ownership, cancellation, SLA timing |
| 2 | Backend order state reads, transition service, timeline, store/admin APIs |
| 3 | Store accept/reject flow and auto-accept placeholder boundary |
| 4 | Picking workflow backend and item-level picked/missing state |
| 5 | Packing workflow and ready-for-pickup transition |
| 6 | Inventory adjustment during store operations |
| 7 | Customer, store, and admin cancellation backend |
| 8 | Vendor incoming orders surface |
| 9 | Vendor picking and packing surface |
| 10 | Vendor order history and filters |
| 11 | Admin order operations surface |
| 12 | Customer order status visibility surface |
| 13 | Store operation notification placeholders |
| 14 | SLA and escalation foundation |
| 15 | Phase 5 automated and manual validation |
| 16 | Integration review, handoff, release notes, and Phase 6 gate |

## API Endpoint Boundary

Phase 5 includes these order lifecycle endpoint families:

| Actor | Endpoints |
|---|---|
| Customer | `GET /api/v1/customer/orders`, `GET /api/v1/customer/orders/:orderId`, `GET /api/v1/customer/orders/:orderId/state`, `GET /api/v1/customer/orders/:orderId/lifecycle`, `POST /api/v1/customer/orders/:orderId/cancel` |
| Store/vendor | `GET /api/v1/store/orders`, `GET /api/v1/store/orders/:orderId`, `POST /api/v1/store/orders/:orderId/accept`, `POST /api/v1/store/orders/:orderId/reject`, `POST /api/v1/store/orders/:orderId/picking/start`, `POST /api/v1/store/orders/:orderId/items/:itemId/picked`, `POST /api/v1/store/orders/:orderId/items/:itemId/missing`, `POST /api/v1/store/orders/:orderId/picking/complete`, `POST /api/v1/store/orders/:orderId/packing/start`, `POST /api/v1/store/orders/:orderId/packing/complete`, `POST /api/v1/store/orders/:orderId/ready-for-pickup`, `POST /api/v1/store/orders/:orderId/cancel` |
| Admin | `GET /api/v1/admin/orders`, `GET /api/v1/admin/orders/:orderId`, `GET /api/v1/admin/orders/:orderId/timeline`, `POST /api/v1/admin/orders/:orderId/status`, `POST /api/v1/admin/orders/:orderId/cancel` |

Module 13 does not expose a public notification endpoint. Notification records
are created as internal placeholders from lifecycle events.

## Database Field Boundary

Phase 5 extends the order record with lifecycle and operations fields already
implemented by the order model:

| Area | Fields |
|---|---|
| Lifecycle | `orderStatus`, `storeStatus`, `timeline`, `placedAt`, `acceptedAt`, `rejectedAt`, `readyForPickupAt` |
| Picking | `items[].pickedQuantity`, `items[].missingQuantity`, `items[].pickingStatus`, `pickerStatus`, `assignedPickerId` |
| Packing | `packingStatus` |
| Cancellation | `cancelledAt`, `cancelledBy`, `cancellationReason`, `refundReviewRequired`, `rejectionReason` |
| SLA | `slaStatus`, `slaBreachedStage` |
| Phase 4 carried inputs | `orderNumber`, `customerId`, `storeId`, `checkoutSessionId`, `paymentId`, `cartId`, `addressSnapshot`, `items`, totals, `paymentStatus`, `inventoryConfirmed` |

Phase 5 also uses existing inventory movement/audit behavior for missing-item
adjustments and notification placeholder records for lifecycle event fanout.

## Permission Boundary

| Actor | Boundary |
|---|---|
| Customer | Own-order read, lifecycle visibility, and eligible cancellation only |
| Store/vendor | Assigned-store list/detail and lifecycle mutations only |
| Admin | `orders:read`, `orders:update-status`, `orders:cancel`, and SLA-monitoring visibility by role |
| System/job | Internal notification placeholder and SLA marking behavior only |

## Validation Boundary

- Status and transition requests must match the Phase 5 transition matrix.
- Store/vendor operations must pass assigned-store scope before mutation.
- Customer reads and cancellations must pass ownership checks.
- Cancellation and rejection require a trimmed reason up to 500 characters.
- Picked and missing item quantities must be positive and cannot exceed ordered
  quantity.
- Picking completion requires all line items to be resolved.
- Packing and ready-for-pickup require the expected prior lifecycle state.
- SLA filters and delayed marking use known SLA status and breached-stage
  values.

## Out Of Scope

Phase 5 does not include:

- Delivery partner assignment
- Rider pickup workflow
- Live delivery progress
- Delivery OTP handoff
- Refund ledger or settlement execution
- Real-time WebSocket/SSE delivery
- Production notification delivery providers
- Support ticket operations

These remain Phase 6 or later boundaries.

## Review Result

PASS. Phase 5 integration scope is bounded to order lifecycle and store
operations from placement through ready-for-pickup, cancellation, operational
visibility, notification placeholders, and SLA foundation.

