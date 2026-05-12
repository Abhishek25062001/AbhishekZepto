# Backend Error Logging

## Purpose

Backend error logging records safe structured error details for operational and
unknown failures without exposing sensitive internals to API clients.

## Operational Errors

Operational errors are expected application errors represented by `AppError` or
database errors mapped by the database error mapper.

Operational errors are logged with:

```text
warn
```

Operational error logs include:

- request ID
- HTTP method
- request path
- response status code
- error code
- safe message
- user ID when available
- role when available
- stack trace only outside production

## Unknown Errors

Unknown or internal errors are logged with:

```text
error
```

Unknown error logs use the same structured payload as operational errors.

## Production Stack Trace Rule

Stack traces may be logged only when the backend environment is not production.

Production API responses must not expose stack traces. Production responses for
unknown errors should use a safe generic message.

## Helper Location

Error log payloads are built in:

```text
backend/api/src/errors/log-error.util.ts
```

## API Endpoints

No new API endpoints are created by this task.

## DB Fields

No new database fields are created by this task.
