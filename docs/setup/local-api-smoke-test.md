# Local API Smoke Test

## Purpose

These commands verify the backend is reachable and that the public foundation
API contract is still intact.

Backend runtime smoke requires MongoDB to be reachable at `DB_MONGO_URI`.
The health endpoint checks backend status, MongoDB connection status, and the
Redis placeholder status.

## Start Backend

Run from the repository root after local env files are configured:

```bash
npm run dev -w backend/api
```

If `5000` is unavailable, set another local port in `backend/api/.env` or the
shell environment and use that port in the curl commands.

For Docker-backed local services, start MongoDB and the backend API with:

```bash
docker compose up --build
```

The Docker backend uses `mongodb://mongodb:27017/zepto_like_dev` inside the
Compose network and is exposed on `http://localhost:5000` from the host.

## Public API Checks

```bash
curl http://localhost:5000/api/v1/public/health
curl http://localhost:5000/api/v1/public/version
curl http://localhost:5000/api/v1/public/system-info
```

## Temporary Internal DB Check

```bash
curl -X POST http://localhost:5000/api/v1/internal/system/database-write-check
```

This internal endpoint is temporary Phase 1 verification plumbing. It must be
protected or removed before production launch.

## API Endpoints

- `GET /api/v1/public/health`
- `GET /api/v1/public/version`
- `GET /api/v1/public/system-info`
- `POST /api/v1/internal/system/database-write-check`

## DB Fields

No new database fields are created by this documentation. The temporary
database write check may touch:

- `key`
- `value`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`
