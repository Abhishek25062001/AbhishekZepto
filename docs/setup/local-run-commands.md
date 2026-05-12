# Local Run Commands

## Purpose

This document records local run commands for the monorepo.

## Root Commands

Root workspace commands:

```bash
npm run dev:backend
npm run dev:vendor
npm run dev:admin
npm run typecheck
npm run lint
npm run format
```

## Backend

Backend commands:

```bash
npm run dev -w backend/api
npm run build -w backend/api
npm run start -w backend/api
npm run typecheck -w backend/api
npm run lint -w backend/api
```

Backend startup requires a reachable `DB_MONGO_URI`.

## Docker Backend Services

Validate the local Compose configuration:

```bash
docker compose config
```

Start MongoDB and the backend API through Docker:

```bash
docker compose up --build
```

Stop Docker services while preserving the local MongoDB volume:

```bash
docker compose down
```

See `docs/setup/docker-backend-services.md` for logs, background startup, volume
cleanup, and smoke-test details.

## Customer App

Customer App commands:

```bash
npm run start -w apps/customer-app
npm run android -w apps/customer-app
npm run ios -w apps/customer-app
npm run typecheck -w apps/customer-app
npm run lint -w apps/customer-app
```

For Metro port selection during local checks, pass the port through the React
Native CLI arguments when needed:

```bash
API_BASE_URL=http://localhost:5000 npm run start -w apps/customer-app -- --port 8081
```

## Delivery Agent App

Delivery Agent App commands:

```bash
npm run start -w apps/delivery-agent-app
npm run android -w apps/delivery-agent-app
npm run ios -w apps/delivery-agent-app
npm run typecheck -w apps/delivery-agent-app
npm run lint -w apps/delivery-agent-app
```

For a second Metro server, use a different port:

```bash
API_BASE_URL=http://localhost:5000 npm run start -w apps/delivery-agent-app -- --port 8082
```

## Vendor Panel

Vendor Panel commands:

```bash
npm run dev -w apps/vendor-panel
npm run build -w apps/vendor-panel
npm run preview -w apps/vendor-panel
npm run typecheck -w apps/vendor-panel
npm run lint -w apps/vendor-panel
```

For local smoke checks, bind Vite to a predictable localhost port:

```bash
VITE_API_BASE_URL=http://localhost:5000 npm run dev -w apps/vendor-panel -- --host 127.0.0.1 --port 5173
```

## Admin Dashboard

Admin Dashboard commands:

```bash
npm run dev -w apps/admin-dashboard
npm run build -w apps/admin-dashboard
npm run preview -w apps/admin-dashboard
npm run typecheck -w apps/admin-dashboard
npm run lint -w apps/admin-dashboard
```

For local smoke checks, bind Vite to a predictable localhost port:

```bash
VITE_API_BASE_URL=http://localhost:5000 npm run dev -w apps/admin-dashboard -- --host 127.0.0.1 --port 5174
```

## Shared Package

Planned shared package commands:

```bash
npm run typecheck -w packages/shared
npm run lint -w packages/shared
```

Root workspace `typecheck` and `lint` currently fail on the pre-existing
`packages/shared` skeleton because it has no TypeScript inputs and no ESLint
flat config. Use workspace-specific checks until the shared package setup is
completed by its owning ticket.
