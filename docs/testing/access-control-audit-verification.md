# Access Control Audit Verification

## Goal

Verify the audit trail produced by Phase 2 access-control behavior.

## Expected Events

- permission denial: `security.access_denied`
- scope denial: `security.scope_access_denied`
- standard logout: `auth.logout`
- targeted session revoke: `auth.session_revoked`
- logout other sessions: `auth.other_sessions_revoked`
- successful refresh: `auth.refresh_token_success`

## Expected Metadata Rules

- metadata may contain role, scope ids, request intent, or preserved session id
- metadata must not contain raw access tokens
- metadata must not contain raw refresh tokens
- metadata must not contain raw OTP values

## DB Fields To Check

- `audit_logs.eventType`
- `audit_logs.actorRole`
- `audit_logs.vendorId`
- `audit_logs.storeId`
- `audit_logs.cityId`
- `audit_logs.metadata`
- `audit_logs.status`
