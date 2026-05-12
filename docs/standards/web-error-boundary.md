# Web Error Boundary

## Purpose

Web error boundaries provide local runtime-error containment for the Vendor Panel
and Admin Dashboard during Phase 1.

## Vendor Panel

Vendor Panel error boundary:

```text
apps/vendor-panel/src/components/common/ErrorBoundary.tsx
```

Vendor Panel local error logger:

```text
apps/vendor-panel/src/utils/client-error-logger.ts
```

## Admin Dashboard

Admin Dashboard error boundary:

```text
apps/admin-dashboard/src/components/common/ErrorBoundary.tsx
```

Admin Dashboard local error logger:

```text
apps/admin-dashboard/src/utils/client-error-logger.ts
```

## Logging Rule

Phase 1 logs web client errors locally only in development mode. Client error
loggers must not send runtime errors to the backend.

Allowed local error fields:

- `message`
- `stack`
- `componentStack`
- `route`
- `timestamp`

## Fallback UI

Fallback UI should show:

- title: `Something went wrong`
- safe message area
- reload button

## API Endpoints

No new API endpoints are created by this task.

## DB Fields

No new database fields are created by this task.
