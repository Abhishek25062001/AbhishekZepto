# Phase 8 Module 5 — Delivery Agent Management Permissions

## Route Permissions

| Capability | Endpoint | Required permission |
| --- | --- | --- |
| Delivery agent list/detail/assignments | `GET /api/v1/admin/delivery-agents*` | `delivery:read` or `settings:manage` |
| Delivery agent status update | `PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/status` | `delivery:update-status` or `settings:manage` |
| Delivery agent verification update | `PATCH /api/v1/admin/delivery-agents/:deliveryAgentId/verification` | `delivery:update` or `settings:manage` |
| Delivery agent audit read | `GET /api/v1/admin/delivery-agents/:deliveryAgentId/audit` | `delivery:read` or `settings:manage` |

## Seed Roles

Support admin receives `delivery:read` for inspection. Operations admin
receives `delivery:read`, `delivery:update`, and `delivery:update-status` for
operational controls. Super admin retains wildcard permissions.

## Boundary

Permission gates authorize only Module 5 admin delivery-agent management
surfaces. They do not grant assignment dispatch, reassignment, payroll,
incentive, export, analytics, or Delivery Agent App permissions.
