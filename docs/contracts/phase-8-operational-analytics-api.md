# Phase 8 Operational Analytics API

Status: **COMPLETE** — Module 18 backend.

Base path: `/api/v1/admin/analytics`

All routes are admin-only and require the existing admin authentication and
role boundary before route-level analytics/report permissions are evaluated.

## Endpoints

| Method | Path | Permission | Purpose |
|--------|------|------------|---------|
| GET | `/overview` | `reports:read` | Cross-domain operational summary |
| GET | `/orders` | `reports:read` | Order volume and status summary |
| GET | `/delivery` | `reports:read` | Delivery assignment and status summary |
| GET | `/stores` | `reports:read` | Store/vendor operational summary |
| GET | `/support` | `reports:read` | Support ticket status and priority summary |

## Supported Filters

Analytics endpoints support only bounded read filters:

- `fromDate`
- `toDate`
- `timezone`
- `storeId`
- `vendorId`
- `cityId`

Filters are applied only where the underlying source data already supports the
field. Unsupported entity filters must not trigger cross-module mutations or
schema changes.

## Response Conventions

Responses follow `docs/standards/backend-response-format.md`.

Each response must include the normalized date window and count-based summaries.
When no records match, responses must return zero counts instead of failing.

## Response Fields

Shared `window`:

- `fromDate`: ISO date-time string or `null`.
- `toDate`: ISO date-time string or `null`.
- `timezone`: normalized timezone string.

Order, delivery, and store analytics:

- `total`: total matched records.
- `byStatus`: count breakdown by source status field.

Support analytics:

- `total`: total matched support tickets.
- `byStatus`: count breakdown by support ticket status.
- `byPriority`: count breakdown by support ticket priority.
- `byCategory`: count breakdown by support ticket category.

OpenAPI must document all five Module 18 read endpoints and must not document
analytics write, export, schedule, or report-builder endpoints.

## Exclusions

The API does not export files, schedule reports, create analytics snapshots,
mutate source records, trigger notifications, or expose Admin Dashboard UI
behavior.
