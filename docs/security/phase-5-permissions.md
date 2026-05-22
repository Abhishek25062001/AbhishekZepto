# Phase 5 Permissions

## Scope

This document plans Phase 5 authorization and ownership rules. It does not
create middleware, permission constants, seed data, policies, or tests.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Phase 5 ownership, store, admin, customer modules)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (order lifecycle validation and endpoint micro-tasks)

## Actor Rules

| Actor | Allowed scope | Phase 5 operations |
|-------|---------------|--------------------|
| Customer | Own orders only | Read state/lifecycle, cancel eligible own orders |
| Store/vendor user | Orders for assigned store only | List/detail store orders, accept/reject, picking, packing, ready-for-pickup, store cancellation |
| Admin user | Authorized operational scope | List/detail orders, update status, cancel, view timeline, monitor delayed orders |
| System/job | Internal only | Timeout handling, SLA delayed marking, notification placeholders |

## Customer Ownership

- Customer order reads must verify `order.customerId` matches the authenticated
  customer.
- Customer cancellation must verify ownership and lifecycle eligibility.
- Customer users cannot update arbitrary lifecycle status.

## Store Ownership

- Store/vendor order operations must verify `order.storeId` is within the
  authenticated actor's assigned store scope.
- Store/vendor users cannot operate orders for another store.
- Store accept/reject, picking, packing, ready-for-pickup, and store
  cancellation all require store ownership verification.
- Module 3 accept/reject requires `orders:update` and assigned-store scope.
- Cross-store accept/reject must fail before lifecycle mutation or audit success
  recording.

## Admin Permissions

Admin operations require explicit order-operation permission before
implementation. Planned capabilities:

| Capability | Planned coverage |
|------------|------------------|
| `orders:read` | Admin list, detail, timeline |
| `orders:update-status` | Admin status update |
| `orders:cancel` | Admin cancellation implemented in Module 7 Ticket 7.6 |
| `orders:monitor-sla` | Delayed-order visibility |
| `orders:update` | Store accept/reject implemented in Module 3 Ticket 3.1 |

Module 7 adds `cancel` to the existing RBAC action constants and mounts admin
order cancellation with `orders:cancel`.

## Admin Dashboard Order Operations

Module 11 implements Admin Dashboard order operations with separated read and
mutation permissions:

- `orders:read` gates `/orders`, `/orders/:orderId`, admin order list/detail,
  and timeline reads.
- `orders:update-status` gates
  `POST /api/v1/admin/orders/{orderId}/status` and the Admin Dashboard status
  update action.
- `orders:cancel` gates existing admin cancellation and the Admin Dashboard
  cancellation action.
- `orders:monitor-sla` is reserved for SLA visibility controls. Module 11 only
  displays returned SLA placeholder fields; Module 14 owns SLA computation.

Operations admin seeds include `orders:update-status`; super admin continues to
use wildcard permission.

## Cancellation Authority

Cancellation rules are finalized in Phase 5 Module 1 and implemented in Order
Cancellation Backend. Module 0 records the actor boundary:

- Customer may cancel only their own eligible order before cutoff.
- Store may cancel only assigned-store orders when store workflow allows it.
- Admin may cancel authorized orders when policy allows it.
- Every cancellation requires a reason and an audit/timeline record.

## Planned Audit Actor Fields

Planned fields only:

- `actorId`
- `actorRole`
- `actorType`
- `reason`
- `createdAt`

These fields are used by lifecycle/timeline/audit planning and are not created
by this document.

## Route Coverage

Permission checks must cover planned route families in:

- `docs/contracts/order-lifecycle-api.md`
- `docs/contracts/phase-5-route-mounting-plan.md`
- `docs/contracts/phase-5-store-order-api.md`
- `docs/contracts/phase-5-admin-order-api.md`

Ownership architecture is defined in:

- `docs/architecture/phase-5-order-ownership-rules.md`

## Backend Order State Management Access Plan

| Planned endpoint | Required access rule |
|------------------|----------------------|
| `GET /api/v1/store/orders` | Store/vendor actor scoped to assigned stores |
| `GET /api/v1/store/orders/{orderId}` | Store/vendor actor assigned to `order.storeId` |
| `GET /api/v1/admin/orders` | Admin actor with order read/operations permission |
| `GET /api/v1/admin/orders/{orderId}` | Admin actor with order read/operations permission and allowed scope |
| `POST /api/v1/admin/orders/{orderId}/status` | Admin actor with status-update permission and valid transition |

Store accept/reject uses existing permission middleware with `orders:update`.
Additional permission seed refinement remains needs verification for later
role-policy review.

## Vendor Panel Incoming Orders

Module 8 uses existing vendor/store permissions:

- `orders:read` for incoming order list/detail visibility.
- `orders:update` for accept/reject actions.
- Backend APIs remain scoped to the authenticated actor's `storeId`.

## Vendor Panel Picking And Packing

Module 9 uses existing vendor/store permissions:

- `orders:read` for active order list/detail visibility.
- `orders:update` for start picking, item picked/missing, complete picking,
  start packing, complete packing, and ready-for-pickup actions.
- Workflow visibility also checks the current order lifecycle state before
  rendering each action.
- Backend APIs remain scoped to the authenticated actor's `storeId`.

## Vendor Panel Order History And Filters

Module 10 uses existing vendor/store permissions:

- `orders:read` for order history list/detail visibility.
- `orders:update` for store cancellation UI.
- Store cancellation visibility also checks a frontend lifecycle guard, while
  the backend remains the source of truth for cancellation eligibility.
- Backend APIs remain scoped to the authenticated actor's `storeId`.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
