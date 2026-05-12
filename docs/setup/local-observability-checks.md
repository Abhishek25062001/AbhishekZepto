# Local Observability Checks

## Purpose

Local observability checks verify that the backend health and system-info
endpoints are reachable from the developer machine.

The checks use the existing public endpoints only.

## Configuration

By default, scripts call:

```text
http://localhost:5000
```

Override the backend base URL with:

```bash
API_BASE_URL=http://localhost:5030 npm run check:observability
```

## Commands

Run backend health check:

```bash
npm run check:health
```

Run backend system-info check:

```bash
npm run check:system-info
```

Run combined local observability check:

```bash
npm run check:observability
```

The combined check prints MongoDB status and Redis placeholder status from the
health endpoint response.

## API Endpoints

```text
GET /api/v1/public/health
GET /api/v1/public/system-info
```

## DB Fields

No new database fields are created by this task.
