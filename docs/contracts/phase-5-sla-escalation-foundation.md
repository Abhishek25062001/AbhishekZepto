# Phase 5 SLA & Escalation Foundation

## Scope

Phase 5 Module 14 adds the backend foundation for SLA evaluation and delayed
order marking across store-operation lifecycle stages.

Module 14 owns:

- SLA stage and status contracts
- Static SLA threshold configuration placeholders
- Internal SLA evaluation service
- Internal delayed-order marking service
- System-generated SLA breach timeline and audit events
- Existing store/admin SLA field visibility verification

## Dependencies

- Module 1 - Order Lifecycle Architecture
- Module 2 - Backend Order State Management
- Module 3 - Store Acceptance Flow
- Module 4 - Picking Workflow Backend
- Module 5 - Packing & Ready-for-Pickup Flow

## Out Of Scope

- Real external escalation provider integrations
- Customer, vendor, or admin notification delivery
- Delivery assignment, rider pickup, or delivery OTP behavior
- Refund execution or support ticket creation
- Public SLA management APIs
- Admin-configurable SLA settings UI
- Production scheduler activation without explicit verification

## SLA Stages

| Stage | Starts at | Ends at |
|---|---|---|
| `acceptance` | `placedAt` | `acceptedAt`, rejection, or cancellation |
| `picking` | `acceptedAt` | `order.picking.completed` timeline event |
| `packing` | `order.packing.started` timeline event | `order.packing.completed` timeline event |
| `ready_for_pickup` | `order.packing.completed` timeline event | `readyForPickupAt` |

## SLA Status Values

Module 14 uses these SLA statuses:

- `not_started`
- `on_track`
- `at_risk`
- `breached`
- `not_applicable`

## Static SLA Threshold Placeholder

Module 14 uses code-level static threshold placeholders. These values are
implementation defaults for automated testing and need operational verification
before production use.

| Stage | At risk after | Breach after |
|---|---:|---:|
| `acceptance` | 5 minutes | 10 minutes |
| `picking` | 10 minutes | 20 minutes |
| `packing` | 5 minutes | 10 minutes |
| `ready_for_pickup` | 5 minutes | 10 minutes |

No runtime admin configuration API or UI is added by this module.

## API Endpoints

Module 14 adds no new public HTTP endpoints.

Existing store and admin order endpoints may expose SLA fields:

- `GET /api/v1/store/orders`
- `GET /api/v1/store/orders/{orderId}`
- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/{orderId}`

Ticket 14.8 verifies existing store/admin list filters and read responses use
the implemented SLA fields without adding new routes.

## DB Fields

Module 14 uses order-level SLA fields:

- `slaStatus`
- `slaBreachedStage`

Ticket 14.3 implements these fields on `orders` and keeps them available to
existing store/admin order read responses.

SLA breach markers also use existing timeline fields:

- `timeline[].event`
- `timeline[].actorType`
- `timeline[].actorRole`
- `timeline[].reason`
- `timeline[].createdAt`

## Permissions

No new permission codes are added. SLA evaluation is system/internal. Store and
admin SLA visibility uses existing order read permissions.

## Audit Logging

Newly marked SLA breaches must write:

- timeline event: `order.sla.breached`
- audit event: `order.sla.breached`

The actor type is `system`.

Audit metadata includes order id, breached stage, previous SLA status, new SLA
status, and evaluation timestamp.

## Verification Notes

Production scheduler cadence and threshold values are placeholders and require
environment-specific verification before production use.

Ticket 14.7 adds a callable job placeholder for SLA evaluation. Module 14 does
not automatically start a production scheduler.
