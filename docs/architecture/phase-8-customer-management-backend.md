# Phase 8 Module 4 — Customer Management Backend

## Status

Module 4 implemented.

## Objective

Customer Management Backend provides the Admin Dashboard backend surface for
listing, viewing, status-managing, annotating, and inspecting customers.

## Scope Boundary

Module 4 owns backend customer management only. It may add backend routes,
controllers, services, repositories, models, validators, OpenAPI paths, tests,
and documentation related to admin-facing customer management.

Module 4 does not implement Admin Dashboard frontend UI, support-ticket
management, refunds, analytics, exports, platform settings, delivery-agent
management, vendor/store management, or customer-facing app changes.

## Dependencies

- Phase 2 auth identity and RBAC foundation.
- Phase 4 customer address and customer app foundations.
- Phase 5 order lifecycle backend.
- Phase 8 Module 2 Admin Control audit and route patterns.
- Phase 8 Module 3 Admin User Management backend patterns.

## Runtime Ownership

Existing auth `UserIdentity` records with role `customer` remain the source of
truth for customer identity, account status, scope, and login metadata. Module 4
adds admin-facing customer management metadata and read surfaces around those
existing records.

## Domain Model

Customer Management uses existing `UserIdentity` customer records plus
`customer_admin_profiles` for admin-only metadata.

Implemented admin-visible fields:

- `customerId`
- `userId`
- `name`
- `phone`
- `email`
- `accountStatus`
- `cityId`
- `riskStatus`
- `adminNotes`
- `blockedAt`
- `blockedBy`
- `blockReason`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

## Implemented API Endpoints

- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/customers/:customerId`
- `PATCH /api/v1/admin/customers/:customerId/status`
- `PATCH /api/v1/admin/customers/:customerId/notes`
- `GET /api/v1/admin/customers/:customerId/orders`
- `GET /api/v1/admin/customers/:customerId/addresses`
- `GET /api/v1/admin/customers/:customerId/audit`

The list endpoint supports status, city, literal search, created date range,
page, and limit filters only. Search is intentionally limited to customer
identity fields already present in `UserIdentity`: name, phone, and email.

## Verification

Module verification is documented in
`docs/testing/phase-8-customer-management-backend-verification.md`. The required
checks are backend typecheck, backend lint, the customer order regression suite,
the customer management focused route test, and OpenAPI path verification for
all seven customer management endpoints.
