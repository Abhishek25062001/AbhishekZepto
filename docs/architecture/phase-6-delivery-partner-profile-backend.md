# Phase 6 Delivery Partner Profile Backend

## Scope

This document defines the scope, boundaries, upstream dependencies, and
downstream consumers of **Phase 6 Module 2 — Delivery Partner Profile Backend**.

Module 2 is the first code-producing module of Phase 6. It establishes the
`delivery_agents` collection and all backend layers (types, model, repository,
service, validators, controller, routes) needed to read and update a delivery
agent's profile.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery lifecycle micro-tasks)
- `docs/architecture/phase-6-delivery-lifecycle-architecture.md`
- `docs/architecture/phase-6-delivery-state-machine.md`
- `docs/contracts/delivery-state-transition-matrix.md`
- `docs/architecture/phase-6-delivery-ownership-rules.md`
- `docs/architecture/phase-6-delivery-sla-timing-rules.md`
- `docs/contracts/phase-6-delivery-route-plan.md`
- `docs/architecture/phase-6-delivery-audit-events.md`
- `docs/errors/phase-6-delivery-error-codes.md`

---

## Module Objective

Establish the **delivery agent profile** as the foundational identity and status
record for all Phase 6 delivery operations. Every later Phase 6 module that
assigns, dispatches, tracks, or completes a delivery depends on the
`delivery_agents` document created by this module.

---

## Upstream Dependencies (Module 1 Outputs)

| Document | Used for |
|----------|----------|
| `docs/architecture/phase-6-delivery-lifecycle-architecture.md` | State machine states, lifecycle scope |
| `docs/architecture/phase-6-delivery-state-machine.md` | `ready_for_pickup` entry state |
| `docs/contracts/delivery-state-transition-matrix.md` | Allowed delivery state transitions |
| `docs/architecture/phase-6-delivery-ownership-rules.md` | `deliveryAgentId` scope rules, ownership checks |
| `docs/architecture/phase-6-delivery-sla-timing-rules.md` | `cityId` usage for SLA config lookup |
| `docs/contracts/phase-6-delivery-route-plan.md` | Route families and permission mapping |
| `docs/errors/phase-6-delivery-error-codes.md` | Error codes (`DELIVERY_AGENT_NOT_FOUND`, etc.) |

---

## Downstream Consumers

| Module | What it consumes from Module 2 |
|--------|---------------------------------|
| **Module 3 — Rider Availability & Online Status** | `DeliveryAgent` model, `availabilityStatus` field, `updateProfile` repository method |
| **Module 4 — Delivery Assignment Backend** | `findById`, `findAll` repository — availability query for assignment dispatch |
| **Module 5 — Delivery Agent App — Availability** | `GET /api/v1/delivery/profile` endpoint |
| **Module 6 — Delivery Agent App — Assignment Flow** | `deliveryAgentId` identity for assignment ownership checks |

---

## Module 2 Deliverables

### Documentation Files

| File | Created by | Purpose |
|------|------------|---------|
| `docs/architecture/phase-6-delivery-partner-profile-backend.md` | Ticket 2.1 | This document |
| `docs/database/phase-6-delivery-agent-schema.md` | Ticket 2.2 | Collection field and index plan |
| `docs/contracts/phase-6-delivery-agent-profile-api.md` | Ticket 2.7 | API contract for the 4 endpoints |
| `docs/reviews/phase-6-delivery-partner-profile-backend-review.md` | Ticket 2.10 | Module review checklist |
| `docs/handoffs/phase-6-delivery-partner-profile-backend-complete.md` | Ticket 2.10 | Module closeout handoff |

### Backend Code Files

