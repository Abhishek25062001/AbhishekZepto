# Phase 8 Admin Control Architecture

## Status

Module 2 in progress. This document started as the Module 1 docs/foundation
artifact for Phase 8 — Admin Control & Operational Oversight and is now the
Module 2 Admin Control Architecture source of truth.

## Objective

Phase 8 provides centralized control for managing users, stores, orders,
delivery agents, platform settings, operational monitoring, and administrative
oversight.

## Module Boundary

Module 2 finalizes the Admin Control architecture boundary and then introduces
runtime code only in the tickets that explicitly define concrete API, DB,
validation, realtime, or audit implementation work.

This module does not start Repository & Codebase Setup. It must not introduce
Phase 8 functionality outside the Admin Control Architecture tickets.

## Module 2 Architecture Boundary

Admin Control is the centralized operational oversight layer for users, stores,
orders, delivery agents, incidents, platform settings, and monitoring.

Admin Control may add backend routes, controllers, services, repositories,
models, validators, OpenAPI paths, tests, and documentation only when the active
ticket explicitly requires that surface. It must not implement later Phase 8
modules such as Admin User Management, Customer Management, Delivery Agent
Management, Vendor & Store Management, Support Operations, Platform Settings,
Audit Log UI, Operational Analytics UI, or Data Export.

Repository & Codebase Setup remains not started by Module 2. Existing backend
patterns and current Phase 5, Phase 6, and Phase 7 ownership rules remain the
implementation boundary.

## Source Scope

- `projectin micro/docone/AllPhase&Modules.pdf` — Phase 8 objective and Admin
  Control Architecture tasks.
- `projectin micro/docfive/PhaesDetail6,7&8.pdf` — Phase 8 Admin Control
  Architecture micro-tasks.

## Admin Permissions

Admin permissions are planned at architecture level in this module. Permission
groups, role hierarchy, approval rules, and data visibility rules are documented
for later implementation modules. No permission constants or seed-role changes
are introduced here.

Permission group planning is recorded in
`docs/security/phase-8-admin-control-permissions.md`.

## Admin Role Hierarchy

Phase 8 Admin Control depends on the existing Phase 2 role and permission
system. This module documents role intent only; it does not add role seed data,
permission constants, middleware, or authorization logic.

Planned roles:

- `SUPER_ADMIN`: full platform administrative authority, including sensitive
  operational control, settings, audit, and cross-city visibility where later
  modules permit it.
- `OPS_ADMIN`: operational-control role for live order, delivery, store, SLA,
  and incident oversight within allowed scope.
- `CITY_ADMIN`: city-scoped operational role for monitoring and permitted
  actions within assigned city scope.
- catalog admin: catalog and product oversight role, without default authority
  for sensitive order or delivery overrides.
- support admin: customer/support workflow role, without default authority for
  platform settings or financial operations.
- finance admin: payment, refund, report, and finance visibility role, without
  default authority for live delivery overrides.
- City manager: city-level operations visibility and limited action role.
- read-only admin: monitoring and review role with no mutation authority.

Sensitive operational flows should be limited to `SUPER_ADMIN`, `OPS_ADMIN`, or
`CITY_ADMIN` when later implementation tickets add enforcement. Read-only,
support, catalog, and finance-oriented roles require explicit permission before
they can perform operational overrides.

## Live Operational Control

Admin Control is planned as the central operational surface for live order,
delivery-agent, store, SLA, and incident oversight. Later modules may implement
session tracking, live overview reads, operational override actions, audit
logging, and realtime updates. This module only documents those boundaries.

## Surface Ownership

Admin Dashboard owns centralized monitoring, admin control, override review,
incident handling, escalation review, active admin sessions, audit review, and
settings oversight. It is the only Phase 8 surface allowed to expose Admin
Control Architecture runtime APIs.

Vendor Panel remains the owner for store-staff workflows such as accepting
orders, picking, packing, marking ready for pickup, viewing store order queues,
and managing store catalog/inventory within the vendor scope.

Customer App remains the owner for customer-facing shopping, checkout, order
visibility, customer profile, customer notifications, and delivery tracking
experiences.

Delivery Agent App remains the owner for rider-facing availability, assignment
acceptance, pickup flow, active delivery progress, location updates, and
delivery completion.

