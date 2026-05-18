# Access Control Testing Security

## Goal

Define the security expectations that must remain true while verifying Phase 2
access-control behavior.

## Verification Rules

- protected responses must not expose token hashes
- permission and scope denials must not return unauthorized data
- session-management responses must not expose `refreshTokenHash`
- frontend verification should not rely on displaying raw tokens
- app surfaces must keep fixed role and surface pairing rules
- targeted session revoke must stay user-owned
- audit logs must avoid sensitive token or OTP material

## Coverage Areas

- auth
- permission checks
- vendor/store/city scope checks
- session and device controls
- audit log safety
