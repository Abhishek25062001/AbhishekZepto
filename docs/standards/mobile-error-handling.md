# Mobile Error Handling

## Purpose

This standard defines the base error handling pattern for the Customer App and
Delivery Agent App.

## Backend API Error Format

Mobile apps must handle this backend error response shape:

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

## API Error Message Helper

Each mobile app owns an error helper:

```text
src/utils/error-message.util.ts
```

Use `getApiErrorMessage()` to convert backend error envelopes, thrown
JavaScript errors, and unknown errors into display-safe messages.

## Screen-Level Error States

Screens should render common `ErrorView` components for recoverable loading or
API errors.

Screens should not parse backend error envelopes directly.

## Root Error Boundary

Each mobile app root must wrap its navigator tree with `ErrorBoundary`.

The root error boundary is only a fallback for unexpected render errors.
Recoverable API errors should remain screen-level states.

