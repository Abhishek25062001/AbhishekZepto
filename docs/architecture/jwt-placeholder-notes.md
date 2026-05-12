# JWT Placeholder Notes

## Purpose

Phase 1 has token service structure only.

The current token service returns fixed placeholder values so auth routes,
controllers, and middleware can be wired safely before real OTP login and JWT
signing exist.

## Placeholder Values

```text
phase1-access-token-placeholder
phase1-refresh-token-placeholder
```

## Deferred Work

Real JWT behavior is deferred:

- JWT signing
- JWT verification
- access token expiry enforcement
- refresh token rotation
- token revocation checks
- production secret enforcement

Do not add real token secrets to committed files. Real secrets belong only in
local or managed environment configuration.
