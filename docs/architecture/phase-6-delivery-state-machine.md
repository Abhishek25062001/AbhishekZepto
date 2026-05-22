# Phase 6 Delivery State Machine

## Scope

This document finalizes the Phase 6 delivery state machine at architecture level.
It does not create runtime constants, enums, models, services, validators,
routes, jobs, or tests.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery lifecycle micro-tasks)

## Entry State

Phase 6 starts from the Phase 5 order state:

```text
ready_for_pickup
```

Phase 5 owns payment verification, inventory confirmation, cart clearing, order
placement, store acceptance, picking, packing, and ready-for-pickup marking.
Phase 6 owns all delivery states starting from rider assignment.

## Delivery State Machine

```text
pending_assignment
  -> assigned
  -> en_route_to_store
  -> arrived_at_store
  -> picked_up
  -> en_route_to_customer
  -> arrived_at_customer
  -> delivered                 (terminal)

pending_assignment / assigned
  -> cancelled                 (terminal)

picked_up / en_route_to_customer / arrived_at_customer
  -> failed                    (terminal)
```

## State Definitions

| State | Terminal | Customer visible | Primary actor | Meaning |
|-------|----------|------------------|---------------|---------|
| `pending_assignment` | no | yes | System | Order is `ready_for_pickup`; delivery assignment is being created |
| `assigned` | no | yes | System/Admin | A rider has been assigned; not yet acknowledged or started |
| `en_route_to_store` | no | yes | Delivery Agent | Rider acknowledged and is heading to the store |
| `arrived_at_store` | no | yes | Delivery Agent | Rider has arrived at the store location |
| `picked_up` | no | yes | Delivery Agent | Rider collected the order from the store |
| `en_route_to_customer` | no | yes | Delivery Agent | Rider is heading to the customer delivery address |
| `arrived_at_customer` | no | yes | Delivery Agent | Rider is at the customer delivery location |
| `delivered` | yes | yes | Delivery Agent | Order confirmed delivered to customer |
| `failed` | yes | yes | Delivery Agent/Admin | Delivery attempt failed after pickup |
| `cancelled` | yes | yes | System/Admin | Delivery cancelled before pickup (order not yet picked up) |

## Sub-State Field Mapping

The implementation module may maintain a top-level `deliveryStatus` and more
specific operation fields. Architecture-level mapping:

| Lifecycle state | Planned field area |
|-----------------|-------------------|
| `pending_assignment` | `deliveryStatus` |
| `assigned` | `deliveryStatus`, `assignmentStatus`, `deliveryAgentId` |
| `en_route_to_store` | `deliveryStatus`, `assignmentStatus` |
| `arrived_at_store` | `deliveryStatus`, `pickupStatus` |
| `picked_up` | `deliveryStatus`, `pickupStatus`, `pickedUpAt` |
| `en_route_to_customer` | `deliveryStatus`, `dropStatus` |
| `arrived_at_customer` | `deliveryStatus`, `dropStatus` |
| `delivered` | `deliveryStatus`, `deliveredAt` |
| `failed` | `deliveryStatus`, `failedAt`, `failureReason` |
| `cancelled` | `deliveryStatus`, `cancelledAt`, `cancellationReason` |

## Terminal States

Terminal states that cannot move back into active delivery operations:

- `delivered`
- `failed`
- `cancelled`

Terminal states cannot transition to any other state.

## Delivery Boundary

The following remain out of scope for Phase 6 state machine:

- Real-time WebSocket location streaming (Phase 7+)
- ML-based or H3-based dispatch optimization (Phase 7+)
- Redis-based rider geo-presence (Phase 7+)
- Refund ledger for failed deliveries (Phase 7+)
- Multi-attempt delivery retry logic (Phase 7+)

## Order Status Mirror

When a delivery transitions to `delivered`, the corresponding order's Phase 5
`orderStatus` field should be updated from `shipped_placeholder` to
`delivered_placeholder` (or a real `delivered` status per Phase 6 implementation
rules). Exact field update is owned by Module 11 (Delivery Completion Backend).

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document. Planned field areas:

- `deliveryStatus`
- `assignmentStatus`
- `pickupStatus`
- `dropStatus`
- `deliveryAgentId`
- `pickedUpAt`
- `deliveredAt`
- `failedAt`
- `failureReason`
- `cancelledAt`
- `cancellationReason`
