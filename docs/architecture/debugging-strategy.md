# Debugging Strategy

## Backend Debugging Flow

Use request logs, error logs, `x-request-id`, `x-trace-id`, and public health
checks to debug backend behavior locally.

Suggested local flow:

1. Confirm backend startup logs include service, environment, version, and port.
2. Call `GET /api/v1/public/health`.
3. Use `x-request-id` and `x-trace-id` from response headers to find request and
   error logs.
4. Check MongoDB status and Redis placeholder status from the health response.
5. Reproduce the request with the same `x-trace-id` when tracing a multi-step
   flow.

## Frontend Debugging Flow

Use development-only API debug logs, local error boundaries, backend health
hooks, and debug screens to inspect frontend behavior.

Frontend debug logs must not include credentials, tokens, OTP values, passwords,
or full authorization headers.

## Mobile Debugging Flow

Use Metro logs, local mobile error boundaries, backend health hooks, and mobile
debug screens to inspect app behavior.

Mobile Phase 1 error logging is local only. Crash upload providers are deferred.

## API Trace Debugging Flow

The backend supports:

```text
x-request-id
x-trace-id
```

Clients may pass `x-trace-id` for debugging multi-step flows. The backend
generates missing IDs and returns both headers when available.

## API Endpoints

```text
GET /api/v1/public/health
GET /api/v1/public/system-info
```

## DB Fields

No new database fields are created by this task.
