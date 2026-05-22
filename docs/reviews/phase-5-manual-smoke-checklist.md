# Phase 5 Manual Smoke Checklist

**Module:** 15 - Phase 5 Testing & Validation; Module 16 - Integration & Review
**Status:** Ready for operator execution
**Last updated:** 2026-05-21

## Execution Status

Manual smoke has not been run against a live seeded environment in this ticket.
The checklist below is prepared for operator execution. Automated validation is
recorded in `docs/testing/phase-5-testing-validation-verification.md` and
Module 16 integration readiness is recorded in
`docs/testing/phase-5-integration-review-verification.md`.

## Scope

This checklist is a Phase 5 Module 0 planning artifact. It records manual smoke
coverage for later execution and does not run any live environment checks.

## Store Operations Journey

| Check | Status | Notes |
|---|---|---|
| Customer order exists from Phase 4 placement with `orderStatus=placed`. | PENDING | Requires live seeded customer order. |
| Store user can see incoming order for assigned store. | PENDING | Requires store user session. |
| Store user can accept eligible incoming order. | PENDING | Verify audit/timeline after action. |
| Accepted order appears in active order workflow. | PENDING | Verify Vendor Panel active order list. |
| Store user can start picking. | PENDING | Verify state transition. |
| Store user can mark item picked. | PENDING | Verify item quantity. |
| Store user can mark item missing. | PENDING | Verify item quantity. |
| Store user can complete picking when item states are resolved. | PENDING | Verify inventory adjustment. |
| Store user can start packing. | PENDING | Verify state guard. |
| Store user can complete packing. | PENDING | Verify timeline. |
| Store user can mark order ready for pickup. | PENDING | Verify terminal Phase 5 state. |

## Cancellation And Inventory

| Check | Status | Notes |
|---|---|---|
| Customer can cancel eligible own order before cutoff. | PENDING | Requires customer session. |
| Store can cancel eligible assigned-store order. | PENDING | Requires store user session. |
| Admin can cancel eligible authorized order. | PENDING | Requires admin session. |
| Cancellation releases or reconciles inventory according to Phase 5 rules. | PENDING | Verify inventory movement/stock. |
| Cancellation records reason and audit/timeline event. | PENDING | Verify audit/timeline. |

## Vendor Panel

| Check | Status | Notes |
|---|---|---|
| Incoming order list shows relevant store orders. | PENDING | Requires Vendor Panel runtime. |
| Incoming order detail shows order summary. | PENDING | Verify line items and totals. |
| Accept/reject actions call planned backend routes. | PENDING | Verify network/API result. |
| Active picking/packing screens reflect backend state. | PENDING | Verify refresh after mutation. |
| Store history filters show completed/cancelled records. | PENDING | Verify query params and list. |

## Admin Dashboard

| Check | Status | Notes |
|---|---|---|
| Admin order monitoring shows active orders. | PENDING | Requires Admin Dashboard runtime. |
| Admin filters work by status, store, city, payment status, date, customer. | PENDING | Verify query params. |
| Admin detail shows lifecycle/timeline. | PENDING | Verify timeline order. |
| Admin cancellation action follows permission and validation rules. | PENDING | Verify forbidden/allowed states. |
| Delayed-order visibility appears when SLA rules mark a breach. | PENDING | Requires breached order fixture or job run. |

## Customer App

| Check | Status | Notes |
|---|---|---|
| Customer order detail shows current Phase 5 status. | PENDING | Requires Customer App runtime. |
| Customer order timeline displays lifecycle history. | PENDING | Verify customer-safe labels. |
| Customer cancellation action appears only when eligible. | PENDING | Verify cutoff state. |
| Cancelled order state is clearly displayed. | PENDING | Verify cancelled order fixture. |
| Order history status refreshes after lifecycle changes. | PENDING | Verify after store/admin mutation. |

## SLA And Escalation

| Check | Status | Notes |
|---|---|---|
| SLA timestamps are visible in relevant order APIs. | PENDING | Verify store/admin API payloads. |
| Delayed order marking job identifies breached active orders. | PENDING | Requires controlled timestamps. |
| SLA breach audit/timeline event is recorded. | PENDING | Verify `order.sla.breached`. |
| Vendor/admin surfaces show delayed-order status. | PENDING | Verify breached fixture visibility. |

## Module 16 Integration Readiness

| Check | Status | Notes |
|---|---|---|
| Phase 5 Module 0-15 handoffs are present. | PASS | Verified by Module 16 Ticket 16.3. |
| Backend order lifecycle tests pass before manual smoke. | PASS | Verified repeatedly by Module 16 backend review loop. |
| Vendor/Admin/Customer frontend aggregate tests pass before manual smoke. | PASS | Verified by Module 16 cross-surface reviews. |
| OpenAPI exposes Phase 5 order endpoints. | PASS | Verified by Module 16 OpenAPI checks. |
| Live seeded users and orders are available. | NEEDS VERIFICATION | Operator must prepare environment before smoke execution. |

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
