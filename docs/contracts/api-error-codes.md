# API Error Codes

## Error Code Goal

All API errors must use stable error codes so frontend apps can show safe messages and handle known failure states consistently.

## Standard Error Codes

| Code | Usage |
| --- | --- |
| `VALIDATION_ERROR` | Request body, params, query, or headers failed validation. |
| `UNAUTHORIZED` | Authentication is missing, expired, or invalid. |
| `FORBIDDEN` | Authenticated user does not have permission for the action. |
| `NOT_FOUND` | Requested resource does not exist. |
| `CONFLICT` | Duplicate or conflicting resource state. |
| `RATE_LIMITED` | Request rate limit exceeded. |
| `INTERNAL_SERVER_ERROR` | Unexpected backend failure. |
| `DATABASE_ERROR` | Database connection, query, or write failure. |

## Authentication Error Codes

| Code | Usage |
| --- | --- |
| `INVALID_OTP` | Submitted OTP does not match the active challenge. |
| `OTP_EXPIRED` | OTP challenge is past its expiry time. |
| `OTP_ATTEMPTS_EXCEEDED` | OTP challenge exceeded the allowed verify attempts. |
| `OTP_RESEND_LIMIT_EXCEEDED` | OTP challenge exceeded the allowed resend count. |
| `INVALID_REFRESH_TOKEN` | Refresh token is missing, malformed, unknown, or invalid. |
| `SESSION_REVOKED` | Session has already been revoked. |
| `SESSION_EXPIRED` | Session is past its expiry time. |
| `ACCOUNT_BLOCKED` | Account is blocked and cannot log in. |
| `ACCOUNT_INACTIVE` | Account is inactive and cannot log in. |
| `ACCOUNT_PENDING_APPROVAL` | Account must be approved before login. |
| `ROLE_NOT_ALLOWED` | Requested login role is not allowed for the user or surface. |
| `USER_NOT_FOUND` | Requested auth user identity was not found for the login context. |
| `OTP_CHALLENGE_NOT_FOUND` | Requested OTP challenge does not exist or does not match the login context. |
| `TOKEN_EXPIRED` | Access token is structurally valid but has expired. |
| `INVALID_ACCESS_TOKEN` | Access token is missing, malformed, invalid, or wrong token type. |

## Error Response Shape

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {}
  }
}
```
