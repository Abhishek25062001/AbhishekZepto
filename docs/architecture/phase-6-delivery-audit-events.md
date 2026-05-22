# Phase 6 Delivery Lifecycle Audit Events

## Scope

This document defines the audit event strategy and timeline architecture for
Phase 6 delivery state transitions. Every delivery state change must produce a
traceable audit/timeline record. This document does not create runtime event
emitters, timeline services, database models, or tests.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery lifecycle micro-tasks)
- `docs/architecture/phase-5-audit-logging.md` (Phase 5 pattern)
- `project-context/REALTIME_ARCHITECTURE.md` (event naming conventions)

## Event Naming Convention

Event names use lowercase dot-separated namespaced strings:

```text
delivery.<noun>.<verb>
```

Examples:
- `delivery.assignment.created`
- `delivery.order.delivered`

## Delivery Event Registry

| Event name | Trigger | Actor | Delivery stage |
|------------|---------|-------|---------------|
| `delivery.assignment.created` | System creates delivery record from `ready_for_pickup` | System | `pending_assignment` stage |
| `delivery.assignment.acknowledged` | Agent acknowledges assignment | Delivery Agent | `assigned` → `en_route_to_store` |
| `delivery.agent.en_route_to_store` | Agent marks en-route to store | Delivery Agent | En route to store |
| `delivery.agent.arrived_at_store` | Agent marks arrived at store | Delivery Agent | Arrived at store |
| `delivery.order.picked_up` | Agent marks order picked up | Delivery Agent | Picked up |
| `delivery.agent.en_route_to_customer` | Agent marks en-route to customer | Delivery Agent | En route to customer |
| `delivery.agent.arrived_at_customer` | Agent marks arrived at customer | Delivery Agent | Arrived at customer |
| `delivery.order.delivered` | Agent confirms delivery | Delivery Agent | Delivered |
| `delivery.order.failed` | Agent or admin reports failed attempt | Delivery Agent / Admin | Failed |
| `delivery.assignment.cancelled` | System or admin cancels assignment | System / Admin | Cancelled (pre-pickup) |
| `delivery.sla.assignment_breached` | Assignment SLA deadline passed | System | SLA breach |
| `delivery.sla.pickup_breached` | Pickup SLA deadline passed | System | SLA breach |
| `delivery.sla.drop_breached` | Drop SLA deadline passed | System | SLA breach |
| `delivery.sla.total_breached` | Total delivery SLA deadline passed | System | SLA breach |

## Timeline Record Shape

Each delivery timeline event must contain the following fields (planned — not a
Mongoose schema):

```text
deliveryTimeline[]
  event          string    Event name from the registry above
  actorType      string    "delivery_agent" | "admin" | "system"
  actorId        string    ObjectId of the actor (or "system" for system events)
  timestamp      datetime  ISO 8601 datetime when the event occurred
  metadata       object    Event-specific payload (see below)
```

## Metadata Payloads by Event

| Event | Metadata fields |
|-------|----------------|
| `delivery.assignment.created` | `orderId`, `storeId`, `customerId`, `deliveryAgentId` |
| `delivery.assignment.acknowledged` | `deliveryAgentId`, `acknowledgedAt` |
| `delivery.agent.en_route_to_store` | `deliveryAgentId` |
| `delivery.agent.arrived_at_store` | `deliveryAgentId`, `arrivedAt` |
| `delivery.order.picked_up` | `deliveryAgentId`, `pickedUpAt`, `verificationMethod` (placeholder) |
| `delivery.agent.en_route_to_customer` | `deliveryAgentId` |
| `delivery.agent.arrived_at_customer` | `deliveryAgentId` |
| `delivery.order.delivered` | `deliveryAgentId`, `deliveredAt`, `confirmationMethod` (placeholder) |
| `delivery.order.failed` | `deliveryAgentId`, `failedAt`, `failureReason` |
| `delivery.assignment.cancelled` | `cancelledBy`, `cancellationReason`, `cancelledAt` |
| `delivery.sla.assignment_breached` | `slaDeadline`, `breachedAt`, `slaStage` |
| `delivery.sla.pickup_breached` | `slaDeadline`, `breachedAt`, `slaStage` |
| `delivery.sla.drop_breached` | `slaDeadline`, `breachedAt`, `slaStage` |
| `delivery.sla.total_breached` | `slaDeadline`, `breachedAt`, `slaStage` |

## Authority Rule

Correct backend audit flow:

```text
client action
  -> authenticated API or socket command
  -> backend validation
  -> service state change
  -> DB write (state + timeline event)
  -> audit record
  -> realtime notification (deferred)
```

- Backend must write the timeline event after successful state change
  persistence.
- Clients must never write audit or timeline records directly.
- All timeline events must be written atomically with the state change where
  possible, or in a compensating write immediately after.

## Real-Time Notification Deferral

Real-time WebSocket delivery location updates are deferred to Phase 7+.

Phase 6 Module 17 (Delivery Notifications Placeholder) handles:
- Recording notification intent placeholders after audit events.
- Provider-neutral queue placeholder records.

No actual WebSocket or push notification delivery is implemented in Phase 6.

## Timeline vs. Audit Log

| Record type | Collection | Purpose |
|-------------|-----------|---------|
| Delivery timeline | `deliveries.timeline[]` embedded | Ordered sequence of lifecycle events for this specific delivery |
| System audit log | `audit_logs` (existing) | Cross-domain audit trail for admin investigation |

Both records are written for significant state changes (assignment, pickup,
delivery, failure, cancellation, SLA breach).

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document. Planned field areas:

- `deliveries.deliveryTimeline[]`
  - `event`
  - `actorType`
  - `actorId`
  - `timestamp`
  - `metadata`
