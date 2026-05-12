# Mobile Backend Health Connection

## Purpose

This handoff records the React Native Foundation health API connection for the
Customer App and Delivery Agent App.

## Backend Endpoint

```http
GET /api/v1/public/health
```

## Customer App Integration

Created:

```text
apps/customer-app/src/hooks/useBackendHealth.ts
```

The Customer App `HomeScreen` calls `useBackendHealth()`. The hook calls
`checkBackendHealth()` from:

```text
apps/customer-app/src/services/api/public.api.ts
```

The screen displays loading, error, and backend health status only in
development mode.

## Delivery Agent App Integration

Created:

```text
apps/delivery-agent-app/src/hooks/useBackendHealth.ts
```

The Delivery Agent App `DeliveryHomeScreen` calls `useBackendHealth()`. The hook
calls `checkBackendHealth()` from:

```text
apps/delivery-agent-app/src/services/api/public.api.ts
```

The screen displays loading, error, and backend health status only in
development mode.

## Rule

Screens do not call Axios directly. Mobile screens call hooks that use API
service files.

