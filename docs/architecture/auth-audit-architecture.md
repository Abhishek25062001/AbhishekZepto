# Auth Audit Architecture

## Auth Audit Goal

Auth audit logs track sensitive authentication and authorization events.

## Auth Audit Events

- `auth.otp_requested`
- `auth.otp_request_failed`
- `auth.otp_verified`
- `auth.otp_verify_failed`
- `auth.login_success`
- `auth.login_failed`
- `auth.refresh_token_success`
- `auth.refresh_token_failed`
- `auth.logout`
- `auth.session_revoked`
- `security.access_denied`

## Planned Audit Event Constants

Planned file:

- `/backend/api/src/modules/audit/constants/audit-event.constants.ts`

Planned constants:

- `AUTH_OTP_REQUESTED = 'auth.otp_requested'`
- `AUTH_OTP_REQUEST_FAILED = 'auth.otp_request_failed'`
- `AUTH_OTP_VERIFIED = 'auth.otp_verified'`
- `AUTH_OTP_VERIFY_FAILED = 'auth.otp_verify_failed'`
- `AUTH_REFRESH_TOKEN_SUCCESS = 'auth.refresh_token_success'`
- `AUTH_REFRESH_TOKEN_FAILED = 'auth.refresh_token_failed'`
- `AUTH_SESSION_REVOKED = 'auth.session_revoked'`

## Audit Metadata Rules

Allowed metadata fields:

- `phoneMasked`
- `role`
- `appSurface`
- `deviceType`
- `reason`
- `attemptCount`

Forbidden metadata fields:

- `otp`
- `otpHash`
- `accessToken`
- `refreshToken`
- `refreshTokenHash`
- `JWT secrets`

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/internal/auth/test-protected`

## DB Fields

- `audit_logs.eventType`
- `audit_logs.actorId`
- `audit_logs.actorRole`
- `audit_logs.actorSurface`
- `audit_logs.entityType`
- `audit_logs.entityId`
- `audit_logs.requestId`
- `audit_logs.traceId`
- `audit_logs.ipAddress`
- `audit_logs.userAgent`
- `audit_logs.metadata`
- `audit_logs.status`
- `audit_logs.createdAt`
- `audit_logs.updatedAt`
