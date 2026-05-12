# Backend Auth Core Audit Logging

## Goal

Document the planned auth audit logging integration for Backend Auth Core.

## Planned Files

- `/backend/api/src/modules/audit/constants/audit-event.constants.ts`
- `/backend/api/src/modules/auth/services/auth.service.ts`

## Required Audit Constants

- `AUTH_OTP_REQUESTED = 'auth.otp_requested'`
- `AUTH_OTP_REQUEST_FAILED = 'auth.otp_request_failed'`
- `AUTH_OTP_VERIFIED = 'auth.otp_verified'`
- `AUTH_OTP_VERIFY_FAILED = 'auth.otp_verify_failed'`
- `AUTH_LOGIN_SUCCESS = 'auth.login_success'`
- `AUTH_LOGIN_FAILED = 'auth.login_failed'`
- `AUTH_REFRESH_TOKEN_SUCCESS = 'auth.refresh_token_success'`
- `AUTH_REFRESH_TOKEN_FAILED = 'auth.refresh_token_failed'`
- `AUTH_LOGOUT = 'auth.logout'`
- `AUTH_SESSION_REVOKED = 'auth.session_revoked'`

## Planned Audit Write Points

- Write `AUTH_OTP_REQUESTED` on successful OTP request
- Write `AUTH_OTP_REQUEST_FAILED` when OTP request fails
- Write `AUTH_OTP_VERIFIED` when OTP verification succeeds
- Write `AUTH_OTP_VERIFY_FAILED` when OTP verification fails
- Write `AUTH_LOGIN_SUCCESS` after session creation
- Write `AUTH_REFRESH_TOKEN_SUCCESS` after access token refresh
- Write `AUTH_REFRESH_TOKEN_FAILED` when refresh token fails
- Write `AUTH_LOGOUT` after logout

## Forbidden Audit Metadata

- `otp`
- `otpHash`
- `accessToken`
- `refreshToken`
- `refreshTokenHash`
- `JWT secrets`
