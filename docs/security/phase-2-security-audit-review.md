# Phase 2 Security & Audit Review

## Closeout Note (Ticket 18 — 2026-05-18)

Static security rules and automated deny-path tests pass in-repo. **Live audit
persistence** must be confirmed with MongoDB running (unit tests may log audit
write timeouts when the database is offline).

## Covered Security Areas

- access token validation
- refresh-token/session validation
- permission denial handling
- scope denial handling
- session revoke handling
- safe response shaping
- safe audit metadata handling

## Covered Audit Events

- `security.access_denied`
- `security.scope_access_denied`
- `security.tenant_access_denied`
- `security.tenant_scope_mismatch`
- `security.tenant_admin_override_used`
- `auth.logout`
- `auth.session_revoked`
- `auth.other_sessions_revoked`
- `auth.refresh_token_success`

## Sensitive Data Rules

- do not expose `refreshTokenHash`
- do not expose `otpHash`
- do not log raw access tokens
- do not log raw refresh tokens
- do not log raw OTP values

Postman collections include tests asserting responses do not contain `refreshTokenHash`.

## NEEDS VERIFICATION

- dedicated role/user-permission **mutation** audit event names vs source PDF (if distinct from generic security events)
- live audit row persistence under load
- production hardening beyond Phase 2 scope

## Deferred Items

- deeper production hardening beyond current Phase 2 scope
- Phase 3+ business-domain authorization review
