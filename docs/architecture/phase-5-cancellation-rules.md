# Phase 5 Cancellation Rules

## Scope

This document defines cancellation rules at architecture level. It does not
create cancellation routes, services, validators, refund integrations, inventory
services, or tests.

**Sources:**

- `projectin micro/docone/AllPhase&Modules.pdf` (cancellation rules and Order Cancellation Backend)
- `projectin micro/docfour/PhaesDetail4&5.pdf` (order cancellation micro-tasks)

## Planned Cancellation Endpoints

Planned only:

- `POST /api/v1/customer/orders/{orderId}/cancel`
- `POST /api/v1/store/orders/{orderId}/cancel`
- `POST /api/v1/admin/orders/{orderId}/cancel`

## Actor Rules

| Actor | Allowed cancellation scope | Cutoff |
|-------|----------------------------|--------|
| Customer | Own order only | `placed` before store acceptance, unless later policy allows more |
| Store/vendor | Assigned-store order only | `placed`, `accepted`, `picking`, or `packing` when workflow policy allows |
| Admin | Authorized order scope | Active non-terminal orders when policy allows |
| System/job | Timeout-selected orders only | Acceptance timeout path only |

## Cancellation Cutoff

Architecture default:

- Customer cancellation is allowed while the order is `placed`.
- Customer cancellation is blocked once the store accepts and work starts.
- Store/admin cancellation may be allowed for active preparation states when a
  reason is supplied.
- Cancellation is blocked for `ready_for_pickup`, `shipped_placeholder`,
  `delivered_placeholder`, and `cancelled` unless a later approved policy narrows
  or expands this rule.

## Inventory Impact

- Cancellation before picking should release reserved or allocated inventory.
- Cancellation during picking/packing must reconcile picked and missing
  quantities.
- Inventory adjustment implementation belongs to Inventory Adjustment During
  Store Operations and Order Cancellation Backend.

## Payment / Refund Placeholder

- Payment/refund impact is a placeholder in Phase 5 cancellation architecture.
- Cancellation records whether refund review is required.
- Ledger/refund processing is deferred to later finance/refund phases.

## Required Cancellation Data

Planned fields only:

- `cancellationReason`
- `cancelledAt`
- `cancelledBy`
- `timeline[].reason`

## Audit Requirement

Every cancellation must append a lifecycle/timeline event with:

- actor
- reason
- previous status
- cancelled status
- timestamp

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
