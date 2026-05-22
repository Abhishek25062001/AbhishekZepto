# Phase 6 Delivery Validation Rules

## Scope

This document plans validation boundaries for Phase 6 delivery lifecycle
operations. It does not create validators, schemas, middleware, or tests.

**Sources:**

- `projectin micro/docfive/PhaesDetail6,7&8.pdf` (Phase 6 delivery micro-tasks)
- `docs/validation/phase-5-validation-rules.md` (Phase 5 pattern)
- `docs/contracts/delivery-state-transition-matrix.md`

## Availability Toggle Validation

- `status` must be present and one of: `online` | `offline`.
- Invalid values must be rejected with `DELIVERY_AVAILABILITY_INVALID` (HTTP 400).
- An agent may not toggle to `online` if their profile is incomplete
  (`DELIVERY_AGENT_PROFILE_INCOMPLETE`).

## Assignment Acknowledgement Validation

- `assignmentId` must be a valid MongoDB ObjectId format.
- Assignment must exist and belong to the authenticated delivery agent
  (`DELIVERY_AGENT_NOT_ASSIGNED_TO_ORDER`).
- Assignment must be in `assigned` state to be acknowledged.
- Duplicate acknowledgements on already-advanced state must return
  `DELIVERY_ASSIGNMENT_ALREADY_ACKNOWLEDGED` (HTTP 409).

## Delivery State Transition Validation (all state-change endpoints)

- `assignmentId` must be a valid ObjectId before lookup.
- Assignment must exist and belong to the authenticated agent scope.
- Requested transition must be in the allowed transition matrix
  (`DELIVERY_INVALID_STATE_TRANSITION`).
- Terminal states (`delivered`, `failed`, `cancelled`) must be rejected for any
  further transition (`DELIVERY_ALREADY_COMPLETED`).
- Actor context must be captured before state mutation for timeline record.

## Pickup Validation

- Pickup (`picked_up`) can only be triggered after `arrived_at_store`.
- Pickup verification method is a placeholder in Phase 6 (no barcode or OTP
  validation implemented yet; field is recorded as metadata).

## Delivery Confirmation Validation

- Delivery confirmation (`delivered`) can only be triggered after
  `arrived_at_customer`.
- Delivery confirmation is idempotent: a second call with the same agent on
  an already-`delivered` assignment returns success without re-writing state.
- Confirmation method is a placeholder in Phase 6 (no photo or OTP validation
  implemented yet; field is recorded as metadata).

## Failed Delivery Validation

- Failed delivery can be triggered from `picked_up`, `en_route_to_customer`,
  or `arrived_at_customer`.
- `reason` is required and must be a non-empty trimmed string up to 500
  characters (`DELIVERY_FAILURE_REASON_REQUIRED`).
- Failure cannot be triggered after `delivered` or `cancelled`
  (`DELIVERY_ALREADY_COMPLETED`).

## Cancellation Validation

- Delivery assignment cancellation is only permitted from `pending_assignment`
  or `assigned` states.
- After `en_route_to_store`, cancellation is blocked
  (`DELIVERY_CANCELLATION_NOT_ALLOWED`).
- `reason` is required for all cancellations (`DELIVERY_CANCELLATION_REASON_REQUIRED`).
- Cancellation reason must be a non-empty trimmed string up to 500 characters.

## Admin Override Validation

- Admin override requires `delivery:update` permission.
- Override target state must be a valid delivery state.
- Terminal-state overrides must be explicitly allowed by admin module rules.
- Admin override must include `reason` and actor context for audit.

## Customer Tracking Validation

- Customer delivery read requires `orderId` resolving to an order where
  `order.customerId` matches the authenticated customer.
- If no delivery record exists yet for the order, return empty/pending state
  rather than a 404 (implementation detail owned by Module 13).

## Vendor Pickup Visibility Validation

- Vendor delivery-status read requires `orderId` resolving to an order where
  `order.storeId` is in the authenticated vendor/store actor scope.
- Response must be scoped to pickup-phase fields only (assignment, store arrival,
  picked-up state); drop-phase fields must not be exposed to vendor.

## List Filter Validation (Admin)

- `status` must match a known delivery lifecycle state.
- `agentId` must be a valid ObjectId format if provided.
- `storeId` must be a valid ObjectId format if provided.
- `slaStatus` must match planned SLA status values.
- `fromDate` and `toDate` must be valid ISO dates and form a valid range.
- `page` and `limit` must be positive integers within implementation limits.

## API Endpoints

No API endpoints are implemented in this document.

## DB Fields

No database fields are created in this document.
