# Phase 5 Store Acceptance Flow

## Scope

This document records Module 3 Ticket 3.1 store accept/reject behavior and the
auto-accept placeholder. It does not implement picking, packing, cancellation
refund handling, SLA jobs, notifications, or vendor UI.

## Implemented Endpoints

| Method | Path | Permission | Purpose |
|--------|------|------------|---------|
| POST | `/api/v1/store/orders/{orderId}/accept` | `orders:update` | Store accepts a placed order |
| POST | `/api/v1/store/orders/{orderId}/reject` | `orders:update` | Store rejects a placed order with a reason |

## State Rules

- Accept is allowed only when `orderStatus = placed`.
- Accept sets `orderStatus = accepted`, `storeStatus = accepted`, and
  `acceptedAt`.
- Reject is allowed only when `orderStatus = placed`.
- Reject sets `orderStatus = cancelled`, `storeStatus = rejected`,
  `rejectedAt`, and `rejectionReason`.
- Non-placed orders return `ORDER_ACCEPTANCE_NOT_ALLOWED`.

## Transition Rules

| Action | From | To | Store status | Timestamp |
|--------|------|----|--------------|-----------|
| Accept | `placed` | `accepted` | `accepted` | `acceptedAt` |
| Reject | `placed` | `cancelled` | `rejected` | `rejectedAt` |

In lifecycle notation:

```text
placed -> accepted
placed -> cancelled
```

Store acceptance does not start picking, packing, ready-for-pickup, inventory
adjustment, refund handling, or delivery flow.

## Auto-Accept Placeholder

auto-accept is explicitly disabled in Ticket 3.1. Responses include
`autoAcceptEnabled: false` so later SLA or store-configuration work can attach
automation without changing the manual accept/reject contract.
The backend placeholder is represented by
`STORE_ACCEPTANCE_AUTO_ACCEPT_ENABLED = false`.

Acceptance timeout behavior is a placeholder for the SLA & Escalation
Foundation module. Module 3 records the boundary only and does not create
scheduler jobs, timeout configuration, notification publishing, or automated
store-acceptance behavior. The backend placeholder is represented by
`STORE_ACCEPTANCE_TIMEOUT_JOB_ENABLED = false`.

## Audit Events

- Accept emits `order.store.accepted`.
- Reject emits `order.store.rejected`.
- Failed accept/reject transitions emit failed audit attempts with the previous
  order status.

## API Endpoints

The two endpoints above are implemented in backend routes and OpenAPI.

## DB Fields

Implemented fields:

- `storeStatus`
- `acceptedAt`
- `rejectedAt`
- `rejectionReason`
