# Phase 8 Module 8 - Admin Dashboard Delivery Agent Management UI Contract

## Status

Module 8 implemented.

## Admin Dashboard Routes

- `/delivery-agents`
- `/delivery-agents/:deliveryAgentId`

## Consumed Endpoints

- `GET /api/v1/admin/delivery-agents`
- `GET /api/v1/admin/delivery-agents/:deliveryAgentId`
- `PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/status`
- `PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/verification`
- `GET /api/v1/admin/delivery-agents/:deliveryAgentId/assignments`
- `GET /api/v1/admin/delivery-agents/:deliveryAgentId/audit`

## List Filters

The Admin Dashboard delivery-agent list may send only these filters to
`GET /api/v1/admin/delivery-agents`:

- `status`
- `availabilityStatus`
- `verificationStatus`
- `cityId`
- `search`
- `page`
- `limit`

## Detail Inspection

Delivery-agent detail displays existing Module 5 delivery-agent read-model
fields only. Assignment and audit sections are read-only.

## Mutation Contracts

Status updates submit only `status` and `reason` to the status endpoint.
Verification updates submit only `verificationStatus` and `reason` to the
verification endpoint.

## Boundaries

Module 8 is a frontend consumer of existing backend APIs. It must not add API
routes, OpenAPI paths, database fields, backend delivery-agent behavior,
assignment dispatch/reassignment controls, payroll, incentives, analytics,
exports, support-ticket workflows, or Delivery Agent App UI behavior.
