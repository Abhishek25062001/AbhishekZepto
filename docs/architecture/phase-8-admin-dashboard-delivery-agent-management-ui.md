# Phase 8 Module 8 - Admin Dashboard Delivery Agent Management UI

## Status

Module 8 implemented.

## Objective

Admin Dashboard Delivery Agent Management UI provides the frontend surface for
listing, inspecting, status-managing, verification-managing, and reviewing
delivery-agent assignments and audit records through the existing Phase 8
Module 5 Delivery Agent Management backend APIs.

## Scope Boundary

Module 8 owns Admin Dashboard frontend delivery-agent management code only. It
may add React pages, route wiring, API clients, query hooks, UI components,
validators, tests, and documentation related to admin delivery-agent
management UI.

Module 8 does not add backend routes, controllers, services, repositories,
models, validators, OpenAPI paths, database fields, assignment dispatch,
reassignment, delivery state-machine rewrites, realtime tracking rewrites,
payroll, incentives, analytics, exports, support-ticket workflows, or Delivery
Agent App UI behavior.

## Dependencies

- Phase 1 Admin Dashboard routing, auth state, layout, common components, and
  protected routes.
- Phase 2 admin authentication and RBAC permissions.
- Phase 8 Module 5 Delivery Agent Management backend APIs.
- Phase 8 Module 7 Admin Dashboard user-management UI patterns.

## Implemented UI Surfaces

- Delivery-agent list with Module 5 filters: status, availability status,
  verification status, city, search, page, and limit.
- Delivery-agent detail summary.
- Read-only delivery-agent assignment inspection.
- Read-only delivery-agent audit inspection.
- Delivery-agent active/inactive status control with reason capture.
- Delivery-agent verified/unverified control with reason capture.

## Permission Model

Module 8 uses existing Admin Dashboard permission visibility helpers:

- `delivery:read` for list, detail, assignments, and audit visibility.
- `delivery:update-status` or `settings:manage` for active/inactive status
  controls.
- `delivery:update` or `settings:manage` for verification controls.

## API Ownership

Module 8 consumes the existing Module 5 delivery-agent management APIs. No new
API endpoint is introduced by this module.
