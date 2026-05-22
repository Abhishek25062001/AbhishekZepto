# Phase 5 SLA Timing Rules

## Scope

This document defines SLA timing rules at architecture level. It does not create
configuration models, scheduler jobs, services, database indexes, routes, or
tests.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Order Lifecycle Architecture, SLA & Escalation Foundation)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (scheduled expired orders and SLA micro-tasks)

## SLA Stages

| Stage | Starts at | Ends at | Breach meaning |
|-------|-----------|---------|----------------|
| Acceptance | `placedAt` | `acceptedAt` or cancellation | Store did not accept/reject within configured window |
| Picking | `acceptedAt` | picking completion event | Store did not resolve item picking within configured window |
| Packing | picking completion event | packing completion event | Store did not pack within configured window |
| Ready for pickup | packing completion event | `readyForPickupAt` | Store did not mark ready within configured window |

## Planned SLA Fields

Planned fields only:

- `slaStatus`
- `slaBreachedStage`
- `acceptedAt`
- `readyForPickupAt`
- lifecycle/timeline timestamps

## SLA Status Values

Architecture-level values:

- `not_started`
- `on_track`
- `at_risk`
- `breached`
- `not_applicable`

Implementation may align exact enum names with project conventions.

## Delayed Order Rules

- SLA evaluation applies only to active, non-terminal orders.
- `cancelled` and `delivered_placeholder` are terminal and not evaluated for new
  breaches.
- Breach marking must include the breached stage and timestamp.
- Vendor and admin order APIs should expose SLA status after Backend Order State
  Management and SLA modules implement fields.
- Scheduled evaluation belongs to SLA & Escalation Foundation, not Module 1.
- Store acceptance timeout belongs to SLA & Escalation Foundation. Module 3
  documents the accept/reject boundary but does not create timeout jobs or
  auto-accept automation.

## Visibility Rules

| Surface | SLA visibility |
|---------|----------------|
| Vendor panel | Incoming/active orders show stage-level risk or breach indicators |
| Admin dashboard | Monitoring and detail views show delayed-order visibility |
| Customer app | Customer-facing copy may reflect order delay only after later UX rules |

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
