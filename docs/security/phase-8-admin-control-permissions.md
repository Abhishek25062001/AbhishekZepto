# Phase 8 Admin Control Permissions

## Status

Planned. This document records permission groups for Phase 8 Admin Control &
Operational Oversight. It does not implement permission constants, role seed
data, middleware, or backend authorization logic.

## Source Scope

- `projectin micro/docone/AllPhase&Modules.pdf` — Admin Control Architecture
  permission group planning.
- `projectin micro/docfive/PhaesDetail6,7&8.pdf` — Admin Control role, action,
  city-scope, and validation planning.

## Permission Groups

## Admin Role Hierarchy

Phase 8 Admin Control depends on the existing Phase 2 role and permission
system. This document records role intent only; it does not implement role
constants, role seed data, middleware, or route guards.

- `SUPER_ADMIN`: full platform administrative authority, including sensitive
  operational control, settings, audit, and cross-city visibility.
- `OPS_ADMIN`: operations role for live order, delivery, store, SLA, and
  incident oversight within allowed scope.
- `CITY_ADMIN`: city-scoped operations role for monitoring and permitted actions
  inside assigned city scope.
- catalog admin: catalog and product oversight role.
- support admin: customer/support workflow role.
- finance admin: payment, refund, reporting, and finance visibility role.
- City manager: city-level operations visibility and limited action role.
- read-only admin: monitoring and review role with no mutation authority.

Sensitive operational actions are limited to `SUPER_ADMIN`, `OPS_ADMIN`, or
`CITY_ADMIN` unless a later implementation ticket explicitly grants a narrower
role permission.

### Users

Controls visibility and actions for admin users, customer users, delivery-agent
users, and vendor/store users.

### Stores

Controls store management, store operational state visibility, store scope, and
future force-close/reopen authority.

### Catalog

Controls catalog, product, category, brand, inventory visibility, and catalog
oversight actions.

### Orders

Controls order visibility, order operational review, and future sensitive order
override authority.

### Delivery

Controls delivery-agent visibility, assignment review, active-delivery
monitoring, and future force-offline/assignment override authority.

### Payments

Controls payment, refund, payout, vendor finance, and settlement visibility.

### Support

Controls support ticket visibility, customer notes, issue handling, and
support-team workflow access.

### Reports

Controls operational analytics, dashboard summaries, data exports, and reporting
visibility.

Module 18 introduces `reports:read` for read-only operational analytics backend
access. It does not introduce report mutation, export, schedule, or manage
permissions.

Module 20 introduces `reports:export` for admin export request metadata
creation and inspection. It does not introduce file generation, download
streaming, scheduled exports, retry/cancel/delete workflows, or report-builder
permissions.

### Settings

Controls platform settings, city/store settings, feature flags, operational
limits, and sensitive configuration actions.

### Audit Logs

Controls audit-log search, audit detail access, sensitive before/after data, and
compliance review.

## Operationally Sensitive Groups

The orders, delivery, stores, settings, payments, reports, and audit logs groups
are operationally sensitive. Later implementation must require explicit role and
scope checks before allowing mutations, data export, sensitive data reveal, or
force actions.

## Approval And Reason Capture

Later implementation must require confirmation and reason capture for force
cancel, force assignment, unassign agent, force store close, force agent offline,
SLA escalation, and delivery-zone override actions.

Higher-role approval may be required for cross-city overrides, active-order store
closures, active-assignment agent offline actions, late-state order cancellation,
and sensitive platform setting changes.

| Action | Confirmation | Reason capture | Higher-role approval |
| --- | --- | --- | --- |
| Force cancel | Required | Required | Required for late-state or cross-city orders |
| Force assignment | Required | Required | Required for cross-city assignment |
| Unassign agent | Required | Required | Required when reassignment risk is high |
| Force store close | Required | Required | Required when active orders exist |
| Force agent offline | Required | Required | Required when active assignment exists |
| SLA escalation | Required | Required | Optional unless cross-city |
| Delivery-zone override | Required | Required | Required |

## Sensitive Data Visibility

Later implementation must mask customer phone, customer address, payment
details, rider details, and vendor financial data unless the admin has the
required role, permission group, and entity scope.

Sensitive reveal actions should be auditable when audit-log implementation is
added. This document does not implement masking enforcement.

Default list, search, monitoring, and export responses should use masked values
unless the active role has explicit permission to reveal the sensitive field.
Reveal actions should record actor, entity, field group, reason, and timestamp
when later audit implementation is available.

## Deferred Implementation

Permission names, backend constants, seed-role updates, authorization
middleware, and admin-dashboard permission gating are deferred to later Phase 8
implementation modules.

No backend permission constants are added by the architecture tickets unless a
later ticket explicitly requires them. No seed updates are added by this
permission-group ticket. Admin Dashboard UI permission gating is deferred to the
Phase 8 Admin Dashboard modules.
