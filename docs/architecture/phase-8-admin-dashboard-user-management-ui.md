# Phase 8 Module 7 - Admin Dashboard User Management UI

## Status

Module 7 implemented.

## Objective

Admin Dashboard User Management UI provides the frontend surface for listing,
creating, viewing, and operationally managing admin users through the existing
Phase 8 Module 3 Admin User Management backend APIs.

## Scope Boundary

Module 7 owns Admin Dashboard frontend user-management code only. It may add
React pages, route wiring, API clients, query hooks, UI components, validators,
tests, and documentation related to admin-user management UI.

Module 7 does not add backend routes, controllers, services, repositories,
models, validators, OpenAPI paths, database fields, customer management,
delivery-agent management, vendor/store management, support workflows,
platform settings, or new admin-user backend behavior.

## Dependencies

- Phase 1 Admin Dashboard routing, auth state, layout, common components, and
  protected routes.
- Phase 2 admin authentication, RBAC, permissions, and user-session UI.
- Phase 8 Module 2 Admin Control architecture and audit expectations.
- Phase 8 Module 3 Admin User Management backend APIs.

## Planned UI Surfaces

- Admin user list with Module 3 filters: role, status, city, search, page, and
  limit.
- Create admin user modal.
- Admin user detail view.
- Admin user profile metadata edit modal.
- Status control with required reason capture.
- Role control with required reason capture.
- Direct permission control with required reason capture.
- Admin user audit history.

## Permission Model

Module 7 uses existing Admin Dashboard permission visibility helpers:

- `users:read` for list, detail, and audit visibility.
- `users:create` or `settings:manage` for create actions.
- `users:update` or `settings:manage` for profile metadata updates.
- `users:update-status` or `settings:manage` for status controls.
- `settings:manage` for role and direct permission controls.

## API Ownership

Module 7 consumes the existing Module 3 admin-user APIs. No new API endpoint is
introduced by this module.

## Implemented UI Surfaces

- Admin users list and filters.
- Create admin user modal.
- Admin user detail and audit history.
- Profile metadata update modal.
- Status control with reason capture.
- Role control with reason capture.
- Direct permission control with reason capture.
