# Web Backend Health Connection

## Scope

This handoff covers the Phase 1 backend health connection for the Vendor Panel and Admin Dashboard.

## Endpoint

- `GET /api/v1/public/health`

## Vendor Panel

- Uses `checkBackendHealth` from `src/services/api/public.api.ts`.
- Uses `useBackendHealth` to run the request through TanStack Query.
- The Vendor dashboard displays the health result in development mode.

## Admin Dashboard

- Uses `checkBackendHealth` from `src/services/api/public.api.ts`.
- Uses `useBackendHealth` to run the request through TanStack Query.
- The Admin dashboard displays the health result in development mode.

## Boundary

- Dashboard pages must call hooks and services, not Axios directly.
- Backend health display is a foundation smoke-test path, not a full monitoring feature.
