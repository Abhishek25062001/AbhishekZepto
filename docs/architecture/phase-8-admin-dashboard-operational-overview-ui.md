# Phase 8 Admin Dashboard Operational Overview UI

Status: **COMPLETE** — Module 19 UI.

## Dependencies

- Phase 8 Module 18 Operational Analytics Backend.
- Existing Admin Dashboard authentication, protected route, and permission
  visibility utilities.

## Purpose

Admin Dashboard Operational Overview UI gives operations admins a read-only
dashboard route for Module 18 analytics summaries.

## Scope

In scope:

- Permission-gated `/analytics` Admin Dashboard route.
- Sidebar navigation visible only to users with `reports:read`.
- Read-only overview, order, delivery, store, and support analytics summaries.
- Supported filters from the Module 18 backend contract.
- Loading, error, and zero-count states.

Out of scope:

- Backend routes, controllers, services, repositories, models, validators, or
  database fields.
- Data exports, scheduled reports, custom report builders, forecasting, BI
  integrations, or realtime analytics.
- Source-domain mutation workflows.

## Permission Boundary

The route and navigation must require `reports:read`.