The backend automation layer remains the owner for state machines, scheduled jobs,
inventory locks, assignment pipelines, SLA evaluation, notification publishing,
and cross-surface event fanout.

Admin Control may observe and override operational states where later modules
explicitly permit it, but it must not duplicate app-specific workflows or bypass
the owning backend module's state transition rules.

Backend automation remains the enforcement layer for state machine rules. Admin
Control requests must call the owning backend modules or repositories instead of
creating parallel state transitions.

## Planned API Families

These API families are future implementation scope only:

- Admin control session APIs (implemented in Module 2 Ticket 2.7).
- Operational override APIs.
- Live overview and monitoring APIs.

Operational override APIs are implemented in Module 2 Ticket 2.8. Live
monitoring APIs are implemented in Module 2 Ticket 2.9.

Implemented live monitoring endpoints:

- `GET /api/v1/admin/control/live-overview`
- `GET /api/v1/admin/control/live-orders`
- `GET /api/v1/admin/control/live-agents`
- `GET /api/v1/admin/control/live-stores`
- `GET /api/v1/admin/control/escalations`

## Admin Control Session Architecture

Module 2 implements the Admin Control operational session lifecycle:

1. Start a session for an authenticated admin.
2. Send heartbeat updates while the admin is actively using Admin Control.
3. List active sessions for operational awareness.
4. End a session when the admin leaves the control surface.
5. Expire stale sessions during active-session reads.

Implemented session endpoints:

- `POST /api/v1/admin/control/session/start`
- `POST /api/v1/admin/control/session/end`
- `POST /api/v1/admin/control/session/heartbeat`
- `GET /api/v1/admin/control/sessions/active`

Implemented `admin_control_sessions` fields:

- `adminId`
- `sessionType`
- `cityScope`
- `startedAt`
- `endedAt`
- `activeModules`
- `lastHeartbeatAt`
- `createdAt`
- `updatedAt`

Implemented indexes:

- `adminId`
- `cityScope`
- `startedAt`
- compound `adminId, endedAt`
- compound `cityScope, startedAt`

## Upstream Dependencies

- Phase 5 order operations define order state ownership and store operations.
- Phase 6 delivery operations define delivery-agent, assignment, and delivery
  state ownership.
- Phase 7 realtime control tower provides realtime visibility patterns and
  fallback snapshot boundaries.

## City-Level Monitoring

City-level monitoring is implemented for the live monitoring read APIs via
`cityId` query filtering. This city-level filtering applies to live overview,
live orders, live agents, live stores, and escalations. Module 2 also adds
city-scope validation, audit entries, and error-code behavior for implemented
override paths where the target entity carries city scope.

## Admin Control Realtime Architecture

Admin Control realtime is implemented on the `/admin-control` Socket.IO
namespace with the existing authenticated admin socket middleware. The namespace
joins connected admins to `admin:operations` and, when the authenticated admin
has city scope, to that city room.

Implemented Admin Control realtime events:

- `admin.live_order_updated`
- `admin.agent_status_changed`
- `admin.store_operational_changed`
- `admin.sla_escalation_created`

Operational override services publish these events after successful state
changes. The implementation uses the existing Socket.IO Redis adapter path when
Redis is configured, so Admin Control events participate in the same horizontal
fanout architecture as Phase 7 realtime events.

## Validation And Error Boundaries

Module 2 validates ObjectIds and reason capture at the route boundary. It also
implements state and city-scope error boundaries for Admin Control overrides
where the target entity already carries city scope.

Implemented error codes:

- `INVALID_ADMIN_SCOPE`
- `FORCE_ACTION_DENIED`
- `STORE_ALREADY_CLOSED`
- `AGENT_ALREADY_OFFLINE`
- `ORDER_ALREADY_CANCELLED`

## System Override Flows

System override flows are implemented for sensitive operational actions such as
force-cancel, force-assignment, store force-close, delivery-agent force-offline,
and SLA escalation.

Implemented override endpoints:

