# Phase 8 Admin Control APIs

## Status

Planned contract. This document records the Phase 8 Admin Control API, database
field, validation, and error-code plan. It does not implement routes,
controllers, services, validators, models, OpenAPI source files, or middleware.

## Source Scope

- `projectin micro/docone/AllPhase&Modules.pdf` — Phase 8 Admin Control
  Architecture tasks.
- `projectin micro/docfive/PhaesDetail6,7&8.pdf` — Admin Control Architecture
  micro-tasks.

## Implemented Session APIs

### `POST /api/v1/admin/control/session/start`

Implemented purpose: create an admin operational session.

### `POST /api/v1/admin/control/session/end`

Implemented purpose: close an admin operational session and update `endedAt` and
`lastHeartbeatAt`.

### `POST /api/v1/admin/control/session/heartbeat`

Implemented purpose: update active session heartbeat timestamp and validate session
expiry logic.

### `GET /api/v1/admin/control/sessions/active`

Implemented purpose: return currently active admin operational sessions including
`adminId`, `cityScope`, `activeModules`, and `lastHeartbeatAt`.

## Implemented Operational Override APIs

### `POST /api/v1/admin/control/order/:orderId/force-cancel`

Implemented purpose: validate route/body input and perform force cancel.

Implemented order DB fields:

- `orderStatus`
- `cancelledBy`
- `cancellationReason`
- `cancelReason`
- `cancelledAt`

Implemented internal event: `admin.order_force_cancelled`.

### `POST /api/v1/admin/control/order/:orderId/force-assign-agent`

Implemented purpose: accept `deliveryAgentId`, validate agent availability, and
force-create assignment.

Implemented assignment DB fields:

- `assignedAgentId`
- `assignmentSource`
- `assignedAt`

Implemented event: `admin.force_assignment_created`.

### `POST /api/v1/admin/control/order/:orderId/unassign-agent`

Implemented purpose: remove active assignment and return it to pending assignment.

Implemented assignment DB fields:

- `status`
- `unassignedReason`
- `unassignedAt`
- `unassignedBy`

### `POST /api/v1/admin/control/store/:storeId/force-close`

Implemented purpose: update store operational state and disable incoming order
acceptance.

Implemented store DB fields:

- `storeOperationalStatus`
- `forceClosedAt`
- `forceClosedReason`
- `forceClosedBy`

### `POST /api/v1/admin/control/store/:storeId/reopen`

Implemented purpose: restore normal operational state.

### `POST /api/v1/admin/control/agent/:agentId/force-offline`

Implemented purpose: disable agent availability and remove active assignment
eligibility.

Implemented delivery-agent DB fields:

- `availabilityStatus`
- `forcedOfflineAt`
- `forcedOfflineReason`
- `forcedOfflineBy`

### `POST /api/v1/admin/control/agent/:agentId/restore-online`

Implemented purpose: restore delivery-agent operational eligibility.

### `POST /api/v1/admin/control/sla/:slaId/escalate`

Implemented purpose: mark SLA as escalated.

Implemented SLA DB fields:

- `escalationLevel`
- `escalatedBy`
- `escalatedAt`
- `escalationReason`

## Implemented Live Monitoring APIs

### `GET /api/v1/admin/control/live-overview`

Implemented purpose: return active orders, late orders, active agents, offline
agents, force-closed stores, and SLA breaches.

### `GET /api/v1/admin/control/live-orders`

Implemented filters:

- `cityId`
- `status`
- `slaRisk`
- `storeId`

### `GET /api/v1/admin/control/live-agents`

Implemented response data:

- `location`
- `availability`
- `batteryLevel`
- `activeOrderCount`

### `GET /api/v1/admin/control/live-stores`

Implemented response data:

- `queue load`
- `preparation delay`
- `acceptance rate`
- `force-close status`

### `GET /api/v1/admin/control/escalations`

Implemented purpose: return active escalated incidents.

## Implemented Admin Control Session Collection

Implemented model: `admin_control_sessions`.

Implemented DB fields:

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

## Implemented Admin Action Audit Collection

Implemented model: `admin_action_audits`.

Implemented DB fields:

- `adminId`
- `actionType`
- `entityType`
- `entityId`
- `beforeState`
- `afterState`
- `reason`
- `ipAddress`
- `deviceInfo`
- `createdAt`

Implemented indexes:

- `adminId`
- `entityType`
- `entityId`
- `createdAt`

## Planned Action Types

- `FORCE_ASSIGNMENT`
- `FORCE_UNASSIGN`
- `FORCE_ORDER_CANCEL`
- `FORCE_STORE_CLOSE`
- `FORCE_AGENT_OFFLINE`
- `MARK_SLA_ESCALATED`
- `OVERRIDE_DELIVERY_ZONE`

## Implemented Validation Boundary

Implemented validation includes:

- ObjectIds.
- City scope restrictions where the target entity has city scope.
- Required reason capture for sensitive actions.
- Current operational state for already-cancelled orders, already-closed stores,
  and already-offline agents.

Action permissions continue to use the existing authenticated admin route mount
until later role/permission implementation tickets expand enforcement.

## Implemented Error Codes

- `INVALID_ADMIN_SCOPE`
- `FORCE_ACTION_DENIED`
- `STORE_ALREADY_CLOSED`
- `AGENT_ALREADY_OFFLINE`
- `ORDER_ALREADY_CANCELLED`

## Implemented Realtime Events

Implemented namespace:

- `/admin-control`

Implemented socket events:

- `admin.live_order_updated`
- `admin.agent_status_changed`
- `admin.store_operational_changed`
- `admin.sla_escalation_created`

These events are socket events, not REST endpoints, so they are not represented
as OpenAPI paths.

## Implementation Status

Module 2 implements the session APIs, operational override APIs, live monitoring
APIs, audit collection, and Admin Control realtime namespace/events documented
above. Validation rules and error codes remain in their specific planned
sections until the validation ticket completes.
