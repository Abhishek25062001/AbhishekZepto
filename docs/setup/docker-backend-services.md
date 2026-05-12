# Docker Backend Services

## Purpose

This document records the local Docker setup for backend development services in
Module 10 DevOps & Local Development Foundation.

The current Docker setup is local-development only. It does not create
production deployment, CI/CD, monitoring, Kubernetes, secret management, or
hosting configuration.

## Services

The Compose file starts:

| Service | Purpose | Host port |
| --- | --- | ---: |
| `mongodb` | Local MongoDB database required by backend startup. | `27017` |
| `backend-api` | Existing Node.js Express backend API. | `5000` |

Redis remains deferred to its owning module. The current backend does not
connect to Redis during startup.

## Backend Environment

The backend container uses safe local development values:

```text
APP_ENV=development
APP_PORT=5000
APP_VERSION=1.0.0
DB_MONGO_URI=mongodb://mongodb:27017/zepto_like_dev
```

The Docker-network MongoDB host is `mongodb`. From the host machine, MongoDB is
available on:

```text
mongodb://localhost:27017/zepto_like_dev
```

Do not add real secrets to `docker-compose.yml`, Dockerfiles, or committed env
examples.

## Commands

Validate the Compose file:

```bash
docker compose config
```

Start local backend services:

```bash
docker compose up --build
```

Start in the background:

```bash
docker compose up --build -d
```

View logs:

```bash
docker compose logs -f backend-api
docker compose logs -f mongodb
```

Stop services while preserving the MongoDB volume:

```bash
docker compose down
```

Stop services and remove the local MongoDB volume:

```bash
docker compose down -v
```

## Smoke Checks

After the services are running, verify the existing backend endpoints:

```bash
curl http://localhost:5000/api/v1/public/health
curl http://localhost:5000/api/v1/public/version
curl http://localhost:5000/api/v1/public/system-info
curl -X POST http://localhost:5000/api/v1/internal/system/database-write-check
```

Expected result:

- public endpoints return the standard success envelope
- health reports database status as `connected`
- the temporary write check creates or updates the existing `system_checks`
  verification record

## Port Conflicts

If host port `5000` or `27017` is already in use, update the host-side port in
`docker-compose.yml` and record the actual port in the ticket handoff. Keep the
backend container `APP_PORT` at `5000` unless the container port is also changed.

## API Impact

No new API endpoints are added by this Docker setup.

## DB Impact

No new database fields are added. The temporary database write-check endpoint may
write the existing `system_checks` verification document.
