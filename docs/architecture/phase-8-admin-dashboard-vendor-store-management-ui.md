# Phase 8 Module 9 - Admin Dashboard Vendor & Store Management UI

## Status

Module 9 implemented.

## Objective

Admin Dashboard Vendor & Store Management UI provides the frontend surface for
listing, inspecting, status-managing, and reviewing vendors and stores through
the existing Phase 8 Module 6 Vendor & Store Management backend APIs.

## Scope Boundary

Module 9 owns Admin Dashboard frontend vendor/store management code only. It
may add React pages, route wiring, API clients, query hooks, UI components,
validators, tests, and documentation related to admin vendor/store management
UI.

Module 9 does not add backend routes, controllers, services, repositories,
models, validators, OpenAPI paths, database fields, Vendor Panel UI, catalog
CRUD rewrites, inventory mutations, order workflow actions, payouts,
settlements, analytics, exports, or support-ticket workflows.

## Dependencies

- Phase 1 Admin Dashboard routing, auth state, layout, common components, and
  protected routes.
- Phase 2 admin authentication and RBAC permissions.
- Phase 3 store foundation routes and existing Admin Dashboard store routes.
- Phase 8 Module 6 Vendor & Store Management backend APIs.
- Phase 8 Modules 7 and 8 Admin Dashboard management UI patterns.

## Implemented UI Surfaces

- Vendor list with Module 6 filters: status, city, search, page, and limit.
- Vendor detail summary.
- Vendor status control with reason capture.
- Store list with Module 6 filters: status, vendor, city, search, page, and
  limit.
- Store detail summary.
- Read-only store orders inspection.
- Read-only store inventory inspection.
- Read-only store audit inspection.
- Store status control with reason capture.

## Permission Model

Module 9 uses existing Admin Dashboard permission visibility helpers:

- `stores:read` for vendor list/detail and store list/detail/inspection
  visibility.
- `stores:update` or `settings:manage` for vendor and store status controls.
- `settings:manage` as the super-admin override for read and update surfaces
  where Module 6 allows it.

## API Ownership

Module 9 consumes the existing Module 6 vendor/store management APIs. No new API
endpoint is introduced by this module.
