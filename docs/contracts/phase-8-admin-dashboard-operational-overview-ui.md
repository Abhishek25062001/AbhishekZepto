# Phase 8 Admin Dashboard Operational Overview UI Contract

Status: **COMPLETE** — Module 19 UI.

Base route: `/analytics`

## Route Permission

| Route | Permission | Purpose |
|-------|------------|---------|
| `/analytics` | `reports:read` | Read-only operational analytics overview |

## Consumed APIs

| UI area | API endpoint | Permission |
|---------|--------------|------------|
| Overview summary | `GET /api/v1/admin/analytics/overview` | `reports:read` |
| Order panel | `GET /api/v1/admin/analytics/orders` | `reports:read` |
| Delivery panel | `GET /api/v1/admin/analytics/delivery` | `reports:read` |
| Store panel | `GET /api/v1/admin/analytics/stores` | `reports:read` |
| Support panel | `GET /api/v1/admin/analytics/support` | `reports:read` |

## Supported Filters

- `fromDate`
- `toDate`
- `timezone`
- `storeId`
- `vendorId`
- `cityId`

The UI must send only these filters to analytics endpoints.

## Unsupported Workflows

Module 19 must not add export, download, scheduled report, custom report
builder, forecasting, backend setup, database, mutation, realtime analytics, or
future analytics module behavior.
