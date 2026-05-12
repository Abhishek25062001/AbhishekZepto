# Backend Logging

## Purpose

Backend logging provides local and production-safe structured request logs for
the Phase 1 backend foundation.

## Logger Location

The backend logger is configured in:

```text
backend/api/src/config/logger.ts
```

The exported logger is named:

```text
logger
```

The logger includes these base fields:

- `service`: `backend-api`
- `environment`: backend `APP_ENV`
- `version`: backend `APP_VERSION`

The default log level is:

```text
LOG_LEVEL=info
```

Local development uses pretty console logging. Production uses JSON logs.

## Request Logger

The request logger middleware is configured in:

```text
backend/api/src/middlewares/request-logger.middleware.ts
```

It should run after `requestIdMiddleware` and before security and route
middlewares.

Request logs may include:

- request ID
- HTTP method
- request URL
- response status code
- response time

## Redaction

Sensitive request headers that must be redacted:

- `authorization`
- `cookie`
- `x-api-key`

Sensitive request body fields that must be redacted:

- `password`
- `otp`
- `accessToken`
- `refreshToken`
- `token`

## Never Log

Never log OTP values, passwords, access tokens, refresh tokens, payment secrets,
or the full authorization header.

## API Endpoints

No new API endpoints are created by this task.

## DB Fields

No new database fields are created by this task.
