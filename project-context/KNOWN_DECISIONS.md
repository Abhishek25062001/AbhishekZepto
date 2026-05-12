# Known Decisions

## Architecture

- Phase 1 uses a modular monolith backend.
- Frontend surfaces remain separate apps.
- MongoDB is the Phase 1 primary database.
- Redis is Redis-ready infrastructure, not yet implemented.
- The backend is the source of truth for business-critical state.

## Repository

- The project uses a monorepo under `ZeptoProject`.
- Workspaces include backend API, four apps, and shared package.
- `packages/shared` should receive stable shared types/constants only when needed.

## Backend

- Backend uses Node.js, Express, TypeScript, MongoDB, and Mongoose.
- API routes are versioned under `/api/v1`.
- Routes are grouped by public, customer, delivery, vendor, admin, internal, and future webhooks.
- API responses use a standard success/error envelope.
- Validation uses Zod.
- Logging uses Pino/Pino HTTP.
- Error logging uses structured backend payloads with safe client responses.
- Request tracing uses request and trace IDs propagated through headers and error metadata.
- Security Foundation uses Helmet, CORS, request sanitization, rate limiting,
  secret checks, frontend secret checks, and non-blocking audit write hooks.
- Security headers use Helmet.
- Environment validation is done at startup.

## Deferred

- Microservices are deferred.
- Kafka is deferred.
- Kubernetes is deferred.
- Elasticsearch/Meilisearch is deferred.
- H3 dispatch optimization is deferred.
- Advanced dispatch algorithms are deferred.
- PostgreSQL double-entry ledger is deferred.
- Advanced monitoring, remote crash reporting, and production secret manager are deferred.

## Current Verified Backend Endpoints

```text
GET /api/v1/public/health
GET /api/v1/public/version
GET /api/v1/public/system-info
POST /api/v1/internal/system/database-write-check
POST /api/v1/public/auth/request-otp
POST /api/v1/public/auth/verify-otp
POST /api/v1/public/auth/refresh-token
POST /api/v1/public/auth/logout
GET /api/v1/internal/auth/test-protected
```

## Current Known Local Issue

Port `5000` was already in use during Backend Core Foundation smoke testing. Port `5010` was used successfully for verification.

Mongo-backed runtime smoke tests passed against the approved safe MongoDB Atlas development database. Do not print or commit the real Atlas URI.

React Native Foundation Metro startup was verified for Customer App on port `8081` and Delivery Agent App on port `8082`.

Web Panels Foundation Vite startup was verified for Vendor Panel on port `5173` and Admin Dashboard on port `5174`.

Latest backend live smoke during Module 7 was blocked because MongoDB Atlas rejected the current network connection. Atlas Network Access must allow the current machine/network before backend health smoke can pass again from this environment.

Module 10 DevOps & Local Development Foundation was verified as the next Phase 1 module from `projectin micro/doctwo/PhaesDetail1&2.pdf` pages 189-213. Ticket 1 local development setup and Ticket 2 Docker local setup are complete for currently source-confirmed tickets. Docker runtime smoke is pending on a machine with Docker installed.

Module 11 Logging, Monitoring & Debug Foundation was verified from `projectin micro/doctwo/PhaesDetail1&2.pdf` pages 214-240 and is complete. Local observability scripts require a running backend at `API_BASE_URL`; production monitoring providers remain deferred.

Module 12 Security Foundation was verified from `projectin micro/doctwo/PhaesDetail1&2.pdf` pages 241-272 and is complete. Security header and CORS checks require a running backend; dependency audit commands require npm registry access.

## Needs Verification

- Exact status and names of Phases 2-12 from source PDFs.
- Whether `ZeptoProject` should be initialized as a git repository.
