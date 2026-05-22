# Phase 5 Audit Logging

## Scope

This document plans audit and timeline events for Phase 5 order lifecycle and
store operations. It does not create audit services, logger code, database
models, or middleware.

## Planned Audit Events

| Event | Source module | Actor |
|-------|---------------|-------|
| `order.lifecycle.transitioned` | Backend Order State Management | Admin/system |
| `order.status.updated` | Backend Order State Management | Admin/system |
| `order.store.accepted` | Store Acceptance Flow | Store/vendor |
| `order.store.rejected` | Store Acceptance Flow | Store/vendor |
| `order.acceptance.timeout` | Store Acceptance Flow | System/job |
| `order.picking.started` | Picking Workflow Backend | Store/vendor — implemented Ticket 4.2 |
| `order.item.picked` | Picking Workflow Backend | Store/vendor — implemented Ticket 4.2 |
| `order.item.missing` | Picking Workflow Backend | Store/vendor — implemented Ticket 4.2 |
| `order.picking.completed` | Picking Workflow Backend | Store/vendor — implemented Ticket 4.2 |
| `order.packing.started` | Packing & Ready-for-Pickup Flow | Store/vendor — implemented Ticket 5.2 |
| `order.packing.completed` | Packing & Ready-for-Pickup Flow | Store/vendor — implemented Ticket 5.2 |
| `order.ready_for_pickup` | Packing & Ready-for-Pickup Flow | Store/vendor — implemented Ticket 5.2 |
| `order.inventory.adjusted` | Inventory Adjustment During Store Operations | System/store — implemented Ticket 6.2 |
| `order.cancelled` | Order Cancellation Backend | Customer/store/admin — implemented Ticket 7.2 |
| `order.sla.breached` | SLA & Escalation Foundation | System/job — implemented Ticket 14.6 |

## Transition Event Mapping

| Transition | Required event |
|------------|----------------|
| `placed -> accepted` | `order.store.accepted` |
| `placed -> cancelled` | `order.cancelled` |
| `accepted -> picking` | `order.picking.started` |
| `accepted -> cancelled` | `order.cancelled` |
| `picking -> packing` | `order.picking.completed` |
| `picking -> cancelled` | `order.cancelled` |
| `packing -> ready_for_pickup` | `order.ready_for_pickup` |
| `packing -> cancelled` | `order.cancelled` |
| `ready_for_pickup -> shipped_placeholder` | `order.lifecycle.transitioned` |
| `shipped_placeholder -> delivered_placeholder` | `order.lifecycle.transitioned` |
| active order -> SLA breach marker | `order.sla.breached` |

## Module 3 Store Acceptance Audit

Store accept/reject actions must append timeline/audit records:

| Action | Event | Required metadata |
|--------|-------|-------------------|
| Accept placed order | `order.store.accepted` | `fromStatus`, `toStatus`, actor metadata, timestamp |
| Reject placed order | `order.store.rejected` | `fromStatus`, `toStatus`, actor metadata, timestamp, reason |

Rejection events require a non-empty reason.

## Planned Event Fields

- `orderId`
- `event`
- `fromStatus`
- `toStatus`
- `actorId`
- `actorType`
- `actorRole`
- `reason`
- `notes`
- `createdAt`

Timeline service architecture is documented in:

- `docs/architecture/phase-5-order-timeline-service.md`

## Rules

- Every state-changing Phase 5 operation must append a timeline/audit event.
- Every transition listed in `docs/contracts/order-state-transition-matrix.md`
  must include `fromStatus`, `toStatus`, actor metadata, and timestamp.
- Cancellation and rejection events require a reason.
- Missing item events require item reference and quantity context in the
  implementation ticket.
- SLA breach events are system-generated.
- Audit/timeline records must not expose another customer's order data.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
