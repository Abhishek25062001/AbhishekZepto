# Phase 5 Order Ownership Rules

## Scope

This document defines Phase 5 order ownership boundaries at architecture level.
It does not create middleware, policy code, route guards, permission seeds, or
tests.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Order Lifecycle Architecture)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (order lifecycle validation micro-tasks)

## Ownership Summary

| Actor | Owns / can access | Can change lifecycle | Notes |
|-------|-------------------|----------------------|-------|
| Customer | Orders where `customerId` matches authenticated customer | Cancellation only when eligible | Customer cannot directly set lifecycle status |
| Store/vendor user | Orders where `storeId` is in assigned store scope | Store acceptance, picking, packing, ready, eligible cancellation | Store cannot operate another store's order |
| Admin user | Orders within authorized admin scope | Status update, cancellation, operational monitoring | Requires explicit order-operation permissions |
| System/job | Active orders selected by timeout/SLA rules | Timeout/SLA marker actions only | Must emit audit/timeline event |

## Customer Rules

- Customer reads require `order.customerId` to match the authenticated customer.
- Customer lifecycle and timeline responses must not expose another customer's
  order data.
- Customer cancellation requires ownership and cancellation eligibility.
- Customer users cannot accept, reject, pick, pack, mark ready, or admin-update
  order status.

## Store / Vendor Rules

- Store/vendor operations require `order.storeId` to match an assigned store in
  the actor context.
- Store/vendor users may list and detail only assigned-store orders.
- Store/vendor lifecycle operations are limited to:
  - accept/reject incoming orders
  - start and complete picking
  - mark item picked or missing
  - start and complete packing
  - mark ready for pickup
  - cancel when store cancellation rules allow
- Store/vendor users cannot update orders from other stores.
- Store accept/reject must use the same assigned-store ownership boundary as
  store list/detail operations.
- Store accept/reject actor metadata must include `actorId`, `actorRole`,
  `actorType`, and `storeId` for timeline/audit planning.

## Admin Rules

- Admin operations require explicit order-operation permission.
- Admin list/detail access must respect existing admin scope rules.
- Admin status updates must follow the transition matrix.
- Admin cancellation must follow cancellation rules and require a reason.
- Admin delayed-order visibility depends on SLA fields and permissions.

## System / Job Rules

- System actors may perform only timeout, SLA, and notification-placeholder
  actions defined by Phase 5 modules.
- System actions must include actor type `system` in timeline/audit planning.
- System actions cannot bypass terminal state rules.

## Planned Actor Fields

Planned fields only:

- `customerId`
- `storeId`
- `actorId`
- `actorRole`
- `actorType`

## Route Mapping

| Route family | Ownership rule |
|--------------|----------------|
| Customer state/lifecycle reads | Customer owns order |
| Customer cancellation | Customer owns order and state is eligible |
| Store list/detail | Store assignment includes order store |
| Store lifecycle operations | Store assignment includes order store and transition is allowed |
| Admin list/detail/status/cancel | Admin has explicit permission and transition is allowed |
| SLA/timeout jobs | System-selected active orders only |

## Module 2 Access-Control Mapping

| Planned Module 2 surface | Ownership / permission rule |
|--------------------------|-----------------------------|
| Store order list | Return only assigned-store orders |
| Store order detail | Require `order.storeId` in actor store scope |
| Admin order list | Require admin order read/operations permission |
| Admin order detail | Require admin order read/operations permission and allowed scope |
| Admin status update | Require admin status-update permission, actor context, and valid transition |

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
