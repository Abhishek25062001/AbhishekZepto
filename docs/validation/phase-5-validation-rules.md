# Phase 5 Validation Rules

## Scope

This document plans validation boundaries for Phase 5 order lifecycle and store
operations. It does not create validators, schemas, middleware, or tests.

## Order Lifecycle Validation

- `orderId` must be valid and resolve within actor scope.
- Requested status must be known to the Phase 5 state machine.
- Requested transition must be allowed by the transition matrix.
- Terminal states cannot transition to non-terminal states.
- Status updates must include actor context for audit/timeline records.

## Backend Order State Management Validation

- Store list requests must resolve actor store scope.
- Store detail requests must verify the order belongs to actor store scope.
- Admin list/detail requests must verify order read/operations permission.
- Admin status updates must verify status-update permission and actor context.
- Customer lifecycle reads must verify order ownership.
- Transition actor validation must happen before timeline append planning.

### List Filter Validation

- `status` must match a known lifecycle state.
- `storeStatus` must match a known store operation state.
- `paymentStatus` must match existing payment status conventions.
- `slaStatus` must match planned SLA status values.
- `fromDate` and `toDate` must be valid dates and form a valid range.
- `page` and `limit` must be positive integers within implementation limits.

### Detail And Transition Validation

- `orderId` must be valid before lookup.
- Missing actor store/admin scope must fail before data access.
- Detail responses must be scoped before timeline/lifecycle visibility is selected.
- Admin status target must be valid and allowed by the transition matrix.

## Store Acceptance Validation

- Order must belong to the actor's assigned store.
- Order must be in an acceptance-eligible state.
- Reject actions must include a reason.
- Timeout handling must only affect orders still waiting for acceptance.
- Ticket 3.1 validates `orderId` as an ObjectId and reject `reason` as a
  required trimmed string up to 500 characters.

## Picking Validation

- Picking can start only after store acceptance.
- Item picked/missing actions must reference an item in the order.
- Picked quantity and missing quantity cannot exceed ordered quantity.
- Picking completion requires all items to be resolved as picked, missing, or
  partial per Module 4 rules.

## Packing Validation

- Packing can start only after picking completion.
- Ready-for-pickup can be marked only after packing completion.
- Package verification remains a placeholder in Phase 5 source tasks.

## Cancellation Validation

- Customer cancellation requires order ownership.
- Store cancellation requires store ownership.
- Admin cancellation requires order cancellation permission.
- Cancellation must be blocked after the cutoff state defined by Module 1.
- Cancellation requires a reason, inventory release behavior, and payment/refund
  placeholder behavior.
- Ticket 7.2 implements cancellation reason validation as a required trimmed
  string up to 500 characters.
- Cancellation architecture is defined in
  `docs/architecture/phase-5-cancellation-rules.md`.

## SLA Validation

- SLA evaluation requires lifecycle timestamps.
- SLA delayed marking applies only to active, non-terminal orders.
- SLA fields must not be updated for orders outside the actor/system scope.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
