# Access Control Testing

## Module Goal

Consolidate Phase 2 access-control verification across:

- OTP authentication
- role and permission enforcement
- vendor/store/city scope enforcement
- app-surface enforcement
- session and device management

## Included Coverage

- backend happy-path access checks
- backend deny-path access checks
- mobile frontend access checks
- web frontend access checks
- audit-log verification
- security verification
- code-quality verification for access-control surfaces

## Excluded Coverage

- business-domain ownership checks outside auth/session/scope primitives
- automated test framework introduction
- CI workflow creation
- production monitoring or alerting

## Access-Control Surfaces

- Customer App
- Delivery Agent App
- Vendor Panel
- Admin Dashboard
- backend protected verification routes
- backend session-management routes

## Core Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/customer/me/permissions`
- `GET /api/v1/delivery/me/permissions`
- `GET /api/v1/vendor/me/permissions`
- `GET /api/v1/admin/me/permissions`
- `GET /api/v1/auth/me/sessions`
- `POST /api/v1/auth/logout-session`
- `POST /api/v1/auth/logout-other-sessions`
- `GET /api/v1/internal/auth/test-protected`
- `GET /api/v1/internal/auth/test-vendor-scope`
- `GET /api/v1/internal/auth/test-store-scope`
- `GET /api/v1/internal/auth/test-city-scope`
- `GET /api/v1/internal/auth/test-session-list`
- `POST /api/v1/internal/auth/test-session-revoke`
