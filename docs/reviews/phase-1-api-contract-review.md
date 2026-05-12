# Phase 1 API Contract Review

## Review Goal

Validate Phase 1 backend route and response contract consistency.

## Route Versioning

All registered backend route groups are mounted under `/api/v1`.

Route surfaces present:

- `public`
- `customer`
- `delivery`
- `vendor`
- `admin`
- `internal`

## Verified Endpoints

- `GET /api/v1/public/health`
- `GET /api/v1/public/version`
- `GET /api/v1/public/system-info`
- `GET /api/v1/public/docs`
- `GET /api/v1/public/openapi.json`
- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `POST /api/v1/internal/system/database-write-check`
- `GET /api/v1/internal/auth/test-protected`

## Response Contract

Success responses contain:

- `success`
- `message`
- `data`
- `meta`

Error responses contain:

- `success`
- `message`
- `error.code`
- `error.details`

Runtime response checks to perform with a running backend:

- Validation failure returns `422`.
- Unauthorized protected route returns `401`.
- Unknown route returns `404`.
- Rate-limited auth request returns `429`.
- Response headers include `x-request-id`.
- Response headers include `x-trace-id`.

## Contract Documents

- `/docs/contracts/backend-route-registry.md` includes all Phase 1 routes.
- `/docs/contracts/api-contract-format.md` matches backend response helpers.
- `/docs/contracts/postman/zepto-like-phase-1.postman_collection.json` is valid
  JSON and includes Phase 1 public and internal test routes.

## API Endpoints

No new API endpoints created in this task.

## DB Fields

No new database fields created in this task.
