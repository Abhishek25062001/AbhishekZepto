# Auth Route Architecture

## Auth Route Goal

Auth routes sit under public route group but still use validation and rate limiting.

## Planned Route File

- `/backend/api/src/modules/auth/routes/auth.routes.ts`

## Request OTP Route

Endpoint:

- `POST /api/v1/public/auth/request-otp`

Middleware order:

1. `authRateLimitMiddleware`
2. `validateRequest(requestOtpValidator)`
3. `requestOtpController`

## Verify OTP Route

Endpoint:

- `POST /api/v1/public/auth/verify-otp`

Middleware order:

1. `authRateLimitMiddleware`
2. `validateRequest(verifyOtpValidator)`
3. `verifyOtpController`

## Refresh Token Route

Endpoint:

- `POST /api/v1/public/auth/refresh-token`

Middleware order:

1. `authRateLimitMiddleware`
2. `validateRequest(refreshTokenValidator)`
3. `refreshTokenController`

## Logout Route

Endpoint:

- `POST /api/v1/public/auth/logout`

Middleware order:

1. `authRateLimitMiddleware`
2. `validateRequest(logoutValidator)`
3. `logoutController`

## Planned Mount

Auth routes are mounted in:

- `/backend/api/src/routes/v1/public.routes.ts`

Mounted path:

- `/auth`

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## DB Fields

No new database fields created in this task.