- `POST /api/v1/admin/control/order/:orderId/force-cancel`
- `POST /api/v1/admin/control/order/:orderId/force-assign-agent`
- `POST /api/v1/admin/control/order/:orderId/unassign-agent`
- `POST /api/v1/admin/control/store/:storeId/force-close`
- `POST /api/v1/admin/control/store/:storeId/reopen`
- `POST /api/v1/admin/control/agent/:agentId/force-offline`
- `POST /api/v1/admin/control/agent/:agentId/restore-online`
- `POST /api/v1/admin/control/sla/:slaId/escalate`

Implemented override field updates:

- Orders: `orderStatus`, `cancelledBy`, `cancellationReason`, `cancelReason`,
  `cancelledAt`.
- Assignments: `deliveryAgentId`, `assignmentSource`, `assignedAt`,
  `deliveryStatus`, `unassignedReason`, `unassignedAt`, `unassignedBy`.
- Stores: `storeOperationalStatus`, `forceClosedAt`, `forceClosedReason`,
  `forceClosedBy`, `isOpen`, `isAcceptingOrders`.
- Delivery agents: `availabilityStatus`, `forcedOfflineAt`,
  `forcedOfflineReason`, `forcedOfflineBy`.
- SLA escalation on delivery assignments: `escalationLevel`, `escalatedBy`,
  `escalatedAt`, `escalationReason`.
- Admin action audits: `adminId`, `actionType`, `entityType`, `entityId`,
  `beforeState`, `afterState`, `reason`, `ipAddress`, `deviceInfo`,
  `createdAt`.

## Approval And Reason Capture Rules

Later implementation modules must treat sensitive admin actions as controlled
actions. This docs/foundation module defines the rule categories only.

Actions that require confirmation and reason capture:

- Force order cancel.
- Force delivery-agent assignment.
- Unassign delivery agent.
- Force store close.
- Force delivery agent offline.
- SLA escalation.
- Delivery-zone override.

Actions that may require higher-role approval before execution:

- Cross-city override by a city-scoped admin.
- Force-cancel on an order already in a late delivery state.
- Store force-close while active orders are still assigned to the store.
- Delivery-agent force-offline while the agent has an active assignment.
- Sensitive platform setting changes.

Admin action audit snapshots are implemented for operational override actions
with `beforeState`, `afterState`, `reason`, `ipAddress`, and `deviceInfo`.

### Sensitive Action Approval Matrix

| Action | Confirmation | Reason capture | Higher-role approval |
| --- | --- | --- | --- |
| Force cancel | Required | Required | Required for late-state or cross-city orders |
| Force assignment | Required | Required | Required for cross-city assignment |
| Unassign agent | Required | Required | Required when reassignment risk is high |
| Force store close | Required | Required | Required when active orders exist |
| Force agent offline | Required | Required | Required when active assignment exists |
| SLA escalation | Required | Required | Optional unless cross-city |
| Delivery-zone override | Required | Required | Required |

## Data Visibility Rules

Later implementation modules must mask sensitive fields unless the admin role
and permission group explicitly allow access.

Sensitive fields:

- Customer phone.
- Customer address.
- Payment details.
- Rider details.
- Vendor financial data.

Default visibility should favor least privilege. Read-only, catalog, support,
finance, operations, and city-level roles should receive only the fields needed
for their workflow. Sensitive data reveal actions should be auditable when later
implementation adds the audit layer.

Masking enforcement is deferred to later backend and Admin Dashboard
implementation tickets. Until enforcement is implemented, Admin Control
Architecture documents the rule that sensitive fields must not be exposed by
default in list or monitoring responses.

## Incident Management Flow

Incident management is planned as a controlled admin workflow:

1. Detect an operational issue from live monitoring or escalation views.
2. Confirm the admin has permission and city scope for the affected entity.
3. Capture the reason and any required confirmation for sensitive actions.
4. Apply the operational action in the owning backend module.
5. Emit planned realtime/admin events where supported by later modules.
6. Persist an audit trail with before and after state.

## Out Of Scope For Module 1

- `/backend/api/src/modules/admin-control/` module structure.
- Backend controllers, services, routes, validators, DTOs, interfaces, events,
  middleware, constants, or models.
- API endpoint implementation.
- MongoDB schema implementation or index creation.
- OpenAPI source integration.
- Realtime `/admin-control` namespace implementation.
- Redis pub/sub publisher integration.
- Rate limiting middleware implementation.
- Environment variable parsing or `.env.example` changes.
- Unit, integration, security, load, or performance test implementation.
