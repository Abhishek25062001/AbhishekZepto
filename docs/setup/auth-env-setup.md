# Auth Environment Setup

## Goal

Document the auth environment variables required by Phase 2 Module 3: Backend Auth Core.

## Planned Env Variables

- `JWT_ACCESS_EXPIRES_IN=15m`
- `JWT_REFRESH_EXPIRES_IN=30d`
- `OTP_EXPIRES_IN_SECONDS=300`
- `OTP_RESEND_WAIT_SECONDS=30`
- `OTP_MAX_ATTEMPTS=5`
- `OTP_MAX_RESENDS=3`
- `OTP_DEV_MODE=true`
- `OTP_DEV_CODE=123456`

## Planned Env Validation

- Validate `JWT_ACCESS_EXPIRES_IN`
- Validate `JWT_REFRESH_EXPIRES_IN`
- Validate `OTP_EXPIRES_IN_SECONDS`
- Validate `OTP_RESEND_WAIT_SECONDS`
- Validate `OTP_MAX_ATTEMPTS`
- Validate `OTP_MAX_RESENDS`
- Validate `OTP_DEV_MODE`
- Validate `OTP_DEV_CODE`

## Conversion Rules

- Convert OTP numeric environment values to numbers.

## Production Restriction

- `OTP_DEV_CODE` is allowed only when `APP_ENV !== 'production'`
- `OTP_DEV_CODE` must not be enabled in production
