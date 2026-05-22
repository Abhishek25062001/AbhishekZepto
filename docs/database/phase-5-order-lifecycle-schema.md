# Phase 5 Order Lifecycle Schema Plan

## Scope

This is a Phase 5 Module 0 database planning document. It does not create or
modify Mongoose models, migrations, indexes, seed data, or runtime services.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Phase 5 modules 1-14)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (order lifecycle/state model micro-tasks)

## Collection

`orders`

Phase 5 extends the Phase 4 placement order with lifecycle and store-operation
fields. The order remains the aggregate root for store acceptance, picking,
packing, cancellation, and SLA visibility.

## Planned Order Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `orderStatus` | enum | yes | Current customer-visible lifecycle status |
| `storeStatus` | enum | no | Store acceptance and preparation status |
| `pickerStatus` | enum | no | Picking workflow status |
| `packingStatus` | enum | no | Packing and ready-for-pickup status |
| `acceptedAt` | Date | no | Set when store accepts order |
| `rejectedAt` | Date | no | Set when store rejects order |
| `rejectionReason` | string | no | Required when store rejects an order |
| `readyForPickupAt` | Date | no | Set when packing completes and order is ready |
| `assignedPickerId` | ObjectId | no | Store user/picker placeholder |
| `cancellationReason` | string | no | Required when order is cancelled |
| `cancelledAt` | Date | no | Cancellation timestamp |
| `cancelledBy` | object | no | Actor id/type/role for cancellation |
| `refundReviewRequired` | boolean | yes | Phase 5 placeholder for later refund processing |
| `slaStatus` | enum | no | SLA state such as on track or delayed |
| `slaBreachedStage` | string | no | Stage that breached SLA timing |

SLA timing rules are defined in
`docs/architecture/phase-5-sla-timing-rules.md`.

## Module 2 Field Extension Plan

Backend Order State Management uses three field groups:

| Group | Fields | Purpose |
|-------|--------|---------|
| Current state | `orderStatus`, `storeStatus`, `pickerStatus`, `packingStatus` | Fast list/detail reads and transition checks |
| History | `lifecycle[]`, `timeline[]` | Customer/store/admin state history and audit visibility |
| Operational metadata | `acceptedAt`, `readyForPickupAt`, `cancelledAt`, `cancelledBy`, `slaStatus`, `slaBreachedStage` | SLA, cancellation, and operational filtering |

Model implementation is deferred. No schema file, migration, or index is created
by Module 2 documentation work.

## Planned Lifecycle Event Fields

Lifecycle history may be embedded or stored in a separate lifecycle collection
in the implementation ticket. Module 0 records the required shape only.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `lifecycle[].status` | enum | yes | New lifecycle status |
| `lifecycle[].stage` | enum/string | yes | Payment, shipping, delivery, or refined store stage |
| `lifecycle[].statusTimestamp` | Date | yes | Time status was recorded |
| `lifecycle[].notes` | string | no | Internal note |
| `lifecycle[].actorId` | ObjectId | no | Actor who caused transition |
| `lifecycle[].actorRole` | string | no | Customer, store, admin, system |

## Planned Timeline Fields

Timeline records provide operational audit visibility for status changes.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `timeline[].event` | string | yes | Accept, reject, start picking, item missing, cancel, SLA breach |
| `timeline[].fromStatus` | string | no | Previous status |
| `timeline[].toStatus` | string | no | New status |
| `timeline[].actorId` | ObjectId | no | Actor reference |
| `timeline[].actorType` | string | no | Customer, store, admin, system |
| `timeline[].reason` | string | no | Cancellation/rejection/missing item reason |
| `timeline[].createdAt` | Date | yes | Event time |

Module 3 Store Acceptance Flow uses `timeline[].event` values
`order.store.accepted` and `order.store.rejected`. Rejection timeline entries
must include `timeline[].reason`.

Ticket 14.3 implements SLA fields in the order model:
`slaStatus` and `slaBreachedStage`. It also adds indexes for
`slaStatus + slaBreachedStage` and `storeId + slaStatus + createdAt`.

Audit and timeline event rules are defined in
`docs/architecture/phase-5-audit-logging.md`.

Timeline service architecture is defined in
`docs/architecture/phase-5-order-timeline-service.md`.

## Planned Item Operation Fields

Picking and missing item workflows require item-level operation state.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `items[].pickedQuantity` | number | no | Quantity picked by store operation |
| `items[].missingQuantity` | number | no | Quantity marked missing |
| `items[].pickingStatus` | enum | no | Pending, picked, missing, partial |

## Index Planning

Later implementation should consider indexes for:

- `customerId + createdAt`
- `storeId + storeStatus + createdAt`
- `orderStatus + createdAt`
- `paymentStatus + orderStatus`
- `slaStatus + slaBreachedStage`
- `storeId + orderStatus + createdAt`
- `storeId + slaStatus + createdAt`
- `customerId + orderStatus + createdAt`

No index is created by this document.

## Deferred Fields

Delivery-specific fields are deferred to Phase 6:

- `assignedRiderId`
- rider accepted/arrived/picked-up timestamps
- live delivery progress
- delivery OTP fields

Refund ledger and settlement fields are deferred to later finance/refund phases.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

Ticket 3.1 implements store acceptance fields in the order model:
`storeStatus`, `acceptedAt`, `rejectedAt`, and `rejectionReason`.

Ticket 4.2 implements picking foundation fields in the order model:
`pickerStatus`, `assignedPickerId`, `items[].pickedQuantity`,
`items[].missingQuantity`, and `items[].pickingStatus`.

Ticket 5.2 implements packing foundation fields in the order model:
`packingStatus` and `readyForPickupAt`.

Ticket 7.2 implements cancellation foundation fields in the order model:
`cancellationReason`, `cancelledAt`, `cancelledBy`, and
`refundReviewRequired`.

Other fields above remain planned schema additions for later feature tickets.
