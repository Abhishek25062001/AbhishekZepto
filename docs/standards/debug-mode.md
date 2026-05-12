# Debug Mode

## Purpose

Debug mode provides safe local and non-production debugging controls without
exposing secrets or provider credentials.

## Environment Variable

Backend debug mode is controlled by:

```text
DEBUG_MODE=false
```

The backend helper is located at:

```text
backend/api/src/config/debug.ts
```

`canExposeDebugInfo()` may return true only outside production and only when
debug mode is enabled.

## Safe Debug Fields

Safe debug helper output is defined in:

```text
backend/api/src/utils/safe-debug-info.ts
```

Allowed safe fields:

- `environment`
- `version`
- `uptime`
- `timestamp`
- `nodeVersion`

The public system-info endpoint intentionally exposes only:

- `environment`
- `uptime`
- `timestamp`
- `version`

## Never Expose

Debug responses, logs, and frontend debug screens must never expose:

- database URL
- Redis URL
- JWT secrets
- Razorpay keys
- Firebase Cloud Messaging keys
- Maps keys
- OTP provider credentials
- access tokens
- refresh tokens
- full authorization headers

## API Endpoints

```text
GET /api/v1/public/system-info
```

## DB Fields

No new database fields are created by this task.
