# Phase 6 Delivery Lifecycle Route Plan

## Scope

This document plans all Phase 6 delivery route families by actor surface.
No routes are implemented in this document — all entries are planned only.
Exact request and response contracts are documented in Phase 6 contract files
before feature implementation.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery micro-tasks)
- `docs/architecture/phase-6-delivery-ownership-rules.md`
- `docs/contracts/delivery-state-transition-matrix.md`
- `project-context/API_STANDARDS.md`

## Delivery Agent Routes

| Method | Planned path | Module | Purpose |
|--------|--------------|--------|---------|
| GET | `/api/v1/delivery/profile` | Module 2 | Fetch own delivery agent profile |
| PATCH | `/api/v1/delivery/profile` | Module 2 | Update own delivery agent profile |
| PATCH | `/api/v1/delivery/availability` | Module 3 | Toggle online/offline availability |
| GET | `/api/v1/delivery/status` | Module 3 | Get own current availability and status |
| GET | `/api/v1/delivery/assignments/current` | Module 6 | Fetch current active assignment |
| GET | `/api/v1/delivery/assignments` | Module 6 | Fetch assignment history |
| POST | `/api/v1/delivery/assignments/{assignmentId}/acknowledge` | Module 6 | Acknowledge assignment and start en-route-to-store |
| POST | `/api/v1/delivery/assignments/{assignmentId}/en-route-to-store` | Module 6 | Mark en-route to store |
| POST | `/api/v1/delivery/assignments/{assignmentId}/arrived-at-store` | Module 7 | Mark arrived at store |
| POST | `/api/v1/delivery/assignments/{assignmentId}/picked-up` | Module 7 | Mark order picked up |
| POST | `/api/v1/delivery/assignments/{assignmentId}/en-route-to-customer` | Module 9 | Mark en-route to customer |
| POST | `/api/v1/delivery/assignments/{assignmentId}/arrived-at-customer` | Module 9 | Mark arrived at customer |
| POST | `/api/v1/delivery/assignments/{assignmentId}/delivered` | Module 11 | Confirm delivery (idempotent) |
| POST | `/api/v1/delivery/assignments/{assignmentId}/failed` | Module 11 | Report failed delivery attempt |

## Customer Routes

| Method | Planned path | Module | Purpose |
|--------|--------------|--------|---------|
| GET | `/api/v1/customer/orders/{orderId}/delivery` | Module 13 | Fetch delivery tracking status for own order |

## Vendor / Store Routes

| Method | Planned path | Module | Purpose |
|--------|--------------|--------|---------|
| GET | `/api/v1/vendor/orders/{orderId}/delivery-status` | Module 14 | Fetch pickup-phase delivery status for store order |

## Admin Routes

| Method | Planned path | Module | Purpose |
|--------|--------------|--------|---------|
| GET | `/api/v1/admin/deliveries` | Module 15 | List all deliveries with filters |
| GET | `/api/v1/admin/deliveries/{assignmentId}` | Module 15 | Get delivery detail and timeline |
| POST | `/api/v1/admin/deliveries/{assignmentId}/override` | Module 15 | Admin override: cancel or correct state |
| GET | `/api/v1/admin/agents` | Module 2/3 | List delivery agents (admin view) |
| GET | `/api/v1/admin/agents/{agentId}` | Module 2 | Get delivery agent profile and status |

## Auth and Permission Notes

| Surface | Auth requirement | Scope check |
|---------|-----------------|-------------|
| Delivery Agent routes | Authenticated delivery agent | Agent scope: `deliveryAgentId` must match |
| Customer tracking | Authenticated customer | Customer scope: `customerId` must match order |
| Vendor pickup visibility | Authenticated vendor/store user | Store scope: `storeId` must match order |
| Admin delivery routes | Authenticated admin | `delivery:read` / `delivery:monitor` / `delivery:update` permission |

## Route Dependency Notes

- Customer tracking read (`/customer/orders/{orderId}/delivery`) depends on the
  delivery assignment backend (Module 4) to create the delivery record.
- Vendor pickup visibility (`/vendor/orders/{orderId}/delivery-status`) depends
  on the pickup backend (Module 7) to populate `arrived_at_store` and `picked_up`
  status.
- Admin delivery list/detail depends on delivery assignment and lifecycle fields
  being persisted from Modules 4–11.
- All delivery agent state-change routes depend on the transition rules in
  `docs/contracts/delivery-state-transition-matrix.md`.

## Idempotency Requirements

- `POST .../delivered` must be idempotent. A second call from the same agent
  on an already-`delivered` assignment returns success without re-writing state.
- All other state-change transitions must reject duplicate calls after the state
  has advanced.

## Route Dependency to Phase 6 Module Map

| Phase 6 Module | Owns these routes |
|----------------|-------------------|
| 2 — Delivery Partner Profile Backend | `GET/PATCH /delivery/profile`, `GET /admin/agents` |
| 3 — Rider Availability & Online Status | `PATCH /delivery/availability`, `GET /delivery/status` |
| 4 — Delivery Assignment Backend | Creates delivery/assignment records; no new direct agent route |
| 6 — Delivery Agent App — Assignment Flow | `GET /delivery/assignments/current`, `POST .../acknowledge`, `POST .../en-route-to-store` |
| 7 — Store Arrival & Pickup Backend | `POST .../arrived-at-store`, `POST .../picked-up` |
| 9 — Delivery Progress Backend | `POST .../en-route-to-customer`, `POST .../arrived-at-customer` |
| 11 — Delivery Completion Backend | `POST .../delivered`, `POST .../failed` |
| 13 — Customer App — Delivery Tracking | `GET /customer/orders/{orderId}/delivery` |
| 14 — Vendor Panel — Pickup Visibility | `GET /vendor/orders/{orderId}/delivery-status` |
| 15 — Admin Dashboard — Delivery Operations | `GET/POST /admin/deliveries/*` |

## API Endpoints

No API endpoints are implemented in this document. All entries above are planned
route families only.

## DB Fields

No database fields are created in this document.
