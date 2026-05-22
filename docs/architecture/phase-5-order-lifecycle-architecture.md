# Phase 5 Order Lifecycle Architecture

## Goal

Phase 5 defines the **order lifecycle and store operations** layer after Phase 4
order placement. It moves an order from `placed` into store acceptance, picking,
packing, ready-for-pickup, cancellation handling, operational visibility, and
SLA/escalation foundations.

This document began as **Module 0 foundation planning** and is extended by
**Module 1 — Order Lifecycle Architecture**. It does not create backend models,
services, controllers, route files, frontend screens, jobs, seed data, package
configuration, or repository setup.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Phase 5, pages 58-73)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Phase 5 micro-tasks, pages 58-125)

## Phase 5 Objective

Establish the complete order lifecycle from successful customer order creation
to store acceptance, picking, packing, readiness, cancellation handling, and
vendor/admin operational visibility.

## Entry State From Phase 4

Phase 4 creates customer orders and leaves them at `orderStatus=placed`.
Phase 5 owns all transitions beyond this placement state.

Phase 4 rules still apply:

- Backend remains the system of record.
- Customer may only access their own orders.
- Store context is required for store operations.
- Payment verification and order placement are already completed before Phase 5
  store lifecycle work begins.

## Phase 5 Modules In Source Order

| # | Module | Purpose |
|---|--------|---------|
| 0 | Phase 5 Foundation & Bootstrap | Docs, dependency map, contracts, schema plans, test plan |
| 1 | Order Lifecycle Architecture | State machine, transitions, ownership, SLA timing, cancellation rules |
| 2 | Backend Order State Management | Lifecycle fields, transition service, timeline service, store/admin APIs |
| 3 | Store Acceptance Flow | Store accept/reject, auto-accept placeholder, timeout, audit logging |
| 4 | Picking Workflow Backend | Start picking, item-level picking, missing items, complete picking |
| 5 | Packing & Ready-for-Pickup Flow | Packing start/complete, ready-for-pickup, verification placeholder |
| 6 | Inventory Adjustment During Store Operations | Missing item adjustment, reconciliation, inventory audit logs |
| 7 | Order Cancellation Backend | Customer/store/admin cancellation, release inventory, refund placeholder |
| 8 | Vendor Panel - Incoming Orders | Incoming order list/detail, accept/reject, SLA indicators |
| 9 | Vendor Panel - Picking & Packing | Active orders, picking, missing item, packing, ready actions |
| 10 | Vendor Panel - Order History & Filters | Store order history, filters, detail view, store cancellation |
| 11 | Admin Dashboard - Order Operations | Monitoring, filters, detail, cancellation, timeline, delayed visibility |
| 12 | Customer App - Order Status Visibility | Order detail timeline, cancellation, cancelled state, history refresh |
| 13 | Store Operation Notifications Placeholder | Event publisher, queue placeholder, customer/vendor/admin records |
| 14 | SLA & Escalation Foundation | SLA config, evaluation service, delayed order marking, SLA audit logs |
| 15 | Phase 5 Testing & Validation | Transition, acceptance, picking, cancellation, UI, and SLA tests |
| 16 | Phase 5 Integration & Review | Full journey review, handoff, final architecture review |

## Module 1 Architecture Boundary

Module 1 owns the architecture rules required before Backend Order State
Management can be ticketized:

- final order state machine
- allowed and blocked order transitions
- customer, store/vendor, admin, and system ownership rules
- SLA timing rules
- cancellation rules
- lifecycle/timeline and audit expectations

Module 1 does not implement:

- backend models, repositories, services, controllers, routes, or validators
- store acceptance, picking, packing, cancellation, or SLA jobs
- frontend screens for customer app, vendor panel, or admin dashboard
- automated tests, Postman collections, OpenAPI files, or CI scripts
- Repository & Codebase Setup

## Planned Route Families

Routes are planned only. Exact request and response contracts are documented in
Phase 5 contract files before feature implementation.

| Actor | Planned route family |
|-------|----------------------|
| Customer | `/api/v1/customer/orders/{orderId}/state`, `/api/v1/customer/orders/{orderId}/lifecycle`, cancellation |
| Store / vendor | Store order list/detail, accept, reject, picking, packing, ready-for-pickup, cancellation |
| Admin | Order list/detail, status updates, cancellation, timeline, delayed-order visibility |

## Planned Data Areas

Phase 5 extends the Phase 4 order placement schema with lifecycle and operations
fields. Planning documents cover:

- Order state and lifecycle events
- Timeline records
- Store acceptance status
- Picking and packing status
- Cancellation actor/reason/timestamps
- SLA status and breached stage
- Audit actor metadata

No database model is created by this module.

## Out Of Scope

Deferred to later phases:

- Delivery partner assignment and live delivery progress
- Rider pickup and customer delivery OTP
- Refund ledger and settlement accounting
- Support ticket operations
- Real-time WebSocket updates
- Production launch drills and incident response

Explicitly not in Module 0 scope:

- Repository & Codebase Setup
- Backend implementation files
- Frontend screen implementation
- Automated test implementation
- Seed data or permission seed changes

## Module 0 Deliverables

Module 0 produces documentation and planning files only:

- Phase 5 architecture and dependency map
- Module completion matrix
- Order lifecycle contracts and transition matrix
- Database schema plans
- Route, permission, audit, error, validation, and testing plans
- Bootstrap readiness checklist
- Module 0 handoff

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
