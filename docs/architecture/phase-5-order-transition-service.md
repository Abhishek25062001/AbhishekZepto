# Phase 5 Order Transition Service

## Scope

This document defines the planned order transition service behavior for Backend
Order State Management. It does not create a service file, repository, validator,
controller, route, constants, tests, or database writes.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (Backend Order State Management)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (order state/lifecycle service micro-tasks)

## Planned Responsibility

The future transition service validates and records order lifecycle transitions
using the Module 1 architecture:

- state machine: `docs/architecture/phase-5-order-state-machine.md`
- transition matrix: `docs/contracts/order-state-transition-matrix.md`
- ownership rules: `docs/architecture/phase-5-order-ownership-rules.md`
- audit events: `docs/architecture/phase-5-audit-logging.md`

## Planned Method Shape

Planned only:

```text
transitionOrderState(orderId, targetState, actorContext, notes?)
```

The implementation ticket may choose exact naming and parameters.

## Planned Flow

1. Load order by id within actor scope.
2. Resolve current lifecycle state.
3. Validate requested target state against the transition matrix.
4. Validate actor authority for the transition.
5. Update current state field plan.
6. Append lifecycle/timeline event.
7. Return updated state summary.

## Invalid Transition Handling

- Unknown target state returns `ORDER_INVALID_STATUS`.
- Disallowed transition returns `ORDER_INVALID_TRANSITION`.
- Terminal-state mutation returns `ORDER_ALREADY_TERMINAL`.
- Missing actor scope returns `ORDER_ACCESS_FORBIDDEN`.

## Planned Field Touches

Planned only:

- `orderStatus`
- `storeStatus`
- `timeline[].fromStatus`
- `timeline[].toStatus`
- `timeline[].createdAt`

## Deferred Implementation

Runtime service implementation belongs to a later coding/setup pass after the
repository/bootstrap gate is cleared.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
