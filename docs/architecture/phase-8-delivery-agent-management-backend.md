# Phase 8 Module 5 — Delivery Agent Management Backend

## Status

Module 5 implemented.

## Objective

Delivery Agent Management Backend provides the Admin Dashboard backend surface
for listing, viewing, status-managing, verification-managing, and inspecting
delivery agents.

## Scope Boundary

Module 5 owns backend admin delivery-agent management only. It may add backend
routes, controllers, services, repositories, validators, OpenAPI paths, tests,
and documentation related to admin-facing delivery-agent management.

Module 5 does not implement Delivery Agent App UI, Admin Dashboard frontend UI,
assignment matching rewrites, delivery state-machine rewrites, realtime
tracking rewrites, payroll, incentives, analytics, exports, or support-ticket
workflows.

## Dependencies

- Phase 2 auth identity and RBAC foundation.
- Phase 6 delivery agent profile, availability, assignment, and admin delivery
  operations backend.
- Phase 7 realtime delivery tracking backend for downstream operational
  visibility only.
- Phase 8 Module 2 Admin Control audit and route patterns.
- Phase 8 Module 3 Admin User Management backend patterns.
- Phase 8 Module 4 Customer Management backend permission/error/audit patterns.

## Runtime Ownership

Existing `delivery_agents` records remain the source of truth for delivery
agent profile, vehicle, city, availability, verification, activation, and active
assignment metadata. Existing `delivery_assignments` records remain the source
of truth for assignment history and state.

Module 5 must preserve rider-facing Delivery Agent App ownership of self-profile
updates and availability toggles. Admin status and verification controls must be
reason-captured and auditable.

## Admin Read Model

Module 5 exposes existing `delivery_agents` fields for admin inspection:

- `agentId`
- `userId`
- `name`
- `phone`
- `email`
- `profilePhotoUrl`
- `vehicleType`
- `vehicleNumber`
- `availabilityStatus`
- `forcedOfflineAt`
- `forcedOfflineReason`
- `forcedOfflineBy`
- `isVerified`
- `isActive`
- `cityId`
- `currentAssignmentId`
- `totalDeliveries`
- `createdAt`
- `updatedAt`

The field contract is documented in
`docs/database/phase-8-delivery-agent-management-schema.md`. Module 5 adds no
new delivery-agent collection or fields.

## Implemented API Endpoints

- `GET /api/v1/admin/delivery-agents`
- `GET /api/v1/admin/delivery-agents/:deliveryAgentId`
- `PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/status`
- `PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/verification`
- `GET /api/v1/admin/delivery-agents/:deliveryAgentId/assignments`
- `GET /api/v1/admin/delivery-agents/:deliveryAgentId/audit`

The list endpoint supports status, availability status, verification status,
city, literal search, page, and limit filters only. Search is intentionally
limited to existing delivery-agent identity/contact fields: name, phone, email,
and vehicle number.

Assignment inspection reads existing `delivery_assignments` by
`deliveryAgentId` with status/date pagination filters. Audit inspection reads
existing `admin_action_audits` by `entityType: delivery_agent` and `entityId`.
Both inspection endpoints are read-only and do not change dispatch or delivery
state.

## Permission Model

Module 5 route-level permissions follow the Phase 8 admin management pattern:
read surfaces use `delivery:read`, status updates use `delivery:update-status`,
verification updates use `delivery:update`, and each group allows
`settings:manage` as the super-admin operations override.

## Validation And Scope

All Module 5 endpoints validate ObjectId params and bounded pagination. When
the authenticated admin context includes `cityId`, the service layer constrains
list filters and per-agent operations to that city and returns
`INVALID_ADMIN_SCOPE` for cross-city access.

## Audit Model

Status and verification mutations write to the shared `admin_action_audits`
collection with `entityType: delivery_agent`. Module 5 registers
`DELIVERY_AGENT_STATUS_CHANGED` and `DELIVERY_AGENT_VERIFICATION_CHANGED` action
types and stores before/after admin delivery-agent summaries with the submitted
reason.
