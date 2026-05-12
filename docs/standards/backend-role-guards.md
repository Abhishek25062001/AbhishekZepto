# Backend Role Guards

## Purpose

Role guard helpers compose backend role checks for surface-specific APIs.

Frontend route visibility is not a security boundary. Backend middleware remains
the source of truth for role enforcement.

## Guards

- `requireCustomer()`: customer app APIs.
- `requireDeliveryAgent()`: delivery agent app APIs.
- `requireVendorUser()`: vendor owner, store manager, and store staff APIs.
- `requireAdminUser()`: support admin, operations admin, and super admin APIs.
- `requireSuperAdmin()`: super admin only APIs.

## Phase 1 Boundary

The base `authenticate()` middleware validates Bearer token format and attaches a
placeholder authenticated user context. Real JWT verification is deferred to a
later authentication module.
