# Mobile Error Boundary

## Purpose

Mobile error boundaries provide local runtime-error containment for the Customer
App and Delivery Agent App during Phase 1.

## Customer App

Customer App error boundary:

```text
apps/customer-app/src/components/common/ErrorBoundary.tsx
```

Customer App local error logger:

```text
apps/customer-app/src/utils/mobile-error-logger.ts
```

Customer App API error message helper:

```text
apps/customer-app/src/utils/api-error-message.util.ts
```

## Delivery Agent App

Delivery Agent App error boundary:

```text
apps/delivery-agent-app/src/components/common/ErrorBoundary.tsx
```

Delivery Agent App local error logger:

```text
apps/delivery-agent-app/src/utils/mobile-error-logger.ts
```

Delivery Agent App API error message helper:

```text
apps/delivery-agent-app/src/utils/api-error-message.util.ts
```

## Logging Rule

Phase 1 logs mobile errors locally only in development mode. Mobile error
loggers must not send runtime errors to the backend.

Allowed local error fields:

- `message`
- `stack`
- `componentStack`
- `screen`
- `timestamp`

## Backend Error Response Format

Mobile API error message helpers support the standard backend error response
format:

```ts
{
  success: false;
  message: string;
  error: {
    code: string;
    details: Record<string, unknown>;
  };
}
```

## API Endpoints

No new API endpoints are created by this task.

## DB Fields

No new database fields are created by this task.
