# Auth Rate Limit Architecture

## Auth Rate Limit Goal

Auth endpoints need stricter limits than normal APIs.

## Rate Limits

- Request OTP rate limit: 5 requests per 5 minutes per phone + IP.
- Verify OTP rate limit: 5 failed attempts per challenge.
- Refresh token rate limit: 30 requests per 15 minutes per IP/session.
- Logout rate limit: 30 requests per 15 minutes per IP/session.

## Planned Middleware Updates

Planned file:

- `/backend/api/src/middlewares/rate-limit.middleware.ts`

Planned checks:

- Confirm `authRateLimitMiddleware` exists.
- Add TODO marker for phone-aware rate limiting.
- Add TODO marker for Redis-backed rate limiting.
- Add TODO marker for OTP challenge attempt limiting.

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## DB Fields

- `otp_challenges.attemptCount`
- `otp_challenges.maxAttempts`
- `otp_challenges.resendCount`
- `otp_challenges.maxResends`
- `otp_challenges.blockedUntil`
