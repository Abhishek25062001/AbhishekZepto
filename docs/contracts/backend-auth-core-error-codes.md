# Backend Auth Core Error Codes

## Goal

Document the auth error codes introduced or finalized in Phase 2 Module 3: Backend Auth Core.

## Planned Constants Files

- `/backend/api/src/modules/auth/constants/auth-error-codes.constants.ts`
- `/backend/api/src/modules/auth/constants/index.ts`

## Error Codes

- `INVALID_OTP = 'INVALID_OTP'`
- `OTP_EXPIRED = 'OTP_EXPIRED'`
- `OTP_ATTEMPTS_EXCEEDED = 'OTP_ATTEMPTS_EXCEEDED'`
- `OTP_RESEND_LIMIT_EXCEEDED = 'OTP_RESEND_LIMIT_EXCEEDED'`
- `INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN'`
- `SESSION_REVOKED = 'SESSION_REVOKED'`
- `SESSION_EXPIRED = 'SESSION_EXPIRED'`
- `ACCOUNT_BLOCKED = 'ACCOUNT_BLOCKED'`
- `ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE'`
- `ACCOUNT_PENDING_APPROVAL = 'ACCOUNT_PENDING_APPROVAL'`
- `ROLE_NOT_ALLOWED = 'ROLE_NOT_ALLOWED'`
- `USER_NOT_FOUND = 'USER_NOT_FOUND'`
- `OTP_CHALLENGE_NOT_FOUND = 'OTP_CHALLENGE_NOT_FOUND'`
- `TOKEN_EXPIRED = 'TOKEN_EXPIRED'`
- `INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN'`

## Shared Docs Update

Update `docs/contracts/api-error-codes.md` to include all Backend Auth Core auth error codes in the auth error section.
