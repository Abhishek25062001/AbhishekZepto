# Phase 6 Delivery Lifecycle Architecture

## Goal

Phase 6 defines the **delivery lifecycle** layer that begins after Phase 5 store
operations mark an order `ready_for_pickup`. It covers rider assignment, pickup,
active delivery progress, completion, customer tracking, vendor pickup visibility,
admin delivery operations, SLA/escalation, and delivery notifications placeholder.

This document began as **Module 0 foundation planning** and is extended by
**Module 1 — Delivery Lifecycle Architecture**. It does not create backend
models, services, controllers, routes, validators, frontend screens, jobs, seed
data, package configuration, or repository setup.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 micro-tasks)

## Phase 6 Objective

Establish the complete delivery lifecycle from the moment a store marks an order
`ready_for_pickup` through rider assignment, store arrival, order pickup,
en-route tracking, customer delivery confirmation, and delivery completion
handling for all operational surfaces.

## Entry State From Phase 5

Phase 5 leaves orders at one of:

- `ready_for_pickup` — order is packed and awaiting rider pickup (primary entry)
- `cancelled` — terminal, no delivery lifecycle starts
- `delivered_placeholder` — terminal placeholder, no further transition

Phase 6 owns all delivery transitions starting from `ready_for_pickup`.

Phase 5 rules still apply:

- Backend remains the system of record.
- Order lifecycle authority belongs to the backend.
- Delivery agent may only act on deliveries assigned to their own `deliveryAgentId`.
- Payment verification, order placement, and store operations are already completed
  before Phase 6 delivery lifecycle work begins.

## Phase 6 Modules In Source Order

| # | Module | Purpose |
|---|--------|---------|
| 0 | Phase 6 Foundation & Bootstrap | Docs, dependency map, contracts, schema plans, test plan |
| 1 | Delivery Lifecycle Architecture | State machine, transitions, ownership, SLA timing, route plan, audit events, error/validation contracts |
| 2 | Delivery Partner Profile Backend | Delivery agent profile model, availability fields, identity link |
| 3 | Rider Availability & Online Status | Availability toggle, online/offline status API, presence tracking |
| 4 | Delivery Assignment Backend | Assignment creation, dispatch rules, agent notification placeholder |
| 5 | Delivery Agent App — Availability | Availability toggle screen, online/offline state, assignment list |
| 6 | Delivery Agent App — Assignment Flow | Assignment acknowledgement, en-route-to-store state, UI flow |
| 7 | Store Arrival & Pickup Backend | Arrived-at-store, picked-up state transitions, pickup verification |
| 8 | Delivery Agent App — Pickup Flow | Store arrival UI, order pickup confirmation, barcode/OTP placeholder |
| 9 | Delivery Progress Backend | En-route-to-customer, arrived-at-customer, location update placeholder |
| 10 | Delivery Agent App — Active Delivery | Active delivery map UI, progress states, navigation placeholder |
| 11 | Delivery Completion Backend | Delivery confirmation, failed delivery, completion audit, earnings placeholder |
| 12 | Delivery Agent App — Completion Flow | Delivery confirmation UI, photo/OTP placeholder, completed state |
| 13 | Customer App — Delivery Tracking | Customer delivery status, tracking screen, estimated time placeholder |
| 14 | Vendor Panel — Pickup Visibility | Store-facing rider arrived/picked-up visibility |
| 15 | Admin Dashboard — Delivery Operations | Admin delivery list, detail, override, delayed-delivery monitoring |
| 16 | Delivery SLA & Escalation | SLA config, evaluation service, breach marking, job placeholder |
| 17 | Delivery Notifications Placeholder | Event publisher, queue placeholder, delivery event notification records |
| 18 | Phase 6 Testing & Validation | Delivery state, assignment, pickup, completion, UI, and SLA tests |
| 19 | Phase 6 Integration & Review | Full journey review, handoff, final architecture review |

## Module 1 Architecture Boundary

Module 1 owns the architecture rules required before Module 2 (Delivery Partner
Profile Backend) can be ticketized:

- Final delivery state machine
- Allowed and blocked delivery state transitions
- Delivery agent, customer, store/vendor, admin, and system ownership rules
- Delivery SLA timing rules
- Delivery route plan (planned only)
- Delivery lifecycle audit and event architecture
- Delivery error codes and validation rules

Module 1 does not implement:

- Backend models, repositories, services, controllers, routes, or validators
- Delivery agent profile, assignment, pickup, progress, or completion flows
- Frontend screens for customer app, delivery agent app, vendor panel, or admin
  dashboard
- Automated tests, Postman collections, OpenAPI files, or CI scripts
- Repository & Codebase Setup

## Module 1 Deliverables

| File | Purpose |
|------|---------|
| `docs/architecture/phase-6-delivery-lifecycle-architecture.md` | This file — scope and module list |
| `docs/architecture/phase-6-delivery-state-machine.md` | Full delivery state machine |
| `docs/contracts/delivery-state-transition-matrix.md` | All allowed and blocked transitions |
| `docs/architecture/phase-6-delivery-ownership-rules.md` | Actor ownership and permission rules |
| `docs/architecture/phase-6-delivery-sla-timing-rules.md` | SLA thresholds and breach rules |
| `docs/contracts/phase-6-delivery-route-plan.md` | Planned route families by surface |
| `docs/architecture/phase-6-delivery-audit-events.md` | Audit event registry and timeline strategy |
| `docs/errors/phase-6-delivery-error-codes.md` | Planned delivery error codes |
| `docs/validation/phase-6-delivery-validation-rules.md` | Planned delivery validation rules |
| `docs/reviews/phase-6-delivery-lifecycle-architecture-review.md` | Module 1 review checklist |
| `docs/handoffs/phase-6-delivery-lifecycle-architecture-complete.md` | Module 1 closeout handoff |

## Out Of Scope

Deferred to later phases:

- Real-time WebSocket delivery location updates (Phase 7+)
- ML-based or H3-based dispatch optimization (Phase 7+)
- Redis-based rider presence and geo-index (Phase 7+)
- Refund ledger and settlement accounting for failed deliveries (Phase 7+)
- Support ticket operations
- Production launch drills and incident response
- Kafka, microservices, multi-region infrastructure

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