| File | Created by | Purpose |
|------|------------|---------|
| `backend/api/src/modules/delivery/types/delivery-agent.types.ts` | Ticket 2.3 | TypeScript interfaces, DTOs, response types |
| `backend/api/src/modules/delivery/constants/delivery-agent-status.constant.ts` | Ticket 2.3 | VEHICLE_TYPE, AVAILABILITY_STATUS, DELIVERY_AGENT_COLLECTION |
| `backend/api/src/modules/delivery/constants/delivery-agent-error-codes.constant.ts` | Ticket 2.3 | Error code constants |
| `backend/api/src/modules/delivery/models/delivery-agent.model.ts` | Ticket 2.4 | Mongoose schema and model for `delivery_agents` |
| `backend/api/src/modules/delivery/repositories/delivery-agent.repository.ts` | Ticket 2.5 | Data-access layer (7 functions) |
| `backend/api/src/modules/delivery/services/delivery-agent.service.ts` | Ticket 2.6 | Business logic (4 service functions) |
| `backend/api/src/modules/delivery/validators/delivery-agent.validators.ts` | Ticket 2.8 | Zod validators for profile routes |
| `backend/api/src/modules/delivery/controllers/delivery-agent.controller.ts` | Ticket 2.8 | Express controllers |
| `backend/api/src/modules/delivery/routes/delivery-agent.routes.ts` | Ticket 2.8 | Delivery agent route definitions |

### Test Files

| File | Created by | Purpose |
|------|------------|---------|
| `backend/api/src/modules/delivery/services/delivery-agent.service.test.ts` | Ticket 2.9 | Unit tests for service (8+ cases) |
| `backend/api/src/modules/delivery/routes/delivery-agent.routes.test.ts` | Ticket 2.9 | Route integration tests (8+ cases) |

### Updated Files

| File | Updated by | Change |
|------|------------|--------|
| `backend/api/src/routes/v1/delivery.routes.ts` | Ticket 2.8 | Mount delivery-agent profile routes |
| `backend/api/src/routes/v1/admin.routes.ts` | Ticket 2.8 | Mount admin delivery-agent routes |
| `docs/contracts/backend-route-registry.md` | Ticket 2.8 | Register 4 new endpoints as IMPLEMENTED |
| `project-context/CURRENT_PROGRESS.md` | Ticket 2.10 | Module 2 complete line |
| `project-context/MODULE_DEPENDENCIES.md` | Ticket 2.10 | Module 3 unblocked |

---

## New Collection

The `delivery_agents` collection is introduced by this module.

- **Created by:** Ticket 2.4 (Mongoose model)
- **Schema plan:** `docs/database/phase-6-delivery-agent-schema.md`
- **Collection constant:** `COLLECTION_NAMES.DELIVERY_AGENTS` (`'delivery_agents'`)

---

## APIs Implemented

| Method | Path | Actor | Module |
|--------|------|-------|--------|
| GET | `/api/v1/delivery/profile` | Delivery Agent | 2 |
| PATCH | `/api/v1/delivery/profile` | Delivery Agent | 2 |
| GET | `/api/v1/admin/agents` | Admin | 2 |
| GET | `/api/v1/admin/agents/:agentId` | Admin | 2 |

---

## Out Of Scope (Deferred to Later Modules)

The following are explicitly NOT implemented by Module 2:

- `PATCH /api/v1/delivery/availability` — availability toggle (Module 3)
- Delivery assignment records or `DeliveryAssignment` model (Module 4)
- Auth/JWT middleware for delivery agent routes (deferred — Module 2 uses `x-agent-id` header placeholder)
- Permission seed data for `delivery:read`, `delivery:monitor` (uses existing RBAC infrastructure)
- Frontend screens for agent profile (Module 5)
- OpenAPI path additions for delivery endpoints (deferred to Module 18 testing pass)
- SLA configuration or evaluation (Module 16)

---

## Auth Caveat

Delivery agent route auth middleware (`authenticate()` for the delivery agent
surface) is deferred. Module 2 delivery agent routes use a placeholder
middleware that reads `agentId` from the `x-agent-id` request header.

This placeholder is annotated with `// TODO: replace with real delivery agent auth middleware`
in the route file. Real JWT authentication for delivery agents is a prerequisite
of Module 5 or 6 (frontend integration).

---

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
