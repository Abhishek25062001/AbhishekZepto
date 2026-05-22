# Delivery State Transition Matrix

## Scope

This document defines all allowed and blocked delivery state transitions.
It does not create runtime transition validators, middleware, services, or tests.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery lifecycle micro-tasks)
- `docs/architecture/phase-6-delivery-state-machine.md`

## Allowed Transitions

| From State | To State | Actor | Pre-condition | Blocked if |
|------------|----------|-------|---------------|------------|
| _(order reaches ready_for_pickup)_ | `pending_assignment` | System | Order `storeStatus` = `ready_for_pickup` | Order already has active delivery record |
| `pending_assignment` | `assigned` | System / Admin | Rider is `online` and available; no active active delivery | No eligible rider found within timeout window |
| `pending_assignment` | `cancelled` | System / Admin | Assignment cancelled before rider found | Order is already `assigned` or further |
| `assigned` | `en_route_to_store` | Delivery Agent | Assignment belongs to authenticated agent; agent acknowledges | Agent already en route or further |
| `assigned` | `cancelled` | System / Admin | Reassignment or manual cancellation before agent starts | Agent has already acknowledged (en route or further) |
| `en_route_to_store` | `arrived_at_store` | Delivery Agent | Assignment belongs to authenticated agent | Agent not in `en_route_to_store` state |
| `arrived_at_store` | `picked_up` | Delivery Agent | Assignment belongs to authenticated agent; pickup verification passes | Agent not in `arrived_at_store` state |
| `picked_up` | `en_route_to_customer` | Delivery Agent | Assignment belongs to authenticated agent | Agent not in `picked_up` state |
| `en_route_to_customer` | `arrived_at_customer` | Delivery Agent | Assignment belongs to authenticated agent | Agent not in `en_route_to_customer` state |
| `arrived_at_customer` | `delivered` | Delivery Agent | Assignment belongs to authenticated agent; delivery confirmation passes | Agent not in `arrived_at_customer` state |
| `picked_up` | `failed` | Delivery Agent / Admin | Delivery attempt failed; failure reason provided | State is `delivered` or `cancelled` |
| `en_route_to_customer` | `failed` | Delivery Agent / Admin | Delivery attempt failed; failure reason provided | State is `delivered` or `cancelled` |
| `arrived_at_customer` | `failed` | Delivery Agent / Admin | Delivery attempt failed; failure reason provided | State is `delivered` or `cancelled` |

## Blocked Transitions

| Transition | Reason |
|------------|--------|
| Any state → `pending_assignment` | Assignment is created by system only at delivery record creation |
| `en_route_to_store` → `cancelled` | Cancellation is not allowed after rider is en route to store |
| `arrived_at_store` → `cancelled` | Cancellation is not allowed after rider arrived at store |
| `picked_up` → `cancelled` | Order is in rider's possession; cancellation route is `failed` |
| `en_route_to_customer` → `cancelled` | Order is in transit; cancellation route is `failed` |
| `arrived_at_customer` → `cancelled` | Order is at door; cancellation route is `failed` |
| `delivered` → any | Terminal state |
| `failed` → any | Terminal state |
| `cancelled` → any | Terminal state |
| Any backward transition | Delivery states are forward-only |

## Terminal State Lock Rule

States `delivered`, `failed`, and `cancelled` are terminal. No transition from
a terminal state is permitted under any actor or circumstance. Any request
attempting a terminal-state transition must be rejected with
`DELIVERY_ALREADY_COMPLETED` or `DELIVERY_INVALID_STATE_TRANSITION`.

## System-Triggered vs. Actor-Triggered Transitions

| Transition | Trigger type | Notes |
|------------|-------------|-------|
| → `pending_assignment` | System (automatic on `ready_for_pickup`) | No human actor |
| → `assigned` | System (dispatch) / Admin (manual) | Auto-assignment placeholder in Phase 6 |
| → `en_route_to_store` | Delivery Agent | Explicit API acknowledgement |
| → `arrived_at_store` | Delivery Agent | Explicit API call on store arrival |
| → `picked_up` | Delivery Agent | Explicit API call after pickup verification |
| → `en_route_to_customer` | Delivery Agent | Explicit API call after pickup |
| → `arrived_at_customer` | Delivery Agent | Explicit API call on customer arrival |
| → `delivered` | Delivery Agent | Explicit API call with delivery confirmation |
| → `failed` | Delivery Agent / Admin | Explicit API call with failure reason |
| → `cancelled` (pre-pickup) | System / Admin | Reassignment or manual admin cancellation |

## Assignment Cancellation Rules

- Cancellation of a delivery assignment is only permitted before the agent
  reaches `en_route_to_store` state.
- After `en_route_to_store`, the order must complete delivery or be marked
  `failed`; it cannot be cancelled.
- If a delivery record is cancelled, the order may be eligible for
  reassignment (pending_assignment) per admin/system rules defined in Module 4.

## Idempotency Rules

- The `delivered` transition must be idempotent: a second call from the same
  agent on an already-`delivered` assignment returns success without re-writing
  state.
- All other state-changing transitions are not idempotent and must reject
  duplicate calls after the state has advanced.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
