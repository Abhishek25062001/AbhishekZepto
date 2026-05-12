# Frontend Public API Connection

## Scope

All four frontend surfaces connect to the shared public backend system endpoints through their own API service files.

## Connected Frontend Files

- Customer App: `apps/customer-app/src/services/api/public.api.ts`
- Delivery Agent App: `apps/delivery-agent-app/src/services/api/public.api.ts`
- Vendor Panel: `apps/vendor-panel/src/services/api/public.api.ts`
- Admin Dashboard: `apps/admin-dashboard/src/services/api/public.api.ts`

## Connected Public Endpoints

- `GET /api/v1/public/health`
- `GET /api/v1/public/version`
- `GET /api/v1/public/system-info`

## Contract Types

The public API service files use shared response contracts from `packages/shared/api`.

Shared public API response types:

- `HealthStatusResponse`
- `VersionInfoResponse`
- `SystemInfoResponse`

Shared envelope type:

- `ApiSuccessResponse<T>`

## Boundary

These services are connectivity and runtime-information contracts only. Feature-specific customer, delivery, vendor, and admin API contracts remain owned by their later modules.
