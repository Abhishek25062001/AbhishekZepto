# Auth Error Responses

## Planned Constants File

- `/backend/api/src/modules/auth/constants/auth-error-codes.constants.ts`

Planned export file:

- `/backend/api/src/modules/auth/constants/index.ts`

## Error Codes And HTTP Statuses

| Code | HTTP status | Usage |
| --- | --- | --- |
| `INVALID_OTP` | 401 | Submitted OTP does not match the active challenge. |
| `OTP_EXPIRED` | 410 | OTP challenge is past its expiry time. |
| `OTP_ATTEMPTS_EXCEEDED` | 429 | OTP challenge exceeded the allowed verify attempts. |
| `OTP_RESEND_LIMIT_EXCEEDED` | 429 | OTP challenge exceeded the allowed resend count. |
| `INVALID_REFRESH_TOKEN` | 401 | Refresh token is missing, malformed, unknown, or invalid. |
| `SESSION_REVOKED` | 401 | Session has already been revoked. |
| `SESSION_EXPIRED` | 401 | Session is past its expiry time. |
| `ACCOUNT_BLOCKED` | 403 | Account is blocked and cannot log in. |
| `ACCOUNT_INACTIVE` | 403 | Account is inactive and cannot log in. |
| `ACCOUNT_PENDING_APPROVAL` | 403 | Account must be approved before login. |
| `ROLE_NOT_ALLOWED` | 403 | Requested login role is not allowed for the user or surface. |

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## DB Fields

No new database fields created in this task.
