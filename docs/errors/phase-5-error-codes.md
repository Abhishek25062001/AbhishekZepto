# Phase 5 Error Codes

## Scope

This document plans Phase 5 order lifecycle error categories. It does not create
error constants, response helpers, validators, or tests.

## Planned Error Codes

| Code | HTTP status | Meaning |
|------|-------------|---------|
| `ORDER_NOT_FOUND` | 404 | Order id does not resolve to an order in actor scope |
| `ORDER_ACCESS_FORBIDDEN` | 403 | Actor cannot access or operate this order |
| `ORDER_INVALID_STATUS` | 400 | Requested status is not a valid Phase 5 status |
| `ORDER_INVALID_TRANSITION` | 409 | Requested state change is not allowed |
| `ORDER_ALREADY_TERMINAL` | 409 | Order is already cancelled/delivered and cannot transition |
| `ORDER_ACCEPTANCE_NOT_ALLOWED` | 409 | Store cannot accept/reject in current state |
| `ORDER_REJECTION_REASON_REQUIRED` | 400 | Store rejection requires a reason |
| `ORDER_PICKING_NOT_ALLOWED` | 409 | Picking operation is invalid for current state — implemented Ticket 4.2 |
| `ORDER_PACKING_NOT_ALLOWED` | 409 | Packing operation is invalid for current state — implemented Ticket 5.2 |
| `ORDER_STATUS_UPDATE_NOT_ALLOWED` | 409 | Admin status update is invalid for current lifecycle state — implemented Module 11 |
| `ORDER_CANCELLATION_NOT_ALLOWED` | 409 | Cancellation cutoff or policy blocks cancellation — implemented Ticket 7.2 |
| `ORDER_CANCELLATION_REASON_REQUIRED` | 400 | Cancellation requires a reason — implemented Ticket 7.2 |
| `ORDER_CANCELLATION_OWNERSHIP_INVALID` | 403 | Actor does not own or have permission for cancellation |
| `ORDER_ITEM_OPERATION_INVALID` | 400 | Picked/missing item operation is invalid — implemented Ticket 4.2 |
| `ORDER_SLA_OPERATION_NOT_ALLOWED` | 409 | SLA operation is invalid for current state |
| `ORDER_FILTER_INVALID` | 400 | Store/admin order list filter is invalid |
| `ORDER_SCOPE_REQUIRED` | 400 | Required actor scope is missing from request context |
| `ORDER_STORE_SCOPE_FORBIDDEN` | 403 | Store actor cannot access this order/store scope |
| `ORDER_ADMIN_PERMISSION_REQUIRED` | 403 | Admin actor lacks required order permission |

## Module 2 Error Coverage

Backend Order State Management planned APIs must cover:

- invalid order id
- invalid list filters
- missing store/admin actor scope
- order not found in actor scope
- forbidden store/admin access
- invalid status target
- invalid transition
- terminal order mutation

## Response Shape

Use existing project error response conventions during implementation. Module 0
does not introduce a new runtime response helper.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
