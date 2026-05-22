# Phase 6 Delivery SLA Timing Rules

## Scope

This document defines delivery SLA timing rules at architecture level. It does
not create configuration models, scheduler jobs, services, database indexes,
routes, or tests.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 SLA and escalation micro-tasks)
- `docs/architecture/phase-5-sla-timing-rules.md` (Phase 5 SLA pattern)

## SLA Stages

| Stage | Starts at | Ends at | Breach event name |
|-------|-----------|---------|-------------------|
| Assignment | Order reaches `ready_for_pickup` | `assigned` state reached | `delivery.sla.assignment_breached` |
| Pickup | `assigned` state reached | `picked_up` state reached | `delivery.sla.pickup_breached` |
| Drop | `picked_up` state reached | `delivered` state reached | `delivery.sla.drop_breached` |
| Total | Order reaches `ready_for_pickup` | `delivered` state reached | `delivery.sla.total_breached` |

## Planned SLA Thresholds

| Stage | Default threshold | Notes |
|-------|------------------|-------|
| Assignment SLA | 5 minutes | Time from `ready_for_pickup` to rider `assigned` |
| Pickup SLA | 15 minutes | Time from rider `assigned` to order `picked_up` at store |
| Drop SLA | 30 minutes | Time from `picked_up` to `delivered` at customer |
| Total delivery SLA | 45 minutes | Time from `ready_for_pickup` to `delivered` |

Thresholds are configurable per city/zone and are documented at architecture
level only. Runtime configuration belongs to Module 16 (Delivery SLA &
Escalation).

## Planned SLA Fields

Planned fields only:

- `slaStatus` — `not_started` | `on_time` | `at_risk` | `breached`
- `slaBreachedStage` — which stage was first breached
- `slaAssignmentDeadline` — deadline timestamp for rider assignment
- `slaPickupDeadline` — deadline timestamp for store pickup
- `slaDropDeadline` — deadline timestamp for customer delivery
- `slaTotalDeadline` — overall delivery deadline timestamp
- `slaBreachedAt` — timestamp when breach was first recorded

## SLA Status Values

Architecture-level status values:

- `not_started` — delivery record created but assignment not yet initiated
- `on_time` — all active SLA deadlines are in the future
- `at_risk` — approaching deadline threshold (e.g., 80% of time elapsed)
- `breached` — one or more stage deadlines have passed without completion
- `not_applicable` — delivery is in a terminal state (delivered/failed/cancelled)

Implementation may align exact enum names with project conventions.

## Escalation Rules

| Breach stage | Escalation action | Implemented in |
|-------------|-------------------|----------------|
| Assignment breach | Mark `slaStatus=breached`, `slaBreachedStage=assignment`; admin alert placeholder | Module 16 |
| Pickup breach | Mark `slaStatus=breached`, `slaBreachedStage=pickup`; admin alert placeholder | Module 16 |
| Drop breach | Mark `slaStatus=breached`, `slaBreachedStage=drop`; admin alert placeholder | Module 16 |
| Total breach | Mark `slaStatus=breached`, `slaBreachedStage=total` | Module 16 |

Auto-reassignment on assignment breach is a placeholder for Phase 7+. Phase 6
Module 16 only marks the breach and records the audit event.

## Delayed Order Rules

- SLA evaluation applies only to active, non-terminal delivery records.
- `delivered`, `failed`, and `cancelled` are terminal and are not evaluated for
  new SLA breaches.
- SLA breach marking must include the breached stage and timestamp in the
  delivery timeline.
- Scheduled SLA evaluation belongs to Module 16 (Delivery SLA & Escalation),
  not Module 1.
- SLA timers are scheduler-safe job placeholders in Phase 6. Actual scheduler
  implementation details are defined in Module 16.

## Visibility Rules

| Surface | SLA visibility |
|---------|---------------|
| Delivery Agent App | No SLA visibility required for agent |
| Vendor Panel | Pickup SLA indicator (rider assigned, expected pickup time) |
| Admin Dashboard | Monitoring and detail views show delayed-delivery markers; `slaStatus`, `slaBreachedStage` |
| Customer App | Customer-facing delay messaging deferred to Phase 7+ |

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
