# Phase 6 Delivery Ownership Rules

## Scope

This document defines Phase 6 delivery ownership boundaries at architecture
level. It does not create middleware, policy code, route guards, permission
seeds, or tests.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery lifecycle micro-tasks)
- `docs/architecture/phase-6-delivery-state-machine.md`
- `docs/contracts/delivery-state-transition-matrix.md`

## Ownership Summary

| Actor | Owns / can access | Can change lifecycle | Notes |
|-------|-------------------|----------------------|-------|
| Delivery Agent | Deliveries where `deliveryAgentId` matches authenticated agent | En-route, arrival, pickup, progress, completion, failed | Agent cannot act on another agent's delivery |
| Customer | Own order's delivery tracking (read-only) | Cannot change delivery state | May request pre-pickup cancellation via order cancellation |
| Vendor/Store user | Own store's pickup visibility (read-only) | Cannot change delivery state | Can see rider arrived / picked-up status only |
| Admin user | All deliveries within authorized admin scope | Override: cancel, mark failed, manual correction | Requires explicit delivery-operation permissions |
| System/Job | Active deliveries selected by SLA/timeout rules | Assignment creation, timeout/SLA marker actions | Must emit audit/timeline event; cannot bypass terminal states |

## Delivery Agent Rules

- Delivery agent operations require the authenticated agent's `deliveryAgentId`
  to match `delivery.deliveryAgentId` on the assignment record.
- Delivery agents may only view and operate their own current or past assignments.
- Delivery agents cannot accept, cancel, or override assignments belonging to
  another agent.
- Agent scope enforcement must happen in backend middleware before any delivery
  state mutation.
- Delivery agent actor metadata must include `actorId`, `actorRole`, `actorType`,
  and `deliveryAgentId` for timeline/audit records.

## Customer Rules

- Customer delivery tracking is read-only. Customers access delivery status
  through the order's delivery relationship.
- Customer delivery reads require `order.customerId` to match the authenticated
  customer.
- Customers cannot directly change `deliveryStatus` or any delivery sub-state.
- Customer cancellation before pickup (pre-`en_route_to_store`) flows through
  the order cancellation system (Phase 5 Module 7), not the delivery lifecycle
  directly.
- Customers must not see other customers' delivery data.

## Vendor / Store Rules

- Store/vendor delivery access is read-only and limited to pickup visibility:
  - Rider is `assigned` (incoming)
  - Rider is `en_route_to_store`
  - Rider is `arrived_at_store`
  - Order is `picked_up`
- Store/vendor users cannot modify delivery state.
- Store/vendor delivery reads require `order.storeId` to match an assigned store
  in the actor context.

## Admin Rules

- Admin delivery operations require explicit delivery-operation permissions.
- Admin can view all deliveries with appropriate permission (`delivery:monitor`).
- Admin can override delivery state for failed, cancelled, or correction
  scenarios (`delivery:update`).
- Admin cancellation of an active delivery requires `delivery:cancel` permission
  and is only allowed before the rider reaches `en_route_to_store`.
- Admin actions must include actor context for audit/timeline records.

## System / Job Rules

- System actors may perform only assignment-creation, SLA evaluation, timeout,
  and notification-placeholder actions defined by Phase 6 modules.
- System actions must include actor type `system` in timeline/audit records.
- System actions cannot bypass terminal state rules.
- System-created assignments must enforce rider availability and scope at the
  time of creation.

## Planned Permission Codes

Permission codes planned (docs only — not implemented in this module):

| Code | Surface | Purpose |
|------|---------|---------|
| `delivery:read` | Delivery Agent, Admin | Read own delivery / all deliveries |
| `delivery:update` | Delivery Agent, Admin | Update delivery state |
| `delivery:assign` | System, Admin | Create or reassign delivery |
| `delivery:cancel` | Admin | Cancel a delivery assignment |
| `delivery:monitor` | Admin | Monitor all deliveries, SLA, delayed visibility |

## Planned Actor Fields

Planned fields only:

- `deliveryAgentId` — links delivery record to the assigned agent
- `actorId` — actor who triggered the timeline event
- `actorRole` — role of the actor (`delivery_agent` | `admin` | `system`)
- `actorType` — surface type (`delivery` | `admin` | `system`)
- `orderId` — links delivery record back to the order
- `customerId` — denormalized for customer tracking scope
- `storeId` — denormalized for vendor pickup visibility scope

## Route Ownership Mapping

| Route family | Ownership rule |
|--------------|---------------|
| `GET /api/v1/delivery/profile` | Agent owns own profile |
| `PATCH /api/v1/delivery/availability` | Agent sets own availability |
| `GET /api/v1/delivery/assignments/current` | Agent reads own active assignment |
| `POST /api/v1/delivery/assignments/{id}/acknowledge` | Agent matches `deliveryAgentId` |
| `POST /api/v1/delivery/assignments/{id}/en-route-to-store` | Agent matches `deliveryAgentId` |
| `POST /api/v1/delivery/assignments/{id}/arrived-at-store` | Agent matches `deliveryAgentId` |
| `POST /api/v1/delivery/assignments/{id}/picked-up` | Agent matches `deliveryAgentId` |
| `POST /api/v1/delivery/assignments/{id}/en-route-to-customer` | Agent matches `deliveryAgentId` |
| `POST /api/v1/delivery/assignments/{id}/arrived-at-customer` | Agent matches `deliveryAgentId` |
| `POST /api/v1/delivery/assignments/{id}/delivered` | Agent matches `deliveryAgentId`; idempotent |
| `POST /api/v1/delivery/assignments/{id}/failed` | Agent or Admin; failure reason required |
| `GET /api/v1/customer/orders/{orderId}/delivery` | Customer owns order |
| `GET /api/v1/vendor/orders/{orderId}/delivery-status` | Store assignment includes order store |
| `GET /api/v1/admin/deliveries` | Admin has `delivery:monitor` permission |
| `GET /api/v1/admin/deliveries/{assignmentId}` | Admin has `delivery:read` permission |
| `POST /api/v1/admin/deliveries/{assignmentId}/override` | Admin has `delivery:update` permission |

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
