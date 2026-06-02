# Phase 8 Operational Analytics Backend

Status: **COMPLETE** — Module 18 backend.

## Dependencies

- Phase 8 Module 2 Admin Control architecture and permission foundation.
- Phase 8 Module 4 Customer Management backend for customer/order visibility.
- Phase 8 Module 5 Delivery Agent Management backend for delivery-agent
  inspection data.
- Phase 8 Module 6 Vendor & Store Management backend for store/vendor
  inspection data.
- Phase 8 Module 12 Support Operations backend for support ticket summaries.
- Phase 8 Module 16 Audit Log System for admin audit visibility.

## Purpose

Operational Analytics Backend gives admin users a read-only reporting surface
for high-level operational summaries across orders, deliveries, stores, and
support workflows.

## Scope

In scope:

- Admin-only read APIs under `/api/v1/admin/analytics`.
- Permission-gated overview, order, delivery, store, and support summaries.
- Bounded date-range, timezone, and entity filters using existing records.
- Stable zero-count responses when no data exists.

Out of scope:

- Admin Dashboard analytics UI.
- Data exports, scheduled reports, custom report builders, forecasting, and BI
  integration.
- Order, delivery, customer, vendor, store, catalog, support, finance, settings,
  audit, or inventory mutation workflows.
- New analytics collections, materialized views, or background aggregation jobs.

## Ownership

Operational Analytics reads existing operational records and does not own any
database collections. Source modules remain responsible for their own schemas,
mutations, and audit events.

## Permission Boundary

Every endpoint must require the existing admin authentication and role boundary
plus the Module 18 read permission documented in the analytics API contract.
