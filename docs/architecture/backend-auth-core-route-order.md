# Backend Auth Core Route Order

## Goal

Document the final middleware order for Backend Auth Core auth routes.

## Planned File Path

- `/backend/api/src/modules/auth/routes/auth.routes.ts`

## Request OTP

- `POST /api/v1/public/auth/request-otp`
- `authRateLimitMiddleware`
- `validateRequest(requestOtpValidator)`
- `requestOtpController`

## Verify OTP

- `POST /api/v1/public/auth/verify-otp`
- `authRateLimitMiddleware`
- `validateRequest(verifyOtpValidator)`
- `verifyOtpController`

## Refresh Token

- `POST /api/v1/public/auth/refresh-token`
- `authRateLimitMiddleware`
- `validateRequest(refreshTokenValidator)`
- `refreshTokenController`

## Logout

- `POST /api/v1/public/auth/logout`
- `authRateLimitMiddleware`
- `validateRequest(logoutValidator)`
- `logoutController`
