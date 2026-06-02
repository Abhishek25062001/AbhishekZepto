# Phase 8 Module 5 — Delivery Agent Management API

## Status

Implemented.

## Endpoints

- `GET /api/v1/admin/delivery-agents`
- `GET /api/v1/admin/delivery-agents/:deliveryAgentId`
- `PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/status`
- `PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/verification`
- `GET /api/v1/admin/delivery-agents/:deliveryAgentId/assignments`
- `GET /api/v1/admin/delivery-agents/:deliveryAgentId/audit`

## List Filters

`GET /api/v1/admin/delivery-agents` supports only these admin inspection
filters:

| Query | Type | Notes |
| --- | --- | --- |
| `status` | `active` or `inactive` | Maps to existing `isActive`. |
| `availabilityStatus` | `online` or `offline` | Maps to existing `availabilityStatus`. |
| `verificationStatus` | `verified` or `unverified` | Maps to existing `isVerified`. |
| `cityId` | ObjectId | Filters by operating city. |
| `search` | string, 1-120 chars | Literal case-insensitive match against name, phone, email, or vehicle number. |
| `page` | integer | Defaults to `1`. |
| `limit` | integer | Defaults to `20`, maximum `100`. |

## Response Shape

Delivery agent list/detail responses return existing `delivery_agents` fields
for admin inspection. The response does not expose soft-delete internals.

## Permission Gates

- List, detail, and assignment inspection require `delivery:read` or `settings:manage`.
- Status updates require `delivery:update-status` or `settings:manage`.
- Verification updates require `delivery:update` or `settings:manage`.
- Audit inspection requires `delivery:read` or `settings:manage`.

## Error And Scope Contract

Admin requests with a scoped `cityId` may only inspect or manage delivery
agents in that city. Cross-city list filters and cross-city delivery-agent ids
return `INVALID_ADMIN_SCOPE` with HTTP `403`. Missing or deleted agents return
`DELIVERY_AGENT_NOT_FOUND` with HTTP `404`.

## Boundaries

Module 5 does not add assignment dispatch, reassignment, realtime tracking,
payroll, incentive, analytics, export, or Delivery Agent App UI behavior.

## Status And Verification Writes

`PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/status` accepts
`active` or `inactive` and requires `reason`. The endpoint updates existing
`isActive`. Setting a delivery agent `inactive` also moves the agent offline via
existing availability fields and stores the forced-offline reason; it does not
change delivery assignment state.

`PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/verification` accepts
`verified` or `unverified` and requires `reason`. It updates only existing
`isVerified`.

## Read-Only Assignment Inspection

`GET /api/v1/admin/delivery-agents/:deliveryAgentId/assignments` returns
existing `delivery_assignments` records linked to the delivery agent. It
supports `status`, `fromDate`, `toDate`, `page`, and `limit` filters. This
endpoint does not assign, unassign, reassign, cancel, fail, or otherwise mutate
delivery assignment state.

## Read-Only Audit Inspection

`GET /api/v1/admin/delivery-agents/:deliveryAgentId/audit` returns existing
admin audit records where `entityType` is `delivery_agent` and `entityId` is the
delivery agent id. It supports `page` and `limit` only.

## Audit Writes

Delivery agent status updates write `DELIVERY_AGENT_STATUS_CHANGED` admin action
audit records. Delivery agent verification updates write
`DELIVERY_AGENT_VERIFICATION_CHANGED` records. Audit writes capture the
before/after admin delivery-agent summary and the submitted reason.
