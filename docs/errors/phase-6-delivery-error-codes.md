# Phase 6 Delivery Error Codes

## Scope

This document plans Phase 6 delivery lifecycle error codes. It does not create
error constants, response helpers, validators, or tests.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery micro-tasks)
- `docs/contracts/api-error-codes.md` (existing error code registry)
- `docs/errors/phase-5-error-codes.md` (Phase 5 pattern)

## Planned Error Codes

| Code | HTTP status | Meaning | Triggered when |
|------|-------------|---------|----------------|
| `DELIVERY_AGENT_NOT_FOUND` | 404 | Delivery agent profile does not exist or is not in scope | Agent ID resolves to no active profile |
| `DELIVERY_AGENT_UNAVAILABLE` | 409 | Agent is offline or not available for assignment | Assignment attempted while agent is `offline` or already has active delivery |
| `DELIVERY_ASSIGNMENT_NOT_FOUND` | 404 | Assignment ID does not resolve to a delivery record | Assignment ID is invalid or not in actor scope |
| `DELIVERY_ASSIGNMENT_ALREADY_ACKNOWLEDGED` | 409 | Agent has already acknowledged this assignment | Duplicate acknowledge call after state has advanced |
| `DELIVERY_INVALID_STATE_TRANSITION` | 409 | Requested delivery state change is not allowed | Transition not in the allowed matrix |
| `DELIVERY_ORDER_NOT_READY_FOR_PICKUP` | 409 | Order is not in `ready_for_pickup` state when delivery is being created | Assignment creation attempted before store marks order ready |
| `DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER` | 403 | Authenticated agent is not the assigned agent for this delivery | `deliveryAgentId` on assignment does not match authenticated agent |
| `DELIVERY_ALREADY_COMPLETED` | 409 | Delivery is already in a terminal state | Transition attempted on `delivered`, `failed`, or `cancelled` delivery |
| `DELIVERY_CANCELLATION_NOT_ALLOWED` | 409 | Cancellation is not permitted at this delivery stage | Cancel attempted after `en_route_to_store` or beyond |
| `DELIVERY_CANCELLATION_REASON_REQUIRED` | 400 | Cancellation requires a reason | Cancel/failed call missing `reason` field |
| `DELIVERY_FAILURE_REASON_REQUIRED` | 400 | Failed delivery requires a reason | Failed attempt call missing `reason` field |
| `DELIVERY_SLA_CONFIG_NOT_FOUND` | 500 | SLA configuration for city/zone is not found | SLA evaluation cannot find config for order's location |
| `DELIVERY_AVAILABILITY_INVALID` | 400 | Availability value is not valid | Availability toggle value is not `online` or `offline` |
| `DELIVERY_SCOPE_REQUIRED` | 400 | Required actor scope is missing from request context | Agent/customer/store scope cannot be resolved |
| `DELIVERY_ACCESS_FORBIDDEN` | 403 | Actor cannot access or operate this delivery | Ownership or permission check fails |
| `DELIVERY_AGENT_PROFILE_INCOMPLETE` | 409 | Agent profile is missing required fields for active assignment | Agent attempts to go online without complete profile |
| `DELIVERY_FILTER_INVALID` | 400 | Admin delivery list filter is invalid | Unknown filter field or value |

## Coverage by Surface

### Delivery Agent Surface

Planned APIs must handle:

- invalid assignment ID
- assignment not belonging to authenticated agent
- invalid state transition
- terminal delivery mutation
- duplicate acknowledgement
- missing reason on failure/cancellation

### Customer Surface

Planned APIs must handle:

- delivery record not found for order
- customer does not own the order
- order has no active delivery record

### Admin Surface

Planned APIs must handle:

- invalid delivery ID
- missing permission for override
- invalid override state target
- terminal state override attempt

## Response Shape

Use existing project error response conventions during implementation. This
document does not introduce a new runtime response helper.

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "DELIVERY_INVALID_STATE_TRANSITION",
    "details": {}
  }
}
```

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
