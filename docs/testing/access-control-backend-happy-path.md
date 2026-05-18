# Access Control Backend Happy Path

## Goal

Verify that valid Phase 2 users can authenticate and access the surfaces that
their role and scope allow.

## Automated Coverage (Ticket 14)

Run:

```bash
npm run test:access-control-scenarios -w backend/api
```

Scenario suites cover happy-path permission, tenant scope, session list, refresh
rotation, and admin boundary cases using the Ticket 13 harness with mocked
repositories/services.

## Postman (Ticket 16)

Import `docs/contracts/postman/phase-2-access-control.postman_collection.json` and run folder `00 Auth Setup` plus `04 Permission Allow` / `05 Tenant Allow` against a local seeded API.

## Authentication Happy Path

Automated (unit/middleware):
- `authenticate` allows active sessions and sets `req.user`
- refresh token rotation returns replacement tokens

`NEEDS VERIFICATION` (live server + MongoDB):
- request OTP for each seeded user
- verify OTP for each seeded user with the correct app surface
- confirm access token and refresh token are returned
- confirm auth session is created

## Permissions Happy Path

- customer can fetch `GET /api/v1/customer/me/permissions`
- delivery agent can fetch `GET /api/v1/delivery/me/permissions`
- vendor user can fetch `GET /api/v1/vendor/me/permissions`
- admin user can fetch `GET /api/v1/admin/me/permissions`
- super admin can fetch `GET /api/v1/internal/auth/test-protected`

## Scope Happy Path

- vendor user can pass vendor scope check with owned `vendorId`
- vendor user can pass store scope check with owned `storeId`
- vendor user can pass city scope check with owned `cityId`

## Session Happy Path

- authenticated user can fetch `GET /api/v1/auth/me/sessions`
- one returned session is marked `isCurrent: true`
- authenticated user can revoke another owned session
- authenticated user can revoke all other owned sessions
