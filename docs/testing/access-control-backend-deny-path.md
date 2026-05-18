# Access Control Backend Deny Path

## Goal

Verify that invalid Phase 2 access attempts fail with the expected code and do
not overexpose data.

## Automated Coverage (Ticket 14)

Run:

```bash
npm run test:access-control-scenarios -w backend/api
```

Scenario suites cover deny-path permission middleware, tenant scope mismatch,
revoked/expired sessions, blocked/inactive/pending accounts (via `authenticate`),
and admin revoke boundaries.

## Postman (Ticket 16)

Import `docs/contracts/postman/phase-2-access-control.postman_collection.json` and run deny folders (`01`–`03`, `06`–`08`) against a local seeded API.

## Deny Checks

Automated:
- missing token on protected routes returns `UNAUTHORIZED`
- revoked session returns `SESSION_REVOKED`
- expired session returns `SESSION_EXPIRED`
- vendor scope mismatch returns `VENDOR_SCOPE_MISMATCH`
- missing store scope returns `STORE_SCOPE_REQUIRED`
- permission denials return `FORBIDDEN`
- blocked/inactive/pending accounts denied by `authenticate`

`NEEDS VERIFICATION` (live server):
- vendor user on `GET /api/v1/internal/auth/test-protected` returns `FORBIDDEN`
- missing city scope returns `CITY_SCOPE_REQUIRED` via HTTP route
- targeted revoke of current session returns `SESSION_ACCESS_DENIED`
- targeted revoke of unknown or non-owned session returns `SESSION_NOT_FOUND`
- blocked or inactive accounts fail login before protected access is reached (OTP verify)

## Audit Expectations

- permission denials should write `security.access_denied`
- scope denials should write `security.scope_access_denied`
- session revoke actions should write auth revoke/logout events
