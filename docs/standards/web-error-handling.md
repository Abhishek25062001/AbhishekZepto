# Web Error Handling

## Scope

This standard applies to the Vendor Panel and Admin Dashboard.

## Backend API Error Format

Web panels must handle this backend error response shape:

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

Each web panel owns this helper:

```text
src/utils/error-message.util.ts
```

Use `getApiErrorMessage()` to convert backend error envelopes, thrown JavaScript errors, and unknown errors into display-safe messages.

## Screen-Level Error States

Screens should render common `ErrorView` components for recoverable loading or API errors.

Screens should not parse backend error envelopes directly.

## Root Error Boundary

Each web app root must wrap its router tree with `ErrorBoundary`.

The root error boundary is only a fallback for unexpected render errors. Recoverable API errors should remain screen-level states.
