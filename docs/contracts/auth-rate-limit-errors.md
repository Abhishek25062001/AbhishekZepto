# Auth Rate Limit Errors

## Error Codes

- `RATE_LIMITED`
- `OTP_ATTEMPTS_EXCEEDED`

## RATE_LIMITED

Used when an auth endpoint request rate limit is exceeded.

## OTP_ATTEMPTS_EXCEEDED

Used when an OTP challenge exceeds the allowed verify attempts.

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
