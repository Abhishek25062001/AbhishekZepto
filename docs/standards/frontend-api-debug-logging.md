# Frontend API Debug Logging

## Purpose

Frontend API debug logging helps local development troubleshoot API calls without
exposing credentials or sensitive payloads.

## Rule

API debug logging is development-only. Production builds must not emit API debug
logs.

## Allowed Fields

Request debug logs may include:

- request method
- request URL
- request ID or trace ID when available

Response debug logs may include:

- response status code
- response URL
- response time placeholder

## Disallowed Fields

Frontend API debug logs must not include:

- `Authorization`
- `accessToken`
- `refreshToken`
- OTP values
- passwords
- payment keys
- provider credentials

When a request has an Authorization header, debug logs may record only:

```text
[redacted]
```

## API Endpoints

No new API endpoints are created by this task.

## DB Fields

No new database fields are created by this task.
