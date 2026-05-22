# Order Lifecycle API Contract

## Scope

This is a Phase 5 Module 0 planning contract. It documents planned API behavior
for later implementation modules and does not create routes, controllers,
validators, services, or shared TypeScript files.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Phase 5 Order Lifecycle Architecture and Backend Order State Management)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (Order lifecycle/state micro-tasks)

## Planned Endpoints

| Method | Path | Actor | Owning module |
|--------|------|-------|---------------|
| GET | `/api/v1/customer/orders/{orderId}/lifecycle` | Customer | Backend Order State Management |
| GET | `/api/v1/customer/orders/{orderId}/state` | Customer | Backend Order State Management |
| POST | `/api/v1/admin/orders/{orderId}/status` | Admin | Backend Order State Management |

Store/vendor and additional admin list/detail endpoints are planned in
`docs/contracts/phase-5-route-mounting-plan.md`.

## Module 1 Architecture Alignment

| Rule area | Source |
|-----------|--------|
| State machine | `docs/architecture/phase-5-order-state-machine.md` |
| Allowed transitions | `docs/contracts/order-state-transition-matrix.md` |
| Ownership | `docs/architecture/phase-5-order-ownership-rules.md` |
| SLA timing | `docs/architecture/phase-5-sla-timing-rules.md` |
| Cancellation | `docs/architecture/phase-5-cancellation-rules.md` |
| Audit/timeline events | `docs/architecture/phase-5-audit-logging.md` |

Planned route families must follow these architecture rules before Backend
Order State Management implementation begins.

## Customer Lifecycle Response Shape

Planned response only:

```json
{
  "orderId": "string",
  "currentStatus": "placed",
  "currentStage": "store_acceptance",
  "lifecycle": [
    {
      "status": "placed",
      "stage": "payment",
      "statusTimestamp": "2026-05-19T00:00:00.000Z",
      "notes": "Order placed"
    }
  ]
}
```

## Admin Status Update Request Shape

Planned request only:

```json
{
  "status": "accepted",
  "notes": "Store order accepted"
}
```

## Planned Status Constants

Architecture-level state values:

- `PLACED`
- `ACCEPTED`
- `PICKING`
- `PACKING`
- `READY_FOR_PICKUP`
- `SHIPPED_PLACEHOLDER`
- `DELIVERED_PLACEHOLDER`
- `CANCELLED`

The Phase 5 source micro-tasks mention baseline `PROCESSING`, `SHIPPED`, and
`DELIVERED` constants. Module 1 refines store operations into accepted,
picking, packing, and ready-for-pickup while keeping delivery labels as
placeholders for the Phase 6 boundary.

## Planned Stage Constants

Baseline stages from the Phase 5 micro-tasks:

- `PAYMENT`
- `SHIPPING`
- `DELIVERY`
- `STORE_ACCEPTANCE`
- `PICKING`
- `PACKING`
- `READY_FOR_PICKUP`

Phase 5 architecture tickets refine store-operation stages before implementation.

## Ownership Rules

- Customer lifecycle reads are limited to orders owned by the requesting customer.
- Store/vendor users can operate only orders assigned to their store.
- Admin users require explicit order-operation permission.
- All status-changing actions require an audit/timeline event.

## Planned Cancellation Routes

Cancellation routes are planned only:

- `POST /api/v1/customer/orders/{orderId}/cancel`
- `POST /api/v1/store/orders/{orderId}/cancel`
- `POST /api/v1/admin/orders/{orderId}/cancel`

Rules are defined in `docs/architecture/phase-5-cancellation-rules.md`.

## SLA Visibility

SLA fields are planned for vendor/admin visibility after Backend Order State
Management and SLA & Escalation Foundation implementation. Module 1 does not add
SLA routes or jobs.

## Unresolved Backend Ticketing Decisions

Backend implementation tickets must decide:

- whether lifecycle history is embedded in `orders` or stored in a separate
  lifecycle collection
- exact enum names for state/status constants
- exact permission constant names aligned to existing RBAC conventions
- exact request/response schemas after repository/bootstrap gate is cleared

## Error Codes

Phase 5 error codes are planned in `docs/errors/phase-5-error-codes.md`.
Expected categories:

- invalid order id
- order not found
- forbidden order access
- invalid status
- invalid transition
- cancellation not allowed
- SLA operation not allowed

## API Endpoints

This document implements no endpoints. It only plans the route contract above.

## DB Fields

Planned fields only:

- `orderStatus`
- `storeStatus`
- `lifecycle[]`
- `timeline[]`
- `statusTimestamp`
- `stage`
- `notes`
