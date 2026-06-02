# Phase 8 Admin Data Export API

Status: **IMPLEMENTED** — Module 20 backend.

Base path: `/api/v1/admin/data-exports`

All routes are admin-only and require existing admin authentication, admin role
boundary, and `reports:export`.

## Endpoints

| Method | Path | Permission | Purpose |
|--------|------|------------|---------|
| POST | `/` | `reports:export` | Create queued export request metadata |
| GET | `/` | `reports:export` | List export requests |
| GET | `/:exportId` | `reports:export` | Get one export request |

## Create Payload

- `exportType`: bounded export domain.
- `format`: bounded output format.
- `filters`: object with request filters.
- `reason`: required audit reason.

## List Filters

- `exportType`
- `format`
- `status`
- `requestedByAdminId`
- `fromDate`
- `toDate`
- `page`
- `limit`

## Exclusions

The API does not generate files, stream downloads, create signed URLs, schedule
exports, retry/cancel/delete export jobs, email files, or expose Admin Dashboard
UI behavior.

## OpenAPI

- `POST /admin/data-exports`
- `GET /admin/data-exports`
- `GET /admin/data-exports/{exportId}`

The OpenAPI response schema keeps file fields nullable because this module stores
request metadata only.
